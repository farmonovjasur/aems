import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/*
 * F3.7 — SectionHeading (§1.2): eyebrow (mono, accent rang) +
 * 2 satr display + 1 satr serif aksent ("Two frontiers. One trusted partner.").
 */

export type SectionHeadingProps = {
  eyebrow?: ReactNode
  /** Eyebrow rangi — section accent'i (masalan, 'text-care-500') */
  eyebrowClassName?: string
  line1?: ReactNode
  /** Serif aksent so'z */
  accent?: ReactNode
  line2?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  tone?: 'dark' | 'light'
  align?: 'left' | 'center'
  id?: string
  className?: string
}

const SIZES = {
  h1: 'text-5xl md:text-[82px]',
  h2: 'text-4xl md:text-[52px]',
  h3: 'text-3xl md:text-[40px]',
} as const

export function SectionHeading({
  eyebrow,
  eyebrowClassName,
  line1,
  accent,
  line2,
  as: Tag = 'h2',
  tone = 'dark',
  align = 'left',
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow ? (
        <p
          className={cn(
            'font-mono text-xs tracking-[1.5px] text-mid-light uppercase',
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Tag
        id={id}
        className={cn(
          'font-display leading-[1.05] font-extrabold tracking-tight text-balance',
          SIZES[Tag],
          tone === 'dark' ? 'text-hi-dark' : 'text-hi-light',
          eyebrow && 'mt-md',
        )}
      >
        {line1 ? <>{line1} </> : null}
        {accent ? <em className="font-accent font-normal italic">{accent}</em> : null}
        {line2 ? <> {line2}</> : null}
      </Tag>
    </div>
  )
}
