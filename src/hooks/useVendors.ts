import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Vendor, Credential, VendorWithCredentials, VendorInsert, CredentialInsert } from '../types/database'

export function useVendors() {
  const [vendors, setVendors] = useState<VendorWithCredentials[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVendors = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data: vendorRows, error: vendorErr } = await supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: true })

    if (vendorErr) {
      setError(vendorErr.message)
      setLoading(false)
      return
    }

    const { data: credRows, error: credErr } = await supabase
      .from('credentials')
      .select('*')
      .order('created_at', { ascending: true })

    if (credErr) {
      setError(credErr.message)
      setLoading(false)
      return
    }

    const vRows = vendorRows as Vendor[]
    const cRows = credRows as Credential[]

    const combined: VendorWithCredentials[] = vRows.map((v) => ({
      ...v,
      credentials: cRows.filter((c) => c.vendor_id === v.id),
    }))

    setVendors(combined)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchVendors()
  }, [fetchVendors])

  const addVendor = async (vendor: VendorInsert, credentials: CredentialInsert[]) => {
    const { data, error: insertErr } = await supabase
      .from('vendors')
      .insert(vendor)
      .select()
      .single()

    if (insertErr || !data) throw new Error(insertErr?.message ?? 'Failed to create vendor')

    const newVendor = data as Vendor

    if (credentials.length > 0) {
      const creds = credentials.map((c) => ({ ...c, vendor_id: newVendor.id }))
      const { error: credErr } = await supabase.from('credentials').insert(creds)
      if (credErr) throw new Error(credErr.message)
    }

    await fetchVendors()
    return newVendor
  }

  const updateVendor = async (id: string, vendor: Partial<VendorInsert>, credentials: CredentialInsert[]) => {
    const { error: updateErr } = await supabase
      .from('vendors')
      .update(vendor)
      .eq('id', id)

    if (updateErr) throw new Error(updateErr.message)

    await supabase.from('credentials').delete().eq('vendor_id', id)
    if (credentials.length > 0) {
      const creds = credentials.map((c) => ({ ...c, vendor_id: id }))
      const { error: credErr } = await supabase.from('credentials').insert(creds)
      if (credErr) throw new Error(credErr.message)
    }

    await fetchVendors()
  }

  const deleteVendor = async (id: string) => {
    const { error: delErr } = await supabase.from('vendors').delete().eq('id', id)
    if (delErr) throw new Error(delErr.message)
    await fetchVendors()
  }

  const totalMonthlyCost = vendors.reduce((sum, v) => sum + Number(v.monthly_cost), 0)

  return { vendors, loading, error, addVendor, updateVendor, deleteVendor, totalMonthlyCost, refetch: fetchVendors }
}
