import { useId, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { IconPlus } from './icons'

/*
 * F3.5 — Accordion (§2): row + `+` ikonka.
 * Height: CSS grid 0fr→1fr (o'lchashsiz, silliq) · ikonka 45° aylanadi.
 * tone: 'light' (light section) · 'dark' (F5 — Footer kolonkalari).
 *
 * Motion #17 — motion notes: accordion height ease + `+` 45° aylanish, 0.4s.
 * Faqat Footer ishlatadi (Admission mobil kartalari design.pen `kX8iH` bo'yicha statik).
 */

export type AccordionTone = 'light' | 'dark'

export function Accordion({
  tone = 'light',
  className,
  children,
}: {
  tone?: AccordionTone
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'divide-y',
        tone === 'dark' ? 'divide-white/10' : 'divide-hi-light/10',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function AccordionItem({
  title,
  tone = 'light',
  defaultOpen = false,
  className,
  children,
}: {
  title: ReactNode
  tone?: AccordionTone
  defaultOpen?: boolean
  className?: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  const dark = tone === 'dark'

  return (
    <div className={className}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            'flex w-full items-center justify-between gap-md rounded-sm px-md py-lg text-left',
            'transition-colors ease-out-soft duration-(--duration-fast)',
            dark ? 'hover:bg-white/[0.04]' : 'hover:bg-hi-light/[0.04]',
            open && (dark ? 'bg-white/[0.06]' : 'bg-hi-light/[0.06]'),
          )}
        >
          <span
            className={cn(
              'font-display text-lg leading-snug font-semibold md:text-xl',
              dark ? 'text-hi-dark' : 'text-hi-light',
            )}
          >
            {title}
          </span>
          <IconPlus
            className={cn(
              'shrink-0 transition-transform ease-out-soft duration-(--duration-base)',
              dark ? 'text-mid-dark' : 'text-mid-light',
              open && 'rotate-45',
            )}
          />
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        inert={!open}
        className={cn(
          'grid transition-[grid-template-rows] ease-out-soft duration-(--duration-base)',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              'px-md pb-lg text-[15px]',
              dark ? 'text-mid-dark' : 'text-mid-light',
              open && (dark ? 'bg-white/[0.06]' : 'bg-hi-light/[0.06]'),
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
