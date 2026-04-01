import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { PasswordField } from '../components/PasswordField'
import { Pill, PillTag } from '../components/Pill'
import type { VendorWithCredentials, Contract } from '../types/database'
import './VendorDetailPage.css'

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const statusColors: Record<string, string> = {
  active: 'var(--accent-color)',
  expiring: '#FFD700',
  expired: 'transparent',
  pending: 'transparent',
  cancelled: 'transparent',
}

export function VendorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState<VendorWithCredentials | null>(null)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [{ data: v }, { data: creds }, { data: cons }] = await Promise.all([
        supabase.from('vendors').select('*').eq('id', id!).single(),
        supabase.from('credentials').select('*').eq('vendor_id', id!).order('created_at'),
        supabase.from('contracts').select('*').eq('vendor_id', id!).order('start_date', { ascending: false }),
      ])
      if (v) {
        setVendor({ ...(v as VendorWithCredentials), credentials: (creds ?? []) as VendorWithCredentials['credentials'] })
      }
      setContracts((cons ?? []) as Contract[])
      setLoading(false)
    }
    if (id) load()
  }, [id])

  if (loading) return <div className="loading-state">Loading vendor...</div>
  if (!vendor) return (
    <div className="empty-state">
      <p>Vendor not found.</p>
      <Pill onClick={() => navigate('/vendors')}>Back to Vendors</Pill>
    </div>
  )

  return (
    <div className="vendor-detail">
      <div className="detail-hero">
        <div className="detail-hero-left">
          <Link to="/vendors" className="back-link">&larr; All Vendors</Link>
          <h1 className="detail-name">{vendor.name}</h1>
          <PillTag variant={vendor.category_variant}>{vendor.category}</PillTag>
        </div>
        <div className="detail-hero-right">
          <div className="metric-group">
            <span className="label-micro">Monthly Cost</span>
            <span className="metric-value">{formatCurrency(Number(vendor.monthly_cost))}</span>
          </div>
          <div className="metric-group">
            <span className="label-micro">Active Contracts</span>
            <span className="metric-value">{contracts.filter(c => c.status === 'active').length}</span>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        {/* Contact Card */}
        <div className="detail-card">
          <h3 className="card-title">Contact</h3>
          <div className="card-body">
            <div className="card-row">
              <span className="card-label">Name</span>
              <span className="card-value serif">{vendor.contact_name}</span>
            </div>
            <div className="card-row">
              <span className="card-label">Email</span>
              <a href={`mailto:${vendor.contact_email}`} className="card-value link">{vendor.contact_email}</a>
            </div>
            {vendor.contact_phone && (
              <div className="card-row">
                <span className="card-label">Phone</span>
                <span className="card-value">{vendor.contact_phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Billing Card */}
        <div className="detail-card">
          <h3 className="card-title">Billing</h3>
          <div className="card-body">
            <div className="card-row">
              <span className="card-label">Cycle</span>
              <span className="card-value">{vendor.billing_cycle}</span>
            </div>
            {vendor.renewal_note && (
              <div className="card-row">
                <span className="card-label">Renewal</span>
                <span className="card-value">{vendor.renewal_note}</span>
              </div>
            )}
            <div className="card-row">
              <span className="card-label">Monthly</span>
              <span className="card-value serif">{formatCurrency(Number(vendor.monthly_cost))}</span>
            </div>
          </div>
        </div>

        {/* Credentials Card */}
        <div className="detail-card span-2">
          <h3 className="card-title">Access Credentials</h3>
          <div className="card-body">
            {vendor.credentials.length === 0 ? (
              <p className="card-empty">No credentials stored</p>
            ) : (
              vendor.credentials.map((cred) => (
                <div className="card-row" key={cred.id}>
                  <span className="card-label">{cred.label}</span>
                  {cred.is_password ? (
                    <PasswordField value={cred.value} maskLength={cred.mask_length ?? 12} />
                  ) : (
                    <span className="card-value mono">{cred.value}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Contracts Section */}
      <div className="detail-section">
        <div className="section-header">
          <h2 className="section-title">Contracts</h2>
          <Pill onClick={() => navigate('/contracts')}>View All</Pill>
        </div>

        {contracts.length === 0 ? (
          <div className="empty-card">No contracts found for this vendor.</div>
        ) : (
          <div className="contracts-list">
            {contracts.map((c) => (
              <div className="contract-row" key={c.id}>
                <div className="contract-status-dot" style={{ background: statusColors[c.status] ?? 'transparent', borderColor: c.status === 'expired' || c.status === 'pending' || c.status === 'cancelled' ? 'var(--text-muted)' : 'var(--text-main)' }} />
                <div className="contract-info">
                  <span className="contract-title">{c.title}</span>
                  {c.description && <span className="contract-desc">{c.description}</span>}
                </div>
                <div className="contract-meta">
                  <span className="label-micro">{c.status}</span>
                </div>
                <div className="contract-dates">
                  <span className="card-value">{formatDate(c.start_date)}</span>
                  {c.end_date && (
                    <span className="card-value muted">&rarr; {formatDate(c.end_date)}</span>
                  )}
                </div>
                <div className="contract-value">
                  <span className="card-value serif">{formatCurrency(Number(c.value))}</span>
                  <span className="card-label">{c.billing_frequency}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
