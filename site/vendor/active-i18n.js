// src/core/document.ts
function applyLocaleToDocument(locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
}
function readLocaleFromDocument() {
  if (typeof document === "undefined") return void 0;
  const lang = document.documentElement.lang;
  return lang || void 0;
}
function applyI18nLocale(i18n, locale) {
  if (!i18n.locales.includes(locale)) return;
  applyLocaleToDocument(locale);
}

// src/core/storage.ts
var LOCALE_SUFFIX = "locale";
function canUseStorage() {
  return typeof globalThis.localStorage !== "undefined";
}
function localeStorageKey(i18n) {
  return `${i18n.storagePrefix}${LOCALE_SUFFIX}`;
}
function readStoredLocale(i18n) {
  if (!canUseStorage() || !i18n.persist) return void 0;
  try {
    const raw = globalThis.localStorage.getItem(localeStorageKey(i18n));
    if (raw != null && i18n.locales.includes(raw)) return raw;
    return void 0;
  } catch {
    return void 0;
  }
}
function writeStoredLocale(i18n, locale) {
  if (!canUseStorage() || !i18n.persist) return;
  try {
    globalThis.localStorage.setItem(localeStorageKey(i18n), locale);
  } catch {
  }
}

// src/core/t.ts
function interpolate(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) => {
    if (Object.prototype.hasOwnProperty.call(vars, name)) {
      return String(vars[name]);
    }
    return match;
  });
}
function translate(i18n, key, locale = i18n.defaultLocale, vars) {
  const resolved = i18n.locales.includes(locale) ? locale : i18n.defaultLocale;
  const primary = i18n.dictionaries[resolved]?.[key];
  const fallback = i18n.dictionaries[i18n.defaultLocale]?.[key];
  const template = primary ?? fallback ?? key;
  return interpolate(template, vars);
}
function dictionaryKeys(dict) {
  return Object.keys(dict);
}

// src/core/define-i18n.ts
var DEFAULT_PREFIX = "active-i18n:";
var active = null;
var currentLocale = null;
var stopShared = null;
function startSharedSync(i18n) {
  stopShared?.();
  stopShared = null;
  if (!i18n.shared || typeof globalThis.window === "undefined") return;
  const onStorage = (event) => {
    const e = event;
    if (e.key !== `${i18n.storagePrefix}locale` || e.newValue == null) return;
    if (!i18n.locales.includes(e.newValue)) return;
    currentLocale = e.newValue;
    applyI18nLocale(i18n, e.newValue);
  };
  globalThis.window.addEventListener("storage", onStorage);
  stopShared = () => globalThis.window.removeEventListener("storage", onStorage);
}
function defineI18n(input) {
  if (!input.locales.includes(input.defaultLocale)) {
    throw new Error(
      `[active-i18n] defaultLocale "${input.defaultLocale}" not in locales.`
    );
  }
  const persist = input.persist !== false;
  const i18n = {
    locales: input.locales,
    defaultLocale: input.defaultLocale,
    dictionaries: input.dictionaries,
    persist,
    shared: input.shared ?? persist,
    storagePrefix: input.storagePrefix ?? DEFAULT_PREFIX
  };
  active = i18n;
  currentLocale = null;
  startSharedSync(active);
  return i18n;
}
function getActiveI18n() {
  return active;
}
function getLocale() {
  if (currentLocale) return currentLocale;
  const i18n = active;
  if (!i18n) return "en";
  return readStoredLocale(i18n) ?? i18n.defaultLocale;
}
function t(key, varsOrLocale, maybeVars) {
  const i18n = active;
  if (!i18n) {
    throw new Error("[active-i18n] Call defineI18n() before t().");
  }
  if (typeof varsOrLocale === "string") {
    return translate(i18n, key, varsOrLocale, maybeVars);
  }
  return translate(i18n, key, getLocale(), varsOrLocale);
}
function setLocale(locale, i18n = active) {
  if (!i18n) {
    throw new Error("[active-i18n] Call defineI18n() before setLocale().");
  }
  if (!i18n.locales.includes(locale)) {
    throw new Error(`[active-i18n] Unknown locale "${locale}".`);
  }
  currentLocale = locale;
  applyI18nLocale(i18n, locale);
  writeStoredLocale(i18n, locale);
}
function hydrateI18n(i18n = active) {
  if (!i18n) {
    throw new Error("[active-i18n] Call defineI18n() before hydrateI18n().");
  }
  const locale = readStoredLocale(i18n) ?? i18n.defaultLocale;
  currentLocale = locale;
  applyI18nLocale(i18n, locale);
}
function resetI18nRuntime() {
  stopShared?.();
  stopShared = null;
  active = null;
  currentLocale = null;
}

// src/core/paths.ts
function normalizePath(path) {
  if (!path || path === "") return "/";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  if (withSlash.length > 1 && withSlash.endsWith("/")) {
    return withSlash.slice(0, -1);
  }
  return withSlash;
}
function localePath(locale, path, defaultLocale) {
  const normalized = normalizePath(path);
  if (locale === defaultLocale) return normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}
function stripLocalePrefix(path, locales, defaultLocale) {
  const normalized = normalizePath(path);
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (normalized === `/${locale}`) return "/";
    if (normalized.startsWith(`/${locale}/`)) {
      return normalized.slice(locale.length + 1) || "/";
    }
  }
  return normalized;
}
function localeFromPathname(path, locales, defaultLocale) {
  const normalized = normalizePath(path);
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (normalized === `/${locale}` || normalized.startsWith(`/${locale}/`)) {
      return locale;
    }
  }
  return defaultLocale;
}
export {
  applyI18nLocale,
  applyLocaleToDocument,
  defineI18n,
  dictionaryKeys,
  getActiveI18n,
  getLocale,
  hydrateI18n,
  interpolate,
  localeFromPathname,
  localePath,
  localeStorageKey,
  normalizePath,
  readLocaleFromDocument,
  readStoredLocale,
  resetI18nRuntime,
  setLocale,
  stripLocalePrefix,
  t,
  translate
};
