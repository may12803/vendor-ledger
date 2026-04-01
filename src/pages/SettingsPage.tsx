import { useState } from 'react'
import { Pill } from '../components/Pill'
import './SettingsPage.css'

export function SettingsPage() {
  const [orgName, setOrgName] = useState('Acme Corp')
  const [email, setEmail] = useState('admin@acmecorp.com')
  const [renewalAlert, setRenewalAlert] = useState(30)
  const [currency, setCurrency] = useState('USD')
  const [timezone, setTimezone] = useState('America/New_York')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <div className="settings-hero">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Configure your vendor ledger preferences</p>
      </div>

      <div className="settings-container">
        {/* Organization */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h2 className="settings-section-title">Organization</h2>
            <span className="settings-section-desc">General account information</span>
          </div>
          <div className="settings-fields">
            <div className="settings-field">
              <label className="form-label">Organization Name</label>
              <input className="form-input" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div className="settings-field">
              <label className="form-label">Admin Email</label>
              <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h2 className="settings-section-title">Notifications</h2>
            <span className="settings-section-desc">Alerts and reminder preferences</span>
          </div>
          <div className="settings-fields">
            <div className="settings-field">
              <label className="form-label">Renewal Alert (Days Before)</label>
              <input className="form-input" type="number" value={renewalAlert} onChange={(e) => setRenewalAlert(Number(e.target.value))} />
              <span className="field-hint">Get notified this many days before a contract expires</span>
            </div>
            <div className="settings-toggle-row">
              <div className="settings-toggle-info">
                <span className="toggle-label">Email Notifications</span>
                <span className="toggle-desc">Receive contract expiry alerts via email</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-track" />
              </label>
            </div>
            <div className="settings-toggle-row">
              <div className="settings-toggle-info">
                <span className="toggle-label">Weekly Digest</span>
                <span className="toggle-desc">Summary of vendor activity sent every Monday</span>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-track" />
              </label>
            </div>
          </div>
        </div>

        {/* Display */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h2 className="settings-section-title">Display</h2>
            <span className="settings-section-desc">Formatting and regional preferences</span>
          </div>
          <div className="settings-fields">
            <div className="settings-field">
              <label className="form-label">Currency</label>
              <select className="form-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="CAD">CAD — Canadian Dollar</option>
                <option value="AUD">AUD — Australian Dollar</option>
              </select>
            </div>
            <div className="settings-field">
              <label className="form-label">Timezone</label>
              <select className="form-input" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Central European</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="settings-section">
          <div className="settings-section-header">
            <h2 className="settings-section-title">Data</h2>
            <span className="settings-section-desc">Import, export, and manage your data</span>
          </div>
          <div className="settings-actions-row">
            <div className="settings-action-card">
              <span className="action-title">Export Vendors</span>
              <span className="action-desc">Download all vendor data as CSV</span>
              <Pill>Export CSV</Pill>
            </div>
            <div className="settings-action-card">
              <span className="action-title">Export Contracts</span>
              <span className="action-desc">Download all contract data as CSV</span>
              <Pill>Export CSV</Pill>
            </div>
            <div className="settings-action-card">
              <span className="action-title">Import Data</span>
              <span className="action-desc">Bulk import vendors from CSV</span>
              <Pill>Import</Pill>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <div className="settings-section-header">
            <h2 className="settings-section-title">Danger Zone</h2>
            <span className="settings-section-desc">Irreversible actions</span>
          </div>
          <div className="settings-actions-row">
            <div className="settings-action-card danger">
              <span className="action-title">Delete All Vendors</span>
              <span className="action-desc">Permanently remove all vendors and their credentials</span>
              <Pill>Delete All</Pill>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          {saved && <span className="save-confirmation">Settings saved</span>}
          <Pill variant="primary" onClick={handleSave}>Save Changes</Pill>
        </div>
      </div>
    </>
  )
}
