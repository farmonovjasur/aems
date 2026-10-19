/*
 * F9.7 — Registration forma → Google Apps Script → Telegram bot (PLAN.md §9.5).
 *
 * §9.5 qoidalari:
 *   Q1 · `Content-Type: application/json` YO'Q — `FormData` bilan oddiy so'rov,
 *        preflight umuman bo'lmaydi (Apps Script `OPTIONS` ga javob bermaydi).
 *   Q3 · Bot token va Chat ID frontend'da YO'Q — ular `Code.gs` `ScriptProperties` da.
 *
 * Q2 (asosiy qoida) — DANI O'ZGARTIRILDI (sahifaviy talab: "xabar botga bormasa,
 * xato xabari ham ko'rsatilsin"). Plan `mode: 'no-cors'` + "yuborilgan deb
 * hisoblanadi" strategiyasini ko'rsatgan edi. Lekin `/exec` javobini cross-origin
 * O'QISH MUMKIN (brauzerda tekshirilgan: `{"success":true,…}` o'qiladi), shuning uchun
 * endi javob tekshiriladi va server xatoli foydalanuvchiga ko'rsatiladi.
 *
 *   · Telegram'ga borib boramasligi mumkin bo'lgan holatlar:
 *       no-endpoint — `VITE_APPS_SCRIPT_URL` yo'q (lokal dev)
 *       server      — `{"success":false,…}` (config/telegram xatosi)
 *       network     — offline / timeout / CORS bloklash
 *       too-fast    — `t_ms` filtri (bot) — bir marta kutib qayta yuboriladi
 *   · Token va Chat ID hech qachon shu faylda emas.
 *
 * Qo'shimcha himoya (F9.4): honeypot `website` (klient + serverda) va `t_ms`.
 */

export type LeadPayload = {
  name: string
  country: string
  service: string
  email: string
  gender?: string
  message?: string
  /** Qaysi forma — Telegram xabarida `Manba` qatori. */
  source?: string
  /** Honeypot: bot to'ldirsa so'rov umuman yuborilmaydi. */
  honeypot?: string
  /** Shakl ochilganidan boshlagan vaqt (ms) — `t_ms`. */
  elapsedMs?: number
}

/** `status: 'failed'` — nima uchun foydalanuvchiga xato ko'rsatish kerak. */
export type LeadFailure = 'no-endpoint' | 'server' | 'network' | 'too-fast' | 'honeypot'

/**
 * `status` — string discriminant (boolean literal bo'lar edi: `strict` yoq loyihada
 * TS narrowing ishlamaydi).
 */
export type LeadResult = { status: 'delivered' } | { status: 'failed'; reason: LeadFailure }

/**
 * Kutish vaqti. Apps Script "cold start" (ayniqsa yangi deployment'dan keyingi birinchi
 * so'rov) 10–20 s gacha cho'zilishi mumkin — 8 s da haqiqiy xato "network" deb ko'rinib,
 * foydalanuvchiga xato xabari ko'rsatilardi. Shu sabab 15 s.
 */
const TIMEOUT_MS = 15000
const MIN_ELAPSED_MS = 3000

/** Server javobi (Code.gs) — `success`/`skipped` maydonlari. */
type ScriptResponse = { success?: boolean; skipped?: string }

function appsScriptUrl(): string {
  const env = import.meta.env as unknown as Record<string, string | undefined>
  return env.VITE_APPS_SCRIPT_URL?.trim() ?? ''
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** `AbortSignal.timeout` eski brauzerlarda yo'q — o'zimiz controller quramiz. */
function withTimeout(): { signal: AbortSignal; done: () => void } {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  return { signal: controller.signal, done: () => clearTimeout(timer) }
}

function buildBody(payload: LeadPayload, elapsedMs: number): FormData {
  const body = new FormData()
  body.append('name', payload.name)
  body.append('country', payload.country)
  body.append('service', payload.service)
  body.append('email', payload.email)
  body.append('gender', payload.gender ?? '')
  body.append('message', payload.message ?? '')
  body.append('source', payload.source ?? 'registration')
  body.append('t_ms', String(Math.round(elapsedMs)))
  // Honeypot serverga ham yuboriladi — `Code.gs` da `website` bo'yicha ikkinchi filtr.
  body.append('website', payload.honeypot ?? '')
  return body
}

/** Bitta urinish natijasi — `skipped` server filtrini ishga tushirganini bildiradi. */
type Attempt =
  | { status: 'ok' }
  | { status: 'skipped'; reason: 'honeypot' | 'too-fast' }
  | { status: 'failed'; reason: 'server' | 'network' }

async function post(url: string, payload: LeadPayload, elapsedMs: number): Promise<Attempt> {
  const { signal, done } = withTimeout()
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: buildBody(payload, elapsedMs),
      signal,
    })

    const data = (await response.json().catch(() => null)) as ScriptResponse | null
    // Javob JSON emas (HTML xato sahifasi) — script deploy qilinmagan yoki `doPost` yo'q.
    if (!data || typeof data !== 'object') return { status: 'failed', reason: 'server' }
    if (data.skipped === 'honeypot') return { status: 'skipped', reason: 'honeypot' }
    if (data.skipped === 'too-fast') return { status: 'skipped', reason: 'too-fast' }
    if (data.success === true) return { status: 'ok' }
    // `{"success":false,…}` — ScriptProperties yoki Telegram xatosi (Code.gs logida).
    return { status: 'failed', reason: 'server' }
  } catch {
    // Offline / timeout / CORS bloklash — javob umuman kelmadi.
    return { status: 'failed', reason: 'network' }
  } finally {
    done()
  }
}

export async function sendLead(payload: LeadPayload): Promise<LeadResult> {
  if (payload.honeypot?.trim()) return { status: 'failed', reason: 'honeypot' }

  const url = appsScriptUrl()
  if (!url) {
    if (import.meta.env.DEV) {
      console.warn("[AEM] VITE_APPS_SCRIPT_URL yo'q — so'rov yuborilmadi (faqat lokal).")
    }
    return { status: 'failed', reason: 'no-endpoint' }
  }

  const elapsed = payload.elapsedMs ?? 0
  let attempt = await post(url, payload, elapsed)

  // `t_ms` filtri: real foydalanuvchi autofill bilan 3 s dan tez yubora oladi.
  // Bu holamda kutib, haqiqiy o'tgan vaqt bilan bitta marta qayta yuboramiz.
  if (attempt.status === 'skipped' && attempt.reason === 'too-fast') {
    const wait = Math.max(0, MIN_ELAPSED_MS - elapsed + 250)
    await sleep(wait)
    attempt = await post(url, payload, elapsed + wait)
  }

  switch (attempt.status) {
    case 'ok':
      return { status: 'delivered' }
    case 'skipped':
      return { status: 'failed', reason: attempt.reason }
    case 'failed':
      return { status: 'failed', reason: attempt.reason }
  }
}
