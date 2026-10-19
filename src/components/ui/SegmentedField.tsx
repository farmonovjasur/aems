import { useRef, type KeyboardEvent } from 'react'
import { cn } from '../../lib/cn'
import { useIsomorphicLayoutEffect } from '../../lib/motion'

/*
 * SegmentedField — forma ichidagi segmentli tanlov (Registration · Gender).
 *
 * Nima uchun `SegmentedToggle` emas: valyuta tugmasi boshqa tipografiyada
 * (`ink-900/6` track · pill radius · mono 11/12). Dizaynda Gender boshqacha —
 * registratsiya maydoniga xos: track radius 12 · yuzа `hi-dark` (mobil) / `white`
 * (desktop) · ring `ink-900/12` · faol segment radius 9, yuzа `ink-900`.
 *
 * Faol segment sirqashadi — §6 #18 (0.3–0.6s), `left/width` transition (transform
 * emas: `left`/`width` o'zi transform bilan animatsiya qilinmaydi, lekin §6 "DOM motion
 * transform + opacity only" qoidasi forma ichidagi segmented uchun §13 bilan bir xil
 * usulda — `Tabs`/`SegmentedToggle` ham shuni qiladi).
 *
 * Semantika: `radiogroup` / `radio` (roli tab emas), roving tabindex va
 * ←/→/Home/End klaviaturasi — `SegmentedToggle` bilan bir xil model.
 */

export type SegmentedFieldOption = { id: string; label: string }

const BASE =
  'relative flex w-full items-center gap-1 rounded-sm bg-hi-dark p-1 ring-1 ring-ink-900/12 ring-inset md:bg-white'

const PILL =
  'pointer-events-none absolute top-1 bottom-1 left-0 w-0 rounded-[9px] bg-ink-900 opacity-0 transition-[left,width,opacity] duration-300 ease-out-soft'

const SEGMENT =
  'relative z-[1] flex h-[38px] flex-1 cursor-pointer items-center justify-center rounded-[9px] text-[14px] transition-colors ease-out-soft duration-(--duration-fast) md:h-11 md:text-[15px]'

export function SegmentedField({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: SegmentedFieldOption[]
  value: string
  onChange: (id: string) => void
  label: string
  className?: string
}) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
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

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % options.length
    else if (event.key === 'ArrowLeft')
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
            data-testid={`segmented-field-${option.id}`}
            className={cn(
              SEGMENT,
              selected ? 'font-semibold text-hi-dark' : 'font-medium text-mid-light',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
