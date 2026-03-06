interface CircularProgressProps {
  value: number
  max: number
  text?: string
  size?: number
  strokeWidth?: number
  className?: string
}

export const CircularProgress = ({
  value,
  max,
  text,
  size = 24,
  strokeWidth = 3,
  className = 'text-yellow-500'
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percent = Math.min(Math.max(value / max, 0), 1)
  const offset = circumference - percent * circumference

  return (
    <div className="relative inline-flex items-center justify-center font-bold" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={`transform -rotate-90 ${className}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="butt"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      {text && (
        <span className="absolute text-[8px] tracking-tighter leading-none select-none">
          {text}
        </span>
      )}
    </div>
  )
}
