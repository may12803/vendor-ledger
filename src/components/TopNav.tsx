import { Link, useLocation } from 'react-router-dom'
import './TopNav.css'

export function TopNav() {
  const { pathname } = useLocation()

  const links = [
    { to: '/vendors', label: 'Vendors' },
    { to: '/contracts', label: 'Contracts' },
    { to: '/reporting', label: 'Reporting' },
  ]

  return (
    <header className="top-nav">
      <Link to="/" className="brand">Ledger.</Link>
      <nav>
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={pathname.startsWith(to) ? 'active' : ''}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="actions">
        <Link to="/settings" className="pill">Settings</Link>
      </div>
    </header>
  )
}
