import { useTranslation } from 'react-i18next'
import { CONTACT } from '../../lib/contacts'
import { InertiaCarousel } from '../motion/InertiaCarousel'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { IconQuote } from '../ui/icons'

/*
 * F6.11 — 08 · Testimonials (design.pen `v4QAtK` desktop 1440·614px · `Q8Gqwo` mobil 390).
 *
 * Desktop (`v4QAtK` · paper-50 · padding 96/80 · gap 36):
 *   Section Head — 640px ustun (gap 12: eyebrow mono 12/2 `stories` → H2 display
 *   44/1.05). Dizayndagi `Drag hint` pill (`DpKUk`) **butunlay olib tashlandi**:
 *   u foydalanuvchiga emas, dizayn ko'rib chiqish paytidagi ishlab chiquvchiga
 *   ko'rsatma edi (`#0B102010` yuzа · radius 999 · `move-horizontal` 15px).
 *   Carousel (1280 · gap 20) — 4 ta 305×266 kartadan iborat tekis ro'yxat:
 *     ①–③ `Quote · …` — oq, radius 24, `ring-ink-900/8`, padding 26,
 *        gap 18: quote belgisi 26px `brand-500` → matn Geist 16/1.6 → `Author`
 *        (avatar 48 + 12px + ism 15/600 + meta mono 11). Balandlik dizayn matni uchun
 *        `min-h` — uzunroq tarjimalar kattaroq karta beradi, matn kesilmaydi.
 *     ④ `CTA Card` — `ink-900`, radius 24, padding 26, `space-between`: display 24/1.15
 *        + Geist 14/1.55 + `Btn Primary` «Talk to us» (arrow bilan).
 *
 * Mobile (`Q8Gqwo` · gutter 20 · padding 64/20 · gap 20): bitta ustun — head ichida
 *   eyebrow 11/2 → H2 24 → `SWIPE →` mono 10/1; carousel native scroll-snap
 *   (290×236 kartalar, gap 44 — dizayn qiymati, kartalar bir-birini ko'rsatadi);
 *   kartada quote belgisi YO'Q, avatar 40, `Author` gap 10, ism 14.5/600, meta **body**
 *   11 (desktopda mono); pastda dots (active 18×6 `brand-500`, qolganlari 6×6
 *   `ink-900/12`). `CTA Card` mobilda yo'q.
 *
 * Motion: `Y8IYL` · Section map row 13 → **faqat #16** (draggable inertia carousel,
 *   autoplay hover/touch'da pauza; reduced-motion'da inertia va autoplay yo'q).
 *   #2 (word-mask) va #10 (fade-up stagger) ataylab qo'llanmadi — qaror va sabab
 *   `InertiaCarousel` fayl sarlavhasida. Autoplay kartaga tegib turib qayta-qayta
 *   o'ynagan bo'lardi, shuning uchun hech qanday view-trigger yo'q.
 *
 * A11y: har karta `n / 4` yorlig'ini oladi; skroll zona `role=group` +
 *   `tabIndex=0` (klaviatura bilan kirish, ←/→ bilan kartaga o'tish); dots
 *   `aria-hidden` indikator. Avatarlar matnli alternative hamga oladi.
 */

type Testimonial = {
  quote: string
  name: string
  role: string
  location: string
}

type CtaCopy = {
  title: string
  body: string
  cta: string
}

/**
 * Avatarlar `public/img/` dan (F1 asset pipeline) — dizayndagi Unsplash URL'larining
 * lokal ekvivalenti: `RJGjs` portraitA → avatar-a, `fOW4Z` portraitB → avatar-b,
 * `wRRq1` doctor → doctor. Har ikkala variant 2× DPR uchun.
 */
const AVATARS = [
  { file: '/img/avatar-a', widths: [96, 192], largest: 192 },
  { file: '/img/avatar-b', widths: [96, 192], largest: 192 },
  { file: '/img/doctor', widths: [128, 256], largest: 256 },
] as const

const CARD_BASE =
  'flex w-[290px] flex-col rounded-md bg-white ring-1 ring-ink-900/8 ring-inset md:w-[305px] md:rounded-[24px]'

const AUTHOR_BASE = 'flex items-center gap-2.5 md:gap-3'

function Avatar({ avatar, name }: { avatar: (typeof AVATARS)[number]; name: string }) {
  const srcSet = (extension: 'avif' | 'webp') =>
    avatar.widths.map((width) => `${avatar.file}-${width}.${extension} ${width}w`).join(', ')

  return (
    <picture className="block shrink-0 overflow-hidden rounded-full">
      <source type="image/avif" srcSet={srcSet('avif')} sizes="48px" />
      <source type="image/webp" srcSet={srcSet('webp')} sizes="48px" />
      <img
        src={`${avatar.file}-${avatar.largest}.webp`}
        alt={name}
        width={avatar.largest}
        height={avatar.largest}
        loading="lazy"
        decoding="async"
        className="size-10 rounded-full object-cover md:size-12"
      />
    </picture>
  )
}

function QuoteCard({ item, index }: { item: Testimonial; index: number }) {
  return (
    <article
      data-testid={`testimonial-card-${index + 1}`}
      className={`${CARD_BASE} h-[236px] justify-between gap-3.5 p-5 md:h-auto md:min-h-[266px] md:justify-start md:gap-[18px] md:p-[26px]`}
    >
      {/* Quote belgisi faqat desktopda (dizayn `tI0vM`; mobil `jtho6` da yo'q). */}
      <IconQuote className="hidden size-[26px] shrink-0 text-brand-500 md:block" />

      <p className="text-[15px] leading-[1.5] text-hi-light md:text-[16px] md:leading-[1.6]">
        &ldquo;{item.quote}&rdquo;
      </p>

      <div className={AUTHOR_BASE}>
        <Avatar avatar={AVATARS[index]} name={item.name} />

        <span className="flex flex-col gap-0.5">
          <span className="text-[14.5px] leading-[1.3] font-semibold text-hi-light md:text-[15px]">
            {item.name}
          </span>
          <span className="text-[11px] leading-[1.3] text-mid-light md:font-mono">
            {item.role} · {item.location}
          </span>
        </span>
      </div>
    </article>
  )
}

function CtaCard({ copy }: { copy: CtaCopy }) {
  return (
    <article
      data-testid="testimonial-cta-card"
      className="hidden w-[305px] flex-col justify-between gap-3.5 rounded-[24px] bg-ink-900 p-[26px] md:flex md:min-h-[266px]"
    >
      <h3 className="font-display text-[24px] leading-[1.15] font-bold text-hi-dark">
        {copy.title}
      </h3>

      <p className="text-[14px] leading-[1.55] text-mid-dark">{copy.body}</p>

      <ButtonLink
        href={CONTACT.whatsapp}
        target="_blank"
        rel="noreferrer noopener"
        variant="primary"
        arrow
        className="w-fit"
        data-testid="testimonial-cta-whatsapp"
      >
        {copy.cta}
      </ButtonLink>
    </article>
  )
}

export function Testimonials() {
  const { t } = useTranslation()
  const items = t('testimonials.items', { returnObjects: true }) as unknown as Testimonial[]
  const cta = t('testimonials.ctaCard', { returnObjects: true }) as unknown as CtaCopy

  return (
    <section id="testimonials" className="bg-paper-50" data-testid="testimonials">
      <Container className="flex flex-col gap-5 py-16 md:gap-[36px] md:py-4xl">
        {/* --- Section head: eyebrow + H2 / SWIPE → (mobile) --- */}
        <div className="flex flex-col gap-3 md:w-[640px]">
          <p className="font-mono text-[11px] tracking-[2px] text-stories uppercase md:text-xs">
            {t('testimonials.eyebrow')}
          </p>

          {/* `text-balance` YO'Q: dizayn `eWH5H` natural to'ldiruvchi (`fixed-width`)
              bo'linishda "Students and families we've" / "guided" qatorlarini beradi —
              balanslash 1-qatorga "Students and"ni surib tushirdi. */}
          <h2 className="font-display text-[24px] leading-[1.2] font-bold text-hi-light md:text-[44px] md:leading-[1.05]">
            {t('testimonials.title')}
          </h2>

          <p className="font-mono text-[10px] tracking-[1px] text-mid-light md:hidden">
            {t('testimonials.swipe')}
          </p>
        </div>

        {/* --- Carousel (#16) — mobil: gap 44 (dizayn `UIdZX`), desktop: gap 20 (`RP682`) --- */}
        <InertiaCarousel
          ariaLabel={t('testimonials.title')}
          slides={items.length}
          className="md:gap-0"
          trackClassName="gap-11 md:gap-5"
        >
          {items.map((item, index) => (
            <QuoteCard key={item.name} item={item} index={index} />
          ))}

          <CtaCard copy={cta} />
        </InertiaCarousel>
      </Container>
    </section>
  )
}
