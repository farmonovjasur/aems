import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { SafeMotionProvider } from '../components/motion/SafeMotionProvider'
import { i18n } from '../i18n'

/*
 * F2.2: I18nextProvider · F4.1: SafeMotionProvider shu yerda ulanadi.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <SafeMotionProvider>{children}</SafeMotionProvider>
    </I18nextProvider>
  )
}
