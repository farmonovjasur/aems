import type { Locale } from '../i18n/languages'
import { DEFAULT_LOCALE, LANGUAGES } from '../i18n/languages'

/*
 * Registration · Country select manbai (PLAN.md §9.2 — `lib/countries.ts`).
 *
 * Ro'yxat qisqa: AEM amaliyotidagi asosiy yo'nalishlar — O'zbekiston, Hindiston,
 * Markaziy/Ostoniy Osiyo, Janubiy-Sharqiy Osiyo va eng ko'p so'raladigan davlatlar.
 * To'liq ISO-3166 ro'yxati kerak bo'lsa shu faylga qo'shiladi.
 *
 * Nomi 4 tilda shu yerda (i18n JSON'ga solingan) — 250+ davlat × 4 til kalit
 * parity tekshiruvini (F2.5) shovtiradi va `services.ts` bilan bir xil usul.
 */

export type Country = {
  /** ISO 3166-1 alpha-2 — select qiymati va Telegram yuborish uchun. */
  code: string
  names: Record<Locale, string>
}

export const COUNTRIES: Country[] = [
  {
    code: 'UZ',
    names: {
      en: 'Uzbekistan',
      uz: "O'zbekiston",
      ru: 'Узбекистан',
      hi: 'उज़्बेकिस्तान',
    },
  },
  {
    code: 'IN',
    names: { en: 'India', uz: 'Hindiston', ru: 'Индия', hi: 'भारत' },
  },
  {
    code: 'TJ',
    names: { en: 'Tajikistan', uz: 'Tojikiston', ru: 'Таджикистан', hi: 'ताजिकिस्तान' },
  },
  {
    code: 'KG',
    names: { en: 'Kyrgyzstan', uz: "Qirg'iziston", ru: 'Кыргызстан', hi: 'किर्गिज़स्तान' },
  },
  {
    code: 'AF',
    names: { en: 'Afghanistan', uz: "Afg'oniston", ru: 'Афганистан', hi: 'अफ़ग़ानिस्तान' },
  },
  {
    code: 'TM',
    names: { en: 'Turkmenistan', uz: 'Turkmaniston', ru: 'Туркменистан', hi: 'तुर्कमेनिस्तान' },
  },
  {
    code: 'KZ',
    names: { en: 'Kazakhstan', uz: "Qozog'iston", ru: 'Казахстан', hi: 'कज़ाख़िस्तान' },
  },
  {
    code: 'PK',
    names: { en: 'Pakistan', uz: 'Pokiston', ru: 'Пакистан', hi: 'पाकिस्तान' },
  },
  {
    code: 'BD',
    names: { en: 'Bangladesh', uz: 'Bangladesh', ru: 'Бангладеш', hi: 'बांग्लादेश' },
  },
  {
    code: 'RU',
    names: { en: 'Russia', uz: 'Rossiya', ru: 'Россия', hi: 'रूस' },
  },
  {
    code: 'CN',
    names: { en: 'China', uz: 'Xitoy', ru: 'Китай', hi: 'चीन' },
  },
  {
    code: 'IR',
    names: { en: 'Iran', uz: 'Eron', ru: 'Иран', hi: 'ईरान' },
  },
  {
    code: 'SA',
    names: {
      en: 'Saudi Arabia',
      uz: 'Saudiya Arabiston',
      ru: 'Саудовская Аравия',
      hi: 'सऊदी अरब',
    },
  },
  {
    code: 'AE',
    names: {
      en: 'United Arab Emirates',
      uz: 'Birlashgan Amirliklar',
      ru: 'ОАЭ',
      hi: 'संयुक्त अरब अमीरात',
    },
  },
  {
    code: 'TR',
    names: { en: 'Türkiye', uz: 'Turkiya', ru: 'Турция', hi: 'तुर्की' },
  },
  {
    code: 'US',
    names: {
      en: 'United States',
      uz: "Amerika Qo'shlashtirilgan Davlatlari",
      ru: 'США',
      hi: 'संयुक्त राज्य अमेरिका',
    },
  },
  {
    code: 'GB',
    names: {
      en: 'United Kingdom',
      uz: 'Buyuk Britaniya',
      ru: 'Великобритания',
      hi: 'यूनाइटेड किंगडम',
    },
  },
  {
    code: 'DE',
    names: { en: 'Germany', uz: 'Germaniya', ru: 'Германия', hi: 'जर्मनी' },
  },
  {
    code: 'FR',
    names: { en: 'France', uz: 'Frantsiya', ru: 'Франция', hi: 'फ़्रांस' },
  },
  {
    code: 'IT',
    names: { en: 'Italy', uz: 'Italiya', ru: 'Италия', hi: 'इटली' },
  },
  {
    code: 'ID',
    names: { en: 'Indonesia', uz: 'Indoneziya', ru: 'Индонезия', hi: 'इंडोनेशिया' },
  },
  {
    code: 'MY',
    names: { en: 'Malaysia', uz: 'Malayziya', ru: 'Малайзия', hi: 'मलेशिया' },
  },
  {
    code: 'EG',
    names: { en: 'Egypt', uz: 'Misr', ru: 'Египет', hi: 'मिस्र' },
  },
  {
    code: 'NG',
    names: { en: 'Nigeria', uz: 'Nigariya', ru: 'Нигерия', hi: 'नाइजीरिया' },
  },
  {
    code: 'CA',
    names: { en: 'Canada', uz: 'Kanada', ru: 'Канада', hi: 'कनाडा' },
  },
]

/** i18n.language (`uz-UZ`, `ru`, …) → `Locale`. Noma'lum til — `en`. */
export function toLocale(language: string | undefined): Locale {
  const short = (language ?? '').slice(0, 2).toLowerCase()
  return (LANGUAGES as readonly string[]).includes(short) ? (short as Locale) : DEFAULT_LOCALE
}

export function countryName(code: string, locale: Locale): string {
  return COUNTRIES.find((country) => country.code === code)?.names[locale] ?? code
}
