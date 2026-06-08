import { getListingFacts, getListingPhotos } from "./listings-data.js";
import { formatCHF, formatRooms, showToast, getQueryParams, isFavorite } from "./ui.js?v=202606081300";
import { loadListings } from "./listings-store.js?v=202606081300";
import { getLang, pickListingText, t, translateListingFeature, translatePropertyType, translateRegionName } from "./i18n.js?v=202606081300";

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

function getPublicBaseUrl() {
  const meta = document.querySelector('meta[name="dcki-public-base-url"]');
  if (meta instanceof HTMLMetaElement) {
    const v = String(meta.content || "").trim();
    if (v) return v;
  }
  const base = window.location.origin || "";
  return base ? `${base}/` : "/";
}

function ensureTrailingSlash(url) {
  const s = String(url || "").trim();
  if (!s) return "/";
  return s.endsWith("/") ? s : `${s}/`;
}

async function copyToClipboard(text) {
  const v = String(text || "").trim();
  if (!v) return false;
  try {
    await navigator.clipboard.writeText(v);
    return true;
  } catch {
    return false;
  }
}

function getShareUrl(listing) {
  const base = ensureTrailingSlash(getPublicBaseUrl());
  const url = new URL("bien.html", base);
  url.searchParams.set("id", String(listing?.id || ""));
  return url.toString();
}

function mountListingShare() {
  const root = document.querySelector("[data-listing-share]");
  if (!(root instanceof HTMLElement)) return;
  if (root.getAttribute("data-share-mounted") === "1") return;
  root.setAttribute("data-share-mounted", "1");

  const toggle = root.querySelector("[data-share-toggle]");
  const pop = root.querySelector("[data-share-pop]");
  if (!(toggle instanceof HTMLButtonElement) || !(pop instanceof HTMLElement)) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    pop.hidden = !open;
  };

  setOpen(false);

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const open = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest("[data-listing-share]") === root) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    setOpen(false);
  });

  const copy = root.querySelector("[data-share-copy]");
  if (copy instanceof HTMLAnchorElement) {
    copy.addEventListener("click", async (e) => {
      e.preventDefault();
      const url = root.getAttribute("data-share-url") || "";
      const ok = await copyToClipboard(url);
      showToast(ok ? t("listing.share.copied") : url);
      setOpen(false);
    });
  }

  const ig = root.querySelector("[data-share-instagram]");
  if (ig instanceof HTMLAnchorElement) {
    ig.addEventListener("click", async () => {
      const url = root.getAttribute("data-share-url") || "";
      const ok = await copyToClipboard(url);
      if (ok) showToast(t("listing.share.copied"));
      setOpen(false);
    });
  }
}

function mountListingPrint() {
  const btn = document.querySelector("[data-listing-print-btn]");
  if (!(btn instanceof HTMLButtonElement) || btn.dataset.printBound === "1") return;
  btn.dataset.printBound = "1";

  const teardownFrame = () => {
    const frame = document.getElementById("listing-print-frame");
    if (frame instanceof HTMLIFrameElement) frame.remove();
  };

  const onMessage = (e) => {
    if (e.origin !== window.location.origin) return;
    if (e.data !== "dcki-print-done") return;
    teardownFrame();
  };
  window.addEventListener("message", onMessage);

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const url = btn.getAttribute("data-print-url") || "";
    if (url) {
      teardownFrame();
      const frame = document.createElement("iframe");
      frame.id = "listing-print-frame";
      frame.src = url;
      frame.setAttribute("aria-hidden", "true");
      frame.tabIndex = -1;
      frame.style.position = "fixed";
      frame.style.width = "1px";
      frame.style.height = "1px";
      frame.style.right = "0";
      frame.style.bottom = "0";
      frame.style.opacity = "0";
      frame.style.pointerEvents = "none";
      frame.style.border = "0";
      document.body.appendChild(frame);
      window.setTimeout(teardownFrame, 20000);
      return;
    }

    const prevTitle = document.title;
    const nextTitle = btn.getAttribute("data-print-title") || prevTitle;
    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      document.title = prevTitle;
      window.removeEventListener("afterprint", restore);
    };

    document.title = nextTitle;
    window.addEventListener("afterprint", restore, { once: true });
    window.print();
    window.setTimeout(restore, 1200);
  });
}

function updateListingShare(listing, titleText) {
  const root = document.querySelector("[data-listing-share]");
  if (!(root instanceof HTMLElement)) return;

  const shareUrl = getShareUrl(listing);
  root.setAttribute("data-share-url", shareUrl);

  const label = root.querySelector("[data-share-label]");
  if (label instanceof HTMLElement) label.textContent = t("listing.share");

  const toggle = root.querySelector("[data-share-toggle]");
  if (toggle instanceof HTMLElement) toggle.setAttribute("aria-label", t("listing.share.toggleAria"));

  const title = String(titleText || listing?.id || "").trim() || "DCKImmo";
  const msg = `${title} — ${shareUrl}`;

  const wa = root.querySelector("[data-share-whatsapp]");
  if (wa instanceof HTMLAnchorElement) wa.href = `https://wa.me/?text=${encodeURIComponent(msg)}`;

  const email = root.querySelector("[data-share-email]");
  if (email instanceof HTMLAnchorElement) email.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(msg)}`;

  const ig = root.querySelector("[data-share-instagram]");
  if (ig instanceof HTMLAnchorElement) ig.href = "https://www.instagram.com/";

  const copy = root.querySelector("[data-share-copy]");
  if (copy instanceof HTMLElement) {
    copy.setAttribute("aria-label", t("listing.share.copy"));
    copy.setAttribute("title", t("listing.share.copy"));
  }
  if (ig instanceof HTMLElement) {
    ig.setAttribute("aria-label", t("listing.share.instagram"));
    ig.setAttribute("title", t("listing.share.instagram"));
  }
  if (wa instanceof HTMLElement) {
    wa.setAttribute("aria-label", t("listing.share.whatsapp"));
    wa.setAttribute("title", t("listing.share.whatsapp"));
  }
  if (email instanceof HTMLElement) {
    email.setAttribute("aria-label", t("listing.share.email"));
    email.setAttribute("title", t("listing.share.email"));
  }
}

function updateListingPrint(listing, titleText) {
  const btn = document.querySelector("[data-listing-print-btn]");
  const label = t("listing.print");
  const aria = t("listing.print.aria");
  const printTitle = String(titleText || listing?.id || "DCKImmo").trim() || "DCKImmo";
  const printUrl = (() => {
    try {
      const u = new URL(window.location.href);
      u.searchParams.set("id", String(listing?.id || ""));
      u.searchParams.set("print", "1");
      u.searchParams.set("ts", String(Date.now()));
      return u.toString();
    } catch {
      return "";
    }
  })();

  if (btn instanceof HTMLButtonElement) {
    btn.setAttribute("aria-label", aria);
    btn.setAttribute("title", aria);
    btn.setAttribute("data-print-title", printTitle);
    if (printUrl) btn.setAttribute("data-print-url", printUrl);
  }

  const printTitleEl = document.querySelector("[data-listing-print-title]");
  if (printTitleEl instanceof HTMLElement) printTitleEl.textContent = printTitle;

  const printDateLabelEl = document.querySelector("[data-listing-print-date-label]");
  const printRefLabelEl = document.querySelector("[data-listing-print-ref-label]");
  const printStampEl = document.querySelector("[data-listing-print-stamp]");
  const printRefEl = document.querySelector("[data-listing-print-ref]");
  const printOverlineEl = document.querySelector("[data-listing-print-overline]");
  const printLocationEl = document.querySelector("[data-listing-print-location]");

  const locale = getLang() === "en" ? "en-CH" : "fr-CH";
  const stamp = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  const dateLabel = getLang() === "en" ? "Print date:" : "Date d'edition:";
  const refLabel = getLang() === "en" ? "Reference:" : "Reference:";
  const typeText = translatePropertyType(listing.propertyType).toUpperCase();
  const catText =
    listing.category === "sale"
      ? (getLang() === "en" ? "FOR SALE" : "A VENDRE")
      : listing.category === "rent"
        ? (getLang() === "en" ? "FOR RENT" : "A LOUER")
        : "";

  if (printDateLabelEl instanceof HTMLElement) printDateLabelEl.textContent = dateLabel;
  if (printRefLabelEl instanceof HTMLElement) printRefLabelEl.textContent = refLabel;
  if (printStampEl instanceof HTMLElement) printStampEl.textContent = stamp;
  if (printRefEl instanceof HTMLElement) printRefEl.textContent = String(listing?.id || "").toUpperCase();
  if (printOverlineEl instanceof HTMLElement) {
    printOverlineEl.textContent = [catText, typeText].filter(Boolean).join(" • ");
  }
  if (printLocationEl instanceof HTMLElement) {
    const localityText = String(pickListingText(listing, "locality") || listing?.locality || "").trim();
    const regionRaw = String(listing?.region || listing?.canton || listing?.state || "").trim();
    const regionText = regionRaw ? translateRegionName(regionRaw) : "";
    printLocationEl.textContent = [localityText, regionText].filter(Boolean).join(", ");
  }

  const printSummaryEl = document.querySelector("[data-listing-print-summary]");
  const printThumbsEl = document.querySelector("[data-listing-print-thumbs]");
  const pill = document.querySelector("[data-listing-pill]");
  const meta = document.querySelector("[data-listing-meta]");
  const availability = document.querySelector("[data-listing-availability]");
  const price = document.querySelector("[data-listing-price]");
  const facts = document.querySelector("[data-listing-facts]");
  if (printSummaryEl instanceof HTMLElement) {
    const pillHtml = pill instanceof HTMLElement ? pill.innerHTML.trim() : "";
    const metaHtml = meta instanceof HTMLElement ? meta.innerHTML.trim() : "";
    const availabilityHtml = availability instanceof HTMLElement ? availability.innerHTML.trim() : "";
    const priceHtml = price instanceof HTMLElement ? price.innerHTML.trim() : "";
    const factsHtml = facts instanceof HTMLElement ? facts.innerHTML.trim() : "";

    printSummaryEl.innerHTML = `
      <div class="listing-print-summary-main">
        ${pillHtml ? `<div class="pill listing-pill">${pillHtml}</div>` : ""}
        ${metaHtml ? `<div class="meta">${metaHtml}</div>` : ""}
        ${availabilityHtml ? `<div class="meta listing-print-summary-availability">${availabilityHtml}</div>` : ""}
        ${priceHtml ? `<div class="listing-price">${priceHtml}</div>` : ""}
        ${factsHtml ? `<div class="facts">${factsHtml}</div>` : ""}
      </div>
    `.trim();
  }
  if (printThumbsEl instanceof HTMLElement) {
    const photos = getListingPhotos(listing, 4).slice(1, 4);
    printThumbsEl.innerHTML = photos
      .map(
        (src, index) => `
          <div class="listing-print-thumb">
            <img src="${escapeHtml(src)}" alt="${escapeHtml(`${printTitle} ${index + 2}`)}" loading="eager" />
          </div>
        `
      )
      .join("");
    printThumbsEl.hidden = photos.length === 0;
  }
}

function hasChargesIncluded(listing) {
  const suffix = String(listing?.priceSuffix || "").toLowerCase();
  const isRent = suffix.includes("mois") || suffix.includes("month");
  const chars = Array.isArray(listing?.characteristics) ? listing.characteristics : [];
  const tags = Array.isArray(listing?.tags) ? listing.tags : [];
  const inChars = chars.some((x) => {
    const k = String(x?.k || "").trim().toLowerCase();
    const v = String(x?.v || "").trim().toLowerCase();
    if (k !== "charges") return false;
    return v.includes("compris") || v.includes("comprises") || v.includes("included") || v.includes("include");
  });
  const inTags = tags.some((x) => /charges\s+comprises|charges\s+compris|charges\s+included|utilities\s+included/i.test(String(x || "")));
  return Boolean(isRent && (inChars || inTags));
}

function mountListingPriceInfo(root) {
  if (!(root instanceof HTMLElement)) return;
  if (root.getAttribute("data-priceinfo-mounted") === "1") return;
  root.setAttribute("data-priceinfo-mounted", "1");

  const btn = root.querySelector("[data-price-info-btn]");
  const pop = root.querySelector("[data-price-info-pop]");
  if (!(btn instanceof HTMLButtonElement) || !(pop instanceof HTMLElement)) return;

  const setOpen = (open) => {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    pop.hidden = !open;
  };

  setOpen(false);

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const open = btn.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  document.addEventListener(
    "click",
    (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest("[data-listing-price]") === root) return;
      setOpen(false);
    },
    { capture: true }
  );

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const open = btn.getAttribute("aria-expanded") === "true";
    if (!open) return;
    setOpen(false);
    btn.focus();
  });
}

function metaIcon(kind) {
  if (kind === "map") {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z"></path>
        <path d="M9 4v14"></path>
        <path d="M15 6v14"></path>
      </svg>
    `.trim();
  }
  if (kind === "pin") {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 22s7-4.4 7-11a7 7 0 0 0-14 0c0 6.6 7 11 7 11Z"></path>
        <circle cx="12" cy="11" r="2.5"></circle>
      </svg>
    `.trim();
  }
  if (kind === "bed") {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 7v10"></path>
        <path d="M21 17V7"></path>
        <path d="M3 13h18"></path>
        <path d="M7 10h10"></path>
        <path d="M7 10a2 2 0 0 0-2 2v1"></path>
        <path d="M17 10a2 2 0 0 1 2 2v1"></path>
      </svg>
    `.trim();
  }
  if (kind === "surface") {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 9V4h5"></path>
        <path d="M20 15v5h-5"></path>
        <path d="M9 20H4v-5"></path>
        <path d="M15 4h5v5"></path>
      </svg>
    `.trim();
  }
  return "";
}

function metaItem(icon, text) {
  const label = String(text ?? "").trim();
  if (!label) return "";
  return `
    <span class="meta-item">
      ${icon ? `<span class="meta-ico">${icon}</span>` : ""}
      <span class="meta-text">${escapeHtml(label)}</span>
    </span>
  `.trim();
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
    { k: "Salle de bain", v: sanitaire },
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
    { k: "Places de parc", v: parkingText },
    { k: "Charges", v: chargesText },
  ];
}

function kvTableHtml(rows) {
  const isEn = getLang() === "en";
  const ord = (n) => {
    const v = Number(n);
    if (!Number.isFinite(v)) return String(n);
    const mod100 = v % 100;
    if (mod100 >= 11 && mod100 <= 13) return `${v}th`;
    const mod10 = v % 10;
    if (mod10 === 1) return `${v}st`;
    if (mod10 === 2) return `${v}nd`;
    if (mod10 === 3) return `${v}rd`;
    return `${v}th`;
  };

  const translateKey = (k) => {
    const v = String(k || "").trim();
    if (!isEn) return v;
    const map = {
      "Référence": "Reference",
      "Disponibilité": "Availability",
      "Sanitaire": "Bathrooms",
      "Salle de bain": "Bathrooms",
      "Année de construction": "Year built",
      "Dernières rénovations": "Last renovation",
      "Pièces": "Rooms",
      "Chambre": "Bedrooms",
      "Étage": "Floor",
      "Nombre d'étage(s) total": "Total floors",
      "Type de chauffage": "Heating type",
      "Installation chauffage": "Heating system",
      "Eau chaude sanitaire": "Hot water",
      "Surface habitable": "Living area",
      "Places de parc": "Parking",
      "Charges": "Fees",
    };
    return map[v] || v;
  };

  const translateValue = (k, v) => {
    const rawKey = String(k || "").trim();
    const rawVal = String(v || "").trim();
    if (!isEn) return rawVal;

    let out = translateListingFeature(rawVal);

    const simpleMap = {
      "Pellets": "Pellets",
      "Gaz": "Gas",
      "Mazout": "Oil",
      "Électrique": "Electric",
      "Solaire": "Solar",
      "Radiateurs": "Radiators",
      "Disponible": "Available",
      "Pas disponible": "Not available",
      "En sus": "Extra",
      "Immédiatement": "Immediately",
    };
    out = simpleMap[out] || out;

    out = out.replace(/\bCHF\s+(\d+)\.-\/mois\b/i, "CHF $1/month");
    out = out.replace(/\(Comprises\)/gi, "(included)");

    if (rawKey === "Étage") {
      const m = rawVal.match(/(\d+)\s*(?:er|e)\s+étage/i);
      if (m) out = `${ord(m[1])} floor`;
    }

    return out;
  };

  return rows
    .map((r) => {
      const rawK = String(r.k || "").trim();
      const rawV = String(r.v || "").trim();
      const k = translateKey(rawK);
      const v = translateValue(rawK, rawV);
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
  const translateGroupTitle = (raw) => {
    const v = String(raw || "").trim();
    if (v === "Environnement") return t("listing.amenityGroup.environment");
    if (v === "Extérieur") return t("listing.amenityGroup.outdoor");
    if (v === "Intérieur") return t("listing.amenityGroup.indoor");
    if (v === "Équipement") return t("listing.amenityGroup.equipment");
    return v;
  };

  const translateItem = (raw) => {
    const v = String(raw || "").trim();
    if (!v) return v;
    const base = translateListingFeature(v);
    if (getLang() !== "en") return base;
    const map = {
      "Commerces": "Shops",
      "Rue commerçante": "Shopping street",
      "Banque": "Bank",
      "Poste": "Post office",
      "Restaurant(s)": "Restaurants",
      "Pharmacie": "Pharmacy",
      "Gare": "Train station",
      "Arrêt de bus": "Bus stop",
      "Village": "Village",
      "Entrée/sortie autoroute": "Highway access",
      "Parking public": "Public parking",
      "Sans ascenseur": "No elevator",
      "Cuisine habitable": "Eat-in kitchen",
      "Salle de bain privative": "Private bathroom",
      "WC visiteurs": "Guest WC",
      "Non meublé": "Unfurnished",
      "Plaques vitrocéramiques": "Ceramic cooktop",
      "Four": "Oven",
      "Réfrigérateur": "Fridge",
      "Lave-linge": "Washing machine",
      "Sèche-linge": "Dryer",
      "Douche": "Shower",
    };
    return map[base] || base;
  };

  return groups
    .map((g, idx) => {
      const title = translateGroupTitle(String(g.title || "").trim());
      const items = Array.isArray(g.items) ? g.items.map((x) => String(x).trim()).filter(Boolean) : [];
      if (!title || !items.length) return "";
      const panelId = `amenity-panel-${idx}`;
      return `
        <div class="amenity-group" data-amenity-accordion-item>
          <button class="amenity-head" type="button" aria-expanded="false" aria-controls="${escapeHtml(panelId)}">
            <span class="amenity-k">${escapeHtml(title)}</span>
          </button>
          <div class="amenity-panel" id="${escapeHtml(panelId)}" hidden>
            <ul class="amenity-list">${items.map((it) => `<li>${escapeHtml(translateItem(it))}</li>`).join("")}</ul>
          </div>
        </div>
      `;
    })
    .filter(Boolean)
    .join("");
}

function setupAmenityAccordion(root) {
  if (!(root instanceof HTMLElement)) return;
  if (root.dataset.amenityAccordionBound === "1") return;
  root.dataset.amenityAccordionBound = "1";

  root.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest(".amenity-head") : null;
    if (!(btn instanceof HTMLButtonElement)) return;

    const item = btn.closest("[data-amenity-accordion-item]");
    if (!(item instanceof HTMLElement)) return;

    const panel = item.querySelector(".amenity-panel");
    if (!(panel instanceof HTMLElement)) return;

    const isOpen = btn.getAttribute("aria-expanded") === "true";

    for (const otherBtn of root.querySelectorAll(".amenity-head[aria-expanded='true']")) {
      if (otherBtn === btn) continue;
      otherBtn.setAttribute("aria-expanded", "false");
      const otherItem = otherBtn.closest("[data-amenity-accordion-item]");
      const otherPanel = otherItem ? otherItem.querySelector(".amenity-panel") : null;
      if (otherPanel instanceof HTMLElement) otherPanel.hidden = true;
    }

    btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
    panel.hidden = isOpen;
  });
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

  const lbl = (fr, en) => (getLang() === "en" ? en : fr);
  return [
    mk(lbl("Transports publics", "Public transport"), 80, 320),
    mk(lbl("École primaire", "Primary school"), 250, 950),
    mk(lbl("Commerces", "Shops"), 120, 650),
    mk(lbl("Restaurants", "Restaurants"), 90, 480),
  ];
}

function distancesTableHtml(rows) {
  const header = `
    <div class="distances-head">
      <div></div>
      <div class="distances-h">${escapeHtml(t("listing.distance"))}</div>
      <div class="distances-h">${escapeHtml(t("listing.walk"))}</div>
      <div class="distances-h">${escapeHtml(t("listing.transit"))}</div>
      <div class="distances-h">${escapeHtml(t("listing.car"))}</div>
    </div>
  `;

  const body = rows
    .map((r) => {
      return `<div class="distances-row">
        <div class="distances-k">${escapeHtml(r.label)}</div>
        <div class="distances-v" data-label="${escapeHtml(t("listing.distance"))}">${escapeHtml(r.distance || "-")}</div>
        <div class="distances-v" data-label="${escapeHtml(t("listing.walk"))}">${escapeHtml(r.walk || "-")}</div>
        <div class="distances-v" data-label="${escapeHtml(t("listing.transit"))}">${escapeHtml(r.transit || "-")}</div>
        <div class="distances-v" data-label="${escapeHtml(t("listing.car"))}">${escapeHtml(r.car || "-")}</div>
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
  const isPrintView = String(getQueryParams().print || "") === "1";
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
  const zoomInBtn = document.querySelector("[data-map-zoom-in]");
  const zoomOutBtn = document.querySelector("[data-map-zoom-out]");

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
  if (pill) {
    const cat = listing.category === "sale" ? t("biens.btn.sale") : listing.category === "rent" ? t("biens.btn.rent") : "";
    pill.innerHTML = `
      <div class="listing-pill-main">
        <strong class="listing-pill-status">${escapeHtml(cat)}</strong>
        <span class="listing-pill-sep">•</span>
        <span class="listing-pill-type">${escapeHtml(typeText)}</span>
      </div>
      <div class="listing-pill-sub">
        <span class="listing-pill-ref">${escapeHtml(String(listing.id || "").toUpperCase())}</span>
        ${statusLabel ? `<span class="listing-pill-sep">•</span><span class="listing-pill-state">${escapeHtml(statusLabel)}</span>` : ""}
      </div>
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
  if (meta) {
    meta.innerHTML = [
      metaItem(metaIcon("map"), regionText),
      metaItem(metaIcon("pin"), listing.locality),
      metaItem(metaIcon("bed"), formatRooms(listing.rooms)),
      metaItem(metaIcon("surface"), `${listing.surface} m²`),
    ]
      .filter(Boolean)
      .join("");
  }

  const facts = getListingFacts(listing);
  const showTopFacts = Boolean(listing.showTopFacts);
  const customTopFacts =
    showTopFacts && Array.isArray(listing.topFacts)
      ? listing.topFacts.map((x) => String(x || "").trim()).filter(Boolean)
      : [];
  const topFactsHtml = customTopFacts.length ? customTopFacts.map((x) => tagHtml(x)).join("") : "";
  if (availability) availability.textContent = facts.availableFrom ? t("listing.availableFrom", { date: facts.availableFrom }) : "";

  const priceText = `${formatCHF(listing.price)}${listing.priceSuffix ? ` ${listing.priceSuffix}` : ""}`;
  if (price) {
    const showInfo = hasChargesIncluded(listing);
    if (showInfo) {
      const label = t("listing.priceInfo.aria");
      const prefix = t("listing.priceInfo.rentIncludesPrefix");
      const accent = t("listing.priceInfo.rentIncludesHighlight");
      const textEl = price.querySelector(".listing-price-text");
      const popInner = price.querySelector(".price-info-pop-inner");
      const btn = price.querySelector("[data-price-info-btn]");
      if (!(textEl instanceof HTMLElement) || !(popInner instanceof HTMLElement) || !(btn instanceof HTMLButtonElement)) {
        price.innerHTML = `
          <span class="listing-price-text">${escapeHtml(priceText)}</span>
          <span class="price-info">
            <button class="price-info-btn" type="button" aria-label="${escapeHtml(label)}" aria-expanded="false" data-price-info-btn>
              <span class="price-info-icon" aria-hidden="true">i</span>
            </button>
            <div class="price-info-pop" role="tooltip" hidden data-price-info-pop>
              <div class="price-info-pop-inner">${escapeHtml(prefix)} <span class="price-info-accent">${escapeHtml(accent)}</span>.</div>
            </div>
          </span>
        `.trim();
        mountListingPriceInfo(price);
      } else {
        textEl.textContent = priceText;
        btn.setAttribute("aria-label", label);
        if (!(btn.querySelector(".price-info-icon") instanceof HTMLElement)) {
          btn.innerHTML = `<span class="price-info-icon" aria-hidden="true">i</span>`;
        }
        popInner.innerHTML = `${escapeHtml(prefix)} <span class="price-info-accent">${escapeHtml(accent)}</span>.`;
      }
    } else {
      price.textContent = priceText;
      price.removeAttribute("data-priceinfo-mounted");
    }
  }

  mountListingShare();
  mountListingPrint();
  updateListingShare(listing, titleText);
  updateListingPrint(listing, titleText);

  if (factsEl) {
    factsEl.innerHTML = topFactsHtml
      ? topFactsHtml
      : [
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

  if (desc) {
    const safe = escapeHtml(descText || "");
    desc.innerHTML = safe.replaceAll("\n\n", "<br><br>").replaceAll("\n", "<br>");
  }

  const communeText = pickListingText(listing, "commune") || "";
  if (communeBlock instanceof HTMLElement) communeBlock.hidden = !String(communeText).trim();
  if (communeEl) communeEl.textContent = communeText;

  const accessText = pickListingText(listing, "access") || "";
  if (accessBlock instanceof HTMLElement) accessBlock.hidden = !String(accessText).trim();
  if (accessEl) accessEl.textContent = accessText;

  if (characteristicsEl) {
    const rows = normalizeCharacteristics(listing, facts, statusLabel, typeText);
    if (isPrintView && String(accessText).trim()) {
      const accessRow = { k: getLang() === "en" ? "Access" : "Accès", v: accessText };
      const insertAfter = rows.findIndex((row) => {
        const key = String(row?.k || "").trim().toLowerCase();
        return key === "dernières rénovations" || key === "last renovation";
      });
      if (insertAfter >= 0) rows.splice(insertAfter + 1, 0, accessRow);
      else rows.push(accessRow);
      if (accessBlock instanceof HTMLElement) accessBlock.hidden = true;
    }
    characteristicsEl.innerHTML = kvTableHtml(rows);
  }

  if (amenitiesBlock instanceof HTMLElement) {
    const groups = normalizeAmenityGroups(listing);
    amenitiesBlock.hidden = false;
    if (amenitiesGroupsEl) {
      amenitiesGroupsEl.innerHTML = amenityGroupsHtml(groups);
      setupAmenityAccordion(amenitiesGroupsEl);
    }
  }

  if (distancesBlock instanceof HTMLElement) {
    const rows = normalizeDistances(listing);
    distancesBlock.hidden = false;
    if (distancesEl) distancesEl.innerHTML = distancesTableHtml(rows);
  }

  updateListingPrint(listing, titleText);

  const openQuery = String(accessText || "").trim() || `${listing.locality}, ${regionText}, Suisse`;
  const openQ = encodeURIComponent(openQuery);
  const lat = Number(listing?.mapCenterLat);
  const lng = Number(listing?.mapCenterLng);
  const initialZoomRaw = Number(listing?.mapZoom);
  let mapZoom = Number.isFinite(initialZoomRaw) ? initialZoomRaw : 18;

  const clampZoom = (z) => Math.min(20, Math.max(14, Math.round(z)));
  let forceOsm = false;
  let mapLoadSeq = 0;

  const buildOsmEmbed = (z) => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "";
    const zz = clampZoom(z);
    const d =
      zz >= 20 ? 0.0015 : zz >= 19 ? 0.0025 : zz >= 18 ? 0.004 : zz >= 17 ? 0.007 : zz >= 16 ? 0.012 : 0.02;
    const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
      bbox
    )}&layer=mapnik`;
  };

  const setMap = () => {
    mapZoom = clampZoom(mapZoom);
    const ll = Number.isFinite(lat) && Number.isFinite(lng) ? encodeURIComponent(`${lat},${lng}`) : "";
    if (mapIframe) {
      const seq = (mapLoadSeq += 1);
      const googleSrc = ll
        ? `https://www.google.com/maps?ll=${ll}&t=m&z=${mapZoom}&output=embed`
        : `https://www.google.com/maps?q=${openQ}&t=m&z=${mapZoom}&output=embed`;
      const osmSrc = buildOsmEmbed(mapZoom);

      let loaded = false;
      mapIframe.onload = () => {
        if (seq !== mapLoadSeq) return;
        loaded = true;
      };
      mapIframe.onerror = () => {
        if (seq !== mapLoadSeq) return;
        loaded = false;
      };

      mapIframe.src = forceOsm && osmSrc ? osmSrc : googleSrc;
      mapIframe.title = openQuery;

      if (!forceOsm && osmSrc) {
        window.setTimeout(() => {
          if (seq !== mapLoadSeq) return;
          if (loaded) return;
          forceOsm = true;
          mapIframe.src = osmSrc;
          mapIframe.title = openQuery;
        }, 2500);
      }
    }
    if (openMaps) openMaps.href = `https://www.google.com/maps?q=${openQ}&t=m&z=${mapZoom}`;
    if (openMaps3d) openMaps3d.href = `https://www.google.com/maps?q=${openQ}&t=k&z=19`;
  };

  setMap();

  if (zoomInBtn instanceof HTMLButtonElement && !zoomInBtn.dataset.bound) {
    zoomInBtn.dataset.bound = "1";
    zoomInBtn.addEventListener("click", () => {
      mapZoom = mapZoom + 1;
      setMap();
    });
  }
  if (zoomOutBtn instanceof HTMLButtonElement && !zoomOutBtn.dataset.bound) {
    zoomOutBtn.dataset.bound = "1";
    zoomOutBtn.addEventListener("click", () => {
      mapZoom = mapZoom - 1;
      setMap();
    });
  }

  const mapPin = document.querySelector(".map-pin");
  if (mapPin instanceof HTMLElement) {
    const x = Number(listing?.mapPinX);
    const y = Number(listing?.mapPinY);
    if (Number.isFinite(x)) mapPin.style.setProperty("--map-pin-x", `${x}%`);
    if (Number.isFinite(y)) mapPin.style.setProperty("--map-pin-y", `${y}%`);
  }

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

  const btn360 = document.querySelector(".cta [data-open-360]");
  const panoSrcRaw = String(listing?.pano360 || listing?.tour360 || listing?.photo360 || listing?.vr360 || "").trim();
  if (btn360 instanceof HTMLButtonElement) {
    const lbl = t("listing.visit360");
    btn360.hidden = false;
    btn360.textContent = lbl;
    btn360.setAttribute("aria-label", lbl);
    btn360.setAttribute("title", lbl);
    btn360.onclick = () => {
      if (!panoSrcRaw) {
        showToast(t("toast.pano360.missing"));
        return;
      }
      const panoLb = document.getElementById("pano360-lightbox");
      const stage = panoLb?.querySelector("[data-pano-stage]");
      const hint = panoLb?.querySelector("[data-pano-hint]");
      if (!(panoLb instanceof HTMLElement) || !(stage instanceof HTMLElement)) return;
      try {
        stage.style.backgroundImage = `url("${new URL(panoSrcRaw, window.location.href).href}")`;
      } catch {
        stage.style.backgroundImage = `url("${panoSrcRaw}")`;
      }
      stage.dataset.panX = "0";
      stage.dataset.panY = "50";
      stage.style.backgroundPosition = "0% 50%";
      if (hint instanceof HTMLElement) {
        hint.style.opacity = "";
        hint.style.display = "";
      }
      panoLb.dataset.prevOverflow = document.body.style.overflow || "";
      document.body.style.overflow = "hidden";
      panoLb.classList.add("show");
      panoLb.setAttribute("aria-hidden", "false");
    };
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
        else if (el instanceof HTMLButtonElement) {
          if (el.type === "submit") continue;
          el.disabled = false;
        }
      }
      const consent = visitForm.querySelector("[data-privacy-consent]");
      const submit = visitForm.querySelector("button[type=\"submit\"]");
      if (consent instanceof HTMLInputElement && consent.type === "checkbox" && submit instanceof HTMLButtonElement) {
        submit.disabled = !consent.checked;
      }
    }
  }

  const panoLb = document.getElementById("pano360-lightbox");
  const panoStage = panoLb?.querySelector("[data-pano-stage]");
  const panoClose = panoLb?.querySelector("[data-pano-close]");
  const panoHint = panoLb?.querySelector("[data-pano-hint]");
  const closePano = () => {
    if (!(panoLb instanceof HTMLElement)) return;
    panoLb.classList.remove("show");
    panoLb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = panoLb.dataset.prevOverflow || "";
  };
  if (panoLb instanceof HTMLElement && panoStage instanceof HTMLElement && panoLb.dataset.bound !== "1") {
    panoLb.dataset.bound = "1";

    panoClose?.addEventListener("click", closePano);
    panoLb.addEventListener("click", (e) => {
      if (e.target === panoLb) closePano();
    });
    document.addEventListener("keydown", (e) => {
      if (!panoLb.classList.contains("show")) return;
      if (e.key === "Escape") closePano();
    });

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let baseX = 0;
    let baseY = 50;

    const wrap01 = (n) => {
      const v = Number(n);
      if (!Number.isFinite(v)) return 0;
      return ((v % 100) + 100) % 100;
    };
    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
    const writePos = (x, y) => {
      const xx = wrap01(x);
      const yy = clamp(y, 35, 65);
      panoStage.dataset.panX = String(xx);
      panoStage.dataset.panY = String(yy);
      panoStage.style.backgroundPosition = `${xx}% ${yy}%`;
    };
    const readPos = () => {
      const x = Number(panoStage.dataset.panX || "0");
      const y = Number(panoStage.dataset.panY || "50");
      return { x: Number.isFinite(x) ? x : 0, y: Number.isFinite(y) ? y : 50 };
    };

    panoStage.addEventListener("pointerdown", (e) => {
      if (!(e instanceof PointerEvent)) return;
      dragging = true;
      const cur = readPos();
      baseX = cur.x;
      baseY = cur.y;
      startX = e.clientX;
      startY = e.clientY;
      try {
        panoStage.setPointerCapture(e.pointerId);
      } catch {
      }
      if (panoHint instanceof HTMLElement) {
        panoHint.style.opacity = "0";
        window.setTimeout(() => {
          if (panoHint instanceof HTMLElement) panoHint.style.display = "none";
        }, 220);
      }
    });
    panoStage.addEventListener("pointermove", (e) => {
      if (!(e instanceof PointerEvent)) return;
      if (!dragging) return;
      const w = panoStage.clientWidth || 1;
      const h = panoStage.clientHeight || 1;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const nx = baseX + (-dx / w) * 100;
      const ny = baseY + (-dy / h) * 40;
      writePos(nx, ny);
    });
    const end = (e) => {
      if (!(e instanceof PointerEvent)) return;
      dragging = false;
      try {
        panoStage.releasePointerCapture(e.pointerId);
      } catch {
      }
    };
    panoStage.addEventListener("pointerup", end);
    panoStage.addEventListener("pointercancel", end);
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
  const isPrint = String(qp.print || "") === "1";
  const LISTINGS = await loadListings();
  const listing = LISTINGS.find((l) => l.id === id);
  if (!listing) {
    showToast(t("listing.notFound"));
    window.location.replace("./biens.html");
    return;
  }

  currentListing = listing;
  render(listing);

  if (isPrint) {
    document.title = "\u00A0";
    document.body.classList.add("print-view");
    const openPrintView = async () => {
      for (const item of document.querySelectorAll(".amenity-group[data-amenity-accordion-item]")) {
        const btn = item.querySelector(".amenity-head");
        const panel = item.querySelector(".amenity-panel");
        if (btn instanceof HTMLButtonElement) btn.setAttribute("aria-expanded", "true");
        if (panel instanceof HTMLElement) panel.hidden = false;
      }

      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) {
                resolve();
                return;
              }
              const done = () => resolve();
              img.addEventListener("load", done, { once: true });
              img.addEventListener("error", done, { once: true });
              window.setTimeout(done, 1200);
            })
        )
      );

      await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
      await new Promise((resolve) => window.setTimeout(resolve, 700));

      try {
        window.print();
      } catch {}

      window.setTimeout(() => {
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage("dcki-print-done", window.location.origin);
          }
        } catch {}
      }, 400);
    };
    window.setTimeout(() => {
      openPrintView();
    }, 250);
  }

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
