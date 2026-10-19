import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { CONTACT } from '../../lib/contacts'
import { ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'
import { IconWhatsApp } from '../ui/icons'

/*
 * F5.7 — WhatsAppFAB (#22): 52px doira, 6s ring pulse (faqat transform + opacity,
 * box-shadow emas), hover'da label kengayadi. Mobil: StickyCTA ustida (bottom-24).
 */

export function WhatsAppFAB() {
  const { t } = useTranslation()
  const { ready, reduced } = useSafeMotion()
  const ringRef = useRef<HTMLSpanElement>(null)

  useIsomorphicLayoutEffect(() => {
    const ring = ringRef.current
    if (!ring || !ready || reduced) return
    ensureGsap()

    const tween = gsap.fromTo(
      ring,
      { scale: 1, autoAlpha: 0.65 },
      {
        scale: 1.9,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power2.out',
        repeat: -1,
        repeatDelay: 4.8,
      },
    )

    return () => {
      tween.kill()
    }
  }, [ready, reduced])

  return (
    <div className="fixed right-5 bottom-24 z-50 md:right-6 md:bottom-6">
      <a
        href={CONTACT.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('common.chatWhatsapp')}
        className="group relative grid size-[52px] place-items-center rounded-full bg-whatsapp text-hi-dark shadow-fab transition-transform ease-out-soft duration-(--duration-base) hover:scale-105"
      >
        <span
          ref={ringRef}
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-whatsapp"
        />
        <IconWhatsApp className="relative size-6" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-full mr-3 translate-x-2 rounded-pill bg-ink-900/95 px-3.5 py-2 font-mono text-[11px] tracking-[1.5px] whitespace-nowrap text-hi-dark uppercase opacity-0 ring-1 ring-white/15 transition-[opacity,transform] ease-out-soft duration-(--duration-base) group-hover:translate-x-0 group-hover:opacity-100"
        >
          {t('common.chatWhatsapp')}
        </span>
      </a>
    </div>
  )
}
