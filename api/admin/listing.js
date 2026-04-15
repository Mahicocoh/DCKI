import { json, readBody } from "../_lib/http.js";
import { isAuthed } from "../_lib/auth.js";
import { updateListing, deleteListing } from "../_lib/store.js";

export default async function handler(req, res) {
  if (!isAuthed(req)) {
    json(res, 401, { ok: false, error: "Unauthorized" });
    return;
  }

  const url = new URL(req.url, "http://localhost");
  const id = String(url.searchParams.get("id") || "");
  if (!id) {
    json(res, 400, { ok: false, error: "id manquant." });
    return;
  }

  if (req.method === "DELETE") {
    try {
      const result = await deleteListing(id);
      if (!result.ok) {
        json(res, result.status || 400, { ok: false, error: result.error });
        return;
      }
      json(res, 200, { ok: true, listing: result.listing });
    } catch (e) {
      json(res, 500, { ok: false, error: e?.message || "Erreur serveur." });
    }
    return;
  }

  if (req.method === "PUT") {
    let payload = {};
    try {
      const raw = await readBody(req);
      payload = JSON.parse(raw.toString("utf8") || "{}");
    } catch {
      json(res, 400, { ok: false, error: "JSON invalide." });
      return;
    }

    try {
      const result = await updateListing(id, payload);
      if (!result.ok) {
        json(res, result.status || 400, { ok: false, error: result.error });
        return;
      }
      json(res, 200, { ok: true, listing: result.listing });
    } catch (e) {
      json(res, 500, { ok: false, error: e?.message || "Erreur serveur." });
    }
    return;
  }

  json(res, 405, { ok: false, error: "Method not allowed" });
}

