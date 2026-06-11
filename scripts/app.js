import { mountLoader } from "./loader.js?v=202606120045";
import { initI18n } from "./i18n.js?v=202606102610";
import { setActiveNav, wireForms, mountAdviceNav, mountConseilsMobileHover, mountAppointmentPlanner, mountBudgetCalculator, mountM2Calculator, mountRentMaxCalculator, mountRateCalculator, mountWhatsAppFab, mountToTopFab, mountCardGalleries, mountFavorites, mountReveals, mountTeamBadgeSlide, mountContactValuesSlide, mountDossierChecklist, mountTopbarMenu, mountCountUps, mountTestimonials, mountTypewriters, mountDossierPrefill, mountConstructionToasts, mountPartnerComingSoonModal, mountSmartSearch, mountCantonBubbles, mountHomeSearchRanges, mountScrollIndicators, mountBnsRate, mountMobileHorizontalGuard } from "./ui.js?v=202606101600";
import { initRecherche } from "./recherche.js?v=202606081915";
import { initBiens } from "./biens.js?v=202606081915";
import { initHome } from "./home.js?v=202606081915";
import { initVideoFallbacks } from "./video-fallback.js?v=202606081915";
import { initListingPage } from "./listing-page.js?v=202606081915";
import { initVoiceSearch } from "./voice-search.js?v=202606081915";
import { initComingSoon } from "./coming-soon.js?v=202606081915";

const FALLBACK_PUBLIC_BASE_URL = "https://dckimmo.ch/";
const FALLBACK_CONTACT_EMAIL = "contact@dckimmo.ch";

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
  initVoiceSearch();

  setActiveNav();
  mountTopbarMenu();
  mountMobileHorizontalGuard();
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
  initVideoFallbacks();
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
}
if (page === "home") initHome();
if (page === "recherche") initRecherche();
if (page === "biens") initBiens();
if (page === "listing") initListingPage();
if (page === "coming-soon") initComingSoon();
