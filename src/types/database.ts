export interface Vendor {
  id: string
  name: string
  category: string
  category_variant: 'filled' | 'outline'
  contact_name: string
  contact_email: string
  contact_phone: string | null
  billing_cycle: string
  renewal_note: string | null
  monthly_cost: number
  created_at: string
  updated_at: string
}

export interface VendorInsert {
  name: string
  category: string
  category_variant: 'filled' | 'outline'
  contact_name: string
  contact_email: string
  contact_phone: string | null
  billing_cycle: string
  renewal_note: string | null
  monthly_cost: number
}

export interface Credential {
  id: string
  vendor_id: string
  label: string
  value: string
  is_password: boolean
  mask_length: number | null
  created_at: string
}

export interface CredentialInsert {
  label: string
  value: string
  is_password: boolean
  mask_length: number | null
}

export interface VendorWithCredentials extends Vendor {
  credentials: Credential[]
}

export interface Contract {
  id: string
  vendor_id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  value: number
  billing_frequency: string
  status: 'active' | 'expiring' | 'expired' | 'pending' | 'cancelled'
  auto_renew: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ContractInsert {
  vendor_id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  value: number
  billing_frequency: string
  status: 'active' | 'expiring' | 'expired' | 'pending' | 'cancelled'
  auto_renew: boolean
  notes: string | null
}

export interface ContractWithVendor extends Contract {
  vendor_name: string
}

export interface ActivityLog {
  id: string
  vendor_id: string | null
  action: string
  details: string | null
  created_at: string
}
