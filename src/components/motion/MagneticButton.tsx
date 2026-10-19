import { useRef, type ReactNode } from 'react'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { gsap } from 'gsap'
import { ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'
import { cn } from '../../lib/cn'

/*
 * F4.4 — MagneticButton (#4): r≈80, force 0.3, `(pointer: fine)` gate (§6.2 #3).
 * Touch/reduced'da butunlay o'chirilgan — oddiy tugma bo'lib qoladi.
 *
 * Tuzatilgan tuzilma (F6.5): eshitish zonasi (statik `area`) va harakatlanuvchi qatlam
 * (`magnet`) ajratilgan. Avval ikkalasi bitta element edi va `pointermove` **ota
 * konteynerga** ulingan edi — qatordagi ikki tugma bir-birini ham "segar" edi, qaysi
 * biri silinsa qo'shnisi ustiga tushib qolardi va chindan ham ustida qolib ketardi.
 * Endi:
 *   1. har bir tugmaning o'z zonasi bor — qo'shni tugma hech qachon qo'zg'almaydi;
 *   2. zona hech qachon silinmaydi — `pointerleave` ishonchli ishlaydi, "qolib qolish" yo'q;
 *   3. silish `maxShift` bilan cheklangan (qator orasidagi bo'shliqdan oshmasligi uchun),
 *      shuning uchun tugmalar hech qachon ustma-ust tushmaydi.
 */

export function MagneticButton({
  children,
  radius = 80,
  strength = 0.3,
  maxShift = 18,
  className,
}: {
  children: ReactNode
  radius?: number
  strength?: number
  /** Silishning eng ko'p miqdori (px) — qo'shni element bilan to'qnashuvning oldini oladi. */
  maxShift?: number
  className?: string
}) {
  const areaRef = useRef<HTMLDivElement>(null)
  const magnetRef = useRef<HTMLDivElement>(null)
  const { ready, reduced, pointerFine } = useSafeMotion()

  useIsomorphicLayoutEffect(() => {
    const area = areaRef.current
    const magnet = magnetRef.current
    if (!area || !magnet || !ready || reduced || !pointerFine) return
    ensureGsap()

    const xTo = gsap.quickTo(magnet, 'x', { duration: 0.35, ease: 'power3.out' })
    const yTo = gsap.quickTo(magnet, 'y', { duration: 0.35, ease: 'power3.out' })

    const clamp = (value: number) => Math.max(-maxShift, Math.min(maxShift, value))

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = area.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)

      // Zonalik tekshiruv: silish faqat tugma ustida (yo'qsa ±`radius` chegarasida).
      const margin = Math.max(0, radius - rect.width / 2)
      const outside =
        Math.abs(dx) > rect.width / 2 + margin || Math.abs(dy) > rect.height / 2 + margin

      if (outside) {
        xTo(0)
        yTo(0)
        return
      }
      xTo(clamp(dx * strength))
      yTo(clamp(dy * strength))
    }

    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    area.addEventListener('pointermove', onMove)
    area.addEventListener('pointerleave', onLeave)

    return () => {
      area.removeEventListener('pointermove', onMove)
      area.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(magnet)
      gsap.set(magnet, { x: 0, y: 0 })
    }
  }, [ready, reduced, pointerFine, radius, strength, maxShift])

  return (
    <div ref={areaRef} className={cn('inline-flex', className)}>
      <div ref={magnetRef} className="inline-flex w-full will-change-transform">
        {children}
      </div>
    </div>
  )
}