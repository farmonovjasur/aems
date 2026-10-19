import type { ElementType, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type SectionProps = {
  id?: string
  as?: ElementType
  className?: string
  children: ReactNode
}

export function Section({ id, as: Tag = 'section', className, children }: SectionProps) {
  return (
    <Tag id={id} className={cn('py-section-mob md:py-section-desk', className)}>
      {children}
    </Tag>
  )
}
