import { useRef, type ComponentProps } from 'react'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { gsap } from 'gsap'
import { DUR, EASE_SOFT, ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'
import { cn } from '../../lib/cn'

/*
 * F4.3 — ImageReveal (#23): clip-path inset(100%→0) + scale 1.15→1, 1.2s; lazy.
 * CLS = 0 — width/height majburiy (rasm prop'lari orqali).
 */

export type ImageRevealProps = Omit<ComponentProps<'img'>, 'ref'> & {
  wrapperClassName?: string
  duration?: number
  /**
   * F6.10 — stagger kechikishi (son). §6 tokens: 60–100ms. Gallery uchun #23 "staggered".
   * Default 0 → avvalgi section'lar (#3 About, Cytotron) o'zgarishsiz.
   */
  delay?: number
}

export function ImageReveal({
  className,
  wrapperClassName,
  duration = 1.2,
  delay = 0,
  ...imgProps
}: ImageRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const { ready, reduced } = useSafeMotion()

  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current
    const image = imageRef.current
    if (!wrapper || !image || !ready) return
    ensureGsap()

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.fromTo(
          wrapper,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: DUR.fast,
            delay,
            ease: 'none',
            scrollTrigger: { trigger: wrapper, start: 'top 90%', once: true },
          },
        )
        return
      }

      gsap.fromTo(
        image,
        { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.15 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          duration,
          delay,
          ease: EASE_SOFT,
          scrollTrigger: { trigger: wrapper, start: 'top 85%', once: true },
        },
      )
    }, wrapper)

    return () => ctx.revert()
  }, [ready, reduced, duration, delay])

  return (
    <div ref={wrapperRef} className={cn('overflow-hidden', wrapperClassName)}>
      <img
        ref={imageRef}
        loading="lazy"
        decoding="async"
        className={cn('block h-full w-full object-cover will-change-transform', className)}
        {...imgProps}
      />
    </div>
  )
}
