import { LISTINGS, getListingSearchText, normalizeForSearch, getListingFeatures, getAllTags } from "./listings-data.js";
import { renderListings } from "./listings-ui.js";
import { getQueryParams, initAutocomplete } from "./ui.js";

function getSelectedCategories(form) {
  const cat = form.cat?.value;
  if (cat === "sale") return ["sale"];
  if (cat === "rent") return ["rent"];
  return ["sale", "rent"];
}

function toNumber(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const cleaned = s.replace(",", ".").replace(/[^\d.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function toInt(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const cleaned = s.replace(/[^\d]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function getQueryTokens(q) {
  const s = normalizeForSearch(q || "");
  return s.split(/\s+/).map((t) => t.trim()).filter(Boolean);
}

function matchesFilters(listing, f) {
  if (f.categories.length && !f.categories.includes(listing.category)) return false;
  if (f.region && normalizeForSearch(listing.region) !== normalizeForSearch(f.region)) return false;
  if (f.propertyType && normalizeForSearch(listing.propertyType) !== normalizeForSearch(f.propertyType)) return false;
  if (f.locality && normalizeForSearch(listing.locality) !== normalizeForSearch(f.locality)) return false;
  if (f.minPrice != null && listing.price < f.minPrice) return false;
  if (f.maxPrice != null && listing.price > f.maxPrice) return false;
  if (f.minRooms != null && listing.rooms < f.minRooms) return false;
  if (f.minSurface != null && listing.surface < f.minSurface) return false;
  if (f.tags && f.tags.length) {
    const features = new Set([...(listing.tags || []), ...getListingFeatures(listing)]);
    for (const t of f.tags) if (!features.has(t)) return false;
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

function hydrateLocalities(region) {
  const el = document.querySelector("[data-locality]");
  if (!el) return;
  const base = LISTINGS.filter((l) => !region || l.region === region).map((l) => l.locality);
  const unique = [...new Set(base)].sort((a, b) => a.localeCompare(b, "fr"));
  el.innerHTML = `<option value="">Toutes</option>` + unique.map((v) => `<option value="${escapeAttr(v)}">${escapeHtml(v)}</option>`).join("");
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(s) {
  return escapeHtml(s).replaceAll("\n", " ");
}

export function initRecherche() {
  const form = document.querySelector("[data-search-form]");
  const grid = document.querySelector("[data-results]");
  const count = document.querySelector("[data-count]");
  const empty = document.querySelector("[data-empty]");
  const maxPriceQuick = form?.querySelector("select[name='maxPriceQuick']");

  if (!form || !grid) return;

  initAutocomplete("search-q", "search-autocomplete");

  const qp = getQueryParams();

  const tagsHost = document.querySelector("#filters-modal [data-tags-list]");
  if (tagsHost) {
    const tags = getAllTags();
    tagsHost.innerHTML = tags
      .map((t) => `<label class="filter-chip"><input type="checkbox" name="tags" value="${t}"><span>${t}</span></label>`)
      .join("");
  }

  const setIf = (name, value) => {
    const el = form.querySelector(`[name='${name}']`);
    if (!el || value == null || value === "") return;
    if (el.type === "checkbox") el.checked = value === "1" || value === "true";
    else el.value = value;
  };

  setIf("region", qp.region ?? "");
  hydrateLocalities(form.querySelector("[name='region']")?.value || "");
  setIf("locality", qp.locality ?? "");
  setIf("propertyType", qp.type ?? "");
  setIf("minPrice", qp.minPrice ?? "");
  setIf("maxPrice", qp.maxPrice ?? "");
  setIf("maxPriceQuick", qp.maxPrice ?? "");
  setIf("minRooms", qp.minRooms ?? "");
  setIf("minSurface", qp.minSurface ?? "");
  setIf("q", qp.q ?? "");
  setIf("sort", qp.sort ?? "");
  if (qp.tags) {
    const wanted = String(qp.tags)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const cb of form.querySelectorAll("input[name='tags']")) {
      cb.checked = wanted.includes(cb.value);
    }
  }

  const update = () => {
    const filters = {
      categories: getSelectedCategories(form),
      region: form.region?.value || "",
      locality: form.locality?.value || "",
      propertyType: form.propertyType?.value || "",
      minPrice: toInt(form.minPrice?.value),
      maxPrice: toInt(form.maxPrice?.value || maxPriceQuick?.value),
      minRooms: toNumber(form.minRooms?.value),
      minSurface: toInt(form.minSurface?.value),
      tags: Array.from(form.querySelectorAll("input[name='tags']:checked")).map((i) => i.value),
      q: (form.q?.value || "").trim(),
      sort: form.sort?.value || "",
    };

    const filtered = LISTINGS.filter((l) => matchesFilters(l, filters));
    const sorted = sortListings(filtered, filters.sort);
    renderListings(grid, sorted);
    if (count) {
      count.textContent = sorted.length > 0 ? `Afficher ${sorted.length} objet${sorted.length > 1 ? "s" : ""}` : "Aucun résultat";
    }
    if (empty) empty.style.display = sorted.length ? "none" : "";
  };

  const root = form.closest(".is24-search") || document;
  const tabs = root.querySelectorAll("[data-search-tab]");
  const catInput = form.querySelector("input[name='cat']");
  const setPriceOptions = (mode) => {
    if (!maxPriceQuick) return;
    const opts = [];
    opts.push({ v: "", t: "indiff." });
    if (mode === "rent") {
      const values = [500, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 7000, 10000];
      for (const v of values) opts.push({ v: String(v), t: v.toLocaleString("fr-CH") + " CHF" });
    } else {
      const values = [100000, 200000, 300000, 400000, 500000, 700000, 900000, 1000000, 1500000, 2000000];
      for (const v of values) opts.push({ v: String(v), t: v >= 1000000 ? (v/1000000) + " Mio CHF" : v.toLocaleString("fr-CH") + " CHF" });
    }
    maxPriceQuick.innerHTML = opts.map(o => `<option value="${o.v}">${o.t}</option>`).join("");
  };
  
  const setTab = (mode) => {
    if (!catInput) return;
    catInput.value = mode;
    tabs.forEach((t) => {
      t.classList.toggle("active", t.getAttribute("data-search-tab") === mode);
    });
    setPriceOptions(mode);
    update();
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setTab(tab.getAttribute("data-search-tab"));
    });
  });

  if (qp.sale === "1") setTab("sale");
  else if (qp.rent === "1") setTab("rent");
  else setTab("rent");

  const openFiltersBtn = form.querySelector("[data-open-filters]");
  const modal = document.getElementById("filters-modal");

  if (openFiltersBtn && modal) {
    openFiltersBtn.addEventListener("click", () => {
      modal.classList.add("show");
    });
  }
  if (modal) {
    const closers = modal.querySelectorAll("[data-close-filters]");
    closers.forEach((el) => {
      el.addEventListener("click", () => {
        modal.classList.remove("show");
        update();
      });
    });
  }

  form.addEventListener("input", (e) => {
    const t = e.target;
    if (t && t.name === "region") {
      hydrateLocalities(form.region?.value || "");
      if (form.locality) form.locality.value = "";
    }
    update();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (modal?.classList.contains("show")) {
      modal.classList.remove("show");
    }

    const p = new URLSearchParams();

    const cat = catInput?.value || "rent";
    if (cat === "sale") p.set("sale", "1");
    if (cat === "rent") p.set("rent", "1");

    const set = (k, v) => {
      const s = String(v || "").trim();
      if (s) p.set(k, s);
    };

    set("cat", catInput ? catInput.value : "rent");
    set("region", form.region?.value);
    set("locality", form.locality?.value);
    set("type", form.propertyType?.value);
    set("minPrice", form.minPrice?.value);
    set("maxPrice", form.maxPrice?.value || maxPriceQuick?.value);
    set("minRooms", form.minRooms?.value);
    set("minSurface", form.minSurface?.value);
    const tags = Array.from(form.querySelectorAll("input[name='tags']:checked")).map((i) => i.value);
    if (tags.length) p.set("tags", tags.join(","));
    set("q", form.q?.value);
    set("sort", form.sort?.value);

    window.location.href = `./biens.html?${p.toString()}`;
  });

  update();
}
