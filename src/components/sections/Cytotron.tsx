import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CONTACT } from '../../lib/contacts'
import { ImageReveal } from '../motion/ImageReveal'
import { MagneticButton } from '../motion/MagneticButton'
import { TiltCard } from '../motion/TiltCard'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import {
  IconArrow,
  IconClipboardList,
  IconMessageCircle,
  IconScanLine,
  IconSend,
  IconShieldCheck,
  IconStethoscope,
  IconTarget,
} from '../ui/icons'

/*
 * F6.5 — 06 · Cytotron (Care) — design.pen §3.05.
 *
 * Desktop (XTh3z · 1440 · ink-950 · 1945px): markazlashgan head (eyebrow mono 12/2
 *   care-glow · H2a 48 · H2b serif-italic aksent "planned" 52 + 48 · sub 17/600) →
 *   media split 1060×430 (radius 28, `#0A0F1E`, ring white/10: chapda radiology.webp,
 *   o'ngda cytotron.webp −18px tepada 448px, caption badge'lar pastda) → 3 advantage
 *   kartasi (411×160, radius 24) → pill'li process qatori (o'q → pill → o'q) →
 *   info panel (ink-900, radius 24, gap 48: chap 420px ta'rif + o'ngda 3 qator + 3 chip) →
 *   CTA juftligi → trust blok (760) → disclaimer (mono 11/760).
 *
 * Mobile (g4klf · 390): head markazda (H2 24, aksent serif emas — display 24 care-500) →
 *   media vertikal (150 + 200px, radius 20) → 3 feature kartasi (radius 20) →
 *   vertikal stepper (28px oq node + 2×30px chiziq) → info panel (radius 20, p 22/20) →
 *   to'liq kenglikdagi CTA'lar → trust blok (56px avatar) → disclaimer (mono 10).
 *
 * Dizaynning "SCROLL TO EXPLORE" pin badge'i — dasturchi uchun eslatma, foydalanuvchi
 * uchun ma'nosiz — qasddan chiqarib tashlandi (shuning uchun §3.5 motion jadvalidagi
 * #14 pinned canvas ham F8 da qoladi).
 *
 * Motion: #23 ImageReveal (media), #10 TiltCard (3 advantage karta — fade-up stagger +
 *   desktop tilt/yorug'lik/shine), #4 MagneticButton (CTA'lar).
 */

type Caption = { number: string; title: string; body: string }
type InfoItem = { title: string; body: string }

const CAPTION_ICONS = [IconScanLine, IconTarget, IconShieldCheck] as const
const STEP_ICONS = [IconSend, IconStethoscope, IconClipboardList] as const

const MEDIA_SIZES = '(min-width: 768px) 530px, 350px'

function glow(color: string, alpha: number) {
  return `radial-gradient(closest-side, color-mix(in srgb, ${color} ${alpha}%, transparent) 0%, color-mix(in srgb, ${color} ${Math.round(alpha * 0.45)}%, transparent) 55%, transparent 92%)`
}

function Glows() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Mobil: faqat cyan (g4klf mSR2l — 40,-40 · 340×300). Desktop: + violet (120,420 · 560×480). */}
      <div
        className="absolute start-[40px] top-[-40px] h-[300px] w-[340px] rounded-full md:start-[420px] md:top-[60px] md:h-[520px] md:w-[620px]"
        style={{ backgroundImage: glow('var(--color-care-glow)', 33) }}
      />
      <div
        className="absolute top-[420px] start-[120px] hidden h-[480px] w-[560px] rounded-full md:block"
        style={{ backgroundImage: glow('var(--color-care-500)', 30) }}
      />
    </div>
  )
}

function MediaCaption({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute bottom-4 start-4 rounded-pill bg-ink-950/80 px-[13px] py-[7px] font-mono text-[10px] leading-none tracking-px text-care-glow ring-1 ring-white/[0.14] ring-inset">
      {children}
    </span>
  )
}

export function Cytotron() {
  const { t } = useTranslation()
  const captions = t('cytotron.captions', { returnObjects: true }) as unknown as Caption[]
  const steps = t('cytotron.process.steps', { returnObjects: true }) as unknown as string[]
  const items = t('cytotron.info.items', { returnObjects: true }) as unknown as InfoItem[]
  const chips = t('cytotron.info.chips', { returnObjects: true }) as unknown as string[]
  const [trustTitle, trustMeta] = t('cytotron.trust', { returnObjects: true }) as unknown as [
    string,
    string,
  ]

  return (
    <section id="cytotron" className="relative overflow-hidden bg-ink-950">
      <Glows />

      <Container className="relative flex flex-col items-center gap-[22px] py-16 md:gap-10 md:py-[112px]">
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <p className="font-mono text-[11px] tracking-[2px] text-care-glow uppercase md:text-xs">
            {t('cytotron.eyebrow')}
          </p>

          <h2 className="font-display text-[24px] leading-[1.05] font-bold text-balance text-hi-dark md:text-[48px]">
            {t('cytotron.titleLine1')}
            <span className="mt-[7px] flex flex-wrap items-center justify-center gap-[7px] md:mt-3 md:gap-3">
              <em className="font-display text-[24px] font-bold text-care-500 not-italic md:font-accent md:text-[52px] md:font-normal md:italic">
                {t('cytotron.titleAccent')}
              </em>
              <span className="font-display text-[24px] font-bold text-hi-dark md:text-[48px]">
                {t('cytotron.titleLine2')}
              </span>
            </span>
          </h2>

          <p className="max-w-[350px] text-[15px] leading-[1.55] text-mid-dark md:max-w-[600px] md:text-[17px]">
            {t('cytotron.sub')}
          </p>
        </div>

        {/* --- Media --- */}
        <div className="relative w-full max-w-[1060px] md:overflow-hidden md:rounded-[28px] md:bg-surface-media md:ring-1 md:ring-white/10 md:ring-inset">
          <div className="flex flex-col gap-2.5 md:h-[430px] md:flex-row md:gap-0">
            <div className="relative h-[150px] w-full overflow-hidden rounded-md ring-1 ring-white/10 ring-inset md:h-[430px] md:w-1/2 md:rounded-none md:ring-0">
              {/* Zoom dizayn fill transform'ini takrorlaydi (scaleX 1.1376, chapdan langar).
                  Transform ImageReveal wrapper'ida — GSAP esa faqat ichki <img> ni boshqaradi. */}
              <ImageReveal
                wrapperClassName="h-full w-full md:rtl:origin-right md:scale-x-[1.1376]"
                width={1500}
                height={1500}
                alt={t('cytotron.media.altRadiology')}
                src="/img/radiology-800.webp"
                srcSet="/img/radiology-400.avif 400w, /img/radiology-800.avif 800w"
                sizes={MEDIA_SIZES}
                className="object-cover object-center"
              />
              <MediaCaption>{t('cytotron.media.radiologyCaption')}</MediaCaption>
            </div>

            <div className="relative h-[200px] w-full overflow-hidden rounded-md ring-1 ring-white/10 ring-inset md:-top-[18px] md:h-[448px] md:w-1/2 md:rounded-none md:ring-0">
              <ImageReveal
                wrapperClassName="h-full w-full md:rtl:origin-right md:scale-x-[1.5168]"
                width={2500}
                height={1875}
                alt={t('cytotron.media.altDevice')}
                src="/img/cytotron-1200.webp"
                srcSet="/img/cytotron-800.avif 800w, /img/cytotron-1200.avif 1200w, /img/cytotron-1600.avif 1600w"
                sizes={MEDIA_SIZES}
                className="object-cover object-center"
              />
              <MediaCaption>{t('cytotron.media.cytotronCaption')}</MediaCaption>
            </div>
          </div>
        </div>

        {/* --- Advantage captions (#10) --- */}
        <div className="flex w-full flex-col gap-2.5 md:grid md:grid-cols-3 md:gap-6">
          {captions.map((caption, index) => {
            const Icon = CAPTION_ICONS[index] ?? IconScanLine
            return (
              <TiltCard
                key={caption.number}
                index={index}
                radiusClassName="rounded-md md:rounded-[24px]"
              >
                <article className="flex flex-col gap-2.5 rounded-md bg-white/[0.04] p-5 ring-1 ring-white/[0.08] ring-inset md:gap-3 md:rounded-[24px] md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[13px] leading-none text-care-glow">
                      {caption.number}
                    </span>
                    <Icon className="size-5 shrink-0 text-care-500" />
                  </div>

                  <h3 className="font-display text-[19px] leading-[1.15] font-semibold text-hi-dark md:text-[21px] md:font-bold">
                    {caption.title}
                  </h3>

                  <p className="text-sm leading-[1.55] text-mid-dark">{caption.body}</p>
                </article>
              </TiltCard>
            )
          })}
        </div>

        {/* --- Process: desktop — pill + arrow; mobile — 28px rail + node + line (§3.05 g4klf) --- */}
        <ol className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:gap-3.5">
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? IconSend
            const isLast = index === steps.length - 1

            return (
              <li key={step} className="flex items-start gap-1.5 md:contents">
                <span className="flex w-7 shrink-0 flex-col items-center md:hidden">
                  <span className="flex size-7 items-center justify-center rounded-pill bg-white">
                    <span className="font-mono text-[11px] leading-none font-bold text-ink-950">
                      {index + 1}
                    </span>
                  </span>
                  {isLast ? null : <span className="mt-1.5 h-[30px] w-[2px] bg-white/12" />}
                </span>

                <span className="flex flex-1 items-center gap-2.5 pt-1 ps-1 md:hidden">
                  <Icon className="size-4 shrink-0 text-care-glow" />
                  <span className="text-[15px] leading-[1.25] text-hi-dark">{step}</span>
                </span>

                <span className="hidden items-center gap-2.5 rounded-pill bg-white/[0.04] px-5 py-[13px] ring-1 ring-white/[0.12] ring-inset md:inline-flex">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-pill bg-care-glow">
                    <span className="font-mono text-[11px] leading-none font-bold text-ink-950">
                      {index + 1}
                    </span>
                  </span>
                  <Icon className="size-4 shrink-0 text-care-glow" />
                  <span className="text-[15px] leading-[1.25] text-hi-dark">{step}</span>
                </span>

                {isLast ? null : (
                  <IconArrow className="hidden size-4 shrink-0 text-mid-dark md:block" />
                )}
              </li>
            )
          })}
        </ol>

        {/* --- Info panel --- */}
        <div className="flex w-full flex-col gap-[18px] rounded-md bg-ink-900 p-5 ring-1 ring-white/[0.08] ring-inset md:flex-row md:gap-12 md:rounded-[24px] md:p-7">
          <div className="flex w-full flex-col gap-3 md:w-[420px] md:shrink-0">
            <p className="font-mono text-[10.5px] tracking-[2px] text-care-glow uppercase md:text-[11px]">
              {t('cytotron.info.title')}
            </p>
            <p className="text-[14.5px] leading-[1.6] text-hi-dark md:text-base">
              {t('cytotron.info.intro')}
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-[18px]">
            {items.map((item, index) => (
              <div key={item.title} className="flex flex-col gap-1.5">
                <h4 className="font-display text-[15px] leading-[1.25] font-bold text-hi-dark">
                  {item.title}
                </h4>

                {index === items.length - 1 ? (
                  <ul className="flex flex-wrap gap-2 md:max-w-[372px]">
                    {chips.map((chip) => (
                      <li
                        key={chip}
                        className="inline-flex w-fit items-center rounded-pill bg-white/[0.06] px-3 py-[7px] text-[11.5px] leading-[1.35] text-hi-dark"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <p className="text-[14.5px] leading-[1.55] text-mid-dark md:text-base md:text-hi-dark">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- CTAs (#4) --- */}
        <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:items-center md:gap-3.5">
          <MagneticButton className="w-full md:w-auto">
            <ButtonLink
              href="#contacts"
              variant="primary"
              arrow
              className="w-full justify-center md:w-auto md:justify-center"
              data-testid="cytotron-cta-primary"
            >
              {t('common.requestCaseReview')}
            </ButtonLink>
          </MagneticButton>

          <MagneticButton className="w-full md:w-auto">
            <ButtonLink
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer noopener"
              variant="secondary"
              trailingIcon={
                <IconMessageCircle className="size-4 shrink-0 transition-transform ease-out-soft duration-(--duration-fast) group-hover/btn:translate-x-0.5 rtl:group-hover/btn:-translate-x-0.5" />
              }
              className="w-full justify-center md:w-auto md:justify-center"
              data-testid="cytotron-cta-whatsapp"
            >
              {t('common.askWhatsapp')}
            </ButtonLink>
          </MagneticButton>
        </div>

        {/* --- Trust — ikkala breakpointda ham qator (g4klf d5pwX: 56px avatar + 12 gap + 282 matn
              markazlashgan; §3.05 hjo1u: 64px avatar + 16 gap + fon/ring, matn chapda). --- */}
        <div className="flex w-full max-w-[760px] items-center gap-3 pt-1 md:gap-4 md:rounded-[20px] md:bg-white/[0.03] md:p-5 md:pt-5 md:ring-1 md:ring-white/[0.08] md:ring-inset">
          <img
            src="/img/doctor-256.webp"
            srcSet="/img/doctor-128.avif 128w, /img/doctor-256.avif 256w"
            sizes="(min-width: 768px) 64px, 56px"
            alt=""
            width={320}
            height={390}
            loading="lazy"
            decoding="async"
            className="size-14 shrink-0 rounded-full object-cover md:size-16"
          />
          <div className="flex flex-1 flex-col gap-1 text-center md:text-start">
            <p className="text-[14.5px] leading-[1.25] font-semibold text-balance text-hi-dark md:text-[15px]">
              {trustTitle}
            </p>
            <p className="text-[12.5px] leading-[1.5] text-mid-dark md:text-[13px]">{trustMeta}</p>
          </div>
        </div>

        <p className="w-full max-w-[760px] text-center font-mono text-[10px] leading-[1.6] text-mid-dark md:text-[11px]">
          {t('cytotron.disclaimer')}
        </p>
      </Container>
    </section>
  )
}