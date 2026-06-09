import { json } from "../_lib/http.js";
import { isAuthed, isAdminConfigured } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    json(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  json(res, 200, {
    ok: true,
    configured: isAdminConfigured(),
    authed: isAuthed(req),
  });
}
