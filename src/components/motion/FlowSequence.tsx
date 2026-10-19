import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { cn } from '../../lib/cn'
import { DUR, EASE_SOFT, STAGGER, ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'

/*
 * F6.7 — motion #09 · Affiliate flow (design.pen `Y8IYL` · Section map · qator 09):
 *   "Flow nodes (Your product → AEM research → Customers) and arrows fade / draw in
 *    with stagger in logical order, dur-base."
 *
 * DOM tartibi = mantiqiy tartib, shuning uchun stagger oddiy `stagger` bilan beriladi:
 * node → arrow → node → arrow → node. Strelkalarda qo'shimcha `stroke-dashoffset` chizish
 * (#11 MapArc kabi, lekin qisqa — dur-base) — strelka ham fade, ham "draw" bo'ladi.
 *
 * `data-flow-step` — animatsiyaga qatnashadigan element (karta yoki strelka konteyneri).
 * `data-flow-draw` — ichidagi SVG; uning `path`lari chiziladi. Draw vaqtining kechikishi
 * o'sha strelkaning o'z `data-flow-step` indeksiga teng — ya'ni strelka o'z card'i bilan
 * bir vaqtda paydo bo'ladi.
 *
 * Reduced motion (§6.2 · Map row 09): "Fade in together, 150ms" — stagger yo'q, chizish yo'q.
 * Wrapper `display: contents` (klass beriladi) — flow kartasining flex/gap tartibi buzilmaydi.
 */

const REVEAL_Y = 12

export function FlowSequence({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { ready, reduced } = useSafeMotion()

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el || !ready) return
    ensureGsap()

    const ctx = gsap.context(() => {
      const steps = Array.from(el.querySelectorAll('[data-flow-step]'))

      if (reduced) {
        gsap.fromTo(
          steps,
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

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })

      timeline.fromTo(
        steps,
        { autoAlpha: 0, y: REVEAL_Y },
        {
          autoAlpha: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE_SOFT,
          stagger: STAGGER,
        },
        0,
      )

      el.querySelectorAll<SVGElement>('[data-flow-draw]').forEach((draw) => {
        const paths = Array.from(draw.querySelectorAll<SVGPathElement>('path'))
        if (paths.length === 0) return

        const lengths = paths.map((path) => path.getTotalLength())
        paths.forEach((path, index) => {
          gsap.set(path, { strokeDasharray: lengths[index], strokeDashoffset: lengths[index] })
        })

        const owner = draw.closest('[data-flow-step]') ?? draw
        const at = Math.max(steps.indexOf(owner), 0) * STAGGER

        timeline.to(paths, { strokeDashoffset: 0, duration: DUR.base, ease: EASE_SOFT }, at)
      })
    }, el)

    return () => ctx.revert()
  }, [ready, reduced])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
