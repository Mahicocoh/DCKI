export function parseMultipart(body, boundary) {
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

export function parseContentDisposition(value) {
  const s = String(value || "");
  const name = /name="([^"]*)"/.exec(s)?.[1] || "";
  const filename = /filename="([^"]*)"/.exec(s)?.[1] || "";
  return { name, filename };
}

export function sanitizeFilename(name) {
  const base = String(name || "").split(/[\\/]/).pop() || "upload";
  const cleaned = base.replace(/[^\w.\-]+/g, "_").replace(/_+/g, "_").slice(0, 80);
  return cleaned || "upload";
}

