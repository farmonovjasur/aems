import { useId, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { onAnchorClick } from '../../lib/anchors'
import { CONTACT, SOCIAL_LINKS } from '../../lib/contacts'
import { cn } from '../../lib/cn'
import { DUR, EASE_SOFT, ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { IconPlus } from '../ui/icons'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NAV_LINKS } from './nav-links'

/*
 * F5.8–F5.10 — 11 · Footer (design.pen `OOYAk` desktop 1440×826 · `P2R9LG` mobil 390×839,
 * PLAN.md §3.14).
 *
 * Desktop (`OOYAk` · `ink-900` · 826px · padding [0,0,32,0]):
 *   `CTA strip` 187px (padding 56/80 · space-between · center): chapda
 *   H2 `Ready to start?` (display 44/1.05 · 700 · `text-hi-dark`) + sub 16px `text-mid-dark`
 *   (gap 8); o'ngda `Buttons` (gap 14) — `vBrvK` "Free Consultation" (→ #registration) va
 *   `A0tzyg` "Chat on WhatsApp" (→ wa.me).
 *   → `Divider` #FFFFFF14 · `Wordmark row` 259px (padding 56/80/40/80 · gap 16 · center):
 *     wordmark 118px `font-display` **800** · linear-gradient 70°
 *     (`edu-500 → brand-500 50% → care-500`) · `textAlign center`; tagline 22px
 *     **Instrument Serif italic** `text-mid-dark` (markazda).
 *   → `Link columns` 279px (padding 8/80/40/80 · space-between): 4 × **240px** ustun,
 *     gap 12; sarlavha `font-mono` 11px / ls 1.5 `text-mid-dark` UPPER; link 15px `text-hi-dark`.
 *   → `Divider 2` · `Bottom bar` (padding-top 22 · gap 10): qator — `font-mono` 12px
 *     `© 2026 …` (chap) + `Amigos En Mundo Consulting — AEM` (o'ng); medical disclaimer
 *     12px / 1.55 to'liq kenglikda.
 *
 * Mobil (`P2R9LG` · 839px · padding 28/20 · gap 24):
 *   CTA strip yo'q — CTA §17 "Final CTA" (`zAQGk`) shu yerda bo'ladi (motion map qator 17:
 *   "Desktop: no mid-page CTA — the footer carries the final CTA"). Yuqorida faqat `Divider`.
 *   Wordmark **38px**, chapga tekislangan; tagline 15px `font-body` (serif/italic mobil yo'q —
 *   dizayn mobilni ataylab shunday soddalashtirgan, `Contact` H2 bilan bir xil qaror).
 *   4 ta guruh sarlavhasi `font-mono` 10px / ls 1; ichida linklar **2 ustun** (gap 16),
 *   ustun ichida gap 10, link 14px. Bottom bar: 3 qator (copyright · AEM line · disclaimer),
 *   gap 24, hammasi 12px.
 *
 * Mobil guruhlar: dizayn statik freymda ochiq ko'rsatilgan, ammo PLAN.md §4 ("Footer link
 * columns → accordion") va motion map qator 18 ("Mobile accordions (Quick Links / Contact /
 * Social) open/close with the same icon rotation as #10") boshqa holatni ko'rsatadi —
 * shuning uchun sarlavha `<button>` + `+` 45° (#17), panel ichida dizaynning **aniq 2 ustunli**
 * grid'i. Default yopiq (Footer balandligi ixcham), ochilganda `P2R9LG` kompozitsiyasi.
 *
 * Motion (motion notes `Y8IYL` · Section map qator 17 · 18 · Effects #2 · #17 · #19):
 *   • #19 wordmark — view'da harfma-harf `yPercent 115 → 0`, **1.2s**, stagger 0.028,
 *     `EASE_SOFT`; light parallax `yPercent −8` scrub (`top bottom → bottom top`).
 *     Reduced-motion: "No parallax — letters appear together" → parallax yo'q, barcha
 *     harflar 150ms opacity fade bilan **birga** chiqadi.
 *   • #2 CTA sarlavhasi — word-mask `Reveal` (0.9s / 0.06s); CTA qatori `FadeUp` (#10 view qismi).
 *   • #17 mobil accordion — `grid-template-rows 0fr→1fr` + `+` 45° (`--duration-base` 400ms).
 *   Transform + opacity only (§6 global qoidasi) — height/margin animatsiyasi yo'q.
 *
 * F5.10 — dead link 0: dizayndagi FAQ / Privacy / Terms va Instagram / YouTube linklari
 * render qilinmaydi (URL'lar tasdiqlanmagan, `PLAN.md` §5.5 — open savol). Faqat
 * `NAV_LINKS` va `SOCIAL_LINKS` (tasdiqlangan 2 ta) chiqadi.
 *
 * A11y: har link ≥ 24px (2.5.8 AA); mobil guruh sarlavhasi `min-h-11` (44px); sarlavha
 * `<h3>` + `aria-expanded`/`aria-controls`/`role="region"`; yopiq panel `inert`;
 * wordmark ekran o'quvchilar uchun `sr-only` nusxada (animatsiyali nusxa `aria-hidden`).
 */

type LinkItem = { key: string; node: ReactNode }

const LINK_CLASS =
  'text-[14px] leading-[1.35] text-hi-dark transition-colors ease-out-soft duration-(--duration-fast) hover:text-white lg:text-[15px]'

const COLUMN_TITLE_CLASS =
  'font-mono text-[10px] tracking-[1px] text-mid-dark uppercase lg:text-[11px] lg:tracking-[1.5px]'

function Divider() {
  return <div aria-hidden="true" className="h-px w-full bg-white/[0.08]" />
}

function ColumnTitle({ children }: { children: ReactNode }) {
  return <h3 className={COLUMN_TITLE_CLASS}>{children}</h3>
}

/** Dizayn ustuni (desktop `gap: 12`) yoki mobil panel ichidagi ustun (`gap: 10`). */
function LinkStack({ items, gap = 'gap-2.5' }: { items: LinkItem[]; gap?: string }) {
  return (
    <ul className={cn('flex flex-col', gap)}>
      {items.map((item) => (
        <li key={item.key}>{item.node}</li>
      ))}
    </ul>
  )
}

/** `P2R9LG` panel ichi: 2 ustun (gap 16), har biri vertikal (gap 10). */
function MobileColumns({ items }: { items: LinkItem[] }) {
  const half = Math.ceil(items.length / 2)
  return (
    <div className="flex gap-4">
      <LinkStack items={items.slice(0, half)} />
      <LinkStack items={items.slice(half)} />
    </div>
  )
}

/** Mobil accordion guruhi — motion #17 (`+` 45° aylanish, 0.4s, §6.2 #17). */
function MobileGroup({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <div>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
          className="flex min-h-11 w-full items-center justify-between gap-md text-left"
        >
          <span className={COLUMN_TITLE_CLASS}>{title}</span>
          <IconPlus
            className={cn(
              'size-4 shrink-0 text-mid-dark transition-transform ease-out-soft duration-(--duration-base)',
              open && 'rotate-45',
            )}
          />
        </button>
      </h3>
      <div
        id={id}
        role="region"
        inert={!open}
        className={cn(
          'grid transition-[grid-template-rows] ease-out-soft duration-(--duration-base)',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-3">{children}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * CTA sarlavhasi — #2 word-mask reveal (0.9s / 0.06s stagger).
 * IntersectionObserver orqali ishonchli ishga tushadi.
 */
function CTATitle({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const { ready, reduced } = useSafeMotion()
  const hasAnimatedRef = useRef(false)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el || !ready) return
    ensureGsap()

    const words = el.querySelectorAll<HTMLElement>('[data-cta-word]')
    if (!words.length) return

    const animateIn = () => {
      if (hasAnimatedRef.current) return
      hasAnimatedRef.current = true

      if (reduced) {
        gsap.fromTo(
          words,
          { opacity: 0 },
          { opacity: 1, duration: DUR.fast, ease: 'none', clearProps: 'opacity' },
        )
        return
      }

      gsap.fromTo(
        words,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.06,
          ease: EASE_SOFT,
          clearProps: 'transform',
        },
      )
    }

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            animateIn()
            observer.disconnect()
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
      )
      observer.observe(el)

      const timer = setTimeout(animateIn, 1500)
      return () => {
        observer.disconnect()
        clearTimeout(timer)
      }
    } else {
      animateIn()
    }
  }, [ready, reduced])

  const wordList = text.split(/\s+/).filter(Boolean)

  return (
    <h2 ref={ref} className={className}>
      {wordList.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span data-cta-word className="inline-block">
              {word}
            </span>
          </span>
          {index < wordList.length - 1 ? ' ' : null}
        </span>
      ))}
    </h2>
  )
}

/**
 * CTA button row — FadeUp effekti (#10 view qismi).
 */
function CTAButtons({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { ready, reduced } = useSafeMotion()
  const hasAnimatedRef = useRef(false)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el || !ready) return
    ensureGsap()

    const animateIn = () => {
      if (hasAnimatedRef.current) return
      hasAnimatedRef.current = true

      if (reduced) {
        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: DUR.fast, ease: 'none', clearProps: 'opacity' },
        )
        return
      }

      gsap.fromTo(
        el,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.06,
          ease: EASE_SOFT,
          clearProps: 'transform,opacity',
        },
      )
    }

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            animateIn()
            observer.disconnect()
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
      )
      observer.observe(el)

      const timer = setTimeout(animateIn, 1500)
      return () => {
        observer.disconnect()
        clearTimeout(timer)
      }
    } else {
      animateIn()
    }
  }, [ready, reduced])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}

/**
 * Wordmark — motion #19:
 * Harfma-harf reveal (yPercent 115 → 0, 1.2s, stagger 0.028, EASE_SOFT)
 * + yengil parallax (yPercent -8 scrub: top bottom -> bottom top).
 * Reduced-motion: parallax yo'q, 150ms opacity fade.
 *
 * IntersectionObserver yordamida harf animatsiyasi 100% ishonchli ishlaydi
 * va matn hech qachon g'oyib bo'lib qolmaydi.
 */
function WordmarkRow({
  text,
  tagline,
}: {
  text: string
  tagline: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const { ready, reduced } = useSafeMotion()
  const hasAnimatedRef = useRef(false)

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    const inner = innerRef.current
    const taglineEl = taglineRef.current
    if (!root || !inner || !ready) return
    ensureGsap()

    const animateIn = () => {
      if (hasAnimatedRef.current) return
      hasAnimatedRef.current = true

      if (reduced) {
        gsap.fromTo(
          inner,
          { opacity: 0 },
          {
            opacity: 1,
            duration: DUR.fast,
            ease: 'none',
            clearProps: 'opacity',
          },
        )
        if (taglineEl) {
          gsap.fromTo(
            taglineEl,
            { opacity: 0 },
            { opacity: 1, duration: DUR.fast, ease: 'none', clearProps: 'opacity' },
          )
        }
        return
      }

      // Wordmark reveal (#19: 1.2s, EASE_SOFT)
      gsap.fromTo(
        inner,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.2,
          ease: EASE_SOFT,
          clearProps: 'transform',
        },
      )

      if (taglineEl) {
        gsap.fromTo(
          taglineEl,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.25,
            ease: EASE_SOFT,
            clearProps: 'transform,opacity',
          },
        )
      }
    }

    // Parallax effekti (faqat reduced bo'lmaganda)
    let parallaxCtx: gsap.Context | undefined
    if (!reduced) {
      parallaxCtx = gsap.context(() => {
        gsap.to(inner, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }, root)
    }

    // IntersectionObserver orqali ishonchli trigger
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            animateIn()
            if (!reduced) {
              ScrollTrigger.refresh()
            }
            observer.disconnect()
          }
        },
        {
          threshold: 0.08,
          rootMargin: '0px 0px -10px 0px',
        },
      )
      observer.observe(root)

      const timer = setTimeout(() => {
        animateIn()
      }, 1500)

      return () => {
        observer.disconnect()
        clearTimeout(timer)
        parallaxCtx?.revert()
      }
    } else {
      animateIn()
      return () => {
        parallaxCtx?.revert()
      }
    }
  }, [ready, reduced])

  return (
    <div
      ref={rootRef}
      className="flex flex-col items-start gap-2 lg:items-center lg:gap-4 lg:pt-14 lg:pb-10"
    >
      <span className="sr-only">{text}</span>
      <div className="w-full overflow-hidden pb-[0.08em] -mb-[0.08em] lg:text-center">
        <span
          ref={innerRef}
          aria-hidden="true"
          className="inline-block w-full bg-[linear-gradient(70deg,var(--color-edu-500)_0%,var(--color-brand-500)_50%,var(--color-care-500)_100%)] bg-clip-text font-display text-[clamp(38px,8.2vw,118px)] leading-none font-extrabold text-transparent will-change-transform lg:text-center"
        >
          {text}
        </span>
      </div>
      <p
        ref={taglineRef}
        className="text-[15px] text-mid-dark lg:font-accent lg:text-[22px] lg:text-center lg:italic"
      >
        {tagline}
      </p>
    </div>
  )
}

export function Footer() {
  const { t } = useTranslation()

  const quickLinks: LinkItem[] = NAV_LINKS.map((link) => ({
    key: link.key,
    node: (
      <a href={link.hash} onClick={(event) => onAnchorClick(event, link.hash)} className={LINK_CLASS}>
        {t(`nav.${link.key}`)}
      </a>
    ),
  }))

  const contact: LinkItem[] = [
    {
      key: 'email',
      node: (
        <a href={`mailto:${CONTACT.email}`} className={LINK_CLASS}>
          {CONTACT.email}
        </a>
      ),
    },
    {
      key: 'phoneUz',
      node: (
        <a href={`tel:${CONTACT.phoneUz}`} className={LINK_CLASS}>
          {CONTACT.phoneUzDisplay}
        </a>
      ),
    },
    {
      key: 'phoneIndia',
      node: (
        <a href={`tel:${CONTACT.phoneIndia}`} className={LINK_CLASS}>
          {CONTACT.phoneIndiaDisplay}
        </a>
      ),
    },
    {
      key: 'address',
      node: <p className="text-[14px] leading-[1.35] text-hi-dark lg:text-[15px]">{t('contact.address')}</p>,
    },
    {
      key: 'hours',
      node: <p className="text-[14px] leading-[1.35] text-hi-dark lg:text-[15px]">{t('contact.hours')}</p>,
    },
  ]

  const social: LinkItem[] = SOCIAL_LINKS.map((item) => ({
    key: item.key,
    node: (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_CLASS}
      >
        {t(`footer.social.${item.key}`)}
      </a>
    ),
  }))

  const wordmark = t('footer.wordmark')
  const tagline = t('footer.tagline')

  return (
    <footer id="footer" className="relative overflow-hidden bg-ink-900" data-testid="footer">
      <Container className="flex flex-col gap-6 pt-7 pb-7 lg:gap-0 lg:pt-0 lg:pb-8">
        {/* --- CTA strip: faqat md+ (mobil §17 "Final CTA" — `zAQGk`) --- */}
        <div className="hidden items-center justify-between gap-lg py-14 md:flex">
          <div className="flex flex-col gap-2">
            <CTATitle
              text={t('footer.ctaTitle')}
              className="font-display text-[44px] leading-[1.05] font-bold text-hi-dark"
            />
            <p className="text-[16px] text-mid-dark">{t('footer.ctaSub')}</p>
          </div>

          <CTAButtons className="flex flex-wrap items-center gap-3.5">
            <ButtonLink
              href="#registration"
              onClick={(event) => onAnchorClick(event, '#registration')}
              arrow
            >
              {t('common.freeConsultation')}
            </ButtonLink>
            <ButtonLink
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
            >
              {t('common.chatWhatsapp')}
            </ButtonLink>
          </CTAButtons>
        </div>

        <Divider />

        {/* --- Wordmark row — motion #19 --- */}
        <WordmarkRow text={wordmark} tagline={tagline} />

        {/* --- Link columns — desktop 4 × 240px (`gap: 12`) --- */}
        <div className="hidden justify-between lg:flex lg:pt-2 lg:pb-10">
          <div className="flex w-[240px] flex-col gap-3">
            <ColumnTitle>{t('footer.quickLinksTitle')}</ColumnTitle>
            <LinkStack items={quickLinks} gap="gap-3" />
          </div>
          <div className="flex w-[240px] flex-col gap-3">
            <ColumnTitle>{t('footer.contactTitle')}</ColumnTitle>
            <LinkStack items={contact} gap="gap-3" />
          </div>
          <div className="flex w-[240px] flex-col gap-3">
            <ColumnTitle>{t('footer.socialTitle')}</ColumnTitle>
            <LinkStack items={social} gap="gap-3" />
          </div>
          <div className="flex w-[240px] flex-col gap-3">
            <ColumnTitle>{t('footer.languageTitle')}</ColumnTitle>
            <LanguageSwitcher variant="list" />
          </div>
        </div>

        {/* --- Link columns — mobil accordion (#17), ichida dizaynning 2 ustuni --- */}
        <div className="flex flex-col gap-6 lg:hidden">
          <MobileGroup title={t('footer.quickLinksTitle')}>
            <MobileColumns items={quickLinks} />
          </MobileGroup>
          <MobileGroup title={t('footer.contactTitle')}>
            <MobileColumns items={contact} />
          </MobileGroup>
          <MobileGroup title={t('footer.socialTitle')}>
            <MobileColumns items={social} />
          </MobileGroup>
          <MobileGroup title={t('footer.languageTitle')}>
            <LanguageSwitcher variant="list" listColumns={2} />
          </MobileGroup>
        </div>

        <Divider />

        {/* --- Bottom bar --- */}
        <div className="pt-5 lg:pt-[22px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[12px] text-mid-dark lg:font-mono">{t('footer.copyright')}</p>
            <p className="text-[12px] text-mid-dark lg:font-mono">{t('footer.brandLine')}</p>
          </div>
          <p className="mt-6 text-[12px] leading-[1.5] text-mid-dark lg:mt-2.5 lg:leading-[1.55]">
            {t('footer.medicalDisclaimer')}
          </p>
        </div>
      </Container>
    </footer>
  )
}
