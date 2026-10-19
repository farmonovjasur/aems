import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { FIELD_HEIGHT, TEXTAREA_HEIGHT, fieldClasses } from './field-styles'

/*
 * F3.4 — Input / Textarea (§2): label Geist 13/600 + required `*` (`brand-500`) + field.
 * State'lar: default / hover / focus (ring 2px + glow 8px) / error / success / disabled.
 * Light surface uchun (Registration — #FFFFFF desktop · #F4F6FB mobil).
 * Select.tsx va Radio.tsx shu fayldagi yordamchilarni import qiladi.
 */

export function FieldLabel({
  htmlFor,
  required,
  className,
  children,
}: {
  htmlFor?: string
  required?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'flex items-center gap-[3px] text-[13px] leading-none font-semibold text-hi-light',
        className,
      )}
    >
      <span>{children}</span>
      {required ? (
        <span className="text-brand-500" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  )
}

export function FieldMessage({
  id,
  state,
  children,
}: {
  id?: string
  state: 'error' | 'success' | 'hint'
  children?: ReactNode
}) {
  if (!children) return null
  return (
    <p
      id={id}
      className={cn(
        'mt-sm text-[12px] leading-[1.4]',
        state === 'error' && 'text-error',
        state === 'success' && 'text-success',
        state === 'hint' && 'text-mid-light',
      )}
    >
      {children}
    </p>
  )
}

type FieldExtras = {
  label: ReactNode
  required?: boolean
  error?: string
  success?: string
  hint?: string
}

export type InputProps = ComponentProps<'input'> & FieldExtras

export function Input({
  label,
  required,
  error,
  success,
  hint,
  id: idProp,
  className,
  ...rest
}: InputProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const messageId = `${id}-message`
  const state = error ? 'error' : success ? 'success' : 'default'

  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <input
        id={id}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error || success || hint ? messageId : undefined}
        className={fieldClasses(state, cn(FIELD_HEIGHT, 'mt-1.5 block md:mt-2', className))}
        {...rest}
      />
      <FieldMessage id={messageId} state={error ? 'error' : success ? 'success' : 'hint'}>
        {error ?? success ?? hint}
      </FieldMessage>
    </div>
  )
}

export type TextareaProps = ComponentProps<'textarea'> & FieldExtras

export function Textarea({
  label,
  required,
  error,
  success,
  hint,
  id: idProp,
  className,
  rows = 4,
  ...rest
}: TextareaProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const messageId = `${id}-message`
  const state = error ? 'error' : success ? 'success' : 'default'

  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        required={required}
        rows={rows}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error || success || hint ? messageId : undefined}
        className={fieldClasses(
          state,
          cn(TEXTAREA_HEIGHT, 'mt-1.5 block resize-none py-3.5 md:mt-2', className),
        )}
        {...rest}
      />
      <FieldMessage id={messageId} state={error ? 'error' : success ? 'success' : 'hint'}>
        {error ?? success ?? hint}
      </FieldMessage>
    </div>
  )
}
