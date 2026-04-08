import { CATEGORY_LABEL, getListingFacts } from "./listings-data.js";
import { formatCHF, formatRooms } from "./ui.js";

export function listingCard(listing) {
  const statusLabel = listing.status === "sold" ? "Vendu" : listing.status === "rented" ? "Loué" : "";
  const tags = (listing.tags || []).slice(0, 3).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");
  const price = `${formatCHF(listing.price)}${listing.priceSuffix ? ` <span>${escapeHtml(listing.priceSuffix)}</span>` : ""}`;
  const desc = listing.description ? clampText(listing.description, 130) : "";
  const facts = getListingFacts(listing);
  const avail = facts.availableFrom ? `Disponible dès ${facts.availableFrom}` : "";
  const meta = [
    `${escapeHtml(listing.region)} — ${escapeHtml(listing.locality)}`,
    `${escapeHtml(listing.propertyType)} • ${formatRooms(listing.rooms)} • ${escapeHtml(String(listing.surface))} m²`,
  ].join(" • ");

  const href = `./bien.html?id=${encodeURIComponent(listing.id)}`;

  return `
    <article class="card listing ${statusLabel ? "is-unavailable" : ""}" data-id="${escapeHtml(listing.id)}">
      <a class="listing-link" href="${escapeAttr(href)}" aria-label="Ouvrir le détail du bien">
        <div class="media">
          <img src="${escapeAttr(listing.image)}" alt="${escapeAttr(listing.title)}" loading="lazy" />
          ${statusLabel ? `<div class="status-ribbon">${escapeHtml(statusLabel)}</div>` : ""}
        </div>
        <div class="body">
          <div class="pill" style="margin-bottom:10px">
            <span style="width:8px;height:8px;border-radius:999px;background:${listing.category === "sale" ? "rgba(200,161,74,.95)" : "rgba(120,210,255,.85)"}"></span>
            <span style="font-size:13px">${escapeHtml(CATEGORY_LABEL[listing.category] || "")}</span>
            <span style="opacity:.65;font-size:13px">•</span>
            <span style="opacity:.88;font-size:13px">${escapeHtml(listing.propertyType)}</span>
          </div>
          <h3>${escapeHtml(listing.title)}</h3>
          <div class="meta">${escapeHtml(meta)}</div>
          ${avail ? `<div class="meta" style="margin-top:8px">${escapeHtml(avail)}</div>` : ""}
          ${desc ? `<p class="desc">${escapeHtml(desc)}</p>` : ""}
          <div class="chipRow">${tags}</div>
          <div class="listing-bottom">
            <div class="price">${price}</div>
            <span class="btn small primary" style="pointer-events:none">Détails</span>
          </div>
        </div>
      </a>
    </article>
  `;
}

export function renderListings(target, listings) {
  target.innerHTML = listings.map(listingCard).join("");
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
