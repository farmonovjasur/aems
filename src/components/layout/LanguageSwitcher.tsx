import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LOCALE_ROUTES } from '../../app/routes'
import { applyLocaleToDocument } from '../../i18n/document'
import { LANGUAGES, LOCALE_LABELS, type Locale } from '../../i18n/languages'
import { cn } from '../../lib/cn'
import { IconChevron } from '../ui/icons'

const SHORT_LABEL: Record<Locale, string> = {
  en: 'EN',
  uz: 'UZ',
  ru: 'RU',
  hi: 'IN',
  ar: 'AR',
}

type LanguageSwitcherProps = {
  className?: string
  /** pills — MobileMenu; list — Footer kolonkasi; dropdown — Nav (dizayn: ⌄EN pill). */
  variant?: 'pills' | 'list' | 'dropdown'
  /**
   * Faqat `list` varianti: dizayndagi ustunlar soni.
   * Desktop Footer kolonkasi — 1 (`OOYAk` · `MymXd`); mobil accordion paneli — 2 (`P2R9LG` · `qpznD`).
   */
  listColumns?: 1 | 2
}

function useLocale() {
  const { i18n } = useTranslation()
  const current = (i18n.resolvedLanguage ?? 'en') as Locale
  const switchTo = (locale: Locale) => {
    if (locale === current) return
    void i18n.changeLanguage(locale)
    applyLocaleToDocument(locale)
    window.history.replaceState(null, '', LOCALE_ROUTES[locale])
  }
  return { current, switchTo }
}

/* F5.4 — Nav'dagi til tugmasi: ⌄ EN pill + dropdown menyu (dizayn: Nav/Actions). */
function LanguageDropdown({ className }: { className?: string }) {
  const { current, switchTo } = useLocale()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const focusItem = (index: number) => {
    const items = itemRefs.current.filter((el): el is HTMLButtonElement => el !== null)
    if (items.length === 0) return
    items[(index + items.length) % items.length]?.focus()
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="nav-language-menu"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setOpen(true)
            window.requestAnimationFrame(() => focusItem(0))
          } else if (event.key === 'Escape') {
            setOpen(false)
          }
        }}
        className={cn(
          'flex items-center gap-1.5 rounded-pill border border-white/[0.16] bg-transparent py-[7px] px-3 font-mono text-[12px] text-hi-dark transition-colors ease-out-soft duration-(--duration-fast) hover:border-white/[0.32] hover:bg-white/[0.06]',
          open && 'border-white/[0.32] bg-white/[0.06]',
        )}
      >
        <IconChevron
          className={cn(
            'size-[13px] text-mid-dark transition-transform ease-out-soft duration-(--duration-fast)',
            open && 'rotate-180',
          )}
        />
        <span>{SHORT_LABEL[current]}</span>
      </button>

      <div
        id="nav-language-menu"
        className={cn('absolute top-full end-0 z-20 pt-2', !open && 'pointer-events-none')}
      >
        <div
          role="menu"
          aria-label={t('common.language')}
          className={cn(
            'flex w-44 flex-col rounded-md border border-white/10 bg-ink-900/95 p-xs shadow-xl backdrop-blur-xl',
            'transition-[opacity,transform] ease-out-soft duration-(--duration-fast)',
            open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0',
          )}
        >
          {LANGUAGES.map((locale, index) => (
            <button
              key={locale}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              type="button"
              role="menuitem"
              tabIndex={open ? 0 : -1}
              aria-pressed={locale === current}
              onClick={() => {
                switchTo(locale)
                setOpen(false)
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault()
                  focusItem(index + 1)
                } else if (event.key === 'ArrowUp') {
                  event.preventDefault()
                  if (index === 0) triggerRef.current?.focus()
                  else focusItem(index - 1)
                } else if (event.key === 'Escape') {
                  setOpen(false)
                  triggerRef.current?.focus()
                } else if (event.key === 'Tab') {
                  setOpen(false)
                }
              }}
              className={cn(
                'flex items-center justify-between gap-md rounded-sm px-md py-2 text-start text-sm transition-colors duration-(--duration-fast) hover:bg-white/[0.06]',
                locale === current ? 'text-hi-dark' : 'text-mid-dark',
              )}
            >
              <span dir="auto">{LOCALE_LABELS[locale]}</span>
              {locale === current && (
                <span className="size-1.5 shrink-0 rounded-full bg-brand-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* F2.8 — til switcher (Nav / Footer / MobileMenu ichida). */
export function LanguageSwitcher({
  className,
  variant = 'pills',
  listColumns = 1,
}: LanguageSwitcherProps) {
  const { current, switchTo } = useLocale()
  const { t } = useTranslation()

  if (variant === 'dropdown') return <LanguageDropdown className={className} />

  if (variant === 'list') {
    return (
      <div
        className={cn(
          listColumns === 2
            ? 'grid grid-cols-2 gap-x-4 gap-y-2.5'
            : 'flex flex-col items-start gap-sm',
          className,
        )}
        role="group"
        aria-label={t('common.language')}
      >
        {LANGUAGES.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => switchTo(locale)}
            aria-pressed={locale === current}
            className={cn(
              'text-[15px] transition-colors ease-out-soft duration-(--duration-fast)',
              locale === current ? 'text-hi-dark' : 'text-mid-dark hover:text-hi-dark',
            )}
          >
            <span dir="auto">{LOCALE_LABELS[locale]}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('flex items-center gap-sm', className)}
      role="group"
      aria-label={t('common.language')}
    >
      {LANGUAGES.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          aria-pressed={locale === current}
          title={LOCALE_LABELS[locale]}
          className={cn(
            'rounded-pill border px-3.5 py-[7px] font-mono text-[10.5px] tracking-[1px] uppercase transition-colors ease-out-soft duration-(--duration-fast)',
            locale === current
              ? 'border-brand-500 bg-brand-500 font-semibold text-white'
              : 'border-white/[0.08] bg-white/[0.06] text-mid-dark hover:bg-white/[0.12] hover:text-hi-dark',
          )}
        >
          {SHORT_LABEL[locale]}
        </button>
      ))}
    </div>
  )
}
