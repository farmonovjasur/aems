import { useRef, type KeyboardEvent } from 'react'
import { useIsomorphicLayoutEffect } from '../../lib/motion'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn'

/*
 * F6.10 — SegmentedToggle — motion notes · Effects #13 (05 · Medical degree, `yWS5Z` `fXh13`).
 *
 * Nima uchun `Tabs` emas: `Tabs variant="segment"` How it works uchun yasalgan —
 * label 13.5/14px Geist, py-11/10, px-22. Dizayn bu yerda boshqacha: mono 11/12px,
 * py-5/7, px-12/16, faol pill mobil `white` (soya'siz), desktop `ink-900`.
 * Chiqarish/kiritish umumiy, tipografiya xos → alohida primitiv.
 *
 * Track `ink-900/6` · radius 999 · padding 3 · gap 3 · faol pill sirqashadi (0.5s — #13
 * "segmented control slides its active background", Map row 12). Faol pill oynadan keyin
 * o'lchanadi — SSR'da `opacity: 0` (gidratatsiya mos, `Tabs` bilan bir xil usul).
 *
 * Semantika: bitta tanlov → `radiogroup` / `radio` (roloviy tab emas), roving tabindex
 * va ←/→/Home/End klaviaturasi (`Radio.tsx` bilan bir xil model).
 */

export type SegmentedOption = { id: string; label: string }

const BASE =
  'isolate relative flex w-auto items-center gap-[3px] rounded-pill bg-ink-900/6 p-[3px]'

/** Faol pill: mobil `white` (#FFF, soya dizaynda yo'q), desktop `ink-900`. */
const PILL =
  'pointer-events-none absolute top-[3px] bottom-[3px] left-0 w-0 rounded-pill bg-white opacity-0 transition-[left,width,opacity] duration-500 ease-out-soft md:bg-ink-900'

/**
 * Segment: mono 11/600 · label `leading-[14px]` (dizayn `A88ii` — segment 44×24 = 5+14+5);
 * desktop mono 12/normal · label `leading-4` (`fXh13` — segment 54×30 = 7+16+7).
 * Track shu sababli mobil 97×30, desktop 117×36 — dizayn bound'lari bilan 1:1.
 */
const SEGMENT =
  'relative z-[1] flex cursor-pointer justify-center rounded-pill px-3 py-[5px] font-mono text-[11px] leading-[14px] font-semibold transition-colors ease-out-soft duration-(--duration-fast) md:px-4 md:py-[7px] md:text-xs md:leading-4 md:font-normal'

export function SegmentedToggle({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: SegmentedOption[]
  value: string
  onChange: (id: string) => void
  label: string
  className?: string
}) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const { i18n } = useTranslation()
  const listRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const activeIndex = options.findIndex((option) => option.id === value)

  useIsomorphicLayoutEffect(() => {
    const list = listRef.current
    const pill = pillRef.current
    if (!list || !pill) return

    const place = () => {
      const active = buttonRefs.current[activeIndex]
      if (!active) return
      pill.style.left = `${active.offsetLeft}px`
      pill.style.width = `${active.offsetWidth}px`
      pill.style.opacity = '1'
    }

    place()

    const observer = new ResizeObserver(place)
    observer.observe(list)
    for (const button of buttonRefs.current) if (button) observer.observe(button)
    return () => observer.disconnect()
  }, [activeIndex, options])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = options.findIndex((option) => option.id === value)
    let nextIndex = -1

    const rtl = i18n.dir() === 'rtl'
    const nextKey = rtl ? 'ArrowLeft' : 'ArrowRight'
    const prevKey = rtl ? 'ArrowRight' : 'ArrowLeft'

    if (event.key === nextKey) nextIndex = (currentIndex + 1) % options.length
    else if (event.key === prevKey)
      nextIndex = (currentIndex - 1 + options.length) % options.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = options.length - 1

    if (nextIndex === -1) return
    event.preventDefault()

    const next = options[nextIndex]
    if (!next) return
    onChange(next.id)
    buttonRefs.current[nextIndex]?.focus()
  }

  return (
    <div
      ref={listRef}
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn(BASE, className)}
    >
      <span ref={pillRef} aria-hidden="true" className={PILL} />

      {options.map((option, index) => {
        const selected = option.id === value

        return (
          <button
            key={option.id}
            ref={(element) => {
              buttonRefs.current[index] = element
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.id)}
            data-testid={`segmented-${option.id}`}
            className={cn(
              SEGMENT,
              selected ? 'text-neutral-900 md:text-hi-dark' : 'text-mid-light hover:text-hi-light',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}