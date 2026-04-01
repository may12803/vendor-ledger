import { useState, useEffect } from 'react'
import type { VendorWithCredentials, VendorInsert, CredentialInsert } from '../types/database'
import './VendorModal.css'

interface CredentialForm {
  label: string
  value: string
  is_password: boolean
  mask_length: number | null
}

interface VendorFormData {
  name: string
  category: string
  category_variant: 'filled' | 'outline'
  contact_name: string
  contact_email: string
  contact_phone: string
  billing_cycle: string
  renewal_note: string
  monthly_cost: string
  credentials: CredentialForm[]
}

const emptyForm: VendorFormData = {
  name: '',
  category: '',
  category_variant: 'filled',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  billing_cycle: 'Monthly',
  renewal_note: '',
  monthly_cost: '',
  credentials: [{ label: '', value: '', is_password: false, mask_length: 12 }],
}

interface VendorModalProps {
  open: boolean
  vendor?: VendorWithCredentials | null
  onClose: () => void
  onSave: (vendor: VendorInsert, credentials: CredentialInsert[]) => Promise<void>
  onDelete?: () => Promise<void>
}

export function VendorModal({ open, vendor, onClose, onSave, onDelete }: VendorModalProps) {
  const [form, setForm] = useState<VendorFormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (vendor) {
      setForm({
        name: vendor.name,
        category: vendor.category,
        category_variant: vendor.category_variant,
        contact_name: vendor.contact_name,
        contact_email: vendor.contact_email,
        contact_phone: vendor.contact_phone ?? '',
        billing_cycle: vendor.billing_cycle,
        renewal_note: vendor.renewal_note ?? '',
        monthly_cost: String(vendor.monthly_cost),
        credentials: vendor.credentials.length > 0
          ? vendor.credentials.map((c) => ({
              label: c.label,
              value: c.value,
              is_password: c.is_password,
              mask_length: c.mask_length,
            }))
          : [{ label: '', value: '', is_password: false, mask_length: 12 }],
      })
    } else {
      setForm(emptyForm)
    }
  }, [vendor, open])

  if (!open) return null

  const updateField = (field: keyof VendorFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const updateCredential = (idx: number, field: keyof CredentialForm, value: string | boolean | number | null) => {
    setForm((f) => {
      const creds = [...f.credentials]
      creds[idx] = { ...creds[idx], [field]: value }
      return { ...f, credentials: creds }
    })
  }

  const addCredential = () => {
    setForm((f) => ({
      ...f,
      credentials: [...f.credentials, { label: '', value: '', is_password: false, mask_length: 12 }],
    }))
  }

  const removeCredential = (idx: number) => {
    setForm((f) => ({
      ...f,
      credentials: f.credentials.filter((_, i) => i !== idx),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(
        {
          name: form.name,
          category: form.category,
          category_variant: form.category_variant,
          contact_name: form.contact_name,
          contact_email: form.contact_email,
          contact_phone: form.contact_phone || null,
          billing_cycle: form.billing_cycle,
          renewal_note: form.renewal_note || null,
          monthly_cost: parseFloat(form.monthly_cost) || 0,
        },
        form.credentials
          .filter((c) => c.label && c.value)
          .map((c) => ({
            label: c.label,
            value: c.value,
            is_password: c.is_password,
            mask_length: c.is_password ? (c.mask_length ?? 12) : null,
          }))
      )
      onClose()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{vendor ? 'Edit Vendor' : 'Add New Vendor'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full">
              <label className="form-label">Vendor Name</label>
              <input className="form-input" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input className="form-input" value={form.category} onChange={(e) => updateField('category', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Tag Style</label>
              <select className="form-input" value={form.category_variant} onChange={(e) => updateField('category_variant', e.target.value)}>
                <option value="filled">Filled</option>
                <option value="outline">Outline</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Contact Name</label>
              <input className="form-input" value={form.contact_name} onChange={(e) => updateField('contact_name', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input className="form-input" type="email" value={form.contact_email} onChange={(e) => updateField('contact_email', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input className="form-input" value={form.contact_phone} onChange={(e) => updateField('contact_phone', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Billing Cycle</label>
              <select className="form-input" value={form.billing_cycle} onChange={(e) => updateField('billing_cycle', e.target.value)}>
                <option>Monthly</option>
                <option>Annual</option>
                <option>Net 30</option>
                <option>Net 60</option>
                <option>Quarterly</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Renewal Note</label>
              <input className="form-input" value={form.renewal_note} onChange={(e) => updateField('renewal_note', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Cost ($)</label>
              <input className="form-input" type="number" step="0.01" value={form.monthly_cost} onChange={(e) => updateField('monthly_cost', e.target.value)} required />
            </div>
          </div>

          <div className="credentials-section">
            <div className="credentials-header">
              <span className="form-label">Credentials</span>
              <button type="button" className="pill small" onClick={addCredential}>+ Add</button>
            </div>
            {form.credentials.map((cred, idx) => (
              <div className="credential-row" key={idx}>
                <input className="form-input" placeholder="Label (e.g. PASSWORD)" value={cred.label} onChange={(e) => updateCredential(idx, 'label', e.target.value)} />
                <input className="form-input" placeholder="Value" value={cred.value} onChange={(e) => updateCredential(idx, 'value', e.target.value)} />
                <label className="checkbox-label">
                  <input type="checkbox" checked={cred.is_password} onChange={(e) => updateCredential(idx, 'is_password', e.target.checked)} />
                  Secret
                </label>
                {form.credentials.length > 1 && (
                  <button type="button" className="btn-text" onClick={() => removeCredential(idx)}>Remove</button>
                )}
              </div>
            ))}
          </div>

          <div className="modal-actions">
            {vendor && onDelete && (
              <button type="button" className="pill danger" onClick={async () => {
                if (confirm('Delete this vendor?')) {
                  await onDelete()
                  onClose()
                }
              }}>Delete</button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="pill" onClick={onClose}>Cancel</button>
              <button type="submit" className="pill primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Vendor'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
