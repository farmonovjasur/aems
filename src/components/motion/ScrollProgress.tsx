import { useRef } from 'react'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { gsap } from 'gsap'
import { ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'
import { cn } from '../../lib/cn'

/*
 * F4.7 — ScrollProgress (#21): 2px gradient bar, scroll bilan to'ladi (scrub).
 * Brend gradienti: brand-500 → care-glow. Scroll indicator — reduced-motion'da ham qoladi.
 */

export function ScrollProgress({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { ready } = useSafeMotion()

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el || !ready) return
    ensureGsap()

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: true },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [ready])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-linear-to-r from-brand-500 to-care-glow',
        className,
      )}
    />
  )
}
