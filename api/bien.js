import { json } from "./_lib/http.js";
import { getListings } from "./_lib/store.js";

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stripTags(s) {
  return String(s ?? "").replace(/<[^>]*>/g, " ");
}

function normalizeSpaces(s) {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(s, max = 180) {
  const v = normalizeSpaces(s);
  if (v.length <= max) return v;
  return v.slice(0, max - 1).trimEnd() + "…";
}

function getProto(req) {
  const xf = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  if (xf) return xf;
  return "https";
}

function getHost(req) {
  return String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    json(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  const url = new URL(req.url, "http://localhost");
  const id = String(url.searchParams.get("id") || "").trim();

  let listing = null;
  try {
    const listings = await getListings();
    listing = Array.isArray(listings) ? listings.find((l) => String(l?.id || "").trim() === id) : null;
  } catch {}

  const proto = getProto(req);
  const host = getHost(req);
  const origin = host ? `${proto}://${host}` : "";

  const titleBase = listing?.title ? String(listing.title) : "Bien — DCKImmo";
  const locality = listing?.locality ? String(listing.locality) : "";
  const region = listing?.region ? String(listing.region) : "";
  const title = normalizeSpaces([titleBase, [locality, region].filter(Boolean).join(", ")].filter(Boolean).join(" — "));

  const descRaw = listing?.description || "";
  const desc = truncate(stripTags(descRaw), 220) || "Découvrez ce bien immobilier sur DCKImmo.";
  const image = String(listing?.image || "").trim();

  const pageUrl = origin ? `${origin}/bien?id=${encodeURIComponent(id)}` : "";
  const targetUrl = `/bien.html?id=${encodeURIComponent(id)}`;

  const jsonLdText = (() => {
    if (!listing) return "";
    const schema = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: title,
      url: pageUrl || undefined,
      image: image ? [image] : undefined,
      description: desc || undefined,
      address: {
        "@type": "PostalAddress",
        addressLocality: locality || undefined,
        addressRegion: region || undefined,
        addressCountry: "CH",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "CHF",
        price: Number.isFinite(Number(listing?.price)) ? Number(listing.price) : undefined,
        url: pageUrl || undefined,
      },
      numberOfRooms: Number.isFinite(Number(listing?.rooms)) ? Number(listing.rooms) : undefined,
      floorSize: Number.isFinite(Number(listing?.surface))
        ? { "@type": "QuantitativeValue", value: Number(listing.surface), unitText: "MTK" }
        : undefined,
    };
    const compact = JSON.parse(JSON.stringify(schema));
    return JSON.stringify(compact).replace(/</g, "\\u003c");
  })();

  const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(desc)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(desc)}" />
    ${pageUrl ? `<meta property="og:url" content="${escapeHtml(pageUrl)}" />` : ""}
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ""}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(desc)}" />
    ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ""}
    ${jsonLdText ? `<script type="application/ld+json">${jsonLdText}</script>` : ""}
  </head>
  <body>
    <script>
      (function () {
        var url = ${JSON.stringify(targetUrl)};
        try { window.location.replace(url); } catch (e) { window.location.href = url; }
      })();
    </script>
    <noscript>
      <p><a href="${escapeHtml(targetUrl)}">Ouvrir le bien</a></p>
    </noscript>
  </body>
</html>`;

  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(html);
}
