import { catalog, key, set, get, init } from "active-state";
import { defineTheme, setMode, hydrateTheme } from "active-theme";
import { defineI18n, setLocale, t, hydrateI18n, getLocale } from "active-i18n";
import { startAmbient } from "./ambient.mjs";

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
    "hero.title": "Ship your backlog this week.",
    "hero.lede":
      "I help startups, SaaS teams, and agencies design and ship AI systems, document workflows, and complex Next.js platforms. Your team owns the system after handoff.",
    "hero.cta": "Discuss your project",
    "hero.secondary": "See selected work",
    "proof.1.t": "Production AI systems",
    "proof.1.d": "I turn research concepts into product surfaces you can run.",
    "proof.2.t": "Complex SaaS platforms",
    "proof.2.d": "Multi-tenant products with real operational constraints.",
    "proof.3.t": "Architecture through delivery",
    "proof.3.d": "I design the architecture and ship the code in one engagement.",
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
    "hero.title": "Livrez votre backlog cette semaine.",
    "hero.lede":
      "J’aide les startups, les équipes SaaS et les agences à concevoir et livrer des systèmes d’IA, des flux documentaires et des plateformes Next.js complexes. Votre équipe possède le système après le transfert.",
    "hero.cta": "Discuter de votre projet",
    "hero.secondary": "Voir les travaux",
    "proof.1.t": "Systèmes d’IA en production",
    "proof.1.d": "Je transforme des concepts de recherche en surfaces produit que vous pouvez opérer.",
    "proof.2.t": "Plateformes SaaS complexes",
    "proof.2.d": "Produits multi-locataires avec de vraies contraintes opérationnelles.",
    "proof.3.t": "Architecture jusqu’à la livraison",
    "proof.3.d": "Je conçois l’architecture et livre le code dans le même mandat.",
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
const SCROLLED = key("SCROLLED", false);
const POINTER = key("POINTER", { x: 0.68, y: 0.42, active: false });
const TEMPO = key("TEMPO", 2, { persist: true });

init(catalog(INQUIRY, MENU_OPEN, SCROLLED, POINTER, TEMPO));

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
  if (localeLabel) localeLabel.textContent = locale === "en" ? "FR" : "EN";
  const localeBtn = document.getElementById("locale-toggle");
  localeBtn?.setAttribute(
    "aria-label",
    locale === "en" ? "Switch to French" : "Passer en anglais",
  );
}

function applyThemeUi() {
  const btn = document.getElementById("theme-toggle");
  const use = document.getElementById("theme-icon-use");
  const dark = currentMode() === "dark";
  if (use) use.setAttribute("href", dark ? "#icon-sun" : "#icon-moon");
  btn?.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
}

function setMenu(open) {
  set(MENU_OPEN, open);
  document.body.classList.toggle("menu-open", open);
  const toggle = document.getElementById("menu-toggle");
  const use = document.getElementById("menu-icon-use");
  toggle?.setAttribute("aria-expanded", String(open));
  toggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (use) use.setAttribute("href", open ? "#icon-x" : "#icon-menu");
  document.body.style.overflow = open ? "hidden" : "";
}

function wireHeader() {
  const header = document.getElementById("site-header");
  const onScroll = () => {
    const scrolled = window.scrollY > 12;
    set(SCROLLED, scrolled);
    header?.classList.toggle("is-scrolled", scrolled);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  document.getElementById("menu-toggle")?.addEventListener("click", () => {
    setMenu(!get(MENU_OPEN));
  });
  document.getElementById("menu-backdrop")?.addEventListener("click", () => setMenu(false));
  document.querySelectorAll("#nav-drawer a").forEach((a) => {
    a.addEventListener("click", () => setMenu(false));
  });
}

function wireControls() {
  document.getElementById("locale-toggle")?.addEventListener("click", () => {
    setLocale(getLocale() === "en" ? "fr" : "en");
    applyI18n();
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

applyThemeUi();
applyI18n();
wireHeader();
wireControls();
wireForm();
wirePointer();
wireTempo();
wireAmbient();
