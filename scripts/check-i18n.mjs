#!/usr/bin/env node
/**
 * F2.5 — i18n kalit parity tekshiruvi (§9.7).
 * Manba: src/i18n/locales/en.json. Qolgan 4 til 100% mos bo'lishi shart.
 *
 * Ishlatish: npm run check:i18n
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = join(process.cwd(), 'src', 'i18n', 'locales')
const SOURCE = 'en'
const TARGETS = ['uz', 'ru', 'hi', 'ar']

function flatten(value, prefix = '', out = new Map()) {
  if (Array.isArray(value)) {
    out.set(prefix, { kind: 'array', length: value.length })
    value.forEach((child, index) => flatten(child, `${prefix}[${index}]`, out))
  } else if (value !== null && typeof value === 'object') {
    out.set(prefix, { kind: 'object' })
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out)
    }
  } else {
    out.set(prefix, { kind: typeof value, value })
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

const source = flatten(load(SOURCE))
let failed = false

console.log(`\n  i18n parity — manba: ${SOURCE}.json (${source.size} kalit)`)

for (const lang of TARGETS) {
  const target = flatten(load(lang))
  const missing = [...source.keys()].filter((key) => !target.has(key))
  const extra = [...target.keys()].filter((key) => !source.has(key))
  const mismatched = []
  const empty = []

  for (const [key, sourceValue] of source) {
    const targetValue = target.get(key)
    if (!targetValue) continue

    if (sourceValue.kind !== targetValue.kind) {
      mismatched.push(`${key}: ${sourceValue.kind} → ${targetValue.kind}`)
      continue
    }

    if (sourceValue.kind === 'array' && sourceValue.length !== targetValue.length) {
      mismatched.push(`${key}: array ${sourceValue.length} → ${targetValue.length}`)
    }

    if (sourceValue.kind === 'string') {
      if (!targetValue.value.trim()) empty.push(key)
      const sourceVars = new Set(sourceValue.value.match(/{{\s*[\w.]+[^}]*}}/g) ?? [])
      const targetVars = new Set(targetValue.value.match(/{{\s*[\w.]+[^}]*}}/g) ?? [])
      const varDiff = [...sourceVars].filter((v) => !targetVars.has(v))
      if (varDiff.length > 0) mismatched.push(`${key}: interpolatsiya ${varDiff.join(', ')}`)
    }
  }

  if (missing.length === 0 && extra.length === 0 && mismatched.length === 0 && empty.length === 0) {
    console.log(`  ✓ ${lang}.json — parity OK (${target.size} kalit)`)
    continue
  }

  failed = true
  console.error(`  ✖ ${lang}.json — parity buzilgan:`)
  for (const k of missing) console.error(`      yetishmaydi: ${k}`)
  for (const k of extra) console.error(`      ortiqcha:    ${k}`)
  for (const m of mismatched) console.error(`      mos emas:    ${m}`)
  for (const e of empty) console.error(`      bo'sh:       ${e}`)
}

if (failed) {
  console.error('\n✖ i18n parity xatosi.\n')
  process.exit(1)
}

console.log('\n✓ Barcha tillar parityda.\n')
