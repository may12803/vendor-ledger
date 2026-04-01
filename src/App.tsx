import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TopNav } from './components/TopNav'
import { VendorsPage } from './pages/VendorsPage'
import { VendorDetailPage } from './pages/VendorDetailPage'
import { ContractsPage } from './pages/ContractsPage'
import { ReportingPage } from './pages/ReportingPage'
import { SettingsPage } from './pages/SettingsPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <TopNav />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/vendors" replace />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/vendors/:id" element={<VendorDetailPage />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/reporting" element={<ReportingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
