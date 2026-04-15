import { getListings } from "./_lib/store.js";
import { json } from "./_lib/http.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    json(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const listings = await getListings();
    json(res, 200, { ok: true, listings });
  } catch (e) {
    json(res, 500, { ok: false, error: e?.message || "Erreur serveur." });
  }
}

