import { Pill, PillTag } from './Pill'
import { PasswordField } from './PasswordField'
import './LedgerTable.css'

export interface Credential {
  label: string
  value: string
  isPassword?: boolean
  maskLength?: number
}

export interface Vendor {
  name: string
  category: string
  categoryVariant: 'filled' | 'outline'
  contact: {
    name: string
    email: string
    phone?: string
  }
  credentials: Credential[]
  billing: {
    cycle: string
    renewalNote?: string
  }
  monthlyCost: string
}

interface LedgerTableProps {
  vendors: Vendor[]
}

export function LedgerTable({ vendors }: LedgerTableProps) {
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
        <div className="ledger-row" key={vendor.name}>
          <div className="col-vendor">
            <div className="vendor-name">{vendor.name}</div>
            <div>
              <PillTag variant={vendor.categoryVariant}>{vendor.category}</PillTag>
            </div>
          </div>

          <div className="col-contact">
            <span className="data-value serif-val">{vendor.contact.name}</span>
            <span className="data-value muted">{vendor.contact.email}</span>
            {vendor.contact.phone && (
              <span className="data-value muted">{vendor.contact.phone}</span>
            )}
          </div>

          <div className="col-auth">
            {vendor.credentials.map((cred) => (
              <div className="auth-block" key={cred.label}>
                <span className="auth-label">{cred.label}</span>
                {cred.isPassword ? (
                  <PasswordField value={cred.value} maskLength={cred.maskLength} />
                ) : (
                  <span className="data-value">{cred.value}</span>
                )}
              </div>
            ))}
          </div>

          <div className="col-billing">
            <span className="data-value">{vendor.billing.cycle}</span>
            {vendor.billing.renewalNote && (
              <span className="data-value muted small">{vendor.billing.renewalNote}</span>
            )}
          </div>

          <div className="col-cost">
            <span className="data-value serif-val">{vendor.monthlyCost}</span>
          </div>

          <div className="col-actions">
            <Pill>Edit</Pill>
          </div>
        </div>
      ))}
    </section>
  )
}
