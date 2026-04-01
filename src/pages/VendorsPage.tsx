import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeroSummary } from '../components/HeroSummary'
import { Toolbar } from '../components/Toolbar'
import { LedgerTable } from '../components/LedgerTable'
import { VendorModal } from '../components/VendorModal'
import { useVendors } from '../hooks/useVendors'
import type { VendorWithCredentials } from '../types/database'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

export function VendorsPage() {
  const { vendors, loading, totalMonthlyCost, addVendor, updateVendor, deleteVendor } = useVendors()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<VendorWithCredentials | null>(null)
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    if (!search.trim()) return vendors
    const q = search.toLowerCase()
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.contact_name.toLowerCase().includes(q) ||
        v.contact_email.toLowerCase().includes(q)
    )
  }, [search, vendors])

  const openAdd = () => { setEditingVendor(null); setModalOpen(true) }
  const openEdit = (vendor: VendorWithCredentials) => { setEditingVendor(vendor); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditingVendor(null) }

  return (
    <>
      <HeroSummary
        title={<>Vendor<br />Directory</>}
        metrics={[
          { label: 'Total Monthly Run Rate', value: formatCurrency(totalMonthlyCost) },
          { label: 'Active Vendors', value: String(vendors.length) },
        ]}
      />
      <Toolbar
        searchValue={search}
        onSearchChange={setSearch}
        onAddVendor={openAdd}
      />
      {loading ? (
        <div className="loading-state">Loading vendors...</div>
      ) : (
        <LedgerTable vendors={filtered} onEdit={openEdit} onNavigate={(id) => navigate(`/vendors/${id}`)} />
      )}
      <VendorModal
        open={modalOpen}
        vendor={editingVendor}
        onClose={closeModal}
        onSave={async (vendor, credentials) => {
          if (editingVendor) {
            await updateVendor(editingVendor.id, vendor, credentials)
          } else {
            await addVendor(vendor, credentials)
          }
        }}
        onDelete={editingVendor ? async () => { await deleteVendor(editingVendor.id) } : undefined}
      />
    </>
  )
}
