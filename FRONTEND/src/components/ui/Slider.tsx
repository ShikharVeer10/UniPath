import { forwardRef, InputHTMLAttributes, useState } from 'react'
import clsx from 'clsx'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  min?: number
  max?: number
  step?: number
  showValue?: boolean
  valueFormatter?: (value: number) => string
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      showValue = true,
      valueFormatter,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      (value as number) || (defaultValue as number) || min
    )

    const displayValue = value !== undefined ? (value as number) : internalValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value)
      setInternalValue(newValue)
      onChange?.(e)
    }

    const formatValue = (val: number) => {
      return valueFormatter ? valueFormatter(val) : val.toString()
    }

    const percentage = ((displayValue - min) / (max - min)) * 100

    return (
      <div className={clsx('w-full', className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
            )}
            {showValue && (
              <span className="text-sm font-semibold text-primary-600">
                {formatValue(displayValue)}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={displayValue}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #0284c7 0%, #0284c7 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
            }}
            {...props}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{formatValue(min)}</span>
          <span className="text-xs text-gray-500">{formatValue(max)}</span>
        </div>
      </div>
    )
  }
)

Slider.displayName = 'Slider'

export default Slider
