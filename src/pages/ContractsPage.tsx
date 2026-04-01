import { useState, useMemo, useEffect } from 'react'
import { HeroSummary } from '../components/HeroSummary'
import { Pill, PillTag } from '../components/Pill'
import { useContracts } from '../hooks/useContracts'
import { supabase } from '../lib/supabase'
import type { ContractInsert, Vendor } from '../types/database'
import './ContractsPage.css'

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function daysUntil(d: string) {
  const diff = new Date(d).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const statusMap: Record<string, { bg: string; border: string }> = {
  active: { bg: 'var(--accent-color)', border: 'var(--text-main)' },
  expiring: { bg: '#FFD700', border: 'var(--text-main)' },
  expired: { bg: 'transparent', border: 'var(--text-muted)' },
  pending: { bg: 'transparent', border: 'var(--text-main)' },
  cancelled: { bg: 'transparent', border: 'var(--text-muted)' },
}

// Contract form modal
function ContractModal({ open, onClose, onSave, vendors }: {
  open: boolean
  onClose: () => void
  onSave: (c: ContractInsert) => Promise<void>
  vendors: Pick<Vendor, 'id' | 'name'>[]
}) {
  const [form, setForm] = useState({
    vendor_id: '',
    title: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    value: '',
    billing_frequency: 'Monthly',
    status: 'active' as ContractInsert['status'],
    auto_renew: false,
    notes: '',
  })
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        vendor_id: form.vendor_id,
        title: form.title,
        description: form.description || null,
        start_date: form.start_date,
        end_date: form.end_date || null,
        value: parseFloat(form.value) || 0,
        billing_frequency: form.billing_frequency,
        status: form.status,
        auto_renew: form.auto_renew,
        notes: form.notes || null,
      })
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
          <h2 className="modal-title">New Contract</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full">
              <label className="form-label">Contract Title</label>
              <input className="form-input" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="form-group full">
              <label className="form-label">Vendor</label>
              <select className="form-input" value={form.vendor_id} onChange={(e) => setForm(f => ({ ...f, vendor_id: e.target.value }))} required>
                <option value="">Select vendor...</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label className="form-label">Description</label>
              <input className="form-input" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="form-input" type="date" value={form.start_date} onChange={(e) => setForm(f => ({ ...f, start_date: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input className="form-input" type="date" value={form.end_date} onChange={(e) => setForm(f => ({ ...f, end_date: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Total Value ($)</label>
              <input className="form-input" type="number" step="0.01" value={form.value} onChange={(e) => setForm(f => ({ ...f, value: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Billing Frequency</label>
              <select className="form-input" value={form.billing_frequency} onChange={(e) => setForm(f => ({ ...f, billing_frequency: e.target.value }))}>
                <option>Monthly</option>
                <option>Annual</option>
                <option>Quarterly</option>
                <option>One-time</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as ContractInsert['status'] }))}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expiring">Expiring</option>
              </select>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={form.auto_renew} onChange={(e) => setForm(f => ({ ...f, auto_renew: e.target.checked }))} />
                Auto-Renew
              </label>
            </div>
            <div className="form-group full">
              <label className="form-label">Notes</label>
              <input className="form-input" value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div className="modal-actions">
            <div className="modal-actions-right">
              <button type="button" className="pill" onClick={onClose}>Cancel</button>
              <button type="submit" className="pill primary" disabled={saving}>{saving ? 'Saving...' : 'Create Contract'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ContractsPage() {
  const { contracts, loading, totalValue, activeCount, expiringCount, addContract } = useContracts()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [vendors, setVendors] = useState<Pick<Vendor, 'id' | 'name'>[]>([])

  useEffect(() => {
    supabase.from('vendors').select('id, name').order('name').then(({ data }) => {
      setVendors((data ?? []) as Pick<Vendor, 'id' | 'name'>[])
    })
  }, [])

  const filtered = useMemo(() => {
    let result = contracts
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.vendor_name.toLowerCase().includes(q) ||
          (c.description ?? '').toLowerCase().includes(q)
      )
    }
    return result
  }, [contracts, search, statusFilter])

  const statuses = ['all', 'active', 'expiring', 'expired', 'pending', 'cancelled']

  return (
    <>
      <HeroSummary
        title={<>Contract<br />Registry</>}
        metrics={[
          { label: 'Total Contract Value', value: formatCurrency(totalValue) },
          { label: 'Active', value: String(activeCount) },
          { label: 'Expiring Soon', value: String(expiringCount) },
        ]}
      />

      <div className="contracts-toolbar">
        <div className="contracts-toolbar-left">
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search contracts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="status-filters">
            {statuses.map((s) => (
              <button
                key={s}
                className={`pill ${statusFilter === s ? 'primary' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <Pill variant="primary" onClick={() => setModalOpen(true)}>New Contract</Pill>
      </div>

      {loading ? (
        <div className="loading-state">Loading contracts...</div>
      ) : (
        <section className="contracts-table">
          <div className="contracts-header">
            <div className="label-micro">Contract</div>
            <div className="label-micro">Vendor</div>
            <div className="label-micro">Status</div>
            <div className="label-micro">Term</div>
            <div className="label-micro">Value</div>
            <div className="label-micro" style={{ textAlign: 'right' }}>Frequency</div>
          </div>
          {filtered.length === 0 ? (
            <div className="empty-row">No contracts match your criteria.</div>
          ) : (
            filtered.map((c) => {
              const style = statusMap[c.status] ?? statusMap.active
              const days = c.end_date ? daysUntil(c.end_date) : null
              return (
                <div className="contracts-row" key={c.id}>
                  <div className="contract-cell-title">
                    <span className="contract-name">{c.title}</span>
                    {c.description && <span className="contract-description">{c.description}</span>}
                    {c.notes && <span className="contract-notes">Note: {c.notes}</span>}
                  </div>
                  <div className="contract-cell">
                    <span className="data-value serif-val">{c.vendor_name}</span>
                  </div>
                  <div className="contract-cell">
                    <div className="status-badge" style={{ background: style.bg, borderColor: style.border }}>
                      {c.status}
                    </div>
                    {c.auto_renew && <PillTag variant="outline">Auto-Renew</PillTag>}
                  </div>
                  <div className="contract-cell">
                    <span className="data-value">{formatDate(c.start_date)}</span>
                    {c.end_date && (
                      <>
                        <span className="data-value muted">&rarr; {formatDate(c.end_date)}</span>
                        {days !== null && days > 0 && days <= 90 && (
                          <span className="days-remaining">{days}d remaining</span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="contract-cell">
                    <span className="data-value serif-val">{formatCurrency(Number(c.value))}</span>
                  </div>
                  <div className="contract-cell" style={{ textAlign: 'right' }}>
                    <span className="data-value">{c.billing_frequency}</span>
                  </div>
                </div>
              )
            })
          )}
        </section>
      )}

      <ContractModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addContract}
        vendors={vendors}
      />
    </>
  )
}
