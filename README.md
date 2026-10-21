# AEM 2026 — Landing

Amigos en Mundo (Bukhara) landing page — medical services, MBBS admission and affiliate marketing.

## Stack

| Qatlam | Texnologiya                                                 |
| ------ | ----------------------------------------------------------- |
| UI     | React 19 + TypeScript                                       |
| Build  | Vite 8 (+ vite-ssg prerender)                               |
| CSS    | Tailwind CSS 4 — tokenlar `src/styles/index.css` (`@theme`) |
| Motion | GSAP + ScrollTrigger                                        |
| 3D     | Three.js (Cytotron sahna — bitta canvas)                    |
| i18n   | i18next + react-i18next (`en` / `uz` / `ru` / `hi`)         |
| Deploy | Netlify (`netlify.toml`)                                    |

## Buyruqlar

| Buyruq               | Vazifa                                            |
| -------------------- | ------------------------------------------------- |
| `npm run dev`        | Dev server                                        |
| `npm run build`      | `tsc -b && vite build`                            |
| `npm run preview`    | Build natijasini ko'rish                          |
| `npm run lint`       | ESLint (flat config)                              |
| `npm run format`     | Prettier bilan formatlash                         |
| `npm run check:i18n` | 4 til kalit parity tekshiruvi                     |
| `npm run budget`     | Asset/bundle byudjet tekshiruvi (build'dan keyin) |

## Muhim qoidalar

- Har faza oxirida: `npm run lint && npm run build && npm run budget`.
- Kodda literal hex yo'q — faqat `@theme` tokenlari.
- SSR-xavfsizlik (§9.6): DOM API faqat `useEffect` ichida, `window` module scope'da yo'q.
- Bitta WebGL context (faqat Cytotron), qolgani CSS/SVG.
