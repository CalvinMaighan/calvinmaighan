import { catalog, key, set, get, init } from "./vendor/active-state.js";
import { defineTheme, setMode, hydrateTheme } from "./vendor/active-theme.js";
import { defineI18n, setLocale, t, hydrateI18n, getLocale } from "./vendor/active-i18n.js";
import { startAmbient } from "./ambient.mjs";
import { SERIES_INTRO_SLUG, slugFromHref } from "./tip-series.mjs";

const theme = defineTheme({
  modes: ["light", "dark"],
  colors: {
    beige: { hue: 65, chromaBase: 0.014 },
  },
  defaultMode: "light",
  defaultColor: "beige",
});

const dictionaries = {
  en: {
    brand: "Calvin Maighan",
    "nav.services": "Services",
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
    "tips.title": "Tricks I use to ship fast and save tokens",
    "tips.series1.meta": "Series · intro + 14 tips",
    "tips.series1.title": "14 AI agent skills to speed up developers",
    "tips.series1.desc": "A product-owner map you can hand to engineering",
    "tips.series1.cta": "Read More",
    "article.kicker": "",
    "article.series": "",
    "article.home": "Home",
    "article.next.locked": "Scroll to the end to unlock",
    "article.next": "Next article",
    "article.back": "Back to tips",
    "article.book": "Book a call",
    "bundle.title": "Choose the right level of involvement",
    "bundle.lede":
      "Choose strategic guidance, focused implementation, or embedded development based on what your project needs. Every engagement is designed so your team and agents can run the system after handoff.",
    "bundle.recommended": "Recommended",
    "bundle.advisory.t": "Advisory",
    "bundle.advisory.d":
      "Strategic guidance for AI architecture, product planning, technical decisions, and implementation reviews.",
    "bundle.builder.t": "Builder Bundle",
    "bundle.builder.d":
      "End-to-end ownership of a defined initiative, from planning and architecture through implementation and handoff.",
    "bundle.embedded.t": "Development",
    "bundle.embedded.d":
      "Senior engineering capacity working directly with your team to own complex features, integrations, AI systems, and web platforms.",
    "expertise.label": "Expertise",
    "expertise.title": "What I build with",
    "expertise.lede":
      "Application architecture, AI systems, document intelligence, and production operations.",
    "expertise.meta": "4 domains · 24 capabilities",
    "expertise.legend": "Core specialty",
    "expertise.1.t": "Application architecture",
    "expertise.1.d": "Typed product surfaces, APIs, and multi-tenant foundations.",
    "expertise.2.t": "AI systems",
    "expertise.2.d": "Agents, retrieval, and evaluation wired into real products.",
    "expertise.3.t": "Document intelligence",
    "expertise.3.d": "PDFs and spreadsheets turned into verified structured data.",
    "expertise.4.t": "Production systems",
    "expertise.4.d": "Auth, billing, jobs, and observability that hold under load.",
    "writing.label": "Open source",
    "writing.title": "Calvin Maighan",
    "writing.role": "10+ years of building ambitious products",
    "writing.lede": "Open-source client libs for shared UI state, theme, i18n.",
    "writing.libs": "Libraries",
    "writing.col.package": "Package",
    "writing.col.does": "What it does",
    "writing.col.repo": "Repo",
    "writing.oss1":
      "Tiny keyed pub/sub store — React, DOM bindings, persist / shared / SSR",
    "writing.oss2":
      "Mode + color on :root — persist by default, /lite, /state + <ActiveTheme />",
    "writing.oss3":
      "Typed dictionaries + useText() / t() — persist by default, /lite, /state + <ActiveI18n />",
    "writing.together": "Together",
    "writing.foot":
      "One bus for prefs. Theme paints data-theme / CSS vars. useText() gives t under <ActiveI18n />; setLocale writes the bus.",
    "about.label": "About",
    "about.title": "Senior engineer with production experience",
    "about.body":
      "Calvin is a senior product engineer. He works across frontend architecture, backend systems, AI integrations, document processing, authentication, billing, and infrastructure. He focuses on products where technical decisions decide whether you can ship.",
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
    "form.sent": "Thanks. Your inquiry is ready locally. Email wiring comes next.",
    "form.error": "Please complete the required fields.",
    "footer.statement": "Let's Connect.",
    "footer.role": "Senior AI and SaaS Engineer",
    "footer.city": "Montreal",
    "footer.remote": "remote contracts",
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
    "nav.services": "Services",
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
    "tips.title": "Astuces pour livrer vite et économiser des tokens",
    "tips.series1.meta": "Série · intro + 14 astuces",
    "tips.series1.title": "14 compétences d’agents IA pour accélérer les développeurs",
    "tips.series1.desc":
      "Une carte product-owner à transmettre à l’ingénierie",
    "tips.series1.cta": "Lire la suite",
    "article.kicker": "",
    "article.series": "",
    "article.home": "Accueil",
    "article.next.locked": "Défilez jusqu’à la fin pour débloquer",
    "article.next": "Article suivant",
    "article.back": "Retour aux astuces",
    "article.book": "Réserver un appel",
    "bundle.title": "Choisissez le bon niveau d’implication",
    "bundle.lede":
      "Choisissez un accompagnement stratégique, une implémentation ciblée, ou du développement embarqué selon les besoins de votre projet. Chaque engagement est conçu pour que votre équipe et vos agents puissent faire tourner le système après le transfert.",
    "bundle.recommended": "Recommandé",
    "bundle.advisory.t": "Conseil",
    "bundle.advisory.d":
      "Accompagnement stratégique pour l’architecture IA, la planification produit, les décisions techniques et les revues d’implémentation.",
    "bundle.builder.t": "Bundle Builder",
    "bundle.builder.d":
      "Ownership de bout en bout d’une initiative définie, de la planification et de l’architecture jusqu’à l’implémentation et le transfert.",
    "bundle.embedded.t": "Développement",
    "bundle.embedded.d":
      "Capacité d’ingénierie senior au sein de votre équipe pour porter des fonctionnalités complexes, des intégrations, des systèmes d’IA et des plateformes web.",
    "expertise.label": "Expertise",
    "expertise.title": "Avec quoi je construis",
    "expertise.lede":
      "Architecture applicative, systèmes d’IA, intelligence documentaire et opérations de production.",
    "expertise.meta": "4 domaines · 24 compétences",
    "expertise.legend": "Spécialité principale",
    "expertise.1.t": "Architecture applicative",
    "expertise.1.d": "Surfaces produit typées, APIs et fondations multi-tenant.",
    "expertise.2.t": "Systèmes d’IA",
    "expertise.2.d": "Agents, récupération et évaluation branchés à de vrais produits.",
    "expertise.3.t": "Intelligence documentaire",
    "expertise.3.d": "PDF et tableurs transformés en données structurées vérifiées.",
    "expertise.4.t": "Systèmes de production",
    "expertise.4.d": "Auth, facturation, jobs et observabilité qui tiennent la charge.",
    "writing.label": "Open source",
    "writing.title": "Calvin Maighan",
    "writing.role": "Plus de 10 ans à bâtir des produits ambitieux",
    "writing.lede":
      "Libs client open source pour l’état UI partagé, le thème et l’i18n.",
    "writing.libs": "Bibliothèques",
    "writing.col.package": "Paquet",
    "writing.col.does": "Ce que ça fait",
    "writing.col.repo": "Dépôt",
    "writing.oss1":
      "Petit store pub/sub à clés — React, bindings DOM, persist / shared / SSR",
    "writing.oss2":
      "Mode + couleur sur :root — persist par défaut, /lite, /state + <ActiveTheme />",
    "writing.oss3":
      "Dictionnaires typés + useText() / t() — persist par défaut, /lite, /state + <ActiveI18n />",
    "writing.together": "Ensemble",
    "writing.foot":
      "Un bus pour les préférences. Le thème peint data-theme / les CSS vars. useText() donne t sous <ActiveI18n /> ; setLocale écrit le bus.",
    "about.label": "À propos",
    "about.title": "Ingénieur senior avec expérience en production",
    "about.body":
      "Calvin est un ingénieur produit senior. Il travaille sur l’architecture frontend, les systèmes backend, les intégrations IA, le traitement documentaire, l’authentification, la facturation et l’infrastructure. Il se concentre sur les produits où les décisions techniques décident si vous pouvez livrer.",
    "contact.label": "Contact",
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
    "form.sent":
      "Merci. Votre demande est prête localement. Le branchement e-mail suivra.",
    "form.error": "Veuillez remplir les champs requis.",
    "footer.statement": "Connectons-nous.",
    "footer.role": "Ingénieur senior IA et SaaS",
    "footer.city": "Montréal",
    "footer.remote": "contrats à distance",
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
  setMenu(false);
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
    if (e.key === "Escape") {
      setLocaleMenu(false);
      setMenu(false);
    }
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
    const checkEl = el.querySelector(".article-series-card-check");

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
      if (checkEl) checkEl.hidden = false;
    } else {
      el.setAttribute("href", "#");
      el.setAttribute("aria-disabled", "true");
      if (titleEl) titleEl.textContent = `Skill #${tipNum}: Keep reading to unlock`;
      if (subtitleEl) {
        subtitleEl.textContent = subtitle;
        subtitleEl.hidden = !subtitle;
      }
      if (checkEl) checkEl.hidden = true;
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
