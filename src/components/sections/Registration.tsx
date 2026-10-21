import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { useSafeMotion } from '../../hooks/useSafeMotion'
import { CONTACT } from '../../lib/contacts'
import { COUNTRIES, countryName, toLocale } from '../../lib/countries'
import { DUR, EASE_SOFT, ensureGsap, useIsomorphicLayoutEffect } from '../../lib/motion'
import { SERVICE_GROUPS, SERVICES, serviceName } from '../../lib/services'
import { SERVICE_SELECTION_EVENT } from '../../lib/service-selection'
import { sendLead } from '../../lib/telegram'
import { Button, ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { Input, Textarea } from '../ui/Input'
import { IconAlertTriangle } from '../ui/icons'
import { SegmentedField } from '../ui/SegmentedField'
import { Select } from '../ui/Select'

/*
 * F6.12 — 09 · Registration (design.pen `zbhMY` desktop 1440·799px · `lTQlI` mobil 390).
 *
 * Desktop (`zbhMY` · `white` · padding 96/80):
 *   Section — `Columns` 1280, gap 56: chap `Left` 470px (vertical gap 20) +
 *   o'ngda `Form/Registration` 754px (470 + 56 + 754 = 1280 = `--container-page`).
 *   Left: eyebrow (mono 12/2 `stories`) → H2 (display 44/1.05/700) → sub
 *   (16/1.6 `mid-light`) → `WHAT HAPPENS NEXT` (mono 11/1.5 label + 10px oraliq,
 *   har qadam: 24px `ink-900/8` doira + mono 11/700 raqam, matn 16) →
 *   disclaimer (13/1.5, ustidan `Left` ichida 20px).
 *   Form: `white` · radius 24 · ring `ink-900/12` · `shadow-bento` (ink-900/12 · 0 20 60)
 *   · padding 40 · gap 20. Qatorlar: ① Full name | Country ② Choose service | Email
 *   ③ Gender (segmented, to'liq eni) ④ Message (to'liq eni) ⑤ `Register` 246px +
 *   o'ngda «We reply within 24 hours» (`space-between`, tepada 4px).
 *   Maydon: 52px · radius 12 · yuzа `white` · ring `ink-900/12` · label 13/600 +
 *   `*` `brand-500` (gap 3). Textarea 140px. Segment: track radius 12 (gap/padding 4),
 *   faol segment radius 9 · `ink-900` · label 15/600, faol emas 15/500 `mid-light`.
 *
 * Mobil (`lTQlI` · `white` · padding 64/20 · gap 16): bitta ustun, `Left` va forma
 *   ketma-ket; eyebrow 11/2 · H2 24 · sub 15/1.5 · qadam badge 22px, matn 14.5 ·
 *   «WHAT HAPPENS NEXT» label 10/1 `mid-dark`. Forma: radius 24 · ring `ink-900/12`
 *   · padding 20 · gap 16 · SOYA YO'Q; maydonlar 48px · yuzа `hi-dark` (#F4F6FB) ·
 *   label/control gap 6; segment 38px, label 14; textarea 96px; `Register` to'liq
 *   eni va ostida markazlangan eslatma (13px).
 *
 * Motion (`Y8IYL` · Section map qator 15 → **faqat #18**):
 *   #18 — focus/submit: fokusda yumshoq glow (ring 2px `brand-500` + 8px soxta),
 *   segment faol fonni 0.3s da sirqashtiradi, submit'da muvaffaqiyat `check`
 *   `stroke-dashoffset` bilan chiziladi (0.6s). Reduced-motion: glow va segment
 *   150ms fade qoladi, check chizilmasdan paydo bo'ladi.
 *   #2 (so'z-mask) ataylab qo'llanmadi — bu section faqat forma, sarlavha `Reveal`
 *   olmaydi (Section map boshqa qatorlarida ham #2 faqat CTA/footer sarlavhalarida).
 *
 * «Floating label» (#18 ning birinchi qismi) ataylab qo'llanmadi: section ramkasi
 * (`zbhMY` va `lTQlI`) labelni maydon ustida STATIK ko'rsatadi — components ramkasidagi
 * (`tXz9T` · `INPUTS · FLOATING LABEL`) mono-11 ichki label boshqa, `ink-900/10` yuzali
 * dark surface varianti. 100% dizayn mosligi uchun statik label qoldirildi.
 *
 * Submit: hech qanday backend yo'q — `lib/telegram.ts` `FormData` bilan Apps Script'ga
 * yuboradi (§9.5 Q1/Q3) va **javobni o'qib tekshiradi**. Telegram'ga yetmagan holatda
 * (§9.5 Q2 dan voz kechilib) foydalanuvchiga xato paneli ko'rsatiladi: qayta urinish +
 * WhatsApp zaxira yo'li. Klient-side validatsiya xatolari har doim alohida ko'rsatiladi.
 */

type FieldName = 'fullName' | 'country' | 'service' | 'email'

type FormValues = {
  fullName: string
  country: string
  service: string
  email: string
  gender: string
  message: string
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** #18 — muvaffaqiyat `check` chizilishi (0.3–0.6s oralig'ida, yuqori qiymat). */
const CHECK_DRAW_DUR = 0.6

const INITIAL_VALUES: FormValues = {
  fullName: '',
  country: '',
  service: '',
  email: '',
  gender: 'male',
  message: '',
}

/**
 * #18 — muvaffaqiyat belgisi: `stroke-dashoffset` bilan chiziladi.
 * Boshlang'ich offset SSR da ham qo'yiladi (gidratatsiya chaqnashmasligi uchun).
 */
function SuccessCheck() {
  const ref = useRef<SVGSVGElement>(null)
  const { ready, reduced } = useSafeMotion()

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el || !ready) return
    ensureGsap()

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.fromTo(
          el,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: DUR.fast, ease: 'none', delay: 0.1 },
        )
        return
      }

      const path = el.querySelector('path')
      if (!path) return
      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: CHECK_DRAW_DUR,
        delay: 0.1,
        ease: EASE_SOFT,
      })
    }, el)

    return () => ctx.revert()
  }, [ready, reduced])

  return (
    <span className="flex size-14 shrink-0 items-center justify-center rounded-pill bg-success/12">
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        width="26"
        height="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-success"
      >
        <path d="m4.5 12.5 5 5 10-10" style={{ strokeDasharray: 30, strokeDashoffset: 30 }} />
      </svg>
    </span>
  )
}

export function Registration() {
  const { t, i18n } = useTranslation()
  const locale = toLocale(i18n.resolvedLanguage ?? i18n.language)
  const formRef = useRef<HTMLFormElement>(null)
  const openedAtRef = useRef<number | null>(null)
  if (openedAtRef.current === null) {
    openedAtRef.current = typeof window === 'undefined' ? 0 : window.performance.now()
  }

  const [values, setValues] = useState<FormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [honeypot, setHoneypot] = useState('')

  useEffect(() => {
    const onPreselect = (event: Event) => {
      const value = (event as CustomEvent<string>).detail
      if (!SERVICES.some((service) => service.value === value)) return
      setValues((current) => ({ ...current, service: value }))
      setErrors((current) => ({ ...current, service: undefined }))
      setStatus((current) => (current === 'sent' || current === 'error' ? 'idle' : current))
    }
    window.addEventListener(SERVICE_SELECTION_EVENT, onPreselect)
    return () => window.removeEventListener(SERVICE_SELECTION_EVENT, onPreselect)
  }, [])

  const countryOptions = useMemo(
    () => [...COUNTRIES].sort((a, b) => a.names[locale].localeCompare(b.names[locale], locale)),
    [locale],
  )

  const steps = t('registration.next.steps', { returnObjects: true }) as unknown as string[]
  const genders = [
    { id: 'male', label: t('registration.form.genderMale') },
    { id: 'female', label: t('registration.form.genderFemale') },
    { id: 'other', label: t('registration.form.genderOther') },
  ]

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function validate(): Partial<Record<FieldName, string>> {
    const required = t('registration.validation.required')
    const invalidEmail = t('registration.validation.email')
    const next: Partial<Record<FieldName, string>> = {}

    if (!values.fullName.trim()) next.fullName = required
    if (!values.country) next.country = required
    if (!values.service) next.service = required
    if (!values.email.trim()) next.email = required
    else if (!EMAIL_PATTERN.test(values.email.trim())) next.email = invalidEmail

    return next
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status !== 'idle') return

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }

    setStatus('sending')
    const result = await sendLead({
      name: values.fullName.trim(),
      country: countryName(values.country, locale),
      service: serviceName(values.service, locale),
      email: values.email.trim(),
      gender: genders.find((gender) => gender.id === values.gender)?.label,
      message: values.message.trim() || undefined,
      source: 'registration',
      honeypot,
      elapsedMs: window.performance.now() - openedAtRef.current,
    })

    if (result.status === 'delivered') setStatus('sent')
    else if (result.reason === 'honeypot') setStatus('sent')
    else {
      console.error('[AEM] So‘rov yetkazilmadi:', result.reason)
      setStatus('error')
    }
  }

  function reset() {
    setValues(INITIAL_VALUES)
    setErrors({})
    setStatus('idle')
  }

  return (
    <section id="registration" className="bg-white" data-testid="registration">
      <Container className="flex flex-col gap-6 py-16 md:gap-8 md:py-4xl">
        <div className="flex flex-col gap-4 md:gap-8 xl:flex-row xl:items-start xl:gap-14">
          {/* --- Chap ustun: eyebrow · H2 · sub · what happens next · disclaimer --- */}
          <div className="flex flex-col gap-4 md:gap-5 xl:w-[470px] xl:shrink-0">
            <p className="font-mono text-[11px] tracking-[2px] text-stories uppercase md:text-xs">
              {t('registration.eyebrow')}
            </p>

            <h2 className="font-display text-[24px] font-bold text-balance text-hi-light md:text-[44px] md:leading-[1.05]">
              {t('registration.title')}
            </h2>

            <p className="text-[15px] leading-[1.5] text-mid-light md:text-base md:leading-[1.6]">
              {t('registration.sub')}
            </p>

            <div className="flex flex-col gap-3 md:pt-2.5">
              <p className="font-mono text-[10px] tracking-[1px] text-mid-dark uppercase md:text-[11px] md:tracking-[1.5px] md:text-mid-light">
                {t('registration.next.title')}
              </p>

              <ul className="flex flex-col gap-3">
                {steps.map((step, index) => (
                  <li key={step} className="flex items-center gap-2.5">
                    <span className="flex size-[22px] shrink-0 items-center justify-center rounded-pill bg-ink-900/8 md:size-6">
                      <span className="text-[11px] font-bold text-hi-light md:font-mono">
                        {index + 1}
                      </span>
                    </span>
                    <span className="text-[14.5px] leading-[1.4] text-hi-light md:text-base">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[13px] leading-[1.5] text-mid-light">
              {t('registration.disclaimer')}
            </p>
          </div>

          {/* --- O'ng: forma (yuborilgandan keyin — muvaffaqiyat holati) --- */}
          <div className="flex flex-col rounded-[24px] bg-white p-5 ring-1 ring-ink-900/12 ring-inset md:gap-5 md:p-10 md:shadow-bento xl:flex-1">
            {status === 'sent' || status === 'error' ? (
              status === 'error' ? (
                /* Yuborilmadi — qayta urinish + WhatsApp zaxira yo'li. */
                <div
                  className="flex flex-col items-center gap-4 py-6 text-center md:gap-5 md:py-10"
                  role="alert"
                >
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-pill bg-error/12 text-error">
                    <IconAlertTriangle />
                  </span>
                  <h3 className="font-display text-[22px] font-bold text-balance text-hi-light md:text-[28px] md:leading-[1.2]">
                    {t('registration.error.title')}
                  </h3>
                  <p className="max-w-[42ch] text-[15px] leading-[1.6] text-mid-light md:text-base">
                    {t('registration.error.text')}
                  </p>
                  <div className="mt-1 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
                    <Button onClick={() => setStatus('idle')} data-testid="registration-retry">
                      {t('registration.error.retry')}
                    </Button>
                    <ButtonLink
                      href={CONTACT.whatsapp}
                      variant="whatsapp"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('registration.error.whatsapp')}
                    </ButtonLink>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center gap-4 py-6 text-center md:gap-5 md:py-10"
                  role="status"
                >
                  <SuccessCheck />
                  <h3 className="font-display text-[22px] font-bold text-balance text-hi-light md:text-[28px] md:leading-[1.2]">
                    {t('registration.success.title')}
                  </h3>
                  <p className="max-w-[42ch] text-[15px] leading-[1.6] text-mid-light md:text-base">
                    {t('registration.success.text')}
                  </p>
                  <Button
                    onClick={reset}
                    className="mt-1 w-full md:w-auto"
                    data-testid="registration-again"
                  >
                    {t('registration.success.again')}
                  </Button>
                </div>
              )
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-4 md:gap-5"
              >
                {/* ① Full name · Country */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <Input
                    id="registration-name"
                    name="name"
                    label={t('registration.form.fullName')}
                    required
                    autoComplete="name"
                    placeholder={t('registration.form.fullNamePlaceholder')}
                    value={values.fullName}
                    error={errors.fullName}
                    onChange={(event) => update('fullName', event.target.value)}
                  />

                  <Select
                    id="registration-country"
                    name="country"
                    label={t('registration.form.country')}
                    required
                    value={values.country}
                    error={errors.country}
                    onChange={(event) => update('country', event.target.value)}
                    className={values.country ? undefined : 'text-mid-light'}
                  >
                    <option value="">{t('registration.form.countryPlaceholder')}</option>
                    {countryOptions.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.names[locale]}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* ② Choose service · Email address */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <Select
                    id="registration-service"
                    name="service"
                    label={t('registration.form.service')}
                    required
                    value={values.service}
                    error={errors.service}
                    onChange={(event) => update('service', event.target.value)}
                    className={values.service ? undefined : 'text-mid-light'}
                  >
                    <option value="">{t('registration.form.servicePlaceholder')}</option>
                    {SERVICE_GROUPS.map((group) => (
                      <optgroup
                        key={group}
                        label={t(`registration.form.serviceGroups.${group}`)}
                      >
                        {SERVICES.filter((service) => service.group === group).map((service) => (
                          <option key={service.value} value={service.value}>
                            {service.names[locale]}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </Select>

                  <Input
                    id="registration-email"
                    name="email"
                    type="email"
                    label={t('registration.form.email')}
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder={t('registration.form.emailPlaceholder')}
                    value={values.email}
                    error={errors.email}
                    onChange={(event) => update('email', event.target.value)}
                  />
                </div>

                {/* ③ Gender — segmented (design.pen `r5rmL`) */}
                <fieldset className="min-w-0">
                  <legend className="mb-1.5 text-[13px] leading-none font-semibold text-hi-light md:mb-2">
                    {t('registration.form.gender')}
                  </legend>
                  <SegmentedField
                    label={t('registration.form.gender')}
                    options={genders}
                    value={values.gender}
                    onChange={(id) => update('gender', id)}
                  />
                </fieldset>

                {/* ④ Message */}
                <Textarea
                  id="registration-message"
                  name="message"
                  label={t('registration.form.message')}
                  placeholder={t('registration.form.messagePlaceholder')}
                  value={values.message}
                  onChange={(event) => update('message', event.target.value)}
                />

                {/* ⑤ Submit + note */}
                <div className="flex flex-col items-center gap-3 pt-1 md:flex-row md:justify-between md:pt-1">
                  <Button
                    type="submit"
                    loading={status === 'sending'}
                    arrow
                    className="w-full md:w-[246px]"
                    data-testid="registration-submit"
                  >
                    {t('registration.form.submit')}
                  </Button>

                  <p className="text-center text-[13px] leading-[1.3] text-mid-light md:shrink-0 md:text-left">
                    {t('registration.form.note')}
                  </p>
                </div>

                {/* F9.4 — honeypot: bot `name` bo'yicha to'ldiradi, inson ko'rmaydi. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[9999px] size-px opacity-0"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
