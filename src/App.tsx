import { useState, useMemo } from 'react'
import { TopNav } from './components/TopNav'
import { HeroSummary } from './components/HeroSummary'
import { Toolbar } from './components/Toolbar'
import { LedgerTable } from './components/LedgerTable'
import { vendors } from './data/vendors'
import './App.css'

function App() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return vendors
    const q = search.toLowerCase()
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.contact.name.toLowerCase().includes(q) ||
        v.contact.email.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <>
      <TopNav />
      <main>
        <HeroSummary
          title={<>Vendor<br />Directory</>}
          metrics={[
            { label: 'Total Monthly Run Rate', value: '$42,850' },
            { label: 'Active Vendors', value: '14' },
          ]}
        />
        <Toolbar
          searchValue={search}
          onSearchChange={setSearch}
          onAddVendor={() => {}}
        />
        <LedgerTable vendors={filtered} />
      </main>
    </>
  )
}

export default App
