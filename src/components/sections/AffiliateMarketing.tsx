import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CONTACT } from '../../lib/contacts'
import { FlowSequence } from '../motion/FlowSequence'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { IconArrow, IconArrowDown, IconMessageCircle } from '../ui/icons'

/*
 * F6.7 — 07 · Affiliate Marketing — design.pen §3.07 (`X9FyIL` desktop · `c7TNL` mobile).
 *
 * Desktop (X9FyIL · 1440 · ink-900 · 611px): 1280 kontent, pt/pb 104, ikki ustun (gap 64):
 *   chap 600px (gap 20: eyebrow mono 12/2 gold-500 · H2 46/1.05 display 700 ·
 *   2× body 16/1.6 · pt-8 CTA qatori gap 14) → o'ng `fill` (gap 20): **Flow Card**
 *   (radius 24, `bg-white/[0.06]`, ring white/8, p 28, gap 12) + **Outcome Chips** (gap 10).
 *   Flow card: 3 ta node (radius 16, `bg-white/4`, ring white/8, px 18 py 16, gap 3 —
 *   o'rta nodeda mono 12 subtitle) + 2 ta connector (h 22, markazda lucide `arrow-down` 16,
 *   mid-dark) + pastki 4px spacer (X9FyIL TTIk2) → kartaning pastki bo'shliq 44px.
 *
 * Mobile (c7TNL · 390 · gutter 20): bitta ustun, gap 22, py 64 → eyebrow mono 11/2 ·
 *   H2 24 · body 15/1.55 · Flow Card (radius 20, p 20, gap 10, node gap 6, title 17/600) —
 *   chip'lar **oxirgi node ichida** (pt 4, gap 8, label 400) · CTA'lar kartadan keyin,
 *   to'liq kenglikda, gap 10.
 *
 * CTA: Primary "Try a trial business boost" → #registration (tanlovda "Affiliate" bor),
 *   Secondary "Talk to us" → WhatsApp (lucide `message-circle`, Cytotron CTA kabi).
 *   Tugmalar `md` breakpointida to'liq kenglikda emas (X9FyIL FKkU5: inline).
 *
 * Motion: design.pen `Y8IYL` · Section map · qator 09 → "—" (maxsus effekt yo'q):
 *   #09 — flow node'lar va strelkalar mantiqiy tartibda stagger bilan fade / chiziladi,
 *   dur-base → `FlowSequence`. Chap ustun statik (effect "—" — section'da fade-up yo'q).
 *   Reduced-motion: hammasi birga 150ms fade, chizishsiz.
 */

type FlowCopy = {
  product: string
  research: string
  researchMeta: string
  customers: string
  channels: string[]
}

/* X9FyIL UCnaW / c7TNL qZi0i — yuzalar: `bg-white/[0.06]` + `ring-white/[0.08]` (nested card emas, design'da shu). */
const CARD_SURFACE = 'bg-white/[0.06] ring-1 ring-white/[0.08] ring-inset'
/* X9FyIL Pn7Wc — node ichidagi yuzalar: `bg-white/[0.04]` + `ring-white/[0.08]`. */
const NODE_SURFACE = 'bg-white/[0.04] ring-1 ring-white/[0.08] ring-inset'

function FlowNode({
  title,
  meta,
  children,
}: {
  title: string
  meta?: string
  children?: ReactNode
}) {
  return (
    <div
      data-flow-step
      className={`flex flex-col gap-1.5 rounded-[16px] px-[18px] py-4 md:gap-[3px] ${NODE_SURFACE}`}
    >
      <p className="font-display text-[17px] leading-[1.2] font-semibold text-hi-dark md:font-bold">
        {title}
      </p>

      {meta ? <p className="font-mono text-[12px] leading-[1.35] text-mid-dark">{meta}</p> : null}

      {children}
    </div>
  )
}

/* X9FyIL C60eM/z1nwEm · 22px konteyner, markazda lucide `arrow-down` 16 · mobil: balandlik tabiiy (c7TNL u8U2on). */
function FlowConnector() {
  return (
    <div data-flow-step className="flex items-center justify-center md:h-[22px]">
      <IconArrowDown data-flow-draw className="size-4 text-mid-dark" />
    </div>
  )
}

/* X9FyIL ruAUE/WC20L/AliM6 (label 600) · c7TNL wkyvZ (label 400) — bitta komponent, breakpoint farqi. */
function OutcomeChip({ children }: { children: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-pill bg-white/[0.08] px-4 py-[9px] text-[13px] leading-[1.3] font-normal text-hi-dark md:font-semibold">
      {children}
    </span>
  )
}

function AffiliateCtas() {
  const { t } = useTranslation()

  return (
    <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:items-center md:gap-3.5">
      <ButtonLink
        href="#registration"
        variant="primary"
        trailingIcon={
          <IconArrow className="size-4 shrink-0 transition-transform ease-out-soft duration-(--duration-fast) group-hover/btn:translate-x-0.5" />
        }
        className="w-full justify-center md:w-auto"
        data-testid="affiliate-cta-primary"
      >
        {t('affiliate.ctaPrimary')}
      </ButtonLink>

      <ButtonLink
        href={CONTACT.whatsapp}
        target="_blank"
        rel="noreferrer noopener"
        variant="secondary"
        trailingIcon={
          <IconMessageCircle className="size-4 shrink-0 transition-transform ease-out-soft duration-(--duration-fast) group-hover/btn:translate-x-0.5" />
        }
        className="w-full justify-center md:w-auto"
        data-testid="affiliate-cta-whatsapp"
      >
        {t('common.talkToUs')}
      </ButtonLink>
    </div>
  )
}

export function AffiliateMarketing() {
  const { t } = useTranslation()
  const flow = t('affiliate.flow', { returnObjects: true }) as unknown as FlowCopy

  return (
    <section id="affiliate-marketing" className="bg-ink-900" data-testid="affiliate-marketing">
      <Container className="flex flex-col gap-[22px] py-16 md:py-[104px]">
        <div className="flex flex-col gap-[22px] md:flex-row md:gap-16">
          {/* --- Chap ustun (desktop 600px) --- */}
          <div className="flex flex-col gap-[22px] md:w-[600px] md:shrink-0 md:gap-5">
            <p className="font-mono text-[11px] tracking-[2px] text-gold-500 uppercase md:text-xs">
              {t('affiliate.eyebrow')}
            </p>

            <h2 className="font-display text-[24px] leading-[1.05] font-bold text-balance text-hi-dark md:text-[46px]">
              {t('affiliate.title')}
            </h2>

            <p className="text-[15px] leading-[1.55] text-mid-dark md:text-base md:leading-[1.6]">
              {t('affiliate.body1')}
            </p>

            <p className="text-[15px] leading-[1.55] text-mid-dark md:text-base md:leading-[1.6]">
              {t('affiliate.body2')}
            </p>

            {/* X9FyIL XPPPf — pt 8 + inline CTA qatori (mobil: quyida, to'liq kenglikda). */}
            <div className="hidden pt-2 md:block">
              <AffiliateCtas />
            </div>
          </div>

          {/* --- O'ng ustun: flow card + natijalar --- */}
          <div className="flex flex-col gap-[22px] md:flex-1 md:gap-5">
            <div
              className={`flex flex-col gap-2.5 rounded-[20px] p-5 md:gap-3 md:rounded-[24px] md:p-7 ${CARD_SURFACE}`}
            >
              {/* `contents` — kartaning flex gap'i node'lar orasida saqlanadi (#09 targetlari
                  shu wrapper ichida `[data-flow-step]` bo'yicha topiladi). */}
              <FlowSequence className="contents">
                <FlowNode title={flow.product} />

                <FlowConnector />

                <FlowNode title={flow.research} meta={flow.researchMeta} />

                <FlowConnector />

                <FlowNode title={flow.customers}>
                  {/* c7TNL GCYB1 — mobil'da chip'lar oxirgi node ichida (desktopda pastda). */}
                  <div className="flex flex-wrap gap-2 pt-1 md:hidden">
                    {flow.channels.map((channel) => (
                      <OutcomeChip key={channel}>{channel}</OutcomeChip>
                    ))}
                  </div>
                </FlowNode>

                {/* X9FyIL TTIk2 — 4px: kartaning pastki bo'shlig'ini 44px ga chiqaradi. */}
                <div aria-hidden="true" className="hidden h-1 md:block" />
              </FlowSequence>
            </div>

            {/* X9FyIL ChvZx — natija chiplari (desktopda kartadan tashqarida). */}
            <div className="hidden flex-wrap gap-2.5 md:flex">
              {flow.channels.map((channel) => (
                <OutcomeChip key={channel}>{channel}</OutcomeChip>
              ))}
            </div>
          </div>
        </div>

        {/* Mobil CTA'lar (c7TNL lDa3N) — kartadan keyin, to'liq kenglikda. */}
        <div className="md:hidden">
          <AffiliateCtas />
        </div>
      </Container>
    </section>
  )
}
