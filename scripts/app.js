import { mountLoader } from "./loader.js?v=202606121300";
import { initI18n } from "./i18n.js?v=202606102610";
import { setActiveNav, wireForms, mountAdviceNav, mountConseilsMobileHover, mountAppointmentPlanner, mountBudgetCalculator, mountM2Calculator, mountRentMaxCalculator, mountRateCalculator, mountWhatsAppFab, mountToTopFab, mountCardGalleries, mountFavorites, mountReveals, mountTeamBadgeSlide, mountContactValuesSlide, mountDossierChecklist, mountTopbarMenu, mountCountUps, mountTestimonials, mountTypewriters, mountDossierPrefill, mountConstructionToasts, mountPartnerComingSoonModal, mountSmartSearch, mountCantonBubbles, mountHomeSearchRanges, mountScrollIndicators, mountBnsRate, mountMobileHorizontalGuard, mountMobileTopPullGuard } from "./ui.js?v=202606120220";

const FALLBACK_PUBLIC_BASE_URL = "https://dckimmo.ch/";
const FALLBACK_CONTACT_EMAIL = "contact@dckimmo.ch";
const loadPageScript = (loader) => {
  Promise.resolve()
    .then(loader)
    .catch(() => {});
};

function clearReloadMask() {
  const root = document.documentElement;
  const body = document.body;
  if (!root || !body) return;

  root.classList.remove("snapshot-blank");
  root.classList.remove("boot-loading");
  body.classList.remove("reload-masking");

  const mask = body.querySelector(".boot-mask[data-boot-mask]");
  if (mask instanceof HTMLElement) {
    mask.style.opacity = "0";
    mask.style.visibility = "hidden";
  }
}

function ensureFavicons() {
  const head = document.head;
  if (!head) return;

  const ensure = (rel, attrs) => {
    let link = head.querySelector(`link[rel="${rel}"]`);
    if (!(link instanceof HTMLLinkElement)) {
      link = document.createElement("link");
      link.rel = rel;
      head.appendChild(link);
    }
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null) continue;
      link.setAttribute(k, String(v));
    }
  };

  ensure("icon", { href: "/favicon.png", type: "image/png", sizes: "32x32" });
  ensure("apple-touch-icon", { href: "/apple-touch-icon.png" });
}

window.addEventListener(
  "pageshow",
  (e) => {
    if (e?.persisted) clearReloadMask();
  },
  { capture: true }
);

document.addEventListener(
  "visibilitychange",
  () => {
    if (!document.hidden) clearReloadMask();
  },
  { capture: true }
);

clearReloadMask();
ensureFavicons();

function ensureTrailingSlash(url) {
  const s = String(url || "").trim();
  if (!s) return "";
  return s.endsWith("/") ? s : `${s}/`;
}

function getRuntimePublicBaseUrl() {
  const origin = String(window.location.origin || "").trim();
  const protocol = String(window.location.protocol || "").trim();
  if (origin && !/^file:$/i.test(protocol)) {
    return ensureTrailingSlash(origin);
  }
  return FALLBACK_PUBLIC_BASE_URL;
}

function getRuntimeContactEmail() {
  const meta = document.querySelector('meta[name="dcki-contact-email"]');
  if (meta instanceof HTMLMetaElement) {
    const v = String(meta.content || "").trim();
    if (v) return v;
  }
  return FALLBACK_CONTACT_EMAIL;
}

function applyRuntimeSiteConfig() {
  const publicBaseUrl = getRuntimePublicBaseUrl();
  const contactEmail = getRuntimeContactEmail();

  const publicBaseMeta = document.querySelector('meta[name="dcki-public-base-url"]');
  if (publicBaseMeta instanceof HTMLMetaElement) {
    publicBaseMeta.content = publicBaseUrl;
  }

  const emailMeta = document.querySelector('meta[name="dcki-contact-email"]');
  if (emailMeta instanceof HTMLMetaElement) {
    emailMeta.content = contactEmail;
  }

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) return;
    if (link.closest("[data-listing-share]")) return;
    if (link.classList.contains("social-btn")) return;

    const currentText = String(link.textContent || "").trim();
    const currentHref = String(link.getAttribute("href") || "").trim();
    const canReplaceText = link.childElementCount === 0;
    const shouldReplaceText =
      canReplaceText &&
      !currentText ||
      currentText === FALLBACK_CONTACT_EMAIL ||
      /^contact@/i.test(currentText);

    if (shouldReplaceText) link.textContent = contactEmail;
    if (!currentHref.startsWith("mailto:?")) {
      link.href = `mailto:${contactEmail}`;
    }
  });
}

function markInternalNavigationIntent() {
  if (document.body?.dataset.internalNavBound === "1") return;
  document.body.dataset.internalNavBound = "1";

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(target instanceof HTMLAnchorElement)) return;
      if (target.hasAttribute("download")) return;
      if (target.target && target.target !== "_self") return;
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const rawHref = String(target.getAttribute("href") || "").trim();
      if (!rawHref || rawHref.startsWith("#")) return;

      let url;
      try {
        url = new URL(target.href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      try {
        window.sessionStorage?.setItem("dcki_internal_nav", "1");
      } catch {}
    },
    true
  );
}

const page = document.body.getAttribute("data-page");
if (page !== "coming-soon") {
  markInternalNavigationIntent();
  mountLoader();
  applyRuntimeSiteConfig();
  initI18n();
  if (page === "home" || page === "recherche") {
    loadPageScript(() => import("./voice-search.js?v=202606081915").then((m) => m.initVoiceSearch()));
  }

  setActiveNav();
  mountTopbarMenu();
  mountMobileHorizontalGuard();
  mountMobileTopPullGuard();
  mountConstructionToasts();
  mountPartnerComingSoonModal();
  mountAdviceNav();
  mountConseilsMobileHover();
  mountBnsRate();
  mountBudgetCalculator();
  mountM2Calculator();
  mountRentMaxCalculator();
  mountRateCalculator();
  wireForms();
  mountSmartSearch();
  mountHomeSearchRanges();
  mountCantonBubbles();
  mountAppointmentPlanner();
  mountTypewriters();
  mountDossierPrefill();
  mountDossierChecklist();
  mountWhatsAppFab();
  mountToTopFab();
  mountCardGalleries();
  mountFavorites();
  mountScrollIndicators();
  mountReveals();
  mountTeamBadgeSlide();
  mountContactValuesSlide();
  mountCountUps();
  mountTestimonials();
  loadPageScript(() => import("./video-fallback.js?v=202606081915").then((m) => m.initVideoFallbacks()));
}
if (page === "home") loadPageScript(() => import("./home.js?v=202606164410").then((m) => m.initHome()));
if (page === "recherche") loadPageScript(() => import("./recherche.js?v=202606081915").then((m) => m.initRecherche()));
if (page === "biens") loadPageScript(() => import("./biens.js?v=202606081915").then((m) => m.initBiens()));
if (page === "listing") loadPageScript(() => import("./listing-page.js?v=202606163010").then((m) => m.initListingPage()));
if (page === "coming-soon") loadPageScript(() => import("./coming-soon.js?v=202606081915").then((m) => m.initComingSoon()));
