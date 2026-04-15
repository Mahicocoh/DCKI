import crypto from "node:crypto";
import { put } from "@vercel/blob";
import { json, readBody } from "../_lib/http.js";
import { isAuthed } from "../_lib/auth.js";
import { parseMultipart, parseContentDisposition, sanitizeFilename } from "../_lib/multipart.js";

export default async function handler(req, res) {
  if (!isAuthed(req)) {
    json(res, 401, { ok: false, error: "Unauthorized" });
    return;
  }

  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  const ct = String(req.headers["content-type"] || "");
  const m = /boundary=([^;]+)/i.exec(ct);
  if (!m) {
    json(res, 400, { ok: false, error: "Content-Type invalide." });
    return;
  }

  const raw = await readBody(req);
  if (raw.length > 4.2 * 1024 * 1024) {
    json(res, 413, { ok: false, error: "Fichier trop volumineux (limite Vercel ~4.5MB)." });
    return;
  }

  const parts = parseMultipart(raw, m[1]);
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

  const out = [];
  for (const f of files) {
    const safe = sanitizeFilename(f.filename);
    const ext = safe.includes(".") ? safe.split(".").pop().toLowerCase() : "";
    const allowed = new Set(["png", "jpg", "jpeg", "webp"]);
    const ok = allowed.has(ext) || ["image/png", "image/jpeg", "image/webp"].includes(f.contentType);
    if (!ok) {
      json(res, 400, { ok: false, error: "Format non supporté (png/jpg/webp)." });
      return;
    }
    const rnd = crypto.randomBytes(4).toString("hex");
    const pathname = `uploads/${Date.now()}_${rnd}_${safe}`;
    const blob = await put(pathname, f.data, { access: "public", addRandomSuffix: true, contentType: f.contentType || undefined });
    out.push({ url: blob.url, pathname: blob.pathname, contentType: blob.contentType, size: f.data.length });
  }

  json(res, 200, { ok: true, files: out });
}

