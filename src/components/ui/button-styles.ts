import { cn } from '../../lib/cn'

/*
 * F3.1 — Button stil yordamchilari (Button.tsx fast-refresh talabiga ko'ra alohida modul).
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'whatsapp'
export type ButtonSize = 'md' | 'sm' | 'xs'

const BASE =
  'group/btn inline-flex select-none items-center justify-center rounded-pill font-medium transition-colors ease-out-soft duration-(--duration-fast) disabled:pointer-events-none'

const SIZES: Record<ButtonSize, string> = {
  md: 'gap-2.5 px-lg py-3.5 text-[15px]',
  sm: 'gap-2 px-md py-2.5 text-sm',
  xs: 'h-11 gap-2 px-md text-[12.5px] font-semibold',
}

const VARIANTS: Record<ButtonVariant, { base: string; disabled: string }> = {
  primary: {
    base: 'bg-brand-600 text-hi-dark hover:bg-brand-500 active:bg-brand-700',
    disabled: 'disabled:opacity-55',
  },
  secondary: {
    base: 'bg-white/[0.08] text-hi-dark ring-1 ring-white/[0.24] ring-inset hover:bg-white/[0.12] hover:ring-white/40 active:bg-white/[0.16]',
    disabled: 'disabled:opacity-50',
  },
  ghost: {
    base: 'bg-transparent text-hi-dark hover:bg-white/[0.06] active:bg-white/10',
    disabled: 'disabled:opacity-50',
  },
  whatsapp: {
    base: 'bg-whatsapp text-[#062B14] hover:bg-whatsapp-hover active:bg-whatsapp-pressed',
    disabled: 'disabled:opacity-55',
  },
}

export function buttonStyles(options: {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  className?: string
}) {
  const { variant = 'primary', size = 'md', loading = false, className } = options
  return cn(
    BASE,
    SIZES[size],
    VARIANTS[variant].base,
    !loading && VARIANTS[variant].disabled,
    loading && 'disabled:opacity-100',
    className,
  )
}
