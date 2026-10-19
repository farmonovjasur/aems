import type { Locale } from '../i18n/languages'

/*
 * Registration · "Choose service" variantlari (PLAN.md §9.2 — `lib/services.ts`).
 * Manba — design.pen `FSO4v` konteksti: 6 ta variant, cancer treatment uchta
 * alohida qator (targeted / cytotron / radiation).
 *
 * `value` — Telegram'ga yuboriladigan barqaror kod, `names` — ko'rsatilgan matn.
 */

export type Service = {
  value: string
  names: Record<Locale, string>
}

export const SERVICES: Service[] = [
  {
    value: 'cancer-targeted',
    names: {
      en: 'Cancer treatment — Targeted therapy',
      uz: 'Sarob davolash — maqsadli terapiya',
      ru: 'Лечение рака — таргетная терапия',
      hi: 'कैंसर उपचार — लक्षित चिकित्सा',
    },
  },
  {
    value: 'cancer-cytotron',
    names: {
      en: 'Cancer treatment — Cytotron',
      uz: 'Sarob davolash — Cytotron',
      ru: 'Лечение рака — Цитотрон',
      hi: 'कैंसर उपचार — साइटोट्रॉन',
    },
  },
  {
    value: 'cancer-radiation',
    names: {
      en: 'Cancer treatment — Radiation therapy',
      uz: 'Sarob davolash — radioterapiya',
      ru: 'Лечение рака — лучевая терапия',
      hi: 'कैंसर उपचार — विकिरण चिकित्सा',
    },
  },
  {
    value: 'mbbs-admission',
    names: {
      en: 'MBBS admission',
      uz: 'MBBS qabul',
      ru: 'Поступление на MBBS',
      hi: 'MBBS प्रवेश',
    },
  },
  {
    value: 'affiliate-marketing',
    names: {
      en: 'Affiliate marketing',
      uz: 'Affiliate marketing',
      ru: 'Affiliate-маркетинг',
      hi: 'Affiliate मार्केटिंग',
    },
  },
  {
    value: 'refer-earn',
    names: {
      en: 'Refer & Earn',
      uz: 'Taklif qiling va yarating',
      ru: 'Приведите друга',
      hi: 'Refer & Earn',
    },
  },
]

export function serviceName(value: string, locale: Locale): string {
  return SERVICES.find((service) => service.value === value)?.names[locale] ?? value
}
