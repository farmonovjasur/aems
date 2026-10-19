import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { DUR, EASE_SOFT, STAGGER, ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'
import { cn } from '../../lib/cn'

/*
 * F6.5 / F7.4 — #10 Bento card motion:
 *   view  → fade-up stagger (y 26 → 0, autoAlpha 0 → 1), 0.6s, `dur-base` easing.
 *   hover → 3–4° tilt toward the cursor + radial cursor light + border shine.
 *
 * §6.2 #3: tilt / light / shine faqat `(pointer: fine)` da — touch'da faqat fade-up.
 * §6.2 #2: reduced-motion'da hammasi 150ms opacity fade'ga tushadi.
 *
 * Ikkala qatlam bitta `gsap.context` ichida — `pointerFine` o'zgarganda (responsive
 * o'tish) hammasi toza `revert()` bo'ladi, DOM'ga qo'llab qolingan inline transform
 * qolmaydi.
 */

type TiltCardProps = {
  children: ReactNode
  className?: string
  /** View'da paydo bo'lish kechikishi (grid ichida stagger — saralash tartibi). */
  index?: number
  /** Stagger oralig'i (s). 0 = bitta kartochka. */
  stagger?: number
  /** Yorug'lik/shine bilan birga qo'llaniladigan radius klassi. */
  radiusClassName?: string
  /** Kursor yorug'ligi va border shine rangi (CSS custom property). */
  lightVar?: string
}

const TILT_DEG = 3.5
const REVEAL_DUR = 0.6

export function TiltCard({
  children,
  className,
  index = 0,
  stagger = STAGGER,
  radiusClassName = 'rounded-md',
  lightVar = '--color-care-glow',
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)
  const { ready, reduced, pointerFine } = useSafeMotion()

  useIsomorphicLayoutEffect(() => {
    const card = cardRef.current
    const light = lightRef.current
    if (!card || !ready) return
    ensureGsap()

    /* --- 1. View-triggered reveal --- */
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.fromTo(
          card,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: DUR.fast,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top 92%', once: true },
          },
        )
        return
      }

      gsap.fromTo(
        card,
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: REVEAL_DUR,
          delay: index * stagger,
          ease: EASE_SOFT,
          scrollTrigger: { trigger: card, start: 'top 92%', once: true },
        },
      )
    }, card)

    /* --- 2. Hover tilt + cursor light (faqat `(pointer: fine)`) --- */
    if (!pointerFine || !light || reduced) return () => ctx.revert()

    const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power3.out' })
    const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power3.out' })
    const moveX = gsap.quickTo(light, 'xPercent', { duration: 0.4, ease: 'power3.out' })
    const moveY = gsap.quickTo(light, 'yPercent', { duration: 0.4, ease: 'power3.out' })
    const fade = gsap.quickTo(light, 'opacity', { duration: 0.3, ease: 'power2.out' })

    gsap.set(card, { transformPerspective: 900, transformStyle: 'preserve-3d' })

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = card.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height
      rotateY((px - 0.5) * 2 * TILT_DEG)
      rotateX(-(py - 0.5) * 2 * TILT_DEG)
      moveX((px - 0.5) * 100)
      moveY((py - 0.5) * 100)
      fade(1)
    }

    const onLeave = () => {
      rotateX(0)
      rotateY(0)
      fade(0)
    }

    card.addEventListener('pointermove', onMove)
    card.addEventListener('pointerleave', onLeave)

    return () => {
      card.removeEventListener('pointermove', onMove)
      card.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(card)
      gsap.killTweensOf(light)
      ctx.revert()
    }
  }, [ready, reduced, pointerFine, index, stagger, lightVar])

  return (
    <div ref={cardRef} className={cn('group/tilt relative', radiusClassName, className)}>
      {pointerFine ? (
        <>
          {/* Kursor yorug'ligi — kartaning ichida kursor bilan harakat qiladi. */}
          <div
            ref={lightRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-(--duration-fast)"
            style={{
              backgroundImage: `radial-gradient(240px circle at 50% 50%, color-mix(in srgb, var(${lightVar}) 16%, transparent) 0%, transparent 72%)`,
            }}
          />
          {/* Border shine — 1px gradient halqa, faqat hover'da. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] p-px opacity-0 transition-opacity duration-(--duration-fast) group-hover/tilt:opacity-100"
            style={{
              backgroundImage: `linear-gradient(115deg, transparent 22%, color-mix(in srgb, var(${lightVar}) 55%, transparent) 50%, transparent 78%)`,
              WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              maskComposite: 'exclude',
            }}
          />
        </>
      ) : null}
      <div className="relative">{children}</div>
    </div>
  )
}