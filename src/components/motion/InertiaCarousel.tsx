import { Children, useRef, useState, type ReactNode } from 'react'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { cn } from '../../lib/cn'
import { useIsomorphicLayoutEffect } from '../../lib/motion'

/*
 * F6.11 — #16 Testimonials draggable inertia carousel (design.pen `Y8IYL` · Section map
 * row 13 · Effects row 16: trigger `drag` · "Inertia carousel, autoplay paused on hover" ·
 * `spring`). Map row 13 to'liq shunga ishora qiladi — shu bois qator kartalariga #2 (word
 * mask) yoki #10 (fade-up stagger) QO'LLANMAYDI: autoplay karta o'ziga qaytadi, animatsiya
 * kartaga tegib turganda qayta-qayta o'ynashi kerak edi.
 *
 * Bitta komponent ikki rejimni boshqaradi:
 *   • `md:` + `(pointer: fine)` — JS drag: pointer bilan 1:1 siljitish, chegarada
 *     rubber-band qarshiligi, bo'yashda momentum (oxirgi namunalardan olingan tezlik) va
 *     eng yaqin karta index'iga **spring 260/24** bilan snap. Autoplay faqat track
 *     viewport'dan keng bo'lganda ishga tushadi (1440 da 4 ta karta 1280 = sig'mi →
 *     autoplay ham, drag ham o'z-o'zidan noop bo'ladi).
 *   • `<md` — dizayn `Q8Gqwo` kabi native gorizontal scroll + `snap-mandatory`, ostida
 *     dots indikator. Touch'dagi inersiya brauzerniki — JS drag ishlamaydi.
 *
 * §6.2 #2 (reduced motion): autoplay umuman ishlamaydi, snap animatsiyasiz (bir zumda).
 * §6.2 #3 (pointer gating): drag faqat `(pointer: fine)`.
 * §6.2 #6 (render on demand): rAF faqat spring ishlayotganda — bo'sholganda to'xtaydi;
 *   autoplay viewport'dan chiqqanda (`IntersectionObserver`) ham, tab yashirin bo'lganda
 *   (`visibilitychange` — `IntersectionObserver` faqat chizilgan holatni boshqaradi).
 */

export type InertiaCarouselProps = {
  children: ReactNode
  /** Klient va ekran o'quvchi uchun region nomi (`aria-label`). */
  ariaLabel: string
  /**
   * `<md` da ko'rinadigan slaydlar soni (dots + `n / N` yorlig'i uchun).
   * Desktopda qo'shimcha karta — masalan CTA karta — `md:flex` bilan yashiriladi,
   * lekin u track ichida turadi va JS snap nuqtasi sifatida kerak.
   */
  slides?: number
  /** Autoplay oralig'i (ms). Faqat track sig'maganda va reduced-motion yo'q bo'lganda. */
  autoplayMs?: number
  className?: string
  trackClassName?: string
  dotsClassName?: string
}

/** #16 — spring token (§6: "spring 260/24"). */
const SPRING_STIFFNESS = 260
const SPRING_DAMPING = 24
const SPRING_MASS = 1
/** Chegaradan tashqariga tortilganda qarshilik (iOS rubber-band'dan qattiqqroq). */
const RUBBER_BAND = 0.35
/** Bo'yashdagi momentum: v px/s → qo'shimcha v × 0.28 px siljish. */
const FLICK_PROJECTION = 0.28
/** Spring tugash chegarasi (px va px/s). */
const SNAP_EPSILON = 0.2
/** Kadr uzunligini cheklash — tab ga'lib ketsa rAF "sakrab" ketmasin. */
const MAX_FRAME = 1 / 30
/** Tezlik uchun saqlanadigan namunalar soni. */
const MAX_SAMPLES = 6

export function InertiaCarousel({
  children,
  ariaLabel,
  slides,
  autoplayMs = 6000,
  className,
  trackClassName,
  dotsClassName,
}: InertiaCarouselProps) {
  const items = Children.toArray(children)
  const itemCount = items.length
  const slideCount = Math.min(slides ?? itemCount, itemCount)

  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [overflowing, setOverflowing] = useState(false)
  /** SSR xavfsiz: boshlang'ich `false` (mobil hisob), `sync()` da breakpointga moslanadi. */
  const [isDesktop, setIsDesktop] = useState(false)
  const { ready, reduced, pointerFine } = useSafeMotion()

  useIsomorphicLayoutEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const desktop = window.matchMedia('(min-width: 768px)')

    let snaps: number[] = []
    let overflow = false
    let x = 0
    let velocity = 0
    let target = 0
    let index = 0
    let frame = 0
    let lastFrameTime = 0
    let dragging = false
    let pointerId: number | null = null
    let startX = 0
    let startOffset = 0
    let samples: { t: number; x: number }[] = []
    let autoplayTimer = 0

    const render = (value: number) => {
      track.style.transform = `translate3d(${value}px, 0, 0)`
    }

    /** Har kartaning snap nuqtasi. `translateX` qiymati **manfiy**: karta viewport'ning
     *  chap chegarasiga kelsa track chapga suriladi, ya'ni `x = trackLeft − card.left`.
     *  Track `position: static` bo'lgani uchun `offsetLeft` ishlatilmaydi (uning
     *  `offsetParent` butun sahifa bo'lardi) — farq `getBoundingClientRect` orqali olinadi:
     *  track ham, kartalar ham bir xil transform'dan siljiganligi uchun natija barqaror.
     *  Oxirgi kartalar track chegarasidan o'ta olmaydi → `[−limit, 0]` ga qisiladi. */
    const measure = () => {
      const cards = Array.from(track.children) as HTMLElement[]
      const trackLeft = track.getBoundingClientRect().left
      const limit = Math.max(0, track.scrollWidth - viewport.clientWidth)
      overflow = limit > 1
      setOverflowing(overflow)
      snaps = cards.map((card) =>
        Math.min(0, Math.max(-limit, trackLeft - card.getBoundingClientRect().left)),
      )
    }

    const cancelFrame = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    const settle = () => {
      cancelFrame()
      x = target
      velocity = 0
      render(x)
    }

    /** Semi-implicit Euler: F = -k·Δx − c·v, m = 1. */
    const springTo = (position: number) => {
      target = position
      if (reduced) {
        settle()
        return
      }

      lastFrameTime = performance.now()
      cancelFrame()

      const tick = (now: number) => {
        const dt = Math.min(MAX_FRAME, (now - lastFrameTime) / 1000)
        lastFrameTime = now
        const force = (-SPRING_STIFFNESS * (x - target) - SPRING_DAMPING * velocity) / SPRING_MASS
        velocity += force * dt
        x += velocity * dt

        if (Math.abs(x - target) < SNAP_EPSILON && Math.abs(velocity) < SNAP_EPSILON) {
          settle()
          return
        }

        render(x)
        frame = requestAnimationFrame(tick)
      }

      frame = requestAnimationFrame(tick)
    }

    const goTo = (next: number) => {
      if (!snaps.length) return
      index = Math.min(snaps.length - 1, Math.max(0, next))
      setActive(index)
      springTo(snaps[index])
    }

    const nearest = (position: number) => {
      let best = 0
      let distance = Infinity
      snaps.forEach((snap, at) => {
        const delta = Math.abs(snap - position)
        if (delta < distance) {
          distance = delta
          best = at
        }
      })
      return best
    }

    const stopTimer = () => {
      if (autoplayTimer) clearTimeout(autoplayTimer)
      autoplayTimer = 0
    }

    const schedule = () => {
      stopTimer()
      if (reduced || !overflow || snaps.length < 2) return
      autoplayTimer = window.setTimeout(() => {
        goTo(index + 1 >= snaps.length ? 0 : index + 1)
        schedule()
      }, autoplayMs)
    }

    const syncActiveFromScroll = () => {
      if (desktop.matches) return
      const [first, second] = Array.from(track.children) as HTMLElement[]
      if (!first || !second) return
      const step = second.offsetLeft - first.offsetLeft || first.offsetWidth
      const next = Math.round(viewport.scrollLeft / step)
      setActive(Math.min(slideCount - 1, Math.max(0, next)))
    }

    /** Breakpoint o'zgarganda / resize'da holatni qayta o'lchaydi. */
    const sync = () => {
      cancelFrame()
      velocity = 0
      track.style.transform = ''
      viewport.scrollLeft = 0
      measure()
      setIsDesktop(desktop.matches)
      viewport.style.scrollBehavior = reduced ? 'auto' : 'smooth'

      if (desktop.matches) {
        x = 0
        target = 0
        goTo(index)
      } else {
        syncActiveFromScroll()
      }

      schedule()
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!desktop.matches || !pointerFine || !overflow) return
      stopTimer()
      cancelFrame()
      dragging = true
      pointerId = event.pointerId
      startX = event.clientX
      startOffset = x
      samples = [{ t: event.timeStamp, x: event.clientX }]
      // `setPointerCapture` pointer id tasdiqlanmagan holatda (synthetic event) throw qiladi —
      // drag ishi pointermove'da davom etadi, capture faqat viewport tashqarisidagi
      // ko'rinishni to'xtatish uchun.
      try {
        viewport.setPointerCapture(event.pointerId)
      } catch {
        /* capture ixtiyoriy */
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return
      const edge = snaps.length ? snaps[snaps.length - 1] : 0
      let next = startOffset + (event.clientX - startX)
      if (next > 0) next *= RUBBER_BAND
      else if (next < edge) next = edge + (next - edge) * RUBBER_BAND

      x = next
      render(x)
      samples.push({ t: event.timeStamp, x: event.clientX })
      if (samples.length > MAX_SAMPLES) samples.shift()
    }

    const endDrag = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return
      dragging = false
      try {
        if (viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId)
      } catch {
        /* capture olinmagan bo'lishi mumkin */
      }
      pointerId = null

      const first = samples[0]
      const last = samples[samples.length - 1]
      const elapsed = first && last ? last.t - first.t : 0
      const throwVelocity = elapsed > 0 ? (last.x - first.x) / (elapsed / 1000) : 0
      samples = []

      goTo(nearest(x + throwVelocity * FLICK_PROJECTION))
      schedule()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!desktop.matches || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return
      event.preventDefault()
      stopTimer()
      goTo(index + (event.key === 'ArrowRight' ? 1 : -1))
      schedule()
    }

    const visibility = () => {
      if (document.hidden) stopTimer()
      else schedule()
    }

    const viewportObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting) schedule()
        else stopTimer()
      },
      { threshold: 0 },
    )
    viewportObserver.observe(viewport)

    const resizeObserver = new ResizeObserver(sync)
    resizeObserver.observe(viewport)
    resizeObserver.observe(track)

    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointermove', onPointerMove)
    viewport.addEventListener('pointerup', endDrag)
    viewport.addEventListener('pointercancel', endDrag)
    viewport.addEventListener('keydown', onKeyDown)
    viewport.addEventListener('scroll', syncActiveFromScroll, { passive: true })
    // Autoplay pauzasi: hover, focus va touch/pointer boshlanishi.
    viewport.addEventListener('pointerenter', stopTimer)
    viewport.addEventListener('pointerleave', schedule)
    viewport.addEventListener('focusin', stopTimer)
    viewport.addEventListener('focusout', schedule)
    desktop.addEventListener('change', sync)
    document.addEventListener('visibilitychange', visibility)

    sync()

    return () => {
      cancelFrame()
      stopTimer()
      track.style.transform = ''
      viewport.style.scrollBehavior = ''
      viewportObserver.disconnect()
      resizeObserver.disconnect()
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('pointermove', onPointerMove)
      viewport.removeEventListener('pointerup', endDrag)
      viewport.removeEventListener('pointercancel', endDrag)
      viewport.removeEventListener('keydown', onKeyDown)
      viewport.removeEventListener('scroll', syncActiveFromScroll)
      viewport.removeEventListener('pointerenter', stopTimer)
      viewport.removeEventListener('pointerleave', schedule)
      viewport.removeEventListener('focusin', stopTimer)
      viewport.removeEventListener('focusout', schedule)
      desktop.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [ready, reduced, pointerFine, autoplayMs, itemCount, slideCount])

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {/* `tabIndex` — gorizontal skroll zonasiga klaviatura bilan kirish (WCAG 2.1.1);
          fokus halqa global `:focus-visible` dan keladi, dizaynda alohida holat yo'q. */}
      <div
        ref={viewportRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        className={cn(
          'snap-x snap-mandatory overscroll-x-contain overflow-x-auto md:snap-none md:overflow-hidden',
          overflowing && 'md:cursor-grab md:active:cursor-grabbing',
        )}
      >
        <div ref={trackRef} className={cn('flex w-max items-stretch', trackClassName)}>
          {items.map((item, index) => (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${isDesktop ? itemCount : slideCount}`}
              className="flex shrink-0 snap-start"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Dizayn `id1P8`: dots — faqat mobil. Indikator, boshqaruv emas (6px nuqta
          44px hit target bo'la olmaydi), shuning uchun `aria-hidden` + kartalar
          o'z `n / 3` yorlig'ini oladi. */}
      <div aria-hidden="true" className={cn('flex items-center gap-1.5 md:hidden', dotsClassName)}>
        {items.slice(0, slideCount).map((_, index) => (
          <span
            key={index}
            className={cn(
              'h-1.5 w-1.5 rounded-full bg-ink-900/12 transition-[width] duration-(--duration-base) ease-out-soft',
              index === active && 'w-[18px] bg-brand-500',
            )}
          />
        ))}
      </div>
    </div>
  )
}
