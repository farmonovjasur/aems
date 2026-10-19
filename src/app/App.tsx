import { useTranslation } from 'react-i18next'
import { Footer } from '../components/layout/Footer'
import { HreflangTags } from '../components/layout/HreflangTags'
import { HtmlLang } from '../components/layout/HtmlLang'
import { Nav } from '../components/layout/Nav'
import { StickyCTA } from '../components/layout/StickyCTA'
import { WhatsAppFAB } from '../components/layout/WhatsAppFAB'
import { CustomCursor } from '../components/motion/CustomCursor'
import { ScrollProgress } from '../components/motion/ScrollProgress'
import { Hero } from '../components/sections/Hero'
import { About } from '../components/sections/About'
import { AdmissionExplained } from '../components/sections/AdmissionExplained'
import { AffiliateMarketing } from '../components/sections/AffiliateMarketing'
import { CancerTreatment } from '../components/sections/CancerTreatment'
import { Contact } from '../components/sections/Contact'
import { Cytotron } from '../components/sections/Cytotron'
import { HowItWorks } from '../components/sections/HowItWorks'
import { RadiationTherapy } from '../components/sections/RadiationTherapy'
import { Registration } from '../components/sections/Registration'
import { StudyMBBS } from '../components/sections/StudyMBBS'
import { Testimonials } from '../components/sections/Testimonials'
import { TrustMarquee } from '../components/sections/TrustMarquee'
import { Kitob } from './Kitob'

/*
 * F5 — layout qobig'i: Nav + main + Footer + StickyCTA + WhatsAppFAB + progress + cursor.
 * F6 (14 section) shu main ichini to'ldiradi. /kitob — dev-only primitivlar sahifasi.
 */
export function App() {
  const { t } = useTranslation()

  if (
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    window.location.pathname === '/kitob'
  ) {
    return <Kitob />
  }

  return (
    <div className="relative min-h-dvh bg-ink-950 font-body text-hi-dark">
      <HtmlLang />
      <HreflangTags />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-lg focus:top-lg focus:z-50 focus:rounded-sm focus:bg-brand-600 focus:px-lg focus:py-sm focus:text-hi-dark"
      >
        {t('common.skipToContent')}
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <TrustMarquee />
        <About />
        <CancerTreatment />
        <Cytotron />
        <RadiationTherapy />
        <AffiliateMarketing />
        <AdmissionExplained />
        <HowItWorks />
        <StudyMBBS />
        <Testimonials />
        <Registration />
        <Contact />
      </main>
      <Footer />
      <StickyCTA />
      <WhatsAppFAB />
      <ScrollProgress />
      <CustomCursor />
    </div>
  )
}
