import { useRef } from 'react'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { gsap } from 'gsap'
import { ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'

/*
 * F4.8 — CustomCursor (#5): nuqta + halqa (kechikishli), interaktiv element ustida scale.
 * `[data-cursor-label]` bo'lgan elementda "View"/"Drag" label ko'rinadi.
 * Faqat `(pointer: fine)` + reduced-motion yo'q — aks holda umuman render qilinmaydi.
 * Native kursor va focus ko'rinishi saqlanadi (a11y).
 */

export function CustomCursor() {
  const { ready, reduced, pointerFine } = useSafeMotion()
  const active = ready && pointerFine && !reduced

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (!active) return
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return
    ensureGsap()

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power2.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })
    const labelX = gsap.quickTo(label, 'x', { duration: 0.45, ease: 'power3.out' })
    const labelY = gsap.quickTo(label, 'y', { duration: 0.45, ease: 'power3.out' })

    let visible = false

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
      labelX(event.clientX + 22)
      labelY(event.clientY)
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2, ease: 'none' })
      }
    }

    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest(
        '[data-cursor], a, button, [role="button"]',
      )
      if (!target) return
      const labelText = target.getAttribute('data-cursor-label') ?? ''
      const isInteractive = target.hasAttribute('data-cursor') || target.matches('a, button')
      gsap.to(ring, { scale: isInteractive ? 1.6 : 1, duration: 0.3, ease: 'power3.out' })
      gsap.to(dot, { scale: isInteractive ? 0.4 : 1, duration: 0.3, ease: 'power3.out' })
      label.textContent = labelText
      gsap.to(label, { autoAlpha: labelText ? 1 : 0, duration: 0.2, ease: 'none' })
    }

    const onOut = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest(
        '[data-cursor], a, button, [role="button"]',
      )
      if (!target) return
      gsap.to([ring, dot], { scale: 1, duration: 0.3, ease: 'power3.out' })
      gsap.to(label, { autoAlpha: 0, duration: 0.2, ease: 'none' })
    }

    const onLeave = () => {
      visible = false
      gsap.to([dot, ring, label], { autoAlpha: 0, duration: 0.2, ease: 'none' })
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf([dot, ring, label])
    }
  }, [active])

  if (!active) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 size-8 rounded-full border border-care-glow/60"
      />
      <div ref={dotRef} className="absolute top-0 left-0 size-1.5 rounded-full bg-care-glow" />
      <span
        ref={labelRef}
        className="absolute top-0 left-0 font-mono text-[10px] tracking-[1.5px] text-care-glow uppercase"
      />
    </div>
  )
}
