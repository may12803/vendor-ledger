import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { HeroSummary } from '../components/HeroSummary'
import { supabase } from '../lib/supabase'
import type { Vendor, Contract, ActivityLog } from '../types/database'
import './ReportingPage.css'

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function relativeTime(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

const actionLabels: Record<string, string> = {
  vendor_created: 'Vendor Added',
  vendor_updated: 'Vendor Updated',
  contract_signed: 'Contract Signed',
  contract_expired: 'Contract Expired',
  contract_expiring: 'Expiring Soon',
  credentials_updated: 'Credentials Rotated',
}

const actionDots: Record<string, string> = {
  vendor_created: 'var(--accent-color)',
  vendor_updated: 'var(--accent-color)',
  contract_signed: 'var(--accent-color)',
  contract_expired: '#cc0000',
  contract_expiring: '#FFD700',
  credentials_updated: 'var(--text-main)',
}

export function ReportingPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [activity, setActivity] = useState<(ActivityLog & { vendor_name?: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: v }, { data: c }, { data: a }] = await Promise.all([
        supabase.from('vendors').select('*').order('monthly_cost', { ascending: false }),
        supabase.from('contracts').select('*').order('end_date', { ascending: true }),
        supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(20),
      ])
      const vendorList = (v ?? []) as Vendor[]
      const vendorMap = new Map(vendorList.map(v => [v.id, v.name]))
      setVendors(vendorList)
      setContracts((c ?? []) as Contract[])
      setActivity(((a ?? []) as ActivityLog[]).map(log => ({
        ...log,
        vendor_name: log.vendor_id ? vendorMap.get(log.vendor_id) : undefined,
      })))
      setLoading(false)
    }
    load()
  }, [])

  const totalMonthly = useMemo(() => vendors.reduce((s, v) => s + Number(v.monthly_cost), 0), [vendors])
  const totalAnnual = totalMonthly * 12

  // Spend by category
  const categorySpend = useMemo(() => {
    const map = new Map<string, number>()
    vendors.forEach(v => {
      map.set(v.category, (map.get(v.category) ?? 0) + Number(v.monthly_cost))
    })
    return Array.from(map.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
  }, [vendors])

  const maxCategorySpend = Math.max(...categorySpend.map(c => c.amount), 1)

  // Top vendors by spend
  const topVendors = useMemo(() =>
    [...vendors].sort((a, b) => Number(b.monthly_cost) - Number(a.monthly_cost)).slice(0, 5),
  [vendors])

  const maxVendorSpend = topVendors.length > 0 ? Number(topVendors[0].monthly_cost) : 1

  // Upcoming renewals
  const upcomingRenewals = useMemo(() =>
    contracts
      .filter(c => c.end_date && c.status !== 'expired' && c.status !== 'cancelled')
      .sort((a, b) => new Date(a.end_date!).getTime() - new Date(b.end_date!).getTime())
      .slice(0, 5),
  [contracts])

  if (loading) return <div className="loading-state">Loading reports...</div>

  return (
    <>
      <HeroSummary
        title={<>Spend<br />Overview</>}
        metrics={[
          { label: 'Monthly Run Rate', value: formatCurrency(totalMonthly) },
          { label: 'Projected Annual', value: formatCurrency(totalAnnual) },
          { label: 'Vendor Count', value: String(vendors.length) },
        ]}
      />

      <div className="report-grid">
        {/* Spend by Category */}
        <div className="report-card">
          <h3 className="report-card-title">Spend by Category</h3>
          <div className="bar-chart">
            {categorySpend.map(({ category, amount }) => (
              <div className="bar-row" key={category}>
                <span className="bar-label">{category}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${(amount / maxCategorySpend) * 100}%` }}
                  />
                </div>
                <span className="bar-value">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Vendors */}
        <div className="report-card">
          <h3 className="report-card-title">Top Vendors by Spend</h3>
          <div className="bar-chart">
            {topVendors.map((v, i) => (
              <div className="bar-row" key={v.id}>
                <span className="bar-label">
                  <span className="bar-rank">{i + 1}.</span>
                  <Link to={`/vendors/${v.id}`} className="bar-link">{v.name}</Link>
                </span>
                <div className="bar-track">
                  <div
                    className="bar-fill accent"
                    style={{ width: `${(Number(v.monthly_cost) / maxVendorSpend) * 100}%` }}
                  />
                </div>
                <span className="bar-value">{formatCurrency(Number(v.monthly_cost))}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div className="report-card">
          <h3 className="report-card-title">Upcoming Renewals</h3>
          {upcomingRenewals.length === 0 ? (
            <p className="report-empty">No upcoming renewals</p>
          ) : (
            <div className="renewals-list">
              {upcomingRenewals.map((c) => {
                const vendorName = vendors.find(v => v.id === c.vendor_id)?.name ?? 'Unknown'
                const days = Math.ceil((new Date(c.end_date!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                const urgent = days <= 30
                return (
                  <div className="renewal-row" key={c.id}>
                    <div className="renewal-info">
                      <span className="renewal-title">{c.title}</span>
                      <span className="renewal-vendor">{vendorName}</span>
                    </div>
                    <div className="renewal-date">
                      <span className={`renewal-countdown ${urgent ? 'urgent' : ''}`}>
                        {days > 0 ? `${days}d` : 'Overdue'}
                      </span>
                      <span className="renewal-end">{formatDate(c.end_date!)}</span>
                    </div>
                    <span className="renewal-value">{formatCurrency(Number(c.value))}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="report-card">
          <h3 className="report-card-title">Recent Activity</h3>
          <div className="activity-feed">
            {activity.map((log) => (
              <div className="activity-row" key={log.id}>
                <div className="activity-dot" style={{ background: actionDots[log.action] ?? 'var(--text-muted)' }} />
                <div className="activity-content">
                  <div className="activity-top">
                    <span className="activity-action">{actionLabels[log.action] ?? log.action}</span>
                    <span className="activity-time">{relativeTime(log.created_at)}</span>
                  </div>
                  {log.details && <span className="activity-details">{log.details}</span>}
                  {log.vendor_name && <span className="activity-vendor">{log.vendor_name}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
