import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { applyLocaleToDocument } from '../../i18n/document'
import { toLocale } from '../../lib/countries'

/* F2.6 — <html lang/dir> va sahifa meta'sini joriy locale bilan sinxronlaydi. */
export function HtmlLang() {
  const { i18n } = useTranslation()

  useEffect(() => {
    applyLocaleToDocument(toLocale(i18n.resolvedLanguage ?? i18n.language))
  }, [i18n.resolvedLanguage, i18n.language])

  return null
}
