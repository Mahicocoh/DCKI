# Design des pages — DCKImmo (desktop-first)

## Global Styles (tokens)
- Couleurs: fond #0B0F14, surface #111827, texte #F9FAFB, texte secondaire #9CA3AF, accent #D4AF37 (or), bordures #1F2937.
- Typo: Sans-serif (ex: Inter). Échelle: 14/16/18/24/36/48.
- Boutons: primaire fond accent + texte #0B0F14, hover assombrir; secondaire bord 1px #374151, hover fond #111827.
- Liens: texte accent, hover souligné.
- Layout: grille 12 colonnes (max-width 1200–1280px), marges 24px, gap 16–24px.

## Composants globaux
- Header: logo “DCKImmo” à gauche, nav à droite (Biens, Recherche, Demande de dossier), style transparent sur la vidéo puis surface au scroll.
- Footer: mentions simples (adresse/email/téléphone si fournis ultérieurement) + rappel navigation.
- Loading Overlay: plein écran, logo centré, barre de progression horizontale (indéterminée ou %).

---

## Page: Accueil
### Meta information
- Title: "DCKImmo — Immobilier dans le Jura et le Jura bernois"
- Description: "Découvrez nos biens et faites une demande de visite ou de dossier."
- Open Graph: og:title, og:description, og:type=website, og:image (image marque), og:video (optionnel).

### Layout
- Sections empilées (stack) avec hero pleine largeur; contenu centré via container.

### Page structure
1. **Hero vidéo (villa)**
   - Vidéo en arrière-plan (cover), overlay sombre (dégradé) pour lisibilité.
   - Bloc texte: titre (H1), sous-titre, 2 CTA: “Rechercher un bien” (primaire) + “Demander un dossier” (secondaire).
   - Indicateur discret de scroll.
2. **Accès rapide**
   - 3 cartes (Biens / Recherche / Demande de dossier) avec court texte et bouton.

### États & interactions
- Au chargement initial: afficher l’écran de chargement (logo + barre) jusqu’à disponibilité UI.
- Favicon: décliné clair/sombre, lisible à 16/32px.

---

## Page: Biens
### Meta information
- Title: "Biens — DCKImmo"
- Description: "Parcourez les biens disponibles."

### Layout
- Grille de cartes (CSS Grid) 3 colonnes desktop; cartes avec image, titre, badges (Vente/Location), région.

### Sections & components
1. **En-tête de page**: titre + court texte.
2. **Grille de biens**
   - Carte: image, titre, type (À vendre/À louer), région (Jura/Jura bernois), CTA “Demander une visite / dossier”.
3. **CTA persistant**: bouton secondaire vers “Demande de dossier”.

---

## Page: Recherche
### Meta information
- Title: "Recherche — DCKImmo"
- Description: "Filtrez les biens par type et région."

### Layout
- Mise en page 2 colonnes desktop: colonne gauche filtres (sticky), colonne droite résultats.

### Sections & components
1. **Panneau filtres**
   - Toggle: À vendre / À louer.
   - Sélecteur région: Jura / Jura bernois.
   - Boutons: “Appliquer” (si nécessaire) + “Réinitialiser”.
2. **Résultats**
   - Liste/grille identique à Biens pour cohérence.
   - État vide: message “Aucun bien ne correspond aux filtres”.

### États & interactions
- Lors d’un recalcul de résultats: option d’afficher un mini loader (barre fine ou skeleton).

---

## Page: Demande de dossier (Contact)
### Meta information
- Title: "Demande de dossier — DCKImmo"
- Description: "Contactez-nous, demandez une visite ou un dossier."

### Layout
- Formulaire centré (max 720px), sections groupées (fieldset) avec labels au-dessus.

### Sections & components
1. **Choix de la demande**
   - Radio/segmented control: Contact / Demande de visite / Demande de dossier.
2. **Coordonnées**
   - Champs: Nom, Email, Téléphone (optionnel si souhaité), Message.
3. **Envoi**
   - Bouton primaire “Envoyer la demande”.
   - États: validation (messages inline), succès (confirmation), erreur (message clair).

## Responsive (règles communes)
- Tablet: passer Biens/Recherches en 2 colonnes; filtres non-sticky.
- Mobile: 1 colonne; nav en menu compact; CTA empilés; hero vidéo conserve ratio (cover).