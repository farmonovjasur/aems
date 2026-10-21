import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { onAnchorClick } from '../../lib/anchors'
import { cn } from '../../lib/cn'
import { EASE_SOFT, ensureGsap } from '../../lib/motion'
import { ButtonLink } from '../ui/Button'
import {
  IconActivity,
  IconArrow,
  IconChevron,
  IconCpu,
  IconStethoscope,
  IconTarget,
} from '../ui/icons'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
import { NAV_LINKS } from './nav-links'

/*
 * Nav/States (TIMP2 in design.pen):
 * Mega-menu for medical services:
 * 1. All medical services (#medical-services)
 * 2. Cancer care (#cancer-treatment)
 * 3. Cytotron (#cytotron)
 * 4. Radiation therapy (#radiation-therapy)
 * Bottom link: "Request a case review ->" (#registration)
 */
const MEDICAL_ITEMS = [
  {
    key: 'medicalAll',
    subKey: 'medicalAllSub',
    hash: '#medical-services',
    Icon: IconStethoscope,
  },
  {
    key: 'medicalCancer',
    subKey: 'medicalCancerSub',
    hash: '#cancer-treatment',
    Icon: IconTarget,
  },
  {
    key: 'medicalCytotron',
    subKey: 'medicalCytotronSub',
    hash: '#cytotron',
    Icon: IconCpu,
  },
  {
    key: 'medicalRadiation',
    subKey: 'medicalRadiationSub',
    hash: '#radiation-therapy',
    Icon: IconActivity,
  },
]

function MedicalDropdown({ isActive, onActivate }: { isActive: boolean; onActivate: () => void }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const focusItem = (index: number) => {
    const items = itemRefs.current.filter((el): el is HTMLAnchorElement => el !== null)
    if (items.length === 0) return
    items[(index + items.length) % items.length]?.focus()
  }

  return (
    <div
      ref={rootRef}
      className="group relative flex flex-col items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex flex-col items-center gap-2 pb-1 pt-1">
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls="nav-medical-menu"
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
            'flex items-center gap-1 rounded-full px-3 py-1.5 text-[14px] font-medium transition-colors ease-out-soft duration-(--duration-fast)',
            open || isActive
              ? 'bg-white/[0.08] text-hi-dark'
              : 'bg-transparent text-white/72 hover:bg-white/[0.08] hover:text-hi-dark',
          )}
        >
          <span>{t('nav.medical')}</span>
          <IconChevron
            className={cn(
              'size-3.5 shrink-0 transition-transform ease-out-soft duration-(--duration-fast)',
              open || isActive ? 'text-hi-dark' : 'text-white/72',
              open && 'rotate-180',
            )}
          />
        </button>
        <span
          className={cn(
            'h-[2px] w-full rounded-[2px] transition-colors ease-out-soft duration-(--duration-fast)',
            isActive ? 'bg-brand-500' : 'bg-transparent group-hover:bg-white/20',
          )}
        />
      </div>

      {/* Dropdown mega-menu: MjY0q in design.pen (560px, rounded-16, fill $ink-900, pad 12, gap 4) */}
      <div
        id="nav-medical-menu"
        className={cn(
          'absolute top-full left-1/2 z-30 -translate-x-1/2 pt-2',
          !open && 'pointer-events-none',
        )}
      >
        <div
          role="menu"
          aria-label={t('nav.medical')}
          className={cn(
            'w-[560px] rounded-[16px] border border-white/10 bg-ink-900/95 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl',
            'transition-[opacity,transform] ease-out-soft duration-(--duration-fast)',
            open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0',
          )}
        >
          <div className="flex flex-col gap-1">
            {MEDICAL_ITEMS.map((item, index) => (
              <a
                key={item.key}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                role="menuitem"
                tabIndex={open ? 0 : -1}
                href={item.hash}
                onClick={(event) => {
                  setOpen(false)
                  onActivate()
                  onAnchorClick(event, item.hash)
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
                className="flex items-center gap-3 rounded-[10px] p-2 transition-colors hover:bg-white/[0.08]"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-white/[0.08] text-care-glow">
                  <item.Icon className="size-[18px]" />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-semibold text-hi-dark">
                    {t(`nav.${item.key}`)}
                  </span>
                  <span className="text-[13px] font-normal text-white/60">
                    {t(`nav.${item.subKey}`)}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <div className="my-1 h-px w-full bg-white/10" />

          {/* Bottom row: N7cI1p in design.pen */}
          <div className="flex items-center justify-between px-2 pt-2.5 pb-1">
            <span className="font-body text-[13px] font-normal text-white/60">
              {t('nav.caseReviewNote')}
            </span>
            <a
              href="#registration"
              tabIndex={open ? 0 : -1}
              onClick={(event) => {
                setOpen(false)
                onAnchorClick(event, '#registration')
              }}
              className="flex items-center gap-1 font-body text-[13px] font-semibold text-brand-500 transition-colors hover:text-care-glow"
            >
              <span>{t('common.requestCaseReview')}</span>
              <IconArrow className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

export function Nav() {
  const { t } = useTranslation()
  const { ready, reduced } = useSafeMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const elRef = useRef<HTMLElement>(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const resolveActive = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (
        ['cancer-treatment', 'targeted', 'cytotron', 'radiation', 'radiation-therapy'].includes(
          hash,
        )
      ) {
        setActiveKey('medical')
        return
      }
      const match = NAV_LINKS.find((l) => {
        const linkId = l.hash.replace(/^#/, '')
        return (
          linkId === hash || (hash && linkId.startsWith(hash)) || (hash && hash.startsWith(linkId))
        )
      })
      if (match) setActiveKey(match.key)
    }
    resolveActive()
    const onHashChange = () => resolveActive()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    ensureGsap()

    let lastY = window.scrollY
    let hidden = false

    const onScroll = () => {
      const y = window.scrollY

      if (ready && !reduced) {
        const goingDown = y > lastY
        if (y < 160 || !goingDown) {
          if (hidden) {
            hidden = false
            gsap.to(el, { yPercent: 0, duration: 0.4, ease: EASE_SOFT, overwrite: 'auto' })
          }
        } else if (!hidden && y > 240) {
          hidden = true
          gsap.to(el, { yPercent: -100, duration: 0.4, ease: EASE_SOFT, overwrite: 'auto' })
        }
      }
      lastY = y
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ready, reduced])

  return (
    <>
      <header ref={elRef} className="fixed inset-x-0 top-0 z-40">
        {/* Mobile Navbar: QU0iP in design.pen (358px floating pill, padding [4, 8, 4, 14], blur 20) */}
        <div className="mx-auto w-full px-4 pt-4 xl:hidden">
          <div className="mx-auto flex h-[52px] max-w-[358px] items-center justify-between rounded-full border border-white/10 bg-white/[0.06] pt-1 pr-2 pb-1 pl-3.5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            {/* Brand Wordmark: mbynv in design.pen */}
            <a
              href="#main"
              onClick={(event) => onAnchorClick(event, '#main')}
              aria-label="AEM — home"
              className="select-none font-display text-[17px] font-extrabold tracking-[1px] text-hi-dark"
            >
              AEM
            </a>

            {/* Actions: WdL3o in design.pen */}
            <div className="flex items-center gap-2">
              <a
                href="#registration"
                onClick={(event) => onAnchorClick(event, '#registration')}
                data-testid="nav-free-consultation"
                className="inline-flex h-11 select-none items-center justify-center rounded-full bg-brand-600 px-4 text-[12.5px] font-semibold text-white transition-colors duration-(--duration-fast) ease-out-soft hover:bg-brand-500 active:bg-brand-700"
              >
                {t('nav.cta')}
              </a>

              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                aria-label={menuOpen ? t('nav.close') : t('nav.menu')}
                data-testid="nav-menu-toggle"
                className="grid size-11 select-none place-items-center rounded-full bg-white/[0.08] text-hi-dark transition-colors duration-(--duration-fast) ease-out-soft hover:bg-white/[0.14]"
              >
                <IconMenu className="size-5 text-hi-dark" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navbar: C1J7iH in design.pen (1440x72, fill #060913D9, padding [0, 80], border-b #FFFFFF1A) */}
        <div className="hidden border-b border-white/10 bg-ink-950/85 backdrop-blur-xl xl:block">
          <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-6 xl:px-[80px]">
            {/* Brand: G32Hae in design.pen */}
            <div className="flex w-[150px] items-center min-[1400px]:w-[201px]">
              <a
                href="#main"
                onClick={(event) => onAnchorClick(event, '#main')}
                aria-label="AEM — home"
                className="select-none font-display text-[16px] font-bold text-hi-dark transition-colors hover:text-white"
              >
                AEM
              </a>
            </div>

            {/* Menu: W2OISZ in design.pen (gap 32px, 6 items) */}
            <nav aria-label={t('nav.menu')} className="flex items-center gap-4 min-[1400px]:gap-8">
              {NAV_LINKS.map((link) =>
                link.key === 'medical' ? (
                  <MedicalDropdown
                    key={link.key}
                    isActive={activeKey === 'medical'}
                    onActivate={() => setActiveKey('medical')}
                  />
                ) : (
                  <div
                    key={link.key}
                    className="group relative flex flex-col items-center gap-2 pb-1 pt-1"
                  >
                    <a
                      href={link.hash}
                      onClick={(event) => {
                        setActiveKey(link.key)
                        onAnchorClick(event, link.hash)
                      }}
                      className={cn(
                        'text-[14px] font-medium transition-colors duration-(--duration-fast) ease-out-soft',
                        activeKey === link.key
                          ? 'text-hi-dark'
                          : 'text-white/72 hover:text-hi-dark',
                      )}
                    >
                      {t(`nav.${link.key}`)}
                    </a>
                    <span
                      className={cn(
                        'h-[2px] w-full rounded-[2px] transition-colors duration-(--duration-fast) ease-out-soft',
                        activeKey === link.key
                          ? 'bg-brand-500'
                          : 'bg-transparent group-hover:bg-white/20',
                      )}
                    />
                  </div>
                ),
              )}
            </nav>

            {/* Actions: D4nQh in design.pen (w 264px, gap 12px, Lang switcher + Btn Primary) */}
            <div className="flex w-[264px] items-center justify-end gap-3">
              <LanguageSwitcher variant="dropdown" />
              <ButtonLink
                href="#registration"
                arrow
                size="sm"
                className="px-5 py-2.5 text-[14px] font-medium"
                onClick={(event) => onAnchorClick(event, '#registration')}
              >
                {t('nav.cta')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  )
}
