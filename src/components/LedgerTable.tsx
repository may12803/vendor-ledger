import { Pill, PillTag } from './Pill'
import { PasswordField } from './PasswordField'
import type { VendorWithCredentials } from '../types/database'
import './LedgerTable.css'

interface LedgerTableProps {
  vendors: VendorWithCredentials[]
  onEdit: (vendor: VendorWithCredentials) => void
  onNavigate?: (id: string) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function LedgerTable({ vendors, onEdit, onNavigate }: LedgerTableProps) {
  return (
    <section className="ledger-container">
      <div className="ledger-header">
        <div className="label-micro">Vendor / Service</div>
        <div className="label-micro">Primary Contact</div>
        <div className="label-micro">Access Credentials</div>
        <div className="label-micro">Billing Cycle</div>
        <div className="label-micro">Monthly Cost</div>
        <div className="label-micro" style={{ textAlign: 'right' }}>Actions</div>
      </div>

      {vendors.map((vendor) => (
        <div className="ledger-row" key={vendor.id}>
          <div className="col-vendor">
            <div
              className="vendor-name clickable"
              onClick={() => onNavigate?.(vendor.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate?.(vendor.id)}
            >
              {vendor.name}
            </div>
            <div>
              <PillTag variant={vendor.category_variant}>{vendor.category}</PillTag>
            </div>
          </div>

          <div className="col-contact">
            <span className="data-value serif-val">{vendor.contact_name}</span>
            <span className="data-value muted">{vendor.contact_email}</span>
            {vendor.contact_phone && (
              <span className="data-value muted">{vendor.contact_phone}</span>
            )}
          </div>

          <div className="col-auth">
            {vendor.credentials.map((cred) => (
              <div className="auth-block" key={cred.id}>
                <span className="auth-label">{cred.label}</span>
                {cred.is_password ? (
                  <PasswordField value={cred.value} maskLength={cred.mask_length ?? 12} />
                ) : (
                  <span className="data-value">{cred.value}</span>
                )}
              </div>
            ))}
          </div>

          <div className="col-billing">
            <span className="data-value">{vendor.billing_cycle}</span>
            {vendor.renewal_note && (
              <span className="data-value muted small">{vendor.renewal_note}</span>
            )}
          </div>

          <div className="col-cost">
            <span className="data-value serif-val">{formatCurrency(Number(vendor.monthly_cost))}</span>
          </div>

          <div className="col-actions">
            <Pill onClick={() => onEdit(vendor)}>Edit</Pill>
          </div>
        </div>
      ))}
    </section>
  )
}
