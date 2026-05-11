import { getListingFacts, getListingFeatures, getListingPhotos } from "./listings-data.js";
import { formatCHF, formatRooms, showToast, getQueryParams, mountTagIcons } from "./ui.js?v=202606110006";
import { loadListings } from "./listings-store.js?v=202606110009";
import { pickListingText, t, translateListingFeature, translatePropertyType, translateRegionName } from "./i18n.js?v=202606110006";

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

function tagHtml(label) {
  return `<span class="tag">${escapeHtml(label)}</span>`;
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
  const featuresEl = document.querySelector("[data-listing-features]");
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

  const features = getListingFeatures(listing, 36);
  const outFeatures = statusLabel ? [statusLabel, ...features.filter((f) => f !== statusLabel)] : features;
  if (featuresEl) {
    featuresEl.innerHTML = outFeatures.map((f) => tagHtml(translateListingFeature(f))).join("");
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
  mountTagIcons();

  window.addEventListener("dcki:lang", () => {
    if (currentListing) render(currentListing);
    mountTagIcons();
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
