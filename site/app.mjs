import { catalog, key, set, get, init } from "./vendor/active-state.js";
import { defineTheme, setMode, hydrateTheme } from "./vendor/active-theme.js";
import { defineI18n, setLocale, t, hydrateI18n, getLocale } from "./vendor/active-i18n.js";
import { startAmbient } from "./ambient.mjs";
import { SERIES_INTRO_SLUG, slugFromHref } from "./tip-series.mjs";

const theme = defineTheme({
  modes: ["light", "dark"],
  colors: {
    beige: { hue: 85, chromaBase: 0.014 },
  },
  defaultMode: "light",
  defaultColor: "beige",
});

const dictionaries = {
  en: {
    brand: "Calvin Maighan",
    "nav.work": "Work",
    "nav.services": "Services",
    "nav.process": "Process",
    "nav.writing": "Libraries",
    "nav.contact": "Contact",
    "nav.cta": "Book a call",
    "hero.eyebrow": "Senior AI and SaaS engineer",
    "hero.title": "AI consulting to help move ideas forward.",
    "hero.title.before": "AI consulting to help move ",
    "hero.title.word": "ideas",
    "hero.title.after": " forward.",
    "hero.lede":
      "I help startups, SaaS teams, and agencies design and ship AI systems, document workflows, and complex web platforms. Your team and agents run the system after handoff.",
    "hero.cta": "Discuss your project",
    "hero.secondary": "See selected work",
    "tips.title": "Tricks I use to ship fast and save tokens",
    "tips.series1.meta": "Series · intro + 14 tips",
    "tips.series1.title": "14 AI agent skills to speed up developers",
    "tips.series1.cta": "Read More",
    "article.kicker": "",
    "article.series": "",
    "article.home": "Home",
    "article.next.locked": "Scroll to the end to unlock",
    "article.next": "Next article",
    "article.back": "Back to tips",
    "article.book": "Book a call",
    "work.label": "Selected work",
    "work.title": "Featured build",
    "work.lede":
      "I focus on builds where architecture and code quality decide if you can ship.",
    "work.deedee.title": "Deedee: document intelligence with evidence attached",
    "work.deedee.body":
      "Deedee turns PDFs, spreadsheets, invoices, and contracts into structured, verifiable data. Every answer stays linked to the source page, cell, or clause.",
    "work.cat.product": "Product",
    "work.cat.ai": "AI systems",
    "work.cat.infra": "Infrastructure",
    "work.deedee.product.1": "SaaS application",
    "work.deedee.product.2": "User workflows",
    "work.deedee.product.3": "Billing and authentication",
    "work.deedee.ai.1": "OCR and extraction",
    "work.deedee.ai.2": "Evidence graph",
    "work.deedee.ai.3": "Agent workflows",
    "work.deedee.infra.1": "Multi-tenant runtime",
    "work.deedee.infra.2": "Queues and realtime state",
    "work.deedee.infra.3": "Observability",
    "work.deedee.cta": "Discuss a similar build",
    "work.deedee.case": "View full case study",
    "work.cap.label": "Capability",
    "work.cap1.title": "SaaS platform rescue",
    "work.cap1.body":
      "I stabilize incomplete Next.js and TypeScript apps, simplify the architecture, and ship the first production release.",
    "work.cap2.title": "Agency white-label builds",
    "work.cap2.body":
      "I provide architecture and implementation for agencies shipping ambitious products on short deadlines.",
    "ways.label": "Ways to work together",
    "ways.title": "How we work",
    "ways.lede":
      "Pick the engagement that matches your stage: a plan, a shipped milestone, or ongoing senior ownership.",
    "ways.1.t": "Architecture sprint",
    "ways.1.pitch": "You need clarity before you commit to a full build.",
    "ways.1.i1": "Technical discovery",
    "ways.1.i2": "Architecture and risk review",
    "ways.1.i3": "Implementation roadmap",
    "ways.1.i4": "Proof of concept when useful",
    "ways.1.d": "Typical duration: 1–2 weeks",
    "ways.2.t": "Implementation sprint",
    "ways.2.pitch": "You need a hard product milestone shipped.",
    "ways.2.i1": "Defined production scope",
    "ways.2.i2": "Architecture and implementation",
    "ways.2.i3": "Integration and testing",
    "ways.2.i4": "Deployment and handoff",
    "ways.2.d": "Typical duration: 2–6 weeks",
    "ways.3.t": "Fractional senior engineering",
    "ways.3.pitch": "You need ongoing technical leadership and hands-on delivery.",
    "ways.3.i1": "Architecture ownership",
    "ways.3.i2": "Product and engineering decisions",
    "ways.3.i3": "Feature implementation",
    "ways.3.i4": "Team support and oversight",
    "ways.3.d": "Typical duration: monthly engagement",
    "ways.caps": "Also available",
    "ways.c1": "AI product development",
    "ways.c2": "SaaS architecture",
    "ways.c3": "Product rescue",
    "ways.c4": "Agency subcontracting",
    "expertise.label": "Expertise",
    "expertise.title": "What I build with",
    "expertise.lede":
      "Application architecture, AI systems, document intelligence, and production operations.",
    "expertise.1.t": "Application architecture",
    "expertise.2.t": "AI systems",
    "expertise.3.t": "Document intelligence",
    "expertise.4.t": "Production systems",
    "process.label": "Process",
    "process.title": "From ambiguity to ownership",
    "process.lede": "Four steps that keep decisions visible and delivery honest.",
    "process.1.t": "Understand",
    "process.1.d": "Define the business outcome, users, constraints, and failure modes.",
    "process.2.t": "Design",
    "process.2.d":
      "Choose the architecture, interfaces, trade-offs, and implementation sequence.",
    "process.3.t": "Build",
    "process.3.d": "Ship thin production-ready slices with visible progress.",
    "process.4.t": "Stabilize",
    "process.4.d":
      "Test, observe, document, and prepare the system for continued ownership.",
    "writing.label": "Writing & open source",
    "writing.title": "Open-source libraries",
    "writing.lede": "Packages for client UI state, theme, and locale.",
    "writing.soon": "Technical writing notes coming soon.",
    "writing.oss": "Open-source work",
    "writing.oss1": "Tiny keyed pub/sub store for shared client UI state.",
    "writing.oss2": "Mode and color tokens applied cleanly to :root.",
    "writing.oss3": "Typed dictionaries with locale persistence.",
    "about.label": "About",
    "about.title": "Senior engineer with hands-on delivery",
    "about.body":
      "Calvin is a senior product engineer. He works across frontend architecture, backend systems, AI integrations, document processing, authentication, billing, and infrastructure. He focuses on products where technical decisions decide whether you can ship.",
    "letter.close": "Write me when the build is hard and the timeline is real.",
    "contact.label": "Contact",
    "contact.title": "Need a hard technical build?",
    "contact.lede":
      "Tell me the product or system problem. I take contract and fractional work with startups, SaaS teams, and agencies.",
    "form.name": "Name",
    "form.email": "Email",
    "form.company": "Company",
    "form.project": "Project summary",
    "form.budget": "Budget range",
    "form.timeline": "Target timeline",
    "form.submit": "Discuss the project",
    "form.note": "You get a direct reply. No automated sales sequence.",
    "form.sent": "Thanks. Your inquiry is ready locally. Email wiring comes next.",
    "form.error": "Please complete the required fields.",
    "footer.statement": "Available for hard builds.",
    "footer.role": "Senior AI and SaaS Engineer",
    "footer.meta": "Montreal · remote contracts",
    "budget.under-10k": "Under $10,000",
    "budget.10-25k": "$10,000–$25,000",
    "budget.25-50k": "$25,000–$50,000",
    "budget.50k-plus": "$50,000+",
    "budget.unsure": "Not sure yet",
    "timeline.immediately": "Immediately",
    "timeline.one-month": "Within one month",
    "timeline.three-months": "Within three months",
    "timeline.exploring": "Exploring options",
  },
  fr: {
    brand: "Calvin Maighan",
    "nav.work": "Travaux",
    "nav.services": "Services",
    "nav.process": "Processus",
    "nav.writing": "Bibliothèques",
    "nav.contact": "Contact",
    "nav.cta": "Réserver un appel",
    "hero.eyebrow": "Ingénieur senior IA et SaaS",
    "hero.title": "Consulting IA pour aider à faire avancer les idées.",
    "hero.title.before": "Consulting IA pour aider à faire avancer les ",
    "hero.title.word": "idées",
    "hero.title.after": ".",
    "hero.lede":
      "J’aide les startups, les équipes SaaS et les agences à concevoir et livrer des systèmes d’IA, des flux documentaires et des plateformes web complexes. Votre équipe et vos agents font tourner le système après le transfert.",
    "hero.cta": "Discuter de votre projet",
    "hero.secondary": "Voir les travaux",
    "tips.title": "Astuces pour livrer vite et économiser des tokens",
    "tips.series1.meta": "Série · intro + 14 astuces",
    "tips.series1.title": "14 compétences d’agents IA pour accélérer les développeurs",
    "tips.series1.cta": "Lire la suite",
    "article.kicker": "",
    "article.series": "",
    "article.home": "Accueil",
    "article.next.locked": "Défilez jusqu’à la fin pour débloquer",
    "article.next": "Article suivant",
    "article.back": "Retour aux astuces",
    "article.book": "Réserver un appel",
    "work.label": "Travaux sélectionnés",
    "work.title": "Build en vedette",
    "work.lede":
      "Je me concentre sur les builds où l’architecture et la qualité du code décident si vous pouvez livrer.",
    "work.deedee.title": "Deedee : intelligence documentaire avec preuves attachées",
    "work.deedee.body":
      "Deedee transforme PDF, tableurs, factures et contrats en données structurées et vérifiables. Chaque réponse reste liée à la page, cellule ou clause source.",
    "work.cat.product": "Produit",
    "work.cat.ai": "Systèmes d’IA",
    "work.cat.infra": "Infrastructure",
    "work.deedee.product.1": "Application SaaS",
    "work.deedee.product.2": "Parcours utilisateurs",
    "work.deedee.product.3": "Facturation et authentification",
    "work.deedee.ai.1": "OCR et extraction",
    "work.deedee.ai.2": "Graphe de preuves",
    "work.deedee.ai.3": "Flux d’agents",
    "work.deedee.infra.1": "Runtime multi-locataire",
    "work.deedee.infra.2": "Files et état temps réel",
    "work.deedee.infra.3": "Observabilité",
    "work.deedee.cta": "Discuter d’un build similaire",
    "work.deedee.case": "Voir l’étude de cas",
    "work.cap.label": "Capacité",
    "work.cap1.title": "Sauvetage de plateforme SaaS",
    "work.cap1.body":
      "Je stabilise des apps Next.js et TypeScript incomplètes, je simplifie l’architecture et je livre la première version en production.",
    "work.cap2.title": "Builds white-label pour agences",
    "work.cap2.body":
      "J’apporte architecture et implémentation aux agences qui livrent des produits ambitieux sous délais serrés.",
    "ways.label": "Façons de collaborer",
    "ways.title": "Comment on travaille",
    "ways.lede":
      "Choisissez l’engagement adapté à votre étape : un plan, un jalon livré, ou un ownership senior continu.",
    "ways.1.t": "Sprint d’architecture",
    "ways.1.pitch": "Vous avez besoin de clarté avant de vous engager sur un build complet.",
    "ways.1.i1": "Découverte technique",
    "ways.1.i2": "Revue d’architecture et des risques",
    "ways.1.i3": "Feuille de route d’implémentation",
    "ways.1.i4": "Preuve de concept si utile",
    "ways.1.d": "Durée typique : 1–2 semaines",
    "ways.2.t": "Sprint d’implémentation",
    "ways.2.pitch": "Vous devez livrer un jalon produit difficile.",
    "ways.2.i1": "Périmètre de production défini",
    "ways.2.i2": "Architecture et implémentation",
    "ways.2.i3": "Intégration et tests",
    "ways.2.i4": "Déploiement et transfert",
    "ways.2.d": "Durée typique : 2–6 semaines",
    "ways.3.t": "Ingénierie senior fractionnée",
    "ways.3.pitch":
      "Vous avez besoin de leadership technique et de livraison concrète en continu.",
    "ways.3.i1": "Ownership d’architecture",
    "ways.3.i2": "Décisions produit et ingénierie",
    "ways.3.i3": "Implémentation de fonctionnalités",
    "ways.3.i4": "Soutien et supervision d’équipe",
    "ways.3.d": "Durée typique : engagement mensuel",
    "ways.caps": "Également disponible",
    "ways.c1": "Développement produit IA",
    "ways.c2": "Architecture SaaS",
    "ways.c3": "Sauvetage produit",
    "ways.c4": "Sous-traitance d’agence",
    "expertise.label": "Expertise",
    "expertise.title": "Avec quoi je construis",
    "expertise.lede":
      "Architecture applicative, systèmes d’IA, intelligence documentaire et opérations de production.",
    "expertise.1.t": "Architecture applicative",
    "expertise.2.t": "Systèmes d’IA",
    "expertise.3.t": "Intelligence documentaire",
    "expertise.4.t": "Systèmes de production",
    "process.label": "Processus",
    "process.title": "De l’ambiguïté à la possession",
    "process.lede":
      "Quatre étapes qui gardent les décisions visibles et la livraison honnête.",
    "process.1.t": "Comprendre",
    "process.1.d":
      "Définir le résultat business, les utilisateurs, les contraintes et les modes de défaillance.",
    "process.2.t": "Concevoir",
    "process.2.d":
      "Choisir l’architecture, les interfaces, les compromis et la séquence d’implémentation.",
    "process.3.t": "Construire",
    "process.3.d": "Livrer de minces tranches prêtes pour la production, avec progrès visible.",
    "process.4.t": "Stabiliser",
    "process.4.d":
      "Tester, observer, documenter et préparer le système pour une ownership continue.",
    "writing.label": "Écrits et open source",
    "writing.title": "Bibliothèques open source",
    "writing.lede": "Paquets pour l’état UI client, le thème et la locale.",
    "writing.soon": "Notes techniques à venir.",
    "writing.oss": "Open source",
    "writing.oss1": "Petit store pub/sub pour l’état UI client partagé.",
    "writing.oss2": "Mode et tokens de couleur appliqués proprement sur :root.",
    "writing.oss3": "Dictionnaires typés avec persistance de locale.",
    "about.label": "À propos",
    "about.title": "Ingénieur senior avec livraison concrète",
    "about.body":
      "Calvin est un ingénieur produit senior. Il travaille sur l’architecture frontend, les systèmes backend, les intégrations IA, le traitement documentaire, l’authentification, la facturation et l’infrastructure. Il se concentre sur les produits où les décisions techniques décident si vous pouvez livrer.",
    "contact.label": "Contact",
    "letter.close":
      "Écrivez-moi quand le build est dur et que l’échéancier est réel.",
    "contact.title": "Besoin d’un build technique difficile ?",
    "contact.lede":
      "Décrivez le produit ou le problème système. Je prends des mandats contractuels et fractionnés avec startups, équipes SaaS et agences.",
    "form.name": "Nom",
    "form.email": "Courriel",
    "form.company": "Entreprise",
    "form.project": "Résumé du projet",
    "form.budget": "Budget",
    "form.timeline": "Échéancier",
    "form.submit": "Discuter du projet",
    "form.note": "Vous recevez une réponse directe. Pas de séquence commerciale automatisée.",
    "form.sent":
      "Merci. Votre demande est prête localement. Le branchement e-mail suivra.",
    "form.error": "Veuillez remplir les champs requis.",
    "footer.statement": "Disponible pour les builds difficiles.",
    "footer.role": "Ingénieur senior IA et SaaS",
    "footer.meta": "Montréal · contrats à distance",
    "budget.under-10k": "Moins de 10 000 $",
    "budget.10-25k": "10 000 $–25 000 $",
    "budget.25-50k": "25 000 $–50 000 $",
    "budget.50k-plus": "50 000 $+",
    "budget.unsure": "Pas encore sûr",
    "timeline.immediately": "Immédiatement",
    "timeline.one-month": "Dans un mois",
    "timeline.three-months": "Dans trois mois",
    "timeline.exploring": "En exploration",
  },
};

defineI18n({
  locales: ["en", "fr"],
  defaultLocale: "en",
  dictionaries,
});

const INQUIRY = key("INQUIRY", {
  name: "",
  email: "",
  company: "",
  project: "",
  budget: "25-50k",
  timeline: "one-month",
  status: "idle",
});

const MENU_OPEN = key("MENU_OPEN", false);
const POINTER = key("POINTER", { x: 0.68, y: 0.42, active: false });
const TEMPO = key("TEMPO", 2, { persist: true });
const SERIES_UNLOCKED = key("SERIES_UNLOCKED", [SERIES_INTRO_SLUG], { persist: true });

init(catalog(INQUIRY, MENU_OPEN, POINTER, TEMPO, SERIES_UNLOCKED));

hydrateTheme(theme);
hydrateI18n();

function currentMode() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyI18n() {
  const locale = getLocale();
  document.documentElement.lang = locale;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (!k) return;
    el.textContent = t(k);
  });

  const budget = document.querySelector('select[name="budget"]');
  if (budget) {
    for (const opt of budget.options) {
      opt.textContent = t(`budget.${opt.value}`);
    }
  }
  const timeline = document.querySelector('select[name="timeline"]');
  if (timeline) {
    for (const opt of timeline.options) {
      opt.textContent = t(`timeline.${opt.value}`);
    }
  }

  const localeLabel = document.getElementById("locale-label");
  if (localeLabel) localeLabel.textContent = locale.toUpperCase();
  const localeBtn = document.getElementById("locale-toggle");
  localeBtn?.setAttribute("aria-label", locale === "en" ? "Language" : "Langue");
  document.querySelectorAll(".locale-option").forEach((opt) => {
    const selected = opt.getAttribute("data-locale") === locale;
    opt.setAttribute("aria-selected", String(selected));
  });
}

function applyThemeUi() {
  const btn = document.getElementById("theme-toggle");
  const use = document.getElementById("theme-icon-use");
  const dark = currentMode() === "dark";
  if (use) use.setAttribute("href", dark ? "#icon-sun" : "#icon-moon");
  btn?.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute("content", dark ? "#221D19" : "#E6E2D4");
  }
}

function setMenu(open) {
  set(MENU_OPEN, open);
  document.body.classList.toggle("menu-open", open);
  document.getElementById("nav-drawer")?.classList.toggle("is-open", open);
  document.getElementById("menu-backdrop")?.classList.toggle("is-open", open);
  const toggle = document.getElementById("menu-toggle");
  const use = document.getElementById("menu-icon-use");
  toggle?.setAttribute("aria-expanded", String(open));
  toggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (use) use.setAttribute("href", open ? "#icon-x" : "#icon-menu");
  document.body.style.overflow = open ? "hidden" : "";
}

function wireHeader() {
  document.getElementById("menu-toggle")?.addEventListener("click", () => {
    setMenu(!get(MENU_OPEN));
  });
  document.getElementById("menu-backdrop")?.addEventListener("click", () => setMenu(false));
  document.querySelectorAll("#nav-drawer a").forEach((a) => {
    a.addEventListener("click", () => setMenu(false));
  });
}

function setLocaleMenu(open) {
  const pop = document.getElementById("locale-popover");
  const btn = document.getElementById("locale-toggle");
  pop?.classList.toggle("is-open", open);
  btn?.setAttribute("aria-expanded", String(open));
}

function wireControls() {
  const localeBtn = document.getElementById("locale-toggle");
  const localeMenu = document.getElementById("locale-menu");

  localeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = localeBtn.getAttribute("aria-expanded") === "true";
    setLocaleMenu(!open);
  });

  document.querySelectorAll(".locale-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      const next = opt.getAttribute("data-locale");
      if (!next || (next !== "en" && next !== "fr")) return;
      setLocale(next);
      applyI18n();
      setLocaleMenu(false);
    });
  });

  document.addEventListener("click", (e) => {
    if (!localeMenu?.contains(e.target)) setLocaleMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setLocaleMenu(false);
  });

  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    setMode(currentMode() === "light" ? "dark" : "light");
    applyThemeUi();
  });
}

function wireForm() {
  const form = document.getElementById("inquiry");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const project = String(data.get("project") || "").trim();
    if (!name || !email || !project) {
      status.hidden = false;
      status.textContent = t("form.error");
      return;
    }
    set(INQUIRY, {
      name,
      email,
      company: String(data.get("company") || "").trim(),
      project,
      budget: String(data.get("budget") || "25-50k"),
      timeline: String(data.get("timeline") || "one-month"),
      status: "sent",
    });
    status.hidden = false;
    status.textContent = t("form.sent");
    form.reset();
  });
}

function wirePointer() {
  const field = document.getElementById("hero-ambient");
  if (!field) return;

  let pending = null;
  let scheduled = 0;

  const flush = () => {
    scheduled = 0;
    if (pending) set(POINTER, pending);
  };

  const onMove = (e) => {
    const rect = field.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    pending = inside
      ? {
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
          active: true,
        }
      : { x: 0.68, y: 0.42, active: false };
    if (!scheduled) scheduled = requestAnimationFrame(flush);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
}

function wireTempo() {
  const input = document.getElementById("tempo");
  const value = document.getElementById("tempo-value");
  if (!input) return;

  const apply = (raw) => {
    const min = Number(input.min) || 0.25;
    const max = Number(input.max) || 4;
    const next = Math.min(max, Math.max(min, Number(raw) || 2));
    set(TEMPO, next);
    input.value = String(next);
    const fill = ((next - min) / (max - min)) * 100;
    input.style.setProperty("--tempo-fill", `${fill}%`);
    if (value) value.textContent = next.toFixed(2);
  };

  apply(get(TEMPO) ?? input.value);
  input.addEventListener("input", () => apply(input.value));
}

function wireAmbient() {
  const canvas = document.getElementById("hero-ambient");
  if (!canvas) return;
  startAmbient({
    canvas,
    getPointer: () => get(POINTER),
    getTempo: () => get(TEMPO) ?? 2,
    getDark: () => currentMode() === "dark",
  });
}

function unlockedSlugs() {
  const raw = get(SERIES_UNLOCKED);
  return Array.isArray(raw) ? raw : [SERIES_INTRO_SLUG];
}

function unlockSeriesSlug(slug) {
  if (!slug) return;
  const cur = unlockedSlugs();
  if (cur.includes(slug)) return;
  set(SERIES_UNLOCKED, [...cur, slug]);
}

function paintSeriesRail() {
  const rail = document.querySelector(".article-series-rail");
  if (!rail) return;

  const current = document.body.dataset.seriesSlug || "";
  if (current) unlockSeriesSlug(current);

  const unlocked = new Set(unlockedSlugs());
  unlocked.add(SERIES_INTRO_SLUG);

  rail.querySelectorAll("[data-series-slug]").forEach((el) => {
    const slug = el.getAttribute("data-series-slug") || "";
    const title = el.getAttribute("data-series-title") || "";
    const subtitle = el.getAttribute("data-series-subtitle") || "";
    const tipNum = Number(el.getAttribute("data-series-tip") || "0");
    const open = tipNum === 0 || unlocked.has(slug);
    const href = el.getAttribute("data-href") || "#";
    const titleEl = el.querySelector(".article-series-card-title");
    const subtitleEl = el.querySelector(".article-series-card-subtitle");

    el.classList.toggle("is-locked", !open);
    el.classList.toggle("is-current", slug === current);

    if (open) {
      el.setAttribute("href", href);
      el.removeAttribute("aria-disabled");
      if (titleEl) {
        titleEl.textContent = tipNum === 0 ? title : `${tipNum}. ${title}`;
      }
      if (subtitleEl) {
        subtitleEl.textContent = subtitle;
        subtitleEl.hidden = !subtitle;
      }
    } else {
      el.setAttribute("href", "#");
      el.setAttribute("aria-disabled", "true");
      if (titleEl) titleEl.textContent = `Skill #${tipNum}: Keep reading to unlock`;
      if (subtitleEl) {
        subtitleEl.textContent = subtitle;
        subtitleEl.hidden = !subtitle;
      }
    }
  });
}

function wireSeriesUnlockLinks() {
  document.querySelectorAll("[data-series-unlock]").forEach((el) => {
    el.addEventListener("click", () => {
      unlockSeriesSlug(el.getAttribute("data-series-unlock") || "");
    });
  });

  document.querySelector(".article-series-rail")?.addEventListener("click", (event) => {
    const card = event.target.closest("[data-series-slug]");
    if (!card || !card.classList.contains("is-locked")) return;
    event.preventDefault();
  });
}

function wireArticleNext() {
  const next = document.getElementById("article-next");
  if (!next) return;
  const hint = document.getElementById("article-chrome-hint");
  const lockedHint = hint?.dataset.lockedText || hint?.textContent || "";
  const unlockedHint = hint ? "You've unlocked the next skill 🎉" : "";

  // Final series tip / contact CTA: never scroll-lock.
  if (next.getAttribute("data-i18n") === "article.book" || next.dataset.lock === "false") {
    next.classList.remove("is-locked");
    next.removeAttribute("aria-disabled");
    next.style.transform = "scale(1)";
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setLocked = (locked) => {
    next.classList.toggle("is-locked", locked);
    next.setAttribute("aria-disabled", locked ? "true" : "false");
    if (hint && unlockedHint) {
      hint.hidden = false;
      hint.textContent = locked ? lockedHint : unlockedHint;
      hint.classList.toggle("is-unlocked", !locked);
    }
  };

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max <= 1 ? 1 : Math.min(1, Math.max(0, window.scrollY / max));
    if (!reduceMotion) {
      next.style.transform = `scale(${0.2 + progress * 0.8})`;
    } else {
      next.style.transform = "scale(1)";
    }
    setLocked(progress < 0.99);
  };

  setLocked(true);
  next.addEventListener("click", (event) => {
    if (next.classList.contains("is-locked")) {
      event.preventDefault();
      return;
    }
    unlockSeriesSlug(slugFromHref(next.getAttribute("href") || ""));
  });
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

applyThemeUi();
applyI18n();
wireHeader();
wireControls();
wireForm();
wirePointer();
wireTempo();
wireAmbient();
paintSeriesRail();
wireSeriesUnlockLinks();
wireArticleNext();





