let cachePromise = null;

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
      return data;
    } catch {
      const data = await tryFetch("/data/listings.json");
      if (!Array.isArray(data)) throw new Error("Format de données invalide.");
      return data;
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
