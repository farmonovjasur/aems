import { useEffect, useState } from 'react'

/*
 * F4.1 — (pointer: fine) gate (§6.2 #3): cursor/magnetic faqat sichqonchali qurilmada.
 * SSR/ilk render: false (§9.6 — matchMedia faqat useEffect ichida).
 */
export function usePointerFine(): boolean {
  const [pointerFine, setPointerFine] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine)')
    const update = () => setPointerFine(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return pointerFine
}
