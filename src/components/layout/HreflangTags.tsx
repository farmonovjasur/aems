import { useEffect } from 'react'
import { DEFAULT_LOCALE, LANGUAGES } from '../../i18n/languages'
import { LOCALE_ROUTES } from '../../app/routes'

/* F2.6 — 5 til + x-default uchun <link rel="alternate"> teglari. */
export function HreflangTags() {
  useEffect(() => {
    const env = import.meta.env as Record<string, string | undefined>
    const siteUrl = env.VITE_SITE_URL ?? window.location.origin
    const head = document.head
    const created: HTMLLinkElement[] = []

    const add = (hreflang: string, path: string) => {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = hreflang
      link.href = new URL(path, siteUrl).toString()
      head.appendChild(link)
      created.push(link)
    }

    for (const locale of LANGUAGES) add(locale, LOCALE_ROUTES[locale])
    add('x-default', LOCALE_ROUTES[DEFAULT_LOCALE])

    return () => {
      for (const link of created) link.remove()
    }
  }, [])

  return null
}
