## Calvin Maighan

Senior AI & SaaS engineer for difficult product builds.

**Portfolio (HTML + active-*):** [`site/`](./site/) — run `bun site/serve.ts` → http://localhost:5173

Open-source client libraries for shared UI state, theming, and i18n.

### Libraries

| Package | What it does | Repo |
| --- | --- | --- |
| **[active-state](https://github.com/CalvinMaighan/active-state)** | Tiny keyed pub/sub store — React, DOM bindings, persist / shared / SSR | [CalvinMaighan/active-state](https://github.com/CalvinMaighan/active-state) |
| **[active-theme](https://github.com/CalvinMaighan/active-theme)** | Mode + color on `:root` — persist by default, `/lite`, `/state` + `<ActiveTheme />` | [CalvinMaighan/active-theme](https://github.com/CalvinMaighan/active-theme) |
| **[active-i18n](https://github.com/CalvinMaighan/active-i18n)** | Typed dictionaries + `useText()` / `t()` — persist by default, `/lite`, `/state` + `<ActiveI18n />` | [CalvinMaighan/active-i18n](https://github.com/CalvinMaighan/active-i18n) |

### Together

```tsx
import { ActiveState, useActiveState } from "active-state/react";
import { ActiveTheme } from "active-theme/state";
import { ActiveI18n } from "active-i18n/state";
import { useText } from "active-i18n/react";

<>
  <ActiveState init={state} ssr />
  <ActiveTheme init={theme} />
  <ActiveI18n init={i18n} />
  {children}
</>

const [layout, setLayout] = useActiveState(LAYOUT);
const [mode, setMode] = useActiveState(THEME);
const { t, setLocale } = useText();
```

One bus for prefs. Theme paints `data-theme` / CSS vars. `useText()` gives `t` anywhere under `<ActiveI18n />`; `setLocale` writes the bus.

