import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { useIsomorphicLayoutEffect } from '../../lib/motion'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/cn'
import { tabButtonId, tabPanelId } from './tab-ids'

/*
 * F3.6 — Tabs (§2): chip-uslub segmented control + klaviatura (←/→/Home/End).
 * ARIA: role=tablist/tab · roving tabindex.
 * Panel'ni ota-komponent render qiladi (tab-ids.ts ga qarang).
 *
 * F6.9 — `variant="segment"` (design.pen `tDJeT` §3.09):
 *   track `ink-900/6` (mobil `/8`) · radius 999 · padding 4/3 · gap 8/7 ·
 *   faol pill sirqashadi (`--duration-base`, ease-out-soft — motion notes · Map row 05:
 *   "Active tab underline / fill slides between tabs on click, dur-base").
 *   Desktop faol pill `ink-900` (matn `hi-dark`), mobil `white` + `0 2 8 ink-900/10` soya
 *   (matn `neutral-900`). Ikonka `currentColor` dan oladi va 15px.
 */

export type TabItem = {
  id: string
  label: ReactNode
  /** Faqat `segment` variantda chiziladi (15px, currentColor). */
  icon?: ReactNode
}

export type TabsTone = 'brand' | 'mint' | 'violet' | 'gold'

const TONES: Record<TabsTone, string> = {
  brand: 'text-brand-500',
  mint: 'text-edu-500',
  violet: 'text-care-500',
  gold: 'text-gold-500',
}

export function Tabs({
  tabs,
  value,
  onChange,
  idBase,
  tone = 'brand',
  variant = 'chip',
  label,
  className,
}: {
  tabs: TabItem[]
  value: string
  onChange: (id: string) => void
  idBase: string
  tone?: TabsTone
  variant?: 'chip' | 'segment'
  label?: string
  className?: string
}) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const { i18n } = useTranslation()
  const listRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const activeIndex = tabs.findIndex((tab) => tab.id === value)

  /* Faol pill o'lchamini oynadan keyin o'lchaydi — SSR'da `opacity: 0` (gidratatsiya mos). */
  useIsomorphicLayoutEffect(() => {
    const list = listRef.current
    const pill = pillRef.current
    if (variant !== 'segment' || !list || !pill) return

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
  }, [activeIndex, variant])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = tabs.findIndex((tab) => tab.id === value)
    let nextIndex = -1

    const rtl = i18n.dir() === 'rtl'
    const nextKey = rtl ? 'ArrowLeft' : 'ArrowRight'
    const prevKey = rtl ? 'ArrowRight' : 'ArrowLeft'

    if (event.key === nextKey) nextIndex = (currentIndex + 1) % tabs.length
    else if (event.key === prevKey) nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = tabs.length - 1

    if (nextIndex === -1) return
    event.preventDefault()

    const nextTab = tabs[nextIndex]
    if (!nextTab) return
    onChange(nextTab.id)
    buttonRefs.current[nextIndex]?.focus()
  }

  const segment = variant === 'segment'

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn(
        segment
          ? 'relative isolate flex w-full items-center gap-[3px] rounded-pill bg-ink-900/8 p-[3px] md:w-auto md:gap-1 md:bg-ink-900/6 md:p-1'
          : 'inline-flex max-w-full flex-wrap items-center gap-xs rounded-pill bg-hi-light/[0.06] p-1',
        className,
      )}
    >
      {segment ? (
        <span
          ref={pillRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-[3px] bottom-[3px] left-0 w-0 rounded-pill bg-white opacity-0 shadow-[0_2px_8px_0_rgb(11_16_32/0.10)] transition-[left,width,opacity] duration-(--duration-base) ease-out-soft md:top-1 md:bottom-1 md:bg-ink-900 md:shadow-none"
        />
      ) : null}

      {tabs.map((tab, index) => {
        const selected = tab.id === value

        return (
          <button
            key={tab.id}
            ref={(element) => {
              buttonRefs.current[index] = element
            }}
            type="button"
            role="tab"
            id={tabButtonId(idBase, tab.id)}
            aria-selected={selected}
            aria-controls={tabPanelId(idBase, tab.id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            data-testid={`${idBase}-tab-${tab.id}`}
            className={cn(
              segment
                ? 'relative z-[1] flex flex-1 cursor-pointer items-center justify-center gap-[7px] rounded-pill py-[11px] text-[13.5px] font-medium transition-colors ease-out-soft duration-(--duration-fast) md:flex-none md:gap-2 md:px-[22px] md:py-2.5 md:text-sm'
                : 'cursor-pointer rounded-pill px-lg py-2.5 text-sm font-medium transition-colors ease-out-soft duration-(--duration-fast)',
              segment
                ? selected
                  ? 'font-semibold text-neutral-900 md:text-hi-dark'
                  : 'text-mid-light hover:text-hi-light'
                : selected
                  ? cn(TONES[tone], 'bg-current/25 ring-1 ring-current/60')
                  : 'text-mid-light hover:text-hi-light',
            )}
          >
            {tab.icon ? (
              <span
                aria-hidden="true"
                className="flex size-[15px] shrink-0 items-center justify-center [&>svg]:size-[15px]"
              >
                {tab.icon}
              </span>
            ) : null}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
