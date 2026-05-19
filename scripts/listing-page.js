import { getListingFacts, getListingPhotos } from "./listings-data.js";
import { formatCHF, formatRooms, showToast, getQueryParams, isFavorite } from "./ui.js?v=202606130002";
import { loadListings } from "./listings-store.js?v=202606120001";
import { pickListingText, t, translatePropertyType, translateRegionName } from "./i18n.js?v=202606120001";

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const state = {
  photos: [],
  index: 0,
};

let currentListing = null;

function hashString(input) {
  const str = String(input ?? "");
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededPick(rnd, arr) {
  if (!arr || !arr.length) return "";
  return arr[Math.floor(rnd() * arr.length)];
}

function seededShuffle(rnd, arr) {
  const out = Array.isArray(arr) ? arr.slice() : [];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function clampInt(n, min, max) {
  const v = Math.floor(Number(n));
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
}

function tagHtml(label) {
  return `<span class="tag">${escapeHtml(label)}</span>`;
}

function normalizeCharacteristics(listing, facts, statusLabel, typeText) {
  const raw = listing?.characteristics;
  const rows =
    Array.isArray(raw)
      ? raw
          .map((it) => {
            if (!it) return null;
            if (Array.isArray(it) && it.length >= 2) {
              const k = String(it[0] ?? "").trim();
              const v = String(it[1] ?? "").trim();
              if (!k || !v) return null;
              return { k, v };
            }
            if (typeof it === "object") {
              const k = String(it.k ?? it.key ?? it.label ?? "").trim();
              const v = String(it.v ?? it.value ?? "").trim();
              if (!k || !v) return null;
              return { k, v };
            }
            return null;
          })
          .filter(Boolean)
      : raw && typeof raw === "object"
        ? Object.entries(raw)
            .map(([k, v]) => ({ k: String(k).trim(), v: String(v ?? "").trim() }))
            .filter((r) => r.k && r.v)
        : [];

  if (rows.length) return rows;

  const rnd = mulberry32(hashString(`${listing.id}:details`));
  const DASH = "—";
  const getYearMatch = (re) => {
    const d = pickListingText(listing, "description") || "";
    const m = String(d).match(re);
    return m ? String(m[1] || "").trim() : "";
  };
  const getHeatingMatch = () => {
    const d = (pickListingText(listing, "description") || "").toLowerCase();
    if (d.includes("pompe a chaleur") || d.includes("pompe à chaleur")) return "Pompe à chaleur";
    if (d.includes("mazout")) return "Mazout";
    if (d.includes("gaz")) return "Gaz";
    if (d.includes("pellet")) return "Pellets";
    if (d.includes("electrique") || d.includes("électrique")) return "Électrique";
    return "";
  };

  const ref = String(listing.reference || listing.id || "").trim() || DASH;
  const availabilityText =
    String(listing.availability || "").trim() ||
    (facts.availableFrom ? t("listing.availableFrom", { date: facts.availableFrom }) : "") ||
    (listing.category === "rent" ? "Immédiatement" : "") ||
    statusLabel ||
    DASH;

  const sanitaire =
    typeof listing.bathrooms === "number"
      ? String(listing.bathrooms)
      : typeof facts.bathrooms === "number"
        ? String(facts.bathrooms)
        : String(clampInt(1 + rnd() * 2, 1, 2));

  const builtYear =
    typeof listing.builtYear === "number"
      ? String(listing.builtYear)
      : getYearMatch(/construit(?:e)?\s+en\s+(19\d{2}|20\d{2})/i) ||
        String(listing.propertyType?.toLowerCase?.().includes("neuf") ? 2022 + Math.floor(rnd() * 4) : 1910 + Math.floor(rnd() * 110));

  const renovatedYear =
    typeof listing.renovatedYear === "number"
      ? String(listing.renovatedYear)
      : getYearMatch(/r[ée]nov[ée]e?\s+en\s+(19\d{2}|20\d{2})/i) ||
        String(Math.min(2026, Number(builtYear) + 10 + Math.floor(rnd() * 30)));

  const rooms = formatRooms(listing.rooms) || DASH;
  const bedrooms =
    typeof listing.bedrooms === "number"
      ? String(listing.bedrooms)
      : rooms !== DASH
        ? String(Math.max(1, Math.round(Number(listing.rooms) - 2)))
        : String(clampInt(1 + rnd() * 3, 1, 4));

  const floorText =
    String(listing.floorText || "").trim() ||
    (typeof listing.floor === "number" ? `${String(listing.floor)}er étage` : "") ||
    (typeof facts.floor === "number" ? `${String(facts.floor)}er étage` : "") ||
    (listing.propertyType?.toLowerCase?.().includes("appart") ? `${String(clampInt(1 + rnd() * 4, 1, 5))}er étage` : DASH);

  const floorsTotal =
    typeof listing.floorsTotal === "number"
      ? String(listing.floorsTotal)
      : listing.propertyType?.toLowerCase?.().includes("appart")
        ? String(clampInt(2 + rnd() * 6, 2, 8))
        : DASH;

  const heatingType =
    String(listing.heatingType || "").trim() ||
    getHeatingMatch() ||
    seededPick(rnd, ["Pompe à chaleur", "Mazout", "Gaz", "Pellets", "Électrique"]);
  const heatingInstallation = String(listing.heatingInstallation || "").trim() || seededPick(rnd, ["Radiateurs", "Chauffage au sol"]);
  const hotWater = String(listing.hotWater || "").trim() || seededPick(rnd, ["Électrique", "Gaz", "Solaire"]);

  const surfaceLiving =
    typeof listing.surfaceLiving === "number"
      ? `~ ${String(listing.surfaceLiving)} m²`
      : typeof listing.surface === "number"
        ? `~ ${String(listing.surface)} m²`
        : `${clampInt(35 + rnd() * 140, 30, 200)} m²`;

  const wc = typeof listing.wc === "number" ? String(listing.wc) : String(clampInt(1 + rnd() * 2, 1, 3));
  const parkingText =
    String(listing.parkingText || "").trim() ||
    (facts.parking ? "Disponible" : "") ||
    seededPick(rnd, ["Disponible", "Pas disponible", "En sus"]);
  const chargesText =
    String(listing.chargesText || "").trim() ||
    (listing.category === "rent" ? `CHF ${clampInt(120 + rnd() * 260, 120, 420)}.-/mois (Comprises)` : DASH);

  return [
    { k: "Référence", v: ref },
    { k: "Disponibilité", v: availabilityText },
    { k: "Sanitaire", v: sanitaire },
    { k: "Année de construction", v: builtYear },
    { k: "Dernières rénovations", v: renovatedYear },
    { k: "Pièces", v: rooms },
    { k: "Chambre", v: bedrooms },
    { k: "Étage", v: floorText },
    { k: "Nombre d'étage(s) total", v: floorsTotal },
    { k: "Type de chauffage", v: heatingType },
    { k: "Installation chauffage", v: heatingInstallation },
    { k: "Eau chaude sanitaire", v: hotWater },
    { k: "Surface habitable", v: surfaceLiving },
    { k: "Nombre de WC", v: wc },
    { k: "Places de parc", v: parkingText },
    { k: "Charges", v: chargesText },
  ];
}

function kvTableHtml(rows) {
  return rows
    .map((r) => {
      const k = String(r.k || "").trim();
      const v = String(r.v || "").trim();
      if (!k || !v) return "";
      return `<div class="kv-row"><div class="kv-k">${escapeHtml(k)}</div><div class="kv-v">${escapeHtml(v)}</div></div>`;
    })
    .filter(Boolean)
    .join("");
}

function normalizeAmenityGroups(listing) {
  const raw = listing?.amenityGroups || listing?.amenitiesGroups || listing?.commoditiesGroups || null;
  const groups =
    Array.isArray(raw)
      ? raw
          .map((g) => {
            if (!g || typeof g !== "object") return null;
            const title = String(g.title || g.label || "").trim();
            const items = Array.isArray(g.items) ? g.items.map((x) => String(x).trim()).filter(Boolean) : [];
            if (!title || !items.length) return null;
            return { title, items };
          })
          .filter(Boolean)
      : raw && typeof raw === "object"
        ? Object.entries(raw)
            .map(([k, v]) => {
              const title = String(k || "").trim();
              const items = Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [];
              if (!title || !items.length) return null;
              return { title, items };
            })
            .filter(Boolean)
        : [];

  if (groups.length) return groups;

  const rnd = mulberry32(hashString(`${listing.id}:amenities`));
  const tags = Array.isArray(listing?.tags) ? listing.tags.map((t) => String(t).trim()).filter(Boolean) : [];
  const isCity = ["delémont", "delemont", "porrentruy", "biel/bienne", "bienne", "moutier"].includes(
    String(listing.locality || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
  );

  const buckets = {
    Environnement: [],
    Extérieur: [],
    Intérieur: [],
    Équipement: [],
  };

  const push = (k, v) => {
    if (!buckets[k]) buckets[k] = [];
    if (!buckets[k].includes(v)) buckets[k].push(v);
  };

  for (const tag of tags) {
    const s = tag.toLowerCase();
    if (/(gare|bus|transports?|ecole|école|commer|restaurant|village|ville|calme|proche)/.test(s)) push("Environnement", tag);
    else if (/(balcon|terrasse|jardin|garage|parking|cave|loggia)/.test(s)) push("Extérieur", tag);
    else if (/(ascenseur|etage|étage|sans ascenseur)/.test(s)) push("Intérieur", tag);
    else if (/(cuisine|four|induction|lave|seche|sèche|cheminee|cheminée|pompe|solaires|panneaux)/.test(s)) push("Équipement", tag);
    else push("Équipement", tag);
  }

  const fallbackBase = {
    Environnement: isCity
      ? ["Commerces", "Rue commerçante", "Banque", "Poste", "Restaurant(s)", "Pharmacie", "Gare", "Arrêt de bus"]
      : ["Village", "Commerces", "Poste", "Restaurant(s)", "Gare", "Arrêt de bus", "Entrée/sortie autoroute"],
    Extérieur: ["Parking public", "Cave", "Balcon", "Terrasse", "Jardin", "Local vélos"],
    Intérieur: ["Sans ascenseur", "Cuisine habitable", "Salle de bain privative", "WC visiteurs", "Double vitrage", "Non meublé"],
    Équipement: ["Cuisine équipée", "Plaques vitrocéramiques", "Four", "Réfrigérateur", "Lave-linge", "Sèche-linge", "Douche"],
  };

  for (const [k, items] of Object.entries(fallbackBase)) {
    const want = 6;
    const base = seededShuffle(rnd, items).slice(0, want);
    for (const it of base) push(k, it);
  }

  const order = ["Environnement", "Extérieur", "Intérieur", "Équipement"];
  return order.map((title) => ({ title, items: buckets[title] })).filter((g) => g.items.length);
}

function amenityGroupsHtml(groups) {
  return groups
    .map((g) => {
      const title = String(g.title || "").trim();
      const items = Array.isArray(g.items) ? g.items.map((x) => String(x).trim()).filter(Boolean) : [];
      if (!title || !items.length) return "";
      return `<div class="amenity-group"><div class="amenity-k">${escapeHtml(title)}</div><ul class="amenity-list">${items
        .map((it) => `<li>${escapeHtml(it)}</li>`)
        .join("")}</ul></div>`;
    })
    .filter(Boolean)
    .join("");
}

function normalizeDistances(listing) {
  const raw = Array.isArray(listing?.distances) ? listing.distances : [];
  const out = raw
    .map((d) => {
      if (!d || typeof d !== "object") return null;
      const label = String(d.label || d.name || "").trim();
      const distance = String(d.distance || "").trim();
      const walk = String(d.walk || d.ped || "").trim();
      const transit = String(d.transit || d.pt || "").trim();
      const car = String(d.car || "").trim();
      if (!label) return null;
      return { label, distance, walk, transit, car };
    })
    .filter(Boolean);

  if (out.length) return out;

  const rnd = mulberry32(hashString(`${listing.id}:distances`));
  const mk = (label, min, max) => {
    const meters = clampInt(min + rnd() * (max - min), min, max);
    const walkMin = Math.max(1, Math.round(meters / 80));
    const transitMin = Math.max(1, Math.round(meters / 120));
    const carMin = Math.max(1, Math.round(meters / 450));
    return { label, distance: `${meters} m`, walk: `${walkMin}'`, transit: `${transitMin}'`, car: `${carMin}'` };
  };

  return [
    mk("Transports publics", 80, 320),
    mk("École primaire", 250, 950),
    mk("Commerces", 120, 650),
    mk("Restaurants", 90, 480),
  ];
}

function distancesTableHtml(rows) {
  const header = `
    <div class="distances-head">
      <div></div>
      <div class="distances-h">Distance</div>
      <div class="distances-h">À pied</div>
      <div class="distances-h">En train</div>
      <div class="distances-h">En voiture</div>
    </div>
  `;

  const body = rows
    .map((r) => {
      return `<div class="distances-row">
        <div class="distances-k">${escapeHtml(r.label)}</div>
        <div class="distances-v">${escapeHtml(r.distance || "-")}</div>
        <div class="distances-v">${escapeHtml(r.walk || "-")}</div>
        <div class="distances-v">${escapeHtml(r.transit || "-")}</div>
        <div class="distances-v">${escapeHtml(r.car || "-")}</div>
      </div>`;
    })
    .join("");

  return `${header}${body}`;
}

function setPhoto(idx) {
  if (!state.photos.length) return;
  state.index = (idx + state.photos.length) % state.photos.length;
  const img = document.querySelector("[data-gallery-img]");
  const count = document.querySelector("[data-gallery-count]");
  if (!img) return;
  img.src = state.photos[state.index];
  if (count) count.textContent = `${state.index + 1} / ${state.photos.length}`;
}

function render(listing) {
  const pill = document.querySelector("[data-listing-pill]");
  const title = document.querySelector("[data-listing-title]");
  const meta = document.querySelector("[data-listing-meta]");
  const availability = document.querySelector("[data-listing-availability]");
  const price = document.querySelector("[data-listing-price]");
  const factsEl = document.querySelector("[data-listing-facts]");
  const desc = document.querySelector("[data-listing-desc]");
  const communeBlock = document.querySelector("[data-commune-block]");
  const communeEl = document.querySelector("[data-listing-commune]");
  const accessBlock = document.querySelector("[data-access-block]");
  const accessEl = document.querySelector("[data-listing-access]");
  const characteristicsEl = document.querySelector("[data-listing-characteristics]");
  const amenitiesBlock = document.querySelector("[data-amenities-block]");
  const amenitiesGroupsEl = document.querySelector("[data-listing-amenities-groups]");
  const distancesBlock = document.querySelector("[data-distances-block]");
  const distancesEl = document.querySelector("[data-listing-distances]");
  const mapIframe = document.querySelector("[data-listing-map-iframe]");
  const openMaps = document.querySelector("[data-listing-open-maps]");
  const openMaps3d = document.querySelector("[data-listing-open-maps-3d]");
  const statusRibbon = document.querySelector("[data-listing-status-ribbon]");

  const titleText = pickListingText(listing, "title");
  const descText = pickListingText(listing, "description");
  const regionText = translateRegionName(listing.region);
  const typeText = translatePropertyType(listing.propertyType);

  const rawStatus = String(listing.status || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const isSold =
    rawStatus === "sold" ||
    rawStatus === "vendu" ||
    rawStatus === "vendue" ||
    rawStatus.includes("sold") ||
    rawStatus.includes("vendu");
  const isRented =
    rawStatus === "rented" ||
    rawStatus === "loue" ||
    rawStatus === "louee" ||
    rawStatus.includes("rented");
  const statusLabel = isSold ? t("status.sold") : isRented ? t("status.rented") : "";
  const dotColor = listing.category === "sale" ? "rgba(200,161,74,.95)" : "rgba(64,140,255,.85)";
  if (pill) {
    pill.innerHTML = `
      <span style="width:10px;height:10px;border-radius:999px;background:${dotColor}"></span>
      <strong style="letter-spacing:.02em">${escapeHtml(listing.category === "sale" ? t("biens.btn.sale") : listing.category === "rent" ? t("biens.btn.rent") : "")}</strong>
      <span style="opacity:.65">•</span>
      <span style="opacity:.85">${escapeHtml(typeText)}</span>
      <span style="opacity:.65">•</span>
      <span style="opacity:.85">${escapeHtml(listing.id)}</span>
      ${statusLabel ? `<span style="opacity:.65">•</span><span style="opacity:.95">${escapeHtml(statusLabel)}</span>` : ""}
    `;
  }

  if (title) title.textContent = titleText;
  const fav = isFavorite(listing.id);
  for (const favBtn of Array.from(document.querySelectorAll("[data-fav-btn][data-fav-id]"))) {
    if (!(favBtn instanceof HTMLElement)) continue;
    favBtn.setAttribute("data-fav-id", listing.id);
    favBtn.setAttribute("aria-pressed", fav ? "true" : "false");
    favBtn.setAttribute("aria-label", fav ? "Retirer des favoris" : "Ajouter aux favoris");
    favBtn.classList.toggle("is-on", fav);
  }
  if (meta) meta.textContent = `${regionText} — ${listing.locality} • ${formatRooms(listing.rooms)} • ${listing.surface} m²`;

  const facts = getListingFacts(listing);
  if (availability) availability.textContent = facts.availableFrom ? t("listing.availableFrom", { date: facts.availableFrom }) : "";

  const priceText = `${formatCHF(listing.price)}${listing.priceSuffix ? ` ${listing.priceSuffix}` : ""}`;
  if (price) price.textContent = priceText;

  if (factsEl) {
    factsEl.innerHTML = [
      facts.floor != null ? tagHtml(`${t("listing.floor")} ${String(facts.floor)}`) : "",
      facts.bathrooms != null ? tagHtml(`${String(facts.bathrooms)} ${t("listing.bath")}`) : "",
      facts.newBuild ? tagHtml(t("listing.newBuild")) : "",
      facts.parking ? tagHtml(t("listing.parking")) : "",
      facts.quietArea ? tagHtml(t("listing.quietArea")) : "",
      facts.childrenFriendly ? tagHtml(t("listing.childrenFriendly")) : "",
    ]
      .filter(Boolean)
      .join("");
  }

  if (desc) desc.textContent = descText || "";

  const communeText = pickListingText(listing, "commune") || "";
  if (communeBlock instanceof HTMLElement) communeBlock.hidden = !String(communeText).trim();
  if (communeEl) communeEl.textContent = communeText;

  const accessText = pickListingText(listing, "access") || "";
  if (accessBlock instanceof HTMLElement) accessBlock.hidden = !String(accessText).trim();
  if (accessEl) accessEl.textContent = accessText;

  if (characteristicsEl) {
    const rows = normalizeCharacteristics(listing, facts, statusLabel, typeText);
    characteristicsEl.innerHTML = kvTableHtml(rows);
  }

  if (amenitiesBlock instanceof HTMLElement) {
    const groups = normalizeAmenityGroups(listing);
    amenitiesBlock.hidden = false;
    if (amenitiesGroupsEl) amenitiesGroupsEl.innerHTML = amenityGroupsHtml(groups);
  }

  if (distancesBlock instanceof HTMLElement) {
    const rows = normalizeDistances(listing);
    distancesBlock.hidden = false;
    if (distancesEl) distancesEl.innerHTML = distancesTableHtml(rows);
  }

  const mapQuery = `${listing.locality}, ${regionText}, Suisse`;
  const mapQ = encodeURIComponent(mapQuery);
  if (mapIframe) {
    mapIframe.src = `https://www.google.com/maps?q=${mapQ}&t=k&z=19&output=embed`;
    mapIframe.title = mapQuery;
  }
  if (openMaps) openMaps.href = `https://www.google.com/maps?q=${mapQ}`;
  if (openMaps3d) openMaps3d.href = `https://www.google.com/maps/search/?api=1&query=${mapQ}`;

  state.photos = getListingPhotos(listing, 10);
  setPhoto(0);

  const img = document.querySelector("[data-gallery-img]");
  if (img) img.alt = titleText;
  if (statusRibbon) {
    statusRibbon.textContent = statusLabel;
    statusRibbon.style.display = statusLabel ? "" : "none";
  }

  const prev = document.querySelector("[data-gallery-prev]");
  const next = document.querySelector("[data-gallery-next]");
  const count = document.querySelector("[data-gallery-count]");
  const showNav = state.photos.length > 1;
  if (prev) prev.style.display = showNav ? "" : "none";
  if (next) next.style.display = showNav ? "" : "none";
  if (count) count.style.display = showNav ? "" : "none";

  const dossierBtn = document.querySelector(".cta a.btn.primary[href$='dossier.html']");
  if (dossierBtn) {
    const type = listing.category === "sale" ? "sale" : listing.category === "rent" ? "rent" : "";
    dossierBtn.setAttribute(
      "href",
      `./dossier.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(listing.id)}`
    );
  }

  const isUnavailable = isSold || isRented;
  if (isUnavailable) {
    const cta = document.querySelector(".cta");
    if (cta instanceof HTMLElement && !cta.querySelector(".unavailable-note")) {
      const note = document.createElement("div");
      note.className = "unavailable-note";
      note.style.marginTop = "12px";
      note.innerHTML = `
        <div class="badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div class="t">
          <div class="k">${escapeHtml(t("listing.unavailableTitle"))}</div>
          <div class="v">${escapeHtml(t("listing.unavailableMsg", { status: statusLabel }))}</div>
        </div>
      `;
      cta.appendChild(note);
    }

    if (dossierBtn instanceof HTMLAnchorElement) {
      dossierBtn.removeAttribute("href");
      dossierBtn.setAttribute("aria-disabled", "true");
      dossierBtn.tabIndex = -1;
      dossierBtn.classList.add("is-disabled");
    }

    const visitBtn = document.querySelector(".cta a[data-open-appointment]");
    if (visitBtn instanceof HTMLAnchorElement) {
      visitBtn.removeAttribute("data-open-appointment");
      visitBtn.removeAttribute("data-appointment-target");
      visitBtn.removeAttribute("href");
      visitBtn.setAttribute("aria-disabled", "true");
      visitBtn.tabIndex = -1;
      visitBtn.classList.add("is-disabled");
    }
  }

  const visitForm = document.getElementById("listing-form");
  const visitType = visitForm?.querySelector?.("[data-appointment-request-type]");
  if (visitType instanceof HTMLSelectElement) {
    const isSale = listing.category === "sale";
    const normalize = (raw) => {
      const v = String(raw || "").trim();
      if (v === "visit" || v === "dossier" || v === "buy" || v === "rent" || v === "advice" || v === "question") return v;
      if (v === "Demande de visite") return "visit";
      if (v === "Demande de dossier") return "dossier";
      if (v === "Acheter un bien") return "buy";
      if (v === "Louer un bien") return "rent";
      if (v === "Conseils") return "advice";
      if (v === "Question") return "question";
      return v;
    };
    const desired = new Set(["visit", isSale ? "buy" : "rent", "question"]);
    for (const opt of Array.from(visitType.options)) {
      const v = normalize(opt.getAttribute("value") || opt.textContent || "");
      if (!desired.has(v)) opt.remove();
    }
    const preferred = Array.from(visitType.options).find((o) => normalize(o.value || o.textContent || "") === "visit");
    if (preferred) visitType.value = preferred.value;
  }

  if (visitForm instanceof HTMLFormElement) {
    const controls = visitForm.querySelectorAll("input, select, textarea, button");
    if (isUnavailable) {
      visitForm.classList.add("is-disabled");
      for (const el of Array.from(controls)) {
        if (el instanceof HTMLInputElement) el.disabled = true;
        else if (el instanceof HTMLSelectElement) el.disabled = true;
        else if (el instanceof HTMLTextAreaElement) el.disabled = true;
        else if (el instanceof HTMLButtonElement) el.disabled = true;
      }
    } else {
      visitForm.classList.remove("is-disabled");
      for (const el of Array.from(controls)) {
        if (el instanceof HTMLInputElement) el.disabled = false;
        else if (el instanceof HTMLSelectElement) el.disabled = false;
        else if (el instanceof HTMLTextAreaElement) el.disabled = false;
        else if (el instanceof HTMLButtonElement) el.disabled = false;
      }
    }
  }

  const lb = document.getElementById("photo-lightbox");
  const lbImg = lb?.querySelector("img");
  const lbPrev = lb?.querySelector(".prev");
  const lbNext = lb?.querySelector(".next");
  const lbClose = lb?.querySelector(".close");

  const openLightbox = (idx) => {
    if (!lb || !lbImg) return;
    lb.classList.add("show");
    setLightbox(idx);
  };
  const closeLightbox = () => lb?.classList.remove("show");
  const setLightbox = (idx) => {
    state.index = (idx + state.photos.length) % state.photos.length;
    if (lbImg) lbImg.src = state.photos[state.index];
  };

  const media = document.querySelector(".listing-gallery .media");
  media?.addEventListener("click", () => openLightbox(state.index));
  lbPrev?.addEventListener("click", () => setLightbox(state.index - 1));
  lbNext?.addEventListener("click", () => setLightbox(state.index + 1));
  lbClose?.addEventListener("click", closeLightbox);
  lb?.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lb?.classList.contains("show")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") setLightbox(state.index - 1);
    if (e.key === "ArrowRight") setLightbox(state.index + 1);
  });
}

export async function initListingPage() {
  const qp = getQueryParams();
  const id = qp.id || "";
  const LISTINGS = await loadListings();
  const listing = LISTINGS.find((l) => l.id === id);
  if (!listing) {
    showToast(t("listing.notFound"));
    window.location.replace("./biens.html");
    return;
  }

  currentListing = listing;
  render(listing);

  window.addEventListener("dcki:lang", () => {
    if (currentListing) render(currentListing);
  });

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    if (t.closest("[data-gallery-prev]")) setPhoto(state.index - 1);
    if (t.closest("[data-gallery-next]")) setPhoto(state.index + 1);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") setPhoto(state.index - 1);
    if (e.key === "ArrowRight") setPhoto(state.index + 1);
  });
}
