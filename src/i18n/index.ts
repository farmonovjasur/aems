/*
 * F2.2 — i18next init (§9.7).
 * Yagona manba: locales/en.json · fallbackLng: 'en' · returnNull: false.
 */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import hi from './locales/hi.json'
import ru from './locales/ru.json'
import uz from './locales/uz.json'
import { DEFAULT_LOCALE, LANGUAGES, type Locale } from './languages'

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const segment = window.location.pathname.split('/').filter(Boolean)[0]
  return LANGUAGES.includes(segment as Locale) ? (segment as Locale) : DEFAULT_LOCALE
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    uz: { translation: uz },
    ru: { translation: ru },
    hi: { translation: hi },
  },
  lng: detectLocale(),
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: LANGUAGES,
  returnNull: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export { i18n }
export { DEFAULT_LOCALE, LANGUAGES, LOCALE_LABELS } from './languages'
export type { Locale } from './languages'
