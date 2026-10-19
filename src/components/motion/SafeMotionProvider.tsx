import { useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { SafeMotionContext, type SafeMotion } from '../../hooks/useSafeMotion'
import { usePointerFine } from '../../hooks/usePointerFine'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/*
 * F4.1 — SafeMotionProvider (providers.tsx da ulanadi).
 * SSR: { ready:false, reduced:false, pointerFine:false } — klientda mount'da haqiqiy qiymat.
 * `ready` — useSyncExternalStore orqali (effect'siz, gidratatsiya-mos "client mounted" pattern).
 */

const emptySubscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function SafeMotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const pointerFine = usePointerFine()
  const ready = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot)

  const value = useMemo<SafeMotion>(
    () => ({ ready, reduced, pointerFine }),
    [ready, reduced, pointerFine],
  )

  return <SafeMotionContext.Provider value={value}>{children}</SafeMotionContext.Provider>
}
