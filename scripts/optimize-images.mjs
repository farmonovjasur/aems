#!/usr/bin/env node
/**
 * F1.1–F1.3 — Rasm optimizatsiyasi (PLAN.md §7 asset inventory).
 * Manba: img/ (repo ildizi) → chiqish: public/img/<nom>-<kenglik>.<format>
 *
 * Ishlatish: npm run optimize:images
 */
import { mkdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'public', 'img')

const KB = 1024

/**
 * Har bir manba uchun responsiv to'plam.
 * target — asosiy faylning byudjeti (KB), oshsa skript xato qaytaradi.
 */
const MANIFEST = [
  {
    src: 'img/hero.JPG',
    name: 'hero',
    widths: [800, 1600],
    formats: { webp: 74, avif: 52 },
    limits: { 'hero-1600.webp': 220 * KB, 'hero-1600.avif': 160 * KB },
  },
  {
    src: 'img/logo.png',
    name: 'logo',
    widths: [140, 280],
    formats: { webp: 82 },
    limits: { 'logo-280.webp': 30 * KB },
  },
  {
    src: 'img/cytotron.webp',
    name: 'cytotron',
    widths: [800, 1200, 1600],
    formats: { webp: 76, avif: 55 },
    limits: {},
  },
  {
    src: 'img/radiology.webp',
    name: 'radiology',
    widths: [400, 800],
    formats: { webp: 76, avif: 55 },
    limits: {},
  },
  {
    src: 'img/bitu1.webp',
    name: 'bitu1',
    widths: [400, 720],
    formats: { webp: 76, avif: 55 },
    limits: {},
  },
  {
    src: 'img/bitu2.webp',
    name: 'bitu2',
    widths: [400, 800, 1280],
    formats: { webp: 76, avif: 55 },
    limits: {},
  },
  {
    src: 'img/bitu3.webp',
    name: 'bitu3',
    widths: [320, 640],
    formats: { webp: 76, avif: 55 },
    limits: {},
  },
  {
    src: 'img/doctor.jpg',
    name: 'doctor',
    widths: [128, 256],
    formats: { webp: 80, avif: 55 },
    limits: { 'doctor-256.webp': 40 * KB },
    square: true,
  },
  {
    src: 'img/avatar-a.jpg',
    name: 'avatar-a',
    widths: [96, 192],
    formats: { webp: 80, avif: 55 },
    limits: {},
    square: true,
  },
  {
    src: 'img/avatar-b.jpg',
    name: 'avatar-b',
    widths: [96, 192],
    formats: { webp: 80, avif: 55 },
    limits: {},
    square: true,
  },
]

const DEFAULT_LIMIT = 200 * KB

mkdirSync(OUT_DIR, { recursive: true })

const results = []
const violations = []

for (const entry of MANIFEST) {
  const srcPath = join(ROOT, entry.src)
  const meta = await sharp(srcPath).metadata()

  for (const width of entry.widths) {
    for (const [format, quality] of Object.entries(entry.formats)) {
      const fileName = `${entry.name}-${width}.${format}`
      const outPath = join(OUT_DIR, fileName)

      let pipeline = sharp(srcPath).resize({
        width,
        ...(entry.square
          ? { height: width, fit: 'cover', position: 'attention' }
          : { withoutEnlargement: true, fit: 'inside' }),
      })

      pipeline =
        format === 'webp'
          ? pipeline.webp({ quality, effort: 5 })
          : pipeline.avif({ quality, effort: 5 })

      await pipeline.toFile(outPath)

      const { size } = statSync(outPath)
      results.push({
        file: fileName,
        width: Math.min(width, meta.width),
        size,
        limit: entry.limits[fileName] ?? DEFAULT_LIMIT,
      })
    }
  }
}

console.log('\n  Rasm optimizatsiyasi — chiqish: public/img/')
console.log('  ' + '-'.repeat(62))
console.log(`  ${'Fayl'.padEnd(26)} ${'O‘lcham'.padEnd(12)} ${'Limit'.padEnd(12)}`)
console.log('  ' + '-'.repeat(62))

for (const r of results) {
  const sizeKb = (r.size / KB).toFixed(1)
  const limitKb = (r.limit / KB).toFixed(0)
  const over = r.size > r.limit
  if (over) violations.push(`${r.file}: ${sizeKb} KB > ${limitKb} KB`)
  console.log(
    `  ${r.file.padEnd(26)} ${(sizeKb + ' KB').padEnd(12)} ≤ ${limitKb} KB    ${over ? '✖' : '✓'}`,
  )
}

if (violations.length > 0) {
  console.error('\n✖ Byudjetdan oshgan fayllar:')
  for (const v of violations) console.error(`  · ${v}`)
  process.exit(1)
}

console.log('\n✓ Barcha rasmlar limitlar ichida.\n')
