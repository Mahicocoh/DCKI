let cachePromise = null;

function norm(s) {
  return String(s ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeCategory(raw, priceSuffix) {
  const s = norm(raw);
  if (s === "sale" || s === "sell" || s === "vente" || s.includes("a vendre") || s.includes("vendre") || s.includes("vend")) return "sale";
  if (s === "rent" || s === "rental" || s === "location" || s.includes("a louer") || s.includes("louer") || s.includes("locat")) return "rent";

  const suf = norm(priceSuffix);
  if (suf.includes("mois") || suf.includes("month")) return "rent";
  return "sale";
}

function normalizeListing(l) {
  if (!l || typeof l !== "object") return null;
  const out = { ...l };
  out.id = String(out.id ?? "").trim();
  out.category = normalizeCategory(out.category, out.priceSuffix);
  return out;
}

export async function loadListings() {
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    const tryFetch = async (url) => {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("fetch_failed");
      const json = await res.json();
      return json;
    };

    try {
      const payload = await tryFetch("/api/listings");
      const data = Array.isArray(payload?.listings) ? payload.listings : payload;
      if (!Array.isArray(data)) throw new Error("Format de données invalide.");
      return data.map(normalizeListing).filter(Boolean);
    } catch {
      const data = await tryFetch("/data/listings.json");
      if (!Array.isArray(data)) throw new Error("Format de données invalide.");
      return data.map(normalizeListing).filter(Boolean);
    }
  })();

  try {
    return await cachePromise;
  } catch (e) {
    cachePromise = null;
    throw e;
  }
}

export function clearListingsCache() {
  cachePromise = null;
}
