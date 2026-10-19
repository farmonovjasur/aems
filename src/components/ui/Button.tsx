import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { buttonStyles, type ButtonSize, type ButtonVariant } from './button-styles'
import { IconArrow, IconWhatsApp } from './icons'

/*
 * F3.1 — Button (§2): Primary / Secondary / Ghost / WhatsApp.
 * State'lar: default / hover / pressed / focus (global :focus-visible) / loading / disabled.
 * Secondary va Ghost dark surface uchun (hero/nav/footer); Primary/WhatsApp hamma joyda.
 */

export type { ButtonSize, ButtonVariant } from './button-styles'

type ButtonBaseProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  arrow?: boolean
  icon?: ReactNode
  /** Label'dan keyingi custom ikon (dizayn: message-circle va h.k.) */
  trailingIcon?: ReactNode
  className?: string
  children: ReactNode
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4 animate-spin"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" opacity="0.3" />
      <path d="M14 8a6 6 0 0 0-6-6" />
    </svg>
  )
}

function ButtonContent({
  variant,
  loading,
  arrow,
  icon,
  trailingIcon,
  children,
}: ButtonBaseProps & { loading: boolean }) {
  const leading = loading ? (
    <Spinner />
  ) : (
    (icon ?? (variant === 'whatsapp' ? <IconWhatsApp /> : null))
  )
  return (
    <>
      {leading}
      <span className="leading-[1.3]">{children}</span>
      {arrow ? (
        <IconArrow className="shrink-0 transition-transform ease-out-soft duration-(--duration-fast) group-hover/btn:translate-x-0.5" />
      ) : (
        trailingIcon
      )}
    </>
  )
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonBaseProps & {
    loading?: boolean
  }

export function Button({
  variant = 'primary',
  size = 'md',
  arrow,
  icon,
  trailingIcon,
  loading = false,
  disabled,
  className,
  children,
  type,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, loading, className })}
      {...rest}
    >
      <ButtonContent variant={variant} loading={loading} arrow={arrow} icon={icon} trailingIcon={trailingIcon}>
        {children}
      </ButtonContent>
    </button>
  )
}

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & ButtonBaseProps

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  arrow,
  icon,
  trailingIcon,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a className={buttonStyles({ variant, size, className })} {...rest}>
      <ButtonContent
        variant={variant}
        loading={false}
        arrow={arrow}
        icon={icon}
        trailingIcon={trailingIcon}
      >
        {children}
      </ButtonContent>
    </a>
  )
}
