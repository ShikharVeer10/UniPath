import { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'glass'
  children: ReactNode
}

const Card = ({ className, variant = 'default', children, ...props }: CardProps) => {
  const variantClasses = {
    default: 'card',
    hover: 'card card-hover',
    glass: 'card-glass',
  }

  return (
    <div className={clsx(variantClasses[variant], className)} {...props}>
      {children}
    </div>
  )
}

export default Card
