import type { ReactNode, SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import { CONTACT } from '../../lib/contacts'
import { FadeUp } from '../motion/FadeUp'
import { AuroraBackground } from '../ui/AuroraBackground'
import { Container } from '../ui/Container'
import {
  IconArrow,
  IconCalendar,
  IconMail,
  IconMapPin,
  IconMessageCircle,
  IconPhone,
  IconSend,
} from '../ui/icons'

/*
 * F6.13 — 09 · Contact (design.pen `JHQ4W` desktop 1440·636px · `kkbaV` mobil 390·789px).
 *
 * Desktop (`JHQ4W` · `ink-950` · padding 104/80 · gap 56):
 *   `Left` 664px (gap 24) + `Channels Stack` 560px (gap 12) = 1280 = `--container-page`.
 *   Left: eyebrow (mono 12/ls2 · `care-glow`) → H2 (① `Let's` 56/1.02 extrabold,
 *   ② gap 12 + `talk` Instrument Serif italic **58** `edu-500` + `it through.` 56) →
 *   sub (17/1.6 · `mid-dark` · 460px) → `Location & Hours` (pt 4 · gap 12 ·
 *   `map-pin`/`calendar` 16px `mid-dark` + matn 16).
 *   Kanal qatori: radius 16 · pad 16/18 · gap 14 · ring `white/8` (`#FFFFFF14`) ·
 *   fill `white/6` (`#FFFFFF0F`); `Icon` 20 · `Texts` (gap 3: Label 15/600,
 *   Value 14, India qatorida Note 13) · `Arrow` 16. WhatsApp qatori `whatsapp`
 *   to'ldiruvchi + `#062B14` matn (dizayn `BTOPL`). Balandliklar: 72 / 72 / 92 / 72 / 72.
 *
 * Mobil (`kkbaV` · padding 64/20 · gap 16): bitta ustun — H2 30px va aksent **serifsiz**
 * (`V9nuqt` — faqat `edu-500` rang; dizayn mobilni ataylab shunday soddalashtirgan),
 * qatorlar pad 14/16 · gap 12 · radius 16 · icon 18 · matn 15/14/13.
 * md (768) dan H2 56px + serif aksent, matn 17/16; lg (1024) dan 560px ustun.
 *
 * Motion (`Y8IYL` · Section map **qator 16**): "Rows (WhatsApp / Phone UZ / Phone India
 * / Email / Telegram) fade-up stagger on view" · reduced: "Fade in; no stagger".
 * Faqat 5 kanal qatori `FadeUp` oladi (0.6s · y 26 · stagger 0.06s); chap ustun
 * statik qoladi — Motion Notes boshqa effekt aytmaydi. #2 (so'z-mask) qo'llanmadi.
 *
 * Hover (statik freymda yo'q, §2 "interactions increase contrast" qoidasi bo'yicha):
 * qator fill `white/6 → white/12`, ring `8 → 25%`, arrow 2px o'ngga; WhatsApp qatori
 * → `--color-whatsapp-hover`. Faqat `transition-colors`/`transition-transform`
 * (transform + opacity §6 global qoidasi). Klient teginish holati tegilmaydi.
 *
 * Kontent manbai: `lib/contacts.ts` — **barcha** `href`lar u yerdan (F5.10: dead link 0).
 * Ko'rinadigan matn `t()` orqali (barcha 4 tilda mavjud); `whatsappValue` va
 * `whatsappNote` dizayndagi bitta qatorli satrni berish uchun ` · ` bilan
 * birlashtiriladi ("Chat on WhatsApp · Fastest reply 24h"). `contact.addressLabel`
 * dizaynda ishlatilmaydi — shuning uchun render qilinmaydi.
 *
 * A11y: har qator 66–72px (hit target ≥ 44 ✓), `Label` + `Value` matnlari
 * screen-reader uchun yetarli yorliq; tashqi linklar `rel="noopener noreferrer"`.
 */

type Tone = 'whatsapp' | 'glass'

type Channel = {
  key: string
  href: string
  external?: boolean
  Icon: (props: SVGProps<SVGSVGElement>) => ReactNode
  label: string
  value: string
  note?: string
  tone: Tone
}

/** Dizayn `#062B14` — `whatsapp` to'ldiruvchi ustidagi matn/ikon (button-styles bilan bir xil). */
const WHATSAPP_INK = 'text-[#062B14]'

function rowTone(tone: Tone) {
  return tone === 'whatsapp'
    ? 'bg-whatsapp ring-whatsapp hover:bg-whatsapp-hover'
    : 'bg-white/[0.06] ring-white/8 hover:bg-white/[0.12] hover:ring-white/25'
}

export function Contact() {
  const { t } = useTranslation()

  const channels: Channel[] = [
    {
      key: 'whatsapp',
      href: CONTACT.whatsapp,
      external: true,
      Icon: IconMessageCircle,
      label: t('contact.whatsappLabel'),
      value: `${t('contact.whatsappValue')} · ${t('contact.whatsappNote')}`,
      tone: 'whatsapp',
    },
    {
      key: 'phoneUz',
      href: `tel:${CONTACT.phoneUz}`,
      Icon: IconPhone,
      label: t('contact.phoneUzLabel'),
      value: t('contact.phoneUz'),
      tone: 'glass',
    },
    {
      key: 'phoneIndia',
      href: `tel:${CONTACT.phoneIndia}`,
      Icon: IconPhone,
      label: t('contact.phoneIndiaLabel'),
      value: t('contact.phoneIndia'),
      note: t('contact.phoneIndiaNote'),
      tone: 'glass',
    },
    {
      key: 'email',
      href: `mailto:${CONTACT.email}`,
      Icon: IconMail,
      label: t('contact.emailLabel'),
      value: CONTACT.email,
      tone: 'glass',
    },
    {
      key: 'telegram',
      href: CONTACT.telegram,
      external: true,
      Icon: IconSend,
      label: t('contact.telegramLabel'),
      value: t('contact.telegram'),
      tone: 'glass',
    },
  ]

  return (
    <section id="contacts" className="relative overflow-hidden bg-ink-950" data-testid="contact">
      <AuroraBackground variant="contact" />

      <Container className="relative flex flex-col gap-4 py-16 lg:flex-row lg:items-start lg:gap-14 lg:py-[104px]">
        {/* --- Chap ustun: eyebrow · H2 · sub · manzil/ish vaqti --- */}
        <div className="flex flex-col gap-4 md:gap-6 lg:flex-1">
          <p className="font-mono text-[11px] leading-[14px] tracking-[2px] text-care-glow uppercase md:text-xs md:leading-4">
            {t('contact.eyebrow')}
          </p>

          <h2 className="font-display text-[30px] leading-[1.2] font-extrabold tracking-tight text-balance text-hi-dark md:text-[56px] md:leading-[1.02]">
            {/* Mobil (`p60Kkb` + `Sp3c7`): "Let's talk" / "it through." — aksent serifsiz. */}
            <span className="block md:hidden">
              <span className="flex flex-wrap items-center gap-x-2">
                <span>{t('contact.titleLine1')}</span>
                <span className="text-edu-500">{t('contact.titleAccent')}</span>
              </span>
              <span className="block">{t('contact.titleLine2')}</span>
            </span>

            {/* Desktop (`qN2K5`): "Let's" / "talk it through." — aksent serif italic 58. */}
            <span className="hidden md:block">
              <span className="block">{t('contact.titleLine1')}</span>
              <span className="flex items-center gap-x-3">
                {/* `Skl2d` 75px: aksent shriftning o'z line-box'i (58 × 1.29), aniq qilingan. */}
                <em className="font-accent text-[58px] leading-[1.29] font-normal text-edu-500 italic">
                  {t('contact.titleAccent')}
                </em>
                <span>{t('contact.titleLine2')}</span>
              </span>
            </span>
          </h2>

          <p className="max-w-[460px] text-[15px] leading-[23px] text-mid-dark md:text-[17px] md:leading-[1.6]">
            {t('contact.body')}
          </p>

          <div className="flex flex-col gap-2.5 md:gap-3 md:pt-1">
            <p className="flex items-center gap-2.5 text-[15px] leading-[19px] text-hi-dark md:text-base md:leading-[21px]">
              <IconMapPin className="size-[18px] shrink-0 text-mid-dark md:size-4" />
              {t('contact.address')}
            </p>
            <p className="flex items-center gap-2.5 text-[15px] leading-[19px] text-mid-dark md:text-base md:leading-[21px]">
              <IconCalendar className="size-[18px] shrink-0 text-mid-dark md:size-4" />
              {t('contact.hours')}
            </p>
          </div>
        </div>

        {/* --- O'ng ustun: 5 kanal qatori (`FadeUp` stagger, motion map qator 16) --- */}
        <div className="flex max-w-[560px] flex-col gap-2.5 md:gap-3 lg:w-[560px] lg:shrink-0">
          {channels.map((channel, index) => {
            const ink = channel.tone === 'whatsapp' ? WHATSAPP_INK : 'text-hi-dark'
            const muted = channel.tone === 'whatsapp' ? WHATSAPP_INK : 'text-mid-dark'

            return (
              <FadeUp key={channel.key} index={index}>
                <a
                  href={channel.href}
                  {...(channel.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : undefined)}
                  data-testid={`contact-${channel.key.toLowerCase()}`}
                  className={`group/channel flex items-center gap-3 rounded-[16px] px-4 py-3.5 ring-1 ring-inset transition-colors ease-out-soft duration-(--duration-fast) md:gap-3.5 md:px-[18px] md:py-4 ${rowTone(channel.tone)}`}
                >
                  <channel.Icon
                    className={`size-[18px] shrink-0 md:size-5 ${channel.tone === 'whatsapp' ? WHATSAPP_INK : 'text-mid-dark md:text-hi-dark'}`}
                  />

                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 md:gap-[3px]">
                    <span className={`text-[15px] leading-[19px] font-semibold ${ink}`}>
                      {channel.label}
                    </span>
                    <span className={`text-[14px] leading-[18px] ${muted}`}>
                      {channel.key === 'email' ||
                      channel.key === 'telegram' ||
                      channel.key === 'phoneUz' ||
                      channel.key === 'phoneIndia' ? (
                        <bdi dir="ltr">{channel.value}</bdi>
                      ) : (
                        channel.value
                      )}
                    </span>
                    {channel.note ? (
                      <span className={`text-[13px] leading-[17px] ${muted}`}>{channel.note}</span>
                    ) : null}
                  </span>

                  <IconArrow
                    className={`size-4 shrink-0 transition-transform ease-out-soft duration-(--duration-fast) group-hover/channel:translate-x-0.5 rtl:group-hover/channel:-translate-x-0.5 ${muted}`}
                  />
                </a>
              </FadeUp>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
