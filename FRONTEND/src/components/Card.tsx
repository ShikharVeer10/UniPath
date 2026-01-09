import { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'glass'
  className?: string
  header?: ReactNode
  footer?: ReactNode
  hoverable?: boolean
}

const Card = ({ 
  children, 
  variant = 'default', 
  className,
  header,
  footer,
  hoverable = false
}: CardProps) => {
  const variants = {
    default: 'card',
    elevated: 'card-elevated',
    glass: 'card-glass',
  }
  
  return (
    <div className={clsx(
      variants[variant],
      hoverable && 'hover-lift cursor-pointer',
      className
    )}>
      {header && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          {header}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
