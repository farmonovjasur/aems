import { useRef, type RefObject } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSafeMotion } from './useSafeMotion'
import { ensureGsap, useIsomorphicLayoutEffect } from '../lib/motion'

/*
 * F6.6 — #12 Stepper (motion notes · Map row 08):
 *   "Treatment flow stepper: progress line fills with scroll through the 4 steps;
 *    active step scales up. Scrubbed, not autoplay."
 *
 * Hook `--sp0 … --sp{n-1}` (har biri 0→1) CSS custom property'larini ref berilgan
 * elementga yozadi — React qayta render qilmaydi, faqat inline style o'zgaradi.
 * `n` = segment soni (4 qadam → 3 segment).
 *
 * CSS foydalanuvchilar (RadiationTherapy.tsx):
 *   `transform: scaleY(var(--sp0))`              — mobil rail chizig'i to'ladi
 *   `color-mix(... calc(var(--sp0) * 100%) ...)` — badge / strelka brendga o'tadi
 *   `scale(calc(1 + .02 * min(var(--sp0), 1 - var(--sp0))))` — faol qadam kattalashadi
 *
 * §6.2 #2: reduced-motion'da `scrub: false` — "stepper scroll'ni aks ettiradi,
 * scrub animatsiyasi yo'q" (dizaynning reduced-motion qatori).
 */

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)

export function useStepperProgress<T extends HTMLElement>(segments: number): RefObject<T | null> {
  const ref = useRef<T>(null)
  const { ready, reduced } = useSafeMotion()

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el || !ready) return
    ensureGsap()

    const apply = (progress: number) => {
      for (let i = 0; i < segments; i++) {
        el.style.setProperty(`--sp${i}`, clamp01(progress * segments - i).toFixed(4))
      }
    }

    apply(0)

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      end: 'bottom 62%',
      scrub: reduced ? false : 0.4,
      onUpdate: (self) => apply(self.progress),
    })

    return () => {
      trigger.kill()
      for (let i = 0; i < segments; i++) el.style.removeProperty(`--sp${i}`)
    }
  }, [ready, reduced, segments])

  return ref
}
