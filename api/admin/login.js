import { json, readBody } from "../../server/http.js";
import { isAdminConfigured, isValidLogin, makeSessionCookie } from "../../server/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  if (!isAdminConfigured()) {
    json(res, 500, { ok: false, error: "Admin non configuré." });
    return;
  }

  let body = {};
  try {
    const raw = await readBody(req);
    body = JSON.parse(raw.toString("utf8") || "{}");
  } catch {
    json(res, 400, { ok: false, error: "JSON invalide." });
    return;
  }

  const user = String(body.user || "");
  const password = String(body.password || "");
  if (!isValidLogin(user, password)) {
    json(res, 401, { ok: false, error: "Identifiants invalides." });
    return;
  }

  try {
    const cookie = makeSessionCookie();
    json(res, 200, { ok: true }, { "Set-Cookie": cookie });
  } catch (e) {
    json(res, 500, { ok: false, error: e?.message || "Erreur serveur." });
  }
}
