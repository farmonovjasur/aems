import type { MouseEvent } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ensureGsap, prefersReducedMotion } from './motion'

/*
 * F5.4 — silliq anchor scroll + nav offset (CSS scroll-margin-top, index.css)
 * + ScrollTrigger.refresh() (menyu yopilgach layout o'zgarishi uchun).
 * F6 section'lari hali yo'q anchor'lar jimgina o'tkazib yuboriladi.
 */
const ANCHOR_ALIASES: Record<string, string[]> = {
  medical: ['medical', 'medical-services', 'services', 'health'],
  'medical-services': ['medical-services', 'medical', 'services', 'health'],
  services: ['services', 'medical-services', 'medical', 'health'],
  health: ['health', 'medical-services', 'medical', 'services'],
  cancer: ['cancer', 'cancer-treatment', 'targeted'],
  'cancer-treatment': ['cancer-treatment', 'cancer', 'targeted'],
  targeted: ['targeted', 'cancer-treatment', 'cancer'],
  cytotron: ['cytotron', 'cancer-treatment', 'cancer'],
  radiation: ['radiation', 'radiation-therapy', 'cancer-treatment', 'cancer'],
  'radiation-therapy': ['radiation-therapy', 'radiation', 'cancer-treatment', 'cancer'],
  affiliate: ['affiliate', 'affiliate-marketing'],
  'affiliate-marketing': ['affiliate-marketing', 'affiliate'],
  admission: ['admission', 'student-admission'],
  'student-admission': ['student-admission', 'admission'],
  'study-mbbs': ['study-mbbs', 'university'],
  university: ['university', 'study-mbbs'],
  registration: ['registration'],
  contacts: ['contacts', 'contact'],
  about: ['about', 'about-us'],
}

export function scrollToAnchor(hash: string) {
  if (typeof window === 'undefined') return
  const id = hash.replace(/^#/, '')
  const candidates = [id, ...(ANCHOR_ALIASES[id] ?? [])]
  let target: HTMLElement | null = null
  for (const candidate of candidates) {
    target = document.getElementById(candidate)
    if (target) break
  }
  if (!target) return

  /* Refresh BEFORE scrolling: ScrollTrigger.refresh() interrupts an in-flight
   * native smooth scroll, which left #registration (and other far anchors)
   * stopping short of the target. Measuring first keeps triggers accurate
   * without cancelling the scroll animation. */
  ensureGsap()
  ScrollTrigger.refresh()

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
}

/** <a href="#..."> uchun: default jump'ni silliq scroll'ga almashtiradi (modifier-click'lar tegilmaydi). */
export function onAnchorClick(event: MouseEvent<HTMLAnchorElement>, hash: string) {
  if (event.defaultPrevented || event.button !== 0) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  scrollToAnchor(hash)
}
