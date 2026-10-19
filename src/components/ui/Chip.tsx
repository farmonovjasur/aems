import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

/*
 * F3.2 — Chip (§2): Mint / Violet / Gold / Neutral.
 * Fill: accent 12% → hover 20% → selected 25% + stroke.
 * `tone="neutral"` joriy matn rangini oladi (ota-komponent context'idan).
 * `size="sm"` — panel ichidagi kichik chip (design: pad 5×10 → 6×12 desktop, label 10.5 → 11px).
 */

export type ChipTone = 'mint' | 'violet' | 'gold' | 'neutral'
export type ChipSize = 'md' | 'sm'

const TONES: Record<ChipTone, string> = {
  mint: 'text-edu-500',
  violet: 'text-care-500',
  gold: 'text-gold-500',
  neutral: '',
}

const SIZES: Record<ChipSize, string> = {
  md: 'gap-sm px-3.5 py-2 font-mono text-xs leading-4 tracking-[1.5px]',
  sm: 'gap-1.5 px-2.5 py-[5px] font-mono text-[10.5px] leading-[14px] tracking-[1.5px] md:gap-[7px] md:px-3 md:py-1.5 md:text-[11px]',
}

const BASE = 'inline-flex w-fit items-center rounded-pill uppercase'

function chipStateClasses(selected: boolean, interactive: boolean) {
  return cn(
    'bg-current/[0.12]',
    interactive && 'transition-colors ease-out-soft duration-(--duration-fast) hover:bg-current/20',
    selected && 'bg-current/25 ring-1 ring-current/60',
  )
}

export type ChipProps = {
  tone?: ChipTone
  size?: ChipSize
  icon?: ReactNode
  selected?: boolean
  className?: string
  children: ReactNode
}

export function Chip({
  tone = 'neutral',
  size = 'md',
  icon,
  selected = false,
  className,
  children,
}: ChipProps) {
  return (
    <span
      className={cn(BASE, SIZES[size], TONES[tone], chipStateClasses(selected, false), className)}
    >
      {icon}
      {children}
    </span>
  )
}

export type ChipButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ChipProps & {
    selected?: boolean
  }

export function ChipButton({
  tone = 'neutral',
  size = 'md',
  icon,
  selected = false,
  className,
  children,
  type,
  ...rest
}: ChipButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      aria-pressed={selected}
      className={cn(
        BASE,
        SIZES[size],
        TONES[tone],
        chipStateClasses(selected, true),
        'cursor-pointer',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}

export { BASE as chipBaseClasses }
