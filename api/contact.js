import crypto from "node:crypto";
import { put } from "@vercel/blob";
import { json, readBody } from "../server/http.js";
import { parseMultipart, parseContentDisposition, sanitizeFilename } from "../server/multipart.js";

function getBoundary(contentType) {
  const ct = String(contentType || "");
  const m = /boundary=([^;]+)/i.exec(ct);
  const raw = (m?.[1] || "").trim();
  if (!raw) return "";
  return raw.startsWith("\"") && raw.endsWith("\"") ? raw.slice(1, -1) : raw;
}

function asText(buf) {
  return Buffer.isBuffer(buf) ? buf.toString("utf8").trim() : String(buf || "").trim();
}

function validEmail(s) {
  const v = String(s || "").trim();
  if (!v) return false;
  if (v.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendWithResend({ apiKey, from, to, replyTo, subject, html, text }) {
  const payload = {
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
  };
  if (replyTo) payload.reply_to = replyTo;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) return;
  let extra = "";
  try {
    const j = await res.json();
    extra = j?.message ? ` (${j.message})` : "";
  } catch {}
  throw new Error(`Resend HTTP ${res.status}${extra}`);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  const raw = await readBody(req);
  if (raw.length > 4.2 * 1024 * 1024) {
    json(res, 413, { ok: false, error: "Message/fichiers trop volumineux (limite Vercel ~4.5MB)." });
    return;
  }

  const fields = new Map();
  const files = [];

  const ctRaw = req.headers["content-type"];
  const contentType = Array.isArray(ctRaw) ? String(ctRaw[0] || "") : String(ctRaw || "");
  const boundary = getBoundary(contentType);

  if (boundary) {
    const parts = parseMultipart(raw, boundary);
    for (const part of parts) {
      const cd = part.headers["content-disposition"] || "";
      const { name, filename } = parseContentDisposition(cd);
      if (!name) continue;

      if (filename) {
        const partType = String(part.headers["content-type"] || "").toLowerCase();
        files.push({ field: name, filename, contentType: partType, data: part.data });
        continue;
      }

      fields.set(name, asText(part.data));
    }
  } else if (/application\/x-www-form-urlencoded/i.test(contentType)) {
    const params = new URLSearchParams(raw.toString("utf8"));
    for (const [k, v] of params.entries()) fields.set(k, String(v || "").trim());
  } else if (/application\/json/i.test(contentType)) {
    let obj = null;
    try {
      obj = JSON.parse(raw.toString("utf8") || "{}");
    } catch {
      json(res, 400, { ok: false, error: "JSON invalide." });
      return;
    }
    if (obj && typeof obj === "object") {
      for (const [k, v] of Object.entries(obj)) fields.set(k, String(v ?? "").trim());
    }
  } else {
    json(res, 400, { ok: false, error: "Content-Type invalide." });
    return;
  }

  const senderName = fields.get("name") || "";
  const senderEmail = fields.get("email") || "";
  const message = fields.get("message") || "";

  if (!senderName || !message || !validEmail(senderEmail)) {
    json(res, 400, { ok: false, error: "Champs requis manquants ou email invalide." });
    return;
  }

  const resendKey = process.env.RESEND_API_KEY || "";
  if (!resendKey) {
    json(res, 500, { ok: false, error: "Configuration email manquante (RESEND_API_KEY)." });
    return;
  }

  const to = process.env.CONTACT_TO || "contact@dckimmo.ch";
  const from = process.env.CONTACT_FROM || "onboarding@resend.dev";

  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0]?.trim();
  const ua = String(req.headers["user-agent"] || "").slice(0, 220);
  const ref = String(req.headers["referer"] || "");

  const label = fields.get("form_label") || "Formulaire";
  const requestType = fields.get("request_type") || fields.get("type") || "";
  const phone = fields.get("phone") || "";
  const appointmentDate = fields.get("appointment_date") || "";
  const appointmentTime = fields.get("appointment_time") || "";
  const reference = fields.get("ref") || fields.get("listing_ref") || "";

  const uploadLinks = [];
  if (files.length) {
    for (const f of files) {
      const safe = sanitizeFilename(f.filename);
      const ext = safe.includes(".") ? safe.split(".").pop().toLowerCase() : "";
      const allowed = new Set(["png", "jpg", "jpeg", "webp", "pdf"]);
      const ok = allowed.has(ext) || ["image/png", "image/jpeg", "image/webp", "application/pdf"].includes(f.contentType);
      if (!ok) continue;
      if (!f.data?.length) continue;

      try {
        const rnd = crypto.randomBytes(4).toString("hex");
        const pathname = `contact/${Date.now()}_${rnd}_${safe}`;
        const blob = await put(pathname, f.data, {
          access: "public",
          addRandomSuffix: true,
          contentType: f.contentType || undefined,
        });
        uploadLinks.push(blob.url);
      } catch {}
    }
  }

  const subjectBits = [label];
  if (requestType) subjectBits.push(requestType);
  if (reference) subjectBits.push(reference);
  const subject = `[DCKImmo] ${subjectBits.join(" — ")}`;

  const rows = [
    ["Nom", senderName],
    ["Email", senderEmail],
    ["Téléphone", phone],
    ["Type", requestType],
    ["Référence", reference],
    ["Date", appointmentDate],
    ["Heure", appointmentTime],
    ["Page", ref],
    ["IP", forwarded],
    ["UA", ua],
  ].filter(([, v]) => String(v || "").trim());

  const html = `
    <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 12px">${escapeHtml(subject)}</h2>
      <table style="border-collapse:collapse;margin:0 0 14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 10px 4px 0;color:#444;white-space:nowrap;vertical-align:top"><strong>${escapeHtml(k)}</strong></td><td style="padding:4px 0;vertical-align:top">${escapeHtml(v)}</td></tr>`
          )
          .join("")}
      </table>
      <h3 style="margin:0 0 8px">Message</h3>
      <pre style="white-space:pre-wrap;margin:0 0 14px;padding:12px;background:#f6f7f9;border-radius:10px">${escapeHtml(message)}</pre>
      ${
        uploadLinks.length
          ? `<h3 style="margin:0 0 8px">Fichiers</h3><ul style="margin:0 0 14px;padding-left:18px">${uploadLinks
              .map((u) => `<li><a href="${escapeHtml(u)}">${escapeHtml(u)}</a></li>`)
              .join("")}</ul>`
          : ""
      }
    </div>
  `.trim();

  const text = `${subject}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${message}\n${
    uploadLinks.length ? `\nFichiers:\n${uploadLinks.join("\n")}\n` : ""
  }`;

  try {
    await sendWithResend({
      apiKey: resendKey,
      from,
      to,
      replyTo: senderEmail,
      subject,
      html,
      text,
    });
  } catch (e) {
    json(res, 500, { ok: false, error: e?.message || "Erreur envoi email." });
    return;
  }

  json(res, 200, { ok: true });
}
