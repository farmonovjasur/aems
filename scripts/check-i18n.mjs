#!/usr/bin/env node
/**
 * F2.5 — i18n kalit parity tekshiruvi (§9.7).
 * Manba: src/i18n/locales/en.json. Qolgan 3 til 100% mos bo'lishi shart.
 *
 * Ishlatish: npm run check:i18n
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = join(process.cwd(), 'src', 'i18n', 'locales')
const SOURCE = 'en'
const TARGETS = ['uz', 'ru', 'hi']

function flattenKeys(value, prefix = '', out = []) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) {
      flattenKeys(child, prefix ? `${prefix}.${key}` : key, out)
    }
  } else {
    out.push(prefix)
  }
  return out
}

function load(lang) {
  const file = join(DIR, `${lang}.json`)
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    console.error(`✖ ${lang}.json o'qilmadi: ${error.message}`)
    process.exit(1)
  }
}

const sourceKeys = new Set(flattenKeys(load(SOURCE)))
let failed = false

console.log(`\n  i18n parity — manba: ${SOURCE}.json (${sourceKeys.size} kalit)`)

for (const lang of TARGETS) {
  const keys = new Set(flattenKeys(load(lang)))
  const missing = [...sourceKeys].filter((k) => !keys.has(k))
  const extra = [...keys].filter((k) => !sourceKeys.has(k))

  if (missing.length === 0 && extra.length === 0) {
    console.log(`  ✓ ${lang}.json — parity OK (${keys.size} kalit)`)
    continue
  }

  failed = true
  console.error(`  ✖ ${lang}.json — parity buzilgan:`)
  for (const k of missing) console.error(`      yetishmaydi: ${k}`)
  for (const k of extra) console.error(`      ortiqcha:    ${k}`)
}

if (failed) {
  console.error('\n✖ i18n parity xatosi.\n')
  process.exit(1)
}

console.log('\n✓ Barcha tillar parityda.\n')
