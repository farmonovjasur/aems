import { Fragment, useRef, type ElementType } from 'react'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { gsap } from 'gsap'
import { DUR, EASE_SOFT, STAGGER, ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'

/*
 * F4.2 — Reveal (#2): so'z-mask `translateY(110%) → 0`, 0.9s / 0.06s stagger.
 * SSR/no-JS: matn ko'rinib turadi (mask faqat klientda qo'llanadi).
 * reduced-motion: 150ms opacity fade (§6.2 #2).
 * `ready` — i18n almashganda matn o'zgaradi; value Keyu o'zgarishida qayta ishlamaydi,
 * shuning uchun text prop o'zgarsa ScrollTrigger yangi holatga moslashadi (matn almashinuvi
 * F7 da til bo'yicha tekshiriladi).
 */

export function Reveal({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  stagger = STAGGER,
  duration = 0.9,
}: {
  text: string
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  duration?: number
}) {
  const ref = useRef<HTMLElement>(null)
  const { ready, reduced } = useSafeMotion()

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el || !ready) return
    ensureGsap()

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.fromTo(
          el,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: DUR.fast,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          },
        )
        return
      }

      const words = el.querySelectorAll('[data-reveal-word]')
      gsap.set(words, { yPercent: 110 })
      gsap.to(words, {
        yPercent: 0,
        duration,
        delay,
        stagger,
        ease: EASE_SOFT,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [ready, reduced, delay, stagger, duration])

  const words = text.split(/\s+/).filter(Boolean)

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span data-reveal-word className="inline-block">
              {word}
            </span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}
