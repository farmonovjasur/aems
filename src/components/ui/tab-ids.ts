/*
 * F3.6 — Tabs ARIA id yordamchilari (Tabs.tsx fast-refresh talabiga ko'ra alohida modul).
 * Panel'ni render qiluvchi ota-komponent shu id'larni ishlatadi:
 *   <div role="tabpanel" id={tabPanelId(base, id)} aria-labelledby={tabButtonId(base, id)}>
 */

export function tabButtonId(idBase: string, id: string) {
  return `${idBase}-tab-${id}`
}

export function tabPanelId(idBase: string, id: string) {
  return `${idBase}-panel-${id}`
}
