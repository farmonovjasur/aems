import { useEffect, useState } from 'react'

/*
 * F4.1 — prefers-reduced-motion (§6.2 #2) + `?reduce` test override.
 * SSR/ilk render: false (§9.6 — matchMedia faqat useEffect ichida).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const forced = new URLSearchParams(window.location.search).has('reduce')

    const update = () => setReduced(forced || query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}
