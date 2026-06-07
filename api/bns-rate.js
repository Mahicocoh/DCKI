import { json } from "./_lib/http.js";

function isoDate(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function fetchBnsRate() {
  const now = new Date();
  const from = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);
  const url = `https://data.snb.ch/api/cube/snbgwdzid/data/json/en?fromDate=${encodeURIComponent(isoDate(from))}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`SNB HTTP ${res.status}`);
    const data = await res.json();
    const values = data?.timeseries?.[0]?.values;
    if (!Array.isArray(values) || !values.length) throw new Error("SNB data vide");
    const last = values[values.length - 1];
    const rate = Number(last?.value);
    if (!Number.isFinite(rate)) throw new Error("Valeur taux invalide");
    const date = String(last?.date || "");
    return { rate, date };
  } finally {
    clearTimeout(t);
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    json(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const out = await fetchBnsRate();
    json(
      res,
      200,
      { ok: true, ...out },
      { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" }
    );
  } catch (e) {
    json(res, 502, { ok: false, error: "SNB fetch failed" }, { "Cache-Control": "no-store" });
  }
}

