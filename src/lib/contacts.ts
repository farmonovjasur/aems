/*
 * F5 — kontakt ma'lumotlari (yagona manba, PLAN.md §3.13/§3.14).
 * F5.10: faqat haqiqiy URL'lar — dead link yo'q.
 * Instagram/YouTube sahifa URL'lari hali tasdiqlanmagan — kelgach SOCIAL_LINKS ga qo'shiladi.
 */
export const CONTACT = {
  whatsapp: 'https://wa.me/998936566889',
  telegram: 'https://t.me/amigosenmundo',
  email: 'amigosenmundo.med@gmail.com',
  phoneUz: '+998936566889',
  phoneUzDisplay: '+998 93 656 68 89',
  phoneIndia: '+919113961963',
  phoneIndiaDisplay: '+91 91139 61963',
} as const

export type SocialKey = 'telegram' | 'whatsapp'

/* Tartib dizayndagidek: Instagram, Telegram, YouTube, WhatsApp — hozircha faqat tasdiqlanganlari. */
export const SOCIAL_LINKS: { key: SocialKey; href: string }[] = [
  { key: 'telegram', href: CONTACT.telegram },
  { key: 'whatsapp', href: CONTACT.whatsapp },
]
