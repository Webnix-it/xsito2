/* ============================================================
   WEBNIX — config.js  (SOLO JavaScript puro / Vanilla JS)
   Configurazione centralizzata: Firebase, contatti, social,
   servizi, portfolio, recensioni demo.
   Nessun framework, nessun altro linguaggio.
   ============================================================ */

const WEBNIX_CONFIG = {
  /* ---------- BRAND ---------- */
  brand: "Webnix",
  brandFull: "Webnix Digital Agency",
  siteName: "WEBNIX",
  tagline: "Dimentica WordPress.",
  copyrightYear: 2026,
  logoHeader: "loghi/WEBNIX.png",
  logoFooter: "WEBNIX-Logo-Solo-Simbolo-(1).png",

  /* ---------- CONTATTI ---------- */
  contact: {
    email: "webnixit@gmail.com",
    phoneDisplay: "+1 413 225 9397",
    phoneRaw: "14132259397",
    address: "Genova, Liguria, Italia",
    hours: "Lunedì – Venerdì, 09:00 – 18:00"
  },

  /* ---------- SOCIAL ---------- */
  /* Instagram uniformato a "webnix.it" ovunque (footer + JSON-LD) */
  social: {
    instagram: "https://www.instagram.com/webnix.it",
    facebook: "https://www.facebook.com/people/Webnix-Digital-Agency/61582890411506/",
    whatsappBase: "https://wa.me/14132259397"
  },

  /* ---------- FIREBASE (Realtime Database) ---------- */
  firebase: {
    apiKey: "AIzaSyDEMOKEY-WEBNIX-replace-with-real-key",
    authDomain: "webnix-recensioni.firebaseapp.com",
    databaseURL: "https://webnix-recensioni-default-rtdb.firebaseio.com",
    projectId: "webnix-recensioni",
    storageBucket: "webnix-recensioni.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:0000000000000000000000",
    reviewsPath: "recensioni"
  },

  /* ---------- RECENSIONI ----------
     Limite caratteri UNIFORMATO a 1000 (commento e codice coerenti) */
  reviews: {
    maxChars: 1000,
    minStars: 1,
    maxStars: 5,
    loadTimeoutMs: 6000,
    /* Fallback demo: mostra 3 testimonianze dirette se il DB è vuoto
       o irraggiungibile, mai un "Caricamento..." infinito. */
    demo: [
      {
        name: "Chiara B.",
        text: "Avevo solo Instagram e dopo un blocco ho perso i contatti con i clienti. Webnix mi ha fatto il sito in due giorni, bozza gratuita inclusa. Onesti e veloci.",
        url: "",
        stars: 5,
        timestamp: 1735689600000
      },
      {
        name: "Marco T. — Nuova pizzeria",
        text: "Non comparivo su Google Maps. Dopo il sito e la scheda curata, le richieste sono raddoppiate in un mese. Pagato solo a lavoro approvato, zero sorprese.",
        url: "",
        stars: 5,
        timestamp: 1738368000000
      },
      {
        name: "Sara L. — Studio di fisioterapia",
        text: "Niente canoni mensili folli, niente WordPress. Il codice del sito è mio. Mi hanno spiegato tutto, anche cosa NON era incluso. Rarissima trasparenza.",
        url: "",
        stars: 5,
        timestamp: 1740787200000
      }
    ]
  },

  /* ---------- SERVIZI (trasparenza radicale: include / NON include) ---------- */
  services: [
    {
      id: "servizio-base",
      icon: "fa-solid fa-rocket",
      name: "Sito Web Base",
      price: "da €349 una tantum",
      badge: "Porta d'ingresso",
      highlight: true,
      description: "La tua attività online, visibile su Google, in 48 ore dalla bozza.",
      includes: [
        "Sito vetrina 1–3 pagine, codice pulito HTML/CSS/JS",
        "Design responsive (desktop + smartphone)",
        "Ottimizzazione SEO base + velocità di caricamento",
        "Bozza gratuita in 48h, paghi solo se approvi",
        "Hosting statico (Netlify / GitHub Pages) configurato"
      ],
      excludes: [
        "Gestione contenuti mensile (serve il pacchetto Avvio)",
        "E-commerce e area riservata",
        "Campagne pubblicitarie (Google/Meta Ads)"
      ],
      cta: "Richiedi la bozza"
    },
    {
      id: "servizio-avvio",
      icon: "fa-solid fa-map-location-dot",
      name: "Avvio Locale",
      price: "da €549 una tantum",
      badge: "Per nuove attività",
      highlight: false,
      description: "Sito + Google Business Profile: invisibile su Maps non sei più.",
      includes: [
        "Tutto il pacchetto Sito Web Base",
        "Creazione/ottimizzazione Google Business Profile",
        "SEO locale (genova, quartieri, keyword di zona)",
        "Form contatti collegato a WhatsApp/email",
        "Guida scritta per gestire i recapiti da solo"
      ],
      excludes: [
        "Recensioni fittizie (non le facciamo, né le compriamo)",
        "Posizionamento garantito in 1ª pagina (chi lo promette mente)"
      ],
      cta: "Parliamone"
    },
    {
      id: "servizio-brand",
      icon: "fa-solid fa-palette",
      name: "Identità & Brand",
      price: "da €249 una tantum",
      badge: "Logo + coordinati",
      highlight: false,
      description: "Logo, palette e materiali: professionale dalla prima impressione.",
      includes: [
        "Logo vettoriale + varianti (clearspace, mono, favicon)",
        "Palette colori e coppia tipografica",
        "Biglietto da visita e template social",
        "File sorgente consegnati: il brand è tuo"
      ],
      excludes: [
        "Stampa materiale fisico (forniamo i file pronti)",
        "Rifacimenti illimitati: 2 revisioni incluse"
      ],
      cta: "Metti online il sito"
    }
  ],

  /* ---------- PORTFOLIO (griglia filtrabile) ---------- */
  portfolio: [
    { category: "siti", title: "Pizzeria Vesuvio — Genova", desc: "Sito vetrina + Maps, +38% chiamate in 30 giorni.", img: "assets/portfolio/sito-vesuvio.png" },
    { category: "siti", title: "Studio Fisio Nova", desc: "Landing page 48h, hostita su Netlify.", img: "assets/portfolio/sito-fisio.png" },
    { category: "siti", title: "Barber Shop Reale", desc: "Design dark neon, 98 score Lighthouse.", img: "assets/portfolio/sito-barber.png" },
    { category: "loghi", title: "Logo — GreenBox Delivery", desc: "Wordmark + simbolo, consegna file sorgente.", img: "assets/portfolio/logo-greenbox.png" },
    { category: "loghi", title: "Logo — Atelier Moda Ligure", desc: "Monogramma elegante, varianti print/digital.", img: "assets/portfolio/logo-atelier.png" },
    { category: "grafica", title: "Coordonato Social — PaleFit", desc: "Template post/storie coerenti col brand.", img: "assets/portfolio/grafica-palefit.png" },
    { category: "grafica", title: "Locandina Evento — Food Truck Fest", desc: "Stampa + digitale, CMYK/RGB.", img: "assets/portfolio/grafica-foodtruck.png" }
  ],

  /* ---------- WHATSAPP ---------- */
  whatsappMessage: "Ciao Webnix! Vorrei la bozza gratuita del mio sito web."
};

/* Utility globali (solo JS puro) */
function waLink(testo) {
  const msg = encodeURIComponent(testo || WEBNIX_CONFIG.whatsappMessage);
  return WEBNIX_CONFIG.social.whatsappBase + "?text=" + msg;
}
