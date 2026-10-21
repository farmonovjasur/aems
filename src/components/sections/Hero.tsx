import { useTranslation } from 'react-i18next'
import { onAnchorClick } from '../../lib/anchors'
import { CONTACT } from '../../lib/contacts'
import { cn } from '../../lib/cn'
import { AuroraBackground } from '../ui/AuroraBackground'
import { ButtonLink } from '../ui/Button'
import { Chip } from '../ui/Chip'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import {
  IconArrow,
  IconCheck,
  IconGlobe,
  IconGraduationCap,
  IconHeartPulse,
  IconMessageCircle,
} from '../ui/icons'

/*
 * F6.1 — 01 · Hero (split) — design.pen §3.01:
 * Desktop (nN4iS): aurora (3 layer) + eyebrow + H1 (serif gradient aksent) + 2 CTA
 *   + 2 split-panel (EDUCATION / CARE).
 * Mobile (R3h312): stacked, aurora 2 layer, CTA full-width, panel'lar ustma-ust.
 * O'lchovlar/typografiya/opacity — design.pen'dan 1:1 (motion qatlami F7'da).
 */

type PanelTone = 'mint' | 'violet' | 'gold'

type PanelConfig = {
  tone: PanelTone
  hash: string
  Icon: typeof IconGraduationCap
  chip: string
  title: string
  bullets: string[]
  link: string
}

const PANEL_ACCENT: Record<PanelTone, { border: string; surface: string; text: string }> = {
  mint: {
    border: 'border-edu-500/25',
    surface: 'bg-linear-to-b from-panel-edu-from to-panel-edu-to',
    text: 'md:text-edu-500',
  },
  violet: {
    border: 'border-care-500/25',
    surface: 'bg-linear-to-b from-panel-care-from to-panel-care-to',
    text: 'md:text-care-500',
  },
  gold: {
    border: 'border-gold-500/25',
    surface: 'bg-linear-to-b from-panel-gold-from to-panel-gold-to',
    text: 'md:text-gold-500',
  },
}

function SplitPanel({ tone, hash, Icon, chip, title, bullets, link }: PanelConfig) {
  const accent = PANEL_ACCENT[tone]

  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-3 rounded-lg border p-5 md:min-h-[296px] md:gap-xl md:p-7',
        accent.border,
        accent.surface,
      )}
    >
      <div className="flex flex-col gap-3 md:gap-3.5">
        <Chip size="sm" tone={tone} icon={<Icon className="size-3 md:size-[13px]" />}>
          {chip}
        </Chip>
        <h3 className="font-display text-[21px] leading-[normal] font-bold text-hi-dark md:text-[34px] md:leading-[1.05]">
          {title}
        </h3>
        <ul className="flex flex-col gap-3 md:gap-3.5">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-2 md:gap-[9px]">
              <IconCheck
                className={cn('size-3.5 shrink-0 text-mid-dark md:size-[15px]', accent.text)}
              />
              <span className="text-sm leading-[normal] text-mid-dark md:text-[15px]">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* -my-3 py-3: dizayn pozitsiyasi saqlanadi, hit-area 43px ga kengayadi */}
      <a
        href={hash}
        onClick={(event) => onAnchorClick(event, hash)}
        className="inline-flex w-fit items-center gap-1.5 py-3.5 -my-3 md:gap-2 md:py-3"
      >
        <span className="text-[15px] leading-[normal] font-semibold text-hi-dark">{link}</span>
        <IconArrow className={cn('size-[15px] text-hi-dark md:size-4', accent.text)} />
      </a>
    </div>
  )
}

export function Hero() {
  const { t } = useTranslation()

  const panels: PanelConfig[] = [
    {
      tone: 'gold',
      hash: '#affiliate-marketing',
      Icon: IconGlobe,
      chip: t('hero.affiliate.chip'),
      title: t('hero.affiliate.title'),
      bullets: [t('hero.affiliate.line')],
      link: t('hero.affiliate.link'),
    },
    {
      tone: 'mint',
      hash: '#admission',
      Icon: IconGraduationCap,
      chip: t('hero.education.chip'),
      title: t('hero.education.title'),
      bullets: [t('hero.education.meta'), t('hero.education.line')],
      link: t('hero.education.link'),
    },
    {
      tone: 'violet',
      hash: '#medical-services',
      Icon: IconHeartPulse,
      chip: t('hero.care.chip'),
      title: t('hero.care.title'),
      bullets: [t('hero.care.meta'), t('hero.care.line')],
      link: t('hero.care.link'),
    },
  ]

  return (
    <Section className="relative flex flex-col gap-6 overflow-hidden pt-[108px] pb-14 md:gap-7 md:pt-[120px] md:pb-3xl">
      <AuroraBackground />

      <Container className="relative flex flex-col items-center gap-[22px] text-center">
        <p className="font-mono text-[10px] tracking-[2px] text-mid-dark uppercase md:text-xs">
          {t('hero.eyebrow')}
        </p>

        <h1 className="font-display text-[32px] leading-[1.08] font-extrabold text-hi-dark md:text-[76px] md:leading-none">
          <span className="block">{t('hero.titleLine1')}</span>
          <span className="flex flex-wrap items-center justify-center gap-[7px] md:gap-[14px]">
            <em className="bg-[linear-gradient(60deg,var(--color-edu-500)_0%,var(--color-care-500)_55%,var(--color-care-glow)_100%)] bg-clip-text font-extrabold text-transparent not-italic md:font-accent md:text-[82px] md:font-normal md:leading-[1.3] md:italic">
              {t('hero.titleAccent')}
            </em>
            <span>{t('hero.titleLine2')}</span>
          </span>
        </h1>

        <p className="max-w-[620px] text-[15px] leading-[1.55] text-mid-dark md:text-[19px]">
          {t('hero.sub')}
        </p>

        <div className="flex w-full flex-col gap-2.5 pt-1.5 pb-2.5 md:w-auto md:flex-row md:gap-3.5">
          <ButtonLink
            href="#registration"
            arrow
            onClick={(event) => onAnchorClick(event, '#registration')}
            className="w-full md:w-auto"
          >
            {t('common.freeConsultation')}
          </ButtonLink>
          <ButtonLink
            variant="secondary"
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            trailingIcon={<IconMessageCircle className="size-4 shrink-0" />}
            className="w-full md:w-auto"
          >
            {t('common.talkWhatsapp')}
          </ButtonLink>
        </div>
      </Container>

      <Container className="relative flex flex-col gap-3.5 md:gap-lg">
        <h2 className="text-center font-display text-[22px] leading-[1.1] font-bold text-hi-dark md:text-[32px]">
          {t('hero.servicesTitle')}
        </h2>

        <div className="grid gap-3.5 md:grid-cols-2 md:gap-lg lg:grid-cols-3">
          {panels.map((panel) => (
            <SplitPanel key={panel.tone} {...panel} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
