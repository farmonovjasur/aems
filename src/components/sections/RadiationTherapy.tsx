import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useStepperProgress } from '../../hooks/useStepperProgress'
import { cn } from '../../lib/cn'
import { FadeUp } from '../motion/FadeUp'
import { Container } from '../ui/Container'
import { IconArrow } from '../ui/icons'

/*
 * F6.6 — 06 · Radiation Therapy — design.pen §3.06 (`zg6Xz` desktop · `ZXOCx` mobile).
 *
 * Desktop (zg6Xz · 1440 · paper-50 · 1154px):
 *   kirish (eyebrow mono 12/2 `#3B57D9` · H3 30/1.12 · body 16/1.6) → Top Area
 *   (gap 32: chap 500px — eyebrow/H3/intro/USED FOR/2 pill; o'ngda 748px — 2×2 treatment
 *   area tile, radius 20, `ring-ink-900/8`, ustma-ust cho'zilib turadi) → Hardware Panels
 *   (2×628, radius 24, `shadow-bento` 0 20 60 ink-900/12%: LINAC 3 qator (pt 8 · gap 5) |
 *   6D Couch — 3×2 axis grid + "6 degrees of freedom" caption) → Treatment Flow
 *   (pt 8 · eyebrow · 4 qadam kartasi 284px, orasida 24px lucide `arrow-right`).
 *
 * Mobile (ZXOCx · 390 · gutter 20): hammasi bitta ustun (gap 22) → H3 24/1.15 · body 15/1.55 ·
 *   pill'lar vertikal (gap 8, 12.5px) · tile'lar `items-start` (bir xil balandlik emas) ·
 *   panel radius 20, `shadow` yo'q · axis qatorlari (22px badge, 13.5px label) ·
 *   flow — vertikal stepper (26px ink-900 node + 2×34px chiziq + pb 14 content).
 *
 * Motion (design.pen `Y8IYL` · Section map · qator 08 → #10 · 12 · 23):
 *   #10 — "Used for" grid + LINAC list: fade-up stagger (`FadeUp`, 0.6s, y 26).
 *   #12 — Treatment flow stepper: scroll bilan progress line to'ladi, faol qadam
 *         scale qilinadi, scrub (autoplay emas) → `useStepperProgress`.
 *   #23 — bu section'da rasm yo'q, shuning uchun qo'llanmaydi.
 *   Statik holat dizayn bilan 1:1: `--sp*` = 0 bo'lganda rang/scale o'zgarmaydi.
 *   Reduced-motion: stagger 150ms fade, stepper scrub'siz (faqat scroll'ni aks ettiradi).
 */

type Area = { name: string; note: string }
type Row = { label: string; text: string }
type Axis = { n: string; label: string }
type Linac = { title: string; intro: string; rows?: Row[] }
type Couch = { title: string; intro: string; axes?: Axis[]; caption?: string }
type Step = { title: string; text: string }

/* paper-50 fon ustida oq yuzalar — `shadow-bento` faqat desktop'da (mobile: ring). */
const SURFACE = 'bg-white ring-1 ring-ink-900/8 ring-inset'

/* --- #12 stepper — `--sp0…2` ni `useStepperProgress` yozadi (render sirasida emas) --- */
const SEGMENTS = 3

/** 4 qadam / 3 segment: oxirgi qadam 3-chi segmentni ulaydi. */
const segVar = (index: number) => `--sp${Math.min(index, SEGMENTS - 1)}`

/** O'tgan segment brend rangiga bosqichma-bosqich o'tadi. */
const segmentFill = (index: number, fallback: string) =>
  `color-mix(in oklab, var(--color-brand-500) calc(var(${segVar(index)}, 0) * 100%), ${fallback})`

/** Faol qadam (segment to'liq emas) — 1.02 gacha scale. */
const segmentScale = (index: number) =>
  `scale(calc(1 + 0.02 * min(var(${segVar(index)}, 0), 1 - var(${segVar(index)}, 0))))`

function Panel({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded-md p-5 md:gap-3.5 md:rounded-[24px] md:p-7 md:shadow-bento',
        SURFACE,
      )}
    >
      <h4 className="font-display text-[18px] leading-[1.2] font-bold text-hi-light md:text-[20px]">
        {title}
      </h4>
      <p className="text-[14.5px] leading-[1.55] text-mid-light md:text-base">{intro}</p>
      {children}
    </article>
  )
}

export function RadiationTherapy() {
  const { t } = useTranslation()
  const modes = t('radiation.modes', { returnObjects: true }) as unknown as string[]
  const areas = t('radiation.areas', { returnObjects: true }) as unknown as Area[]
  const hardware = t('radiation.hardware', { returnObjects: true }) as unknown as (Linac | Couch)[]
  const steps = t('radiation.flow.steps', { returnObjects: true }) as unknown as Step[]

  /** #12 — treatment flow stepper progress (scrub). */
  const stepsRef = useStepperProgress<HTMLOListElement>(SEGMENTS)

  const linac = hardware[0] as Linac
  const couch = hardware[1] as Couch

  return (
    <section id="radiation-therapy" className="bg-paper-50" data-testid="radiation-therapy">
      <Container className="flex flex-col gap-[22px] py-16 md:gap-11 md:py-4xl">
        {/* --- Top area: kirish + treatment-area grid --- */}
        <div className="flex flex-col gap-[22px] md:flex-row md:gap-8">
          <div className="flex flex-col gap-[22px] md:w-[500px] md:shrink-0 md:gap-3.5">
            <p className="font-mono text-[11px] tracking-[2px] text-stories uppercase md:text-xs">
              {t('radiation.eyebrow')}
            </p>

            <h3 className="font-display text-[24px] leading-[1.15] font-bold text-balance text-hi-light md:text-[30px] md:leading-[1.12]">
              {t('radiation.h3')}
            </h3>

            <p className="text-[15px] leading-[1.55] text-mid-light md:text-base md:leading-[1.6]">
              {t('radiation.intro')}
            </p>

            <div className="flex flex-col gap-2.5">
              <p className="font-mono text-[10.5px] tracking-[1px] text-mid-light md:text-[11px] md:tracking-[1.5px]">
                {t('radiation.usedFor')}
              </p>

              <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-2.5">
                {modes.map((mode) => (
                  <span
                    key={mode}
                    className="inline-flex w-fit items-center rounded-pill bg-white px-3.5 py-2.5 text-[12.5px] leading-[1.2] text-hi-light ring-1 ring-ink-900/8 ring-inset md:py-[9px] md:text-[13px] md:font-semibold"
                  >
                    {mode}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 items-start gap-2.5 md:flex-1 md:items-stretch md:gap-4">
            {areas.map((area, index) => (
              <FadeUp key={area.name} index={index}>
                <article
                  className={cn('flex h-full flex-col gap-2 rounded-md p-4 md:p-5', SURFACE)}
                >
                  <h4 className="font-display text-[16px] leading-[1.2] font-semibold text-hi-light md:text-[18px]">
                    {area.name}
                  </h4>
                  <p className="text-[12.5px] leading-[1.45] text-mid-light md:text-base md:leading-[1.5]">
                    {area.note}
                  </p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* --- Hardware panels --- */}
        <div className="flex flex-col gap-[22px] md:grid md:grid-cols-2 md:items-start md:gap-6">
          <Panel title={linac.title} intro={linac.intro}>
            {linac.rows?.map((row, index) => (
              <FadeUp key={row.label} index={index}>
                <div className="flex flex-col gap-[5px] md:pt-2">
                  <p className="font-display text-[15px] leading-[1.2] font-semibold text-hi-light md:font-bold">
                    {row.label}
                  </p>
                  <p className="text-[14px] leading-[1.55] text-mid-light md:text-base md:leading-[1.5]">
                    {row.text}
                  </p>
                </div>
              </FadeUp>
            ))}
          </Panel>

          <Panel title={couch.title} intro={couch.intro}>
            {/* Mobil: oddiy qatorlar (fon/ring yo'q). Desktop: 3×2 grid, karta foni bilan. */}
            <div className="flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-2 md:pt-1.5">
              {couch.axes?.map((axis) => (
                <div
                  key={axis.n}
                  className="flex items-center gap-2.5 md:flex-col md:items-start md:gap-2 md:rounded-sm md:bg-ink-900/[0.03] md:px-2.5 md:py-[9px]"
                >
                  <span className="flex size-[22px] shrink-0 items-center justify-center rounded-pill bg-brand-500 md:size-5">
                    <span className="font-mono text-[11px] leading-none font-normal text-white md:font-bold">
                      {axis.n}
                    </span>
                  </span>
                  <span className="text-[13.5px] leading-[1.3] text-hi-light md:text-[13px] md:font-medium">
                    {axis.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="font-mono text-[11px] leading-[1.2] text-mid-light md:pt-1 md:text-[12px] md:tracking-[1px]">
              {couch.caption}
            </p>
          </Panel>
        </div>

        {/* --- Treatment flow --- */}
        <div className="flex flex-col gap-4 pt-2">
          <p className="font-mono text-[11px] tracking-[2px] text-stories uppercase md:text-xs">
            {t('radiation.flow.eyebrow')}
          </p>

          {/* Mobil: step'lar orasida bo'shliq yo'q — content'ning pb-14 beradi (design 296px).
              Desktop: 12px gap — kartalar + 24px strelkalar bir qatorga sig'adi (1280px). */}
          <ol ref={stepsRef} className="flex flex-col md:flex-row md:items-start md:gap-3">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1

              return (
                <li key={step.title} className="flex gap-3 md:contents">
                  {/* Mobil: vertikal rail — 26px node + 2×34px chiziq (#12 progress to'ladi). */}
                  <span className="flex w-[26px] shrink-0 flex-col items-center gap-1.5 md:hidden">
                    <span
                      className="flex size-[26px] items-center justify-center rounded-pill"
                      style={{
                        backgroundColor: segmentFill(index, 'var(--color-ink-900)'),
                        transform: segmentScale(index),
                      }}
                    >
                      <span className="font-mono text-[11px] leading-none text-white">
                        {index + 1}
                      </span>
                    </span>
                    {isLast ? null : (
                      <span className="relative h-[34px] w-0.5 bg-ink-900/8">
                        <span
                          className="absolute inset-0 origin-top rounded-pill bg-brand-500"
                          style={{ transform: `scaleY(var(${segVar(index)}, 0))` }}
                        />
                      </span>
                    )}
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5 pb-3.5 md:contents">
                    <p className="font-display text-[15px] leading-[1.2] font-semibold text-hi-light md:hidden">
                      {step.title}
                    </p>
                    <p className="text-[13.5px] leading-[1.5] text-mid-light md:hidden">
                      {step.text}
                    </p>

                    {/* Desktop: 284px karta — 22px badge + sarlavha + matn. */}
                    <div
                      className={cn(
                        'hidden w-[284px] shrink-0 flex-col gap-2 rounded-md p-5 md:flex',
                        SURFACE,
                      )}
                      style={{ transform: segmentScale(index) }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="flex size-[22px] shrink-0 items-center justify-center rounded-pill"
                          style={{
                            backgroundColor: segmentFill(index, 'var(--color-ink-900)'),
                          }}
                        >
                          <span className="font-mono text-[11px] leading-none font-bold text-hi-dark">
                            {index + 1}
                          </span>
                        </span>
                        <p className="font-display text-[16px] leading-[1.2] font-bold text-hi-light">
                          {step.title}
                        </p>
                      </div>
                      <p className="text-base leading-[1.5] text-mid-light">{step.text}</p>
                    </div>
                  </div>

                  {/* Desktop: 24px strelka kartalar orasida (mobile'da yo'q). */}
                  {isLast ? null : (
                    <span className="hidden h-10 w-6 shrink-0 items-center justify-center md:flex">
                      <IconArrow
                        className="size-[18px] shrink-0"
                        style={{
                          color: segmentFill(index, 'var(--color-mid-light)'),
                        }}
                      />
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </Container>
    </section>
  )
}
