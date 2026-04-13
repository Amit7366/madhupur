# Frontend architecture

Next.js App Router project under `src/`. Data flow: **routes** → **server loaders** (`getLangContext`, `pageMetadata`) → **presentational components** grouped by role.

## Folder structure

```
src/
├── app/                      # Routes only (pages, layouts, loading, manifest)
│   ├── [lang]/               # Localized segment; all public pages live here
│   ├── layout.tsx            # Root: fonts, ThemeProvider, html/body
│   └── manifest.ts
├── components/
│   ├── layout/               # App chrome: Header, Footer, TabBar, shell, skip link, lang switch
│   ├── navigation/           # NavItem, MobileDrawer, MobileNavContext
│   ├── theme/                # next-themes provider + ThemeSwitcher + theme-color sync
│   ├── pwa/                  # Install prompt, offline banner, SW registration, FAB
│   ├── map/                  # Map feature: MapView, MapFilters, PlaceCard
│   ├── ui/                   # Reusable UI primitives (cards, chips, skeletons, sections)
│   ├── sections/             # Composite home sections (Hero, QuickActionGrid)
│   └── content/              # Page shells + filtered lists + grids tied to dummy content
├── lib/                      # Pure TS: i18n, nav, routing helpers, utilities
│   ├── routing/              # Pathname helpers (active route detection)
│   ├── lang-routes.ts        # LangRouteParams, LangPageProps
│   ├── i18n-server.ts        # Server-only: locale resolution + dictionary load
│   └── metadata-lang.ts      # Shared generateMetadata factory
└── styles/
    └── globals.css
```

## Shared components (high level)

| Area | Components | Responsibility |
|------|------------|----------------|
| **Layout** | `MobileAppShell`, `Header`, `Footer`, `TabBar`, `SkipToContent`, `SetHtmlLang`, `LanguageSwitcher` | Persistent chrome, a11y skip link, i18n toggle |
| **Navigation** | `NavItem`, `MobileDrawer`, `MobileNavContext` | Primary nav + drawer; active state via `isPathActive` |
| **UI** | `InfoCard`, `SectionTitle`, `LoadingSkeleton`, `AnimatedCard`, **`ChipTabList`** | Cards, headings, loading states, **chip tablists** (filters) |
| **Content** | `PageShell`, `PageIntro`, `EmptyState`, `FilteredCardSection`, `ContentCardGrid` | Standard inner page layout and list UIs |
| **Map** | `MapView`, `MapFilters`, `PlaceCard` | Map page; filters use `ChipTabList` |
| **Theme / PWA** | `ThemeProvider`, `ThemeSwitcher`, `ThemeColorMeta`, PWA trio | Theming and install/offline |

## Conventions

- **`LangPageProps`** (`lib/lang-routes.ts`) — use on every `app/[lang]/**/page.tsx` for consistent typing.
- **`getLangContext(params)`** — resolves locale, loads dictionary, returns `{ locale, dict, t }`; calls `notFound()` if invalid.
- **`pageMetadata(params, selector)`** — DRY `generateMetadata` when locale is unknown (returns `{}`).
- **`isPathActive` / `normalizePathname`** (`lib/routing/pathname.ts`) — single implementation for “current nav item” logic (replaces duplicated helpers).
- **`ChipTabList`** — shared pill/tab control for **map filters** and **category filters** on listing pages.
- **`cn()`** — `clsx` + `tailwind-merge` (`lib/utils.ts`) for safe class merging.

## Adding a new `[lang]` page

1. Add copy keys under `locales/en.json` / `bn.json` as needed.
2. Create `app/[lang]/my-page/page.tsx` with `LangPageProps`, `pageMetadata`, and `getLangContext`.
3. Compose with `PageShell` + `PageIntro` + feature sections from `components/content` or `components/ui`.
