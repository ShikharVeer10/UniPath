import { ReactNode } from 'react'
import clsx from 'clsx'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export interface AlertProps {
  variant?: 'success' | 'warning' | 'error' | 'info'
  children: ReactNode
  className?: string
  icon?: boolean
}

const Alert = ({ variant = 'info', children, className, icon = true }: AlertProps) => {
  const variantClasses = {
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
    info: 'alert-info',
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />,
  }

  return (
    <div className={clsx('alert', variantClasses[variant], className)}>
      {icon && icons[variant]}
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default Alert
