const SEED_LISTINGS = [
  {
    id: "JU-DEL-001",
    category: "rent",
    status: "rented",
    propertyType: "Appartement",
    title: "Magnifique appartement de 4.5 pièces au centre de Delémont",
    description: "Ce superbe appartement de 4.5 pièces situé au cœur de Delémont vous séduira par ses volumes généreux et sa luminosité exceptionnelle. Entièrement rénové en 2023, il offre un cadre de vie moderne tout en conservant un charme authentique. La cuisine ouverte, entièrement agencée avec des appareils électroménagers de haute qualité (four à vapeur, plaque à induction, lave-vaisselle silencieux), s'ouvre sur un vaste séjour baigné de lumière donnant accès à un grand balcon orienté plein sud. Les trois chambres à coucher sont spacieuses, avec un magnifique parquet en chêne massif. La salle de bain principale dispose d'une baignoire et d'une douche à l'italienne, avec une colonne de lavage privative (lave-linge et sèche-linge). Une cave privative et une place de parc couverte complètent ce bien d'exception. Idéal pour une famille ou un couple recherchant le confort à proximité immédiate des commerces, des écoles et de la gare.",
    region: "Jura",
    locality: "Delémont",
    rooms: 4.5,
    surface: 110,
    price: 1850,
    priceSuffix: "/mois",
    tags: ["Balcon", "Ascenseur", "Proche gare", "Rénové", "Cuisine équipée"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "JU-POR-002",
    category: "sale",
    status: "sold",
    propertyType: "Maison",
    title: "Maison familiale individuelle de 6.5 pièces avec grand jardin arboré",
    description: "Découvrez cette splendide maison individuelle de 6.5 pièces située dans un quartier résidentiel très prisé de Porrentruy. Construite sur une parcelle de plus de 800 m², cette propriété offre un cadre de vie idyllique, calme et sans vis-à-vis. Au rez-de-chaussée, vous trouverez un hall d'entrée accueillant, un WC visiteurs, ainsi qu'une vaste pièce à vivre comprenant un salon avec cheminée, une salle à manger et une cuisine moderne fermée mais ouvrable. De grandes baies vitrées permettent d'accéder directement à la terrasse couverte et au jardin magnifiquement arboré et clôturé. À l'étage, l'espace nuit se compose de quatre grandes chambres, dont une suite parentale avec dressing et salle de douche privative. Une grande salle de bain familiale avec double vasque complète ce niveau. Le sous-sol est entièrement excavé avec un grand garage double, un atelier, une buanderie et une cave à vin. Chauffage par pompe à chaleur et panneaux solaires photovoltaïques. Une opportunité rare sur le marché !",
    region: "Jura",
    locality: "Porrentruy",
    rooms: 6.5,
    surface: 180,
    price: 950000,
    priceSuffix: "",
    tags: ["Jardin", "Double garage", "Calme", "Pompe à chaleur", "Panneaux solaires", "Cheminée"],
    image: "https://images.unsplash.com/photo-1560185009-5bf9f2849488?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "JUB-BIE-003",
    category: "rent",
    propertyType: "Appartement",
    title: "Appartement neuf et moderne de 3.5 pièces à Bienne",
    description: "Situé dans une nouvelle promotion immobilière au centre de Bienne (Jura bernois), ce superbe appartement de 3.5 pièces au 2ème étage offre un standard de vie supérieur. L'appartement dispose d'une entrée avec armoires murales encastrées, d'un espace de vie ouvert très lumineux grâce à de grandes fenêtres, et d'une cuisine agencée de standing avec îlot central et plan de travail en granit. Les deux chambres sont confortables, et la salle d'eau moderne est équipée d'une douche à l'italienne. Vous profiterez également d'une magnifique loggia de 15 m² offrant une vue dégagée. Le bâtiment est équipé d'un ascenseur, d'un local à vélos sécurisé et d'un parking souterrain (place de parc disponible en sus pour CHF 130.-/mois). Proximité immédiate des transports publics, des supermarchés et des écoles. Libre de suite ou à convenir.",
    region: "Jura bernois",
    locality: "Biel/Bienne",
    rooms: 3.5,
    surface: 82,
    price: 1750,
    priceSuffix: "/mois",
    tags: ["Loggia", "Neuf", "Ascenseur", "Cuisine avec îlot", "Minergie"],
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "JU-SAI-004",
    category: "sale",
    propertyType: "Appartement",
    title: "Superbe attique de 5.5 pièces avec vue panoramique sur les Franches-Montagnes",
    description: "Ce luxueux appartement en attique de 5.5 pièces est un véritable bijou situé à Saignelégier. Occupant l'entier du dernier étage d'une petite PPE récente, il offre une intimité totale et une vue époustouflante à 360 degrés sur la nature environnante. Vous serez accueilli par un ascenseur arrivant directement dans l'appartement. La zone jour, de plus de 60 m², est baignée de lumière naturelle et s'ouvre sur une immense terrasse périphérique de 120 m². La cuisine haut de gamme ravira les amateurs de gastronomie. L'espace nuit comprend une suite parentale somptueuse avec dressing sur mesure et salle de bain privative, ainsi que trois autres belles chambres et une salle de douche supplémentaire. Finitions de très haut standing, domotique intégrée, stores motorisés, chauffage au sol. Deux places de parc dans le garage souterrain sont incluses dans le prix de vente.",
    region: "Jura",
    locality: "Saignelégier",
    rooms: 5.5,
    surface: 165,
    price: 1150000,
    priceSuffix: "",
    tags: ["Terrasse 120m2", "Vue panoramique", "Suite parentale", "Attique", "Haut standing"],
    image: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "JUB-MOU-005",
    category: "rent",
    propertyType: "Maison",
    title: "Charmante maison contiguë de 4.5 pièces à louer",
    description: "À louer à Moutier, jolie maison contiguë de 4.5 pièces avec petit jardin privatif, idéale pour une famille. Au rez-de-chaussée : hall d'entrée, WC séparé, cuisine fermée habitable et équipée, séjour spacieux avec accès direct à la terrasse et au jardin. À l'étage : trois chambres à coucher mansardées avec du cachet et une salle de bain avec baignoire. Le sous-sol abrite une buanderie privative, une cave et un espace de rangement. La maison se trouve dans un quartier familial, tranquille, en zone 30 km/h, à proximité immédiate de la forêt pour de belles balades, tout en étant à 10 minutes à pied du centre-ville. Une place de parc extérieure est comprise dans le loyer.",
    region: "Jura bernois",
    locality: "Moutier",
    rooms: 4.5,
    surface: 105,
    price: 1650,
    priceSuffix: "/mois",
    tags: ["Jardin", "Quartier familial", "Proche forêt", "Place de parc"],
    image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "JU-COU-006",
    category: "sale",
    propertyType: "Villa",
    title: "Villa d'architecte avec piscine naturelle à Courtételle",
    description: "Exclusivité ! Exceptionnelle villa d'architecte construite en 2018 sur une parcelle dominante de Courtételle, offrant une vue dégagée sur la vallée de Delémont. Cette propriété aux lignes épurées et contemporaines propose une surface habitable d'environ 220 m². Le rez-de-chaussée est entièrement dédié à l'espace de vie : un open space majestueux intégrant une cuisine de chef avec îlot, une salle à manger et un salon avec cheminée traversante. De grandes baies vitrées coulissantes permettent de fusionner l'intérieur avec l'extérieur, où vous profiterez d'une grande terrasse en teck et d'une superbe piscine naturelle (biotop). À l'étage, 4 chambres dont une master suite exceptionnelle avec baignoire îlot et dressing. Chauffage géothermique, domotique complète, garage double et places extérieures. Un bien d'une qualité rare, pour une clientèle exigeante.",
    region: "Jura",
    locality: "Courtételle",
    rooms: 6.5,
    surface: 220,
    price: 1480000,
    priceSuffix: "",
    tags: ["Piscine", "Vue dégagée", "Domotique", "Villa d'architecte", "Cheminée"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "JUB-TRM-007",
    category: "rent",
    propertyType: "Appartement",
    title: "Spacieux 5.5 pièces en duplex dans ancienne ferme rénovée",
    description: "Situé à Tramelan, ce magnifique appartement atypique de 5.5 pièces en duplex prend place dans une ancienne ferme entièrement rénovée avec beaucoup de goût, alliant le charme de l'ancien (poutres apparentes, murs en pierre) et le confort moderne. D'une surface très généreuse d'environ 150 m², il offre au premier niveau une vaste pièce de vie avec poêle à bois, une grande cuisine ouverte avec bar, deux chambres et une salle de douche. À l'étage supérieur, une immense mezzanine pouvant servir de bureau ou de salle de jeux, deux autres chambres et une grande salle de bain avec baignoire d'angle. Vous bénéficierez également de l'usage d'un grand jardin commun avec espace barbecue. Environnement très calme et bucolique. Deux places de parc extérieures incluses.",
    region: "Jura bernois",
    locality: "Tramelan",
    rooms: 5.5,
    surface: 150,
    price: 1950,
    priceSuffix: "/mois",
    tags: ["Duplex", "Poutres apparentes", "Poêle à bois", "Jardin commun"],
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "JU-DEL-008",
    category: "sale",
    propertyType: "Appartement",
    title: "Investissement de rendement : Appartement 2.5 pièces déjà loué",
    description: "Idéal pour investisseur ! Bel appartement de 2.5 pièces situé au rez-de-chaussée d'un petit immeuble très bien entretenu à Delémont. Le bien comprend un hall d'entrée avec armoires de rangement, un salon/salle à manger ouvrant sur une belle terrasse et un jardin privatif de 40 m², une cuisine agencée fermée, une grande chambre à coucher et une salle de bain avec baignoire. Une cave et une place de parc extérieure complètent le lot. L'appartement est actuellement loué à un locataire de longue date, très soigneux, garantissant un rendement immédiat et sécurisé. Chauffage à distance urbain installé en 2021. Quartier très prisé, proche de l'hôpital et des accès autoroutiers.",
    region: "Jura",
    locality: "Delémont",
    rooms: 2.5,
    surface: 65,
    price: 310000,
    priceSuffix: "",
    tags: ["Rendement", "Jardin privatif", "Rez-de-chaussée", "Loué"],
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "JU-COU-009",
    category: "rent",
    propertyType: "Appartement",
    title: "Studio meublé avec goût pour étudiant ou pied-à-terre",
    description: "Très beau studio de 30 m² entièrement meublé et équipé, situé dans un environnement calme à Courtételle. Ce logement fonctionnel et prêt à vivre se compose d'une grande pièce principale avec un lit double (literie incluse), un canapé, une TV écran plat, un bureau, et de nombreuses armoires de rangement. La kitchenette est complètement équipée (frigo, plaques, micro-ondes, vaisselle, machine à café). La salle de douche est moderne. Un balcon avec table et chaises permet de profiter de l'extérieur. Le loyer de 850 CHF inclut toutes les charges (chauffage, eau, électricité) ainsi qu'une connexion internet haut débit par fibre optique. Une buanderie commune est à disposition. Idéal pour étudiant, jeune actif ou comme pied-à-terre la semaine.",
    region: "Jura",
    locality: "Courtételle",
    rooms: 1.0,
    surface: 30,
    price: 850,
    priceSuffix: "/mois",
    tags: ["Meublé", "Charges comprises", "Internet inclus", "Balcon"],
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "JUB-TAV-010",
    category: "sale",
    propertyType: "Maison",
    title: "Ferme équestre avec 2 hectares de terrain attenant",
    description: "Amateurs de chevaux et de grands espaces, cette propriété est pour vous ! Magnifique ferme rénovée située à Tavannes, comprenant une partie habitation de plus de 250 m² et des installations équestres professionnelles. L'habitation principale sur 3 niveaux allie charme authentique et confort moderne avec 7 pièces, 2 salles de bain, et une superbe cuisine avec fourneau à bois. La partie rurale comprend une écurie intérieure avec 6 boxes spacieux, une sellerie chauffée, une aire de pansage et une grange pour le foin. À l'extérieur, vous disposerez d'un carré de sable drainé (20x40m) et d'environ 20'000 m² de pâturages attenants et clôturés. Source d'eau privée et panneaux solaires. Un véritable coin de paradis pour votre famille et vos animaux, en pleine nature mais à seulement 5 minutes des commodités.",
    region: "Jura bernois",
    locality: "Tavannes",
    rooms: 7.0,
    surface: 250,
    price: 1850000,
    priceSuffix: "",
    tags: ["Équestre", "Terrain 2ha", "Ferme rénovée", "Source privée"],
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "JU-POR-011",
    category: "rent",
    propertyType: "Appartement",
    title: "Appartement de standing 4.5 pièces au centre historique",
    description: "Situé en plein cœur de la vieille ville de Porrentruy, dans un immeuble historique classé et entièrement réhabilité en 2024, ce magnifique appartement de 4.5 pièces offre des prestations haut de gamme. D'une surface de 135 m², il se caractérise par de hauts plafonds ornés de moulures d'époque, de superbes parquets à chevrons restaurés et de grandes fenêtres offrant une belle clarté. La cuisine est moderne, ouverte sur un grand séjour de 50 m². L'appartement compte trois chambres spacieuses, dont une suite avec salle de douche privative. Une salle de bain principale avec baignoire et colonne de lavage, ainsi qu'un WC visiteurs complètent le bien. Ascenseur dans l'immeuble. Vous vivrez à deux pas des commerces, des restaurants et du château. Une place de parc dans un parking souterrain à 100m est disponible en option.",
    region: "Jura",
    locality: "Porrentruy",
    rooms: 4.5,
    surface: 135,
    price: 2100,
    priceSuffix: "/mois",
    tags: ["Historique", "Centre-ville", "Haut standing", "Parquet chevron"],
    image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "JUB-SON-012",
    category: "sale",
    propertyType: "Maison",
    title: "Maison individuelle 5.5 pièces rénovée avec terrasse et vue",
    description: "À Sonceboz-Sombeval, découvrez cette maison individuelle rénovée offrant un cadre de vie lumineux et pratique. La pièce à vivre spacieuse s’ouvre sur une terrasse orientée sud-ouest avec vue dégagée, idéale pour profiter des beaux jours. La cuisine moderne, entièrement agencée, est ouverte sur le séjour pour un quotidien convivial. À l’étage, l’espace nuit propose plusieurs chambres confortables et une salle d’eau actuelle. Sous-sol exploitable, buanderie, rangements et possibilité d’aménager un espace bureau. La propriété se situe dans un environnement calme, proche des écoles, des transports et de l’accès autoroutier A16.",
    region: "Jura bernois",
    locality: "Sonceboz-Sombeval",
    rooms: 5.5,
    surface: 145,
    price: 695000,
    priceSuffix: "",
    tags: ["Rénové", "Terrasse", "Vue dégagée", "Calme", "Accès autoroute"],
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "JU-COU-013",
    category: "rent",
    propertyType: "Maison",
    title: "Villa jumelée 5.5 pièces récente avec jardin",
    description: "À louer à Courtételle, magnifique villa jumelée de 5.5 pièces construite en 2021. Cette maison très lumineuse offre tout le confort moderne avec une pompe à chaleur et des panneaux solaires pour des charges très réduites. Le rez-de-chaussée est composé d'un hall avec armoires, d'un WC visiteurs, d'une grande cuisine ouverte très bien équipée et d'un vaste salon/séjour avec accès direct à une belle terrasse couverte et un jardin engazonné privatif. À l'étage, 4 belles chambres à coucher (dont une avec dressing) et une grande salle de bain (baignoire et douche). Le sous-sol est complet avec une grande pièce aménagée et chauffée (salle de jeux ou bureau), une cave et une grande buanderie. Un garage box et deux places de parc extérieures complètent ce bien de qualité.",
    region: "Jura",
    locality: "Courtételle",
    rooms: 5.5,
    surface: 160,
    price: 2400,
    priceSuffix: "/mois",
    tags: ["Villa jumelée", "Récent", "Jardin", "Garage box", "Faibles charges"],
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "JUB-BIE-014",
    category: "sale",
    propertyType: "Appartement",
    title: "Spacieux loft industriel de 180 m² au centre-ville",
    description: "Un bien unique sur le marché biennois ! Situé dans une ancienne usine horlogère réhabilitée, ce loft de 180 m² vous éblouira par ses volumes hors normes et son cachet industriel. Les hauteurs sous plafond de près de 4 mètres et les immenses baies vitrées inondent l'espace de lumière. Le loft est conçu en open-space avec une cuisine d'architecte avec un immense îlot central en inox, une salle à manger pouvant accueillir une grande tablée, et un salon spacieux. Un espace nuit est subtilement séparé par une verrière style atelier, comprenant une chambre, un grand dressing et une magnifique salle de bain avec baignoire sur pieds et double douche à l'italienne. Une deuxième chambre ou bureau fermé est également présent. Finitions brutes et nobles : sol en béton ciré, briques apparentes, poutrelles métalliques. Une grande place de parc dans le parking intérieur sécurisé.",
    region: "Jura bernois",
    locality: "Biel/Bienne",
    rooms: 3.5,
    surface: 180,
    price: 980000,
    priceSuffix: "",
    tags: ["Loft", "Style industriel", "Hauts plafonds", "Béton ciré", "Atypique"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=70",
  },
  {
    id: "JU-BAS-015",
    category: "rent",
    propertyType: "Appartement",
    title: "Appartement 3.5 pièces abordable et bien situé",
    description: "Idéal pour un couple ou une petite famille, cet appartement de 3.5 pièces se situe au 1er étage d'un immeuble locatif calme à Bassecourt. Il se compose d'une cuisine agencée fermée avec petit balcon, d'un séjour lumineux donnant sur un balcon plus spacieux avec vue sur les espaces verts de la résidence, de deux chambres à coucher de bonne taille, d'une salle de bain avec baignoire et de toilettes séparées. L'appartement dispose de nombreux placards encastrés dans le couloir. Une cave et un galetas sont inclus. La buanderie est commune et équipée d'appareils récents. Possibilité de louer une place de parc extérieure pour CHF 40.-/mois ou un garage individuel pour CHF 100.-/mois. Proche des commerces, des écoles et de l'arrêt de bus. Loyer très attractif.",
    region: "Jura",
    locality: "Bassecourt",
    rooms: 3.5,
    surface: 75,
    price: 1100,
    priceSuffix: "/mois",
    tags: ["Abordable", "Balcon", "Proche écoles", "Calme"],
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=70",
  }
];

// Maisons supplémentaires (4 photos chacune) — 5 à vendre, 5 à louer
SEED_LISTINGS.push(
  {
    id: "JU-DEL-M001",
    category: "sale",
    propertyType: "Maison",
    title: "Maison 5.5 pièces avec jardin et garage — Delémont",
    description: "Maison familiale lumineuse dans un quartier résidentiel recherché de Delémont. Séjour traversant, cuisine équipée, 4 chambres, 2 salles d’eau, sous-sol complet et garage. Jardin plat, terrasse et cabanon. Proche écoles et commerces.",
    region: "Jura",
    locality: "Delémont",
    rooms: 5.5,
    surface: 160,
    price: 825000,
    priceSuffix: "",
    tags: ["Jardin", "Garage", "Terrasse", "Calme"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=70",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1800&q=70"
    ],
  },
  {
    id: "JU-POR-M002",
    category: "sale",
    propertyType: "Maison",
    title: "Maison rénovée 6.5 pièces — Porrentruy",
    description: "Belle maison rénovée offrant de généreux volumes, cuisine ouverte, séjour avec accès terrasse, 5 chambres, 2 salles de bains, buanderie, caves. Extérieur soigné avec pelouse et coin détente. Environnement calme et pratique.",
    region: "Jura",
    locality: "Porrentruy",
    rooms: 6.5,
    surface: 185,
    price: 945000,
    priceSuffix: "",
    tags: ["Rénové", "Terrasse", "Buanderie", "Cave"],
    image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1600&q=70",
    gallery: [
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1800&q=70"
    ],
  },
  {
    id: "JUB-MOU-M003",
    category: "sale",
    propertyType: "Maison",
    title: "Maison individuelle 5.5 pièces — Moutier",
    description: "Maison individuelle bien entretenue à Moutier, 5.5 pièces, cuisine agencée, séjour lumineux, 4 chambres, salle de bain + douche, sous-sol, places extérieures. Petit jardin agréable, proche de la nature et des commodités.",
    region: "Jura bernois",
    locality: "Moutier",
    rooms: 5.5,
    surface: 150,
    price: 680000,
    priceSuffix: "",
    tags: ["Places extérieures", "Sous-sol", "Lumineux"],
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=70",
    gallery: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1560185009-5bf9f2849488?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1800&q=70"
    ],
  },
  {
    id: "JUB-TRM-M004",
    category: "sale",
    propertyType: "Maison",
    title: "Maison mitoyenne 4.5 pièces — Tramelan",
    description: "Mitoyenne bien distribuée, séjour avec accès terrasse, cuisine agencée, 3 chambres, salle de bain, WC visiteurs. Cave, buanderie, place couverte. Quartier calme, écoles et transports à proximité.",
    region: "Jura bernois",
    locality: "Tramelan",
    rooms: 4.5,
    surface: 128,
    price: 540000,
    priceSuffix: "",
    tags: ["Place couverte", "Terrasse", "Cave"],
    image: "https://images.unsplash.com/photo-1560185009-5bf9f2849488?auto=format&fit=crop&w=1600&q=70",
    gallery: [
      "https://images.unsplash.com/photo-1560185009-5bf9f2849488?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1800&q=70"
    ],
  },
  {
    id: "JUB-TAV-M005",
    category: "sale",
    propertyType: "Maison",
    title: "Grande maison de village 7.5 pièces — Tavannes",
    description: "Spacieuse maison de village, nombreuses pièces, potentiel d’aménagement, combles, dépendances. Jardin, cour intérieure, stationnement. Idéal famille ou activité indépendante. Centre de Tavannes accessible à pied.",
    region: "Jura bernois",
    locality: "Tavannes",
    rooms: 7.5,
    surface: 230,
    price: 595000,
    priceSuffix: "",
    tags: ["Dépendances", "Combles", "Jardin"],
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=70",
    gallery: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=70"
    ],
  },
  {
    id: "JU-DEL-M006",
    category: "rent",
    propertyType: "Maison",
    title: "Maison 4.5 pièces à louer — Delémont",
    description: "Maison de 4.5 pièces à Delémont, cuisine ouverte, séjour avec accès terrasse, 3 chambres, salle de bain et WC séparés. Cave, buanderie, place extérieure. Quartier calme, proche centre.",
    region: "Jura",
    locality: "Delémont",
    rooms: 4.5,
    surface: 120,
    price: 2150,
    priceSuffix: "/mois",
    tags: ["Terrasse", "Cave", "Place extérieure"],
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=70",
    gallery: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1800&q=70"
    ],
  },
  {
    id: "JU-POR-M007",
    category: "rent",
    propertyType: "Maison",
    title: "Maison 5 pièces avec jardin — Porrentruy",
    description: "Maison 5 pièces, cuisine équipée, séjour lumineux, 4 chambres, salle d’eau, buanderie. Jardin clos et terrasse. Commerces et transports accessibles rapidement.",
    region: "Jura",
    locality: "Porrentruy",
    rooms: 5.0,
    surface: 140,
    price: 2250,
    priceSuffix: "/mois",
    tags: ["Jardin", "Terrasse", "Buanderie"],
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=70",
    gallery: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1800&q=70"
    ],
  },
  {
    id: "JUB-BIE-M008",
    category: "rent",
    propertyType: "Maison",
    title: "Maison urbaine 4.5 pièces — Bienne",
    description: "Maison de ville 4.5 pièces, cuisine moderne, séjour traversant, 3 chambres, salle de bain, buanderie. Petite cour/terrasse. Situation pratique, proche gare et commerces.",
    region: "Jura bernois",
    locality: "Biel/Bienne",
    rooms: 4.5,
    surface: 115,
    price: 2350,
    priceSuffix: "/mois",
    tags: ["Cour", "Proche gare", "Moderne"],
    image: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1600&q=70",
    gallery: [
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1560185009-5bf9f2849488?auto=format&fit=crop&w=1800&q=70"
    ],
  },
  {
    id: "JUB-TRM-M009",
    category: "rent",
    propertyType: "Maison",
    title: "Maison jumelle 5.5 pièces — Tramelan",
    description: "Jolie jumelle 5.5 pièces avec séjour ouvrant sur terrasse, cuisine agencée, 4 chambres, 2 salles d’eau, sous-sol, place couverte. Quartier familial calme.",
    region: "Jura bernois",
    locality: "Tramelan",
    rooms: 5.5,
    surface: 150,
    price: 2180,
    priceSuffix: "/mois",
    tags: ["Place couverte", "Sous-sol", "Terrasse"],
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=70",
    gallery: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=70"
    ],
  },
  {
    id: "JUB-TAV-M010",
    category: "rent",
    propertyType: "Maison",
    title: "Maison de village 6 pièces — Tavannes",
    description: "Maison de village 6 pièces au cœur de Tavannes. Pièces spacieuses, cuisine habitable, salle de bain et douche, cave et grenier. Petit espace extérieur. Toutes commodités à pied.",
    region: "Jura bernois",
    locality: "Tavannes",
    rooms: 6.0,
    surface: 170,
    price: 2050,
    priceSuffix: "/mois",
    tags: ["Centre", "Grenier", "Cave"],
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=70",
    gallery: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=70",
      "https://images.unsplash.com/photo-1560185009-5bf9f2849488?auto=format&fit=crop&w=1800&q=70"
    ],
  }
);

export const CATEGORY_LABEL = {
  sale: "À vendre",
  rent: "À louer",
};

const FEATURE_POOL = [
  "Ascenseur", "Cheminée", "Balcon", "Terrasse", "Jardin", "Piscine", "Cave", 
  "Grenier", "Buanderie", "Laverie commune", "Garage", "Parking extérieur", 
  "Place couverte", "Local vélos", "Panneaux solaires", "Pompe à chaleur", 
  "Chauffage au sol", "Double vitrage", "Stores électriques", "Cuisine équipée", 
  "Cuisine ouverte", "Dressing", "Suite parentale", "Baignoire", "Douche à l’italienne", 
  "Vue dégagée", "Proche gare", "Proche écoles", "Proche commerces", "Accès autoroute", 
  "Calme", "Sans vis-à-vis", "Fibre optique", "Domotique", "Interphone", "Porte sécurisée", 
  "Animaux acceptés", "Meublé", "Rénové", "Neuf", "Hauteur sous plafond", "Parquet", 
  "Carrelage", "Orientation sud", "Accès PMR", "Charges comprises", "Lumineux", 
  "Vue montagne", "Vue campagne", "Coins rangement", "Atelier", "Cabanon", 
  "Arrosage automatique", "Portail électrique", "Caméras", "Spa / Jacuzzi", 
  "Salle de sport", "Home cinéma", "Bureau"
];

export function getAllTags() {
  const out = new Set(FEATURE_POOL);
  for (const l of LISTINGS) {
    for (const t of l.tags || []) out.add(t);
  }
  return Array.from(out).sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
}

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const LOCALITIES = [
  // Jura
  { name: "Delémont", region: "Jura", zip: "2800" },
  { name: "Porrentruy", region: "Jura", zip: "2900" },
  { name: "Saignelégier", region: "Jura", zip: "2350" },
  { name: "Courtedoux", region: "Jura", zip: "2905" },
  { name: "Courtételle", region: "Jura", zip: "2852" },
  { name: "Bassecourt", region: "Jura", zip: "2854" },
  { name: "Glovelier", region: "Jura", zip: "2855" },
  { name: "Courroux", region: "Jura", zip: "2822" },
  { name: "Vicques", region: "Jura", zip: "2824" },
  { name: "Fontenais", region: "Jura", zip: "2902" },
  { name: "Alle", region: "Jura", zip: "2942" },
  { name: "Cornol", region: "Jura", zip: "2952" },
  { name: "Noirmont", region: "Jura", zip: "2340" },
  { name: "Moutier", region: "Jura bernois", zip: "2740" }, // Technically Bern but historically/culturally linked
  
  // Jura bernois
  { name: "Biel/Bienne", region: "Jura bernois", zip: "2500" },
  { name: "Tramelan", region: "Jura bernois", zip: "2720" },
  { name: "Tavannes", region: "Jura bernois", zip: "2710" },
  { name: "Sonceboz-Sombeval", region: "Jura bernois", zip: "2605" },
  { name: "Saint-Imier", region: "Jura bernois", zip: "2610" },
  { name: "Reconvilier", region: "Jura bernois", zip: "2732" },
  { name: "Mallleray", region: "Jura bernois", zip: "2735" },
  { name: "Bévilard", region: "Jura bernois", zip: "2735" },
  { name: "Corgémont", region: "Jura bernois", zip: "2606" },
  { name: "La Neuveville", region: "Jura bernois", zip: "2520" },
  { name: "Nods", region: "Jura bernois", zip: "2518" },
  { name: "Orvin", region: "Jura bernois", zip: "2613" },
  { name: "Péry", region: "Jura bernois", zip: "2603" },
];

export function normalizeForSearch(value) {
  const s = String(value ?? "");
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getListingFeatures(listing, count = 34) {
  const seed = hashString(listing.id);
  const rnd = mulberry32(seed);
  const base = new Set([...(listing.tags || [])]);
  const out = [...base];

  const candidates = FEATURE_POOL.filter((f) => !base.has(f));
  while (out.length < Math.min(count, FEATURE_POOL.length) && candidates.length) {
    const idx = Math.floor(rnd() * candidates.length);
    out.push(candidates.splice(idx, 1)[0]);
  }
  return out;
}

export function getListingSearchText(listing) {
  const parts = [
    listing.id,
    listing.title,
    listing.description,
    listing.region,
    listing.locality,
    listing.propertyType,
    ...(listing.tags || []),
    ...getListingFeatures(listing),
  ];
  return normalizeForSearch(parts.filter(Boolean).join(" "));
}

export function getListingFacts(listing) {
  const out = {
    availableFrom: listing.availableFrom || "",
    floor: typeof listing.floor === "number" ? listing.floor : null,
    bathrooms: typeof listing.bathrooms === "number" ? listing.bathrooms : null,
    newBuild: Boolean(listing.newBuild),
    parking: Boolean(listing.parking),
    quietArea: Boolean(listing.quietArea),
    childrenFriendly: Boolean(listing.childrenFriendly),
  };

  if (out.availableFrom) return out;

  const seed = hashString(`${listing.id}:facts`);
  const rnd = mulberry32(seed);
  const month = String(1 + Math.floor(rnd() * 12)).padStart(2, "0");
  out.availableFrom = `01.${month}.2026`;
  out.floor = Math.floor(rnd() * 4) + 1;
  out.bathrooms = rnd() > 0.2 ? 1 : 2;
  out.newBuild = rnd() > 0.65;
  out.parking = rnd() > 0.3;
  out.quietArea = rnd() > 0.35;
  out.childrenFriendly = rnd() > 0.45;
  return out;
}

const PHOTO_POOL = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1560185009-5bf9f2849488?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1582582494700-909a3c9b77ab?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1800&q=70",
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1800&q=70",
];

export function getListingPhotos(listing, count = 8) {
  if (Array.isArray(listing.gallery) && listing.gallery.length) {
    return listing.gallery.slice(0, count);
  }
  const seed = hashString(`${listing.id}:photos`);
  const rnd = mulberry32(seed);
  const base = new Set([listing.image].filter(Boolean));
  const out = [...base];

  const candidates = PHOTO_POOL.filter((u) => !base.has(u));
  while (out.length < Math.min(count, PHOTO_POOL.length) && candidates.length) {
    const idx = Math.floor(rnd() * candidates.length);
    out.push(candidates.splice(idx, 1)[0]);
  }

  return out;
}

function makeExtraListings(total = 90) {
  const places = [
    { region: "Jura", locality: "Delémont" },
    { region: "Jura", locality: "Porrentruy" },
    { region: "Jura", locality: "Saignelégier" },
    { region: "Jura", locality: "Bassecourt" },
    { region: "Jura", locality: "Courtételle" },
    { region: "Jura", locality: "Courgenay" },
    { region: "Jura", locality: "Boncourt" },
    { region: "Jura", locality: "Alle" },
    { region: "Jura", locality: "Bure" },
    { region: "Jura", locality: "Fontenais" },
    { region: "Jura bernois", locality: "Biel/Bienne" },
    { region: "Jura bernois", locality: "Moutier" },
    { region: "Jura bernois", locality: "Tramelan" },
    { region: "Jura bernois", locality: "Tavannes" },
    { region: "Jura bernois", locality: "Saint-Imier" },
    { region: "Jura bernois", locality: "La Neuveville" },
    { region: "Jura bernois", locality: "Reconvilier" },
    { region: "Jura bernois", locality: "Corgémont" },
    { region: "Jura bernois", locality: "Sonceboz-Sombeval" },
  ];

  const roomSteps = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5];
  const adjectives = ["lumineux", "moderne", "rénové", "spacieux", "au calme", "familial", "avec cachet", "de standing"];
  const highlights = [
    "proche des commerces",
    "à deux pas des transports",
    "quartier résidentiel",
    "vue dégagée",
    "balcon/terrasse ensoleillé(e)",
    "proche des écoles",
    "accès rapide aux axes principaux",
    "environnement verdoyant",
  ];

  const pickOne = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];
  const pickMany = (rnd, arr, n) => {
    const pool = [...arr];
    const out = [];
    while (out.length < n && pool.length) {
      const idx = Math.floor(rnd() * pool.length);
      out.push(pool.splice(idx, 1)[0]);
    }
    return out;
  };

  const mkTitle = (type, cat, rooms, locality, rnd) => {
    const a = pickOne(rnd, adjectives);
    const roomStr = rooms ? `${rooms} pièces` : "bien";
    if (type === "Appartement") {
      return cat === "rent"
        ? `Appartement ${roomStr} ${a} à ${locality}`
        : `Appartement ${roomStr} ${a} – PPE à ${locality}`;
    }
    if (type === "Maison") {
      return cat === "rent"
        ? `Maison ${roomStr} ${a} avec extérieur – ${locality}`
        : `Maison ${roomStr} ${a} avec jardin – ${locality}`;
    }
    return cat === "rent"
      ? `Villa ${roomStr} ${a} – ${locality}`
      : `Villa ${roomStr} ${a} avec prestations premium – ${locality}`;
  };

  const mkDescription = (type, cat, rooms, surface, region, locality, rnd) => {
    const h1 = pickOne(rnd, highlights);
    const h2 = pickOne(rnd, highlights);
    const h3 = pickOne(rnd, highlights);
    const usage =
      cat === "rent"
        ? "Disponible à convenir. Dossier complet sur demande."
        : "Contactez-nous pour une visite et l’obtention du dossier de vente.";
    const intro =
      type === "Appartement"
        ? `Ce ${type.toLowerCase()} de ${rooms} pièces offre env. ${surface} m² de surface et une distribution très agréable.`
        : `Cette ${type.toLowerCase()} de ${rooms} pièces propose env. ${surface} m² de surface habitable et des volumes confortables.`;
    const part2 =
      type === "Appartement"
        ? "Cuisine agencée, séjour lumineux, chambres bien proportionnées et espaces de rangement. Ascenseur selon immeuble, cave et buanderie."
        : "Belle pièce de vie, cuisine équipée, chambres généreuses, espace bureau possible et nombreux rangements. Sous-sol partiel selon configuration.";
    const part3 =
      type === "Villa"
        ? "Finitions soignées, chauffage au sol, grandes baies vitrées et extérieur facile à vivre. Stationnement disponible."
        : "Confort moderne, luminosité, et un environnement idéal pour un quotidien pratique. Stationnement disponible.";
    return `${intro} Situé à ${locality} (${region}), ${h1}. ${part2} ${part3} Points forts : ${h2}, ${h3}. ${usage}`;
  };

  const mkPrice = (cat, type, rooms, surface, rnd) => {
    if (cat === "rent") {
      const base = 680 + surface * 10.5 + rooms * 85;
      const factor = 0.88 + rnd() * 0.34;
      const raw = Math.max(750, Math.min(3200, base * factor));
      return Math.round(raw / 10) * 10;
    }
    const base = 240000 + surface * 4300 + rooms * 14000;
    const factor = 0.86 + rnd() * 0.38;
    const raw = Math.max(280000, Math.min(2200000, base * factor));
    return Math.round(raw / 1000) * 1000;
  };

  const mkSurface = (type, rooms, rnd) => {
    if (type === "Appartement") {
      const base = 28 + rooms * 18;
      return Math.round((base + rnd() * 45) / 1) * 1;
    }
    if (type === "Maison") {
      const base = 90 + rooms * 20;
      return Math.round((base + rnd() * 70) / 1) * 1;
    }
    const base = 150 + rooms * 22;
    return Math.round((base + rnd() * 110) / 1) * 1;
  };

  const mkRooms = (type, rnd) => {
    if (type === "Appartement") return pickOne(rnd, roomSteps.slice(0, 10));
    if (type === "Maison") return pickOne(rnd, roomSteps.slice(6, 13));
    return pickOne(rnd, roomSteps.slice(7, 14));
  };

  const mkType = (cat, rnd) => {
    const p = rnd();
    if (cat === "rent") {
      if (p < 0.74) return "Appartement";
      if (p < 0.94) return "Maison";
      return "Villa";
    }
    if (p < 0.45) return "Appartement";
    if (p < 0.78) return "Maison";
    return "Villa";
  };

  const mkTags = (cat, type, rnd) => {
    const base = new Set();
    if (cat === "rent") base.add("Disponible rapidement");
    if (type === "Appartement") base.add("Ascenseur");
    if (type !== "Appartement") base.add("Jardin");
    if (rnd() > 0.55) base.add("Parking extérieur");
    if (rnd() > 0.62) base.add("Chauffage au sol");
    if (rnd() > 0.68) base.add("Cuisine équipée");
    if (rnd() > 0.72) base.add("Balcon");
    if (rnd() > 0.78) base.add("Terrasse");
    const extra = pickMany(rnd, FEATURE_POOL.filter((t) => !base.has(t)), 4);
    return [...base, ...extra];
  };

  const out = [];
  const seedCount = SEED_LISTINGS.length;
  for (let i = 0; i < total; i += 1) {
    const rnd = mulberry32(hashString(`auto:${i}`));
    const cat = rnd() > 0.5 ? "rent" : "sale";
    const type = mkType(cat, rnd);
    const { region, locality } = pickOne(rnd, places);
    const rooms = mkRooms(type, rnd);
    const surface = mkSurface(type, rooms, rnd);
    const price = mkPrice(cat, type, rooms, surface, rnd);
    const priceSuffix = cat === "rent" ? "/mois" : "";
    const idPrefix = region === "Jura" ? "JU" : "JUB";
    const seq = String(seedCount + i + 1).padStart(3, "0");
    const id = `${idPrefix}-AUTO-${seq}`;
    const image = pickOne(rnd, PHOTO_POOL);
    const title = mkTitle(type, cat, rooms, locality, rnd);
    const description = mkDescription(type, cat, rooms, surface, region, locality, rnd);
    const tags = mkTags(cat, type, rnd);

    out.push({
      id,
      category: cat,
      propertyType: type,
      title,
      description,
      region,
      locality,
      rooms,
      surface,
      price,
      priceSuffix,
      tags,
      image,
    });
  }
  return out;
}

export const LISTINGS = [...SEED_LISTINGS, ...makeExtraListings(90)];
