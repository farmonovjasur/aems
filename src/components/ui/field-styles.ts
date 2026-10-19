import { cn } from '../../lib/cn'

/*
 * F3.4 — form maydon stil yordamchisi (Input.tsx fast-refresh talabiga ko'ra alohida modul).
 * Registration forma uchun dizayn aniq (design.pen `zbhMY` desktop / `lTQlI` mobil):
 *   mobil 390 — yuzа `hi-dark` (#F4F6FB), balandlik 48px, matn 15px;
 *   desktop 1440 — yuzа `white`, balandlik 52px, matn 16px.
 *   Ring 1px `ink-900/12`; fokus — ring 2px `brand-500` + 8px glow (#18 "focus glow").
 * Balandlik `Input`/`Select`/`Textarea` ichida beriladi (bir xil klass ikki holatda
 * balandlikni o'zgartirsa, arbitrary qiymat tartibi CSS'da noaniqlashadi).
 */

export function fieldClasses(state: 'default' | 'error' | 'success', className?: string) {
  return cn(
    'w-full rounded-sm bg-hi-dark px-md text-[15px] text-hi-light md:bg-white md:text-base',
    'placeholder:text-mid-light',
    'ring-1 ring-ink-900/12 ring-inset',
    'transition-shadow ease-out-soft duration-(--duration-fast)',
    'hover:ring-ink-900/20',
    'focus:ring-2 focus:ring-brand-500',
    /* Xato holatda glow yo'q (design.pen `kPmxa`: faqat `error` ring). */
    state !== 'error' && 'focus:shadow-glow-brand-sm',
    state === 'error' && 'ring-error hover:ring-error focus:ring-error',
    state === 'success' && 'ring-success hover:ring-success focus:ring-success',
    'disabled:pointer-events-none disabled:opacity-50',
    className,
  )
}

/** Input / Select balandligi: mobil 48px · desktop 52px (design.pen `Xyxfh` / `MsxxO`). */
export const FIELD_HEIGHT = 'h-12 md:h-[52px]'

/** Textarea balandligi: mobil 96px · desktop 140px (design.pen `ynf1B` / `X38syi`). */
export const TEXTAREA_HEIGHT = 'h-24 md:h-[140px]'
