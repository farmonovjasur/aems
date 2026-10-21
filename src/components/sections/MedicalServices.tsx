import type { ComponentType, MouseEvent, SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import { onAnchorClick } from '../../lib/anchors'
import { cn } from '../../lib/cn'
import { isPlainLeftClick, selectServiceForRegistration } from '../../lib/service-selection'
import { ButtonLink } from '../ui/Button'
import { Chip } from '../ui/Chip'
import { Container } from '../ui/Container'
import {
  IconArrow,
  IconBone,
  IconBrain,
  IconHeartHandshake,
  IconHeartPulse,
  IconScanLine,
  IconTarget,
} from '../ui/icons'

/*
 * Medical services — AEM endi bitta yo'nalish emas, balki Hindistondagi
 * hamkor klinikalar orqali oltita tibbiy yo'nalishni muvofiqlashtiradi.
 * Onkologiya — featured karta; qolgan kartalar Registration'da xizmatni
 * oldindan tanlaydi. Yangi rasm assetlari qo'shilmagan.
 */

type Specialty = {
  key: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  hash?: string
  service?: string
  featured?: boolean
}

const SPECIALTIES: Specialty[] = [
  {
    key: 'oncology',
    Icon: IconTarget,
    hash: '#cancer-treatment',
    featured: true,
  },
  {
    key: 'cardiology',
    Icon: IconHeartPulse,
    service: 'medical-cardiology',
  },
  {
    key: 'orthopedics',
    Icon: IconBone,
    service: 'medical-orthopedics',
  },
  {
    key: 'neurology',
    Icon: IconBrain,
    service: 'medical-neurology',
  },
  {
    key: 'transplant',
    Icon: IconHeartHandshake,
    service: 'medical-transplant',
  },
  {
    key: 'diagnostics',
    Icon: IconScanLine,
    service: 'medical-diagnostics',
  },
]

function SpecialtyCard({ specialty, index }: { specialty: Specialty; index: number }) {
  const { t } = useTranslation()
  const { key, Icon, hash, service, featured = false } = specialty
  const href = hash ?? '#registration'
  const base = `medical.specialties.${key}`

  return (
    <article
      className={cn(
        'group flex min-h-[264px] flex-col rounded-lg p-5 ring-1 ring-inset transition-[background-color,box-shadow] duration-(--duration-fast) ease-out-soft md:p-6',
        featured
          ? 'bg-ink-900 ring-white/10 hover:bg-ink-900/95'
          : 'bg-paper-50 ring-ink-900/8 hover:bg-white hover:shadow-bento',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'grid size-11 place-items-center rounded-[12px]',
            featured ? 'bg-care-glow/12 text-care-glow' : 'bg-brand-500/10 text-brand-600',
          )}
        >
          <Icon className="size-5" />
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'font-mono text-[10px] leading-none tracking-[1.5px]',
            featured ? 'text-white/30' : 'text-mid-light/60',
          )}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3
        className={cn(
          'mt-5 font-display text-[21px] leading-[1.2] font-bold',
          featured ? 'text-hi-dark' : 'text-hi-light',
        )}
      >
        {t(`${base}.title`)}
      </h3>

      <p
        className={cn(
          'mt-2 text-[14.5px] leading-[1.6]',
          featured ? 'text-mid-dark' : 'text-mid-light',
        )}
      >
        {t(`${base}.body`)}
      </p>

      <a
        href={href}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          if (!isPlainLeftClick(event)) return
          if (service) selectServiceForRegistration(service)
          onAnchorClick(event, href)
        }}
        className={cn(
          'mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-[14px] font-semibold transition-opacity duration-(--duration-fast) ease-out-soft hover:opacity-70',
          featured ? 'text-care-glow' : 'text-stories',
        )}
      >
        {t(`${base}.link`)}
        <IconArrow className="size-3.5 shrink-0 transition-transform ease-out-soft duration-(--duration-fast) group-hover:translate-x-0.5" />
      </a>
    </article>
  )
}

export function MedicalServices() {
  const { t } = useTranslation()

  return (
    <section id="medical-services" className="bg-white" data-testid="medical-services">
      <Container className="flex flex-col gap-8 py-16 md:gap-12 md:py-4xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex max-w-[700px] flex-col items-start gap-3.5">
            <p className="font-mono text-[11px] tracking-[2px] text-stories uppercase md:text-xs">
              {t('medical.eyebrow')}
            </p>

            <h2 className="font-display text-[30px] leading-[1.05] font-bold text-balance text-hi-light md:text-[48px]">
              {t('medical.title')}
            </h2>

            <Chip tone="violet" size="sm">
              {t('medical.chip')}
            </Chip>
          </div>

          <p className="max-w-[440px] text-[15px] leading-[1.6] text-mid-light md:text-base">
            {t('medical.sub')}
          </p>
        </div>

        <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {SPECIALTIES.map((specialty, index) => (
            <SpecialtyCard key={specialty.key} specialty={specialty} index={index} />
          ))}
        </div>

        <div className="flex flex-col gap-5 rounded-lg bg-paper-50 p-6 ring-1 ring-ink-900/8 ring-inset md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex max-w-[640px] flex-col gap-1.5">
            <h3 className="font-display text-[22px] leading-[1.2] font-bold text-hi-light md:text-[26px]">
              {t('medical.ctaTitle')}
            </h3>
            <p className="text-[14.5px] leading-[1.55] text-mid-light">{t('medical.ctaBody')}</p>
          </div>

          <ButtonLink
            href="#registration"
            arrow
            className="w-fit shrink-0"
            onClick={(event) => {
              if (!isPlainLeftClick(event)) return
              selectServiceForRegistration('medical-general')
              onAnchorClick(event, '#registration')
            }}
          >
            {t('common.requestCaseReview')}
          </ButtonLink>
        </div>

        <p className="max-w-[820px] text-xs leading-[1.6] text-mid-light">
          {t('medical.disclaimer')}
        </p>
      </Container>
    </section>
  )
}
