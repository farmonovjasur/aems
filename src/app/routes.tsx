import type { Locale } from '../i18n/languages'

/*
 * F2.3 — i18n routing (§9.7): /, /uz/, /ru/, /hi/ + catch-all → en.
 */
export const LOCALE_ROUTES = {
  en: '/',
  uz: '/uz/',
  ru: '/ru/',
  hi: '/hi/',
} satisfies Record<Locale, string>

export const DEFAULT_ROUTE = '/'
