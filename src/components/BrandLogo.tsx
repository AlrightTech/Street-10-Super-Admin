/**
 * BrandLogo component props
 */
export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Brand logo component for Street10
 */
export default function BrandLogo({ size = 'md', className = '' }: BrandLogoProps) {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/Images/Street10-logo.png" 
        alt="Street10 logo"
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  )
}

