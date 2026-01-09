import clsx from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  overlay?: boolean
  text?: string
}

const LoadingSpinner = ({ size = 'md', overlay = false, text }: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  }
  
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={clsx('spinner', sizes[size])} />
      {text && <p className="text-sm text-gray-600 animate-pulse">{text}</p>}
    </div>
  )
  
  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          {spinner}
        </div>
      </div>
    )
  }
  
  return spinner
}

export default LoadingSpinner
