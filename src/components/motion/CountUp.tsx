import { useRef, type ReactNode } from 'react'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { gsap } from 'gsap'
import { EASE_SOFT, ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'
import { cn } from '../../lib/cn'

/*
 * F4.5 — CountUp (#8): 0→qiymat, 1.6s, `tabular-nums`, view trigger, bir marta.
 * SSR: yakuniy qiymat ko'rinadi (SEO/no-JS); klientda 0 dan animatsiya.
 * reduced-motion: darhol yakuniy qiymat.
 */

function defaultFormat(value: number) {
  return Math.round(value).toLocaleString('en-US')
}

export function CountUp({
  to,
  duration = 1.6,
  format,
  prefix,
  suffix,
  className,
}: {
  to: number
  duration?: number
  format?: (value: number) => string
  prefix?: ReactNode
  suffix?: ReactNode
  className?: string
}) {
  const numberRef = useRef<HTMLSpanElement>(null)
  const { ready, reduced } = useSafeMotion()

  const finalText = (format ?? defaultFormat)(to)

  useIsomorphicLayoutEffect(() => {
    const el = numberRef.current
    if (!el || !ready || reduced) return
    ensureGsap()

    const formatter = format ?? defaultFormat
    const state = { value: 0 }
    const ctx = gsap.context(() => {
      gsap.to(state, {
        value: to,
        duration,
        ease: EASE_SOFT,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => {
          el.textContent = formatter(state.value)
        },
      })
    }, el)

    return () => ctx.revert()
  }, [ready, reduced, to, duration, format])

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}
      <span ref={numberRef}>{finalText}</span>
      {suffix}
    </span>
  )
}
