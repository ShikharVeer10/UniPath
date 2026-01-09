import clsx from 'clsx'

interface ProgressBarProps {
  value: number
  max?: number
  showPercentage?: boolean
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  label?: string
}

const ProgressBar = ({ 
  value, 
  max = 100, 
  showPercentage = true,
  variant = 'primary',
  size = 'md',
  animated = false,
  label
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const variants = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    danger: 'from-red-500 to-red-600',
  }
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      <div className={clsx('progress-bar', sizes[size])}>
        <div
          className={clsx(
            'progress-bar-fill bg-gradient-to-r',
            variants[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {!label && showPercentage && (
        <div className="mt-2 text-right">
          <span className="text-sm font-semibold text-gray-900">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  )
}

export default ProgressBar
