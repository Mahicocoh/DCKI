import { kv } from "@vercel/kv";

const KEY = "dcki:listings";

function hasOwn(obj, key) {
  return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
}

function normalizeListingPayload(payload, prev) {
  const out = {};
  out.id = String(payload?.id || "").trim();
  out.category = payload?.category === "sale" ? "sale" : "rent";
  out.status = payload?.status === "sold" ? "sold" : payload?.status === "rented" ? "rented" : "";
  out.propertyType = String(payload?.propertyType || "").trim();
  out.title = String(payload?.title || "").trim();
  out.description = String(payload?.description || "").trim();
  out.title_en = hasOwn(payload, "title_en") ? String(payload?.title_en || "").trim() : String(prev?.title_en || "").trim();
  out.description_en = hasOwn(payload, "description_en")
    ? String(payload?.description_en || "").trim()
    : String(prev?.description_en || "").trim();
  out.region = String(payload?.region || "").trim();
  out.locality = String(payload?.locality || "").trim();
  out.rooms = Number(payload?.rooms);
  out.surface = Number(payload?.surface);
  out.price = Number(payload?.price);
  out.priceSuffix = String(payload?.priceSuffix || "").trim();
  out.tags = Array.isArray(payload?.tags) ? payload.tags.map((t) => String(t).trim()).filter(Boolean) : [];
  out.image = String(payload?.image || "").trim();
  out.gallery = Array.isArray(payload?.gallery) ? payload.gallery.map((u) => String(u).trim()).filter(Boolean) : [];
  return out;
}

function validateListing(listing) {
  if (!listing.id) return "Référence (id) requise.";
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{1,64}$/.test(listing.id)) return "Référence invalide (ex: JU-DEL-001).";
  if (!listing.propertyType) return "Type requis.";
  if (!listing.title) return "Titre requis.";
  if (!listing.region) return "Région requise.";
  if (!listing.locality) return "Localité requise.";
  if (!Number.isFinite(listing.rooms)) return "Pièces invalide.";
  if (!Number.isFinite(listing.surface)) return "Surface invalide.";
  if (!Number.isFinite(listing.price)) return "Prix invalide.";
  if (!listing.image) return "Image principale requise (URL).";
  return "";
}

async function loadSeedListings() {
  const modUrl = new URL("../../scripts/listings-data.js", import.meta.url);
  const mod = await import(modUrl.href);
  const all = Array.isArray(mod.LISTINGS) ? mod.LISTINGS : [];
  return all.filter((l) => l && typeof l.id === "string" && !String(l.id).includes("-AUTO-"));
}

export async function getListings() {
  const existing = await kv.get(KEY);
  if (Array.isArray(existing) && existing.length) {
    const seed = await loadSeedListings();
    const seedById = new Map(seed.map((l) => [l.id, l]));
    let changed = false;
    const merged = existing.map((l) => {
      const s = seedById.get(l?.id);
      if (!s) return l;
      const next = { ...l };
      if (!next.title_en && s.title_en) {
        next.title_en = s.title_en;
        changed = true;
      }
      if (!next.description_en && s.description_en) {
        next.description_en = s.description_en;
        changed = true;
      }
      return next;
    });
    if (changed) await kv.set(KEY, merged);
    return merged;
  }
  const seed = await loadSeedListings();
  await kv.set(KEY, seed);
  return seed;
}

export async function setListings(listings) {
  await kv.set(KEY, listings);
}

export async function createListing(payload) {
  const listing = normalizeListingPayload(payload, null);
  const err = validateListing(listing);
  if (err) return { ok: false, error: err };
  const listings = await getListings();
  if (listings.some((l) => l.id === listing.id)) return { ok: false, error: "Référence déjà existante.", status: 409 };
  const next = [listing, ...listings];
  await setListings(next);
  return { ok: true, listing };
}

export async function updateListing(id, payload) {
  const listings = await getListings();
  const idx = listings.findIndex((l) => l.id === id);
  if (idx === -1) return { ok: false, error: "Bien introuvable.", status: 404 };
  const prev = listings[idx];
  const listing = normalizeListingPayload({ ...payload, id }, prev);
  const err = validateListing(listing);
  if (err) return { ok: false, error: err };
  const next = listings.slice();
  next[idx] = listing;
  await setListings(next);
  return { ok: true, listing };
}

export async function deleteListing(id) {
  const listings = await getListings();
  const idx = listings.findIndex((l) => l.id === id);
  if (idx === -1) return { ok: false, error: "Bien introuvable.", status: 404 };
  const next = listings.slice();
  const removed = next.splice(idx, 1)[0];
  await setListings(next);
  return { ok: true, listing: removed };
}

