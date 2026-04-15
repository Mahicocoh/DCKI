let cachePromise = null;

export async function loadListings() {
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    const res = await fetch("/data/listings.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Impossible de charger les biens.");
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Format de données invalide.");
    return data;
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

