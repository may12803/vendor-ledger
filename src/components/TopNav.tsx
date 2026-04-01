import { Pill } from './Pill'
import './TopNav.css'

export function TopNav() {
  return (
    <header className="top-nav">
      <div className="brand">Ledger.</div>
      <nav>
        <a href="#">Vendors</a>
        <a href="#">Contracts</a>
        <a href="#">Reporting</a>
      </nav>
      <div className="actions">
        <Pill>Settings</Pill>
      </div>
    </header>
  )
}
