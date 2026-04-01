import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";

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
  const filePath = safeJoin(__dirname, req.url || "/");
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
      return;
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
