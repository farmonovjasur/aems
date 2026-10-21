import type { Locale } from '../i18n/languages'

/*
 * Registration · "Choose service" variantlari (PLAN.md §9.2 — `lib/services.ts`).
 * Xizmatlar uchta guruhga bo'linadi: tibbiy xizmatlar, ta'lim va biznes.
 * `value` — Telegram'ga yuboriladigan barqaror kod, `names` — ko'rsatilgan matn.
 */

export type ServiceGroup = 'health' | 'education' | 'business'

export type Service = {
  value: string
  group: ServiceGroup
  names: Record<Locale, string>
}

export const SERVICE_GROUPS: ServiceGroup[] = ['health', 'education', 'business']

export const SERVICES: Service[] = [
  {
    value: 'medical-general',
    group: 'health',
    names: {
      en: 'General medical consultation',
      uz: 'Umumiy tibbiy konsultatsiya',
      ru: 'Общая медицинская консультация',
      hi: 'सामान्य चिकित्सा परामर्श',
    },
  },
  {
    value: 'medical-cardiology',
    group: 'health',
    names: {
      en: 'Medical treatment — Cardiology',
      uz: 'Tibbiy davolash — Kardiologiya',
      ru: 'Медицинское лечение — Кардиология',
      hi: 'चिकित्सा उपचार — कार्डियोलॉजी',
    },
  },
  {
    value: 'medical-orthopedics',
    group: 'health',
    names: {
      en: 'Medical treatment — Orthopedics',
      uz: 'Tibbiy davolash — Ortopediya',
      ru: 'Медицинское лечение — Ортопедия',
      hi: 'चिकित्सा उपचार — ऑर्थोपेडिक्स',
    },
  },
  {
    value: 'medical-neurology',
    group: 'health',
    names: {
      en: 'Medical treatment — Neurology / neurosurgery',
      uz: 'Tibbiy davolash — Nevrologiya / neyroxirurgiya',
      ru: 'Медицинское лечение — Неврология / нейрохирургия',
      hi: 'चिकित्सा उपचार — न्यूरोलॉजी / न्यूरोसर्जरी',
    },
  },
  {
    value: 'medical-transplant',
    group: 'health',
    names: {
      en: 'Medical treatment — Transplant',
      uz: 'Tibbiy davolash — Transplantatsiya',
      ru: 'Медицинское лечение — Трансплантация',
      hi: 'चिकित्सा उपचार — ट्रांसप्लांट',
    },
  },
  {
    value: 'medical-diagnostics',
    group: 'health',
    names: {
      en: 'Medical diagnostics & health checkup',
      uz: 'Tibbiy tashxis va check-up',
      ru: 'Медицинская диагностика и чек-ап',
      hi: 'चिकित्सा निदान और स्वास्थ्य जांच',
    },
  },
  {
    value: 'medical-second-opinion',
    group: 'health',
    names: {
      en: 'Medical second opinion',
      uz: 'Ikkinchi tibbiy fikr',
      ru: 'Второе медицинское мнение',
      hi: 'दूसरी चिकित्सा राय',
    },
  },
  {
    value: 'cancer-targeted',
    group: 'health',
    names: {
      en: 'Cancer treatment — Targeted therapy',
      uz: 'Saraton davolash — maqsadli terapiya',
      ru: 'Лечение рака — таргетная терапия',
      hi: 'कैंसर उपचार — लक्षित चिकित्सा',
    },
  },
  {
    value: 'cancer-cytotron',
    group: 'health',
    names: {
      en: 'Cancer treatment — Cytotron',
      uz: 'Saraton davolash — Cytotron',
      ru: 'Лечение рака — Цитотрон',
      hi: 'कैंसर उपचार — साइटोट्रॉन',
    },
  },
  {
    value: 'cancer-radiation',
    group: 'health',
    names: {
      en: 'Cancer treatment — Radiation therapy',
      uz: 'Saraton davolash — radioterapiya',
      ru: 'Лечение рака — лучевая терапия',
      hi: 'कैंसर उपचार — विकिरण चिकित्सा',
    },
  },
  {
    value: 'medical-other',
    group: 'health',
    names: {
      en: 'Other medical service',
      uz: 'Boshqa tibbiy xizmat',
      ru: 'Другая медицинская услуга',
      hi: 'अन्य चिकित्सा सेवा',
    },
  },
  {
    value: 'mbbs-admission',
    group: 'education',
    names: {
      en: 'MBBS admission — universities in Uzbekistan',
      uz: "MBBS qabul — O'zbekiston universitetlari",
      ru: 'Поступление на MBBS — университеты Узбекистана',
      hi: 'MBBS प्रवेश — उज़्बेकिस्तान के विश्वविद्यालय',
    },
  },
  {
    value: 'affiliate-marketing',
    group: 'business',
    names: {
      en: 'Affiliate marketing',
      uz: 'Affiliate marketing',
      ru: 'Affiliate-маркетинг',
      hi: 'Affiliate मार्केटिंग',
    },
  },
  {
    value: 'refer-earn',
    group: 'business',
    names: {
      en: 'Refer & Earn',
      uz: 'Taklif qiling va daromad oling',
      ru: 'Приведите друга',
      hi: 'Refer & Earn',
    },
  },
]

export function serviceName(value: string, locale: Locale): string {
  return SERVICES.find((service) => service.value === value)?.names[locale] ?? value
}
