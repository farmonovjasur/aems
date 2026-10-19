import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type ContainerProps = {
  children: ReactNode
  className?: string
}

/**
 * F1 — sahifa konteyneri. design.pen 1440 ramkasida kontent 1280px (section padding 80px):
 * shuning uchun box = content (--container-page 1280) + 2 × gutter (24px md+).
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[calc(var(--container-page)+var(--spacing-gutter)*2)] px-gutter',
        className,
      )}
    >
      {children}
    </div>
  )
}
