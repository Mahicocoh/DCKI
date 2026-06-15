import { json } from "../../server/http.js";
import { clearSessionCookie } from "../../server/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }
  const cookie = clearSessionCookie();
  json(res, 200, { ok: true }, { "Set-Cookie": cookie });
}
