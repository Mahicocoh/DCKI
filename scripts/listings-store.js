let cachePromise = null;
const ONLY_LISTING_ID = "JU-GLO-009";

function applyListingFilter(listings) {
  const out = Array.isArray(listings) ? listings.filter((l) => l?.id === ONLY_LISTING_ID) : [];
  return out;
}

function hasMeaningfulValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim() !== "";
  return value !== undefined && value !== null;
}

function mergeListingWithFallback(canonical, current) {
  const base = { ...canonical };
  for (const [key, value] of Object.entries(current || {})) {
    if (hasMeaningfulValue(value)) {
      base[key] = value;
    }
  }
  return base;
}

async function applyCanonicalOverride(listings) {
  const list = Array.isArray(listings) ? listings : [];
  const mod = await import("./listings-data.js");
  const seed = Array.isArray(mod?.LISTINGS) ? mod.LISTINGS : [];
  const canonicalRaw = seed.find((l) => String(l?.id || "").trim() === ONLY_LISTING_ID);
  if (!canonicalRaw) return list;
  const canonical = normalizeListing(canonicalRaw);
  const current = list.find((l) => l?.id === ONLY_LISTING_ID);
  // Keep local seed data only as a fallback; non-empty admin/API values must stay authoritative.
  return [current ? mergeListingWithFallback(canonical, current) : canonical].filter(Boolean);
}

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
  if (out.id === ONLY_LISTING_ID) out.featured = true;
  return out;
}

function isAutoListing(l) {
  const id = String(l?.id || "");
  return id.includes("-AUTO-");
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
      const normalized = applyListingFilter(data.map(normalizeListing).filter(Boolean).filter((l) => !isAutoListing(l)));
      if (!normalized.length) throw new Error("empty_api");
      return await applyCanonicalOverride(normalized);
    } catch {
      try {
        const data = await tryFetch("data/listings.json");
        if (!Array.isArray(data)) throw new Error("Format de données invalide.");
        const normalized = applyListingFilter(data.map(normalizeListing).filter(Boolean).filter((l) => !isAutoListing(l)));
        if (!normalized.length) throw new Error("empty_data");
        return await applyCanonicalOverride(normalized);
      } catch {
        const mod = await import("./listings-data.js");
        const data = Array.isArray(mod?.LISTINGS) ? mod.LISTINGS : [];
        const normalized = applyListingFilter(data.map(normalizeListing).filter(Boolean).filter((l) => !isAutoListing(l)));
        if (!normalized.length) throw new Error("empty_seed");
        return await applyCanonicalOverride(normalized);
      }
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
