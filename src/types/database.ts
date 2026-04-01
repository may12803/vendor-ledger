export interface Database {
  public: {
    Tables: {
      vendors: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['vendors']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['vendors']['Insert']>
      }
      credentials: {
        Row: {
          id: string
          vendor_id: string
          label: string
          value: string
          is_password: boolean
          mask_length: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['credentials']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['credentials']['Insert']>
      }
    }
  }
}

export type Vendor = Database['public']['Tables']['vendors']['Row']
export type VendorInsert = Database['public']['Tables']['vendors']['Insert']
export type Credential = Database['public']['Tables']['credentials']['Row']
export type CredentialInsert = Database['public']['Tables']['credentials']['Insert']

export interface VendorWithCredentials extends Vendor {
  credentials: Credential[]
}
