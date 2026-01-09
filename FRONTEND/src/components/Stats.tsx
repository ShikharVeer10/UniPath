import { ReactNode, useEffect, useState } from 'react'
import clsx from 'clsx'

interface StatsProps {
  icon: ReactNode
  value: number | string
  label: string
  suffix?: string
  prefix?: string
  animate?: boolean
  iconBgColor?: string
  iconColor?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

const Stats = ({ 
  icon, 
  value, 
  label, 
  suffix = '',
  prefix = '',
  animate = true,
  iconBgColor = 'bg-primary-100',
  iconColor = 'text-primary-600',
  trend
}: StatsProps) => {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value)
  
  useEffect(() => {
    if (!animate || typeof value !== 'number') {
      setDisplayValue(value)
      return
    }
    
    const duration = 1500 // Animation duration in ms
    const steps = 60
    const increment = value / steps
    let current = 0
    let step = 0
    
    const timer = setInterval(() => {
      step++
      current = increment * step
      
      if (step >= steps) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [value, animate])
  
  return (
    <div className="card hover-lift">
      <div className="flex items-center gap-4">
        <div className={clsx('p-3 rounded-lg flex-shrink-0', iconBgColor)}>
          <div className={clsx('w-8 h-8', iconColor)}>
            {icon}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-sm font-medium truncate">{label}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-gray-900">
              {prefix}{displayValue}{suffix}
            </p>
            {trend && (
              <span className={clsx(
                'text-sm font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats
