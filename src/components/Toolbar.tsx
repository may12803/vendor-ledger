import { Pill } from './Pill'
import './Toolbar.css'

interface ToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  onAddVendor: () => void
}

export function Toolbar({ searchValue, onSearchChange, onAddVendor }: ToolbarProps) {
  return (
    <section className="toolbar">
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search vendors, services, or contacts..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Pill variant="primary" onClick={onAddVendor}>Add New Vendor</Pill>
    </section>
  )
}
