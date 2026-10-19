#!/usr/bin/env node
/**
 * F0.8 — Bundle + asset byudjet tekshiruvi.
 * Manbalar: PLAN.md §6.3 HARD LIMITS, §7 asset maqsadlari, R14 (bundle o'sishi).
 *
 * Ishlatish: npm run build && npm run budget
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { gzipSync } from 'node:zlib'

const DIST = 'dist'

const KB = 1024
const MB = 1024 * 1024

const LIMITS = {
  jsGzip: 400 * KB, // barcha JS chunk'lar gzip jami
  cssGzip: 60 * KB, // CSS gzip jami
  image: 300 * KB, // bitta rasm (F1.1 maqsadi: hero ≤ 220 KB)
  font: 150 * KB, // bitta woff2 subset (Bricolage VF latin ~128 KB, Noto Devanagari ~124 KB)
  model: 1.5 * MB, // cytotron.glb (Draco) — F1.6 maqsadi 1.2 MB
  modelLod: 250 * KB, // cytotron-lod.glb — F1.6 maqsadi 200 KB
  total: 8 * MB, // butun dist
}

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.gif'])
const FONT_EXTS = new Set(['.woff2', '.woff', '.ttf', '.otf'])

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) out.push(...walk(full))
    else out.push({ path: full, size: st.size })
  }
  return out
}

function fmt(bytes) {
  if (bytes >= MB) return `${(bytes / MB).toFixed(2)} MB`
  return `${(bytes / KB).toFixed(1)} KB`
}

if (!existsSync(DIST)) {
  console.error(`✖ "${DIST}" topilmadi — avval \`npm run build\` ishga tushiring.`)
  process.exit(1)
}

const files = walk(DIST)
const violations = []
const rows = []

let jsGzip = 0
let cssGzip = 0
let total = 0
let imageCount = 0
let fontCount = 0
let modelCount = 0

for (const file of files) {
  total += file.size
  const ext = extname(file.path).toLowerCase()
  const rel = relative(DIST, file.path).replaceAll('\\', '/')

  if (ext === '.js') {
    const gz = gzipSync(readFileSync(file.path)).length
    jsGzip += gz
    if (gz > LIMITS.jsGzip)
      violations.push(`${rel}: gzip ${fmt(gz)} > ${fmt(LIMITS.jsGzip)} (bitta chunk limiti)`)
    continue
  }

  if (ext === '.css') {
    const gz = gzipSync(readFileSync(file.path)).length
    cssGzip += gz
    continue
  }

  if (IMAGE_EXTS.has(ext)) {
    imageCount++
    if (file.size > LIMITS.image) {
      violations.push(`${rel}: ${fmt(file.size)} > ${fmt(LIMITS.image)}`)
    }
    continue
  }

  if (FONT_EXTS.has(ext)) {
    fontCount++
    if (file.size > LIMITS.font) {
      violations.push(`${rel}: ${fmt(file.size)} > ${fmt(LIMITS.font)}`)
    }
    continue
  }

  if (ext === '.glb' || ext === '.gltf') {
    modelCount++
    const limit = rel.includes('lod') ? LIMITS.modelLod : LIMITS.model
    if (file.size > limit) {
      violations.push(`${rel}: ${fmt(file.size)} > ${fmt(limit)}`)
    }
  }
}

rows.push(['JS (gzip, jami)', fmt(jsGzip), fmt(LIMITS.jsGzip)])
rows.push(['CSS (gzip, jami)', fmt(cssGzip), fmt(LIMITS.cssGzip)])
rows.push([`Rasmlar (${imageCount} ta)`, '—', `har biri ≤ ${fmt(LIMITS.image)}`])
rows.push([`Shriftlar (${fontCount} ta)`, '—', `har biri ≤ ${fmt(LIMITS.font)}`])
rows.push([
  `Modellar (${modelCount} ta)`,
  '—',
  `≤ ${fmt(LIMITS.model)} / LOD ≤ ${fmt(LIMITS.modelLod)}`,
])
rows.push(['Dist jami', fmt(total), fmt(LIMITS.total)])

console.log('\n  AEM budget tekshiruvi (dist/)')
console.log('  ' + '-'.repeat(58))
for (const [name, actual, limit] of rows) {
  console.log(`  ${name.padEnd(26)} ${actual.padEnd(12)} limit: ${limit}`)
}
console.log('  ' + '-'.repeat(58))

if (jsGzip > LIMITS.jsGzip) {
  violations.push(`JS gzip jami: ${fmt(jsGzip)} > ${fmt(LIMITS.jsGzip)}`)
}
if (cssGzip > LIMITS.cssGzip) {
  violations.push(`CSS gzip jami: ${fmt(cssGzip)} > ${fmt(LIMITS.cssGzip)}`)
}
if (total > LIMITS.total) {
  violations.push(`dist jami: ${fmt(total)} > ${fmt(LIMITS.total)}`)
}

if (violations.length > 0) {
  console.error('\n✖ Byudjet buzilgan:')
  for (const v of violations) console.error(`  · ${v}`)
  console.error('')
  process.exit(1)
}

console.log('\n✓ Byudjet ichida.\n')
