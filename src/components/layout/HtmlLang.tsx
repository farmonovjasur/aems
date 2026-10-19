import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/* F2.6 — <html lang> ni joriy locale bilan sinxronlaydi. */
export function HtmlLang() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? 'en'
  }, [i18n.resolvedLanguage])

  return null
}
