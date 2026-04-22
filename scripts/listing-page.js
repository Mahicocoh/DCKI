import { CATEGORY_LABEL, getListingFacts, getListingFeatures, getListingPhotos } from "./listings-data.js";
import { formatCHF, formatRooms, showToast, getQueryParams } from "./ui.js";
import { loadListings } from "./listings-store.js";

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
  const statusRibbon = document.querySelector("[data-listing-status-ribbon]");

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
  const statusLabel = isSold ? "Vendu" : isRented ? "Loué" : "";
  const dotColor = listing.category === "sale" ? "rgba(200,161,74,.95)" : "rgba(64,140,255,.85)";
  if (pill) {
    pill.innerHTML = `
      <span style="width:10px;height:10px;border-radius:999px;background:${dotColor}"></span>
      <strong style="letter-spacing:.02em">${escapeHtml(CATEGORY_LABEL[listing.category] || "")}</strong>
      <span style="opacity:.65">•</span>
      <span style="opacity:.85">${escapeHtml(listing.propertyType)}</span>
      <span style="opacity:.65">•</span>
      <span style="opacity:.85">${escapeHtml(listing.id)}</span>
      ${statusLabel ? `<span style="opacity:.65">•</span><span style="opacity:.95">${escapeHtml(statusLabel)}</span>` : ""}
    `;
  }

  if (title) title.textContent = listing.title;
  if (meta) meta.textContent = `${listing.region} — ${listing.locality} • ${formatRooms(listing.rooms)} • ${listing.surface} m²`;

  const facts = getListingFacts(listing);
  if (availability) availability.textContent = facts.availableFrom ? `Disponible dès ${facts.availableFrom}` : "";

  const priceText = `${formatCHF(listing.price)}${listing.priceSuffix ? ` ${listing.priceSuffix}` : ""}`;
  if (price) price.textContent = priceText;

  if (factsEl) {
    factsEl.innerHTML = [
      facts.floor != null ? `<span class="tag">Étage ${escapeHtml(String(facts.floor))}</span>` : "",
      facts.bathrooms != null ? `<span class="tag">${escapeHtml(String(facts.bathrooms))} sdb</span>` : "",
      facts.newBuild ? `<span class="tag">Nouvelle construction</span>` : "",
      facts.parking ? `<span class="tag">Place de parc</span>` : "",
      facts.quietArea ? `<span class="tag">Quartier calme</span>` : "",
      facts.childrenFriendly ? `<span class="tag">Adapté aux enfants</span>` : "",
    ]
      .filter(Boolean)
      .join("");
  }

  if (desc) desc.textContent = listing.description || "";

  const features = getListingFeatures(listing, 36);
  const outFeatures = statusLabel ? [statusLabel, ...features.filter((f) => f !== statusLabel)] : features;
  if (featuresEl) featuresEl.innerHTML = outFeatures.map((f) => `<span class="tag">${escapeHtml(f)}</span>`).join("");

  const mapQuery = `${listing.locality}, ${listing.region}, Suisse`;
  const mapQ = encodeURIComponent(mapQuery);
  if (mapIframe) {
    mapIframe.src = `https://www.google.com/maps?q=${mapQ}&output=embed`;
    mapIframe.title = mapQuery;
  }
  if (openMaps) openMaps.href = `https://www.google.com/maps?q=${mapQ}`;

  state.photos = getListingPhotos(listing, 10);
  setPhoto(0);

  const img = document.querySelector("[data-gallery-img]");
  if (img) img.alt = listing.title;
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
    const type = listing.category === "sale" ? "Achat" : "Location";
    dossierBtn.setAttribute(
      "href",
      `./dossier.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(listing.id)}`
    );
  }

  const isUnavailable = isSold || isRented;
  if (isUnavailable) {
    const cta = document.querySelector(".cta");
    if (cta instanceof HTMLElement) {
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
          <div class="k">Indisponible</div>
          <div class="v">Ce bien est ${escapeHtml(statusLabel)}. Les demandes sont désactivées.</div>
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
    const desired = new Set([
      "Demande de visite",
      isSale ? "Acheter un bien" : "Louer un bien",
      "Question",
    ]);
    for (const opt of Array.from(visitType.options)) {
      const label = (opt.textContent || "").trim();
      if (!desired.has(label)) opt.remove();
    }
    visitType.value = "Demande de visite";
  }

  if (isUnavailable && visitForm instanceof HTMLFormElement) {
    visitForm.classList.add("is-disabled");
    const controls = visitForm.querySelectorAll("input, select, textarea, button");
    for (const el of Array.from(controls)) {
      if (el instanceof HTMLInputElement) el.disabled = true;
      else if (el instanceof HTMLSelectElement) el.disabled = true;
      else if (el instanceof HTMLTextAreaElement) el.disabled = true;
      else if (el instanceof HTMLButtonElement) el.disabled = true;
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
    showToast("Bien introuvable.");
    window.location.replace("./biens.html");
    return;
  }

  render(listing);

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
