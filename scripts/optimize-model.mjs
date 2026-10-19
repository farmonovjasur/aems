#!/usr/bin/env node
/**
 * F1.5–F1.6 — Cytotron GLB optimizatsiyasi (PLAN.md §7, H1, R3).
 *
 * Kirish:  3d_models/cytotron_technical_cad_package/cytotron_technical_cad.glb
 * Chiqish: public/models/cytotron.glb     (Draco, ~70k tri)
 *          public/models/cytotron-lod.glb (Draco, ~15k tri)
 *
 * Bosqichlar: weld → material merge (16→6) → join → simplify → draco.
 * Ishlatish: npm run optimize:model
 */
import { mkdirSync, statSync } from 'node:fs'
import { dirname, join as joinPath } from 'node:path'
import { fileURLToPath } from 'node:url'
import { NodeIO } from '@gltf-transform/core'
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions'
import { cloneDocument, draco, join, simplify, weld } from '@gltf-transform/functions'
import draco3d from 'draco3dgltf'
import { MeshoptSimplifier } from 'meshoptimizer'

const ROOT = joinPath(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = joinPath(
  ROOT,
  '3d_models',
  'cytotron_technical_cad_package',
  'cytotron_technical_cad.glb',
)
const OUT_DIR = joinPath(ROOT, 'public', 'models')

const KB = 1024
const MB = 1024 * 1024

/* Byudjet (§6.3 HARD LIMITS + §7) */
const LIMITS = {
  triMain: 150_000,
  triLod: 20_000,
  materials: 6,
  sizeMain: 1.5 * MB, // maqsad 1.2 MB, qattiq chegara 1.5 MB
  sizeLod: 250 * KB, // maqsad 200 KB
  sizeMainTarget: 1.2 * MB,
  sizeLodTarget: 200 * KB,
}

/*
 * Material merge: 16 → 6 (HARD LIMIT).
 * Guruhlar vizual rol bo'yicha — F8 da sahna yorug'liklari ostida izchil ko'rinadi.
 */
const MATERIAL_GROUPS = {
  shell: ['ivory', 'ivory_shadow', 'ivory_light'],
  metal_light: ['steel_light', 'aluminium'],
  metal_dark: ['steel_dark'],
  dark: ['inner_black', 'rubber', 'pad', 'label'],
  glass: ['screen', 'film'],
  accent: ['yellow', 'green', 'red', 'blue'],
}

function countTriangles(document) {
  let tris = 0
  for (const mesh of document.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const indices = prim.getIndices()
      tris += indices ? indices.getCount() / 3 : prim.getAttribute('POSITION').getCount() / 3
    }
  }
  return Math.round(tris)
}

function countMaterials(document) {
  return document.getRoot().listMaterials().length
}

function mergeMaterials(document) {
  const byName = new Map(
    document
      .getRoot()
      .listMaterials()
      .map((m) => [m.getName(), m]),
  )
  const remap = new Map()

  for (const [bucket, names] of Object.entries(MATERIAL_GROUPS)) {
    const members = names.map((n) => byName.get(n)).filter(Boolean)
    if (members.length === 0) continue

    const target = members[0]
    target.setName(bucket)

    const avg = (get) => members.reduce((sum, m) => sum + get(m), 0) / members.length
    const colors = members.map((m) => m.getBaseColorFactor())

    target.setBaseColorFactor([
      colors.reduce((s, c) => s + c[0], 0) / colors.length,
      colors.reduce((s, c) => s + c[1], 0) / colors.length,
      colors.reduce((s, c) => s + c[2], 0) / colors.length,
      1,
    ])
    target.setMetallicFactor(avg((m) => m.getMetallicFactor()))
    target.setRoughnessFactor(avg((m) => m.getRoughnessFactor()))

    for (const member of members) remap.set(member, target)
  }

  for (const mesh of document.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const src = prim.getMaterial()
      if (!src) continue
      const dst = remap.get(src)
      if (dst && dst !== src) prim.setMaterial(dst)
    }
  }

  const used = new Set()
  for (const mesh of document.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const m = prim.getMaterial()
      if (m) used.add(m)
    }
  }
  for (const material of document.getRoot().listMaterials()) {
    if (!used.has(material)) material.dispose()
  }
}

const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS).registerDependencies({
  'draco3d.encoder': await draco3d.createEncoderModule(),
  'draco3d.decoder': await draco3d.createDecoderModule(),
})

mkdirSync(OUT_DIR, { recursive: true })

console.log('\n  Cytotron GLB optimizatsiyasi')
console.log('  ' + '-'.repeat(58))

const doc = await io.read(SRC)
const before = { tris: countTriangles(doc), materials: countMaterials(doc) }
console.log(`  Kirish:  ${before.tris.toLocaleString('en')} tri · ${before.materials} material`)

await doc.transform(weld({ tolerance: 0.0001 }), simplifierPass(0.43, 0.001))

try {
  await doc.transform(join({ keepNamed: false }))
} catch (error) {
  console.warn(`  ⚠ join() o'tkazib yuborildi: ${error.message}`)
}

mergeMaterials(doc)

const mainTris = countTriangles(doc)
const mainMats = countMaterials(doc)
console.log(`  Asosiy:  ${mainTris.toLocaleString('en')} tri · ${mainMats} material`)

const lod = cloneDocument(doc)
await lod.transform(simplifierPass(0.21, 0.002))
const lodTris = countTriangles(lod)
console.log(`  LOD:     ${lodTris.toLocaleString('en')} tri`)

await doc.transform(draco())
await lod.transform(draco())

const mainPath = joinPath(OUT_DIR, 'cytotron.glb')
const lodPath = joinPath(OUT_DIR, 'cytotron-lod.glb')
await io.write(mainPath, doc)
await io.write(lodPath, lod)

const mainSize = statSync(mainPath).size
const lodSize = statSync(lodPath).size

console.log('  ' + '-'.repeat(58))
console.log(
  `  cytotron.glb      ${(mainSize / KB).toFixed(0)} KB  (maqsad ≤ ${LIMITS.sizeMainTarget / KB} KB)`,
)
console.log(
  `  cytotron-lod.glb  ${(lodSize / KB).toFixed(0)} KB  (maqsad ≤ ${LIMITS.sizeLodTarget / KB} KB)`,
)
console.log('  ' + '-'.repeat(58))

const violations = []
if (mainTris > LIMITS.triMain) violations.push(`tri ${mainTris} > ${LIMITS.triMain}`)
if (lodTris > LIMITS.triLod) violations.push(`LOD tri ${lodTris} > ${LIMITS.triLod}`)
if (mainMats > LIMITS.materials) violations.push(`material ${mainMats} > ${LIMITS.materials}`)
if (mainSize > LIMITS.sizeMain)
  violations.push(`hajm ${(mainSize / MB).toFixed(2)} MB > ${LIMITS.sizeMain / MB} MB`)
if (lodSize > LIMITS.sizeLod)
  violations.push(`LOD hajm ${(lodSize / KB).toFixed(0)} KB > ${LIMITS.sizeLod / KB} KB`)

if (violations.length > 0) {
  console.error('\n✖ Byudjet buzilgan:')
  for (const v of violations) console.error(`  · ${v}`)
  process.exit(1)
}

const notes = []
if (mainSize > LIMITS.sizeMainTarget)
  notes.push('asosiy model maqsaddan katta (qattiq limit ichida)')
if (lodSize > LIMITS.sizeLodTarget) notes.push('LOD maqsaddan katta (qattiq limit ichida)')
if (notes.length > 0) console.log(`\n  ℹ ${notes.join(' · ')}`)

console.log('\n✓ Model byudjet ichida.\n')

/* ---- helpers ---- */

function simplifierPass(ratio, error) {
  return simplify({ simplifier: MeshoptSimplifier, ratio, error })
}
