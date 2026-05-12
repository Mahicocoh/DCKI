import { getListingFacts } from "./listings-data.js";
import { pickListingText, t, translateListingFeature, translatePropertyType, translateRegionName } from "./i18n.js?v=202606120001";
import { formatCHF, formatRooms, mountCardGalleries } from "./ui.js?v=202606120001";

export function listingCard(listing) {
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

  const titleText = pickListingText(listing, "title");
  const descText = pickListingText(listing, "description");
  const regionText = translateRegionName(listing.region);
  const typeText = translatePropertyType(listing.propertyType);

  const tags = (listing.tags || [])
    .slice(0, 3)
    .map((v) => `<span class="tag">${escapeHtml(translateListingFeature(v))}</span>`)
    .join("");
  const price = `${formatCHF(listing.price)}${listing.priceSuffix ? ` <span>${escapeHtml(listing.priceSuffix)}</span>` : ""}`;
  const desc = descText ? clampText(descText, 130) : "";
  const facts = getListingFacts(listing);
  const avail = facts.availableFrom ? t("listing.availableFrom", { date: facts.availableFrom }) : "";
  const meta = [
    `${escapeHtml(regionText)} — ${escapeHtml(listing.locality)}`,
    `${escapeHtml(typeText)} • ${formatRooms(listing.rooms)} • ${escapeHtml(String(listing.surface))} m²`,
  ].join(" • ");

  const href = `./bien.html?id=${encodeURIComponent(listing.id)}`;

  return `
    <article class="card listing ${statusLabel ? "is-unavailable" : ""}" data-id="${escapeHtml(listing.id)}">
      <a class="listing-link" data-rdv-link href="${escapeAttr(href)}" aria-label="${escapeAttr(t("listing.open"))}">
        <div class="media">
          <img src="${escapeAttr(listing.image)}" alt="${escapeAttr(titleText)}" loading="lazy" />
          ${statusLabel ? `<div class="status-ribbon">${escapeHtml(statusLabel)}</div>` : ""}
        </div>
        <div class="body">
          <div class="pill" style="margin-bottom:10px">
            <span style="width:8px;height:8px;border-radius:999px;background:${listing.category === "sale" ? "rgba(200,161,74,.95)" : "rgba(120,210,255,.85)"}"></span>
            <span style="font-size:13px">${escapeHtml(listing.category === "sale" ? t("biens.btn.sale") : t("biens.btn.rent"))}</span>
            <span style="opacity:.65;font-size:13px">•</span>
            <span style="opacity:.88;font-size:13px">${escapeHtml(typeText)}</span>
          </div>
          <h3>${escapeHtml(titleText)}</h3>
          <div class="meta">${escapeHtml(meta)}</div>
          ${avail ? `<div class="meta" style="margin-top:8px">${escapeHtml(avail)}</div>` : ""}
          ${desc ? `<p class="desc">${escapeHtml(desc)}</p>` : ""}
          <div class="chipRow">${tags}</div>
          <div class="listing-bottom">
            <div class="price">${price}</div>
            <span class="btn small primary" style="pointer-events:none">${escapeHtml(t("listing.details"))}</span>
          </div>
        </div>
      </a>
    </article>
  `;
}

export function renderListings(target, listings) {
  target.innerHTML = listings.map(listingCard).join("");
  mountCardGalleries();
}

export function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function escapeAttr(s) {
  return escapeHtml(s).replaceAll("\n", " ");
}

function clampText(s, maxLen) {
  const t = String(s || "").trim();
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}
