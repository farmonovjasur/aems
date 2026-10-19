import { cn } from '../../lib/cn'

/*
 * F3.8 — AuroraBackground (§3.01): brand (ko'k) / care (violet) / edu (mint) layer'lar.
 * Geometriya design.pen hero frame'idan (nN4iS, R3h312): o'lcham/pozitsiya/opacity 1:1,
 * blur effekti gradient falloff bilan taqlid qilinadi (filter: blur EMAS — §6 #6),
 * F7.11 drift uchun faqat transform/opacity ishlatiladi (data-aurora-layer hook).
 */

type AuroraLayer = {
  key: 'brand' | 'care' | 'edu'
  className: string
  background: string
}

/*
 * Contact glow uchun: Pencildagi `blur` radiusini butun quti bo'ylab yumshoq
 * falloff bilan taqlid qiladi (markaz = layer alpha, chekkada 0).
 */
function glow(color: string, alpha: number) {
  const stop = (percent: number) =>
    `color-mix(in srgb, ${color} ${Math.round((alpha * percent) / 100)}%, transparent)`
  return `radial-gradient(closest-side, ${stop(100)} 0%, ${stop(62)} 30%, ${stop(28)} 58%, ${stop(9)} 80%, transparent 100%)`
}

/* Hero layer'lari: markaziy alpha design'dagi layer fill alpha'si, opacity esa alohida */
function disc(color: string, alpha: number) {
  return `radial-gradient(closest-side, color-mix(in srgb, ${color} ${alpha}%, transparent) 0%, color-mix(in srgb, ${color} ${Math.round(alpha * 0.45)}%, transparent) 55%, transparent 92%)`
}

const HERO_LAYERS: AuroraLayer[] = [
  {
    key: 'brand',
    className:
      'left-[-20%] top-[-60px] h-[87vw] w-[108vw] opacity-60 md:left-[-11%] md:top-[-140px] md:h-[39vw] md:w-[53vw] md:opacity-50',
    background: disc('var(--color-brand-500)', 67),
  },
  {
    key: 'care',
    className:
      'left-[31%] top-[240px] h-[82vw] w-[97vw] opacity-55 md:left-[61%] md:top-[-60px] md:h-[36vw] md:w-[49vw] md:opacity-45',
    background: disc('var(--color-care-500)', 60),
  },
  {
    key: 'edu',
    className: 'hidden md:block md:left-[18%] md:top-[520px] md:h-[33vw] md:w-[44vw] md:opacity-40',
    background: disc('var(--color-edu-500)', 40),
  },
]

/*
 * Contact glow (`JHQ4W` desktop · `kkbaV` mobil) — dizayndagi **bitta** layer:
 *   desktop — `brand-500` 30% (`#4B6BFF4D`), 560×520, `(-140, 200)`, blur 130
 *   mobil   — `care-500` 20% (`#A78BFA33`), 300×300, `(180, -80)` (o'ng yuqori)
 * Pencil'dagi `blur` effekti ko'p stopli radial falloff bilan taqlid qilinadi —
 * `filter: blur` ishlatilmaydi (§6 #6: DOM motion faqat transform + opacity).
 */
const CONTACT_LAYERS: AuroraLayer[] = [
  {
    key: 'care',
    className: 'top-[-80px] left-[180px] size-[300px] lg:hidden',
    background: glow('var(--color-care-500)', 20),
  },
  {
    key: 'brand',
    className: 'top-[200px] left-[-140px] hidden size-[520px] w-[560px] lg:block',
    background: glow('var(--color-brand-500)', 30),
  },
]

export function AuroraBackground({
  variant = 'hero',
  className,
}: {
  variant?: 'hero' | 'contact'
  className?: string
}) {
  const layers = variant === 'hero' ? HERO_LAYERS : CONTACT_LAYERS

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {layers.map((layer) => (
        <div
          key={layer.key}
          data-aurora-layer={layer.key}
          className={cn('absolute rounded-full', layer.className)}
          style={{ backgroundImage: layer.background }}
        />
      ))}
    </div>
  )
}
