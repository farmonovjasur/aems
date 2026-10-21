#!/usr/bin/env node
/**
 * F1.7 — Shrift pipeline (PLAN.md §9.7).
 * Google Fonts'dan woff2 subset'larni yuklab oladi → public/fonts/,
 * so'ng src/styles/fonts.css (@font-face + :lang(hi)/:lang(ar) override) generatsiya qiladi.
 *
 * Ishlatish: npm run fetch:fonts
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'public', 'fonts')
const CSS_OUT = join(ROOT, 'src', 'styles', 'fonts.css')

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

/* Faqat kerakli subset'lar (ru → cyrillic, hi → devanagari, ar → arabic) */
const SUBSET_ALLOWLIST = new Set([
  'latin',
  'latin-ext',
  'cyrillic',
  'cyrillic-ext',
  'devanagari',
  'arabic',
])

const FAMILIES = [
  {
    slug: 'bricolage-grotesque',
    query: 'Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800',
  },
  { slug: 'instrument-serif', query: 'Instrument+Serif:ital@0;1' },
  {
    slug: 'geist',
    query: 'Geist:ital,wght@0,100..900;1,100..900',
    fallbackQuery: 'Geist:wght@100..900',
  },
  { slug: 'geist-mono', query: 'Geist+Mono:wght@100..900' },
  { slug: 'noto-sans-devanagari', query: 'Noto+Sans+Devanagari:wght@100..900' },
  { slug: 'noto-serif-devanagari', query: 'Noto+Serif+Devanagari:wght@100..900' },
  {
    slug: 'cairo',
    query: 'Cairo:wght@200..1000',
    subsets: ['arabic'],
  },
  {
    slug: 'noto-naskh-arabic',
    query: 'Noto+Naskh+Arabic:wght@400..700',
    subsets: ['arabic'],
  },
]

function cssUrl(query) {
  return `https://fonts.googleapis.com/css2?family=${query}&display=swap`
}

async function fetchCss(family) {
  let res = await fetch(cssUrl(family.query), { headers: { 'User-Agent': UA } })
  if (!res.ok && family.fallbackQuery) {
    res = await fetch(cssUrl(family.fallbackQuery), { headers: { 'User-Agent': UA } })
  }
  if (!res.ok) throw new Error(`${family.slug}: CSS ${res.status}`)
  return res.text()
}

function parseFaces(css, allowedSubsets = SUBSET_ALLOWLIST) {
  const faces = []
  const blockRe = /\/\*\s*([a-z-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g
  let match
  while ((match = blockRe.exec(css)) !== null) {
    const subset = match[1]
    const body = match[2]
    if (!allowedSubsets.has(subset)) continue

    const get = (prop) => body.match(new RegExp(`${prop}:\\s*([^;]+);`))?.[1]?.trim()
    const url = body.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1]
    if (!url) continue

    faces.push({
      subset,
      url,
      style: get('font-style') ?? 'normal',
      weight: get('font-weight') ?? '400',
      unicodeRange: get('unicode-range') ?? '',
    })
  }
  return faces
}

mkdirSync(OUT_DIR, { recursive: true })

const faceBlocks = []

for (const family of FAMILIES) {
  const css = await fetchCss(family)
  const allowed = family.subsets ? new Set(family.subsets) : SUBSET_ALLOWLIST
  const faces = parseFaces(css, allowed)
  if (faces.length === 0) throw new Error(`${family.slug}: mos @font-face topilmadi`)

  const familyName = family.slug
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')

  for (const face of faces) {
    const fileName = `${family.slug}-${face.subset}-${face.style}.woff2`
    const res = await fetch(face.url, { headers: { 'User-Agent': UA } })
    if (!res.ok) throw new Error(`${fileName}: ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    writeFileSync(join(OUT_DIR, fileName), buffer)
    console.log(`  ✓ ${fileName} — ${(buffer.length / 1024).toFixed(1)} KB`)

    const isVariable = face.weight.includes(' ')
    faceBlocks.push(
      [
        `/* ${familyName} · ${face.subset} · ${face.style}${isVariable ? '' : ' · ' + face.weight} */`,
        '@font-face {',
        `  font-family: '${familyName}';`,
        `  font-style: ${face.style};`,
        `  font-weight: ${face.weight};`,
        '  font-display: swap;',
        `  src: url('/fonts/${fileName}') format('woff2');`,
        `  unicode-range: ${face.unicodeRange};`,
        '}',
      ].join('\n'),
    )
  }
}

const header = `/*
 * AVTOMATIK GENERATSIYA — qo'lda tahrirlamang!
 * Manba: scripts/fetch-fonts.mjs (npm run fetch:fonts) · PLAN.md §9.7
 */

`

const devanagariOverride = `

/*
 * Devanagari override (§9.7): Bricolage Grotesque / Instrument Serif / Geist
 * Devanagari gliflariga ega emas → hi locale uchun alohida oilalar.
 * Tailwind v4 utilitilari var(--font-*) orqali ishlaydi → override yetarli.
 */
:lang(hi) {
  --font-display: 'Noto Sans Devanagari', 'Geist', ui-sans-serif, system-ui, sans-serif;
  --font-accent: 'Noto Serif Devanagari', 'Instrument Serif', Georgia, serif;
  --font-body: 'Noto Sans Devanagari', 'Geist', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'Noto Sans Devanagari', 'Geist Mono', ui-monospace, monospace;
}
`

const arabicOverride = `

/*
 * Arabic override (§9.7): Latin shriftlar arab yozuvini qo'llab-quvvatlamaydi.
 * Lotin gliflar avvalgi oilalarda qoladi (brand/texnika), arabcha gliflar
 * Cairo / Noto Naskh Arabic'ga tushadi. Faqat :lang(ar) sahifalarida yuklanadi.
 */
:lang(ar) {
  --font-display: 'Bricolage Grotesque', 'Cairo', ui-sans-serif, system-ui, sans-serif;
  --font-accent: 'Instrument Serif', 'Noto Naskh Arabic', Georgia, 'Times New Roman', serif;
  --font-body: 'Geist', 'Cairo', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'Cairo', ui-monospace, SFMono-Regular, Menlo, monospace;
}
`

writeFileSync(CSS_OUT, header + faceBlocks.join('\n\n') + devanagariOverride + arabicOverride)

console.log(`\n✓ ${faceBlocks.length} ta @font-face → src/styles/fonts.css`)
console.log('✓ woff2 → public/fonts/\n')
