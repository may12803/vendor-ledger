import './Pill.css'

interface PillProps {
  children: React.ReactNode
  variant?: 'default' | 'primary'
  onClick?: () => void
}

export function Pill({ children, variant = 'default', onClick }: PillProps) {
  return (
    <button className={`pill ${variant === 'primary' ? 'primary' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

interface PillTagProps {
  children: React.ReactNode
  variant?: 'filled' | 'outline'
}

export function PillTag({ children, variant = 'filled' }: PillTagProps) {
  return (
    <span className={`pill-tag ${variant === 'outline' ? 'outline' : ''}`}>
      {children}
    </span>
  )
}
