import { i18n } from './index'
import { DEFAULT_LOCALE, LOCALE_DIR, type Locale } from './languages'

/* F2.6 — <html lang/dir> + title/meta'ni joriy locale bilan sinxronlaydi. */
function applyLocale(locale: Locale) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.lang = locale
  root.dir = LOCALE_DIR[locale]

  const title = i18n.t('meta.title', { lng: locale })
  const description = i18n.t('meta.description', { lng: locale })

  if (title && title !== 'meta.title') document.title = title
  if (description && description !== 'meta.description') {
    const meta = document.querySelector('meta[name="description"]')
    meta?.setAttribute('content', description)
  }
}

export function applyLocaleToDocument(locale: Locale) {
  applyLocale(locale)
}

/** Birinchi render'dan oldin chaqiriladi — lang/dir flash'ini yo'q qiladi. */
export function syncDocumentLocale() {
  const current = i18n.resolvedLanguage ?? i18n.language
  const locale = (current ?? DEFAULT_LOCALE) as Locale
  applyLocale(locale)
}
