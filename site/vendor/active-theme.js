// src/core/apply.ts
function root() {
  if (typeof document === "undefined") return null;
  return document.documentElement;
}
function applyMode(_theme, mode) {
  const el = root();
  if (!el) return;
  el.dataset.theme = mode;
}
function applyColor(theme, colorId) {
  const el = root();
  if (!el) return;
  const palette = theme.colors[colorId];
  if (!palette) return;
  el.dataset.accent = colorId;
  el.style.setProperty("--hue", String(palette.hue));
  el.style.setProperty("--hue-accent", String(palette.hue - 3));
  const chroma = palette.chromaBase ?? 0.036;
  el.style.setProperty("--chroma-base", String(chroma));
  el.style.setProperty("--chroma-accent", String(chroma * 11.111));
}
function applyTheme(theme, mode, colorId) {
  applyMode(theme, mode);
  applyColor(theme, colorId);
}
function readModeFromDocument() {
  const el = root();
  if (!el) return void 0;
  const mode = el.dataset.theme;
  return mode === "light" || mode === "dark" ? mode : void 0;
}
function readColorFromDocument() {
  return root()?.dataset.accent;
}

// src/core/storage.ts
var MODE_SUFFIX = "mode";
var COLOR_SUFFIX = "color";
function canUseStorage() {
  return typeof globalThis.localStorage !== "undefined";
}
function modeStorageKey(theme) {
  return `${theme.storagePrefix}${MODE_SUFFIX}`;
}
function colorStorageKey(theme) {
  return `${theme.storagePrefix}${COLOR_SUFFIX}`;
}
function readStoredMode(theme) {
  if (!canUseStorage() || !theme.persist) return void 0;
  try {
    const raw = globalThis.localStorage.getItem(modeStorageKey(theme));
    return raw === "light" || raw === "dark" ? raw : void 0;
  } catch {
    return void 0;
  }
}
function readStoredColor(theme) {
  if (!canUseStorage() || !theme.persist) return void 0;
  try {
    const raw = globalThis.localStorage.getItem(colorStorageKey(theme));
    if (raw != null && raw in theme.colors) return raw;
    return void 0;
  } catch {
    return void 0;
  }
}
function writeStoredMode(theme, mode) {
  if (!canUseStorage() || !theme.persist) return;
  try {
    globalThis.localStorage.setItem(modeStorageKey(theme), mode);
  } catch {
  }
}
function writeStoredColor(theme, colorId) {
  if (!canUseStorage() || !theme.persist) return;
  try {
    globalThis.localStorage.setItem(colorStorageKey(theme), colorId);
  } catch {
  }
}

// src/core/define-theme.ts
var DEFAULT_PREFIX = "active-theme:";
var active = null;
var stopShared = null;
function startSharedSync(theme) {
  stopShared?.();
  stopShared = null;
  if (!theme.shared || typeof globalThis.window === "undefined") return;
  const onStorage = (event) => {
    const e = event;
    if (!e.key || e.newValue == null) return;
    if (e.key === `${theme.storagePrefix}mode`) {
      if (e.newValue === "light" || e.newValue === "dark") {
        applyTheme(theme, e.newValue, readStoredColor(theme) ?? theme.defaultColor);
      }
      return;
    }
    if (e.key === `${theme.storagePrefix}color` && e.newValue in theme.colors) {
      const mode = readStoredMode(theme) ?? theme.defaultMode;
      applyTheme(theme, mode, e.newValue);
    }
  };
  globalThis.window.addEventListener("storage", onStorage);
  stopShared = () => globalThis.window.removeEventListener("storage", onStorage);
}
function defineTheme(input) {
  const persist = input.persist !== false;
  const theme = {
    modes: input.modes ?? ["light", "dark"],
    defaultMode: input.defaultMode ?? "dark",
    defaultColor: input.defaultColor,
    colors: input.colors,
    persist,
    shared: input.shared ?? persist,
    storagePrefix: input.storagePrefix ?? DEFAULT_PREFIX
  };
  active = theme;
  startSharedSync(active);
  return theme;
}
function getActiveTheme() {
  return active;
}
function setMode(mode, theme = active) {
  if (!theme) {
    throw new Error("[active-theme] Call defineTheme() before setMode().");
  }
  const color = readStoredColor(theme) ?? theme.defaultColor;
  applyTheme(theme, mode, color);
  writeStoredMode(theme, mode);
}
function setColor(colorId, theme = active) {
  if (!theme) {
    throw new Error("[active-theme] Call defineTheme() before setColor().");
  }
  if (!(colorId in theme.colors)) {
    throw new Error(`[active-theme] Unknown color "${String(colorId)}".`);
  }
  const mode = readStoredMode(theme) ?? theme.defaultMode;
  applyTheme(theme, mode, colorId);
  writeStoredColor(theme, colorId);
}
function hydrateTheme(theme = active) {
  if (!theme) {
    throw new Error("[active-theme] Call defineTheme() before hydrateTheme().");
  }
  const mode = readStoredMode(theme) ?? theme.defaultMode;
  const color = readStoredColor(theme) ?? theme.defaultColor;
  applyTheme(theme, mode, color);
}
function resetThemeRuntime() {
  stopShared?.();
  stopShared = null;
  active = null;
}
export {
  applyColor,
  applyMode,
  applyTheme,
  colorStorageKey,
  defineTheme,
  getActiveTheme,
  hydrateTheme,
  modeStorageKey,
  readColorFromDocument,
  readModeFromDocument,
  readStoredColor,
  readStoredMode,
  resetThemeRuntime,
  setColor,
  setMode
};
