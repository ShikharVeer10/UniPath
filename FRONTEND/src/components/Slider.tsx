import { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  showValue?: boolean
  showMinMax?: boolean
  unit?: string
}

const Slider = ({ 
  label, 
  showValue = true,
  showMinMax = true,
  unit = '',
  min = 0,
  max = 100,
  value,
  className,
  ...props 
}: SliderProps) => {
  const currentValue = Number(value || min)
  const percentage = ((currentValue - Number(min)) / (Number(max) - Number(min))) * 100
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
          {showValue && (
            <span className="text-sm font-semibold text-primary-600">
              {currentValue}{unit}
            </span>
          )}
        </div>
      )}
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          className={clsx(
            'w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600',
            '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md',
            '[&::-webkit-slider-thumb]:hover:bg-primary-700 [&::-webkit-slider-thumb]:transition-colors',
            '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-primary-600 [&::-moz-range-thumb]:border-0',
            '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md',
            '[&::-moz-range-thumb]:hover:bg-primary-700 [&::-moz-range-thumb]:transition-colors',
            className
          )}
          style={{
            background: `linear-gradient(to right, rgb(2 132 199) 0%, rgb(2 132 199) ${percentage}%, rgb(229 231 235) ${percentage}%, rgb(229 231 235) 100%)`
          }}
          {...props}
        />
      </div>
      
      {showMinMax && (
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      )}
    </div>
  )
}

export default Slider
