import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'lg'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined
    href?: undefined
  }

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    to: string
    href?: undefined
  }

type ButtonAsExternal = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    to?: undefined
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsExternal

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white shadow-soft hover:bg-primary-700 focus-visible:outline-primary-600',
  secondary:
    'bg-white text-primary-700 ring-1 ring-primary-200 hover:bg-primary-50 focus-visible:outline-primary-600',
  ghost:
    'bg-transparent text-primary-700 hover:bg-primary-50 focus-visible:outline-primary-600',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

/**
 * Single button component covering internal links, external links and
 * plain buttons with a consistent, accessible style system.
 */
export default function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...rest
  } = props

  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )

  if (props.to !== undefined) {
    return (
      <Link to={props.to} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    )
  }

  if (props.href !== undefined) {
    return (
      <a href={props.href} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
