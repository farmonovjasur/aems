import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { onAnchorClick } from '../../lib/anchors'
import { DUR, EASE_SOFT, ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'
import { ButtonLink } from '../ui/Button'

/*
 * F5.6 — StickyCTA (§4): mobil bottom-fixed bar, hero'dan keyin chiqadi,
 * footer ustida yashirinadi (ink-900/95 + blur 18). Faqat < md.
 * Reduced-motion'da yashirinish/chiqish 150ms fade (transform'siz emas — transform bilan, lekin qisqa).
 */

export function StickyCTA() {
  const { t } = useTranslation()
  const { ready, reduced } = useSafeMotion()
  const ref = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el || !ready) return
    ensureGsap()

    const duration = reduced ? 0.15 : DUR.base
    let pastHero = false
    let inFooter = false

    const update = () => {
      const visible = pastHero && !inFooter
      gsap.to(el, {
        autoAlpha: visible ? 1 : 0,
        yPercent: visible ? 0 : 100,
        duration,
        ease: EASE_SOFT,
        overwrite: 'auto',
      })
    }

    const triggers = [
      ScrollTrigger.create({
        start: () => window.innerHeight * 0.7,
        end: 'max',
        onToggle: (self) => {
          pastHero = self.isActive
          update()
        },
      }),
    ]

    const footer = document.getElementById('footer')
    if (footer) {
      triggers.push(
        ScrollTrigger.create({
          trigger: footer,
          start: 'top bottom-=80',
          onToggle: (self) => {
            inFooter = self.isActive
            update()
          },
        }),
      )
    }

    return () => triggers.forEach((trigger) => trigger.kill())
  }, [ready, reduced])

  return (
    <div
      ref={ref}
      className="invisible fixed inset-x-0 bottom-0 z-40 translate-y-full border-t border-white/10 bg-ink-900/95 backdrop-blur-[18px] md:hidden"
    >
      <div className="px-md py-3.5">
        <ButtonLink
          href="#registration"
          className="w-full"
          onClick={(event) => onAnchorClick(event, '#registration')}
        >
          {t('common.freeConsultation')}
        </ButtonLink>
      </div>
    </div>
  )
}
