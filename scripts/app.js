import { mountLoader } from "./loader.js?v=202606120001";
import { initI18n } from "./i18n.js?v=202606120001";
import { setActiveNav, wireForms, mountAdviceNav, mountAppointmentPlanner, mountBudgetCalculator, mountM2Calculator, mountRentMaxCalculator, mountRateCalculator, mountWhatsAppFab, mountToTopFab, mountCardGalleries, mountReveals, mountHeroTopbar, mountTopbarMenu, mountCountUps, mountTestimonials, mountTypewriters, mountDossierPrefill, mountTagIcons, mountConstructionToasts } from "./ui.js?v=202606120001";
import { initRecherche } from "./recherche.js?v=202606120001";
import { initBiens } from "./biens.js?v=202606120001";
import { initHome } from "./home.js";
import { initVideoFallbacks } from "./video-fallback.js";
import { initListingPage } from "./listing-page.js?v=202606120001";

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
mountAppointmentPlanner();
mountTypewriters();
mountDossierPrefill();
initVideoFallbacks();
mountWhatsAppFab();
mountToTopFab();
mountCardGalleries();
mountReveals();
mountCountUps();
mountTestimonials();
mountHeroTopbar();

const page = document.body.getAttribute("data-page");
if (page === "home") initHome();
if (page === "recherche") initRecherche();
if (page === "biens") initBiens();
if (page === "listing") initListingPage();
mountTagIcons();
