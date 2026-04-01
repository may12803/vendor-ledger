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
