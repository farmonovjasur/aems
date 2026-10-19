import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn'
import { Marquee } from '../motion/Marquee'
import {
  IconAward,
  IconBadgeCheck,
  IconCalendar,
  IconGlobe,
  IconHeartPulse,
  IconMapPin,
  IconShieldCheck,
  IconStethoscope,
} from '../ui/icons'

/*
 * F6.2 — 02 · Trust Marquee — design.pen §3.02:
 * Desktop (zIEfA): ink-900 fon, gradient hairline (top/bottom), 2 qatorli cheksiz
 *   marquee (40s linear, hover + off-screen'da pauza — motion #9). Badge: mono 12px,
 *   white/4 fon + white/8 stroke, 14px ikonka. 2-qator teskari yo'nalishda, 3 badge
 *   offset bilan (dizayndagi "Offset spacer").
 * Mobil (N7fvs — "02 · Trust & Stats"): stats (3 karta) + badge strip (autoplay marquee,
 *   o'ng tomonda fade). Stats qiymatlari `hero.stats.*` bilan bir xil.
 */

const BADGE_ICONS = [
  IconShieldCheck,
  IconBadgeCheck,
  IconAward,
  IconMapPin,
  IconHeartPulse,
  IconCalendar,
  IconGlobe,
  IconStethoscope,
] as const

type BadgeIcon = (typeof BADGE_ICONS)[number]

type Badge = {
  label: string
  Icon: BadgeIcon
}

const ROW_2_OFFSET = 3

function MarqueeBadge({ Icon, children }: { Icon: BadgeIcon; children: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-pill bg-white/[0.04] px-4 py-[9px] font-mono text-xs text-hi-dark ring-1 ring-white/[0.08] ring-inset">
      <Icon className="size-3.5 text-mid-dark" />
      {children}
    </span>
  )
}

function StripBadge({ Icon, children }: { Icon: BadgeIcon; children: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-white/[0.06] px-3 py-[7px] font-mono text-[11px] leading-[14px] text-mid-dark ring-1 ring-white/[0.1] ring-inset">
      <Icon className="size-[13px]" />
      {children}
    </span>
  )
}

function MobileStat({
  value,
  label,
  centered = false,
}: {
  value: string
  label: string
  centered?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-1.5 rounded-[18px] bg-white/[0.04] p-4 ring-1 ring-white/[0.08] ring-inset',
        centered && 'items-center text-center',
      )}
    >
      <p className="font-display text-[26px] leading-[1.2] font-bold text-hi-dark">{value}</p>
      <p className="font-mono text-[10px] leading-[1.4] tracking-[1px] text-mid-dark uppercase">
        {label}
      </p>
    </div>
  )
}

export function TrustMarquee() {
  const { t } = useTranslation()
  const labels = t('trust.badges', { returnObjects: true }) as unknown as string[]
  const badges: Badge[] = labels.map((label, index) => ({ label, Icon: BADGE_ICONS[index] }))
  const row2: Badge[] = [...badges.slice(ROW_2_OFFSET), ...badges.slice(0, ROW_2_OFFSET)]

  return (
    <section className="relative bg-ink-900">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-white/[0.12] md:bg-white/0 md:bg-linear-to-r md:from-transparent md:via-white/[0.18] md:to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-white/[0.12] md:bg-white/0 md:bg-linear-to-r md:from-transparent md:via-white/[0.18] md:to-transparent"
      />

      <div className="hidden flex-col gap-3.5 py-9 md:flex">
        <Marquee duration={40} gapClass="gap-3.5" padClass="pr-3.5">
          {badges.map(({ label, Icon }) => (
            <MarqueeBadge key={label} Icon={Icon}>
              {label}
            </MarqueeBadge>
          ))}
        </Marquee>

        <Marquee duration={40} reverse gapClass="gap-3.5" padClass="pr-3.5">
          <span aria-hidden="true" className="h-px w-px shrink-0" />
          {row2.map(({ label, Icon }) => (
            <MarqueeBadge key={label} Icon={Icon}>
              {label}
            </MarqueeBadge>
          ))}
        </Marquee>
      </div>

      <div className="flex flex-col gap-6 px-gutter py-[44px] md:hidden">
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-2.5">
            <MobileStat
              value={t('hero.stats.tuition.value')}
              label={t('hero.stats.tuition.label')}
            />
            <MobileStat value={t('hero.stats.years.value')} label={t('hero.stats.years.label')} />
          </div>
          <MobileStat
            centered
            value={t('hero.stats.accreditation.value')}
            label={t('hero.stats.accreditation.label')}
          />
        </div>

        <div className="relative" role="group" aria-label={t('trust.badgesLabel')}>
          <Marquee duration={40} gapClass="gap-2" padClass="pr-2">
            {badges.map(({ label, Icon }) => (
              <StripBadge key={label} Icon={Icon}>
                {label}
              </StripBadge>
            ))}
          </Marquee>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-11 bg-linear-to-r from-transparent to-ink-900"
          />
        </div>
      </div>
    </section>
  )
}
