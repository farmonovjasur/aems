import { createContext, useContext } from 'react'

/*
 * F4.1 — SafeMotion (§9.6): SSR'da ham, ilk klient render'ida ham bir xil boshlang'ich
 * qiymat — { ready: false, reduced: false, pointerFine: false }. Haqiqiy qiymatlar
 * SafeMotionProvider ichida faqat useEffect'da aniqlanadi (gidratatsiya mosligi).
 */

export type SafeMotion = {
  /** Klientda mount bo'lganmi — animatsiyalarni faqat ready'dan keyin ishga tushir */
  ready: boolean
  reduced: boolean
  pointerFine: boolean
}

const DEFAULT_SAFE_MOTION: SafeMotion = { ready: false, reduced: false, pointerFine: false }

export const SafeMotionContext = createContext<SafeMotion>(DEFAULT_SAFE_MOTION)

export function useSafeMotion(): SafeMotion {
  return useContext(SafeMotionContext)
}
