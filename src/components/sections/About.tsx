import { useTranslation } from 'react-i18next'
import { onAnchorClick } from '../../lib/anchors'
import { cn } from '../../lib/cn'
import { MapArc } from '../motion/MapArc'
import { Container } from '../ui/Container'
import { IconArrow, IconBadgeCheck, IconStethoscope } from '../ui/icons'

/*
 * F6.3 — 03 · About — Bento (design.pen §3.03).
 * Desktop (BIUr4, paper-50): Section Head (eyebrow + H2 + intro 440px) va bento grid
 *   2×628px ustun — chapda Medical degree (img 216 + content, 420px), o'ngda 2 qator
 *   (198px): Medical services 300px + "2026" stat, Map arc 405px + Recognised by 199px.
 * Mobile (GBFCI, 390): head vertikal, kartalar bitta ustun (gap 14) — Medical services,
 *   Map, Recognised by, "2026" tartibi; rasm 140px.
 * Bento grid `xl` (1280+) dan boshlab: 300/199px ustunlar faqat keng konteynerda
 *   sig'di (xl'da Map kartasi 381px, dizaynda 405px — arq `w-full max-w-[348px]`).
 * Map arc — motion #11 (F4.7). SectionHeading emas: dizaynda eyebrow → H2 gap 14px,
 *   aksent desktopda serif italic 52px, mobilda display bold.
 */

const CARD_LIGHT = 'rounded-lg bg-white shadow-bento ring-1 ring-ink-900/8 ring-inset'
const CARD_DARK = 'rounded-lg bg-ink-900 ring-1 ring-white/8 ring-inset'

function EducationCard({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <article
      className={cn('flex flex-col overflow-hidden xl:min-h-[420px]', CARD_LIGHT, className)}
    >
      <picture className="block">
        <source
          type="image/avif"
          srcSet="/img/edu4-800.avif 800w, /img/edu4-1600.avif 1600w"
          sizes="(min-width: 1280px) 628px, 100vw"
        />
        <source
          type="image/webp"
          srcSet="/img/edu4-800.webp 800w, /img/edu4-1600.webp 1600w"
          sizes="(min-width: 1280px) 628px, 100vw"
        />
        <img
          src="/img/edu4-1600.webp"
          alt={t('about.bento.campusAlt')}
          width={1600}
          height={1061}
          loading="lazy"
          decoding="async"
          className="h-[140px] w-full object-cover object-[center_66%] xl:h-[216px]"
        />
      </picture>

      <div className="flex flex-col gap-2.5 p-[18px] xl:px-[26px] xl:pt-[22px] xl:pb-[26px]">
        <span className="w-fit rounded-pill bg-edu-500/12 px-[10px] py-1.5 font-mono text-[10px] leading-[1.2] tracking-[1.5px] text-edu-700 uppercase xl:px-[11px] xl:py-[5px]">
          {t('about.bento.educationChip')}
        </span>

        <h3 className="font-display text-[20px] leading-[1.2] font-bold text-hi-light xl:text-[27px]">
          {t('about.bento.campusTitle')}
        </h3>

        <p className="text-[14.5px] leading-[1.55] text-mid-light xl:text-[15px]">
          {t('about.bento.campusBody')}
        </p>

        <a
          href="#student-admission"
          onClick={(event) => onAnchorClick(event, '#student-admission')}
          className="inline-flex w-fit items-center gap-1.5 pt-0.5 text-[14.5px] leading-[1.2] font-semibold text-stories transition-opacity duration-(--duration-fast) ease-out-soft hover:opacity-70 xl:gap-2 xl:pt-1.5 xl:text-[15px]"
        >
          {t('about.bento.learnMore')}
          <IconArrow className="size-[15px] shrink-0 xl:size-4" />
        </a>
      </div>
    </article>
  )
}

function MedicalCard({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <article
      className={cn(
        'relative flex flex-col gap-2.5 overflow-hidden p-5 xl:min-h-[198px] xl:justify-between xl:p-lg',
        CARD_DARK,
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[70px] -right-[60px] hidden size-[220px] rounded-full xl:block"
        style={{
          backgroundImage:
            'radial-gradient(closest-side, color-mix(in srgb, var(--color-care-glow) 53%, transparent) 0%, transparent 100%)',
        }}
      />

      <div className="relative flex items-center justify-between gap-3">
        <h3 className="font-display text-[20px] leading-[1.2] font-bold text-hi-dark xl:text-[24px]">
          {t('about.bento.medicalTitle')}
        </h3>
        <IconStethoscope className="size-5 shrink-0 text-care-glow" />
      </div>

      <p className="relative text-[14.5px] leading-[1.55] text-mid-dark xl:text-[14px] xl:leading-[1.5]">
        {t('about.bento.medicalBody')}
      </p>

      <a
        href="#medical-services"
        onClick={(event) => onAnchorClick(event, '#medical-services')}
        className="relative mt-auto inline-flex w-fit items-center gap-1.5 pt-2 text-[14px] leading-[1.2] font-semibold text-care-glow transition-opacity duration-(--duration-fast) ease-out-soft hover:opacity-70"
      >
        {t('about.bento.medicalLink')}
        <IconArrow className="size-[15px] shrink-0" />
      </a>
    </article>
  )
}

function FoundedCard({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex flex-col justify-center gap-1.5 rounded-lg bg-brand-600 p-5 xl:min-h-[198px] xl:justify-between xl:gap-0 xl:p-[22px]',
        className,
      )}
    >
      <p className="font-display text-[40px] leading-[1.1] font-bold text-white tabular-nums xl:font-mono xl:text-[44px] xl:leading-[1.2]">
        {t('about.bento.yearValue')}
      </p>
      <p className="text-sm leading-[1.45] text-white/72 xl:text-white">
        {t('about.bento.yearLabel')}
      </p>
    </div>
  )
}

function MapCard({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <article
      className={cn(
        'flex flex-col gap-3 overflow-hidden p-5 xl:min-h-[198px] xl:gap-2.5 xl:p-[22px]',
        CARD_DARK,
        className,
      )}
    >
      <h3 className="text-[15px] leading-[1.2] font-semibold text-hi-dark">
        {t('about.bento.mapTitle')}
      </h3>

      <MapArc />

      <div className="flex items-center justify-between font-mono text-[10px] leading-[1.2] text-mid-dark xl:tracking-[1px]">
        <span>{t('about.bento.mapBukhara')}</span>
        <span>{t('about.bento.mapIndia')}</span>
      </div>
    </article>
  )
}

function TrustCard({ className }: { className?: string }) {
  const { t } = useTranslation()
  const badges = (t('trust.badges', { returnObjects: true }) as unknown as string[]).slice(0, 3)

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-lg bg-paper-100 p-[18px] ring-1 ring-ink-900/8 ring-inset xl:min-h-[198px] xl:justify-center xl:p-lg',
        className,
      )}
    >
      <p className="text-sm font-semibold text-hi-light">{t('about.bento.recognisedBy')}</p>

      <ul className="flex flex-wrap gap-2 xl:flex-col">
        {badges.map((badge) => (
          <li
            key={badge}
            className="inline-flex w-fit items-center gap-1.5 rounded-pill bg-white px-2.5 py-1.5 text-xs text-hi-light ring-1 ring-ink-900/8 ring-inset xl:gap-2 xl:px-3 xl:py-[7px] xl:font-mono"
          >
            <IconBadgeCheck className="size-[13px] shrink-0 text-brand-500 xl:size-3.5" />
            {badge}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="bg-paper-50">
      <Container className="flex flex-col gap-6 py-16 md:gap-10 md:py-4xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex max-w-[640px] flex-col gap-3 md:gap-3.5">
            <p className="font-mono text-[11px] tracking-[2px] text-stories uppercase md:text-xs">
              {t('about.eyebrow')}
            </p>

            <h2 className="font-display text-[24px] leading-[1.05] font-bold text-balance text-hi-light md:text-[48px]">
              <span className="block">{t('about.titleLine1')}</span>
              <span className="flex flex-wrap items-center gap-2 md:gap-3">
                <em className="font-display text-brand-500 not-italic md:font-accent md:text-[52px] md:italic">
                  {t('about.titleAccent')}
                </em>
                <span>{t('about.titleLine2')}</span>
              </span>
            </h2>
          </div>

          <p className="max-w-[440px] text-[15px] leading-[1.6] text-mid-light md:text-base">
            {t('about.body')}
          </p>
        </div>

        <div className="flex flex-col gap-3.5 xl:grid xl:grid-cols-2 xl:gap-6">
          <EducationCard />

          {/* Mobil: 4 ta karta bitta flex ustun (order: Medical services → Map → Trust → 2026).
              Desktop: 2 qator — qator A Medical services+2026, qator B Map+Trust. */}
          <div className="flex flex-col gap-3.5 xl:gap-6">
            <div className="contents xl:flex xl:gap-6">
              <MedicalCard className="order-1 xl:order-none xl:w-[300px] xl:shrink-0" />
              <FoundedCard className="order-4 xl:order-none xl:flex-1" />
            </div>
            <div className="contents xl:flex xl:gap-6">
              <MapCard className="order-2 xl:order-none xl:flex-1" />
              <TrustCard className="order-3 xl:order-none xl:w-[199px] xl:shrink-0" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
