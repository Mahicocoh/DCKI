import { getListingSearchText, normalizeForSearch, getListingFeatures, getAllTags } from "./listings-data.js";
import { renderListings } from "./listings-ui.js";
import { getQueryParams, initAutocomplete, smartSearchToFilters } from "./ui.js?v=202606130002";
import { loadListings } from "./listings-store.js?v=202606120001";
import { getLang, t } from "./i18n.js?v=202606120001";

let langBound = false;

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

function hydrateLocalities(listings, region) {
  const el = document.querySelector("[data-locality]");
  if (!el) return;
  const base = listings.filter((l) => !region || l.region === region).map((l) => l.locality);
  const unique = [...new Set(base)].sort((a, b) => a.localeCompare(b, "fr"));
  el.innerHTML =
    `<option value="">${escapeHtml(t("search.region.all"))}</option>` +
    unique.map((v) => `<option value="${escapeAttr(v)}">${escapeHtml(v)}</option>`).join("");
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

export async function initRecherche() {
  const form = document.querySelector("[data-search-form]");
  const grid = document.querySelector("[data-results]");
  const count = document.querySelector("[data-count]");
  const empty = document.querySelector("[data-empty]");
  const minPriceSel = form?.querySelector("select[name='minPrice']");
  const maxPriceSel = form?.querySelector("select[name='maxPrice']");
  const minRoomsSel = form?.querySelector("select[name='minRooms']");
  const maxRoomsSel = form?.querySelector("select[name='maxRooms']");
  const minSurfaceSel = form?.querySelector("select[name='minSurface']");
  const maxSurfaceSel = form?.querySelector("select[name='maxSurface']");

  if (!form || !grid) return;

  const LISTINGS = await loadListings();

  initAutocomplete("search-q", "search-autocomplete");

  const qp = getQueryParams();

  const tagsHost = document.querySelector("#filters-modal [data-tags-list]");
  if (tagsHost) {
    const tags = getAllTags();
    const translateTag = (raw) => {
      const v = String(raw || "").trim();
      if (v === "Cheminée") return t("tag.fireplace");
      if (v === "Jardin") return t("tag.garden");
      if (v === "Terrasse") return t("tag.terrace");
      if (v === "Balcon") return t("tag.balcony");
      if (v === "Garage") return t("tag.garage");
      if (v === "Ascenseur") return t("tag.elevator");
      if (v === "Calme") return t("tag.quiet");
      if (v === "Rénové") return t("tag.renovated");
      if (v === "Neuf") return t("tag.new");
      if (v === "Proche gare") return t("tag.nearStation");
      return v;
    };
    tagsHost.innerHTML = tags
      .map((v) => `<label class="filter-chip"><input type="checkbox" name="tags" value="${escapeAttr(v)}"><span>${escapeHtml(translateTag(v))}</span></label>`)
      .join("");
  }

  const setIf = (name, value) => {
    const el = form.querySelector(`[name='${name}']`);
    if (!el || value == null || value === "") return;
    if (el.type === "checkbox") el.checked = value === "1" || value === "true";
    else el.value = (name === "minRooms" || name === "maxRooms") ? String(value).replace(",", ".") : value;
  };

  setIf("region", qp.region ?? "");
  hydrateLocalities(LISTINGS, form.querySelector("[name='region']")?.value || "");
  setIf("locality", qp.locality ?? "");
  setIf("propertyType", qp.type ?? "");
  setIf("minPrice", qp.minPrice ?? "");
  setIf("maxPrice", qp.maxPrice ?? "");
  setIf("minRooms", qp.minRooms ?? "");
  setIf("maxRooms", qp.maxRooms ?? "");
  setIf("minSurface", qp.minSurface ?? "");
  setIf("maxSurface", qp.maxSurface ?? "");
  setIf("nearStation", qp.nearStation ?? "");
  setIf("nearSchool", qp.nearSchool ?? "");
  setIf("nearHighway", qp.nearHighway ?? "");
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
      maxPrice: toInt(form.maxPrice?.value),
      minRooms: toNumber(form.minRooms?.value),
      maxRooms: toNumber(form.maxRooms?.value),
      minSurface: toInt(form.minSurface?.value),
      maxSurface: toInt(form.maxSurface?.value),
      tags: Array.from(form.querySelectorAll("input[name='tags']:checked")).map((i) => i.value),
      nearStation: Boolean(form.nearStation?.checked),
      nearSchool: Boolean(form.nearSchool?.checked),
      nearHighway: Boolean(form.nearHighway?.checked),
      q: (form.q?.value || "").trim(),
      sort: form.sort?.value || "",
    };

    const filtered = LISTINGS.filter((l) => matchesFilters(l, filters));
    const sorted = sortListings(filtered, filters.sort);
    renderListings(grid, sorted);
    if (count) {
      const plural = sorted.length > 1 ? "s" : "";
      count.textContent = sorted.length > 0 ? t("search.showCount", { n: sorted.length, plural }) : t("search.none");
    }
    if (empty) empty.style.display = sorted.length ? "none" : "";
  };

  const root = form.closest(".is24-search") || document;
  const tabs = root.querySelectorAll("[data-search-tab]");
  const catInput = form.querySelector("input[name='cat']");
  const formatCHF = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "’");
  const fmtRooms = (v) => String(v).replace(".", ",");
  const fillSelect = (el, values, labeler) => {
    if (!(el instanceof HTMLSelectElement)) return;
    const keep = el.value;
    const opts = [{ v: "", t: t("search.any") }].concat(values.map((v) => ({ v: String(v), t: labeler(v) })));
    el.innerHTML = opts.map((o) => `<option value="${escapeAttr(o.v)}">${escapeHtml(o.t)}</option>`).join("");
    if (keep && opts.some((o) => o.v === keep)) el.value = keep;
  };
  const range = (from, to, step) => {
    const out = [];
    for (let v = from; v <= to; v += step) out.push(v);
    return out;
  };
  const getPriceValues = (mode) => {
    if (mode === "rent") return range(500, 5000, 250);
    if (mode === "sale") {
      const a = range(50000, 500000, 50000);
      const b = range(600000, 1000000, 100000);
      const c = range(1250000, 3000000, 250000);
      return [...a, ...b, ...c];
    }
    const all = [...range(500, 5000, 250), ...range(50000, 500000, 50000), ...range(600000, 1000000, 100000), ...range(1250000, 3000000, 250000)];
    return [...new Set(all)].sort((x, y) => x - y);
  };
  const getRoomsValues = () => {
    const out = [];
    for (let v = 1; v <= 8.001; v += 0.5) out.push(Number(v.toFixed(1)));
    return out;
  };
  const getSurfaceValues = () => range(25, 300, 25);
  const setSelectRanges = (mode) => {
    fillSelect(minPriceSel, getPriceValues(mode), (v) => `${formatCHF(v)} CHF`);
    fillSelect(maxPriceSel, getPriceValues(mode), (v) => `${formatCHF(v)} CHF`);
    fillSelect(maxRoomsSel, getRoomsValues(), (v) => fmtRooms(v));
    fillSelect(minSurfaceSel, getSurfaceValues(), (v) => `${v} m²`);
    fillSelect(maxSurfaceSel, getSurfaceValues(), (v) => `${v} m²`);
  };
  const ensureMinMax = (minEl, maxEl, coerce) => {
    if (!(minEl instanceof HTMLSelectElement) || !(maxEl instanceof HTMLSelectElement)) return;
    const a = coerce(minEl.value);
    const b = coerce(maxEl.value);
    if (a == null || b == null) return;
    if (a <= b) return;
    maxEl.value = minEl.value;
  };
  const numOrNull = (v) => {
    const n = toNumber(v);
    return n == null ? null : n;
  };
  const intOrNull = (v) => {
    const n = toInt(v);
    return n == null ? null : n;
  };
  if (minPriceSel instanceof HTMLSelectElement && maxPriceSel instanceof HTMLSelectElement) {
    minPriceSel.addEventListener("change", () => ensureMinMax(minPriceSel, maxPriceSel, intOrNull));
    maxPriceSel.addEventListener("change", () => ensureMinMax(minPriceSel, maxPriceSel, intOrNull));
  }
  if (minRoomsSel instanceof HTMLSelectElement && maxRoomsSel instanceof HTMLSelectElement) {
    minRoomsSel.addEventListener("change", () => ensureMinMax(minRoomsSel, maxRoomsSel, numOrNull));
    maxRoomsSel.addEventListener("change", () => ensureMinMax(minRoomsSel, maxRoomsSel, numOrNull));
  }
  if (minSurfaceSel instanceof HTMLSelectElement && maxSurfaceSel instanceof HTMLSelectElement) {
    minSurfaceSel.addEventListener("change", () => ensureMinMax(minSurfaceSel, maxSurfaceSel, intOrNull));
    maxSurfaceSel.addEventListener("change", () => ensureMinMax(minSurfaceSel, maxSurfaceSel, intOrNull));
  }
  
  const setTab = (mode) => {
    if (!catInput) return;
    catInput.value = mode;
    tabs.forEach((t) => {
      t.classList.toggle("active", t.getAttribute("data-search-tab") === mode);
    });
    setSelectRanges(mode);
    update();
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setTab(tab.getAttribute("data-search-tab"));
    });
  });

  if (!langBound) {
    langBound = true;
    window.addEventListener("dcki:lang", () => {
      const mode = (catInput && catInput.value) || "rent";
      setSelectRanges(mode);
      update();
    });
  }

  if (qp.sale === "1") setTab("sale");
  else if (qp.rent === "1") setTab("rent");
  else setTab("rent");

  setIf("minPrice", qp.minPrice ?? "");
  setIf("maxPrice", qp.maxPrice ?? "");
  setIf("minRooms", qp.minRooms ?? "");
  setIf("maxRooms", qp.maxRooms ?? "");
  setIf("minSurface", qp.minSurface ?? "");
  setIf("maxSurface", qp.maxSurface ?? "");
  update();

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
      hydrateLocalities(LISTINGS, form.region?.value || "");
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

    let cat = catInput?.value || "rent";
    const smartRaw = (form.q?.value || "").trim();
    const smartToggle = form.querySelector("[data-smart-toggle]");
    const smartEnabled = smartToggle instanceof HTMLInputElement ? smartToggle.checked : false;
    const smart = smartEnabled && smartRaw ? smartSearchToFilters(smartRaw) : null;
    const smartHas =
      smartEnabled &&
      (Boolean(smart?.cat || smart?.region || smart?.locality || smart?.propertyType) ||
        smart?.maxPrice != null ||
        smart?.minRooms != null ||
        smart?.minSurface != null ||
        Boolean(smart?.nearStation || smart?.nearSchool || smart?.nearHighway) ||
        Boolean(Array.isArray(smart?.tags) && smart.tags.length));
    if (smartHas && smart?.cat) cat = smart.cat;
    if (cat === "sale") p.set("sale", "1");
    if (cat === "rent") p.set("rent", "1");

    const set = (k, v) => {
      const s = String(v || "").trim();
      if (s) p.set(k, s);
    };

    set("cat", cat);
    set("region", (smartHas && smart?.region) || form.region?.value);
    set("locality", (smartHas && smart?.locality) || form.locality?.value);
    set("type", (smartHas && smart?.propertyType) || form.propertyType?.value);
    set("minPrice", form.minPrice?.value);
    set("maxPrice", (smartHas && smart?.maxPrice != null ? smart.maxPrice : null) || form.maxPrice?.value);
    set("minRooms", (smartHas && smart?.minRooms != null ? smart.minRooms : null) || form.minRooms?.value);
    set("maxRooms", form.maxRooms?.value);
    set("minSurface", (smartHas && smart?.minSurface != null ? smart.minSurface : null) || form.minSurface?.value);
    set("maxSurface", form.maxSurface?.value);

    const nearStation = Boolean(form.nearStation?.checked) || Boolean(smartHas && smart?.nearStation);
    const nearSchool = Boolean(form.nearSchool?.checked) || Boolean(smartHas && smart?.nearSchool);
    const nearHighway = Boolean(form.nearHighway?.checked) || Boolean(smartHas && smart?.nearHighway);
    if (nearStation) p.set("nearStation", "1");
    if (nearSchool) p.set("nearSchool", "1");
    if (nearHighway) p.set("nearHighway", "1");

    const pickedTags = Array.from(form.querySelectorAll("input[name='tags']:checked")).map((i) => i.value);
    const mergedTags = [...new Set([...(pickedTags || []), ...((smartHas && smart?.tags) || [])])].filter(Boolean);
    if (mergedTags.length) p.set("tags", mergedTags.join(","));

    if (!smartHas) set("q", form.q?.value);
    set("sort", form.sort?.value);

    window.location.href = `./biens.html?${p.toString()}`;
  });

  update();
}
