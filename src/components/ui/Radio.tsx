import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { FieldLabel, FieldMessage } from './Input'

/*
 * F3.4 — Radio (§2): radio guruh (masalan, Gender: Male/Female/Other).
 * Custom dot: tashqi ring + peer-checked'da qalin border (donut effekt).
 */

export type RadioOption = {
  value: string
  label: ReactNode
}

export type RadioGroupProps = Omit<ComponentProps<'fieldset'>, 'onChange'> & {
  label: ReactNode
  required?: boolean
  name: string
  options: RadioOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  error?: string
  success?: string
  hint?: string
}

export function RadioGroup({
  label,
  required,
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  error,
  success,
  hint,
  className,
  ...rest
}: RadioGroupProps) {
  const autoId = useId()
  const messageId = `${autoId}-message`

  return (
    <fieldset className={cn('min-w-0', className)} {...rest}>
      <legend className="contents">
        <FieldLabel required={required}>{label}</FieldLabel>
      </legend>
      <div className="mt-sm flex flex-wrap gap-lg">
        {options.map((option) => (
          <label
            key={option.value}
            className="inline-flex cursor-pointer items-center gap-sm text-[15px] text-hi-light select-none"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value !== undefined ? value === option.value : undefined}
              defaultChecked={value === undefined ? defaultValue === option.value : undefined}
              onChange={onValueChange ? () => onValueChange(option.value) : undefined}
              required={required}
              aria-describedby={error || success || hint ? messageId : undefined}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                'size-5 shrink-0 rounded-full border border-hi-light/25 bg-white',
                'transition-all ease-out-soft duration-(--duration-fast)',
                'peer-checked:border-[6px] peer-checked:border-brand-500',
                'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500',
                'peer-disabled:opacity-50',
              )}
            />
            {option.label}
          </label>
        ))}
      </div>
      <FieldMessage id={messageId} state={error ? 'error' : success ? 'success' : 'hint'}>
        {error ?? success ?? hint}
      </FieldMessage>
    </fieldset>
  )
}
