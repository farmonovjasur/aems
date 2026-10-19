import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn'
import { FadeUp } from '../motion/FadeUp'
import { Chip } from '../ui/Chip'
import { Container } from '../ui/Container'

/*
 * F6.8 — 08 · Admission Explained — design.pen §3.08 (`maP9W` desktop · `kX8iH` mobile).
 *
 * Desktop (maP9W · 1440 · paper-50 · 723px · padding 96/80 · gap 40):
 *   kirish (eyebrow mono 12/2 `#3B57D9` → H2 48/1.05 → paragraf 16/1.6 max 960)
 *   → Stages: bitta qator — 5 karta (flex-1 ≈ 246px) va ular orasida 4 ta 12px
 *   `Connector` — chiziq kartadagi `Line` darajasida (20 padding + 56 head + 10 gap = 86).
 *   Karta balandligi 319 = eng baland kartaning tabiiy balandligi (`items-stretch`).
 *   Karta: oq yuzа · radius 20 · `ring-ink-900/8` · `shadow-bento` (ink-900/12% 0 20 60)
 *   · padding 20 · gap 10. Head: 26px brand-500 badge (mono 12 bold oq raqam) + sarlavha
 *   (display 16/1.2 bold) · `Line` 1px `ink-900/12` · bullet'lar 16/1.5 `text-mid-light`.
 *   4-bosqich kartasi bullet o'rniga 4 ta natija chip'i beradi (mint/gold/brand/neutral).
 *
 * Mobile (kX8iH · 390 · gutter 20 · padding 64/20 · gap 20):
 *   Karta radius 16 · padding 18 · `shadow` yo'q · ajratuvchi `Line` yo'q ·
 *   sarlavha `font-body` 16/600 · bullet 14/1.5 · badge raqami normal og'irlikda ·
 *   chip'lar 2 qator (2 + 2, gap 8) va brand chipi `brand-500/25` ring bilan.
 *   Kartalar STATIK (accordion emas) — dizayn ramkasi `kX8iH` shunday chizilgan;
 *   motion notes'dagi #17 bu section'da qo'llanmaydi (Footer'da ishlayverdi).
 *
 * Motion (design.pen `Y8IYL` · Section map · qator 10 → #10):
 *   #10 — 5 bosqishli bento fade-up stagger (`FadeUp`, 0.6s, y 26, 0.06s qadam).
 *   Reduced-motion: stagger 150ms opacity fade, transform'siz (`FadeUp` reduced varianti).
 */

type Stage = { title: string; bullets: string[] }

type OutcomeTone = 'mint' | 'gold' | 'brand' | 'neutral'

/**
 * 4-bosqich "Admission decision" kartasi — bullet'lar o'rniga natija chiplari.
 * Tonlar dizayn komponentlariga 1:1 (`zpb0e` Mint · `Hhd9E` Gold · `erU2o` Neutral ·
 * brand chipi `e0oIZ0` reusable emas — shu yerda quriladi).
 */
const OUTCOME_TONES: OutcomeTone[] = ['mint', 'gold', 'brand', 'neutral']

/** Natija chiplari faqat shu bosqichda — dizayn 4-bosqich kartasida (`P4mhY`). */
const OUTCOME_STAGE = 3

/* paper-50 fon ustida oq yuzalar — mobil radius 16 · padding 18 · shadow'siz. */
const STAGE_SURFACE =
  'flex flex-col gap-2.5 rounded-[16px] bg-white p-[18px] ring-1 ring-ink-900/8 ring-inset md:rounded-md md:p-5 md:shadow-bento'

/** 26px brand-500 badge — desktop raqam mono 12 bold, mobil normal. */
function StageBadge({ index }: { index: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-[26px] shrink-0 items-center justify-center rounded-pill bg-brand-500"
    >
      <span className="font-mono text-xs leading-none text-white md:font-bold">{index + 1}</span>
    </span>
  )
}

/** Design `e0oIZ0` — mobil: brand-500/8 yuzа + brand-500/25 ring; desktop: /12 yuzа, ringsiz. */
function BrandChip({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-pill bg-brand-500/8 px-3 py-1.5 text-xs leading-4 text-brand-500 ring-1 ring-brand-500/25 ring-inset md:bg-brand-500/12 md:px-3.5 md:py-2 md:ring-0">
      {label}
    </span>
  )
}

function OutcomeChip({ label, tone }: { label: string; tone: OutcomeTone }) {
  if (tone === 'brand') return <BrandChip label={label} />
  if (tone === 'neutral') {
    /* Design karta ustida `text-mid-dark` (#A3ACC2) oq fonda 2.3:1 — o'qilmaydi.
       `text-mid-light` (#5B6478, 5.9:1) oq yuzaning ikkilamchi matn tokeni va
       dizayn niyatini (kulrang neytral chip) saqlaydi. */
    return (
      <Chip size="md" className="text-mid-light">
        {label}
      </Chip>
    )
  }

  return (
    <Chip size="md" tone={tone}>
      {label}
    </Chip>
  )
}

/** Natija chiplari — mobil tabiiy oqimda 2 qator (kartadagi gap 10), desktop ustun (gap 6, pt 4). */
function OutcomeChips({ labels }: { labels: string[] }) {
  return (
    <div className="flex flex-col gap-2.5 md:gap-1.5 md:pt-1">
      <ul className="flex flex-wrap gap-x-2 gap-y-2.5 md:flex-col md:items-start md:gap-y-1.5">
        {labels.map((label, index) => (
          <li key={label}>
            <OutcomeChip label={label} tone={OUTCOME_TONES[index]} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function StageContent({ stage, index }: { stage: Stage; index: number }) {
  if (index === OUTCOME_STAGE) return <OutcomeChips labels={stage.bullets} />

  return (
    <ul className="flex flex-col gap-2.5">
      {stage.bullets.map((bullet) => (
        <li key={bullet} className="text-[14px] leading-[1.5] text-mid-light md:text-base">
          {bullet}
        </li>
      ))}
    </ul>
  )
}

function StageCard({ stage, index }: { stage: Stage; index: number }) {
  return (
    <FadeUp index={index} className="flex w-full min-w-0 flex-1 flex-col">
      <article className={cn(STAGE_SURFACE, 'flex-1')}>
        <div className="flex items-center gap-2.5 md:h-14">
          <StageBadge index={index} />
          <h3 className="font-body text-base leading-[1.2] font-semibold text-balance text-hi-light md:font-display md:font-bold">
            {stage.title}
          </h3>
        </div>

        {/* Design: ajratuvchi chiziq faqat desktop kartalarida. */}
        <div aria-hidden="true" className="hidden h-px w-full bg-ink-900/12 md:block" />

        <StageContent stage={stage} index={index} />
      </article>
    </FadeUp>
  )
}

/** Desktop: kartalar orasidagi 12px connector — chiziq kartadagi `Line` darajasida (86px). */
function Connector() {
  return (
    <span aria-hidden="true" className="hidden w-3 shrink-0 self-start xl:block">
      <span className="block h-[86px]" />
      <span className="block h-px w-full bg-ink-900/12" />
    </span>
  )
}

export function AdmissionExplained() {
  const { t } = useTranslation()
  const stages = t('admission.stages', { returnObjects: true }) as unknown as Stage[]

  return (
    <section id="student-admission" className="bg-paper-50" data-testid="admission-explained">
      <Container className="flex flex-col gap-5 py-16 md:gap-10 md:py-4xl">
        <div className="flex flex-col gap-5 md:gap-3.5">
          <p className="font-mono text-[11px] tracking-[2px] text-stories uppercase md:text-xs">
            {t('admission.eyebrow')}
          </p>

          <h2 className="font-display text-[24px] leading-[1.15] font-bold text-balance text-hi-light md:text-[48px] md:leading-[1.05]">
            {t('admission.title')}
          </h2>

          <p className="text-[15px] leading-[1.55] text-mid-light md:max-w-[960px] md:text-base md:leading-[1.6]">
            {t('admission.intro')}
          </p>
        </div>

        {/* Mobil/tablet: 12px bo'shliq bilan ustun. Desktop (≥1280): bitta qator —
            5 ta karta + 4 ta 12px connector `gap` o'rnini bosadi (`gap-0` shuning uchun).
            1280 ostida qator juda siqiladi (kartа ≈237px), matn karta chegarasidan chiqadi. */}
        <ol className="flex flex-col gap-3 xl:flex-row xl:items-stretch xl:gap-0">
          {stages.map((stage, index) => (
            <Fragment key={stage.title}>
              <li className="flex min-w-0 items-stretch xl:flex-1">
                <StageCard stage={stage} index={index} />
              </li>
              {index < stages.length - 1 ? <Connector /> : null}
            </Fragment>
          ))}
        </ol>
      </Container>
    </section>
  )
}
