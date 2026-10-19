import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { onAnchorClick } from '../../lib/anchors'
import { cn } from '../../lib/cn'
import { Container } from '../ui/Container'

/*
 * F6.4 — 04 · Cancer Treatment — design.pen §3.04.
 *
 * Desktop (rj3N3 · 1440 · paper-100 · 1350px):
 *   kirish (eyebrow mono 12/2 + H2 48/1.05 max 900 + body max 640) → 3 anchor pill
 *   (Targeted therapy / Cytotron / Radiation therapy, gap 12) → "Targeted radioligand therapy"
 *   header (pt 16, eyebrow + H3 32/1.1 + paragraf max 1000/1.6) → 3 izotop kartasi
 *   (411px, radius 24, `shadow-bento`, content bo'yicha balandlik — Tb-161 eng balandisi)
 *   → "Penetration range" chizig'i (symbol 72 · track · label 300).
 *   Bo'shliqlar: section 96 · kirish ichi 14/24 · bloklar orasida 44.
 *
 * Mobile (EZE1T + VfXKi · 390 · gutter 20):
 *   markazlashgan kirish + 44px tab bar (active = ink-900 to'ldirma, o'zgarish 150ms),
 *   kartalar bitta ustun (radius 20, `shadow` yo'q), penetration chizig'i vertikal
 *   (symbol + label bitta qator, track to'liq kenglikda). Bo'shliqlar: 64 / 22 / 28 / 20.
 *
 * Statik (F6 — motion'siz): pill/tab faqat `duration-fast` rang o'zgarishiga ega.
 * Izotop matnlari `cancer.targeted.isotopes` dan keladi; penetration chizig'i shu
 * 3 ta symbolni qayta ishlatadi (JSX takrorlanmasligi uchun).
 */

type Isotope = {
  symbol: string
  name: string
  type: string
  howLabel: string
  howText: string
  useLabel: string
  useText: string
}

/** Kirishdagi 3 yondashuv — sahifa ichidagi anchor (Nav dropdown bilan bir xil target'lar). */
const APPROACHES = [
  { id: 'targeted', hash: '#targeted' },
  { id: 'cytotron', hash: '#cytotron' },
  { id: 'radiation', hash: '#radiation' },
] as const

/** Penetration chizig'i — izotoplar bilan bir xil tartibda (design: 700/110/56 · 828px track). */
const RANGES = [
  { key: 'lu177', width: 'w-[84.5%]', bar: 'bg-brand-500' },
  { key: 'tb161', width: 'w-[13.3%]', bar: 'bg-brand-500 md:bg-care-500' },
  { key: 'ac225', width: 'w-[6.8%]', bar: 'bg-brand-500 md:bg-gold-500' },
] as const

/* Dizayn kartasi: paper-100 fon ustida oq yuzalar — `shadow-bento` faqat desktop'da. */
const CARD_SURFACE = 'bg-white ring-1 ring-ink-900/8 ring-inset md:shadow-bento'

function DetailBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-mono text-[10px] tracking-[1px] text-mid-light uppercase md:text-[11px] md:tracking-[1.5px]">
        {label}
      </p>
      <p className="text-[14.5px] leading-[1.55] text-hi-light md:text-base md:leading-[1.5]">
        {children}
      </p>
    </div>
  )
}

function IsotopeCard({ isotope }: { isotope: Isotope }) {
  return (
    <article
      className={cn(
        'flex flex-col gap-3.5 rounded-md p-5 md:rounded-[24px] md:gap-4 md:p-6',
        CARD_SURFACE,
      )}
    >
      <p className="font-display text-[32px] leading-[1.1] font-bold text-hi-light md:font-mono md:text-[40px]">
        {isotope.symbol}
      </p>

      <span className="inline-flex w-fit items-center rounded-pill bg-ink-900/[0.06] px-3 py-1.5 text-[11px] text-hi-light md:font-mono md:tracking-[1px]">
        {isotope.type}
      </span>

      <h3 className="font-display text-[18px] leading-[1.2] font-semibold text-hi-light md:text-[20px] md:font-bold">
        {isotope.name}
      </h3>

      <DetailBlock label={isotope.howLabel}>{isotope.howText}</DetailBlock>
      <DetailBlock label={isotope.useLabel}>{isotope.useText}</DetailBlock>
    </article>
  )
}

export function CancerTreatment() {
  const { t } = useTranslation()
  const isotopes = t('cancer.targeted.isotopes', { returnObjects: true }) as unknown as Isotope[]

  return (
    <section id="cancer-treatment" className="bg-paper-100">
      <Container className="flex flex-col gap-7 py-16 md:gap-11 md:py-4xl">
        <div className="flex flex-col gap-[22px] md:gap-6">
          <div className="flex flex-col gap-[22px] text-center md:gap-3.5 md:text-left">
            <p className="font-mono text-[11px] tracking-[2px] text-stories uppercase md:text-xs">
              {t('cancer.eyebrow')}
            </p>

            <h2 className="mx-auto font-display text-[24px] leading-[1.15] font-bold text-balance text-hi-light md:mx-0 md:max-w-[900px] md:text-[48px] md:leading-[1.05]">
              {t('cancer.title')}
            </h2>

            <p className="mx-auto max-w-[640px] text-[15px] leading-[1.55] text-mid-light md:mx-0 md:text-base">
              {t('cancer.body')}
            </p>
          </div>

          {/* Mobil: 3 ta teng kenglikdagi tab (active = ink-900 to'ldirma). */}
          <nav
            aria-label={t('cancer.eyebrow')}
            className="flex gap-2 md:hidden"
            data-testid="cancer-tab-bar"
          >
            {APPROACHES.map((approach, index) => (
              <a
                key={approach.id}
                href={approach.hash}
                onClick={(event) => onAnchorClick(event, approach.hash)}
                aria-current={index === 0 ? 'true' : undefined}
                data-testid={`cancer-tab-${index}`}
                className={cn(
                  'flex h-11 min-w-0 flex-1 items-center justify-center rounded-pill px-1 py-2.5 text-center text-[12.5px] font-semibold whitespace-nowrap',
                  'transition-colors ease-out-soft duration-150',
                  index === 0
                    ? 'bg-ink-900 text-white ring-1 ring-ink-900 ring-inset'
                    : 'bg-white text-hi-light ring-1 ring-ink-900/8 ring-inset hover:bg-ink-900/4',
                )}
              >
                {t(`cancer.tabs.${approach.id}`)}
              </a>
            ))}
          </nav>

          {/* Desktop: oq pill'lar — section ichidagi anchor. */}
          <nav aria-label={t('cancer.eyebrow')} className="hidden flex-wrap gap-3 md:flex">
            {APPROACHES.map((approach) => (
              <a
                key={approach.id}
                href={approach.hash}
                onClick={(event) => onAnchorClick(event, approach.hash)}
                data-testid={`cancer-pill-${approach.id}`}
                className="inline-flex items-center rounded-pill bg-white px-5 py-[11px] text-sm font-semibold text-hi-light ring-1 ring-ink-900/8 ring-inset transition-colors ease-out-soft duration-(--duration-fast) hover:bg-ink-900/4"
              >
                {t(`cancer.tabs.${approach.id}`)}
              </a>
            ))}
          </nav>
        </div>

        <div id="targeted" className="flex flex-col gap-5 md:gap-11">
          <header className="flex flex-col gap-3.5 md:pt-[16px]">
            <p className="font-mono text-[11px] tracking-[2px] text-stories uppercase md:text-xs">
              {t('cancer.targeted.eyebrow')}
            </p>

            <h3 className="font-display text-[24px] leading-[1.1] font-bold text-hi-light md:text-[32px]">
              {t('cancer.targeted.h3')}
            </h3>

            <p className="max-w-[1000px] text-[15px] leading-[1.55] text-mid-light md:text-base md:leading-[1.6]">
              {t('cancer.targeted.intro')}
            </p>
          </header>

          <div className="flex flex-col gap-3.5 md:grid md:grid-cols-3 md:items-start md:gap-6">
            {isotopes.map((isotope) => (
              <IsotopeCard key={isotope.symbol} isotope={isotope} />
            ))}
          </div>

          <div className={cn('flex flex-col gap-4 rounded-md p-5', CARD_SURFACE)}>
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display text-[16px] leading-[1.2] font-semibold text-hi-light md:text-[20px] md:font-bold">
                {t('cancer.targeted.penetration.title')}
              </h3>
              <p className="shrink-0 font-mono text-[10px] text-mid-light md:text-[11px] md:tracking-[1px]">
                {t('cancer.targeted.penetration.note')}
              </p>
            </div>

            {RANGES.map((range, index) => (
              <div key={range.key} className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                {/* Desktop: symbol 72px · track · label 300px (bitta qator). */}
                <span className="hidden w-[72px] shrink-0 font-mono text-[13px] font-bold text-hi-light md:block">
                  {isotopes[index]?.symbol}
                </span>
                <span className="flex items-center justify-between gap-3 md:hidden">
                  <span className="font-mono text-xs text-hi-light">{isotopes[index]?.symbol}</span>
                  <span className="text-[13px] text-mid-light">
                    {t(`cancer.targeted.penetration.${range.key}`)}
                  </span>
                </span>

                <div className="flex h-2 flex-1 items-center overflow-hidden rounded-pill bg-ink-900/4">
                  <div className={cn('h-2 rounded-pill', range.width, range.bar)} />
                </div>

                <span className="hidden w-[300px] shrink-0 text-sm text-mid-light md:block">
                  {t(`cancer.targeted.penetration.${range.key}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}