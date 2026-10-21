import type { MouseEvent as ReactMouseEvent } from 'react'

/*
 * Medical services kartasidan Registration formasiga xizmatni oldindan
 * tanlash uchun yagona event. Bu yondashuv komponentlarni bir-biriga
 * bog'lamasdan, anchor navigatsiyasini ham saqlab qoladi.
 */

export const SERVICE_SELECTION_EVENT = 'aem:preselect-service'

export function selectServiceForRegistration(value: string) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<string>(SERVICE_SELECTION_EVENT, { detail: value }))
}

export function isPlainLeftClick(event: ReactMouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}
