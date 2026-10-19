import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { cn } from '../../lib/cn'
import { DUR, EASE_SOFT, STAGGER, ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'

/*
 * F6.6 — #10 Bento card motion'ning view qismi (motion notes · Map row 08):
 *   "Used for" grid + LINAC list — bento fade-up stagger.
 *
 * TiltCard (#10 to'liq variant) farq: bu yerda hover tilt / kursor yorug'ligi / shine
 * YO'Q — design shu kartalar uchun faqat stagger ko'rsatadi. Shuning uchun yagona
 * wrapper, hech qanday pointer hodisasi yo'q (touch/desktop farqi ham chiqmaydi).
 *
 * §6.2 #2: reduced-motion'da 150ms opacity fade (transformsiz).
 * #23 (images) bu section'da qo'llanmaydi — designda rasm yo'q.
 */

const REVEAL_DUR = 0.6
const REVEAL_Y = 26

export function FadeUp({
  children,
  className,
  as: Tag = 'div',
  index = 0,
  stagger = STAGGER,
}: {
  children: ReactNode
  className?: string
  as?: ElementType
  /** Grid ichidagi tartib raqami — stagger kechikishini belgilaydi. */
  index?: number
  stagger?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
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
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          },
        )
        return
      }

      gsap.fromTo(
        el,
        { autoAlpha: 0, y: REVEAL_Y },
        {
          autoAlpha: 1,
          y: 0,
          duration: REVEAL_DUR,
          delay: index * stagger,
          ease: EASE_SOFT,
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [ready, reduced, index, stagger])

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  )
}
