export const LANGUAGES = ['en', 'uz', 'ru', 'hi'] as const

export type Locale = (typeof LANGUAGES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English (EN)',
  uz: "O'zbek (UZ)",
  ru: 'Русский (RU)',
  hi: 'हिन्दी (HI)',
}
