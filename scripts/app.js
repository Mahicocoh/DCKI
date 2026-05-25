import { mountLoader } from "./loader.js?v=202605260120";
import { initI18n } from "./i18n.js?v=202605260120";
import { setActiveNav, wireForms, mountAdviceNav, mountAppointmentPlanner, mountBudgetCalculator, mountM2Calculator, mountRentMaxCalculator, mountRateCalculator, mountWhatsAppFab, mountToTopFab, mountCardGalleries, mountFavorites, mountReveals, mountHeroTopbar, mountTopbarMenu, mountCountUps, mountTestimonials, mountTypewriters, mountDossierPrefill, mountConstructionToasts, mountSmartSearch, mountCantonBubbles, mountHomeSearchRanges, mountScrollIndicators } from "./ui.js?v=202605260120";
import { initRecherche } from "./recherche.js?v=202605260120";
import { initBiens } from "./biens.js?v=202605260120";
import { initHome } from "./home.js?v=202605260120";
import { initVideoFallbacks } from "./video-fallback.js?v=202605260120";
import { initListingPage } from "./listing-page.js?v=202605260120";

mountLoader();

initI18n();

setActiveNav();
mountTopbarMenu();
mountConstructionToasts();
mountAdviceNav();
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
initVideoFallbacks();
mountWhatsAppFab();
mountToTopFab();
mountCardGalleries();
mountFavorites();
mountScrollIndicators();
mountReveals();
mountCountUps();
mountTestimonials();
mountHeroTopbar();

const page = document.body.getAttribute("data-page");
if (page === "home") initHome();
if (page === "recherche") initRecherche();
if (page === "biens") initBiens();
if (page === "listing") initListingPage();
