import { useState } from 'react'
import './PasswordField.css'

interface PasswordFieldProps {
  value: string
  maskLength?: number
}

export function PasswordField({ value, maskLength = 12 }: PasswordFieldProps) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="password-field">
      <span className="password-mask">
        {revealed ? value : '•'.repeat(maskLength)}
      </span>
      <button className="btn-text" onClick={() => setRevealed(!revealed)}>
        {revealed ? 'Hide' : 'Reveal'}
      </button>
    </div>
  )
}
