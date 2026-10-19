import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/*
 * F3.3 — GlassCard · StatCard · BentoCard (§2).
 * Uchtasi ham dark surface uchun mo'ljallangan (hero/bento/care).
 */

export function GlassCard({
  title,
  className,
  children,
}: {
  title?: ReactNode
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 rounded-lg bg-white/[0.06] p-lg ring-1 ring-white/[0.08] ring-inset',
        'transition-colors ease-out-soft duration-(--duration-base) hover:bg-white/10 hover:ring-white/[0.16]',
        className,
      )}
    >
      {title ? (
        <h3 className="font-display text-[17px] leading-snug font-semibold text-hi-dark">
          {title}
        </h3>
      ) : null}
      {children ? <div className="text-sm text-mid-dark">{children}</div> : null}
    </div>
  )
}

export type StatCardTone = 'brand' | 'mint' | 'violet'

const STAT_DOTS: Record<StatCardTone, string> = {
  brand: 'bg-brand-500',
  mint: 'bg-edu-500',
  violet: 'bg-care-500',
}

export function StatCard({
  value,
  label,
  tone = 'brand',
  className,
}: {
  value: ReactNode
  label: ReactNode
  tone?: StatCardTone
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-sm rounded-md bg-white/[0.04] px-[22px] py-5 ring-1 ring-white/[0.08] ring-inset',
        className,
      )}
    >
      <p className="font-mono text-[32px] leading-[1.3] font-semibold text-hi-dark tabular-nums">
        {value}
      </p>
      <p className="flex items-center gap-sm font-mono text-[11px] tracking-[1px] text-mid-dark uppercase">
        <span aria-hidden="true" className={cn('size-1.5 rounded-pill', STAT_DOTS[tone])} />
        {label}
      </p>
    </div>
  )
}

export type BentoCardTone = 'mint' | 'violet' | 'gold' | 'neutral'

const BENTO_TONES: Record<BentoCardTone, string> = {
  mint: 'text-edu-500',
  violet: 'text-care-500',
  gold: 'text-gold-500',
  neutral: 'text-hi-dark',
}

export function BentoCard({
  title,
  tone = 'neutral',
  className,
  children,
}: {
  title?: ReactNode
  tone?: BentoCardTone
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-sm rounded-lg bg-ink-800 p-lg', className)}>
      {title ? (
        <h3 className={cn('font-display text-2xl leading-tight font-semibold', BENTO_TONES[tone])}>
          {title}
        </h3>
      ) : null}
      {children ? <div className="text-sm text-mid-dark">{children}</div> : null}
    </div>
  )
}
