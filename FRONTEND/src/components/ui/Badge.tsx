import { ReactNode } from 'react'
import clsx from 'clsx'

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info'
  children: ReactNode
  className?: string
}

const Badge = ({ variant = 'info', children, className }: BadgeProps) => {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  }

  return (
    <span className={clsx('badge', variantClasses[variant], className)}>
      {children}
    </span>
  )
}

export default Badge
