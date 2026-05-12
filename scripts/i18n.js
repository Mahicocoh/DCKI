const LS_KEY = "dcki_lang";
const SUPPORTED = new Set(["fr", "en"]);

const DICT = {
  fr: {
    "lang.fr": "FR",
    "lang.en": "EN",
    "lang.label": "Langue",
    "lang.fr.full": "Français",
    "lang.en.full": "English",

    "nav.home": "Accueil",
    "nav.home.sub": "Retour à la page d’accueil",
    "nav.properties": "Nos biens",
    "nav.properties.sub": "Découvrez nos propriétés",
    "nav.search": "Recherche",
    "nav.search.sub": "Trouvez le bien idéal",
    "nav.advice": "Conseils",
    "nav.advice.sub": "Nos guides et conseils",
    "nav.dossier": "Demande de dossier",
    "nav.dossier.sub": "Documents et formulaire",
    "nav.contact": "Contact",
    "nav.contact.sub": "Parlons de votre projet",
    "nav.admin": "Admin",
    "nav.admin.sub": "Espace administrateur",

    "page.adminLogin.title": "Connexion — Admin",
    "page.admin.title": "Admin — Biens",
    "admin.topTitle": "Administration",
    "admin.login.title": "Connexion",
    "admin.login.lead": "Accès réservé à l’administration.",
    "admin.login.username": "Utilisateur",
    "admin.login.password": "Mot de passe",
    "admin.login.signIn": "Se connecter",
    "admin.login.back": "Retour",
    "admin.login.tip": "Astuce: les identifiants sont configurés côté serveur.",
    "admin.login.failed": "Connexion impossible.",

    "admin.leftTitle": "Biens",
    "admin.actions.new": "Nouveau",
    "admin.actions.refresh": "Rafraîchir",
    "admin.search.label": "Recherche",
    "admin.search.placeholder": "Référence, titre, localité…",
    "admin.count.total": "Total",
    "admin.actions.logout": "Déconnexion",

    "admin.editor.title": "Éditeur",
    "admin.editor.lead": "Modifie un bien, enregistre, et c’est visible sur le site.",
    "admin.actions.save": "Enregistrer",
    "admin.actions.delete": "Supprimer",

    "admin.fields.referenceId": "Référence (id)",
    "admin.fields.category": "Catégorie",
    "admin.fields.status": "Statut",
    "admin.fields.type": "Type",
    "admin.fields.title": "Titre",
    "admin.fields.description": "Description",
    "admin.fields.region": "Région",
    "admin.fields.locality": "Localité",
    "admin.fields.rooms": "Pièces",
    "admin.fields.area": "Surface (m²)",
    "admin.fields.price": "Prix",
    "admin.fields.priceSuffix": "Suffixe prix",
    "admin.fields.tags": "Tags",
    "admin.fields.mainImageUrl": "Image principale (URL)",
    "admin.fields.gallery": "Galerie",
    "admin.fields.preview": "Aperçu",

    "admin.status.available": "Disponible",
    "admin.placeholders.propertyType": "Appartement / Maison / Villa",
    "admin.placeholders.region": "Jura / Jura bernois",
    "admin.placeholders.tag": "Ajouter un tag…",
    "admin.actions.add": "Ajouter",
    "admin.actions.upload": "Uploader",
    "admin.photos.dropzoneHint": "Glisser-déposer des images ici, ou utiliser l’upload.",
    "admin.placeholders.url": "Ajouter une URL…",

    "admin.toast.refreshed": "Données rafraîchies.",
    "admin.toast.referenceRequired": "Référence requise.",
    "admin.toast.created": "Bien créé.",
    "admin.toast.saved": "Bien enregistré.",
    "admin.toast.deleted": "Bien supprimé.",
    "admin.toast.photosAdded": "Photos ajoutées.",
    "admin.toast.mainImageUpdated": "Image principale mise à jour.",
    "admin.toast.error": "Erreur.",
    "admin.toast.uploadFailed": "Upload impossible.",
    "admin.confirm.delete": "Supprimer {id} ?",

    "menu.label": "Menu",
    "menu.social": "Réseaux",
    "menu.call": "Appeler le 078 733 87 17",
    "menu.hours": "Lu – Ve, 08h00 – 18h30",
    "top.backToTop": "Remonter en haut",
    "top.goHome": "Aller à l’accueil",

    "footer.tagline": "Propriétés à vendre et à louer dans le Jura & Jura bernois.",
    "footer.tagline.split.1": "Propriétés à vendre et à louer dans le ",
    "footer.tagline.split.2": "Jura & Jura bernois",
    "footer.tagline.split.3": ".",
    "footer.note": "Contact direct, transparence et accompagnement.",
    "footer.nav": "Navigation",
    "footer.contact": "Contact",
    "footer.newsletter": "Newsletter",
    "footer.newsletter.note": "Recevez nos nouveautés en avant-première.",
    "footer.newsletter.placeholder": "Votre e-mail",
    "footer.newsletter.submitAria": "S’inscrire",
    "footer.privacy": "Aucune publicité. Désinscription en 1 clic.",
    "footer.legal": "Mentions légales • Politique de confidentialité",

    "common.searchProperty": "Rechercher un bien",
    "common.viewProperties": "Voir les biens",
    "common.openMaps": "Ouvrir dans Maps",
    "common.maps3d": "Vue 3D Google Maps",
    "common.close": "Fermer",

    "home.tagline": "Trouver le bien idéal, près de chez vous.",
    "home.services.aria": "Services",
    "home.services.sale": "Ventes",
    "home.services.rent": "Locations",
    "home.services.advice": "Conseils",
    "home.services.support": "Accompagnement",
    "home.cta.search": "Rechercher un bien",
    "home.cta.view": "Voir les biens",

    "actions.viewAll": "Tout voir",
    "actions.learnMore": "En savoir plus",
    "actions.contactUs": "Nous contacter",
    "actions.bookAppointment": "Prendre rendez-vous",

    "home.deals.title": "Bonnes affaires",
    "home.deals.subtitle": "Prix attractifs, biens à saisir et opportunités du moment.",
    "home.deals.aria": "Bonnes affaires",
    "home.deals.badge.priceDrop": "Baisse de prix",
    "home.deals.badge.utilitiesIncluded": "Charges incluses",
    "home.deals.badge.topPick": "Coup de cœur",
    "home.deals.badge.availableNow": "Disponible de suite",
    "home.priceSuffix.month": "/mois",

    "home.mapCta.text": "Un accompagnement local et personnalisé, de A à Z.",

    "home.news.title": "Actualités immobilières",
    "home.news.subtitle": "Suivez les tendances du marché",
    "carousel.prevAria": "Carte précédente",
    "carousel.nextAria": "Carte suivante",
    "home.news.slide.market.aria": "Marché",
    "home.news.slide.market.tag": "Marché",
    "home.news.slide.market.title": "Marché 2025",
    "home.news.slide.market.sub": "Tendances et perspectives",
    "home.news.slide.outlook.aria": "Perspectives",
    "home.news.slide.outlook.tag": "Perspectives",
    "home.news.slide.outlook.title": "Perspectives 2026",
    "home.news.slide.outlook.sub": "Évolution des prix en Suisse",
    "home.news.slide.rent.aria": "Location",
    "home.news.slide.rent.tag": "Location",
    "home.news.slide.rent.title": "Location",
    "home.news.slide.rent.sub": "Demande et évolution des loyers",
    "home.news.slide.risk.aria": "Risque",
    "home.news.slide.risk.tag": "Risque",
    "home.news.slide.risk.title": "Risque",
    "home.news.slide.risk.sub": "Risque de bulle: points de vigilance",
    "home.news.slide.advice.aria": "Conseils",
    "home.news.slide.advice.tag": "Conseil",
    "home.news.slide.advice.title": "Conseils",
    "home.news.slide.advice.sub": "Préparer un dossier solide rapidement",
    "home.side.rateBns": "Taux BNS",
    "home.side.readUbs": "Lire l’analyse UBS",
    "home.side.readUbsSub": "Découvrir les dernières analyses",

    "home.services.title": "Nos services",
    "home.services.intro": "Vente, location, dossier et visites — une approche simple et transparente pour gagner du temps à chaque étape.",
    "home.services.detailedAria": "Nos services détaillés",
    "home.services.s1.title": "Vente de biens",
    "home.services.s1.lead": "Biens sélectionnés, informations essentielles, présentation claire.",
    "home.services.s1.i1.k": "Sélection rigoureuse",
    "home.services.s1.i1.p": "Nous choisissons les biens avec soin.",
    "home.services.s1.i2.k": "Mise en valeur du bien",
    "home.services.s1.i2.p": "Photos professionnelles, annonces attractives.",
    "home.services.s1.i3.k": "Diffusion ciblée",
    "home.services.s1.i3.p": "Visibilité maximale sur les plateformes.",
    "home.services.s1.cta": "Voir les ventes",
    "home.services.s2.title": "Location de biens",
    "home.services.s2.lead": "Annonces à jour, détails complets, démarche simple et rapide.",
    "home.services.s2.i1.k": "Annonces actualisées",
    "home.services.s2.i1.p": "Visibilité assurée grâce à des annonces régulières.",
    "home.services.s2.i2.k": "Dossiers complets",
    "home.services.s2.i2.p": "Vérification rigoureuse des dossiers des candidats.",
    "home.services.s2.i3.k": "Processus rapide",
    "home.services.s2.i3.p": "Mise en location simplifiée et efficace.",
    "home.services.s2.cta": "Voir les locations",
    "home.services.s3.title": "Préparation de dossier",
    "home.services.s3.lead": "Dossier structuré et prêt à l’envoi pour accélérer le traitement.",
    "home.services.s3.i1.k": "Documents rassemblés",
    "home.services.s3.i1.p": "Tous les papiers essentiels collectés.",
    "home.services.s3.i2.k": "Dossier structuré",
    "home.services.s3.i2.p": "Présentation organisée et ordonnée.",
    "home.services.s3.i3.k": "Envoi rapide",
    "home.services.s3.i3.p": "Gain de temps et début du traitement immédiat.",
    "home.services.s3.cta": "En savoir plus",
    "home.services.s4.title": "Organisation des visites",
    "home.services.s4.lead": "Visites planifiées selon vos disponibilités, contact direct.",
    "home.services.s4.i1.k": "Créneaux flexibles",
    "home.services.s4.i1.p": "Choisissez les créneaux qui vous conviennent.",
    "home.services.s4.i2.k": "Accompagnement sur place",
    "home.services.s4.i2.p": "Visite guidée par un professionnel expérimenté.",
    "home.services.s4.i3.k": "Échanges directs",
    "home.services.s4.i3.p": "Communication rapide et efficace.",
    "home.services.s4.cta": "Voir les disponibilités",

    "home.partners.k": "RÉSEAU LOCAL SOLIDE",
    "home.partners.title": "Nos partenaires de confiance",
    "home.partners.lead": "Nous collaborons avec des partenaires locaux soigneusement sélectionnés pour vous offrir un service complet, fiable et de qualité.",
    "home.partners.aria": "Partenaires",
    "home.partners.p1.pill": "Conseil personnalisé",
    "home.partners.p1.desc": "Conseil fiscal et optimisation fiscale pour particuliers.",
    "home.partners.p2.pill": "Service rapide et local",
    "home.partners.p2.desc": "Vente, livraison et réparation d’appareils électroménagers pour votre logement.",
    "home.partners.p3.pill": "Expertise & sécurité",
    "home.partners.p3.desc": "Installations électriques, réseaux et solutions techniques.",
    "home.partners.p4.pill": "Propreté & fiabilité",
    "home.partners.p4.desc": "Services de nettoyage pour particuliers et professionnels.",

    "home.testimonials.title": "Avis clients",
    "home.testimonials.viewAll": "Voir tous les avis",
    "home.testimonials.navAria": "Navigation des avis",
    "home.testimonials.prevAria": "Avis précédent",
    "home.testimonials.nextAria": "Avis suivant",
    "home.testimonials.dotsAria": "Sélecteur d’avis",
    "home.testimonials.q1": "J’ai fait appel à DCKImmo pour la vente d’un bien. Le dossier était clair et parfaitement préparé, et la communication très réactive.",
    "home.testimonials.w1": "Client vente, Courrendlin",
    "home.testimonials.q2": "Visite rapide, réponses claires et dossier parfaitement préparé. Très pro.",
    "home.testimonials.w2": "Client achat, Moutier",
    "home.testimonials.q3": "On a trouvé exactement ce qu’on cherchait. Suivi 7j/7 et très disponible.",
    "home.testimonials.w3": "Client location, Courrendlin",
    "home.testimonials.q4": "Estimation précise et mise en valeur du bien. Photos + annonce top.",
    "home.testimonials.w4": "Client, Courtételle",

    "home.examples.title": "Nos biens",
    "home.examples.subtitle": "Découvrez une sélection de biens à vendre et à louer.",
    "home.examples.viewAll": "Voir tous les biens",

    "home.perf.aria": "Performance immobilière",
    "home.perf.kicker": "Notre performance",
    "home.perf.title": "Tableau de bord",
    "home.perf.sub": "Suivez notre performance sur nos biens et nos résultats.",
    "home.kpi.sold": "Biens vendus",
    "home.kpi.rented": "Biens loués",
    "home.kpi.satisfaction": "Satisfaction",
    "home.kpi.period": "Sur les dernières années",
    "home.map.sector": "Notre secteur d’activité",
    "home.map.jura.title": "Canton du Jura",
    "home.map.jura.lead": "À vos côtés dans tout le Canton du Jura.",
    "home.map.jura.imgAlt": "Carte du Canton du Jura",
    "home.map.bern.title": "Canton de Berne",
    "home.map.bern.lead": "À vos côtés dans tout le Canton de Berne.",
    "home.map.bern.imgAlt": "Carte du Canton de Berne",

    "search.tabs.all": "Tous",
    "search.tabs.rent": "Louer",
    "search.tabs.buy": "Acheter",
    "search.where": "Où?",
    "search.where.placeholder": "Localité, NPA, Canton...",
    "search.priceFrom": "Prix de",
    "search.priceTo": "à",
    "search.min": "min",
    "search.max": "max",
    "search.roomsFrom": "Pièces de",
    "search.any": "indiff.",
    "search.more": "Plus de filtres",
    "search.region": "Région",
    "search.region.all": "Toutes",
    "search.type": "Type",
    "search.type.all": "Tous",
    "search.surfaceMin": "Surface min (m²)",
    "search.cityExact": "Commune (exacte)",
    "search.features": "Caractéristiques",
    "search.submit": "Rechercher",

    "type.apartment": "Appartement",
    "type.house": "Maison",
    "type.villa": "Villa",
    "tag.fireplace": "Cheminée",
    "tag.garden": "Jardin",
    "tag.terrace": "Terrasse",
    "tag.balcony": "Balcon",
    "tag.garage": "Garage",
    "tag.elevator": "Ascenseur",
    "tag.quiet": "Calme",
    "tag.renovated": "Rénové",
    "tag.new": "Neuf",
    "tag.nearStation": "Proche gare",

    "feature.pool": "Piscine",
    "feature.cellar": "Cave",
    "feature.attic": "Grenier",
    "feature.laundryRoom": "Buanderie",
    "feature.sharedLaundry": "Laverie commune",
    "feature.outdoorParking": "Parking extérieur",
    "feature.coveredParking": "Place couverte",
    "feature.bikeStorage": "Local vélos",
    "feature.solarPanels": "Panneaux solaires",
    "feature.heatPump": "Pompe à chaleur",
    "feature.underfloorHeating": "Chauffage au sol",
    "feature.doubleGlazing": "Double vitrage",
    "feature.electricBlinds": "Stores électriques",
    "feature.equippedKitchen": "Cuisine équipée",
    "feature.openKitchen": "Cuisine ouverte",
    "feature.walkInCloset": "Dressing",
    "feature.masterSuite": "Suite parentale",
    "feature.bathtub": "Baignoire",
    "feature.walkInShower": "Douche à l’italienne",
    "feature.openView": "Vue dégagée",
    "feature.nearSchools": "Proche écoles",
    "feature.nearShops": "Proche commerces",
    "feature.highwayAccess": "Accès autoroute",
    "feature.noOverlooking": "Sans vis-à-vis",
    "feature.fiberInternet": "Fibre optique",
    "feature.homeAutomation": "Domotique",
    "feature.intercom": "Interphone",
    "feature.securityDoor": "Porte sécurisée",
    "feature.petsAllowed": "Animaux acceptés",
    "feature.furnished": "Meublé",
    "feature.highCeilings": "Hauteur sous plafond",
    "feature.woodFlooring": "Parquet",
    "feature.tile": "Carrelage",
    "feature.southFacing": "Orientation sud",
    "feature.accessible": "Accès PMR",
    "feature.utilitiesIncluded": "Charges comprises",
    "feature.bright": "Lumineux",
    "feature.mountainView": "Vue montagne",
    "feature.countrysideView": "Vue campagne",
    "feature.storageSpace": "Coins rangement",
    "feature.workshop": "Atelier",
    "feature.gardenShed": "Cabanon",
    "feature.automaticIrrigation": "Arrosage automatique",
    "feature.electricGate": "Portail électrique",
    "feature.cameras": "Caméras",
    "feature.spa": "Spa / Jacuzzi",
    "feature.gym": "Salle de sport",
    "feature.homeTheater": "Home cinéma",
    "feature.office": "Bureau",

    "toast.construction": "Site en construction",
    "toast.form.sent": "{label} envoyé.",
    "toast.form.fail": "Impossible d’envoyer. Réessayez.",
    "toast.form.demo": "{label} prêt. Ajoutez un lien d’envoi pour recevoir les fichiers.",
    "files.none": "Aucun fichier sélectionné",
    "files.one": "1 fichier sélectionné",
    "files.many": "{count} fichiers sélectionnés",

    "loader.barAria": "Chargement",
    "loader.hint": "Chargement de DCKImmo…",

    "dossier.title": "Demande de dossier",
    "page.dossier.title": "Demande de dossier — DCKImmo",
    "dossier.lead": "Recevez rapidement les informations et les documents du bien sélectionné.",
    "dossier.form.title": "Formulaire",
    "dossier.form.note": "Demande d’achat ou de location — réponse rapide par email.",
    "dossier.form.name": "Nom",
    "dossier.form.email": "Email",
    "dossier.form.phone": "Téléphone",
    "dossier.form.type": "Type de demande",
    "dossier.form.type.rent": "Location",
    "dossier.form.type.sale": "Achat",
    "dossier.form.ref": "Bien concerné (référence optionnelle)",
    "dossier.form.message": "Message",
    "dossier.form.files": "Ajouter votre dossier (PDF / photos)",
    "dossier.form.chooseFiles": "Choisir des fichiers",
    "dossier.form.send": "Envoyer la demande",
    "dossier.contact.title": "Contact & adresse",
    "dossier.contact.contact": "Contact",
    "dossier.contact.address": "Adresse",
    "dossier.docs.title": "Exemples de pièces demandées",
    "dossier.docs.note": "À adapter selon vos procédures et exigences légales.",
    "dossier.docs.id": "Pièce d’identité",
    "dossier.docs.paySlips3": "3 dernières fiches de salaire",
    "dossier.docs.debtRecord": "Attestation poursuites",
    "dossier.docs.criminalRecord": "Extrait du casier judiciaire",
    "dossier.docs.contactDetails": "Coordonnées",
    "dossier.form.message.placeholder": "Informations utiles...",
    "dossier.hero.imageAlt": "Demande de dossier",

    "contact.kicker": "Vente • Location • Dossier",
    "contact.title": "Parlons de votre projet",
    "contact.lead": "Nous vous accompagnons dans la vente et la location de biens immobiliers, ainsi que dans la préparation de votre dossier, avec une approche simple, transparente et efficace.",
    "contact.sub": "Contactez-nous directement pour obtenir des informations ou organiser une visite. Nous répondons rapidement et vous accompagnons à chaque étape de votre projet.",
    "contact.cta.primary": "Prendre contact",
    "contact.cta.message": "Envoyer un message",
    "contact.cta.appointment": "Prendre rendez-vous",
    "contact.cta.call": "Appeler maintenant",
    "contact.who": "Qui sommes-nous ?",
    "contact.who.p1": "Nous présentons des biens immobiliers à la vente et à la location avec une approche claire et transparente.",
    "contact.who.p2": "Chaque bien est soigneusement mis en valeur afin de faciliter sa découverte et de permettre une projection rapide.",
    "contact.who.p3": "Les échanges se font en direct, sans intermédiaire inutile, et les visites sont organisées selon vos disponibilités.",
    "contact.values": "Nos valeurs",
    "contact.values.i1": "Proximité avec nos clients",
    "contact.values.i2": "Transparence dans chaque échange",
    "contact.values.i3": "Qualité dans la présentation des biens",
    "contact.values.i4": "Réactivité dans le traitement des demandes",
    "contact.team": "Notre équipe",
    "contact.team.lead": "Un interlocuteur unique vous accompagne tout au long de votre démarche, avec disponibilité et réactivité.",
    "contact.team.role": "Référent immobilier",
    "contact.team.desc": "Contact direct, conseils clairs et organisation des visites selon vos disponibilités.",
    "contact.team.proof.reply": "Réponse sous 24 heures",
    "contact.team.proof.visits": "Visites 7/7",
    "contact.details": "Coordonnées",
    "contact.details.lead": "Réponse rapide et contact direct.",
    "contact.form": "Formulaire",
    "contact.form.type": "Type de demande",

    "req.visit": "Demande de visite",
    "req.dossier": "Demande de dossier",
    "req.rent": "Louer un bien",
    "req.buy": "Acheter un bien",
    "req.advice": "Conseils",
    "req.question": "Question",

    "contact.form.name": "Nom",
    "contact.form.email": "Email",
    "contact.form.phone": "Téléphone",
    "contact.form.availability": "Disponibilités pour la visite",
    "contact.form.files": "Ajouter votre dossier (PDF / photos)",
    "contact.form.message": "Message",
    "contact.form.message.placeholder": "Précisez votre demande…",
    "contact.form.chooseFiles": "Choisir des fichiers",
    "contact.form.send": "Envoyer",

    "page.biens.title": "Biens — DCKImmo",
    "biens.hero.title": "Nos biens",
    "biens.hero.lead": "À vendre et à louer. Cliquez sur un bien pour voir la fiche complète.",
    "biens.total": "Total",
    "biens.results": "Résultats",
    "biens.btn.sale": "À vendre",
    "biens.btn.rent": "À louer",
    "biens.btn.search": "Recherche",
    "biens.trust.aria": "Réassurance",
    "biens.trust.one": "Interlocuteur unique",
    "biens.trust.two": "Accompagnement sur mesure",
    "biens.trust.three": "Suivi transparent",

    "page.listing.title": "Bien — DCKImmo",
    "listing.back": "← Retour aux biens",
    "listing.map.aria": "Carte Google Maps du bien",
    "listing.map.title": "Carte",
    "listing.open": "Ouvrir le détail du bien",
    "listing.details": "Détails",
    "listing.featured": "✨ En Vedette",
    "listing.availableFrom": "Disponible dès {date}",
    "listing.description": "Description",
    "listing.features": "Caractéristiques",
    "listing.requestDossier": "Demande de dossier",
    "listing.requestVisit": "Demander une visite",
    "listing.contact": "Contact",
    "listing.contact.name": "Deniz Demirci",
    "listing.contact.phone": "Téléphone",
    "listing.contact.email": "Email",
    "listing.contact.address": "Adresse",
    "listing.visitTitle": "Demande de visite",
    "listing.notFound": "Bien introuvable.",
    "listing.modalLabel": "Détail du bien",
    "listing.copyRef": "Copier la référence",
    "listing.refCopied": "Référence copiée : {id}",
    "listing.ref": "Référence : {id}",
    "listing.unavailableTitle": "Indisponible",
    "listing.unavailableMsg": "Ce bien est {status}. Les demandes sont désactivées.",
    "listing.floor": "Étage",
    "listing.bath": "sdb",
    "listing.newBuild": "Nouvelle construction",
    "listing.parking": "Place de parc",
    "listing.quietArea": "Quartier calme",
    "listing.childrenFriendly": "Adapté aux enfants",

    "status.sold": "Vendu",
    "status.rented": "Loué",

    "placeholders.fullName": "Nom Prénom",
    "placeholders.visitMessage": "Vos disponibilités, questions, informations…",
    "appointment.calendar": "Calendrier",
    "appointment.times": "Horaires",
    "appointment.autoVisitMsg": "Je suis disponible pour une visite le {date} à {time}.{refSuffix}",
    "appointment.refSuffix": " (réf. {ref})",
    "fields.subject": "Objet",
    "fields.referenceOptional": "Référence (optionnel)",
    "placeholders.referenceExample": "ex : JU-DEL-001",
    "placeholders.requestMessage": "Votre demande…",
    "req.valuation": "Estimation",

    "page.recherche.title": "Recherche — DCKImmo",
    "search.priceUpTo": "Prix à",
    "search.filters": "Filtres",
    "search.advTitle": "Filtres avancés",
    "search.close": "Fermer",
    "search.city": "Commune / ville",
    "search.sort": "Tri",
    "search.sort.relevance": "Pertinence",
    "search.sort.priceAsc": "Prix (croissant)",
    "search.sort.priceDesc": "Prix (décroissant)",
    "search.sort.surfaceDesc": "Surface (décroissant)",
    "search.sort.roomsDesc": "Pièces (décroissant)",
    "search.priceMin": "Prix min (CHF)",
    "search.priceMax": "Prix max (CHF)",
    "search.applyFilters": "Appliquer les filtres",
    "search.requestTitle": "Demande",
    "search.none": "Aucun résultat",
    "search.showCount": "Afficher {n} objet{plural}",
    "search.noneFoundTitle": "Aucun bien trouvé",
    "search.noneFoundLead": "Essayez Louer / Acheter ou élargissez la région.",
    "search.trust.one": "Sans intermédiaire",
    "search.trust.two": "Contact direct",
    "search.trust.three": "Réponse rapide",
    "search.trust.four": "Visites 7j/7",

    "page.conseils.title": "Conseils — DCKImmo",

    "advice.h1": "Conseils",
    "advice.hero.tagline": "Les bonnes décisions aujourd’hui pour un projet serein demain.",
    "advice.tabs.aria": "Catégories de conseils",
    "advice.tabs.owner": "Propriétaire",
    "advice.tabs.ownerSub": "Acheter en toute confiance",
    "advice.tabs.renter": "Locataire",
    "advice.tabs.renterSub": "Louer en toute sérénité",

    "advice.owner.title": "Conseils pour devenir propriétaire",
    "advice.owner.sub": "Budget, analyse et vision long terme.",
    "advice.owner.introTitle": "Devenir propriétaire ne s’improvise pas.",
    "advice.owner.introDesc": "Acheter sereinement, ça se prépare.<br />Budget, analyse et vision long terme sont essentiels.",
    "advice.owner.stepsTitle": "Les étapes clés de votre projet",
    "advice.owner.stepsSub": "Une approche claire pour avancer sereinement",

    "advice.renter.divider": "Conseils locataires",
    "advice.renter.title": "Conseils pour les locataires",
    "advice.renter.sub": "Préparation, réactivité et dossier efficace",
    "advice.renter.introTitle": "Trouver un logement rapidement, ça se prépare.",
    "advice.renter.introDesc": "Préparation + réactivité = la différence.",
    "advice.renter.stepsTitle": "Les bonnes pratiques pour sécuriser sa location",

    "advice.stepLabel": "ÉTAPE {n}",

    "advice.calc.openBudgetAria": "Ouvrir la calculatrice budget",
    "advice.calc.aria": "Calculatrice",
    "advice.calc.keysAria": "Touches calculatrice",

    "advice.owner.step1.title": "Définir son budget",
    "advice.owner.step1.cta": "Simuler mon budget",
    "advice.owner.step1.b1": "Capacité d’emprunt",
    "advice.owner.step1.b2": "Apport personnel",
    "advice.owner.step1.b3": "Frais de notaire",
    "advice.owner.step1.b4": "Travaux éventuels",
    "advice.owner.step1.b5": "Marge de sécurité",

    "advice.owner.step2.title": "Comparer les biens",
    "advice.owner.step2.cta": "Estimer le prix du marché",
    "advice.owner.step2.b1": "Prix au m²",
    "advice.owner.step2.b2": "Rapport qualité / prix",
    "advice.owner.step2.b3": "Analyse du marché",
    "advice.owner.step2.b4": "Opportunités locales",
    "advice.m2.priceLabel": "Prix du bien (CHF)",
    "advice.m2.surfaceLabel": "Surface (m²)",
    "advice.m2.refLabel": "Référence commune (CHF/m²)",
    "advice.m2.outPrefix": "Prix au m²:",
    "advice.m2.note": "Compare uniquement des biens similaires (même commune/quartier + même type). Utilise idéalement la surface habitable pour une comparaison cohérente.",

    "advice.owner.step3.title": "Choisir l’emplacement",
    "advice.owner.step3.b1": "Proximité transports",
    "advice.owner.step3.b2": "Commerces & services",
    "advice.owner.step3.b3": "Quartier & environnement",
    "advice.owner.step3.b4": "Potentiel de valorisation",

    "advice.owner.step4.title": "Évaluer le bien",
    "advice.owner.step4.b1": "État général",
    "advice.owner.step4.b2": "Isolation",
    "advice.owner.step4.b3": "Performance énergétique",
    "advice.owner.step4.b4": "Travaux à prévoir",

    "advice.owner.step5.title": "Optimiser le financement",
    "advice.owner.step5.cta": "Calculateur de taux",
    "advice.owner.step5.b1": "Comparer les crédits",
    "advice.owner.step5.b2": "Taux d’intérêt",
    "advice.owner.step5.b3": "Conditions de remboursement",
    "advice.owner.step5.b4": "Simulation bancaire",
    "advice.mortgage.amountLabel": "Montant hypothèque (CHF)",
    "advice.mortgage.rateLabel": "Taux hypothécaire annuel (%)",
    "advice.mortgage.amortLabel": "Amortissement (% ou CHF/an)",
    "advice.mortgage.maintLabel": "Charges & entretien (%)",
    "advice.mortgage.incomeLabel": "Revenu mensuel (CHF)",
    "advice.mortgage.interest": "Intérêts",
    "advice.mortgage.amort": "Amortissement",
    "advice.mortgage.maint": "Charges",
    "advice.mortgage.total": "Total logement",
    "advice.mortgage.ratio": "Taux d’effort",
    "advice.perMonth": "/mois",
    "advice.mortgage.note": "Estimation simple (intérêts + amortissement + charges). À valider avec votre banque.",

    "advice.owner.step6.title": "Anticiper les frais",
    "advice.owner.step6.b1": "Frais de notaire",
    "advice.owner.step6.b2": "Assurance",
    "advice.owner.step6.b3": "Charges copropriété",
    "advice.owner.step6.b4": "Entretien",

    "advice.owner.step7.title": "Penser à la revente",
    "advice.owner.step7.b1": "Évolution du quartier",
    "advice.owner.step7.b2": "Plus-value potentielle",
    "advice.owner.step7.b3": "Demande locative",

    "advice.owner.step8.title": "Prendre le temps",
    "advice.owner.step8.b1": "Visites multiples",
    "advice.owner.step8.b2": "Comparaison",
    "advice.owner.step8.b3": "Décision réfléchie",

    "advice.renter.step1.title": "Préparer son dossier",
    "advice.renter.step1.b1": "Pièce d’identité",
    "advice.renter.step1.b2": "Revenus",
    "advice.renter.step1.b3": "Contrat de travail",
    "advice.renter.step1.b4": "Dossier prêt à envoyer",

    "advice.renter.step2.title": "Être réactif",
    "advice.renter.step2.b1": "Alertes activées",
    "advice.renter.step2.b2": "Réponse rapide",
    "advice.renter.step2.b3": "Disponibilité visites",

    "advice.renter.step3.title": "Évaluer son budget",
    "advice.renter.step3.cta": "Loyer max",
    "advice.renter.step3.b1": "Loyer ≤ 1/3 revenus",
    "advice.renter.step3.b2": "Charges",
    "advice.renter.step3.b3": "Assurance",
    "advice.renter.step3.b4": "Transport",
    "advice.rent.incomeLabel": "Revenu mensuel (CHF)",
    "advice.rent.maxLabel": "Loyer max conseillé",
    "advice.rent.rulePrefix": "Règle simple:",
    "advice.rent.ruleSuffix": "du revenu",

    "advice.renter.step4.title": "Observer le bien",
    "advice.renter.step4.b1": "État général",
    "advice.renter.step4.b2": "Isolation",
    "advice.renter.step4.b3": "Luminosité",
    "advice.renter.step4.b4": "Équipements",

    "advice.renter.step5.title": "Comprendre les charges",
    "advice.renter.step5.b1": "Chauffage",
    "advice.renter.step5.b2": "Eau",
    "advice.renter.step5.b3": "Électricité commune",
    "advice.renter.step5.b4": "Entretien immeuble",

    "advice.renter.step6.title": "Lire le bail",
    "advice.renter.step6.b1": "Durée",
    "advice.renter.step6.b2": "Conditions",
    "advice.renter.step6.b3": "Résiliation",
    "advice.renter.step6.specialPrefix": "Règles spécifiques — ",

    "advice.renter.step7.title": "Anticiper la garantie",
    "advice.renter.step7.b1": "2–3 mois de loyer",
    "advice.renter.step7.b2": "Compte bloqué",
    "advice.renter.step7.altPrefix": "Alternatives — ",

    "advice.renter.step8.title": "Choisir l’emplacement",
    "advice.renter.step8.b1": "Transports",
    "advice.renter.step8.b2": "Proximité travail",
    "advice.renter.step8.b3": "Qualité de vie",

    "advice.renter.step9.title": "Soigner sa présentation",
    "advice.renter.step9.b1": "Message clair",
    "advice.renter.step9.b2": "Dossier propre",
    "advice.renter.step9.b3": "Attitude professionnelle",

    "advice.cta.k": "Vous avez un projet ?",
    "advice.cta.title": "Parlons-en ensemble",
    "advice.cta.lead": "Notre équipe est à votre écoute pour vous conseiller et vous accompagner à chaque étape.",

    "aria.prevPhoto": "Photo précédente",
    "aria.nextPhoto": "Photo suivante",
    "aria.reviewGo": "Aller à l’avis {n}"
  },
  en: {
    "lang.fr": "FR",
    "lang.en": "EN",
    "lang.label": "Language",
    "lang.fr.full": "Français",
    "lang.en.full": "English",

    "nav.home": "Home",
    "nav.home.sub": "Back to homepage",
    "nav.properties": "Properties",
    "nav.properties.sub": "Browse our listings",
    "nav.search": "Search",
    "nav.search.sub": "Find the right property",
    "nav.advice": "Advice",
    "nav.advice.sub": "Guides and tips",
    "nav.dossier": "Application file",
    "nav.dossier.sub": "Documents and form",
    "nav.contact": "Contact",
    "nav.contact.sub": "Let’s talk about your project",
    "nav.admin": "Admin",
    "nav.admin.sub": "Admin area",

    "page.adminLogin.title": "Login — Admin",
    "page.admin.title": "Admin — Listings",
    "admin.topTitle": "Administration",
    "admin.login.title": "Login",
    "admin.login.lead": "Admin access only.",
    "admin.login.username": "Username",
    "admin.login.password": "Password",
    "admin.login.signIn": "Sign in",
    "admin.login.back": "Back",
    "admin.login.tip": "Tip: credentials are configured server-side.",
    "admin.login.failed": "Login failed.",

    "admin.leftTitle": "Listings",
    "admin.actions.new": "New",
    "admin.actions.refresh": "Refresh",
    "admin.search.label": "Search",
    "admin.search.placeholder": "Reference, title, city…",
    "admin.count.total": "Total",
    "admin.actions.logout": "Sign out",

    "admin.editor.title": "Editor",
    "admin.editor.lead": "Edit a listing, save, and it’s visible on the site.",
    "admin.actions.save": "Save",
    "admin.actions.delete": "Delete",

    "admin.fields.referenceId": "Reference (id)",
    "admin.fields.category": "Category",
    "admin.fields.status": "Status",
    "admin.fields.type": "Type",
    "admin.fields.title": "Title",
    "admin.fields.description": "Description",
    "admin.fields.region": "Region",
    "admin.fields.locality": "City",
    "admin.fields.rooms": "Rooms",
    "admin.fields.area": "Area (m²)",
    "admin.fields.price": "Price",
    "admin.fields.priceSuffix": "Price suffix",
    "admin.fields.tags": "Tags",
    "admin.fields.mainImageUrl": "Main image (URL)",
    "admin.fields.gallery": "Gallery",
    "admin.fields.preview": "Preview",

    "admin.status.available": "Available",
    "admin.placeholders.propertyType": "Apartment / House / Villa",
    "admin.placeholders.region": "Jura / Bernese Jura",
    "admin.placeholders.tag": "Add a tag…",
    "admin.actions.add": "Add",
    "admin.actions.upload": "Upload",
    "admin.photos.dropzoneHint": "Drop images here, or use upload.",
    "admin.placeholders.url": "Add a URL…",

    "admin.toast.refreshed": "Data refreshed.",
    "admin.toast.referenceRequired": "Reference is required.",
    "admin.toast.created": "Listing created.",
    "admin.toast.saved": "Listing saved.",
    "admin.toast.deleted": "Listing deleted.",
    "admin.toast.photosAdded": "Photos added.",
    "admin.toast.mainImageUpdated": "Main image updated.",
    "admin.toast.error": "Error.",
    "admin.toast.uploadFailed": "Upload failed.",
    "admin.confirm.delete": "Delete {id}?",

    "menu.label": "Menu",
    "menu.social": "Social",
    "menu.call": "Call 078 733 87 17",
    "menu.hours": "Mon – Fri, 08:00 – 18:30",
    "top.backToTop": "Back to top",
    "top.goHome": "Go to home",

    "footer.tagline": "Properties for sale and rent in Jura & Bernese Jura.",
    "footer.tagline.split.1": "Properties for sale and rent in ",
    "footer.tagline.split.2": "Jura & Bernese Jura",
    "footer.tagline.split.3": ".",
    "footer.note": "Direct contact, transparency and support.",
    "footer.nav": "Navigation",
    "footer.contact": "Contact",
    "footer.newsletter": "Newsletter",
    "footer.newsletter.note": "Get our latest listings first.",
    "footer.newsletter.placeholder": "Your email",
    "footer.newsletter.submitAria": "Subscribe",
    "footer.privacy": "No ads. Unsubscribe in one click.",
    "footer.legal": "Legal notice • Privacy policy",

    "common.searchProperty": "Search a property",
    "common.viewProperties": "View properties",
    "common.openMaps": "Open in Maps",
    "common.maps3d": "Google Maps 3D view",
    "common.close": "Close",

    "home.tagline": "Find the right property, near you.",
    "home.services.aria": "Services",
    "home.services.sale": "Sales",
    "home.services.rent": "Rentals",
    "home.services.advice": "Advice",
    "home.services.support": "Support",
    "home.cta.search": "Search a property",
    "home.cta.view": "View properties",

    "actions.viewAll": "View all",
    "actions.learnMore": "Learn more",
    "actions.contactUs": "Contact us",
    "actions.bookAppointment": "Book an appointment",

    "home.deals.title": "Great deals",
    "home.deals.subtitle": "Attractive prices, opportunities and current deals.",
    "home.deals.aria": "Great deals",
    "home.deals.badge.priceDrop": "Price drop",
    "home.deals.badge.utilitiesIncluded": "Utilities included",
    "home.deals.badge.topPick": "Top pick",
    "home.deals.badge.availableNow": "Available now",
    "home.priceSuffix.month": "/month",

    "home.mapCta.text": "Local, personalized support from A to Z.",

    "home.news.title": "Real estate news",
    "home.news.subtitle": "Follow market trends",
    "carousel.prevAria": "Previous card",
    "carousel.nextAria": "Next card",
    "home.news.slide.market.aria": "Market",
    "home.news.slide.market.tag": "Market",
    "home.news.slide.market.title": "Market 2025",
    "home.news.slide.market.sub": "Trends and outlook",
    "home.news.slide.outlook.aria": "Outlook",
    "home.news.slide.outlook.tag": "Outlook",
    "home.news.slide.outlook.title": "Outlook 2026",
    "home.news.slide.outlook.sub": "Price evolution in Switzerland",
    "home.news.slide.rent.aria": "Rentals",
    "home.news.slide.rent.tag": "Rentals",
    "home.news.slide.rent.title": "Rentals",
    "home.news.slide.rent.sub": "Demand and rent evolution",
    "home.news.slide.risk.aria": "Risk",
    "home.news.slide.risk.tag": "Risk",
    "home.news.slide.risk.title": "Risk",
    "home.news.slide.risk.sub": "Bubble risk: what to watch",
    "home.news.slide.advice.aria": "Advice",
    "home.news.slide.advice.tag": "Advice",
    "home.news.slide.advice.title": "Advice",
    "home.news.slide.advice.sub": "Prepare a strong application file quickly",
    "home.side.rateBns": "SNB rate",
    "home.side.readUbs": "Read UBS analysis",
    "home.side.readUbsSub": "Discover the latest insights",

    "home.services.title": "Our services",
    "home.services.intro": "Sales, rentals, application files and viewings — a simple, transparent approach to save time at every step.",
    "home.services.detailedAria": "Detailed services",
    "home.services.s1.title": "Property sales",
    "home.services.s1.lead": "Carefully selected listings, key information, clear presentation.",
    "home.services.s1.i1.k": "Careful selection",
    "home.services.s1.i1.p": "We select properties with care.",
    "home.services.s1.i2.k": "Property presentation",
    "home.services.s1.i2.p": "Professional photos and attractive listings.",
    "home.services.s1.i3.k": "Targeted reach",
    "home.services.s1.i3.p": "Maximum visibility on platforms.",
    "home.services.s1.cta": "View sales",
    "home.services.s2.title": "Property rentals",
    "home.services.s2.lead": "Up-to-date listings, complete details, simple and fast process.",
    "home.services.s2.i1.k": "Updated listings",
    "home.services.s2.i1.p": "Consistent visibility through regular updates.",
    "home.services.s2.i2.k": "Complete files",
    "home.services.s2.i2.p": "Thorough review of applicants’ files.",
    "home.services.s2.i3.k": "Fast process",
    "home.services.s2.i3.p": "Efficient and streamlined rental process.",
    "home.services.s2.cta": "View rentals",
    "home.services.s3.title": "Application file preparation",
    "home.services.s3.lead": "A structured file ready to send to speed up processing.",
    "home.services.s3.i1.k": "Documents gathered",
    "home.services.s3.i1.p": "All essential documents collected.",
    "home.services.s3.i2.k": "Structured file",
    "home.services.s3.i2.p": "Organized, clear presentation.",
    "home.services.s3.i3.k": "Fast submission",
    "home.services.s3.i3.p": "Save time and start processing right away.",
    "home.services.s3.cta": "Learn more",
    "home.services.s4.title": "Viewing organization",
    "home.services.s4.lead": "Viewings planned around your availability, direct contact.",
    "home.services.s4.i1.k": "Flexible slots",
    "home.services.s4.i1.p": "Pick the times that suit you.",
    "home.services.s4.i2.k": "On-site support",
    "home.services.s4.i2.p": "Guided viewing with an experienced professional.",
    "home.services.s4.i3.k": "Direct exchanges",
    "home.services.s4.i3.p": "Fast and efficient communication.",
    "home.services.s4.cta": "Check availability",

    "home.partners.k": "STRONG LOCAL NETWORK",
    "home.partners.title": "Trusted partners",
    "home.partners.lead": "We work with carefully selected local partners to provide a complete, reliable and high-quality service.",
    "home.partners.aria": "Partners",
    "home.partners.p1.pill": "Personalized advice",
    "home.partners.p1.desc": "Tax advice and optimization for individuals.",
    "home.partners.p2.pill": "Fast local service",
    "home.partners.p2.desc": "Sales, delivery and repair of household appliances for your home.",
    "home.partners.p3.pill": "Expertise & safety",
    "home.partners.p3.desc": "Electrical installations, networks and technical solutions.",
    "home.partners.p4.pill": "Cleanliness & reliability",
    "home.partners.p4.desc": "Cleaning services for individuals and professionals.",

    "home.testimonials.title": "Customer reviews",
    "home.testimonials.viewAll": "View all reviews",
    "home.testimonials.navAria": "Review navigation",
    "home.testimonials.prevAria": "Previous review",
    "home.testimonials.nextAria": "Next review",
    "home.testimonials.dotsAria": "Review selector",
    "home.testimonials.q1": "I chose DCKImmo to sell a property. The file was clear and perfectly prepared, and communication was very responsive.",
    "home.testimonials.w1": "Sales client, Courrendlin",
    "home.testimonials.q2": "Quick viewing, clear answers and a perfectly prepared file. Very professional.",
    "home.testimonials.w2": "Buyer, Moutier",
    "home.testimonials.q3": "We found exactly what we were looking for. Follow-up 7/7 and very available.",
    "home.testimonials.w3": "Rental client, Courrendlin",
    "home.testimonials.q4": "Accurate valuation and great presentation. Photos + listing were top.",
    "home.testimonials.w4": "Client, Courtételle",

    "home.examples.title": "Properties",
    "home.examples.subtitle": "Browse a selection of properties for sale and rent.",
    "home.examples.viewAll": "View all properties",

    "home.perf.aria": "Real estate performance",
    "home.perf.kicker": "Our performance",
    "home.perf.title": "Dashboard",
    "home.perf.sub": "Track our performance across our listings and results.",
    "home.kpi.sold": "Sold listings",
    "home.kpi.rented": "Rented listings",
    "home.kpi.satisfaction": "Satisfaction",
    "home.kpi.period": "Over the past years",
    "home.map.sector": "Our service area",
    "home.map.jura.title": "Canton of Jura",
    "home.map.jura.lead": "By your side throughout the Canton of Jura.",
    "home.map.jura.imgAlt": "Map of the Canton of Jura",
    "home.map.bern.title": "Canton of Bern",
    "home.map.bern.lead": "By your side throughout the Canton of Bern.",
    "home.map.bern.imgAlt": "Map of the Canton of Bern",

    "search.tabs.all": "All",
    "search.tabs.rent": "Rent",
    "search.tabs.buy": "Buy",
    "search.where": "Where?",
    "search.where.placeholder": "City, ZIP, Canton...",
    "search.priceFrom": "Price from",
    "search.priceTo": "to",
    "search.min": "min",
    "search.max": "max",
    "search.roomsFrom": "Rooms min",
    "search.any": "any",
    "search.more": "More filters",
    "search.region": "Region",
    "search.region.all": "All",
    "search.type": "Type",
    "search.type.all": "Any",
    "search.surfaceMin": "Min area (m²)",
    "search.cityExact": "City (exact)",
    "search.features": "Features",
    "search.submit": "Search",

    "type.apartment": "Apartment",
    "type.house": "House",
    "type.villa": "Villa",
    "tag.fireplace": "Fireplace",
    "tag.garden": "Garden",
    "tag.terrace": "Terrace",
    "tag.balcony": "Balcony",
    "tag.garage": "Garage",
    "tag.elevator": "Elevator",
    "tag.quiet": "Quiet",
    "tag.renovated": "Renovated",
    "tag.new": "New",
    "tag.nearStation": "Near station",

    "feature.pool": "Pool",
    "feature.cellar": "Cellar",
    "feature.attic": "Attic",
    "feature.laundryRoom": "Laundry room",
    "feature.sharedLaundry": "Shared laundry",
    "feature.outdoorParking": "Outdoor parking",
    "feature.coveredParking": "Covered parking",
    "feature.bikeStorage": "Bike storage",
    "feature.solarPanels": "Solar panels",
    "feature.heatPump": "Heat pump",
    "feature.underfloorHeating": "Underfloor heating",
    "feature.doubleGlazing": "Double glazing",
    "feature.electricBlinds": "Electric blinds",
    "feature.equippedKitchen": "Equipped kitchen",
    "feature.openKitchen": "Open kitchen",
    "feature.walkInCloset": "Walk-in closet",
    "feature.masterSuite": "Master suite",
    "feature.bathtub": "Bathtub",
    "feature.walkInShower": "Walk-in shower",
    "feature.openView": "Open view",
    "feature.nearSchools": "Near schools",
    "feature.nearShops": "Near shops",
    "feature.highwayAccess": "Highway access",
    "feature.noOverlooking": "No overlooking",
    "feature.fiberInternet": "Fiber internet",
    "feature.homeAutomation": "Home automation",
    "feature.intercom": "Intercom",
    "feature.securityDoor": "Security door",
    "feature.petsAllowed": "Pets allowed",
    "feature.furnished": "Furnished",
    "feature.highCeilings": "High ceilings",
    "feature.woodFlooring": "Wood flooring",
    "feature.tile": "Tile",
    "feature.southFacing": "South-facing",
    "feature.accessible": "Wheelchair accessible",
    "feature.utilitiesIncluded": "Utilities included",
    "feature.bright": "Bright",
    "feature.mountainView": "Mountain view",
    "feature.countrysideView": "Countryside view",
    "feature.storageSpace": "Storage space",
    "feature.workshop": "Workshop",
    "feature.gardenShed": "Garden shed",
    "feature.automaticIrrigation": "Automatic irrigation",
    "feature.electricGate": "Electric gate",
    "feature.cameras": "Cameras",
    "feature.spa": "Spa / Jacuzzi",
    "feature.gym": "Gym",
    "feature.homeTheater": "Home theater",
    "feature.office": "Office",

    "toast.construction": "Site under construction",
    "toast.form.sent": "{label} sent.",
    "toast.form.fail": "Could not send. Please try again.",
    "toast.form.demo": "{label} ready. Add a submit endpoint to receive files.",
    "files.none": "No file selected",
    "files.one": "1 file selected",
    "files.many": "{count} files selected",

    "loader.barAria": "Loading",
    "loader.hint": "Loading DCKImmo…",

    "dossier.title": "Application file",
    "page.dossier.title": "Application file — DCKImmo",
    "dossier.lead": "Quickly receive information and documents for the selected property.",
    "dossier.form.title": "Form",
    "dossier.form.note": "Purchase or rental request — quick reply by email.",
    "dossier.form.name": "Name",
    "dossier.form.email": "Email",
    "dossier.form.phone": "Phone",
    "dossier.form.type": "Request type",
    "dossier.form.type.rent": "Rent",
    "dossier.form.type.sale": "Buy",
    "dossier.form.ref": "Property (optional reference)",
    "dossier.form.message": "Message",
    "dossier.form.files": "Attach your file (PDF / photos)",
    "dossier.form.chooseFiles": "Choose files",
    "dossier.form.send": "Send request",
    "dossier.contact.title": "Contact & address",
    "dossier.contact.contact": "Contact",
    "dossier.contact.address": "Address",
    "dossier.docs.title": "Example required documents",
    "dossier.docs.note": "Adjust to your procedures and legal requirements.",
    "dossier.docs.id": "ID document",
    "dossier.docs.paySlips3": "Last 3 payslips",
    "dossier.docs.debtRecord": "Debt enforcement record",
    "dossier.docs.criminalRecord": "Criminal record extract",
    "dossier.docs.contactDetails": "Contact details",
    "dossier.form.message.placeholder": "Useful information...",
    "dossier.hero.imageAlt": "Application file",

    "contact.kicker": "Sales • Rentals • Application file",
    "contact.title": "Let’s talk about your project",
    "contact.lead": "We support you with selling and renting properties, as well as preparing your application file, with a simple, transparent and efficient approach.",
    "contact.sub": "Contact us directly to get information or arrange a viewing. We reply quickly and support you at every step.",
    "contact.cta.primary": "Get in touch",
    "contact.cta.message": "Send a message",
    "contact.cta.appointment": "Book an appointment",
    "contact.cta.call": "Call now",
    "contact.who": "Who are we?",
    "contact.who.p1": "We present properties for sale and rent with a clear and transparent approach.",
    "contact.who.p2": "Each property is carefully showcased to make it easy to discover and picture yourself quickly.",
    "contact.who.p3": "We communicate directly, without unnecessary intermediaries, and organize viewings based on your availability.",
    "contact.values": "Our values",
    "contact.values.i1": "Close to our clients",
    "contact.values.i2": "Transparency in every exchange",
    "contact.values.i3": "High-quality property presentation",
    "contact.values.i4": "Fast handling of requests",
    "contact.team": "Our team",
    "contact.team.lead": "A single contact person supports you throughout the process, with availability and responsiveness.",
    "contact.team.role": "Real estate advisor",
    "contact.team.desc": "Direct contact, clear advice and scheduling viewings based on your availability.",
    "contact.team.proof.reply": "Reply within 24 hours",
    "contact.team.proof.visits": "Viewings 7/7",
    "contact.details": "Contact details",
    "contact.details.lead": "Fast reply and direct contact.",
    "contact.form": "Form",
    "contact.form.type": "Request type",

    "req.visit": "Viewing request",
    "req.dossier": "Application file",
    "req.rent": "Rent a property",
    "req.buy": "Buy a property",
    "req.advice": "Advice",
    "req.question": "Question",

    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.phone": "Phone",
    "contact.form.availability": "Availability for the viewing",
    "contact.form.files": "Attach your file (PDF / photos)",
    "contact.form.message": "Message",
    "contact.form.message.placeholder": "Tell us what you need…",
    "contact.form.chooseFiles": "Choose files",
    "contact.form.send": "Send",

    "page.biens.title": "Properties — DCKImmo",
    "biens.hero.title": "Properties",
    "biens.hero.lead": "For sale and for rent. Click a property to see the full details.",
    "biens.total": "Total",
    "biens.results": "Results",
    "biens.btn.sale": "For sale",
    "biens.btn.rent": "For rent",
    "biens.btn.search": "Search",
    "biens.trust.aria": "Trust",
    "biens.trust.one": "Single point of contact",
    "biens.trust.two": "Tailored support",
    "biens.trust.three": "Transparent follow-up",

    "page.listing.title": "Property — DCKImmo",
    "listing.back": "← Back to properties",
    "listing.map.aria": "Google Maps for this property",
    "listing.map.title": "Map",
    "listing.open": "Open property details",
    "listing.details": "Details",
    "listing.featured": "✨ Featured",
    "listing.availableFrom": "Available from {date}",
    "listing.description": "Description",
    "listing.features": "Features",
    "listing.requestDossier": "Application file",
    "listing.requestVisit": "Request a viewing",
    "listing.contact": "Contact",
    "listing.contact.name": "Deniz Demirci",
    "listing.contact.phone": "Phone",
    "listing.contact.email": "Email",
    "listing.contact.address": "Address",
    "listing.visitTitle": "Viewing request",
    "listing.notFound": "Property not found.",
    "listing.modalLabel": "Property details",
    "listing.copyRef": "Copy reference",
    "listing.refCopied": "Reference copied: {id}",
    "listing.ref": "Reference: {id}",
    "listing.unavailableTitle": "Unavailable",
    "listing.unavailableMsg": "This property is {status}. Requests are disabled.",
    "listing.floor": "Floor",
    "listing.bath": "bath",
    "listing.newBuild": "New build",
    "listing.parking": "Parking",
    "listing.quietArea": "Quiet area",
    "listing.childrenFriendly": "Family-friendly",

    "status.sold": "Sold",
    "status.rented": "Rented",

    "placeholders.fullName": "Full name",
    "placeholders.visitMessage": "Your availability, questions, information…",
    "appointment.calendar": "Calendar",
    "appointment.times": "Times",
    "appointment.autoVisitMsg": "I am available for a viewing on {date} at {time}.{refSuffix}",
    "appointment.refSuffix": " (ref. {ref})",
    "fields.subject": "Subject",
    "fields.referenceOptional": "Reference (optional)",
    "placeholders.referenceExample": "e.g. JU-DEL-001",
    "placeholders.requestMessage": "Your request…",
    "req.valuation": "Valuation",

    "page.recherche.title": "Search — DCKImmo",
    "search.priceUpTo": "Price up to",
    "search.filters": "Filters",
    "search.advTitle": "Advanced filters",
    "search.close": "Close",
    "search.city": "City",
    "search.sort": "Sort",
    "search.sort.relevance": "Relevance",
    "search.sort.priceAsc": "Price (low to high)",
    "search.sort.priceDesc": "Price (high to low)",
    "search.sort.surfaceDesc": "Area (high to low)",
    "search.sort.roomsDesc": "Rooms (high to low)",
    "search.priceMin": "Min price (CHF)",
    "search.priceMax": "Max price (CHF)",
    "search.applyFilters": "Apply filters",
    "search.requestTitle": "Request",
    "search.none": "No results",
    "search.showCount": "Show {n} item{plural}",
    "search.noneFoundTitle": "No properties found",
    "search.noneFoundLead": "Try Rent / Buy or expand the region.",
    "search.trust.one": "No middleman",
    "search.trust.two": "Direct contact",
    "search.trust.three": "Fast reply",
    "search.trust.four": "Viewings 7/7",

    "page.conseils.title": "Advice — DCKImmo",

    "advice.h1": "Advice",
    "advice.hero.tagline": "Make the right decisions today for a smooth project tomorrow.",
    "advice.tabs.aria": "Advice categories",
    "advice.tabs.owner": "Buyer",
    "advice.tabs.ownerSub": "Buy with confidence",
    "advice.tabs.renter": "Renter",
    "advice.tabs.renterSub": "Rent with peace of mind",

    "advice.owner.title": "Tips for buying a home",
    "advice.owner.sub": "Budget, analysis and long-term vision.",
    "advice.owner.introTitle": "Becoming a homeowner isn’t improvised.",
    "advice.owner.introDesc": "Buying with confidence takes preparation.<br />Budget, analysis and long-term vision are essential.",
    "advice.owner.stepsTitle": "Key steps for your project",
    "advice.owner.stepsSub": "A clear approach to move forward with confidence",

    "advice.renter.divider": "Renter tips",
    "advice.renter.title": "Tips for renters",
    "advice.renter.sub": "Preparation, responsiveness and a strong file",
    "advice.renter.introTitle": "Finding a home quickly takes preparation.",
    "advice.renter.introDesc": "Preparation + responsiveness = the difference.",
    "advice.renter.stepsTitle": "Best practices to secure your rental",

    "advice.stepLabel": "STEP {n}",

    "advice.calc.openBudgetAria": "Open the budget calculator",
    "advice.calc.aria": "Calculator",
    "advice.calc.keysAria": "Calculator keys",

    "advice.owner.step1.title": "Define your budget",
    "advice.owner.step1.cta": "Estimate my budget",
    "advice.owner.step1.b1": "Borrowing capacity",
    "advice.owner.step1.b2": "Down payment",
    "advice.owner.step1.b3": "Notary fees",
    "advice.owner.step1.b4": "Potential works",
    "advice.owner.step1.b5": "Safety margin",

    "advice.owner.step2.title": "Compare properties",
    "advice.owner.step2.cta": "Estimate market price",
    "advice.owner.step2.b1": "Price per m²",
    "advice.owner.step2.b2": "Value for money",
    "advice.owner.step2.b3": "Market analysis",
    "advice.owner.step2.b4": "Local opportunities",
    "advice.m2.priceLabel": "Property price (CHF)",
    "advice.m2.surfaceLabel": "Area (m²)",
    "advice.m2.refLabel": "Reference (CHF/m²)",
    "advice.m2.outPrefix": "Price per m²:",
    "advice.m2.note": "Compare similar properties only (same city/neighborhood + same type). Ideally use living area for a consistent comparison.",

    "advice.owner.step3.title": "Choose the location",
    "advice.owner.step3.b1": "Public transport",
    "advice.owner.step3.b2": "Shops & services",
    "advice.owner.step3.b3": "Neighborhood & surroundings",
    "advice.owner.step3.b4": "Value potential",

    "advice.owner.step4.title": "Assess the property",
    "advice.owner.step4.b1": "Overall condition",
    "advice.owner.step4.b2": "Insulation",
    "advice.owner.step4.b3": "Energy performance",
    "advice.owner.step4.b4": "Works to plan",

    "advice.owner.step5.title": "Optimize financing",
    "advice.owner.step5.cta": "Mortgage calculator",
    "advice.owner.step5.b1": "Compare offers",
    "advice.owner.step5.b2": "Interest rate",
    "advice.owner.step5.b3": "Repayment terms",
    "advice.owner.step5.b4": "Bank simulation",
    "advice.mortgage.amountLabel": "Mortgage amount (CHF)",
    "advice.mortgage.rateLabel": "Annual rate (%)",
    "advice.mortgage.amortLabel": "Amortization (% or CHF/year)",
    "advice.mortgage.maintLabel": "Costs & maintenance (%)",
    "advice.mortgage.incomeLabel": "Monthly income (CHF)",
    "advice.mortgage.interest": "Interest",
    "advice.mortgage.amort": "Amortization",
    "advice.mortgage.maint": "Costs",
    "advice.mortgage.total": "Housing total",
    "advice.mortgage.ratio": "Effort ratio",
    "advice.perMonth": "/month",
    "advice.mortgage.note": "Simple estimate (interest + amortization + costs). Confirm with your bank.",

    "advice.owner.step6.title": "Plan for extra costs",
    "advice.owner.step6.b1": "Notary fees",
    "advice.owner.step6.b2": "Insurance",
    "advice.owner.step6.b3": "Condo fees",
    "advice.owner.step6.b4": "Maintenance",

    "advice.owner.step7.title": "Think about resale",
    "advice.owner.step7.b1": "Neighborhood evolution",
    "advice.owner.step7.b2": "Potential value gain",
    "advice.owner.step7.b3": "Rental demand",

    "advice.owner.step8.title": "Take your time",
    "advice.owner.step8.b1": "Multiple viewings",
    "advice.owner.step8.b2": "Comparison",
    "advice.owner.step8.b3": "Thought-out decision",

    "advice.renter.step1.title": "Prepare your file",
    "advice.renter.step1.b1": "ID document",
    "advice.renter.step1.b2": "Income proof",
    "advice.renter.step1.b3": "Employment contract",
    "advice.renter.step1.b4": "Ready to send",

    "advice.renter.step2.title": "Be responsive",
    "advice.renter.step2.b1": "Alerts enabled",
    "advice.renter.step2.b2": "Fast reply",
    "advice.renter.step2.b3": "Viewing availability",

    "advice.renter.step3.title": "Evaluate your budget",
    "advice.renter.step3.cta": "Max rent",
    "advice.renter.step3.b1": "Rent ≤ 1/3 income",
    "advice.renter.step3.b2": "Utilities",
    "advice.renter.step3.b3": "Insurance",
    "advice.renter.step3.b4": "Transportation",
    "advice.rent.incomeLabel": "Monthly income (CHF)",
    "advice.rent.maxLabel": "Recommended max rent",
    "advice.rent.rulePrefix": "Simple rule:",
    "advice.rent.ruleSuffix": "of income",

    "advice.renter.step4.title": "Inspect the property",
    "advice.renter.step4.b1": "Overall condition",
    "advice.renter.step4.b2": "Insulation",
    "advice.renter.step4.b3": "Brightness",
    "advice.renter.step4.b4": "Equipment",

    "advice.renter.step5.title": "Understand utilities",
    "advice.renter.step5.b1": "Heating",
    "advice.renter.step5.b2": "Water",
    "advice.renter.step5.b3": "Common electricity",
    "advice.renter.step5.b4": "Building maintenance",

    "advice.renter.step6.title": "Read the lease",
    "advice.renter.step6.b1": "Duration",
    "advice.renter.step6.b2": "Terms",
    "advice.renter.step6.b3": "Termination",
    "advice.renter.step6.specialPrefix": "Specific rules — ",

    "advice.renter.step7.title": "Plan the deposit",
    "advice.renter.step7.b1": "2–3 months of rent",
    "advice.renter.step7.b2": "Blocked account",
    "advice.renter.step7.altPrefix": "Alternatives — ",

    "advice.renter.step8.title": "Choose the location",
    "advice.renter.step8.b1": "Transport",
    "advice.renter.step8.b2": "Close to work",
    "advice.renter.step8.b3": "Quality of life",

    "advice.renter.step9.title": "Present yourself well",
    "advice.renter.step9.b1": "Clear message",
    "advice.renter.step9.b2": "Clean file",
    "advice.renter.step9.b3": "Professional attitude",

    "advice.cta.k": "Have a project?",
    "advice.cta.title": "Let’s talk",
    "advice.cta.lead": "Our team is here to advise you and support you at every step.",

    "aria.prevPhoto": "Previous photo",
    "aria.nextPhoto": "Next photo",
    "aria.reviewGo": "Go to review {n}"
  }
};

let homeListingsCache = null;
let homeListingsPromise = null;

async function getHomeListings() {
  if (Array.isArray(homeListingsCache)) return homeListingsCache;
  if (homeListingsPromise) return homeListingsPromise;
  homeListingsPromise = (async () => {
    try {
      const mod = await import("./listings-store.js?v=202606120001");
      const list = await mod.loadListings();
      if (!Array.isArray(list)) return null;
      homeListingsCache = list;
      return list;
    } catch {
      return null;
    } finally {
      homeListingsPromise = null;
    }
  })();
  return homeListingsPromise;
}

function applyHomeListingContent(rootSelector) {
  const root = document.querySelector(rootSelector);
  if (!(root instanceof HTMLElement)) return;
  const links = Array.from(root.querySelectorAll("a.listing-link[href*=\"bien.html\"]"));
  if (!links.length) return;

  (async () => {
    const listings = await getHomeListings();
    if (!Array.isArray(listings) || !listings.length) return;
    const byId = new Map(listings.map((l) => [l.id, l]));

    for (const a of links) {
      if (!(a instanceof HTMLAnchorElement)) continue;
      const href = (a.getAttribute("href") || "").trim();
      const m = /[?&]id=([^&]+)/.exec(href);
      if (!m) continue;
      const id = decodeURIComponent(m[1] || "");
      const listing = byId.get(id);
      if (!listing) continue;

      const titleText = pickListingText(listing, "title");
      const descText = pickListingText(listing, "description");

      const h3 = a.querySelector("h3");
      if (h3 instanceof HTMLElement) h3.textContent = titleText;
      const desc = a.querySelector("p.desc");
      if (desc instanceof HTMLElement) desc.textContent = descText || "";
      const img = a.querySelector("img[alt]");
      if (img instanceof HTMLImageElement) img.alt = titleText;
    }
  })();
}

export function getLang() {
  const stored = (window.localStorage.getItem(LS_KEY) || "").trim().toLowerCase();
  if (SUPPORTED.has(stored)) return stored;
  return "fr";
}

export function setLang(lang) {
  const v = String(lang || "").trim().toLowerCase();
  const next = SUPPORTED.has(v) ? v : "fr";
  window.localStorage.setItem(LS_KEY, next);
  if (document?.documentElement) document.documentElement.lang = next;
  return next;
}

export function t(key, vars) {
  const lang = getLang();
  const base = DICT[lang] || DICT.fr;
  const fallback = DICT.fr || {};
  let out = base[key] ?? fallback[key] ?? String(key);
  const values = vars && typeof vars === "object" ? vars : null;
  if (values) {
    for (const [k, v] of Object.entries(values)) {
      out = out.replaceAll(`{${k}}`, String(v));
    }
  }
  return out;
}

export function pickListingText(listing, field) {
  const l = listing && typeof listing === "object" ? listing : {};
  const base = String(l[field] ?? "");
  if (getLang() !== "en") return base;
  const enKey = `${field}_en`;
  const alt = l[enKey];
  if (typeof alt === "string" && alt.trim()) return alt;
  return base;
}

export function translatePropertyType(raw) {
  const v = String(raw || "").trim();
  if (v === "Appartement") return t("type.apartment");
  if (v === "Maison") return t("type.house");
  if (v === "Villa") return t("type.villa");
  return v;
}

export function translateRegionName(raw) {
  const v = String(raw || "").trim();
  if (v === "Jura bernois") return getLang() === "en" ? "Bernese Jura" : "Jura bernois";
  return v;
}

export function translateListingFeature(raw) {
  const v = String(raw || "").trim();
  if (!v) return v;
  if (v === "Ascenseur") return t("tag.elevator");
  if (v === "Cheminée") return t("tag.fireplace");
  if (v === "Balcon") return t("tag.balcony");
  if (v === "Terrasse") return t("tag.terrace");
  if (v === "Jardin") return t("tag.garden");
  if (v === "Garage") return t("tag.garage");
  if (v === "Calme") return t("tag.quiet");
  if (v === "Rénové") return t("tag.renovated");
  if (v === "Neuf") return t("tag.new");
  if (v === "Proche gare") return t("tag.nearStation");

  if (v === "Piscine") return t("feature.pool");
  if (v === "Cave") return t("feature.cellar");
  if (v === "Grenier") return t("feature.attic");
  if (v === "Buanderie") return t("feature.laundryRoom");
  if (v === "Laverie commune") return t("feature.sharedLaundry");
  if (v === "Parking extérieur") return t("feature.outdoorParking");
  if (v === "Place couverte") return t("feature.coveredParking");
  if (v === "Local vélos") return t("feature.bikeStorage");
  if (v === "Panneaux solaires") return t("feature.solarPanels");
  if (v === "Pompe à chaleur") return t("feature.heatPump");
  if (v === "Chauffage au sol") return t("feature.underfloorHeating");
  if (v === "Double vitrage") return t("feature.doubleGlazing");
  if (v === "Stores électriques") return t("feature.electricBlinds");
  if (v === "Cuisine équipée") return t("feature.equippedKitchen");
  if (v === "Cuisine ouverte") return t("feature.openKitchen");
  if (v === "Dressing") return t("feature.walkInCloset");
  if (v === "Suite parentale") return t("feature.masterSuite");
  if (v === "Baignoire") return t("feature.bathtub");
  if (v === "Douche à l’italienne") return t("feature.walkInShower");
  if (v === "Vue dégagée") return t("feature.openView");
  if (v === "Proche écoles") return t("feature.nearSchools");
  if (v === "Proche commerces") return t("feature.nearShops");
  if (v === "Accès autoroute") return t("feature.highwayAccess");
  if (v === "Sans vis-à-vis") return t("feature.noOverlooking");
  if (v === "Fibre optique") return t("feature.fiberInternet");
  if (v === "Domotique") return t("feature.homeAutomation");
  if (v === "Interphone") return t("feature.intercom");
  if (v === "Porte sécurisée") return t("feature.securityDoor");
  if (v === "Animaux acceptés") return t("feature.petsAllowed");
  if (v === "Meublé") return t("feature.furnished");
  if (v === "Hauteur sous plafond") return t("feature.highCeilings");
  if (v === "Parquet") return t("feature.woodFlooring");
  if (v === "Carrelage") return t("feature.tile");
  if (v === "Orientation sud") return t("feature.southFacing");
  if (v === "Accès PMR") return t("feature.accessible");
  if (v === "Charges comprises") return t("feature.utilitiesIncluded");
  if (v === "Lumineux") return t("feature.bright");
  if (v === "Vue montagne") return t("feature.mountainView");
  if (v === "Vue campagne") return t("feature.countrysideView");
  if (v === "Coins rangement") return t("feature.storageSpace");
  if (v === "Atelier") return t("feature.workshop");
  if (v === "Cabanon") return t("feature.gardenShed");
  if (v === "Arrosage automatique") return t("feature.automaticIrrigation");
  if (v === "Portail électrique") return t("feature.electricGate");
  if (v === "Caméras") return t("feature.cameras");
  if (v === "Spa / Jacuzzi") return t("feature.spa");
  if (v === "Salle de sport") return t("feature.gym");
  if (v === "Home cinéma") return t("feature.homeTheater");
  if (v === "Bureau") return t("feature.office");
  return v;
}

function setTextAll(selector, value) {
  for (const el of Array.from(document.querySelectorAll(selector))) {
    if (el instanceof HTMLElement) el.textContent = value;
  }
}

function setAttrAll(selector, attr, value) {
  for (const el of Array.from(document.querySelectorAll(selector))) {
    if (el instanceof HTMLElement) el.setAttribute(attr, value);
  }
}

function applyNav() {
  const items = [
    { href: "./index.html", title: t("nav.home"), sub: t("nav.home.sub") },
    { href: "./biens.html", title: t("nav.properties"), sub: t("nav.properties.sub") },
    { href: "./index.html#recherche-rapide", title: t("nav.search"), sub: t("nav.search.sub") },
    { href: "./conseils.html", title: t("nav.advice"), sub: t("nav.advice.sub") },
    { href: "./dossier.html", title: t("nav.dossier"), sub: t("nav.dossier.sub") },
    { href: "./contact.html", title: t("nav.contact"), sub: t("nav.contact.sub") },
    { href: "./admin/login.html", title: t("nav.admin"), sub: t("nav.admin.sub") },
  ];

  for (const it of items) {
    const links = Array.from(document.querySelectorAll(`[data-nav] a[href="${CSS.escape(it.href)}"]`));
    for (const a of links) {
      if (!(a instanceof HTMLAnchorElement)) continue;
      const title = a.querySelector(".nav-title");
      const sub = a.querySelector(".nav-sub");
      if (title instanceof HTMLElement) title.textContent = it.title;
      if (sub instanceof HTMLElement) sub.textContent = it.sub;
    }
  }

  setAttrAll("[data-topbar-menu-btn]", "aria-label", t("menu.label"));
  setTextAll(".topbar-menu-footer-k", t("menu.social"));
  setAttrAll(".topbar-menu-phone", "aria-label", t("menu.call"));
  setTextAll(".topbar-menu-hours span", t("menu.hours"));
  setAttrAll("a.btn.small[aria-label=\"Administration\"]", "aria-label", t("nav.admin"));
  setAttrAll("a.brand[aria-label=\"Remonter en haut\"]", "aria-label", t("top.backToTop"));
  setAttrAll("a.brand[aria-label=\"Aller à l’accueil\"]", "aria-label", t("top.goHome"));
}

function applyFooter() {
  setTextAll(".footer-col:nth-of-type(1) .k", t("footer.nav"));
  setTextAll(".footer-col:nth-of-type(2) .k", t("footer.contact"));
  setTextAll(".footer-col:nth-of-type(3) .k", t("footer.newsletter"));
  setTextAll(".footer-note", t("footer.newsletter.note"));
  setAttrAll(".footer-newsletter input[type=\"email\"]", "placeholder", t("footer.newsletter.placeholder"));
  setAttrAll(".footer-newsletter button[aria-label]", "aria-label", t("footer.newsletter.submitAria"));
  setTextAll(".footer-privacy span:last-child", t("footer.privacy"));
  setTextAll(".footer-bottom .fine:nth-of-type(2)", t("footer.legal"));

  const desc = document.querySelector(".footer-desc");
  if (desc instanceof HTMLElement) {
    const acc = desc.querySelector(".footer-desc-accent");
    const spans = Array.from(desc.querySelectorAll(":scope > span"));
    const first = spans[0];
    const third = spans[2];
    if (first instanceof HTMLElement && acc instanceof HTMLElement) {
      first.textContent = "";
      first.append(document.createTextNode(t("footer.tagline.split.1")));
      acc.textContent = t("footer.tagline.split.2");
      first.append(acc);
      first.append(document.createTextNode(t("footer.tagline.split.3")));
    }
    if (third instanceof HTMLElement) third.textContent = t("footer.note");
  }

  const links = [
    { href: "./biens.html", label: t("nav.properties") },
    { href: "./index.html#recherche-rapide", label: t("nav.search") },
    { href: "./conseils.html", label: t("nav.advice") },
    { href: "./contact.html", label: t("nav.contact") },
    { href: "./dossier.html", label: t("nav.dossier") },
  ];
  for (const it of links) {
    for (const a of Array.from(document.querySelectorAll(`.footer-cols .footer-col:first-child a[href="${CSS.escape(it.href)}"]`))) {
      if (a instanceof HTMLAnchorElement) a.textContent = it.label;
    }
  }
}

function applyHomePage() {
  const page = document.body.getAttribute("data-page");
  if (page !== "home") return;

  setTextAll(".hero-content > p", t("home.tagline"));
  setAttrAll(".hero-services", "aria-label", t("home.services.aria"));

  const svc = Array.from(document.querySelectorAll(".hero-services > span"));
  if (svc.length >= 7) {
    if (svc[0] instanceof HTMLElement) svc[0].textContent = t("home.services.sale");
    if (svc[2] instanceof HTMLElement) svc[2].textContent = t("home.services.rent");
    if (svc[4] instanceof HTMLElement) svc[4].textContent = t("home.services.advice");
    if (svc[6] instanceof HTMLElement) svc[6].textContent = t("home.services.support");
  }

  const ctaSearch = document.querySelector(".hero-actions a[href=\"#recherche-rapide\"] span:last-child");
  if (ctaSearch instanceof HTMLElement) ctaSearch.textContent = t("home.cta.search");
  const ctaView = document.querySelector(".hero-actions a[href=\"#exemples-biens\"] span:last-child");
  if (ctaView instanceof HTMLElement) ctaView.textContent = t("home.cta.view");
  const topCta = document.querySelector("a[data-topbar-cta]");
  if (topCta instanceof HTMLAnchorElement) topCta.textContent = t("common.viewProperties");

  const qs = document.getElementById("recherche-rapide");
  if (qs) {
    const replaceTextNodes = (el, nextText) => {
      if (!(el instanceof HTMLElement)) return;
      for (const n of Array.from(el.childNodes)) {
        if (n.nodeType === 3) el.removeChild(n);
      }
      el.append(document.createTextNode(` ${nextText}`));
    };

    const tabAll = qs.querySelector("label[for=\"home-cat-all\"]");
    const tabRent = qs.querySelector("label[for=\"home-cat-rent\"]");
    const tabSale = qs.querySelector("label[for=\"home-cat-sale\"]");
    if (tabAll instanceof HTMLElement) tabAll.textContent = t("search.tabs.all");
    if (tabRent instanceof HTMLElement) tabRent.textContent = t("search.tabs.rent");
    if (tabSale instanceof HTMLElement) tabSale.textContent = t("search.tabs.buy");

    const where = qs.querySelector(".is24-field.large .is24-label");
    if (where instanceof HTMLElement) where.textContent = t("search.where");
    const q = qs.querySelector("#home-q");
    if (q instanceof HTMLInputElement) q.placeholder = t("search.where.placeholder");

    const priceFrom = qs.querySelector(".is24-field:nth-of-type(2) .is24-label");
    if (priceFrom instanceof HTMLElement) priceFrom.textContent = t("search.priceFrom");
    const priceTo = qs.querySelector(".is24-field:nth-of-type(3) .is24-label");
    if (priceTo instanceof HTMLElement) priceTo.textContent = t("search.priceTo");

    const minPrice = qs.querySelector("input[name=\"minPrice\"]");
    if (minPrice instanceof HTMLInputElement) minPrice.placeholder = t("search.min");
    const maxPrice = qs.querySelector("input[name=\"maxPrice\"]");
    if (maxPrice instanceof HTMLInputElement) maxPrice.placeholder = t("search.max");

    const rooms = qs.querySelector(".is24-field:nth-of-type(4) .is24-label");
    if (rooms instanceof HTMLElement) rooms.textContent = t("search.roomsFrom");
    const roomsSel = qs.querySelector("select[name=\"minRooms\"]");
    if (roomsSel instanceof HTMLSelectElement) {
      const first = roomsSel.querySelector("option[value=\"\"]");
      if (first instanceof HTMLOptionElement) first.textContent = t("search.any");
    }

    const more = qs.querySelector("details.is24-more > summary");
    replaceTextNodes(more, t("search.more"));

    const regionLabel = qs.querySelector("select[name=\"region\"]")?.closest(".field")?.querySelector(".label");
    if (regionLabel instanceof HTMLElement) regionLabel.textContent = t("search.region");
    const regionSel = qs.querySelector("select[name=\"region\"]");
    if (regionSel instanceof HTMLSelectElement) {
      for (const opt of Array.from(regionSel.options)) {
        const v = (opt.value || "").trim();
        if (v === "") opt.textContent = t("search.region.all");
        if (v === "Jura bernois") opt.textContent = getLang() === "en" ? "Bernese Jura" : "Jura bernois";
      }
    }

    const typeLabel = qs.querySelector("select[name=\"type\"]")?.closest(".field")?.querySelector(".label");
    if (typeLabel instanceof HTMLElement) typeLabel.textContent = t("search.type");
    const typeSel = qs.querySelector("select[name=\"type\"]");
    if (typeSel instanceof HTMLSelectElement) {
      for (const opt of Array.from(typeSel.options)) {
        const v = (opt.getAttribute("value") || "").trim();
        if (v === "") opt.textContent = t("search.type.all");
        if (v === "Appartement") opt.textContent = t("type.apartment");
        if (v === "Maison") opt.textContent = t("type.house");
        if (v === "Villa") opt.textContent = t("type.villa");
      }
    }

    const minSurfaceLabel = qs.querySelector("input[name=\"minSurface\"]")?.closest(".field")?.querySelector(".label");
    if (minSurfaceLabel instanceof HTMLElement) minSurfaceLabel.textContent = t("search.surfaceMin");
    const minSurface = qs.querySelector("input[name=\"minSurface\"]");
    if (minSurface instanceof HTMLInputElement) {
      const raw = (minSurface.placeholder || "").trim();
      if (raw.startsWith("ex")) minSurface.placeholder = getLang() === "en" ? "e.g. 70" : "ex : 70";
    }
    const localityLabel = qs.querySelector("input[name=\"locality\"]")?.closest(".field")?.querySelector(".label");
    if (localityLabel instanceof HTMLElement) localityLabel.textContent = t("search.cityExact");
    const locality = qs.querySelector("input[name=\"locality\"]");
    if (locality instanceof HTMLInputElement) {
      const raw = (locality.placeholder || "").trim();
      if (raw.startsWith("ex")) locality.placeholder = getLang() === "en" ? "e.g. Tavannes" : "ex : Tavannes";
    }
    const featsLabel = qs.querySelector(".field.full .label");
    if (featsLabel instanceof HTMLElement) featsLabel.textContent = t("search.features");

    const chips = Array.from(qs.querySelectorAll(".filter-chip"));
    for (const chip of chips) {
      if (!(chip instanceof HTMLLabelElement)) continue;
      const v = chip.querySelector("input")?.getAttribute("value") || "";
      const s = chip.querySelector("span");
      if (!(s instanceof HTMLElement)) continue;
      if (v === "Cheminée") s.textContent = t("tag.fireplace");
      if (v === "Jardin") s.textContent = t("tag.garden");
      if (v === "Terrasse") s.textContent = t("tag.terrace");
      if (v === "Balcon") s.textContent = t("tag.balcony");
      if (v === "Garage") s.textContent = t("tag.garage");
      if (v === "Ascenseur") s.textContent = t("tag.elevator");
      if (v === "Calme") s.textContent = t("tag.quiet");
      if (v === "Rénové") s.textContent = t("tag.renovated");
      if (v === "Neuf") s.textContent = t("tag.new");
      if (v === "Proche gare") s.textContent = t("tag.nearStation");
    }

    const submit = qs.querySelector("button[type=\"submit\"].is24-btn.primary");
    if (submit instanceof HTMLButtonElement) {
      replaceTextNodes(submit, t("search.submit"));
    }
  }

  const deals = document.getElementById("bonnes-affaires");
  if (deals) {
    const h2 = deals.querySelector(".section-head h2");
    if (h2 instanceof HTMLElement) h2.textContent = t("home.deals.title");
    const lead = deals.querySelector(".section-head p.lead");
    if (lead instanceof HTMLElement) lead.textContent = t("home.deals.subtitle");
    const viewAll = deals.querySelector(".section-head a.btn.primary");
    if (viewAll instanceof HTMLAnchorElement) viewAll.textContent = t("actions.viewAll");
    const hscroll = deals.querySelector(".hscroll[aria-label]");
    if (hscroll instanceof HTMLElement) hscroll.setAttribute("aria-label", t("home.deals.aria"));
  }

  for (const a of Array.from(document.querySelectorAll("#bonnes-affaires a.listing-link[aria-label]"))) {
    if (a instanceof HTMLAnchorElement) a.setAttribute("aria-label", t("listing.open"));
  }

  const translateDealBadge = (raw) => {
    const v = String(raw || "").trim();
    if (!v) return v;
    if (v === "Baisse de prix") return t("home.deals.badge.priceDrop");
    if (v === "Charges incluses") return t("home.deals.badge.utilitiesIncluded");
    if (v === "Coup de cœur") return t("home.deals.badge.topPick");
    if (v === "Disponible de suite") return t("home.deals.badge.availableNow");
    return v;
  };

  const translateTagExtra = (raw) => {
    const v = String(raw || "").trim();
    if (!v) return v;
    if (v === "Centre") return getLang() === "en" ? "Central" : v;
    if (v === "Grenier") return getLang() === "en" ? "Attic" : v;
    if (v === "Cave") return getLang() === "en" ? "Cellar" : v;
    if (v === "Buanderie") return getLang() === "en" ? "Laundry room" : v;
    return v;
  };

  for (const card of Array.from(document.querySelectorAll("#bonnes-affaires article.card.listing"))) {
    if (!(card instanceof HTMLElement)) continue;
    const status = card.querySelector(".status-ribbon");
    if (status instanceof HTMLElement) {
      const raw = (status.textContent || "").trim();
      if (raw === "Vendu") status.textContent = t("status.sold");
      if (raw === "Loué") status.textContent = t("status.rented");
    }

    const pill = card.querySelector(".pill");
    if (pill instanceof HTMLElement) {
      for (const s of Array.from(pill.querySelectorAll("span"))) {
        if (!(s instanceof HTMLElement)) continue;
        const txt = (s.textContent || "").trim();
        if (txt === "À vendre") s.textContent = t("biens.btn.sale");
        if (txt === "À louer") s.textContent = t("biens.btn.rent");
        if (txt === "Appartement") s.textContent = t("type.apartment");
        if (txt === "Maison") s.textContent = t("type.house");
        if (txt === "Villa") s.textContent = t("type.villa");
      }
    }

    const dealBadge = card.querySelector(".deal-badge");
    if (dealBadge instanceof HTMLElement) dealBadge.textContent = translateDealBadge(dealBadge.textContent);

    for (const tag of Array.from(card.querySelectorAll(".tag"))) {
      if (!(tag instanceof HTMLElement)) continue;
      const before = (tag.textContent || "").trim();
      const after = translateTagExtra(before);
      if (after !== before) tag.textContent = after;
    }

    const details = card.querySelector(".listing-bottom .btn.small.primary");
    if (details instanceof HTMLElement) details.textContent = t("listing.details");

    const priceSuffix = card.querySelector(".listing-bottom .price span");
    if (priceSuffix instanceof HTMLElement) {
      const raw = (priceSuffix.textContent || "").trim();
      if (raw === "/mois" || raw === "/month") priceSuffix.textContent = t("home.priceSuffix.month");
    }

    const meta = card.querySelector(".meta");
    if (meta instanceof HTMLElement) {
      let v = meta.textContent || "";
      v = v.replace(/\bJura bernois\b/gi, getLang() === "en" ? "Bernese Jura" : "Jura bernois");
      v = v.replace(/\bpièces\b/gi, getLang() === "en" ? "rooms" : "pièces");
      meta.textContent = v;
    }
  }

  const examples = document.getElementById("exemples-biens");
  if (examples) {
    const h2 = examples.querySelector("h2");
    if (h2 instanceof HTMLElement) h2.textContent = t("home.examples.title");
    const lead = examples.querySelector("p.lead");
    if (lead instanceof HTMLElement) lead.textContent = t("home.examples.subtitle");
    const viewAll = examples.querySelector("a.btn.primary[href=\"./biens.html\"]");
    if (viewAll instanceof HTMLAnchorElement) viewAll.textContent = t("home.examples.viewAll");
    for (const a of Array.from(examples.querySelectorAll("a.listing-link[aria-label]"))) {
      if (a instanceof HTMLAnchorElement) a.setAttribute("aria-label", t("listing.open"));
    }
  }

  for (const card of Array.from(document.querySelectorAll("#exemples-biens article.card.listing"))) {
    if (!(card instanceof HTMLElement)) continue;
    const badge = card.querySelector(".deal-badge");
    if (badge instanceof HTMLElement) {
      const v = (badge.textContent || "").trim();
      if (v.includes("Vedette") || v.includes("Featured") || v.includes("✨")) badge.textContent = t("listing.featured");
    }
    const pill = card.querySelector(".pill");
    if (pill instanceof HTMLElement) {
      for (const s of Array.from(pill.querySelectorAll("span"))) {
        if (!(s instanceof HTMLElement)) continue;
        const txt = (s.textContent || "").trim();
        if (txt === "À vendre") s.textContent = t("biens.btn.sale");
        if (txt === "À louer") s.textContent = t("biens.btn.rent");
        if (txt === "Appartement") s.textContent = t("type.apartment");
        if (txt === "Maison") s.textContent = t("type.house");
        if (txt === "Villa") s.textContent = t("type.villa");
      }
    }
    const details = card.querySelector(".listing-bottom .btn.small.primary");
    if (details instanceof HTMLElement) details.textContent = t("listing.details");
    const priceSuffix = card.querySelector(".listing-bottom .price span");
    if (priceSuffix instanceof HTMLElement) {
      const raw = (priceSuffix.textContent || "").trim();
      if (raw === "/mois" || raw === "/month") priceSuffix.textContent = t("home.priceSuffix.month");
    }
    const meta = card.querySelector(".meta");
    if (meta instanceof HTMLElement) {
      let v = meta.textContent || "";
      v = v.replace(/\bJura bernois\b/gi, getLang() === "en" ? "Bernese Jura" : "Jura bernois");
      v = v.replace(/\bpièces\b/gi, getLang() === "en" ? "rooms" : "pièces");
      meta.textContent = v;
    }
  }

  applyHomeListingContent("#bonnes-affaires");
  applyHomeListingContent("#exemples-biens");

  const perf = document.querySelector(".advice-performance");
  if (perf instanceof HTMLElement) {
    perf.setAttribute("aria-label", t("home.perf.aria"));
    const kicker = perf.querySelector(".advice-performance-kicker-text");
    if (kicker instanceof HTMLElement) kicker.textContent = t("home.perf.kicker");
    const h2 = perf.querySelector(".advice-performance-head h2");
    if (h2 instanceof HTMLElement) h2.textContent = t("home.perf.title");
    const p = perf.querySelector(".advice-performance-head p");
    if (p instanceof HTMLElement) p.textContent = t("home.perf.sub");
    const kpiLabels = Array.from(perf.querySelectorAll(".advice-kpi-label"));
    if (kpiLabels[0] instanceof HTMLElement) kpiLabels[0].textContent = t("home.kpi.sold");
    if (kpiLabels[1] instanceof HTMLElement) kpiLabels[1].textContent = t("home.kpi.rented");
    if (kpiLabels[2] instanceof HTMLElement) kpiLabels[2].textContent = t("home.kpi.satisfaction");
    for (const sub of Array.from(perf.querySelectorAll(".advice-kpi-sub"))) {
      if (sub instanceof HTMLElement) sub.textContent = t("home.kpi.period");
    }

    const mapTitles = Array.from(perf.querySelectorAll(".advice-map-title"));
    if (mapTitles[0] instanceof HTMLElement) mapTitles[0].textContent = t("home.map.jura.title");
    if (mapTitles[1] instanceof HTMLElement) mapTitles[1].textContent = t("home.map.bern.title");
    for (const sec of Array.from(perf.querySelectorAll(".advice-map-sector span:last-child"))) {
      if (sec instanceof HTMLElement) sec.textContent = t("home.map.sector");
    }
    const leads = Array.from(perf.querySelectorAll(".advice-map-lead"));
    if (leads[0] instanceof HTMLElement) leads[0].textContent = t("home.map.jura.lead");
    if (leads[1] instanceof HTMLElement) leads[1].textContent = t("home.map.bern.lead");
    for (const note of Array.from(perf.querySelectorAll(".advice-map-note div"))) {
      if (note instanceof HTMLElement) note.textContent = t("home.mapCta.text");
    }
    const imgs = Array.from(perf.querySelectorAll(".advice-map-right img[alt]"));
    if (imgs[0] instanceof HTMLImageElement) imgs[0].alt = t("home.map.jura.imgAlt");
    if (imgs[1] instanceof HTMLImageElement) imgs[1].alt = t("home.map.bern.imgAlt");
  }

  for (const link of Array.from(document.querySelectorAll("a.advice-map-cta"))) {
    if (!(link instanceof HTMLAnchorElement)) continue;
    const arrow = link.querySelector("span[aria-hidden=\"true\"]");
    link.textContent = t("actions.learnMore") + " ";
    if (arrow) link.appendChild(arrow);
  }

  const newsHead = document.querySelector(".advice-news-head h3");
  if (newsHead instanceof HTMLElement) newsHead.textContent = t("home.news.title");
  const newsSub = document.querySelector(".advice-news-head p");
  if (newsSub instanceof HTMLElement) newsSub.textContent = t("home.news.subtitle");
  const newsPrev = document.querySelector("[data-news-prev]");
  if (newsPrev instanceof HTMLButtonElement) newsPrev.setAttribute("aria-label", t("carousel.prevAria"));
  const newsNext = document.querySelector("[data-news-next]");
  if (newsNext instanceof HTMLButtonElement) newsNext.setAttribute("aria-label", t("carousel.nextAria"));

  const slides = Array.from(document.querySelectorAll(".advice-news-slide"));
  const slideKeys = ["market", "outlook", "rent", "risk", "advice"];
  for (let i = 0; i < slides.length; i += 1) {
    const slide = slides[i];
    if (!(slide instanceof HTMLElement)) continue;
    const k = slideKeys[i % slideKeys.length] || "";
    if (!k) continue;
    slide.setAttribute("aria-label", t(`home.news.slide.${k}.aria`));
    const tag = slide.querySelector(".advice-news-tag");
    if (tag instanceof HTMLElement) tag.textContent = t(`home.news.slide.${k}.tag`);
    const title = slide.querySelector("h4");
    if (title instanceof HTMLElement) title.textContent = t(`home.news.slide.${k}.title`);
    const p = slide.querySelector("p");
    if (p instanceof HTMLElement) p.textContent = t(`home.news.slide.${k}.sub`);
  }

  const sideRate = document.querySelector(".advice-news-side .advice-side-card .advice-side-k");
  if (sideRate instanceof HTMLElement) sideRate.textContent = t("home.side.rateBns");
  const sideUbsTitle = document.querySelector(".advice-news-side .advice-side-cta .advice-side-cta-title");
  if (sideUbsTitle instanceof HTMLElement) sideUbsTitle.textContent = t("home.side.readUbs");
  const sideUbsSub = document.querySelector(".advice-news-side .advice-side-cta .advice-side-cta-sub");
  if (sideUbsSub instanceof HTMLElement) sideUbsSub.textContent = t("home.side.readUbsSub");

  const servicesTitle = document.querySelector(".services-section .services-title");
  if (servicesTitle instanceof HTMLElement) servicesTitle.textContent = t("home.services.title");
  const servicesIntro = document.querySelector(".services-section .services-intro");
  if (servicesIntro instanceof HTMLElement) servicesIntro.textContent = t("home.services.intro");
  const servicesAria = document.querySelector(".services-section .services-showcase");
  if (servicesAria instanceof HTMLElement) servicesAria.setAttribute("aria-label", t("home.services.detailedAria"));

  const svcBlocks = Array.from(document.querySelectorAll(".services-section article.service-feature"));
  for (let i = 0; i < svcBlocks.length; i += 1) {
    const block = svcBlocks[i];
    if (!(block instanceof HTMLElement)) continue;
    const n = i + 1;
    const title = block.querySelector("h3");
    const lead = block.querySelector(".service-feature-lead");
    const cta = block.querySelector("a.service-feature-cta");
    if (title instanceof HTMLElement) {
      const num = title.querySelector(".num");
      if (num instanceof HTMLElement) num.textContent = String(n).padStart(2, "0");
      for (const node of Array.from(title.childNodes)) {
        if (node.nodeType === 3) node.nodeValue = ` ${t(`home.services.s${n}.title`)}`;
      }
    }
    if (lead instanceof HTMLElement) lead.textContent = t(`home.services.s${n}.lead`);
    const li = Array.from(block.querySelectorAll("ul.service-feature-steps li"));
    for (let j = 0; j < li.length; j += 1) {
      const strong = li[j].querySelector("strong");
      const p = li[j].querySelector("p");
      if (strong instanceof HTMLElement) strong.textContent = t(`home.services.s${n}.i${j + 1}.k`);
      if (p instanceof HTMLElement) p.textContent = t(`home.services.s${n}.i${j + 1}.p`);
    }
    if (cta instanceof HTMLAnchorElement) cta.textContent = t(`home.services.s${n}.cta`);
  }

  const partnersK = document.querySelector(".partners .partners-k");
  if (partnersK instanceof HTMLElement) partnersK.textContent = t("home.partners.k");
  const partnersTitle = document.querySelector(".partners .partners-head h2");
  if (partnersTitle instanceof HTMLElement) partnersTitle.textContent = t("home.partners.title");
  const partnersLead = document.querySelector(".partners .partners-head p");
  if (partnersLead instanceof HTMLElement) partnersLead.textContent = t("home.partners.lead");
  const partnersPanel = document.querySelector(".partners .partners-panel[aria-label]");
  if (partnersPanel instanceof HTMLElement) partnersPanel.setAttribute("aria-label", t("home.partners.aria"));
  const partnerCards = Array.from(document.querySelectorAll(".partners .partner-card"));
  for (let i = 0; i < partnerCards.length; i += 1) {
    const card = partnerCards[i];
    if (!(card instanceof HTMLElement)) continue;
    const idx = i + 1;
    const pill = card.querySelector(".partner-pill span:last-child");
    if (pill instanceof HTMLElement) pill.textContent = t(`home.partners.p${idx}.pill`);
    const desc = card.querySelector(".partner-desc");
    if (desc instanceof HTMLElement) desc.textContent = t(`home.partners.p${idx}.desc`);
    if (idx === 4) {
      const aria = card.getAttribute("aria-label") || "";
      if (aria.includes("site en construction") || aria.includes("under construction")) {
        card.setAttribute("aria-label", `${card.querySelector(".partner-name")?.textContent || "DCKI CLEAN SERVICE"} — ${t("toast.construction")}`);
      }
      card.setAttribute("data-construction-toast", t("toast.construction"));
    }
  }

  const tHead = document.querySelector(".testimonials .testimonials-head h2");
  if (tHead instanceof HTMLElement) tHead.textContent = t("home.testimonials.title");
  const tAll = document.querySelector(".testimonials .testimonials-head .testimonials-all");
  if (tAll instanceof HTMLAnchorElement) {
    const arrow = tAll.querySelector("span[aria-hidden=\"true\"]");
    tAll.textContent = t("home.testimonials.viewAll") + " ";
    if (arrow) tAll.appendChild(arrow);
  }
  const tNav = document.querySelector(".testimonials .testimonials-nav[aria-label]");
  if (tNav instanceof HTMLElement) tNav.setAttribute("aria-label", t("home.testimonials.navAria"));
  const tPrev = document.querySelector("[data-testimonials-prev]");
  if (tPrev instanceof HTMLButtonElement) tPrev.setAttribute("aria-label", t("home.testimonials.prevAria"));
  const tNext = document.querySelector("[data-testimonials-next]");
  if (tNext instanceof HTMLButtonElement) tNext.setAttribute("aria-label", t("home.testimonials.nextAria"));
  const tDots = document.querySelector(".testimonials .testimonials-dots[aria-label]");
  if (tDots instanceof HTMLElement) tDots.setAttribute("aria-label", t("home.testimonials.dotsAria"));

  const quotes = Array.from(document.querySelectorAll(".testimonials .testimonials-quote"));
  const whos = Array.from(document.querySelectorAll(".testimonials .testimonials-who"));
  for (let i = 0; i < quotes.length; i += 1) {
    if (quotes[i] instanceof HTMLElement) quotes[i].textContent = t(`home.testimonials.q${i + 1}`);
    if (whos[i] instanceof HTMLElement) whos[i].textContent = t(`home.testimonials.w${i + 1}`);
  }
}

function applyDossierPage() {
  const page = document.body.getAttribute("data-page");
  if (page !== "dossier") return;
  document.title = t("page.dossier.title");

  setTextAll(".dossier-title", t("dossier.title"));
  setTextAll(".dossier-lead", t("dossier.lead"));
  setTextAll(".dossier-form h2", t("dossier.form.title"));
  setTextAll(".dossier-form .fine", t("dossier.form.note"));
  setTextAll(".dossier-contact h2", t("dossier.contact.title"));
  setTextAll(".dossier-docs h3", t("dossier.docs.title"));
  setTextAll(".dossier-docs .fine", t("dossier.docs.note"));

  setTextAll("form[data-demo-form=\"Demande de dossier\"] .field:nth-of-type(1) .label", t("dossier.form.name"));
  setTextAll("form[data-demo-form=\"Demande de dossier\"] .field:nth-of-type(2) .label", t("dossier.form.email"));
  setTextAll("form[data-demo-form=\"Demande de dossier\"] .field:nth-of-type(3) .label", t("dossier.form.phone"));
  setTextAll("form[data-demo-form=\"Demande de dossier\"] .field:nth-of-type(4) .label", t("dossier.form.type"));
  setTextAll("form[data-demo-form=\"Demande de dossier\"] .field:nth-of-type(5) .label", t("dossier.form.ref"));
  setTextAll("form[data-demo-form=\"Demande de dossier\"] .field:nth-of-type(6) .label", t("dossier.form.message"));
  setTextAll("form[data-demo-form=\"Demande de dossier\"] .field:nth-of-type(7) .label", t("dossier.form.files"));

  const heroImg = document.querySelector(".dossier-hero img[alt]");
  if (heroImg instanceof HTMLImageElement) heroImg.alt = t("dossier.hero.imageAlt");

  const dossierMsg = document.querySelector("form[data-demo-form=\"Demande de dossier\"] textarea[name=\"message\"]");
  if (dossierMsg instanceof HTMLTextAreaElement) dossierMsg.placeholder = t("dossier.form.message.placeholder");

  const dossierName = document.querySelector("form[data-demo-form=\"Demande de dossier\"] input[name=\"name\"]");
  if (dossierName instanceof HTMLInputElement) dossierName.placeholder = t("placeholders.fullName");

  const choose = document.querySelector("form[data-demo-form=\"Demande de dossier\"] label.btn[for=\"dossier-files\"]");
  if (choose instanceof HTMLElement) choose.textContent = t("dossier.form.chooseFiles");

  const send = document.querySelector("form[data-demo-form=\"Demande de dossier\"] button[type=\"submit\"]");
  if (send instanceof HTMLButtonElement) send.textContent = t("dossier.form.send");

  const searchBtn = document.querySelector("form[data-demo-form=\"Demande de dossier\"] a.btn[href^=\"./index.html#recherche-rapide\"]");
  if (searchBtn instanceof HTMLAnchorElement) searchBtn.textContent = t("common.searchProperty");

  const mapLinks = Array.from(document.querySelectorAll(".dossier-contact a"));
  for (const a of mapLinks) {
    if (!(a instanceof HTMLAnchorElement)) continue;
    const raw = (a.textContent || "").trim();
    if (raw === "Ouvrir dans Maps" || raw === "Open in Maps") a.textContent = t("common.openMaps");
    if (raw === "Vue 3D Google Maps" || raw === "Google Maps 3D view") a.textContent = t("common.maps3d");
  }

  const typeSelect = document.querySelector("form[data-demo-form=\"Demande de dossier\"] select[name=\"type\"]");
  if (typeSelect instanceof HTMLSelectElement) {
    for (const opt of Array.from(typeSelect.options)) {
      const v = (opt.getAttribute("value") || "").trim();
      if (v === "Location") opt.textContent = t("dossier.form.type.rent");
      if (v === "Achat") opt.textContent = t("dossier.form.type.sale");
    }
  }

  const pills = document.querySelectorAll(".dossier-pills .pill strong");
  for (const el of Array.from(pills)) {
    if (!(el instanceof HTMLElement)) continue;
    const raw = (el.textContent || "").trim().toLowerCase();
    if (raw === "contact") el.textContent = t("dossier.contact.contact");
    if (raw === "adresse") el.textContent = t("dossier.contact.address");
  }

  const docTags = Array.from(document.querySelectorAll(".dossier-docs .meta .tag"));
  for (const tag of docTags) {
    if (!(tag instanceof HTMLElement)) continue;
    const raw = (tag.textContent || "").trim();
    if (raw === "Pièce d’identité") tag.textContent = t("dossier.docs.id");
    if (raw === "3 dernières fiches de salaire") tag.textContent = t("dossier.docs.paySlips3");
    if (raw === "Attestation poursuites") tag.textContent = t("dossier.docs.debtRecord");
    if (raw === "Extrait du casier judiciaire") tag.textContent = t("dossier.docs.criminalRecord");
    if (raw === "Coordonnées") tag.textContent = t("dossier.docs.contactDetails");
  }
}

function applyContactPage() {
  const page = document.body.getAttribute("data-page");
  if (page !== "contact") return;

  setTextAll(".contact-hero-k", t("contact.kicker"));
  setTextAll(".contact-hero-title", t("contact.title"));
  setTextAll(".contact-hero-lead", t("contact.lead"));
  setTextAll(".contact-hero-sub", t("contact.sub"));

  const heroPrimary = document.querySelector(".contact-hero-actions a.btn.primary[href=\"#formulaire\"]");
  if (heroPrimary instanceof HTMLAnchorElement) heroPrimary.textContent = t("contact.cta.primary");
  const heroDossier = document.querySelector(".contact-hero-actions a.btn[href=\"./dossier.html\"]");
  if (heroDossier instanceof HTMLAnchorElement) heroDossier.textContent = t("nav.dossier");

  setTextAll(".contact-who-title", t("contact.who"));
  const whoP = Array.from(document.querySelectorAll(".contact-who-text p"));
  if (whoP[0] instanceof HTMLElement) whoP[0].textContent = t("contact.who.p1");
  if (whoP[1] instanceof HTMLElement) whoP[1].textContent = t("contact.who.p2");
  if (whoP[2] instanceof HTMLElement) whoP[2].textContent = t("contact.who.p3");
  setTextAll(".contact-values-section h2", t("contact.values"));
  setAttrAll(".contact-values-list", "aria-label", t("contact.values"));
  const values = Array.from(document.querySelectorAll(".contact-values-list li"));
  if (values[0] instanceof HTMLElement) values[0].textContent = t("contact.values.i1");
  if (values[1] instanceof HTMLElement) values[1].textContent = t("contact.values.i2");
  if (values[2] instanceof HTMLElement) values[2].textContent = t("contact.values.i3");
  if (values[3] instanceof HTMLElement) values[3].textContent = t("contact.values.i4");

  setTextAll(".contact-team-showcase h2", t("contact.team"));
  setTextAll(".contact-team-showcase .section-head .lead", t("contact.team.lead"));
  setTextAll(".team-role", t("contact.team.role"));
  setTextAll(".team-desc", t("contact.team.desc"));

  const proofReply = document.querySelector(".team-proof .team-proof-item span:last-child");
  if (proofReply instanceof HTMLElement) proofReply.textContent = t("contact.team.proof.reply");

  const callBtn = document.querySelector(".team-contact a.btn.primary[href^=\"tel:\"]");
  if (callBtn instanceof HTMLAnchorElement) callBtn.textContent = t("contact.cta.call");
  const msgBtn = document.querySelector(".team-contact a.btn[href=\"#formulaire\"]:not([data-open-appointment])");
  if (msgBtn instanceof HTMLAnchorElement) msgBtn.textContent = t("contact.cta.message");
  const apptBtn = document.querySelector(".team-contact a.btn[data-open-appointment]");
  if (apptBtn instanceof HTMLAnchorElement) apptBtn.textContent = t("contact.cta.appointment");

  setTextAll("section#contact .section-head h2", t("contact.details"));
  setTextAll("section#contact .section-head .lead", t("contact.details.lead"));
  for (const k of Array.from(document.querySelectorAll("section#contact .contact-grid .contact-card .k"))) {
    if (!(k instanceof HTMLElement)) continue;
    const raw = (k.textContent || "").trim();
    if (raw === "Email" || raw === "E-mail") k.textContent = t("listing.contact.email");
    if (raw === "Téléphone") k.textContent = t("listing.contact.phone");
    if (raw === "Adresse") k.textContent = t("listing.contact.address");
  }

  setTextAll("#formulaire h2", t("contact.form"));

  const typeLabel = document.querySelector("#contact-request-type")?.closest(".field")?.querySelector(".label");
  if (typeLabel instanceof HTMLElement) typeLabel.textContent = t("contact.form.type");

  const reqSel = document.getElementById("contact-request-type");
  if (reqSel instanceof HTMLSelectElement) {
    for (const opt of Array.from(reqSel.options)) {
      const v = (opt.getAttribute("value") || opt.textContent || "").trim();
      if (v === "Demande de visite") opt.textContent = t("req.visit");
      if (v === "Demande de dossier") opt.textContent = t("req.dossier");
      if (v === "Louer un bien") opt.textContent = t("req.rent");
      if (v === "Acheter un bien") opt.textContent = t("req.buy");
      if (v === "Conseils") opt.textContent = t("req.advice");
      if (v === "Question") opt.textContent = t("req.question");
    }
  }

  for (const a of Array.from(document.querySelectorAll("a[href^=\"https://www.google.com/maps\"]"))) {
    if (!(a instanceof HTMLAnchorElement)) continue;
    const raw = (a.textContent || "").trim();
    if (raw === "Ouvrir dans Maps") a.textContent = t("common.openMaps");
    if (raw === "Vue 3D Google Maps") a.textContent = t("common.maps3d");
  }

  const cf = document.getElementById("contact-form");
  if (cf instanceof HTMLFormElement) {
    setTextAll("#contact-form .field:nth-of-type(1) .label", t("contact.form.name"));
    setTextAll("#contact-form .field:nth-of-type(2) .label", t("contact.form.email"));
    setTextAll("#contact-form .field:nth-of-type(3) .label", t("contact.form.phone"));
    setTextAll("#contact-form .field:nth-of-type(4) .label", t("contact.form.type"));
    setTextAll("#contact-form .field:nth-of-type(5) .label", t("contact.form.availability"));
    setTextAll("#contact-form [data-attachments-field] .label", t("contact.form.files"));
    setTextAll("#contact-form .field:last-of-type .label", t("contact.form.message"));
    const msg = document.getElementById("contact-message");
    if (msg instanceof HTMLTextAreaElement) msg.placeholder = t("contact.form.message.placeholder");
    const name = cf.querySelector("input[name=\"name\"]");
    if (name instanceof HTMLInputElement) name.placeholder = t("placeholders.fullName");
    const apptKs = Array.from(cf.querySelectorAll(".appointment-k"));
    if (apptKs[0] instanceof HTMLElement) apptKs[0].textContent = t("appointment.calendar");
    if (apptKs[1] instanceof HTMLElement) apptKs[1].textContent = t("appointment.times");
    const choose = cf.querySelector("label.btn[for=\"contact-files\"]");
    if (choose instanceof HTMLElement) choose.textContent = t("contact.form.chooseFiles");
    const send = cf.querySelector("button[type=\"submit\"]");
    if (send instanceof HTMLButtonElement) send.textContent = t("contact.form.send");
    const view = cf.querySelector(".actions a.btn[href=\"./biens.html\"]");
    if (view instanceof HTMLAnchorElement) view.textContent = t("common.viewProperties");
  }
}

function applyBiensPage() {
  const page = document.body.getAttribute("data-page");
  if (page !== "biens") return;

  document.title = t("page.biens.title");

  setTextAll(".catalog-hero-panel h2", t("biens.hero.title"));
  setTextAll(".catalog-hero-panel p.lead", t("biens.hero.lead"));
  setTextAll(".catalog-hero-panel .pill strong", t("biens.total"));

  const saleBtn = document.querySelector("[data-cat-sale]");
  if (saleBtn instanceof HTMLAnchorElement) saleBtn.textContent = t("biens.btn.sale");
  const rentBtn = document.querySelector("[data-cat-rent]");
  if (rentBtn instanceof HTMLAnchorElement) rentBtn.textContent = t("biens.btn.rent");
  const searchBtn = document.querySelector(".catalog-hero-panel a.btn.primary[href*=\"#recherche-rapide\"]");
  if (searchBtn instanceof HTMLAnchorElement) searchBtn.textContent = t("biens.btn.search");

  const trust = document.querySelector(".catalog-hero-panel .trust-strip");
  if (trust instanceof HTMLElement) trust.setAttribute("aria-label", t("biens.trust.aria"));
  const trustItems = Array.from(document.querySelectorAll(".catalog-hero-panel .trust-strip .item"));
  if (trustItems[0] instanceof HTMLElement) trustItems[0].textContent = t("biens.trust.one");
  if (trustItems[1] instanceof HTMLElement) trustItems[1].textContent = t("biens.trust.two");
  if (trustItems[2] instanceof HTMLElement) trustItems[2].textContent = t("biens.trust.three");

  const saleTitle = document.querySelector("#vendre > div > h2");
  if (saleTitle instanceof HTMLElement) saleTitle.textContent = t("biens.btn.sale");
  const rentTitle = document.querySelector("#louer > div > h2");
  if (rentTitle instanceof HTMLElement) rentTitle.textContent = t("biens.btn.rent");

  setTextAll("#vendre .pill strong", t("biens.results"));
  setTextAll("#louer .pill strong", t("biens.results"));

  for (const a of Array.from(document.querySelectorAll("a.listing-link[aria-label=\"Ouvrir le détail du bien\"]"))) {
    if (a instanceof HTMLAnchorElement) a.setAttribute("aria-label", t("listing.open"));
  }

  const translateType = (raw) => {
    const v = String(raw || "").trim();
    if (v === "Appartement") return t("type.apartment");
    if (v === "Maison") return t("type.house");
    if (v === "Villa") return t("type.villa");
    return v;
  };

  const translateTag = (raw) => {
    const v = String(raw || "").trim();
    if (v === "Cheminée") return t("tag.fireplace");
    if (v === "Jardin") return t("tag.garden");
    if (v === "Terrasse") return t("tag.terrace");
    if (v === "Balcon") return t("tag.balcony");
    if (v === "Garage") return t("tag.garage");
    if (v === "Ascenseur") return t("tag.elevator");
    if (v === "Calme") return t("tag.quiet");
    if (v === "Rénové") return t("tag.renovated");
    if (v === "Neuf") return t("tag.new");
    if (v === "Proche gare") return t("tag.nearStation");
    return v;
  };

  for (const card of Array.from(document.querySelectorAll("article.card.listing"))) {
    if (!(card instanceof HTMLElement)) continue;
    const cat = (card.getAttribute("data-category") || "").trim();
    const isSale = cat === "sale";
    const isRent = cat === "rent";

    const pillSpans = Array.from(card.querySelectorAll(".pill span"));
    for (const s of pillSpans) {
      if (!(s instanceof HTMLElement)) continue;
      const txt = (s.textContent || "").trim();
      if (txt === "À vendre" || txt === "À louer") s.textContent = isSale ? t("biens.btn.sale") : isRent ? t("biens.btn.rent") : txt;
      if (txt === "Appartement" || txt === "Maison" || txt === "Villa") s.textContent = translateType(txt);
    }

    const featured = card.querySelector(".deal-badge");
    if (featured instanceof HTMLElement) {
      const v = (featured.textContent || "").trim();
      if (v.includes("Vedette") || v.includes("Featured") || v.includes("✨")) featured.textContent = t("listing.featured");
    }

    const details = card.querySelector(".listing-bottom .btn.small.primary");
    if (details instanceof HTMLElement) details.textContent = t("listing.details");

    for (const tag of Array.from(card.querySelectorAll(".tag"))) {
      if (tag instanceof HTMLElement) tag.textContent = translateTag(tag.textContent);
    }

    const meta = card.querySelector(".meta");
    if (meta instanceof HTMLElement) {
      let v = meta.textContent || "";
      v = v.replace(/\bpièces\b/gi, getLang() === "en" ? "rooms" : "pièces");
      v = v.replace(/\bAppartement\b/g, translateType("Appartement"));
      v = v.replace(/\bMaison\b/g, translateType("Maison"));
      v = v.replace(/\bVilla\b/g, translateType("Villa"));
      meta.textContent = v;
    }
  }
}

function applyListingPage() {
  const page = document.body.getAttribute("data-page");
  if (page !== "listing") return;

  document.title = t("page.listing.title");

  const back = document.querySelector("a.btn.ghost.small[href=\"./biens.html\"]");
  if (back instanceof HTMLAnchorElement) back.textContent = t("listing.back");

  setAttrAll("[data-gallery-prev]", "aria-label", t("aria.prevPhoto"));
  setAttrAll("[data-gallery-next]", "aria-label", t("aria.nextPhoto"));

  const map = document.querySelector(".map[aria-label]");
  if (map instanceof HTMLElement) map.setAttribute("aria-label", t("listing.map.aria"));
  const mapIframe = document.querySelector("[data-listing-map-iframe]");
  if (mapIframe instanceof HTMLIFrameElement) mapIframe.title = t("listing.map.title");

  const openMaps = document.querySelector("[data-listing-open-maps]");
  if (openMaps instanceof HTMLAnchorElement) openMaps.textContent = t("common.openMaps");
  const openMaps3d = document.querySelector("[data-listing-open-maps-3d]");
  if (openMaps3d instanceof HTMLAnchorElement) openMaps3d.textContent = t("common.maps3d");

  const descH = document.querySelector("[data-listing-desc]")?.previousElementSibling;
  if (descH instanceof HTMLElement) descH.textContent = t("listing.description");
  const featsH = document.querySelector("[data-listing-features]")?.previousElementSibling;
  if (featsH instanceof HTMLElement) featsH.textContent = t("listing.features");
  const contactH = document.querySelector(".contact-cards")?.previousElementSibling;
  if (contactH instanceof HTMLElement) contactH.textContent = t("listing.contact");
  const visitH = document.getElementById("demande-visite");
  if (visitH instanceof HTMLElement) visitH.textContent = t("listing.visitTitle");

  const ctaDossier = document.querySelector(".cta a.btn.primary[href^=\"./dossier.html\"]");
  if (ctaDossier instanceof HTMLAnchorElement) ctaDossier.textContent = t("listing.requestDossier");
  const ctaVisit = document.querySelector(".cta a.btn[href^=\"#demande-visite\"]");
  if (ctaVisit instanceof HTMLAnchorElement) ctaVisit.textContent = t("listing.requestVisit");

  const contactKs = Array.from(document.querySelectorAll(".contact-cards .contact-card .k"));
  if (contactKs[0] instanceof HTMLElement) contactKs[0].textContent = t("listing.contact");
  if (contactKs[1] instanceof HTMLElement) contactKs[1].textContent = t("listing.contact.phone");
  if (contactKs[2] instanceof HTMLElement) contactKs[2].textContent = t("listing.contact.email");
  if (contactKs[3] instanceof HTMLElement) contactKs[3].textContent = t("listing.contact.address");

  const form = document.getElementById("listing-form");
  if (form instanceof HTMLFormElement) {
    setTextAll("#listing-form .field:nth-of-type(1) .label", t("contact.form.name"));
    setTextAll("#listing-form .field:nth-of-type(2) .label", t("contact.form.email"));
    setTextAll("#listing-form .field:nth-of-type(3) .label", t("contact.form.phone"));
    setTextAll("#listing-form .field:nth-of-type(4) .label", t("contact.form.type"));
    setTextAll("#listing-form .field.full.appointment-planner .label", t("contact.form.availability"));
    const name = form.querySelector("input[placeholder]");
    if (name instanceof HTMLInputElement && (name.placeholder || "").toLowerCase().includes("nom")) name.placeholder = t("placeholders.fullName");
    const msg = form.querySelector("textarea[data-appointment-message]");
    if (msg instanceof HTMLTextAreaElement) msg.placeholder = t("placeholders.visitMessage");
    const apptSel = form.querySelector("[data-appointment-request-type]");
    if (apptSel instanceof HTMLSelectElement) {
      for (const opt of Array.from(apptSel.options)) {
        const v = (opt.getAttribute("value") || opt.textContent || "").trim();
        if (v === "visit" || v === "Demande de visite") opt.textContent = t("req.visit");
        if (v === "dossier" || v === "Demande de dossier") opt.textContent = t("req.dossier");
        if (v === "rent" || v === "Louer un bien") opt.textContent = t("req.rent");
        if (v === "buy" || v === "Acheter un bien") opt.textContent = t("req.buy");
        if (v === "advice" || v === "Conseils") opt.textContent = t("req.advice");
        if (v === "question" || v === "Question") opt.textContent = t("req.question");
      }
    }
    const btn = form.querySelector("button[type=\"submit\"]");
    if (btn instanceof HTMLButtonElement) btn.textContent = t("contact.form.send");
  }

  const lightbox = document.getElementById("photo-lightbox");
  if (lightbox instanceof HTMLElement) {
    const img = lightbox.querySelector("img[alt]");
    if (img instanceof HTMLImageElement) img.alt = getLang() === "en" ? "Photo enlargement" : "Agrandissement photo";
    const prev = lightbox.querySelector(".nav.prev[aria-label]");
    if (prev instanceof HTMLElement) prev.setAttribute("aria-label", t("aria.prevPhoto"));
    const next = lightbox.querySelector(".nav.next[aria-label]");
    if (next instanceof HTMLElement) next.setAttribute("aria-label", t("aria.nextPhoto"));
    const close = lightbox.querySelector("button.close[aria-label]");
    if (close instanceof HTMLElement) close.setAttribute("aria-label", t("common.close"));
  }
}

function applyRecherchePage() {
  const page = document.body.getAttribute("data-page");
  if (page !== "recherche") return;

  document.title = t("page.recherche.title");

  const tabs = Array.from(document.querySelectorAll("[data-search-tab]"));
  for (const b of tabs) {
    if (!(b instanceof HTMLButtonElement)) continue;
    const mode = b.getAttribute("data-search-tab");
    if (mode === "rent") b.textContent = t("search.tabs.rent");
    if (mode === "sale") b.textContent = t("search.tabs.buy");
  }

  const where = document.querySelector(".is24-field.large .is24-label");
  if (where instanceof HTMLElement) where.textContent = t("search.where");
  const q = document.getElementById("search-q");
  if (q instanceof HTMLInputElement) q.placeholder = t("search.where.placeholder");

  const priceUpTo = document.querySelector(".is24-field:nth-of-type(2) .is24-label");
  if (priceUpTo instanceof HTMLElement) priceUpTo.textContent = t("search.priceUpTo");
  const maxPrice = document.querySelector("select[name=\"maxPrice\"]");
  if (maxPrice instanceof HTMLSelectElement) {
    for (const opt of Array.from(maxPrice.options)) {
      const v = (opt.value || "").trim();
      if (v === "") opt.textContent = t("search.any");
    }
  }
  const rooms = document.querySelector(".is24-field:nth-of-type(3) .is24-label");
  if (rooms instanceof HTMLElement) rooms.textContent = t("search.roomsFrom");
  const minRooms = document.querySelector("select[name=\"minRooms\"]");
  if (minRooms instanceof HTMLSelectElement) {
    for (const opt of Array.from(minRooms.options)) {
      const v = (opt.value || "").trim();
      if (v === "") opt.textContent = t("search.any");
    }
  }

  const filtersBtn = document.querySelector("[data-open-filters]");
  if (filtersBtn instanceof HTMLButtonElement) {
    const txt = Array.from(filtersBtn.childNodes).find((n) => n.nodeType === 3 && String(n.nodeValue || "").trim());
    if (txt) txt.nodeValue = ` ${t("search.filters")}`;
  }

  const submit = document.querySelector("button.is24-btn.primary [data-count]");
  if (submit instanceof HTMLElement && (submit.textContent || "").trim() === "Rechercher") submit.textContent = t("search.submit");

  const trust = document.querySelector("main .trust-strip");
  if (trust instanceof HTMLElement) trust.setAttribute("aria-label", t("biens.trust.aria"));
  const trustItems = Array.from(document.querySelectorAll("main .trust-strip .item"));
  if (trustItems[0] instanceof HTMLElement) trustItems[0].textContent = t("search.trust.one");
  if (trustItems[1] instanceof HTMLElement) trustItems[1].textContent = t("search.trust.two");
  if (trustItems[2] instanceof HTMLElement) trustItems[2].textContent = t("search.trust.three");
  if (trustItems[3] instanceof HTMLElement) trustItems[3].textContent = t("search.trust.four");

  const emptyTitle = document.querySelector("[data-empty] h3");
  if (emptyTitle instanceof HTMLElement) emptyTitle.textContent = t("search.noneFoundTitle");
  const emptyLead = document.querySelector("[data-empty] p.lead");
  if (emptyLead instanceof HTMLElement) emptyLead.textContent = t("search.noneFoundLead");

  const advTitle = document.querySelector("#filters-modal h3");
  if (advTitle instanceof HTMLElement) advTitle.textContent = t("search.advTitle");
  const close = document.querySelector("#filters-modal [data-close-filters].close");
  if (close instanceof HTMLButtonElement) close.setAttribute("aria-label", t("search.close"));

  const regionLabel = document.querySelector("#filters-modal select[name=\"region\"]")?.closest(".field")?.querySelector(".label");
  if (regionLabel instanceof HTMLElement) regionLabel.textContent = t("search.region");
  const regionSel = document.querySelector("#filters-modal select[name=\"region\"]");
  if (regionSel instanceof HTMLSelectElement) {
    for (const opt of Array.from(regionSel.options)) {
      const v = (opt.value || "").trim();
      if (v === "") opt.textContent = t("search.region.all");
      if (v === "Jura bernois") opt.textContent = getLang() === "en" ? "Bernese Jura" : "Jura bernois";
    }
  }
  const localityLabel = document.querySelector("#filters-modal select[name=\"locality\"]")?.closest(".field")?.querySelector(".label");
  if (localityLabel instanceof HTMLElement) localityLabel.textContent = t("search.city");
  const typeLabel = document.querySelector("#filters-modal select[name=\"propertyType\"]")?.closest(".field")?.querySelector(".label");
  if (typeLabel instanceof HTMLElement) typeLabel.textContent = t("search.type");
  const sortLabel = document.querySelector("#filters-modal select[name=\"sort\"]")?.closest(".field")?.querySelector(".label");
  if (sortLabel instanceof HTMLElement) sortLabel.textContent = t("search.sort");
  const minPriceLabel = document.querySelector("#filters-modal input[name=\"minPrice\"]")?.closest(".field")?.querySelector(".label");
  if (minPriceLabel instanceof HTMLElement) minPriceLabel.textContent = t("search.priceMin");
  const maxPriceLabel = document.querySelector("#filters-modal input[name=\"maxPrice\"]")?.closest(".field")?.querySelector(".label");
  if (maxPriceLabel instanceof HTMLElement) maxPriceLabel.textContent = t("search.priceMax");
  const minSurfaceLabel = document.querySelector("#filters-modal input[name=\"minSurface\"]")?.closest(".field")?.querySelector(".label");
  if (minSurfaceLabel instanceof HTMLElement) minSurfaceLabel.textContent = t("search.surfaceMin");
  const tagsLabel = document.querySelector("#filters-modal .field.full .label");
  if (tagsLabel instanceof HTMLElement) tagsLabel.textContent = t("search.features");

  const sortSel = document.querySelector("#filters-modal select[name=\"sort\"]");
  if (sortSel instanceof HTMLSelectElement) {
    for (const opt of Array.from(sortSel.options)) {
      const v = (opt.getAttribute("value") || "").trim();
      if (v === "") opt.textContent = t("search.sort.relevance");
      if (v === "price_asc") opt.textContent = t("search.sort.priceAsc");
      if (v === "price_desc") opt.textContent = t("search.sort.priceDesc");
      if (v === "surface_desc") opt.textContent = t("search.sort.surfaceDesc");
      if (v === "rooms_desc") opt.textContent = t("search.sort.roomsDesc");
    }
  }

  const applyBtn = document.querySelector("#filters-modal .actions button[type=\"submit\"]");
  if (applyBtn instanceof HTMLButtonElement) applyBtn.textContent = t("search.applyFilters");

  const contactTitle = document.querySelector("section#contact h2");
  if (contactTitle instanceof HTMLElement) contactTitle.textContent = t("nav.contact");
  for (const a of Array.from(document.querySelectorAll("section#contact a.btn"))) {
    if (!(a instanceof HTMLAnchorElement)) continue;
    const raw = (a.textContent || "").trim();
    if (raw === "Ouvrir dans Maps") a.textContent = t("common.openMaps");
    if (raw === "Vue 3D Google Maps") a.textContent = t("common.maps3d");
  }

  const reqTitle = document.querySelector("section#contact .panel:nth-of-type(2) h2");
  if (reqTitle instanceof HTMLElement) reqTitle.textContent = t("search.requestTitle");
  const reqForm = document.querySelector("section#contact form[data-demo-form]");
  if (reqForm instanceof HTMLFormElement) {
    const labels = Array.from(reqForm.querySelectorAll(".label"));
    if (labels[0] instanceof HTMLElement) labels[0].textContent = t("contact.form.name");
    if (labels[1] instanceof HTMLElement) labels[1].textContent = t("contact.form.email");
    if (labels[2] instanceof HTMLElement) labels[2].textContent = t("fields.subject");
    if (labels[3] instanceof HTMLElement) labels[3].textContent = t("fields.referenceOptional");
    if (labels[4] instanceof HTMLElement) labels[4].textContent = t("contact.form.message");
    const name = reqForm.querySelector("input[placeholder]");
    if (name instanceof HTMLInputElement && (name.placeholder || "").toLowerCase().includes("nom")) name.placeholder = t("placeholders.fullName");
    const ref = reqForm.querySelector("input[placeholder^=\"ex\"]");
    if (ref instanceof HTMLInputElement) ref.placeholder = t("placeholders.referenceExample");
    const msg = reqForm.querySelector("textarea[placeholder]");
    if (msg instanceof HTMLTextAreaElement) msg.placeholder = t("placeholders.requestMessage");
    const send = reqForm.querySelector("button[type=\"submit\"].btn.primary");
    if (send instanceof HTMLButtonElement) send.textContent = t("contact.form.send");
    const sel = reqForm.querySelector("select");
    if (sel instanceof HTMLSelectElement) {
      for (const opt of Array.from(sel.options)) {
        const raw = (opt.getAttribute("value") || opt.textContent || "").trim();
        if (raw === "Demande de visite") opt.textContent = t("req.visit");
        if (raw === "Demande de dossier") opt.textContent = t("req.dossier");
        if (raw === "Estimation") opt.textContent = t("req.valuation");
        if (raw === "Question") opt.textContent = t("req.question");
      }
    }
  }
}

function applyConseilsPage() {
  const page = document.body.getAttribute("data-page");
  if (page !== "conseils") return;
  document.title = t("page.conseils.title");

  const setText = (el, txt) => {
    if (el instanceof HTMLElement) el.textContent = txt;
  };

  const setHtml = (el, html) => {
    if (el instanceof HTMLElement) el.innerHTML = html;
  };

  const setAttr = (el, name, value) => {
    if (el instanceof HTMLElement) el.setAttribute(name, value);
  };

  const setLabel = (label, txt) => {
    if (!(label instanceof HTMLLabelElement)) return;
    const input = label.querySelector("input");
    if (!(input instanceof HTMLInputElement)) {
      label.textContent = txt;
      return;
    }
    label.textContent = txt;
    label.appendChild(input);
  };

  const applyStep = (step, n, titleKey, bulletKeys, ctaKey) => {
    if (!(step instanceof HTMLElement)) return;
    setText(step.querySelector(".advice-step-k"), t("advice.stepLabel", { n }));
    setText(step.querySelector("h4"), t(titleKey));
    const bullets = Array.from(step.querySelectorAll("ul li"));
    for (let i = 0; i < bulletKeys.length; i += 1) {
      if (bullets[i] instanceof HTMLElement) bullets[i].textContent = t(bulletKeys[i]);
    }
    if (ctaKey) setText(step.querySelector(".advice-step-cta-text"), t(ctaKey));
  };

  setText(document.querySelector(".page-hero h1"), t("advice.h1"));
  setText(document.querySelector(".page-hero .hero-type-text"), t("advice.hero.tagline"));

  const tabs = document.querySelector("section.advice-tabs");
  setAttr(tabs, "aria-label", t("advice.tabs.aria"));
  const tabTitles = Array.from(document.querySelectorAll(".advice-tab-title"));
  if (tabTitles[0] instanceof HTMLElement) tabTitles[0].textContent = t("advice.tabs.owner");
  if (tabTitles[1] instanceof HTMLElement) tabTitles[1].textContent = t("advice.tabs.renter");
  const tabSubs = Array.from(document.querySelectorAll(".advice-tab-sub"));
  if (tabSubs[0] instanceof HTMLElement) tabSubs[0].textContent = t("advice.tabs.ownerSub");
  if (tabSubs[1] instanceof HTMLElement) tabSubs[1].textContent = t("advice.tabs.renterSub");

  const owner = document.querySelector("#devenir-proprietaire");
  if (owner instanceof HTMLElement) {
    setText(owner.querySelector(".advice-head h2"), t("advice.owner.title"));
    setText(owner.querySelector(".advice-head .advice-sub"), t("advice.owner.sub"));
    setText(owner.querySelector(".advice-intro-title"), t("advice.owner.introTitle"));
    setHtml(owner.querySelector(".advice-intro-desc"), t("advice.owner.introDesc"));
    setText(owner.querySelector(".advice-steps-title"), t("advice.owner.stepsTitle"));
    setText(owner.querySelector(".advice-steps-sub"), t("advice.owner.stepsSub"));

    const steps = Array.from(owner.querySelectorAll(".advice-steps-grid > .advice-step"));

    applyStep(
      steps[0],
      "01",
      "advice.owner.step1.title",
      [
        "advice.owner.step1.b1",
        "advice.owner.step1.b2",
        "advice.owner.step1.b3",
        "advice.owner.step1.b4",
        "advice.owner.step1.b5",
      ],
      "advice.owner.step1.cta"
    );
    setAttr(owner.querySelector("[data-budget-calc-toggle].advice-step-ico-btn"), "aria-label", t("advice.calc.openBudgetAria"));
    setAttr(owner.querySelector("[data-inline-calc-display]"), "aria-label", t("advice.calc.aria"));
    setAttr(owner.querySelector(".advice-calc-keys"), "aria-label", t("advice.calc.keysAria"));

    applyStep(
      steps[1],
      "02",
      "advice.owner.step2.title",
      ["advice.owner.step2.b1", "advice.owner.step2.b2", "advice.owner.step2.b3", "advice.owner.step2.b4"],
      "advice.owner.step2.cta"
    );
    const m2 = steps[1] instanceof HTMLElement ? steps[1].querySelector("[data-m2-calc]") : null;
    if (m2 instanceof HTMLElement) {
      const lbl = Array.from(m2.querySelectorAll("label"));
      setLabel(lbl[0], t("advice.m2.priceLabel"));
      setLabel(lbl[1], t("advice.m2.surfaceLabel"));
      setLabel(lbl[2], t("advice.m2.refLabel"));
      const out = m2.querySelector(".advice-calc-out");
      if (out instanceof HTMLElement) {
        const strong = out.querySelector("[data-m2-result]");
        if (strong instanceof HTMLElement) {
          out.replaceChildren(document.createTextNode(`${t("advice.m2.outPrefix")} `), strong);
        } else {
          out.textContent = t("advice.m2.outPrefix");
        }
      }
      setText(m2.querySelector(".advice-calc-note"), t("advice.m2.note"));
    }

    applyStep(
      steps[2],
      "03",
      "advice.owner.step3.title",
      ["advice.owner.step3.b1", "advice.owner.step3.b2", "advice.owner.step3.b3", "advice.owner.step3.b4"],
      null
    );

    applyStep(
      steps[3],
      "04",
      "advice.owner.step4.title",
      ["advice.owner.step4.b1", "advice.owner.step4.b2", "advice.owner.step4.b3", "advice.owner.step4.b4"],
      null
    );

    applyStep(
      steps[4],
      "05",
      "advice.owner.step5.title",
      ["advice.owner.step5.b1", "advice.owner.step5.b2", "advice.owner.step5.b3", "advice.owner.step5.b4"],
      "advice.owner.step5.cta"
    );
    const mort = steps[4] instanceof HTMLElement ? steps[4].querySelector("[data-mortgage-calc]") : null;
    if (mort instanceof HTMLElement) {
      const lbl = Array.from(mort.querySelectorAll("label"));
      setLabel(lbl[0], t("advice.mortgage.amountLabel"));
      setLabel(lbl[1], t("advice.mortgage.rateLabel"));
      setLabel(lbl[2], t("advice.mortgage.amortLabel"));
      setLabel(lbl[3], t("advice.mortgage.maintLabel"));
      setLabel(lbl[4], t("advice.mortgage.incomeLabel"));

      const out = Array.from(mort.querySelectorAll(".advice-calc-out"));
      const out1 = out[0];
      const out2 = out[1];
      if (out1 instanceof HTMLElement) {
        const iEl = out1.querySelector("[data-mortgage-interest-month]");
        const aEl = out1.querySelector("[data-mortgage-amort-month]");
        const mEl = out1.querySelector("[data-mortgage-maint-month]");
        if (iEl instanceof HTMLElement && aEl instanceof HTMLElement && mEl instanceof HTMLElement) {
          out1.replaceChildren(
            document.createTextNode(`${t("advice.mortgage.interest")}: `),
            iEl,
            document.createTextNode(`${t("advice.perMonth")} • ${t("advice.mortgage.amort")}: `),
            aEl,
            document.createTextNode(`${t("advice.perMonth")} • ${t("advice.mortgage.maint")}: `),
            mEl,
            document.createTextNode(t("advice.perMonth"))
          );
        }
      }
      if (out2 instanceof HTMLElement) {
        const totalEl = out2.querySelector("[data-mortgage-total-month]");
        const ratioEl = out2.querySelector("[data-mortgage-ratio]");
        if (totalEl instanceof HTMLElement && ratioEl instanceof HTMLElement) {
          out2.replaceChildren(
            document.createTextNode(`${t("advice.mortgage.total")}: `),
            totalEl,
            document.createTextNode(`${t("advice.perMonth")} • ${t("advice.mortgage.ratio")}: `),
            ratioEl
          );
        }
      }
      setText(mort.querySelector(".advice-calc-note"), t("advice.mortgage.note"));
    }

    applyStep(
      steps[5],
      "06",
      "advice.owner.step6.title",
      ["advice.owner.step6.b1", "advice.owner.step6.b2", "advice.owner.step6.b3", "advice.owner.step6.b4"],
      null
    );

    applyStep(
      steps[6],
      "07",
      "advice.owner.step7.title",
      ["advice.owner.step7.b1", "advice.owner.step7.b2", "advice.owner.step7.b3"],
      null
    );

    applyStep(
      steps[7],
      "08",
      "advice.owner.step8.title",
      ["advice.owner.step8.b1", "advice.owner.step8.b2", "advice.owner.step8.b3"],
      null
    );
  }

  setText(document.querySelector(".advice-divider-line span"), t("advice.renter.divider"));

  const renter = document.querySelector("#conseils-locataires");
  if (renter instanceof HTMLElement) {
    setText(renter.querySelector(".advice-head h2"), t("advice.renter.title"));
    setText(renter.querySelector(".advice-head .advice-sub"), t("advice.renter.sub"));
    setText(renter.querySelector(".advice-intro-title"), t("advice.renter.introTitle"));
    setText(renter.querySelector(".advice-intro-desc"), t("advice.renter.introDesc"));
    setText(renter.querySelector(".advice-steps-title"), t("advice.renter.stepsTitle"));

    const steps = Array.from(renter.querySelectorAll(".advice-steps-grid > .advice-step"));

    applyStep(
      steps[0],
      "01",
      "advice.renter.step1.title",
      [
        "advice.renter.step1.b1",
        "advice.renter.step1.b2",
        "advice.renter.step1.b3",
        "advice.renter.step1.b4",
      ],
      null
    );

    applyStep(
      steps[1],
      "02",
      "advice.renter.step2.title",
      ["advice.renter.step2.b1", "advice.renter.step2.b2", "advice.renter.step2.b3"],
      null
    );

    applyStep(
      steps[2],
      "03",
      "advice.renter.step3.title",
      ["advice.renter.step3.b1", "advice.renter.step3.b2", "advice.renter.step3.b3", "advice.renter.step3.b4"],
      "advice.renter.step3.cta"
    );
    const rentCalc = steps[2] instanceof HTMLElement ? steps[2].querySelector("[data-rent-calc]") : null;
    if (rentCalc instanceof HTMLElement) {
      const lbl = Array.from(rentCalc.querySelectorAll("label"));
      setLabel(lbl[0], t("advice.rent.incomeLabel"));
      setLabel(lbl[1], t("advice.rent.maxLabel"));
      const out = rentCalc.querySelector(".advice-calc-out");
      if (out instanceof HTMLElement) {
        const strong = out.querySelector("strong");
        if (strong instanceof HTMLElement) {
          out.replaceChildren(
            document.createTextNode(`${t("advice.rent.rulePrefix")} `),
            strong,
            document.createTextNode(` ${t("advice.rent.ruleSuffix")}`)
          );
        }
      }
    }

    applyStep(
      steps[3],
      "04",
      "advice.renter.step4.title",
      ["advice.renter.step4.b1", "advice.renter.step4.b2", "advice.renter.step4.b3", "advice.renter.step4.b4"],
      null
    );

    applyStep(
      steps[4],
      "05",
      "advice.renter.step5.title",
      ["advice.renter.step5.b1", "advice.renter.step5.b2", "advice.renter.step5.b3", "advice.renter.step5.b4"],
      null
    );

    applyStep(
      steps[5],
      "06",
      "advice.renter.step6.title",
      ["advice.renter.step6.b1", "advice.renter.step6.b2", "advice.renter.step6.b3"],
      null
    );
    const leaseLis = steps[5] instanceof HTMLElement ? Array.from(steps[5].querySelectorAll("ul li")) : [];
    const leaseSpecial = leaseLis[3];
    if (leaseSpecial instanceof HTMLElement) {
      const first = leaseSpecial.childNodes[0];
      if (first && first.nodeType === Node.TEXT_NODE) first.textContent = t("advice.renter.step6.specialPrefix");
    }

    applyStep(steps[6], "07", "advice.renter.step7.title", ["advice.renter.step7.b1", "advice.renter.step7.b2"], null);
    const depLis = steps[6] instanceof HTMLElement ? Array.from(steps[6].querySelectorAll("ul li")) : [];
    const depAlt = depLis[2];
    if (depAlt instanceof HTMLElement) {
      const first = depAlt.childNodes[0];
      if (first && first.nodeType === Node.TEXT_NODE) first.textContent = t("advice.renter.step7.altPrefix");
    }

    applyStep(steps[7], "08", "advice.renter.step8.title", ["advice.renter.step8.b1", "advice.renter.step8.b2", "advice.renter.step8.b3"], null);
    applyStep(steps[8], "09", "advice.renter.step9.title", ["advice.renter.step9.b1", "advice.renter.step9.b2", "advice.renter.step9.b3"], null);
  }

  const cta = document.querySelector(".advice-cta-card");
  if (cta instanceof HTMLElement) {
    setText(cta.querySelector(".advice-cta-k"), t("advice.cta.k"));
    setText(cta.querySelector(".advice-cta-copy h3"), t("advice.cta.title"));
    setText(cta.querySelector(".advice-cta-copy p"), t("advice.cta.lead"));
    const links = Array.from(cta.querySelectorAll(".advice-cta-actions a.btn"));
    if (links[0] instanceof HTMLAnchorElement) links[0].textContent = t("actions.contactUs");
    if (links[1] instanceof HTMLAnchorElement) links[1].textContent = t("actions.bookAppointment");
  }
}

function applyAdminLoginPage() {
  const page = document.body.getAttribute("data-page");
  if (page !== "admin-login") return;
  document.title = t("page.adminLogin.title");

  const topTitle = document.querySelector(".topbar-title");
  if (topTitle instanceof HTMLElement) topTitle.textContent = t("admin.topTitle");

  for (const a of Array.from(document.querySelectorAll("nav.nav a"))) {
    if (!(a instanceof HTMLAnchorElement)) continue;
    const href = a.getAttribute("href") || "";
    if (href.endsWith("/index.html") || href.endsWith("index.html")) a.textContent = t("nav.home");
    if (href.endsWith("/biens.html") || href.endsWith("biens.html")) a.textContent = t("nav.properties");
    if (href.endsWith("/contact.html") || href.endsWith("contact.html")) a.textContent = t("nav.contact");
  }

  const h2 = document.querySelector("main h2");
  if (h2 instanceof HTMLElement) h2.textContent = t("admin.login.title");
  const lead = document.querySelector("main p.lead");
  if (lead instanceof HTMLElement) lead.textContent = t("admin.login.lead");

  const labels = Array.from(document.querySelectorAll("form[data-admin-login] .label"));
  if (labels[0] instanceof HTMLElement) labels[0].textContent = t("admin.login.username");
  if (labels[1] instanceof HTMLElement) labels[1].textContent = t("admin.login.password");
  const submit = document.querySelector("form[data-admin-login] button[type=\"submit\"]");
  if (submit instanceof HTMLButtonElement) submit.textContent = t("admin.login.signIn");
  const back = document.querySelector("form[data-admin-login] a.btn[href$=\"index.html\"]");
  if (back instanceof HTMLAnchorElement) back.textContent = t("admin.login.back");
}

function applyAdminPage() {
  const page = document.body.getAttribute("data-page");
  if (page !== "admin") return;
  const en = getLang() === "en";
  document.title = t("page.admin.title");

  const topTitle = document.querySelector(".topbar-title");
  if (topTitle instanceof HTMLElement) topTitle.textContent = t("admin.topTitle");

  for (const a of Array.from(document.querySelectorAll("nav.nav a"))) {
    if (!(a instanceof HTMLAnchorElement)) continue;
    const href = a.getAttribute("href") || "";
    if (href.endsWith("/index.html") || href.endsWith("index.html")) a.textContent = t("nav.home");
    if (href.endsWith("/biens.html") || href.endsWith("biens.html")) a.textContent = t("nav.properties");
    if (href.endsWith("/contact.html") || href.endsWith("contact.html")) a.textContent = t("nav.contact");
    if (href.endsWith("/admin/index.html") || href.endsWith("./index.html") || href.endsWith("admin/index.html")) a.textContent = t("nav.admin");
  }

  const leftTitle = document.querySelector(".admin-layout .panel:first-child h2");
  if (leftTitle instanceof HTMLElement) leftTitle.textContent = t("admin.leftTitle");
  const btnNew = document.querySelector("[data-admin-new]");
  if (btnNew instanceof HTMLButtonElement) btnNew.textContent = t("admin.actions.new");
  const btnRefresh = document.querySelector("[data-admin-refresh]");
  if (btnRefresh instanceof HTMLButtonElement) btnRefresh.textContent = t("admin.actions.refresh");
  const searchLabel = document.querySelector("[data-admin-q]")?.closest(".field")?.querySelector(".label");
  if (searchLabel instanceof HTMLElement) searchLabel.textContent = t("admin.search.label");
  const searchInput = document.querySelector("[data-admin-q]");
  if (searchInput instanceof HTMLInputElement) searchInput.placeholder = t("admin.search.placeholder");
  const totalStrong = document.querySelector("[data-admin-count]")?.closest(".pill")?.querySelector("strong");
  if (totalStrong instanceof HTMLElement) totalStrong.textContent = t("admin.count.total");
  const logout = document.querySelector("[data-admin-logout]");
  if (logout instanceof HTMLButtonElement) logout.textContent = t("admin.actions.logout");

  const rightTitle = document.querySelector(".admin-layout .panel:nth-child(2) h2");
  if (rightTitle instanceof HTMLElement) rightTitle.textContent = t("admin.editor.title");
  const rightLead = document.querySelector(".admin-layout .panel:nth-child(2) p.lead");
  if (rightLead instanceof HTMLElement) rightLead.textContent = t("admin.editor.lead");
  const save = document.querySelector("[data-admin-save]");
  if (save instanceof HTMLButtonElement) save.textContent = t("admin.actions.save");
  const del = document.querySelector("[data-admin-delete]");
  if (del instanceof HTMLButtonElement) del.textContent = t("admin.actions.delete");

  const form = document.querySelector("form[data-admin-form]");
  if (form instanceof HTMLFormElement) {
    const lbl = Array.from(form.querySelectorAll(".label"));
    const keys = [
      "admin.fields.referenceId",
      "admin.fields.category",
      "admin.fields.status",
      "admin.fields.type",
      "admin.fields.title",
      "admin.fields.description",
      "admin.fields.region",
      "admin.fields.locality",
      "admin.fields.rooms",
      "admin.fields.area",
      "admin.fields.price",
      "admin.fields.priceSuffix",
      "admin.fields.tags",
      "admin.fields.mainImageUrl",
      "admin.fields.gallery",
      "admin.fields.preview",
    ];
    for (let i = 0; i < keys.length; i += 1) {
      if (lbl[i] instanceof HTMLElement) lbl[i].textContent = t(keys[i]);
    }

    const cat = form.querySelector("select[name=\"category\"]");
    if (cat instanceof HTMLSelectElement) {
      for (const opt of Array.from(cat.options)) {
        if (opt.value === "sale") opt.textContent = t("biens.btn.sale");
        if (opt.value === "rent") opt.textContent = t("biens.btn.rent");
      }
    }
    const status = form.querySelector("select[name=\"status\"]");
    if (status instanceof HTMLSelectElement) {
      for (const opt of Array.from(status.options)) {
        if (opt.value === "") opt.textContent = t("admin.status.available");
        if (opt.value === "sold") opt.textContent = t("status.sold");
        if (opt.value === "rented") opt.textContent = t("status.rented");
      }
    }

    const type = form.querySelector("input[name=\"propertyType\"]");
    if (type instanceof HTMLInputElement) type.placeholder = t("admin.placeholders.propertyType");
    const region = form.querySelector("input[name=\"region\"]");
    if (region instanceof HTMLInputElement) region.placeholder = t("admin.placeholders.region");
    const suffix = form.querySelector("input[name=\"priceSuffix\"]");
    if (suffix instanceof HTMLInputElement) suffix.placeholder = t("home.priceSuffix.month");

    const tagInput = document.querySelector("[data-admin-tag-input]");
    if (tagInput instanceof HTMLInputElement) tagInput.placeholder = t("admin.placeholders.tag");
    const tagAdd = document.querySelector("[data-admin-tag-add]");
    if (tagAdd instanceof HTMLButtonElement) tagAdd.textContent = t("admin.actions.add");
    const imgUpload = document.querySelector("[data-admin-image-upload-btn]");
    if (imgUpload instanceof HTMLButtonElement) imgUpload.textContent = t("admin.actions.upload");
    const galUpload = document.querySelector("[data-admin-gallery-upload-btn]");
    if (galUpload instanceof HTMLButtonElement) galUpload.textContent = t("admin.actions.upload");
    const dz = document.querySelector("[data-admin-dropzone]");
    if (dz instanceof HTMLElement) dz.textContent = t("admin.photos.dropzoneHint");
    const galUrl = document.querySelector("[data-admin-gallery-url]");
    if (galUrl instanceof HTMLInputElement) galUrl.placeholder = t("admin.placeholders.url");
    const galUrlAdd = document.querySelector("[data-admin-gallery-url-add]");
    if (galUrlAdd instanceof HTMLButtonElement) galUrlAdd.textContent = t("admin.actions.add");
  }
}

export function mountLanguageToggle() {
  const host = document.querySelector(".topbar-actions") || document.querySelector(".topbar-inner");
  if (!(host instanceof HTMLElement)) return;
  if (host.querySelector("[data-lang-toggle]")) return;

  const wrap = document.createElement("div");
  wrap.className = "lang-menu";
  wrap.setAttribute("data-lang-toggle", "1");

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "lang-menu-btn";
  btn.setAttribute("aria-haspopup", "menu");
  btn.setAttribute("aria-expanded", "false");

  const label = document.createElement("span");
  label.className = "lang-menu-label";

  const globe = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  globe.setAttribute("viewBox", "0 0 24 24");
  globe.setAttribute("fill", "none");
  globe.setAttribute("stroke", "currentColor");
  globe.setAttribute("stroke-width", "2.2");
  globe.setAttribute("stroke-linecap", "round");
  globe.setAttribute("stroke-linejoin", "round");
  globe.setAttribute("aria-hidden", "true");
  globe.classList.add("lang-menu-ico");
  globe.innerHTML = `<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a14 14 0 0 1 0 18"></path><path d="M12 3a14 14 0 0 0 0 18"></path>`;

  const caret = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  caret.setAttribute("viewBox", "0 0 24 24");
  caret.setAttribute("fill", "none");
  caret.setAttribute("stroke", "currentColor");
  caret.setAttribute("stroke-width", "2.2");
  caret.setAttribute("stroke-linecap", "round");
  caret.setAttribute("stroke-linejoin", "round");
  caret.setAttribute("aria-hidden", "true");
  caret.classList.add("lang-menu-caret");
  caret.innerHTML = `<path d="m6 9 6 6 6-6"></path>`;

  btn.append(globe, label, caret);

  const menu = document.createElement("div");
  menu.className = "lang-menu-pop";
  menu.setAttribute("role", "menu");

  const mkItem = (lang, textKey) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "lang-menu-item";
    b.dataset.lang = lang;
    b.setAttribute("role", "menuitemradio");
    b.addEventListener("click", () => {
      setLang(lang);
      applyTranslations();
      updateToggleState();
      closeMenu();
      window.dispatchEvent(new CustomEvent("dcki:lang", { detail: { lang: getLang() } }));
    });
    b.textContent = t(textKey);
    return b;
  };

  const fr = mkItem("fr", "lang.fr.full");
  const en = mkItem("en", "lang.en.full");
  menu.append(fr, en);
  wrap.append(btn, menu);
  host.prepend(wrap);

  const openMenu = () => {
    wrap.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    wrap.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    if (wrap.classList.contains("open")) closeMenu();
    else openMenu();
  };

  const updateToggleState = () => {
    const cur = getLang();
    wrap.setAttribute("aria-label", t("lang.label"));
    btn.setAttribute("aria-label", t("lang.label"));
    label.textContent = cur === "en" ? t("lang.en") : t("lang.fr");
    fr.setAttribute("aria-checked", cur === "fr" ? "true" : "false");
    en.setAttribute("aria-checked", cur === "en" ? "true" : "false");
    fr.classList.toggle("active", cur === "fr");
    en.classList.toggle("active", cur === "en");
    fr.textContent = t("lang.fr.full");
    en.textContent = t("lang.en.full");
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener(
    "click",
    (e) => {
      if (!wrap.classList.contains("open")) return;
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (!wrap.contains(t)) closeMenu();
    },
    true
  );

  document.addEventListener("keydown", (e) => {
    if (!wrap.classList.contains("open")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      btn.focus();
    }
  });

  updateToggleState();
}

export function applyTranslations() {
  const lang = getLang();
  document.documentElement.setAttribute("lang", lang);
  applyNav();
  applyFooter();
  applyHomePage();
  applyBiensPage();
  applyListingPage();
  applyRecherchePage();
  applyConseilsPage();
  applyAdminLoginPage();
  applyAdminPage();
  applyContactPage();
  applyDossierPage();
}

export function initI18n() {
  mountLanguageToggle();
  applyTranslations();
  window.setTimeout(applyTranslations, 0);
  window.setTimeout(applyTranslations, 250);
}
