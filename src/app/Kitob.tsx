import { useState, type ReactNode } from 'react'
import { Accordion, AccordionItem } from '../components/ui/Accordion'
import { AuroraBackground } from '../components/ui/AuroraBackground'
import { Button, ButtonLink } from '../components/ui/Button'
import { BentoCard, GlassCard, StatCard } from '../components/ui/Card'
import { Chip, ChipButton } from '../components/ui/Chip'
import { Container } from '../components/ui/Container'
import { Input, Textarea } from '../components/ui/Input'
import { RadioGroup } from '../components/ui/Radio'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Select } from '../components/ui/Select'
import { Tabs } from '../components/ui/Tabs'
import { tabButtonId, tabPanelId } from '../components/ui/tab-ids'
import { CountUp } from '../components/motion/CountUp'
import { CustomCursor } from '../components/motion/CustomCursor'
import { ImageReveal } from '../components/motion/ImageReveal'
import { MagneticButton } from '../components/motion/MagneticButton'
import { Marquee } from '../components/motion/Marquee'
import { Reveal } from '../components/motion/Reveal'
import { ScrollProgress } from '../components/motion/ScrollProgress'
import { cn } from '../lib/cn'

/*
 * F3.9 — /kitob: dev-only komponent sahifasi (F3 primitivlari + F4 motion).
 * Production build'da App.tsx dagi import.meta.env.DEV sharti bilan tree-shake bo'ladi.
 * `?reduce` bilan ochilsa — barcha motion 150ms fade rejimida.
 */

function Demo({
  title,
  note,
  children,
  className,
}: {
  title: string
  note?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('border-t border-white/10 py-2xl', className)}>
      <h2 className="font-mono text-xs tracking-[1.5px] text-care-glow uppercase">{title}</h2>
      {note ? <p className="mt-sm text-sm text-mid-dark">{note}</p> : null}
      <div className="mt-lg">{children}</div>
    </section>
  )
}

export function Kitob() {
  const [tab, setTab] = useState('targeted')
  const [selectedChip, setSelectedChip] = useState(true)
  const [gender, setGender] = useState('female')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('Ali Valiyev')

  return (
    <div className="min-h-dvh bg-ink-950 pb-5xl text-hi-dark">
      <Container>
        <header className="py-3xl">
          <p className="font-mono text-xs tracking-[1.5px] text-gold-500 uppercase">DEV · /kitob</p>
          <h1 className="mt-md font-display text-4xl font-extrabold tracking-tight">
            UI primitivlari <em className="font-accent font-normal italic">kitob</em>
          </h1>
        </header>

        <Demo title="F3.1 · BUTTON — variant × state">
          <div className="flex flex-wrap items-center gap-md">
            <Button>Free Consultation</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="whatsapp">Talk to us on WhatsApp</Button>
          </div>
          <div className="mt-lg flex flex-wrap items-center gap-md">
            <Button size="sm" arrow>
              Explore MBBS
            </Button>
            <Button variant="secondary" size="sm">
              Secondary small
            </Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading…</Button>
            <ButtonLink variant="whatsapp" href="https://wa.me/998936566889" arrow>
              WhatsApp link (anchor)
            </ButtonLink>
          </div>
          <p className="mt-sm text-sm text-mid-dark">
            hover / pressed / focus — jonli holatda; focus uchun Tab bosing.
          </p>
        </Demo>

        <Demo title="F3.2 · CHIP — tone × selected">
          <div className="flex flex-wrap items-center gap-md">
            <Chip tone="mint">WHO · NMC</Chip>
            <Chip tone="violet">Cytotron</Chip>
            <Chip tone="gold">JULY INTAKE</Chip>
            <Chip tone="neutral">Neutral</Chip>
          </div>
          <div className="mt-lg flex flex-wrap items-center gap-md">
            <ChipButton
              tone="mint"
              selected={selectedChip}
              onClick={() => setSelectedChip((v) => !v)}
            >
              Interactive (selected: {String(selectedChip)})
            </ChipButton>
            <ChipButton tone="violet">Interactive default</ChipButton>
          </div>
        </Demo>

        <Demo title="F3.3 · CARDS — Glass · Stat · Bento">
          <div className="grid gap-lg md:grid-cols-3">
            <GlassCard title="Case review">
              Licensed physicians review your file in India.
            </GlassCard>
            <StatCard value="$2,900" label="TUITION PER YEAR" />
            <BentoCard title="Cytotron" tone="violet">
              An advanced care option reviewed case by case.
            </BentoCard>
          </div>
        </Demo>

        <Demo title="F3.4 · FIELDS — Input · Select · Radio · Textarea">
          <div className="rounded-lg bg-white p-xl">
            <div className="grid gap-xl md:grid-cols-2">
              <Input
                label="Full name"
                required
                placeholder="Your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <Input
                label="Email address"
                required
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={email.length > 0 && !email.includes('@') ? 'Enter a valid email' : undefined}
              />
              <Input label="Country" hint="ISO list — F9 da" placeholder="Select your country" />
              <Input label="Success state" defaultValue="5500 USD" success="Looks good" />
              <Input label="Disabled" placeholder="—" disabled />
              <Select label="Choose service" required defaultValue="">
                <option value="" disabled>
                  Select a service
                </option>
                <option value="mbbs">MBBS admission</option>
                <option value="cancer">Cancer treatment</option>
                <option value="affiliate">Affiliate marketing</option>
              </Select>
              <RadioGroup
                label="Gender"
                name="kitob-gender"
                value={gender}
                onValueChange={setGender}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
              />
              <div className="md:col-span-2">
                <Textarea label="Message" placeholder="Write text" />
              </div>
            </div>
          </div>
        </Demo>

        <Demo title="F3.5 · ACCORDION">
          <div className="max-w-2xl">
            <Accordion>
              <AccordionItem title="Research and preparation" defaultOpen>
                Compare programmes and eligibility; collect academic documents.
              </AccordionItem>
              <AccordionItem title="Submitting the application">
                We assemble and file your application package.
              </AccordionItem>
              <AccordionItem title="Admission decision">
                Admitted / Waitlisted / Conditionally admitted / Denied.
              </AccordionItem>
            </Accordion>
          </div>
        </Demo>

        <Demo title="F3.6 · TABS — klaviatura: ← → Home End">
          <Tabs
            idBase="kitob"
            label="Kitob demo tabs"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'targeted', label: 'Targeted therapy' },
              { id: 'cytotron', label: 'Cytotron' },
              { id: 'radiation', label: 'Radiation therapy' },
            ]}
          />
          <div
            role="tabpanel"
            id={tabPanelId('kitob', tab)}
            aria-labelledby={tabButtonId('kitob', tab)}
            className="mt-lg rounded-lg bg-white/[0.06] p-lg text-sm text-mid-dark"
          >
            Panel: <span className="font-mono text-hi-dark uppercase">{tab}</span>
          </div>
        </Demo>

        <Demo title="F3.7 · SECTION HEADING">
          <div className="grid gap-2xl">
            <SectionHeading
              eyebrow="ABOUT AEM"
              eyebrowClassName="text-edu-500"
              line1="Two frontiers,"
              accent="one"
              line2="team behind them."
              as="h2"
            />
            <div className="rounded-lg bg-paper-50 p-lg">
              <SectionHeading
                eyebrow="STORIES"
                eyebrowClassName="text-stories"
                line1="Students and families"
                accent="we've"
                line2="guided"
                as="h3"
                tone="light"
              />
            </div>
          </div>
        </Demo>

        <Demo title="F3.8 · AURORA (hero variant)">
          <div className="relative overflow-hidden rounded-lg bg-ink-950 ring-1 ring-white/10">
            <AuroraBackground />
            <div className="relative px-lg py-4xl">
              <p className="font-mono text-xs tracking-[1.5px] text-mid-dark uppercase">
                3 layer: brand · care · edu
              </p>
            </div>
          </div>
        </Demo>

        <Demo
          title="F4 · MOTION — Reveal · ImageReveal · Magnetic · CountUp"
          note="Sahifani pastga scroll qiling — hammasi view'da ishga tushadi."
        >
          <div className="grid gap-2xl">
            <Reveal
              as="h3"
              className="font-display text-3xl font-bold tracking-tight text-balance md:text-[40px]"
              text="Two frontiers. One trusted partner for every family."
            />
            <div className="grid items-center gap-2xl md:grid-cols-[256px_1fr]">
              <ImageReveal
                src="/img/doctor-256.webp"
                srcSet="/img/doctor-128.webp 128w, /img/doctor-256.webp 256w"
                sizes="256px"
                width={256}
                height={256}
                alt="Doctor portrait"
                wrapperClassName="w-64 rounded-lg"
                className="rounded-lg"
              />
              <div className="flex flex-wrap items-center gap-3xl">
                <MagneticButton>
                  <Button data-cursor arrow>
                    Magnetic CTA
                  </Button>
                </MagneticButton>
                <CountUp
                  to={2900}
                  prefix="$"
                  className="font-display text-[32px] leading-none font-bold"
                />
                <CountUp
                  to={6}
                  suffix=" years"
                  className="font-display text-[32px] leading-none font-bold"
                />
              </div>
            </div>
            <Marquee className="rounded-lg bg-ink-900 py-lg">
              <Chip tone="mint">WHO</Chip>
              <Chip tone="violet">NMC</Chip>
              <Chip tone="gold">FAIMER</Chip>
              <Chip>Bukhara, Uzbekistan</Chip>
              <Chip tone="mint">Cytotron India</Chip>
              <Chip tone="violet">Est. 2026</Chip>
              <Chip tone="gold">Students from 6 countries</Chip>
              <Chip>Licensed physicians</Chip>
            </Marquee>
          </div>
        </Demo>

        <Demo
          title="F4 · CURSOR + SCROLL PROGRESS"
          note="pointer:fine bo'lsa — halqa+nuqta; scroll bar tepada (2px gradient)."
          className="pb-5xl"
        >
          <p
            data-cursor
            data-cursor-label="Drag"
            className="inline-flex rounded-lg bg-white/[0.06] px-lg py-md text-sm text-mid-dark"
          >
            [data-cursor-label=&quot;Drag&quot;] — kursorni bu blok ustiga olib keling
          </p>
        </Demo>
      </Container>
      <ScrollProgress />
      <CustomCursor />
    </div>
  )
}
