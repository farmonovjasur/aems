import { useEffect, useRef, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { CONTACT } from '../../lib/contacts'
import { scrollToAnchor } from '../../lib/anchors'
import { ButtonLink } from '../ui/Button'
import { IconChevronRight, IconX } from '../ui/icons'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NAV_LINKS } from './nav-links'

/*
 * F5.5 — MobileMenu overlay (fqnuW in design.pen):
 * Glow CeUED + 6 nav links + Languages BQJPL + CTAs KucSZ (Free Consultation + Chat on WhatsApp);
 * Close button RwSP9.
 * Focus trap, Escape key, body scroll lock with scrollbar compensation.
 */

type MobileMenuProps = {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t } = useTranslation()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const focusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    panel.querySelector<HTMLElement>('[data-menu-close]')?.focus()

    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
      previous?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  const navigate = (hash: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onClose()
    window.requestAnimationFrame(() => scrollToAnchor(hash))
  }

  return (
    <div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.menu')}
      className="fixed inset-0 z-[70] lg:hidden"
    >
      {/* Background glow (CeUED in design.pen) */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 overflow-hidden bg-ink-950"
      >
        <div className="pointer-events-none absolute -top-10 -left-[60px] h-[280px] w-[360px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(75,107,255,0.30)_0%,rgba(75,107,255,0)_70%)] blur-2xl" />
      </div>

      <div ref={panelRef} className="relative flex h-full flex-col overflow-y-auto p-5">
        {/* Header with Close button (RwSP9) */}
        <div className="flex shrink-0 items-center justify-end">
          <button
            data-menu-close
            type="button"
            onClick={onClose}
            aria-label={t('nav.close')}
            className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-hi-dark transition-colors ease-out-soft duration-(--duration-fast) hover:bg-white/[0.12]"
          >
            <IconX className="size-[18px]" />
          </button>
        </div>

        {/* Spacer 1 (x9bh75) */}
        <div className="h-3 shrink-0" />

        {/* Menu list (Q1etAm) */}
        <nav aria-label={t('nav.menu')} className="flex flex-col">
          <ul className="divide-y divide-white/[0.08]">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <a
                  href={link.hash}
                  onClick={navigate(link.hash)}
                  className="flex items-center justify-between px-0.5 py-[15px] text-[16.5px] font-medium text-hi-dark transition-colors duration-(--duration-fast) hover:text-care-glow"
                >
                  <span>{t(`nav.${link.key}`)}</span>
                  <IconChevronRight className="size-4 text-mid-dark" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Languages (BQJPL) */}
        <div className="mt-2 flex h-[55px] shrink-0 items-center">
          <LanguageSwitcher variant="pills" />
        </div>

        {/* Spacer 2 (mKGii) */}
        <div className="min-h-6 flex-1" />

        {/* CTAs (KucSZ) */}
        <div className="flex shrink-0 flex-col gap-2.5 pt-4 pb-2">
          <ButtonLink
            href="#registration"
            arrow
            size="md"
            className="w-full justify-center py-3.5 text-[15px] font-medium"
            onClick={navigate('#registration')}
          >
            {t('common.freeConsultation')}
          </ButtonLink>
          <ButtonLink
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="md"
            className="w-full justify-center py-3.5 text-[15px] font-medium"
          >
            {t('common.chatWhatsapp')}
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}
