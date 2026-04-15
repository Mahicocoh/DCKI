import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { exec } from "node:child_process";
import crypto from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_PORT = Number(process.env.PORT || 4174);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
};

function safeJoin(root, requestPath) {
  const p = decodeURIComponent(requestPath).split("?")[0].split("#")[0];
  const clean = p.replaceAll("\\", "/");
  const target = clean === "/" ? "/index.html" : clean;
  const resolved = path.resolve(root, "." + target);
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function parseMultipart(body, boundary) {
  const boundaryBuf = Buffer.from(`--${boundary}`);
  const endBoundaryBuf = Buffer.from(`--${boundary}--`);
  const parts = [];

  let pos = body.indexOf(boundaryBuf);
  if (pos === -1) return parts;

  while (pos !== -1) {
    pos += boundaryBuf.length;
    if (body.slice(pos, pos + 2).toString("utf8") === "--") break;
    if (body.slice(pos, pos + 2).toString("utf8") === "\r\n") pos += 2;

    const headerEnd = body.indexOf(Buffer.from("\r\n\r\n"), pos);
    if (headerEnd === -1) break;
    const headersText = body.slice(pos, headerEnd).toString("utf8");
    const dataStart = headerEnd + 4;

    let next = body.indexOf(boundaryBuf, dataStart);
    let isEnd = false;
    if (next === -1) {
      next = body.indexOf(endBoundaryBuf, dataStart);
      isEnd = next !== -1;
    }
    if (next === -1) break;

    const dataEnd = body.slice(next - 2, next).toString("utf8") === "\r\n" ? next - 2 : next;
    const data = body.slice(dataStart, dataEnd);

    const headers = {};
    for (const line of headersText.split("\r\n")) {
      const i = line.indexOf(":");
      if (i === -1) continue;
      const k = line.slice(0, i).trim().toLowerCase();
      const v = line.slice(i + 1).trim();
      headers[k] = v;
    }

    parts.push({ headers, data });
    pos = isEnd ? -1 : next;
  }

  return parts;
}

function parseContentDisposition(value) {
  const s = String(value || "");
  const name = /name="([^"]*)"/.exec(s)?.[1] || "";
  const filename = /filename="([^"]*)"/.exec(s)?.[1] || "";
  return { name, filename };
}

function sanitizeFilename(name) {
  const base = String(name || "").split(/[\\/]/).pop() || "upload";
  const cleaned = base.replace(/[^\w.\-]+/g, "_").replace(/_+/g, "_").slice(0, 80);
  return cleaned || "upload";
}

function parseCookies(req) {
  const header = String(req.headers.cookie || "");
  const out = {};
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (!k) continue;
    out[k] = v;
  }
  return out;
}

function json(res, status, data, headers = {}) {
  const body = Buffer.from(JSON.stringify(data, null, 2));
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": body.length,
    ...headers,
  });
  res.end(body);
}

function text(res, status, data, headers = {}) {
  const body = Buffer.from(String(data || ""), "utf8");
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": body.length,
    ...headers,
  });
  res.end(body);
}

function timingSafeEq(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function getAdminCredentials() {
  const user = process.env.DCKI_ADMIN_USER || process.env.ADMIN_USER || "admin";
  const pass = process.env.DCKI_ADMIN_PASS || process.env.ADMIN_PASS || "admin";
  return { user, pass };
}

const sessions = new Map();
const SESSION_COOKIE = "dcki_admin";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function newToken() {
  return crypto.randomBytes(24).toString("base64url");
}

function isAuthed(req) {
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE] || "";
  if (!token) return false;
  const exp = sessions.get(token);
  if (!exp) return false;
  if (Date.now() > exp) {
    sessions.delete(token);
    return false;
  }
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  return true;
}

function requireAuth(req, res) {
  if (isAuthed(req)) return true;
  text(res, 401, "Unauthorized");
  return false;
}

const DATA_DIR = path.join(__dirname, "data");
const LISTINGS_FILE = path.join(DATA_DIR, "listings.json");
const UPLOADS_DIR = path.join(__dirname, "assets", "uploads");

async function loadSeedListings() {
  const mod = await import(pathToFileURL(path.join(__dirname, "scripts", "listings-data.js")).href);
  const all = Array.isArray(mod.LISTINGS) ? mod.LISTINGS : [];
  return all.filter((l) => l && typeof l.id === "string" && !l.id.includes("-AUTO-"));
}

async function ensureListingsFile() {
  await fs.promises.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.promises.stat(LISTINGS_FILE);
    return;
  } catch {
  }
  const seed = await loadSeedListings();
  await fs.promises.writeFile(LISTINGS_FILE, JSON.stringify(seed, null, 2), "utf8");
}

async function readListings() {
  await ensureListingsFile();
  const raw = await fs.promises.readFile(LISTINGS_FILE, "utf8");
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
}

async function writeListings(listings) {
  await ensureListingsFile();
  await fs.promises.writeFile(LISTINGS_FILE, JSON.stringify(listings, null, 2), "utf8");
}

function normalizeListingPayload(payload) {
  const out = {};
  out.id = String(payload?.id || "").trim();
  out.category = payload?.category === "sale" ? "sale" : "rent";
  out.status = payload?.status === "sold" ? "sold" : payload?.status === "rented" ? "rented" : "";
  out.propertyType = String(payload?.propertyType || "").trim();
  out.title = String(payload?.title || "").trim();
  out.description = String(payload?.description || "").trim();
  out.region = String(payload?.region || "").trim();
  out.locality = String(payload?.locality || "").trim();
  out.rooms = Number(payload?.rooms);
  out.surface = Number(payload?.surface);
  out.price = Number(payload?.price);
  out.priceSuffix = String(payload?.priceSuffix || "").trim();
  out.tags = Array.isArray(payload?.tags) ? payload.tags.map((t) => String(t).trim()).filter(Boolean) : [];
  out.image = String(payload?.image || "").trim();
  out.gallery = Array.isArray(payload?.gallery) ? payload.gallery.map((u) => String(u).trim()).filter(Boolean) : [];
  return out;
}

function validateListing(listing) {
  if (!listing.id) return "Référence (id) requise.";
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{1,64}$/.test(listing.id)) return "Référence invalide (ex: JU-DEL-001).";
  if (!listing.propertyType) return "Type requis.";
  if (!listing.title) return "Titre requis.";
  if (!listing.region) return "Région requise.";
  if (!listing.locality) return "Localité requise.";
  if (!Number.isFinite(listing.rooms)) return "Pièces invalide.";
  if (!Number.isFinite(listing.surface)) return "Surface invalide.";
  if (!Number.isFinite(listing.price)) return "Prix invalide.";
  if (!listing.image) return "Image principale requise (URL).";
  return "";
}

function openInBrowser(url) {
  if (process.env.DCKIMMO_NOOPEN === "1") return;
  const cmd =
    process.platform === "win32"
      ? `cmd /c start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd, { windowsHide: true });
}

function createServer() {
  return http.createServer((req, res) => {
    const url = req.url || "/";
    const p = decodeURIComponent(url).split("?")[0].split("#")[0];

    if (p === "/api/admin/login" && req.method === "POST") {
      (async () => {
        const raw = await readBody(req);
        let body = {};
        try {
          body = JSON.parse(raw.toString("utf8") || "{}");
        } catch {
          json(res, 400, { ok: false, error: "JSON invalide." });
          return;
        }

        const { user, pass } = getAdminCredentials();
        const u = String(body.user || "");
        const pw = String(body.password || "");
        const ok = timingSafeEq(u, user) && timingSafeEq(pw, pass);
        if (!ok) {
          json(res, 401, { ok: false, error: "Identifiants invalides." });
          return;
        }

        const token = newToken();
        sessions.set(token, Date.now() + SESSION_TTL_MS);
        const cookie = `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax`;
        json(res, 200, { ok: true }, { "Set-Cookie": cookie });
      })().catch((err) => {
        json(res, 500, { ok: false, error: err?.message || "Erreur serveur." });
      });
      return;
    }

    if (p === "/api/admin/logout" && req.method === "POST") {
      const cookies = parseCookies(req);
      const token = cookies[SESSION_COOKIE] || "";
      if (token) sessions.delete(token);
      const cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
      json(res, 200, { ok: true }, { "Set-Cookie": cookie });
      return;
    }

    if (p === "/api/admin/listings" && req.method === "GET") {
      if (!requireAuth(req, res)) return;
      (async () => {
        const listings = await readListings();
        json(res, 200, { ok: true, listings });
      })().catch((err) => json(res, 500, { ok: false, error: err?.message || "Erreur serveur." }));
      return;
    }

    if (p === "/api/admin/listings" && req.method === "POST") {
      if (!requireAuth(req, res)) return;
      (async () => {
        const raw = await readBody(req);
        const payload = JSON.parse(raw.toString("utf8") || "{}");
        const listing = normalizeListingPayload(payload);
        const errMsg = validateListing(listing);
        if (errMsg) {
          json(res, 400, { ok: false, error: errMsg });
          return;
        }
        const listings = await readListings();
        if (listings.some((l) => l.id === listing.id)) {
          json(res, 409, { ok: false, error: "Référence déjà existante." });
          return;
        }
        listings.unshift(listing);
        await writeListings(listings);
        json(res, 200, { ok: true, listing });
      })().catch((err) => json(res, 500, { ok: false, error: err?.message || "Erreur serveur." }));
      return;
    }

    if (p === "/api/admin/listing" && (req.method === "PUT" || req.method === "DELETE")) {
      if (!requireAuth(req, res)) return;
      (async () => {
        const u = new URL(url, "http://localhost");
        const id = String(u.searchParams.get("id") || "");
        if (!id) {
          json(res, 400, { ok: false, error: "id manquant." });
          return;
        }
        const listings = await readListings();
        const idx = listings.findIndex((l) => l.id === id);
        if (idx === -1) {
          json(res, 404, { ok: false, error: "Bien introuvable." });
          return;
        }
        if (req.method === "DELETE") {
          const removed = listings.splice(idx, 1)[0];
          await writeListings(listings);
          json(res, 200, { ok: true, listing: removed });
          return;
        }
        const raw = await readBody(req);
        const payload = JSON.parse(raw.toString("utf8") || "{}");
        const listing = normalizeListingPayload({ ...payload, id });
        const errMsg = validateListing(listing);
        if (errMsg) {
          json(res, 400, { ok: false, error: errMsg });
          return;
        }
        listings[idx] = listing;
        await writeListings(listings);
        json(res, 200, { ok: true, listing });
      })().catch((err) => json(res, 500, { ok: false, error: err?.message || "Erreur serveur." }));
      return;
    }

    if (p.startsWith("/api/admin/listings/") && (req.method === "PUT" || req.method === "DELETE")) {
      if (!requireAuth(req, res)) return;
      (async () => {
        const id = decodeURIComponent(p.slice("/api/admin/listings/".length));
        const listings = await readListings();
        const idx = listings.findIndex((l) => l.id === id);
        if (idx === -1) {
          json(res, 404, { ok: false, error: "Bien introuvable." });
          return;
        }

        if (req.method === "DELETE") {
          const removed = listings.splice(idx, 1)[0];
          await writeListings(listings);
          json(res, 200, { ok: true, listing: removed });
          return;
        }

        const raw = await readBody(req);
        const payload = JSON.parse(raw.toString("utf8") || "{}");
        const listing = normalizeListingPayload({ ...payload, id });
        const errMsg = validateListing(listing);
        if (errMsg) {
          json(res, 400, { ok: false, error: errMsg });
          return;
        }
        listings[idx] = listing;
        await writeListings(listings);
        json(res, 200, { ok: true, listing });
      })().catch((err) => json(res, 500, { ok: false, error: err?.message || "Erreur serveur." }));
      return;
    }

    if (p === "/api/admin/upload" && req.method === "POST") {
      if (!requireAuth(req, res)) return;
      (async () => {
        const ct = String(req.headers["content-type"] || "");
        const m = /boundary=([^;]+)/i.exec(ct);
        if (!m) {
          json(res, 400, { ok: false, error: "Content-Type invalide." });
          return;
        }
        const boundary = m[1];
        const raw = await readBody(req);
        if (raw.length > 20 * 1024 * 1024) {
          json(res, 413, { ok: false, error: "Fichier trop volumineux." });
          return;
        }

        const parts = parseMultipart(raw, boundary);
        const files = [];
        for (const part of parts) {
          const cd = part.headers["content-disposition"] || "";
          const { filename } = parseContentDisposition(cd);
          if (!filename) continue;
          const contentType = String(part.headers["content-type"] || "").toLowerCase();
          files.push({ filename, contentType, data: part.data });
        }

        if (!files.length) {
          json(res, 400, { ok: false, error: "Aucun fichier." });
          return;
        }

        await fs.promises.mkdir(UPLOADS_DIR, { recursive: true });

        const out = [];
        for (const f of files) {
          const safe = sanitizeFilename(f.filename);
          let ext = path.extname(safe).toLowerCase();
          const allowed = new Set([".png", ".jpg", ".jpeg", ".webp"]);
          if (!allowed.has(ext)) {
            const byType = {
              "image/png": ".png",
              "image/jpeg": ".jpg",
              "image/jpg": ".jpg",
              "image/webp": ".webp",
            };
            ext = byType[f.contentType] || ext;
          }
          if (!allowed.has(ext)) {
            json(res, 400, { ok: false, error: "Format non supporté (png/jpg/webp)." });
            return;
          }
          const stamp = `${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
          const base = safe.replace(/\.[^/.]+$/, "");
          const name = `${stamp}_${base}${ext}`;
          const filePath = path.join(UPLOADS_DIR, name);
          await fs.promises.writeFile(filePath, f.data);
          out.push({ url: `/assets/uploads/${encodeURIComponent(name)}`, filename: safe, size: f.data.length, contentType: f.contentType });
        }

        json(res, 200, { ok: true, files: out });
      })().catch((err) => json(res, 500, { ok: false, error: err?.message || "Erreur serveur." }));
      return;
    }

    if (p.startsWith("/admin") && !p.startsWith("/admin/login")) {
      if (!isAuthed(req)) {
        res.writeHead(302, { Location: `/admin/login.html?next=${encodeURIComponent(p)}` });
        res.end();
        return;
      }
    }

    if (p === "/data/listings.json" && req.method === "GET") {
      ensureListingsFile().then(() => {
        const filePath = safeJoin(__dirname, url);
        if (!filePath) {
          res.writeHead(400);
          res.end("Bad request");
          return;
        }
        fs.stat(filePath, (err, st) => {
          if (err || !st.isFile()) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Not found");
            return;
          }
          res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            "Content-Length": st.size,
          });
          fs.createReadStream(filePath).pipe(res);
        });
      }).catch((err) => json(res, 500, { ok: false, error: err?.message || "Erreur serveur." }));
      return;
    }

    const filePath = safeJoin(__dirname, url);
    if (!filePath) {
      res.writeHead(400);
      res.end("Bad request");
      return;
    }

    fs.stat(filePath, (err, st) => {
      if (err || !st.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME[ext] || "application/octet-stream";
      const range = req.headers.range;

      if (range) {
        const m = /^bytes=(\d+)-(\d+)?$/.exec(range);
        if (!m) {
          res.writeHead(416, {
            "Content-Range": `bytes */${st.size}`,
            "Cache-Control": "no-store",
          });
          res.end();
          return;
        }

        const start = Number(m[1]);
        const end = m[2] ? Number(m[2]) : st.size - 1;
        if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= st.size) {
          res.writeHead(416, {
            "Content-Range": `bytes */${st.size}`,
            "Cache-Control": "no-store",
          });
          res.end();
          return;
        }

        res.writeHead(206, {
          "Content-Type": contentType,
          "Cache-Control": "no-store",
          "Accept-Ranges": "bytes",
          "Content-Range": `bytes ${start}-${end}/${st.size}`,
          "Content-Length": end - start + 1,
        });
        fs.createReadStream(filePath, { start, end }).pipe(res);
        return;
      }

      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
        "Content-Length": st.size,
        "Accept-Ranges": "bytes",
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });
}

async function startServer() {
  let port = DEFAULT_PORT;
  for (let i = 0; i < 50; i += 1) {
    const server = createServer();
    try {
      await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, "0.0.0.0", () => {
          server.removeListener("error", reject);
          resolve();
        });
      });
      const actualPort = server.address()?.port ?? port;
      const url = `http://localhost:${actualPort}`;
      console.log(`DCKImmo: ${url}`);
      openInBrowser(url);
      globalThis.__DCKI_SERVER__ = server;
      await new Promise(() => {});
    } catch (err) {
      try {
        server.close();
      } catch {
      }
      if (err && err.code === "EADDRINUSE") {
        port += 1;
        continue;
      }
      throw err;
    }
  }
  console.log("DCKImmo: Impossible de démarrer le serveur (aucun port libre trouvé).");
}

startServer();
