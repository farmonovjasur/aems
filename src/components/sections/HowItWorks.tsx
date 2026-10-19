import { useState, type ComponentType, type SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useStepperProgress } from '../../hooks/useStepperProgress'
import { cn } from '../../lib/cn'
import { Container } from '../ui/Container'
import { Tabs } from '../ui/Tabs'
import { tabButtonId, tabPanelId } from '../ui/tab-ids'
import {
  IconCircleCheck,
  IconClipboardList,
  IconFileText,
  IconGraduationCap,
  IconHeartPulse,
  IconMapPin,
  IconMessageCircle,
  IconPlane,
  IconSend,
  IconStethoscope,
} from '../ui/icons'

/*
 * F6.9 — 04 · How it works — design.pen `tDJeT` (desktop 1440 · 803px) · `BkFqH` (mobile 390 · 1076px).
 *
 * Desktop (paper-100 · py 96 · gap 36):
 *   Section Head — chapda 560px (eyebrow mono 12/2 `#3B57D9` → H2 48/1.05 → sub 16/1.55,
 *   gap 12), o'ngda `Tabs` (segment: ink-900/6 track · faol pill `ink-900` · radius 999,
 *   padding 4 · gap 4 · pill 10/22 · ikonka 15 · label 14/600).
 *   Body (gap 40): chapda `Stepper` 640px — 5 qadam, har biri `Rail` 48 (node 48 doira +
 *   2px chiziq) va `Content` (gap 6 · pt 6 · pb 34/24 · title row: display 21/700 +
 *   duration pill mono 11/5·10 `ink-900/6` · desc 15/1.5).
 *   O'ngda `Side Card` 600px — `ink-900` · radius 28 · ring white/8 · padding 28:
 *   eyebrow mono 11/1.5 `care-glow` → title display 26/1.1 → 5 × `circle-check` 17
 *   `edu-500` + matn 14.5/1.5 (gap 10, ro'yxat gap 14) → estimate (gap 10):
 *   `6–8` mono 30/600 + 13/1.4 matn.
 *
 * Mobile (gutter 20 · py 64 · gap 20): hammasi bitta ustun — eyebrow 11/2 · H2 24 ·
 *   sub 15 · Tabs `w-full` (har biri `flex-1`, faol pill `white` + `0 2 8 ink-900/10` soya) ·
 *   stepper (rail 40 · gap 12 · line 2×30 `ink-900/8` · title 16.5/600 · pill mono 10/4·9 ·
 *   desc 14/1.5) → Side Card (radius 20 · padding 20 · gap 14 · `circle-check` 16).
 *
 * Motion (design.pen `Y8IYL` · Section map · qator 11 → #12):
 *   #12 — "Vertical progress line fills in sync with scroll through the 5 steps;
 *         active step scales up at full opacity, inactive dim. Scrubbed."
 *   → `useStepperProgress(4)`: chiziq `scaleY(--sp)`, node oq → brand (`color-mix`),
 *     ikonka brand → oq, faol node 1.02 gacha scale. Autoplay yo'q — faqat scroll.
 *   Tab fill `duration-base` bilan sirqashadi (Map row 05 — bir xil segmented control).
 *   §6.2 #2: reduced-motion'da scrub o'chadi (`useStepperProgress`), CSS esa 150ms fade.
 *   "inactive dim" bajarilmadi: dizaynning statik holatida barcha matn 100% opacity —
 *   scroll bilan qoraytirish shu holatni buzardi (xuddi shu sabab F6.6 ham dim'siz).
 */

type Step = { title: string; duration: string; note: string }

const TAB_BASE = 'how-it-works'
const PATHS = ['students', 'patients'] as const
type PathId = (typeof PATHS)[number]

/** Ikonkalar i18n'dan kelmaydi — har yo'l uchun dizayn §3.09/§3.05 ikonkalari. */
const PATH_ICONS: Record<PathId, Array<ComponentType<SVGProps<SVGSVGElement>>>> = {
  students: [IconMessageCircle, IconFileText, IconGraduationCap, IconPlane, IconMapPin],
  patients: [IconSend, IconStethoscope, IconClipboardList, IconPlane, IconHeartPulse],
}

/** #12 — 5 qadam → 4 segment (oxirgi qadam 4-chi segmentni ulaydi). */
const SEGMENTS = 4
const segVar = (index: number) => `--sp${Math.min(index, SEGMENTS - 1)}`

/** O'tgan segment oq dan brendga o'tadi (dizayn: node 2–5 oq, to'ldirilganda brand). */
const nodeFill = (index: number) =>
  `color-mix(in oklab, var(--color-brand-500) calc(var(${segVar(index)}, 0) * 100%), var(--color-white))`

/** Ikonka rangini node foni bilan birga almashtiradi (brand → oq). */
const iconColor = (index: number) =>
  `color-mix(in oklab, var(--color-white) calc(var(${segVar(index)}, 0) * 100%), var(--color-brand-500))`

/** Faol qadam (segment to'liq emas) — 1.02 gacha scale. */
const nodeScale = (index: number) =>
  `scale(calc(1 + 0.02 * min(var(${segVar(index)}, 0), 1 - var(${segVar(index)}, 0))))`

export function HowItWorks() {
  const { t } = useTranslation()
  const [path, setPath] = useState<PathId>(PATHS[0])
  const steps = t(`process.paths.${path}.steps`, { returnObjects: true }) as unknown as Step[]
  const items = t('process.included.items', { returnObjects: true }) as unknown as string[]
  const icons = PATH_ICONS[path]

  /** #12 — vertikal progress chizig'i scroll bilan to'ladi (scrub). */
  const stepperRef = useStepperProgress<HTMLOListElement>(SEGMENTS)

  return (
    <section id="how-it-works" className="bg-paper-100" data-testid="how-it-works">
      <Container className="flex flex-col gap-5 py-16 md:gap-9 md:py-4xl">
        {/* --- Section head: kirish + segment tab --- */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="flex flex-col gap-5 md:w-[560px] md:shrink-0 md:gap-3">
            <p className="font-mono text-[11px] tracking-[2px] text-stories uppercase md:text-xs">
              {t('process.eyebrow')}
            </p>

            <h2 className="font-display text-[24px] leading-[1.15] font-bold text-balance text-hi-light md:text-[48px] md:leading-[1.05]">
              {t('process.title')}
            </h2>

            <p className="text-[15px] leading-[1.55] text-mid-light md:text-base">
              {t('process.sub')}
            </p>
          </div>

          <Tabs
            idBase={TAB_BASE}
            variant="segment"
            label={t('process.title')}
            value={path}
            onChange={(id) => setPath(id as PathId)}
            tabs={PATHS.map((id) => ({
              id,
              label: t(`process.tabs.${id}`),
              icon: id === 'students' ? <IconGraduationCap /> : <IconHeartPulse />,
            }))}
          />
        </div>

        {/* --- Body: stepper + side card --- */}
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-10">
          <div
            role="tabpanel"
            id={tabPanelId(TAB_BASE, path)}
            aria-labelledby={tabButtonId(TAB_BASE, path)}
            className="flex min-w-0 flex-col md:w-[640px] md:shrink-0"
          >
            <ol ref={stepperRef} className="flex flex-col">
              {steps.map((step, index) => {
                const Icon = icons[index]
                const isFirst = index === 0
                const isLast = index === steps.length - 1

                return (
                  <li
                    key={step.title}
                    className="flex gap-3 md:gap-5"
                    data-testid={`how-step-${index + 1}`}
                  >
                    {/* Rail: node + progress chizig'i (#12). 1-qadam dizayn bo'yicha
                        doim brand to'ldirma — qolganlari scroll bilan to'ladi. */}
                    <span className="flex w-10 shrink-0 flex-col items-center gap-1.5 md:w-12 md:gap-0">
                      <span
                        className={cn(
                          'flex size-10 shrink-0 items-center justify-center rounded-pill md:size-12',
                          isFirst
                            ? 'bg-brand-500'
                            : 'bg-white ring-1 ring-inset ring-ink-900/8 md:ring-ink-900/12',
                        )}
                        style={{
                          backgroundColor: isFirst ? undefined : nodeFill(index),
                          transform: nodeScale(index),
                        }}
                      >
                        <Icon
                          className="size-[18px] shrink-0 md:size-5"
                          style={{ color: isFirst ? undefined : iconColor(index) }}
                        />
                      </span>

                      {isLast ? null : (
                        <span className="relative h-[30px] w-0.5 shrink-0 bg-ink-900/8 md:h-auto md:flex-1 md:bg-brand-500/35">
                          <span
                            className="absolute inset-0 origin-top rounded-pill bg-brand-500"
                            style={{ transform: `scaleY(var(${segVar(index)}, 0))` }}
                          />
                        </span>
                      )}
                    </span>

                    {/* Content: title + duration pill + izoh */}
                    <div
                      className={cn(
                        'flex min-w-0 flex-1 flex-col gap-[5px] pt-[3px] pb-4 md:gap-1.5 md:pt-1.5',
                        isLast ? 'md:pb-6' : 'md:pb-[34px]',
                      )}
                    >
                      {/* Mobil: pill sarlavhadan keyin (gap 8) · desktop: `space-between`. */}
                      <div className="flex items-center gap-2 md:justify-between md:gap-3">
                        <h3 className="min-w-0 font-body text-[16.5px] leading-[1.2] font-semibold text-hi-light md:font-display md:text-[21px] md:font-bold">
                          {`${index + 1}. ${step.title}`}
                        </h3>

                        <span className="shrink-0 rounded-pill bg-ink-900/8 px-[9px] py-1 font-mono text-[10px] leading-[1.4] text-mid-light md:bg-ink-900/6 md:px-2.5 md:py-[5px] md:text-[11px]">
                          {step.duration}
                        </span>
                      </div>

                      <p className="text-[14px] leading-[1.5] text-mid-light md:text-[15px]">
                        {step.note}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* --- Side card: "What's included" + 6–8 hafta --- */}
          <aside className="flex flex-col gap-3.5 rounded-md bg-ink-900 p-5 ring-1 ring-white/8 md:flex-1 md:gap-0 md:rounded-lg md:p-7">
            <p className="font-mono text-[10.5px] tracking-[1px] text-care-glow uppercase md:text-[11px] md:tracking-[1.5px]">
              {t('process.included.eyebrow')}
            </p>

            <h3 className="font-display text-[20px] font-bold text-hi-dark md:text-[26px] md:leading-[1.1]">
              {t('process.included.title')}
            </h3>

            <ul className="flex flex-col gap-3.5 md:mt-5">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-2 md:items-start md:gap-2.5">
                  <IconCircleCheck className="size-4 shrink-0 text-edu-500 md:size-[17px]" />
                  <span className="text-[14px] leading-[1.5] text-mid-dark md:text-[14.5px]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 pt-1.5 md:mt-5 md:gap-2.5 md:pt-0">
              <p className="font-display text-[28px] leading-none font-bold text-hi-light md:font-mono md:text-[30px] md:font-semibold md:text-hi-dark">
                {t('process.stat.value')}
              </p>
              <p className="min-w-0 flex-1 text-[12.5px] leading-[1.4] text-mid-dark md:text-[13px]">
                {t('process.stat.label')}
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}
