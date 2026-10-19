import { useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/*
 * F4.1 — GSAP bazasi + motion tokenlar (§6).
 * ScrollTrigger / CustomEase faqat klientda register qilinadi (§9.6 — module scope'da
 * window'ga tegmaymiz, faqat typeof guard bilan).
 */

export const EASE_SOFT = 'out-soft'
export const EASE_SOFT_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)'

export const DUR = {
  fast: 0.18,
  base: 0.4,
  slow: 0.85,
} as const

export const STAGGER = 0.06

let registered = false

export function ensureGsap() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger, CustomEase)
  CustomEase.create(EASE_SOFT, '0.22,1,0.36,1')
  ;(window as unknown as Record<string, unknown>).__gsap = gsap
  registered = true
}

/** SSR-xavfsiz layout effect (prerender'da useEffect). */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
