import { getListingSearchText, normalizeForSearch, getListingFeatures } from "./listings-data.js";
import { renderListings } from "./listings-ui.js";
import { loadListings } from "./listings-store.js?v=202606120001";

let rerenderBound = false;
let last = {
  saleGrid: null,
  rentGrid: null,
  saleCount: null,
  rentCount: null,
  count: null,
  saleItems: [],
  rentItems: [],
};

function toNumber(v) {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function getQueryTokens(q) {
  const s = normalizeForSearch(q || "");
  return s.split(/\s+/).map((t) => t.trim()).filter(Boolean);
}

function matches(listing, f) {
  if (f.categories.length && !f.categories.includes(listing.category)) return false;
  if (f.region && normalizeForSearch(listing.region) !== normalizeForSearch(f.region)) return false;
  if (f.locality && normalizeForSearch(listing.locality) !== normalizeForSearch(f.locality)) return false;
  if (f.propertyType && normalizeForSearch(listing.propertyType) !== normalizeForSearch(f.propertyType)) return false;
  if (f.minPrice != null && listing.price < f.minPrice) return false;
  if (f.maxPrice != null && listing.price > f.maxPrice) return false;
  if (f.minRooms != null && listing.rooms < f.minRooms) return false;
  if (f.maxRooms != null && listing.rooms > f.maxRooms) return false;
  if (f.minSurface != null && listing.surface < f.minSurface) return false;
  if (f.maxSurface != null && listing.surface > f.maxSurface) return false;
  if (f.tags && f.tags.length) {
    const features = new Set([...(listing.tags || []), ...getListingFeatures(listing)]);
    for (const t of f.tags) if (!features.has(t)) return false;
  }
  if (f.nearStation) {
    const hay = getListingSearchText(listing);
    if (!hay.includes("gare") && !hay.includes("train") && !hay.includes("station")) return false;
  }
  if (f.nearSchool) {
    const hay = getListingSearchText(listing);
    if (!hay.includes("ecole") && !hay.includes("school")) return false;
  }
  if (f.nearHighway) {
    const hay = getListingSearchText(listing);
    if (!hay.includes("autoroute") && !hay.includes("a16") && !hay.includes("highway")) return false;
  }
  if (f.q) {
    const tokens = getQueryTokens(f.q);
    if (tokens.length) {
      const hay = getListingSearchText(listing);
      for (const t of tokens) if (!hay.includes(t)) return false;
    }
  }
  return true;
}

function sortListings(list, mode) {
  const out = [...list];
  switch (mode) {
    case "price_asc":
      out.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      out.sort((a, b) => b.price - a.price);
      break;
    case "surface_desc":
      out.sort((a, b) => b.surface - a.surface);
      break;
    case "rooms_desc":
      out.sort((a, b) => b.rooms - a.rooms);
      break;
    default:
      out.sort((a, b) => a.id.localeCompare(b.id));
  }
  return out;
}

export async function initBiens() {
  const count = document.querySelector("[data-biens-count]");
  const saleGrid = document.querySelector("[data-biens-sale-grid]");
  const rentGrid = document.querySelector("[data-biens-rent-grid]");
  const saleCount = document.querySelector("[data-biens-sale-count]");
  const rentCount = document.querySelector("[data-biens-rent-count]");
  const saleSection = document.querySelector("#vendre");
  const rentSection = document.querySelector("#louer");

  if (!saleGrid || !rentGrid) return;

  const saleBackup = saleGrid.innerHTML;
  const rentBackup = rentGrid.innerHTML;

  let LISTINGS = [];
  try {
    LISTINGS = await loadListings();
  } catch {
    LISTINGS = [];
  }
  if (!Array.isArray(LISTINGS) || !LISTINGS.length) {
    const saleExisting = saleGrid.querySelectorAll("article.card.listing").length;
    const rentExisting = rentGrid.querySelectorAll("article.card.listing").length;
    if (saleCount) saleCount.textContent = `${saleExisting} bien${saleExisting > 1 ? "s" : ""}`;
    if (rentCount) rentCount.textContent = `${rentExisting} bien${rentExisting > 1 ? "s" : ""}`;
    if (count) count.textContent = `${saleExisting + rentExisting} bien${saleExisting + rentExisting > 1 ? "s" : ""}`;
    return;
  }

  const qp = new URLSearchParams(window.location.search);
  const categories = [];
  
  // ImmoScout24 style search uses "cat=rent" or "cat=sale"
  const cat = qp.get("cat");
  if (cat === "sale") categories.push("sale");
  else if (cat === "rent") categories.push("rent");
  // fallback for old search logic
  else {
    if (qp.get("sale") === "1") categories.push("sale");
    if (qp.get("rent") === "1") categories.push("rent");
    if (!categories.length) categories.push("sale", "rent");
  }

  const filters = {
    categories,
    region: (qp.get("region") || "").trim(),
    locality: (qp.get("locality") || "").trim(),
    propertyType: (qp.get("type") || "").trim(),
    minPrice: toNumber(qp.get("minPrice")),
    maxPrice: toNumber(qp.get("maxPrice")),
    minRooms: toNumber(qp.get("minRooms")),
    maxRooms: toNumber(qp.get("maxRooms")),
    minSurface: toNumber(qp.get("minSurface")),
    maxSurface: toNumber(qp.get("maxSurface")),
    tags: (qp.get("tags") || "").split(",").map((s) => s.trim()).filter(Boolean),
    q: (qp.get("q") || "").trim(),
    sort: qp.get("sort") || "",
    nearStation: qp.get("nearStation") === "1",
    nearSchool: qp.get("nearSchool") === "1",
    nearHighway: qp.get("nearHighway") === "1",
  };

  const filtered = LISTINGS.filter((l) => matches(l, filters));
  const sorted = sortListings(filtered, filters.sort);
  const saleItems = sorted.filter((l) => l.category === "sale");
  const rentItems = sorted.filter((l) => l.category === "rent");

  if (!saleItems.length && !rentItems.length) {
    saleGrid.innerHTML = saleBackup;
    rentGrid.innerHTML = rentBackup;
    const saleExisting = saleGrid.querySelectorAll("article.card.listing").length;
    const rentExisting = rentGrid.querySelectorAll("article.card.listing").length;
    if (saleCount) saleCount.textContent = `${saleExisting} bien${saleExisting > 1 ? "s" : ""}`;
    if (rentCount) rentCount.textContent = `${rentExisting} bien${rentExisting > 1 ? "s" : ""}`;
    if (count) count.textContent = `${saleExisting + rentExisting} bien${saleExisting + rentExisting > 1 ? "s" : ""}`;
    return;
  }

  renderListings(saleGrid, saleItems);
  renderListings(rentGrid, rentItems);

  if (saleCount) saleCount.textContent = `${saleItems.length} bien${saleItems.length > 1 ? "s" : ""}`;
  if (rentCount) rentCount.textContent = `${rentItems.length} bien${rentItems.length > 1 ? "s" : ""}`;
  if (count) count.textContent = `${saleItems.length + rentItems.length} bien${saleItems.length + rentItems.length > 1 ? "s" : ""}`;

  if (saleSection) saleSection.style.display = categories.includes("sale") ? "" : "none";
  if (rentSection) rentSection.style.display = categories.includes("rent") ? "" : "none";

  last = { saleGrid, rentGrid, saleCount, rentCount, count, saleItems, rentItems };
  if (!rerenderBound) {
    rerenderBound = true;
    window.addEventListener("dcki:lang", () => {
      if (!last.saleGrid || !last.rentGrid) return;
      renderListings(last.saleGrid, last.saleItems);
      renderListings(last.rentGrid, last.rentItems);
    });
  }
}
