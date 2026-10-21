export const LANGUAGES = ['en', 'uz', 'ru', 'hi', 'ar'] as const

export type Locale = (typeof LANGUAGES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English (EN)',
  uz: "O'zbek (UZ)",
  ru: 'Русский (RU)',
  hi: 'हिन्दी (IN)',
  ar: 'العربية (AR)',
}

export const LOCALE_DIR = {
  en: 'ltr',
  uz: 'ltr',
  ru: 'ltr',
  hi: 'ltr',
  ar: 'rtl',
} as const satisfies Record<Locale, 'ltr' | 'rtl'>

export function isRtlLocale(locale: Locale): boolean {
  return LOCALE_DIR[locale] === 'rtl'
}
