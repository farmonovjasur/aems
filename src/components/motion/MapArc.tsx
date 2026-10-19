import { useId, useRef } from 'react'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { gsap } from 'gsap'
import { EASE_SOFT, ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'
import { cn } from '../../lib/cn'

/*
 * F4.7 — MapArc (#11): Bukhara → India marshruti.
 * Chiziq `stroke-dashoffset` bilan chiziladi (1.8s, ease-out-soft) va o'tgan yo'l
 * bo'ylab nuqta harakatlanadi (motion notes: "Map arc — view — stroke-dashoffset draw
 * + travelling dot — 1.8s").
 * Geometriya design.pen'dan 1:1: desktop eIkYj (348×104), mobil m9Ong (305×104).
 * reduced-motion: chiziq va uchta nuqta joyida, animatsiyasiz.
 */

type Point = { x: number; y: number }

type ArcSpec = {
  /** path `d` — o'z viewBox koordinatida */
  d: string
  /** design.pen'dagi path node transformi (node → viewBox koordinati) */
  transform: string
  /** path koordinati → svg koordinati */
  project: (point: Point) => [number, number]
  /** Dizayn nuqtalari: Buxoro → Hindiston */
  from: [number, number]
  to: [number, number]
}

const MOBILE_SCALE = 270 / 242

const DESKTOP: ArcSpec = {
  d: 'M44.5 89.5c96.771-74.298 194.437-80.164 293-17.597',
  transform: 'translate(0 6)',
  project: ({ x, y }) => [x, y + 6],
  from: [34.5, 102],
  to: [348, 86.5],
}

const MOBILE: ArcSpec = {
  d: 'M12 78q108-76 218-12',
  transform: `translate(20 -10) scale(${MOBILE_SCALE} 1)`,
  project: ({ x, y }) => [x * MOBILE_SCALE + 20, y - 10],
  from: [27, 79],
  to: [283, 65],
}

const DRAW = 1.8
const DOT_R = 5.5
const STROKE = 3

function Arc({ spec, viewBox, className }: { spec: ArcSpec; viewBox: string; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const routeRef = useRef<SVGPathElement>(null)
  const travelRef = useRef<SVGCircleElement>(null)
  const fromRef = useRef<SVGCircleElement>(null)
  const toRef = useRef<SVGCircleElement>(null)
  const { ready, reduced } = useSafeMotion()
  const reactId = useId()
  const gradientId = `aem-map-route-${reactId.replace(/:/g, '')}`

  useIsomorphicLayoutEffect(() => {
    const wrap = wrapRef.current
    const route = routeRef.current
    const travel = travelRef.current
    const from = fromRef.current
    const to = toRef.current
    if (!wrap || !route || !travel || !from || !to || !ready) return
    ensureGsap()

    const length = route.getTotalLength()

    const ctx = gsap.context(() => {
      if (reduced) return

      const progress = { value: 0 }

      gsap.set(route, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 })
      gsap.set([travel, from, to], { opacity: 0 })

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top 88%', once: true },
      })

      timeline
        .to(route, { opacity: 1, duration: 0.2 }, 0)
        .to(route, { strokeDashoffset: 0, duration: DRAW, ease: EASE_SOFT }, 0)
        .to(from, { opacity: 1, duration: 0.25 }, 0.05)
        .fromTo(travel, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.05)
        .to(
          progress,
          {
            value: 1,
            duration: DRAW,
            ease: EASE_SOFT,
            onUpdate: () => {
              const [x, y] = spec.project(route.getPointAtLength(length * progress.value))
              gsap.set(travel, { attr: { cx: x, cy: y } })
            },
          },
          0,
        )
        .to(travel, { opacity: 0, duration: 0.25 }, DRAW - 0.3)
        .to(to, { opacity: 1, duration: 0.25 }, DRAW - 0.2)
    }, wrap)

    return () => ctx.revert()
  }, [ready, reduced, spec])

  return (
    <div ref={wrapRef} className={cn('h-[104px]', className)}>
      <svg viewBox={viewBox} aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-edu-500)" />
            <stop offset="1" stopColor="var(--color-brand-500)" />
          </linearGradient>
        </defs>
        <path
          ref={routeRef}
          d={spec.d}
          transform={spec.transform}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle
          ref={fromRef}
          cx={spec.from[0]}
          cy={spec.from[1]}
          r={DOT_R}
          fill="var(--color-edu-500)"
          stroke="var(--color-ink-900)"
          strokeWidth={STROKE}
        />
        <circle
          ref={toRef}
          cx={spec.to[0]}
          cy={spec.to[1]}
          r={DOT_R}
          fill="var(--color-brand-500)"
          stroke="var(--color-ink-900)"
          strokeWidth={STROKE}
        />
        <circle
          ref={travelRef}
          cx={spec.from[0]}
          cy={spec.from[1]}
          r={4}
          fill="#FFFFFF"
          opacity={0}
        />
      </svg>
    </div>
  )
}

export function MapArc({ className }: { className?: string }) {
  return (
    <>
      <Arc spec={MOBILE} viewBox="0 0 305 104" className={cn('w-full xl:hidden', className)} />
      <Arc
        spec={DESKTOP}
        viewBox="0 0 348 104"
        className={cn('hidden xl:block xl:w-full xl:max-w-[348px]', className)}
      />
    </>
  )
}
