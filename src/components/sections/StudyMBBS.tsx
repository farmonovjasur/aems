import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { onAnchorClick } from '../../lib/anchors'
import { cn } from '../../lib/cn'
import { EASE_SOFT, ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'
import { ImageReveal } from '../motion/ImageReveal'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { SegmentedToggle } from '../ui/SegmentedToggle'
import { IconBadgeCheck, IconCalendar, IconGlobe, IconMicroscope, IconUsers } from '../ui/icons'

/*
 * F6.10 — 05 · Medical degree — design.pen §3.10 (`yWS5Z` desktop 1440·1333px · `RDbr7` mobile 390·1474px).
 *
 * Desktop (`yWS5Z` · paper-50 · padding 96/80 · gap 40):
 *   Section Head — chapda 760px (eyebrow mono 12/2 `#3B57D9` → H2 44/1.05, gap 12), o'ngda
 *   `Intake chip` (`edu-500/12%` yuzа · radius 999 · gap 8 · padding 10/16 · `calendar` 15
 *   `edu-700` · label mono 11/1). Qator `space_between` + `align-items: end`.
 *   Body (gap 40): chap `Key Facts` 380px — `KEY FACTS` mono 11/1.5 label (birinchi fakt bilan
 *   zaxira 0), 4 ta fakt `padding 20/0` + 1px `ink-900/10` yuqori chiziq, gap 6, value
 *   mono 34/600, label Geist 14. O'ng `Right Column` 860px (gap 24):
 *     ① `Fees Calculator` — oq, radius 28, `ring-ink-900/8`, `shadow-bento`, padding 28, gap 16.
 *        Balandlik 489 dizayn y-koordinatlari bilan 1:1 (padding + head 36 + 6 qator +
 *        divider + total 72 + actions 51). Currency toggle — `SegmentedToggle`; qatorlar
 *        `space_between`; Mess qatorida ON ko'rsatkich (40×24 `brand-500`, knob 18 `white`)
 *        + mono 11 "optional". Total: chap (mono 11/1.5 label + Geist 13 hint), o'ng `items-end`
 *        (mono 40/700 qiymat + mono 12 ekvivalent).
 *     ② `University Card` — 264px, clip, radius 28: chapda 300px rasm (`hero`), o'ngda 560px
 *        kontent (padding 26, gap 12, `space_between`) — "BIEMU" 30/700, to'liq nom 15/1.5,
 *        2 qator badge (fill `ink-900/5%`, radius 999, gap 7, padding 7/12, ikonka 13
 *        `brand-500`, label mono 11), `Apply Now`.
 *     ③ `Campus Gallery` — 3 × 276×180, gap 16, radius 20, clip.
 *
 * Mobile (`RDbr7` · gutter 20 · padding 64/20 · gap 20): bitta ustun, TIZIM boshqacha —
 * `Key Facts` ro'yxat emas, 2×2 oq karta grid (radius 16, padding 14, gap 3, value display
 * 20/700, label Geist 12); Mess qatorida toggle yo'q — `optional` yorlig'i bor; fees
 * kartasida action yo'q (`Apply Now` faqat University Card'da, `w-full`); University
 * Card'da rasm yuqorida (to'liq eni, 170px), badge label mono emas — Geist 11/600; gallery
 * gorizontal scroll-snap (300×170, gap 10).
 *
 * Motion (design.pen `Y8IYL` · Section map · qator 12 → #8 · 9 · 13 · 23):
 *   #13 — USD/INR segmented control faol fonni 0.5s da sirqashtiradi, raqamlar yangi
 *         valyutaga tween bo'ladi; jami summa ko'rinishda 0 dan 1.6s ga count-up.
 *         → `SegmentedToggle` + `FeeAmount` (view trigger faqat jami qatorida).
 *   #23 — Gallery `clip-path: inset(100%→0)` + `scale 1.15→1`, stagger 0.1s. BIEMU rasmida
 *         reveal yo'q (dizaynda statik birinchi surat).
 *   #8  — "Stat cards count-up" §3.10 da raqamli fakt yo'q: 4 ta fakt ham matn
 *         ("6 years" / "English" / "September, February" / "WHO · NMC · WDMS") — animatsiya
 *         faqat fees jami hisobida, shuning uchun `CountUp` emas, `FeeAmount`.
 *   #9  — "Badge marquee" ataylab qo'llanmadi: dizayn ramkasida badge'lar 2 ta STATIK
 *         qator (`v1TO8`/`RiW9N`); lenta 100% moslikni buzardi. Low-motion qatori
 *         ("badges wrap") shu statik qator bilan bajariladi.
 *
 * §6.2 #2 — reduced-motion: raqamlar darhol yakuniy qiymat (faqat 150ms CSS fade).
 *
 * Qaror `Download fee structure` tugmasi YOK: PLAN.md D6/H6 — `public/downloads/` bo'sh,
 * fee PDF keyin. "Dead link = 0" (F5.10) sharti ustun.
 */

type KeyFact = { value: string; label: string }
type FeeItem = { label: string; usd: number; inr: number }
type Currency = 'usd' | 'inr'

type Fees = {
  title: string
  exampleNote: string
  currencyLabel: string
  currency: Record<Currency, string>
  optional: string
  items: FeeItem[]
  totalLabel: string
  totalHint: string
  totalUsd: number
  totalInr: number
  totalNoteUsd: string
  totalNoteInr: string
  applyNow: string
}

const CURRENCIES: Currency[] = ['usd', 'inr']
const SYMBOLS: Record<Currency, string> = { usd: '$', inr: '₹' }

/** #13 — valyuta almashganda raqam tween (0.5s); #8 — jami count-up (1.6s). */
const TWEEN_DUR = 0.5
const COUNT_UP_DUR = 1.6

/** Mess qatori toggle ko'rsatadi — `fees.items[2]` (dizayn `j2XwJO`). */
const MESS_INDEX = 2

/** #23 — gallery stagger (0.1s, §6 "stagger 60–100ms"). */
const GALLERY_STAGGER = 0.1

/** Badgelarga dizayn ikonkalari (`yWS5Z`: badge-check · users · microscope · globe). */
const BADGE_ICONS = [IconBadgeCheck, IconUsers, IconMicroscope, IconGlobe]

/** Guruh — 2 ta qator (dizayn `v1TO8`/`RiW9N`), mobil ham xil. */
const BADGE_ROWS = 2

const GALLERY = [
  {
    webp: '/img/edu1-800.webp',
    avif: '/img/edu1-800.avif',
    srcSet: '/img/edu1-400.webp 400w, /img/edu1-800.webp 800w',
    width: 800,
    height: 532,
  },
  {
    webp: '/img/edu2-800.webp',
    avif: '/img/edu2-800.avif',
    srcSet: '/img/edu2-400.webp 400w, /img/edu2-800.webp 800w',
    width: 800,
    height: 1200,
  },
  {
    webp: '/img/edu3-800.webp',
    avif: '/img/edu3-800.avif',
    srcSet: '/img/edu3-400.webp 400w, /img/edu3-800.webp 800w',
    width: 800,
    height: 533,
  },
] as const

/** Modul darajasida — `FeeAmount` effektining `format` dependency'si barqaror bo'lsin. */
function formatAmount(value: number) {
  return Math.round(value).toLocaleString('en-US')
}

/**
 * #13 raqam tween + #8 jami count-up.
 *
 * SSR/no-JS: yakuniy qiymat JSX'da chiziladi (SEO + gidratatsiya mosligi).
 * `countUp` faqat jami qatorida — view trigger bilan 0 dan boshlanadi, bir marta. Keyingi
 * valyuta almashuvlarida joriy ko'rsatilgan qiymatdan 0.5s ga tween bo'ladi.
 */
function FeeAmount({
  value,
  symbol,
  countUp = false,
  className,
}: {
  value: number
  symbol: string
  countUp?: boolean
  className?: string
}) {
  const numberRef = useRef<HTMLSpanElement>(null)
  const shownRef = useRef(0)
  const countedRef = useRef(false)
  const { ready, reduced } = useSafeMotion()

  useIsomorphicLayoutEffect(() => {
    const el = numberRef.current
    if (!el || !ready) return

    if (reduced) {
      el.textContent = formatAmount(value)
      shownRef.current = value
      return
    }

    ensureGsap()
    const fromView = countUp && !countedRef.current
    const state = { value: fromView ? 0 : shownRef.current }

    const ctx = gsap.context(() => {
      gsap.to(state, {
        value,
        duration: fromView ? COUNT_UP_DUR : TWEEN_DUR,
        ease: EASE_SOFT,
        scrollTrigger: fromView ? { trigger: el, start: 'top 90%', once: true } : undefined,
        onStart: () => {
          if (fromView) countedRef.current = true
        },
        onUpdate: () => {
          el.textContent = formatAmount(state.value)
          shownRef.current = state.value
        },
      })
    }, el)

    return () => ctx.revert()
  }, [ready, reduced, value, countUp])

  return (
    <span className={cn('tabular-nums', className)}>
      {symbol}
      <span ref={numberRef}>{formatAmount(value)}</span>
    </span>
  )
}

/** Dizayn `m7PLCO` / `lWYRb` — intake chip (`edu-500/12%` yuzа, `edu-700` matn). */
function IntakeChip({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-pill bg-edu-500/12 px-3 py-[7px] md:gap-2 md:px-4 md:py-2.5">
      <IconCalendar className="size-[14px] shrink-0 text-edu-700 md:size-[15px]" />
      <span className="font-mono text-[10.5px] tracking-[1px] text-edu-700 md:text-[11px]">
        {label}
      </span>
    </span>
  )
}

/** Dizayn `r5skv`…`DINfM` — desktop fakt qatori (yuqori chiziq, mono 34 qiymat, 2 qatorli value). */
function FactRow({ fact }: { fact: KeyFact }) {
  return (
    <li className="flex flex-col gap-1.5 border-t border-ink-900/10 py-5 first:border-t-0">
      <p className="font-mono text-[34px] leading-[1.29] font-semibold whitespace-pre-line text-hi-light">
        {fact.value}
      </p>
      <p className="text-sm leading-[1.3] text-mid-light">{fact.label}</p>
    </li>
  )
}

/** Dizayn `kkTPr` va h.k. — mobil fakt kartasi (oq, radius 16, padding 14). */
function FactCard({ fact }: { fact: KeyFact }) {
  return (
    <li className="flex flex-col gap-[3px] rounded-[16px] bg-white p-3.5 ring-1 ring-ink-900/8 ring-inset">
      <p className="font-display text-[20px] leading-[1.15] font-bold whitespace-pre-line text-balance text-hi-light">
        {fact.value}
      </p>
      <p className="text-[12px] leading-[1.35] text-mid-light">{fact.label}</p>
    </li>
  )
}

/** Desktop: Mess ON ko'rsatkichi (40×24 `brand-500`, oq knob 18). Statik — narx izohi. */
function MessToggle() {
  return (
    <span
      aria-hidden="true"
      className="relative hidden h-6 w-10 shrink-0 rounded-pill bg-brand-500 md:block"
    >
      <span className="absolute top-[3px] right-[3px] size-[18px] rounded-pill bg-white" />
    </span>
  )
}

function FeeRow({
  item,
  index,
  currency,
  optional,
}: {
  item: FeeItem
  index: number
  currency: Currency
  optional: string
}) {
  const isMess = index === MESS_INDEX

  return (
    <li className="flex items-center justify-between gap-4">
      <span className="flex min-w-0 items-center gap-2 md:gap-3">
        {/* Mess qatori: mobil `mid-light`/normal (`dtm3y`), desktop `hi-light`/500 (`Peh3n`). */}
        <span
          className={cn(
            'text-[13.5px] leading-[1.5] md:text-[15.5px]',
            isMess ? 'text-mid-light md:font-medium md:text-hi-light' : 'text-mid-light',
          )}
        >
          {item.label}
        </span>

        {isMess ? (
          <>
            <MessToggle />
            {/* Mobil: toggle yo'q — `optional` yorlig'i (dizayn `Im9Tp`). */}
            <span className="inline-flex shrink-0 items-center rounded-pill bg-ink-900/8 px-2 py-[3px] text-[10px] leading-[1.2] text-mid-light md:hidden">
              {optional}
            </span>
          </>
        ) : null}
      </span>

      <FeeAmount
        value={item[currency]}
        symbol={SYMBOLS[currency]}
        className="shrink-0 text-[13.5px] leading-[1.5] font-semibold text-hi-light md:font-mono md:text-base md:font-normal"
      />
    </li>
  )
}

/**
 * Dizayn `jPxST` (desktop) / `y6awNl`+`vBxzw` (mobile) — 2 qatorli badge'lar.
 * Farqlar: mobil yuzа `ink-900/4%` va label Geist 11/600; desktop `ink-900/5%` va mono 11.
 */
function BadgeRows({ badges }: { badges: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: BADGE_ROWS }, (_, row) => (
        <div key={row} className="flex flex-wrap gap-2">
          {badges.slice(row * 2, row * 2 + 2).map((badge, index) => {
            const Icon = BADGE_ICONS[row * 2 + index]
            return (
              <span
                key={badge}
                className="inline-flex w-fit items-center gap-1.5 rounded-pill bg-ink-900/[0.04] px-3 py-[7px] md:gap-[7px] md:bg-ink-900/5"
              >
                <Icon className="size-[13px] shrink-0 text-brand-500" />
                <span className="text-[11px] leading-[1.4] font-semibold text-hi-light md:font-mono md:font-normal">
                  {badge}
                </span>
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function Gallery() {
  const { t } = useTranslation()
  const alts = [
    t('mbbs.gallery.alt1'),
    t('mbbs.gallery.alt2'),
    t('mbbs.gallery.alt3'),
  ]

  return (
    /* Mobil: gorizontal scroll-snap (dizayn `o7ft4H` — clip + 300×170 + gap 10). */
    <div className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-4 md:snap-none md:overflow-visible">
      {GALLERY.map((image, index) => (
        <ImageReveal
          key={image.webp}
          src={image.webp}
          srcSet={image.srcSet}
          alt={alts[index]}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1280px) 276px, 300px"
          delay={index * GALLERY_STAGGER}
          wrapperClassName="h-[170px] w-[300px] shrink-0 snap-start rounded-md md:h-[180px] md:w-auto md:flex-1"
        />
      ))}
    </div>
  )
}

export function StudyMBBS() {
  const { t } = useTranslation()
  const [currency, setCurrency] = useState<Currency>('usd')

  const facts = t('mbbs.keyFacts', { returnObjects: true }) as unknown as KeyFact[]
  const fees = t('mbbs.fees', { returnObjects: true }) as unknown as Fees
  const badges = t('mbbs.university.badges', { returnObjects: true }) as unknown as string[]

  const total = currency === 'usd' ? fees.totalUsd : fees.totalInr

  return (
    <section id="study-mbbs" className="bg-paper-50" data-testid="study-mbbs">
      <Container className="flex flex-col gap-5 py-16 md:gap-10 md:py-4xl">
        {/* --- Section head: eyebrow + H2 + intake chip --- */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="flex flex-col gap-3 md:w-[760px] md:shrink-0">
            <p className="font-mono text-[11px] tracking-[2px] text-stories uppercase md:text-xs">
              {t('mbbs.eyebrow')}
            </p>

            <h2 className="font-display text-[24px] leading-[1.15] font-bold text-balance text-hi-light md:text-[44px] md:leading-[1.05]">
              {t('mbbs.title')}
            </h2>
          </div>

          <IntakeChip label={t('mbbs.chip')} />
        </div>

        {/* --- Body: key facts (chap) + fees / university / gallery (o'ng) --- */}
        {/* Ikki ustun faqat `xl` (1280+) dan: 380 + 40 + 860 = 1280 = `--container-page`. */}
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:gap-10">
          <div className="flex flex-col gap-5 md:gap-0 xl:w-[380px] xl:shrink-0">
            <p className="font-mono text-[10.5px] tracking-[1px] text-mid-light md:text-[11px] md:tracking-[1.5px]">
              {t('mbbs.keyFactsLabel')}
            </p>

            {/* Mobil: 2×2 oq karta grid (dizayn `cZNuy`). */}
            <ul className="grid grid-cols-2 gap-2.5 md:hidden">
              {facts.map((fact) => (
                <FactCard key={fact.value} fact={fact} />
              ))}
            </ul>

            {/* Desktop: ajratgichli ro'yxat (dizayn `YYaGq`). */}
            <ul className="hidden md:flex md:flex-col">
              {facts.map((fact) => (
                <FactRow key={fact.value} fact={fact} />
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5 md:gap-lg xl:flex-1">
            {/* --- ① Fees calculator (#13) --- */}
            <div className="flex flex-col gap-3 rounded-md bg-white p-[18px] ring-1 ring-ink-900/8 ring-inset md:gap-4 md:rounded-lg md:p-7 md:shadow-bento">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-[20px] font-bold text-hi-light md:text-[24px] md:leading-[1.2]">
                  {fees.title}
                </h3>

                <SegmentedToggle
                  label={fees.currencyLabel}
                  value={currency}
                  onChange={(id) => setCurrency(id as Currency)}
                  options={CURRENCIES.map((id) => ({ id, label: fees.currency[id] }))}
                />
              </div>

              <p className="text-[11.5px] leading-[1.4] text-mid-light md:text-xs">
                {fees.exampleNote}
              </p>

              <ul className="flex flex-col gap-3 md:gap-4">
                {fees.items.map((item, index) => (
                  <FeeRow
                    key={item.label}
                    item={item}
                    index={index}
                    currency={currency}
                    optional={fees.optional}
                  />
                ))}
              </ul>

              <div aria-hidden="true" className="h-px w-full bg-ink-900/8 md:bg-ink-900/10" />

              <div className="flex items-end justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="font-mono text-[10px] tracking-[1px] text-mid-light md:text-[11px] md:tracking-[1.5px]">
                    {fees.totalLabel}
                  </p>
                  <p className="text-[12px] leading-[1.4] text-mid-light md:text-[13px]">
                    {fees.totalHint}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <FeeAmount
                    value={total}
                    symbol={SYMBOLS[currency]}
                    countUp
                    className="font-display text-[26px] leading-[1.15] font-bold text-hi-light md:font-mono md:text-[40px] md:leading-[1.3] md:font-bold"
                  />
                  <p className="text-[11px] leading-[1.2] text-mid-light md:font-mono md:text-xs">
                    {currency === 'usd' ? fees.totalNoteUsd : fees.totalNoteInr}
                  </p>
                </div>
              </div>

              {/* Mobil: bu kartada action yo'q — `Apply Now` University Card ichida. */}
              <div className="hidden pt-1 md:flex">
                <ButtonLink
                  href="#registration"
                  onClick={(event) => onAnchorClick(event, '#registration')}
                  arrow
                  data-testid="mbbs-fees-apply"
                >
                  {fees.applyNow}
                </ButtonLink>
              </div>
            </div>

            {/* --- ② University card (featured partner: BIEMU) --- */}
            <article className="flex flex-col overflow-hidden rounded-md bg-white ring-1 ring-ink-900/8 ring-inset md:min-h-[264px] md:flex-row md:rounded-lg md:shadow-bento">
              <div className="h-[170px] shrink-0 md:h-auto md:w-[300px] md:shrink-0">
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/img/bitu3-320.avif 320w, /img/bitu3-640.avif 640w"
                    sizes="(min-width: 1280px) 300px, 100vw"
                  />
                  <source
                    type="image/webp"
                    srcSet="/img/bitu3-320.webp 320w, /img/bitu3-640.webp 640w"
                    sizes="(min-width: 1280px) 300px, 100vw"
                  />
                  <img
                    src="/img/bitu3-640.webp"
                    alt={t('mbbs.university.imageAlt')}
                    width={640}
                    height={640}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </picture>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-[18px] md:justify-between md:p-[26px]">
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-[24px] leading-[1.2] font-bold text-hi-light md:text-[30px]">
                    {t('mbbs.university.shortName')}
                  </h3>
                  <p className="text-sm leading-[1.5] text-mid-light md:text-[15px]">
                    {t('mbbs.university.full')}
                  </p>
                </div>

                <BadgeRows badges={badges} />

                <div className="pt-1">
                  <ButtonLink
                    href="#registration"
                    onClick={(event) => onAnchorClick(event, '#registration')}
                    arrow
                    className="w-full"
                    data-testid="mbbs-university-apply"
                  >
                    {fees.applyNow}
                  </ButtonLink>
                </div>
              </div>
            </article>

            {/* --- ③ Campus gallery (#23, staggered) --- */}
            <Gallery />
          </div>
        </div>
      </Container>
    </section>
  )
}