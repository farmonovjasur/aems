import { useRef, useState, type ReactNode } from 'react'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { gsap } from 'gsap'
import { ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'
import { cn } from '../../lib/cn'

/*
 * F4.6 — Marquee (#9): cheksiz lenta, 40s linear; hover + off-screen'da pauza.
 *
 * Uzluksizlik: kontent bitta nusxa viewport'dan qisqa bo'lsa (masalan 8 badge ≈ 1250px
 * < 1440px), `xPercent: -50` siklda bo'sh joy ko'rsatadi. Shuning uchun nusxa bir qatorda
 * `ceil(viewport / bitta set) + 1` marta takrorlanadi — shunda bitta set har doim
 * ekrandan uzunroq bo'ladi va chekka ulanish sezilmaydi.
 * Takrorlar `aria-hidden` (klont + 2..n-set), ekran o'quvchilar har bir badge'ni bir marta o'qiydi.
 * reduced-motion/LOW tier: animatsiya yo'q (statik).
 */

export function Marquee({
  children,
  duration = 40,
  reverse = false,
  pauseOnHover = true,
  gapClass = 'gap-xl',
  padClass = 'pe-xl',
  className,
  trackClassName,
}: {
  children: ReactNode
  duration?: number
  reverse?: boolean
  pauseOnHover?: boolean
  gapClass?: string
  padClass?: string
  className?: string
  trackClassName?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const sampleRef = useRef<HTMLDivElement>(null)
  const [repeats, setRepeats] = useState(1)
  const { ready, reduced } = useSafeMotion()

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    const sample = sampleRef.current
    if (!root || !sample) return

    const update = () => {
      const rootWidth = root.getBoundingClientRect().width
      const sampleWidth = sample.getBoundingClientRect().width
      if (sampleWidth > 0) setRepeats(Math.max(1, Math.ceil(rootWidth / sampleWidth) + 1))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(root)
    return () => observer.disconnect()
  }, [children])

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track || !ready || reduced) return
    ensureGsap()

    const tween = gsap.fromTo(
      track,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration, ease: 'none', repeat: -1 },
    )

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) tween.resume()
        else tween.pause()
      },
      { threshold: 0 },
    )
    observer.observe(root)

    const onEnter = () => {
      if (pauseOnHover) tween.pause()
    }
    const onLeave = () => {
      if (pauseOnHover) tween.resume()
    }
    root.addEventListener('pointerenter', onEnter)
    root.addEventListener('pointerleave', onLeave)

    return () => {
      observer.disconnect()
      root.removeEventListener('pointerenter', onEnter)
      root.removeEventListener('pointerleave', onLeave)
      tween.kill()
    }
  }, [ready, reduced, duration, reverse, pauseOnHover, repeats])

  const copy = (isClone: boolean) => (
    <div
      aria-hidden={isClone || undefined}
      className={cn('flex shrink-0 items-center', gapClass, padClass)}
    >
      {Array.from({ length: repeats }, (_, index) => (
        <div
          key={index}
          ref={!isClone && index === 0 ? sampleRef : undefined}
          aria-hidden={index > 0 || undefined}
          className={cn('flex shrink-0 items-center', gapClass)}
        >
          {children}
        </div>
      ))}
    </div>
  )

  return (
    <div ref={rootRef} className={cn('overflow-hidden', className)}>
      <div
        ref={trackRef}
        className={cn('flex w-max items-center will-change-transform', trackClassName)}
      >
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  )
}
