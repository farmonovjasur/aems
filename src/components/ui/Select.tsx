import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { FIELD_HEIGHT, fieldClasses } from './field-styles'
import { FieldLabel, FieldMessage } from './Input'
import { IconChevron } from './icons'

/*
 * F3.4 — Select (§2): native select + custom chevron (design.pen `MsxxO`: 16px,
 * o'ngdan 16px, vertikal markazda).
 */

export type SelectProps = ComponentProps<'select'> & {
  label: ReactNode
  required?: boolean
  error?: string
  success?: string
  hint?: string
}

export function Select({
  label,
  required,
  error,
  success,
  hint,
  id: idProp,
  className,
  children,
  ...rest
}: SelectProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const messageId = `${id}-message`
  const state = error ? 'error' : success ? 'success' : 'default'

  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div className="relative mt-1.5 md:mt-2">
        <select
          id={id}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error || success || hint ? messageId : undefined}
          className={fieldClasses(state, cn(FIELD_HEIGHT, 'appearance-none pe-3xl', className))}
          {...rest}
        >
          {children}
        </select>
        <IconChevron className="pointer-events-none absolute top-1/2 end-md size-4 -translate-y-1/2 text-mid-light" />
      </div>
      <FieldMessage id={messageId} state={error ? 'error' : success ? 'success' : 'hint'}>
        {error ?? success ?? hint}
      </FieldMessage>
    </div>
  )
}
