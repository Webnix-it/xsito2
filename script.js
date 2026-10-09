/* ============================================================
   WEBNIX — script.js  (SOLO JavaScript puro / Vanilla JS)
   Menu mobile drawer, scroll fluido, filtri portfolio,
   recensioni Firebase con fallback demo (anti-XSS),
   form contatti → WhatsApp, reveal scroll, loader globale.
   ============================================================ */

(function () {
  "use strict";

  var CFG = window.WEBNIX_CONFIG || null;

  /* ---------- LOADER GLOBALE (#global-loader2) ---------- */
  function avviaLoader() {
    var loader = document.getElementById("global-loader2");
    if (!loader) return;
    document.body.style.overflow = "hidden"; // scroll lock
    var barra = document.getElementById("progress-bar-fill2");
    var p = 0;
    var timer = setInterval(function () {
      p = Math.min(100, p + Math.random() * 18 + 6);
      if (barra) barra.style.width = p + "%";
      if (p >= 100) clearInterval(timer);
    }, 120);

    function chiudi() {
      clearInterval(timer);
      if (barra) barra.style.width = "100%";
      setTimeout(function () {
        loader.style.opacity = "0";
        setTimeout(function () {
          loader.style.display = "none"; // fix: rimuovi dal flusso dopo dissolvenza
          document.body.style.overflow = "";
        }, 650);
      }, 300);
    }
    if (document.readyState === "complete") chiudi();
    else window.addEventListener("load", chiudi);
    setTimeout(chiudi, 4000); // timeout di sicurezza
  }

  /* ---------- HEADER NAV: trasparente in cima, colorato allo scroll ---------- */
  function inizializzaHeaderScroll() {
    var header = document.getElementById("header");
    if (!header) return;
    var ultima = -1;
    function aggiorna() {
      var y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      if (y === ultima) return;
      ultima = y;
      if (y > 40) header.setAttribute("scrollato", "si");
      else header.removeAttribute("scrollato");
    }
    // passive listener per prestazioni elevate; requestAnimationFrame come throttle
    var inCorso = false;
    window.addEventListener("scroll", function () {
      if (inCorso) return;
      inCorso = true;
      requestAnimationFrame(function () { aggiorna(); inCorso = false; });
    }, { passive: true });
    aggiorna(); // stato iniziale corretto anche con pagina già scorrata (es. reload a metà)
  }

  /* ---------- NAV BAR DA ZERO: link puliti, underline brand + zoom 1.2 (solo CSS) ---------- */

  /* ---------- MENU MOBILE (drawer <=900px) ---------- */
  function inizializzaMenu() {
    var hamburger = document.getElementById("hamburger");
    var drawer = document.getElementById("drawer-mobile");
    var overlay = document.getElementById("overlay-mobile");
    var chiudiBtn = document.getElementById("chiusura-drawer");
    if (!hamburger || !drawer || !overlay) return;

    function apri() {
      if (window.innerWidth > 900) return; // drawer attivo solo <=900px
      drawer.setAttribute("aperto", "si");
      overlay.setAttribute("aperto", "si");
      hamburger.setAttribute("aria-expanded", "true"); // stato aperto irrobustito
      document.body.style.overflow = "hidden";
    }
    function chiudi() {
      drawer.removeAttribute("aperto");
      overlay.removeAttribute("aperto");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    hamburger.addEventListener("click", apri);
    if (chiudiBtn) chiudiBtn.addEventListener("click", chiudi);
    overlay.addEventListener("click", chiudi); // tap outside
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") chiudi();
    });
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", chiudi);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) chiudi();
    });
  }

  /* ---------- SCROLL FLUIDO (ogni #id link interno) ---------- */
  function inizializzaScrollFluido() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", id);
      });
    });
  }

  /* ---------- REVEAL SCROLL (IntersectionObserver one-shot) ---------- */
  function inizializzaReveal() {
    var elementi = document.querySelectorAll("[reveal]");
    var ridotto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (ridotto || !("IntersectionObserver" in window)) {
      elementi.forEach(function (el) { el.setAttribute("visible", "si"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (voce) {
        if (voce.isIntersecting) {
          voce.target.setAttribute("visible", "si");
          obs.unobserve(voce.target); // one-shot
        }
      });
    }, { threshold: 0.15 });
    elementi.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- RENDER SERVIZI (da config.js) ---------- */
  function renderServizi() {
    var griglia = document.getElementById("griglia-servizi");
    if (!griglia || !CFG) return;
    CFG.services.forEach(function (s, i) {
      var card = document.createElement("article");
      card.className = "card-servizio"; // marker layout (non classe di stile custom semantica)
      card.id = s.id;
      if (s.highlight) card.setAttribute("in evidenza", "si");
      card.setAttribute("reveal", "");
      card.setAttribute("delay", String((i % 3) + 1));

      var intest = document.createElement("div");
      intest.className = "intestazione-servizio";
      var icona = document.createElement("i");
      icona.className = s.icon; // fa-solid*: unica eccezione tecnica Font Awesome
      var h3 = document.createElement("h3");
      h3.textContent = s.name;
      intest.appendChild(icona); intest.appendChild(h3);

      var prezzo = document.createElement("p");
      prezzo.className = "prezzo-servizio"; prezzo.textContent = s.price;
      var etich = document.createElement("p");
      etich.className = "etichetta-servizio"; etich.textContent = s.badge;
      var desc = document.createElement("p");
      desc.className = "descrizione-servizio"; desc.textContent = s.description;

      var lista = document.createElement("div");
      lista.className = "lista-trasparenza";

      var hIn = document.createElement("h4");
      if (i === 0) hIn.id = "heading-includes";
      hIn.textContent = "✔ Cosa include";
      var ulIn = document.createElement("ul"); ulIn.className = "include";
      s.includes.forEach(function (t) {
        var li = document.createElement("li");
        var ic = document.createElement("i"); ic.className = "fa-solid fa-check";
        var sp = document.createElement("span"); sp.textContent = t;
        li.appendChild(ic); li.appendChild(sp); ulIn.appendChild(li);
      });

      var hEx = document.createElement("h4");
      if (i === 0) hEx.id = "heading-excludes";
      hEx.textContent = "✘ Cosa NON include";
      var ulEx = document.createElement("ul"); ulEx.className = "esclude";
      s.excludes.forEach(function (t) {
        var li = document.createElement("li");
        var ic = document.createElement("i"); ic.className = "fa-solid fa-xmark";
        var sp = document.createElement("span"); sp.textContent = t;
        li.appendChild(ic); li.appendChild(sp); ulEx.appendChild(li);
      });

      lista.appendChild(hIn); lista.appendChild(ulIn);
      lista.appendChild(hEx); lista.appendChild(ulEx);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn_seleziona";
      btn.textContent = s.cta;
      btn.addEventListener("click", function () {
        var contatto = document.getElementById("contatti");
        if (contatto) contatto.scrollIntoView({ behavior: "smooth" });
        var sel = document.getElementById("campo-servizio");
        if (sel) sel.value = s.name;
        var msg = document.getElementById("messaggio-modulo");
        if (msg) { msg.removeAttribute("tipo"); msg.textContent = ""; }
      });

      [intest, prezzo, etich, desc, lista, btn].forEach(function (n) { card.appendChild(n); });
      griglia.appendChild(card);
    });
  }

  /* ---------- PORTFOLIO: render + filtri ---------- */
  function renderPortfolio() {
    var griglia = document.getElementById("griglia-portfolio");
    if (!griglia || !CFG) return;
    CFG.portfolio.forEach(function (p, i) {
      var card = document.createElement("article");
      card.className = "card-portfolio";
      card.setAttribute("categoria", p.category);
      card.setAttribute("reveal", "");
      card.setAttribute("delay", String((i % 4) + 1));

      var img = document.createElement("img");
      img.src = p.img; img.alt = p.title; img.loading = "lazy";

      var corpo = document.createElement("div");
      corpo.className = "corpo-portfolio";
      var h3 = document.createElement("h3"); h3.textContent = p.title;
      var d = document.createElement("p"); d.textContent = p.desc;
      var tag = document.createElement("span");
      tag.className = "tag-portfolio";
      tag.textContent = p.category === "siti" ? "Sito Web" : p.category === "loghi" ? "Logo" : "Grafica";
      corpo.appendChild(h3); corpo.appendChild(d); corpo.appendChild(tag);

      card.appendChild(img); card.appendChild(corpo);
      griglia.appendChild(card);
    });
  }

  function inizializzaFiltri() {
    var fila = document.getElementById("fila-filtri");
    if (!fila) return;
    fila.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filtro]");
      if (!btn) return;
      fila.querySelectorAll("[data-filtro]").forEach(function (b) { b.removeAttribute("selezionato"); });
      btn.setAttribute("selezionato", "si");
      var f = btn.getAttribute("data-filtro");
      document.querySelectorAll(".card-portfolio").forEach(function (c) {
        var mostra = (f === "tutti" || c.getAttribute("categoria") === f);
        if (mostra) c.removeAttribute("nascosto");
        else c.setAttribute("nascosto", "si");
      });
    });
  }

  /* ---------- RECENSIONI: Firebase REST (JS puro, no SDK) + fallback demo ----------
     Struttura DB: { name, text, url, stars, timestamp } */
  function costruisciCardRecensione(r) {
    var card = document.createElement("article");
    card.className = "card-recensione";

    var intest = document.createElement("div");
    intest.className = "intestazione-recensione";
    var ini = document.createElement("div");
    ini.className = "iniziali-recensore";
    var parti = String(r.name || "?").trim().split(/\s+/);
    ini.textContent = (parti[0][0] || "?") + (parti[1] ? parti[1][0] : "");
    var nome = document.createElement("strong"); nome.textContent = r.name || "Anonimo";
    var stelle = document.createElement("div");
    stelle.className = "stelle-recensione";
    var n = Math.max(1, Math.min(5, parseInt(r.stars, 10) || 5));
    stelle.textContent = "★".repeat(n) + "☆".repeat(5 - n);
    intest.appendChild(ini);
    var blocco = document.createElement("div");
    blocco.appendChild(nome); blocco.appendChild(stelle);
    intest.appendChild(blocco);

    var testo = document.createElement("p");
    testo.className = "testo-recensione";
    testo.textContent = r.text || ""; // textContent = anti-XSS
    card.appendChild(intest); card.appendChild(testo);

    if (r.url && /^https?:\/\//i.test(r.url)) {
      var a = document.createElement("a");
      a.href = r.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.textContent = "Vedi progetto ↗";
      a.style.fontSize = ".8rem";
      card.appendChild(a);
    }
    if (r.timestamp) {
      var data = document.createElement("span");
      data.className = "data-recensione";
      try {
        data.textContent = new Date(Number(r.timestamp)).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
      } catch (err) { data.textContent = ""; }
      card.appendChild(data);
    }
    return card;
  }

  function dipingiRecensioni(recensioni, griglia, isDemo) {
    griglia.innerHTML = "";
    var ordinato = recensioni.slice().sort(function (a, b) { return (b.timestamp || 0) - (a.timestamp || 0); });
    ordinato.forEach(function (r, i) {
      var c = costruisciCardRecensione(r);
      c.setAttribute("reveal", "");
      c.setAttribute("delay", String((i % 4) + 1));
      griglia.appendChild(c);
    });
    // riepilogo
    var votoEl = document.getElementById("voto-medio");
    var conteggioEl = document.getElementById("conteggio-recensioni");
    var avviso = document.getElementById("avviso-demo-recensioni");
    var StelleEl = document.getElementById("stelle-medie");
    if (ordinato.length) {
      var media = ordinato.reduce(function (s, r) { return s + (parseInt(r.stars, 10) || 5); }, 0) / ordinato.length;
      if (votoEl) votoEl.textContent = media.toFixed(1);
      if (StelleEl) StelleEl.textContent = "★".repeat(Math.round(media)) + "☆".repeat(5 - Math.round(media));
      if (conteggioEl) conteggioEl.textContent = ordinato.length + (ordinato.length === 1 ? " recensione" : " recensioni");
    }
    if (avviso && isDemo) avviso.textContent = "Le testimonianze mostrate sono dirette dei primi clienti. A breve arriverà il widget con le recensioni verificate.";
    // riattiva reveal per nodi appena inseriti
    inizializzaReveal();
  }

  function caricaRecensioni() {
    var griglia = document.getElementById("griglia-recensioni");
    var caricamento = document.getElementById("caricamento-recensioni");
    if (!griglia || !CFG) return;

    function fallbackDemo(motivo) {
      if (caricamento) caricamento.remove();
      dipingiRecensioni(CFG.reviews.demo, griglia, true);
      if (motivo) console.warn("Webnix recensioni:", motivo);
    }

    var url = CFG.firebase.databaseURL + "/" + CFG.firebase.reviewsPath + ".json";
    if (!/^https:\/\/.+\.firebaseio\.com|^https:\/\/.+firebasestorage/.test(url) && !/firebase/.test(url)) {
      fallbackDemo("URL Firebase non valido");
      return;
    }
    var fatto = false;
    var timeout = setTimeout(function () {
      if (!fatto) { fatto = true; fallbackDemo("Timeout caricamento recensioni"); }
    }, CFG.reviews.loadTimeoutMs);

    fetch(url)
      .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); return res.json(); })
      .then(function (data) {
        if (fatto) return; fatto = true; clearTimeout(timeout);
        if (caricamento) caricamento.remove();
        var lista = [];
        if (data) {
          Object.keys(data).forEach(function (k) {
            var r = data[k];
            if (r && r.name && r.text) lista.push(r);
          });
        }
        if (!lista.length) {
          // 0 recensioni reali → mostra testimonianze demo (mai "Caricamento..." infinito)
          dipingiRecensioni(CFG.reviews.demo, griglia, true);
        } else {
          dipingiRecensioni(lista, griglia, false);
        }
      })
      .catch(function (err) {
        if (fatto) return; fatto = true; clearTimeout(timeout);
        fallbackDemo(err.message);
      });
  }

  /* ---------- FORM CONTATTI → WHATSAPP ---------- */
  function inizializzaForm() {
    var form = document.getElementById("form-bozza");
    if (!form) return;
    var msg = document.getElementById("messaggio-modulo");
    var area = document.getElementById("campo-descrizione");
    var contatore = document.getElementById("contatore-caratteri");
    var max = (CFG && CFG.reviews.maxChars) || 1000; // limite uniformato a 1000

    if (area && contatore) {
      function aggiorna() {
        var resto = max - area.value.length;
        contatore.textContent = resto + " caratteri rimanenti (max " + max + ")";
        if (resto < 0) area.value = area.value.slice(0, max);
      }
      area.addEventListener("input", aggiorna);
      aggiorna();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = (document.getElementById("campo-nome") || {}).value || "";
      var attivita = (document.getElementById("campo-attivita") || {}).value || "";
      var tel = (document.getElementById("campo-telefono") || {}).value || "";
      var servizio = (document.getElementById("campo-servizio") || {}).value || "Sito Web Base";
      var desc = (document.getElementById("campo-descrizione") || {}).value || "";

      if (!nome.trim() || !attivita.trim()) {
        msg.textContent = "Inserisci almeno nome e attività: servono per preparare la bozza.";
        msg.setAttribute("tipo", "errore");
        return;
      }
      var testo =
        "Ciao Webnix! Richiedo la BOZZA GRATUITA in 48h.\n" +
        "• Nome: " + nome.trim() + "\n" +
        "• Attività: " + attivita.trim() + "\n" +
        "• Telefono: " + (tel.trim() || "n.d.") + "\n" +
        "• Servizio: " + servizio + "\n" +
        "• Dettaglio: " + (desc.trim() || "n.d.");
      window.open(waLink(testo), "_blank", "noopener");
      msg.textContent = "Perfetto! Ti abbiamo aperto WhatsApp: invia il messaggio precompilato e ricevi la bozza entro 48 ore.";
      msg.setAttribute("tipo", "ok");
      form.reset();
      if (contatore) contatore.textContent = "";
    });
  }

  /* ---------- BOTTONE 1: stato [attivo] per touch ---------- */
  function inizializzaBottoneTouch() {
    ["bottone1", "bottone1-footer"].forEach(function (id) {
      var b = document.getElementById(id);
      if (!b) return;
      b.addEventListener("touchstart", function () { b.setAttribute("attivo", "si"); }, { passive: true });
      b.addEventListener("touchend", function () { setTimeout(function () { b.removeAttribute("attivo"); }, 400); });
    });
  }

  /* ---------- LINK DINAMICI DA CONFIG (social, mail, wa) ---------- */
  function applicaConfigLink() {
    if (!CFG) return;
    var map = {
      "link-instagram": CFG.social.instagram,
      "link-facebook": CFG.social.facebook,
      "link-whatsapp": waLink(),
      "link-whatsapp-info": waLink(),
      "link-whatsapp-hero": waLink(),
      "link-email": "mailto:" + CFG.contact.email,
      "link-tel": "tel:+" + CFG.contact.phoneRaw
    };
    Object.keys(map).forEach(function (id) {
      // querySelectorAll: gestisce anche id duplicati (es. link-whatsapp in info contatti + footer)
      document.querySelectorAll('[id="' + id + '"]').forEach(function (el) { el.href = map[id]; });
    });
    var logoH = document.getElementById("logo-header");
    if (logoH) logoH.src = CFG.logoHeader;
    var logoF = document.getElementById("logo-footer");
    if (logoF) logoF.src = CFG.logoFooter;
    var copy = document.getElementById("anno-copyright");
    if (copy) copy.textContent = "© " + CFG.copyrightYear + " " + CFG.brand;
    var infoMail = document.getElementById("testo-email");
    if (infoMail) infoMail.textContent = CFG.contact.email;
    var infoTel = document.getElementById("testo-telefono");
    if (infoTel) { infoTel.textContent = CFG.contact.phoneDisplay; }
    var infoInd = document.getElementById("testo-indirizzo");
    if (infoInd) infoInd.textContent = CFG.contact.address;
    var infoOr = document.getElementById("testo-orari");
    if (infoOr) infoOr.textContent = CFG.contact.hours;
  }

  /* ---------- AVVIO ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    avviaLoader();
    inizializzaHeaderScroll();
    inizializzaMenu();
    inizializzaScrollFluido();
    renderServizi();
    renderPortfolio();
    inizializzaFiltri();
    caricaRecensioni();
    inizializzaForm();
    inizializzaBottoneTouch();
    applicaConfigLink();
    inizializzaReveal();
  });
})();
