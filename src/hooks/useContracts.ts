import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Contract, ContractInsert, ContractWithVendor, Vendor } from '../types/database'

export function useContracts() {
  const [contracts, setContracts] = useState<ContractWithVendor[]>([])
  const [loading, setLoading] = useState(true)

  const fetchContracts = useCallback(async () => {
    setLoading(true)
    const { data: contractRows } = await supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: vendorRows } = await supabase
      .from('vendors')
      .select('id, name')

    const vendors = (vendorRows ?? []) as Pick<Vendor, 'id' | 'name'>[]
    const vendorMap = new Map(vendors.map((v) => [v.id, v.name]))

    const combined: ContractWithVendor[] = ((contractRows ?? []) as Contract[]).map((c) => ({
      ...c,
      vendor_name: vendorMap.get(c.vendor_id) ?? 'Unknown',
    }))

    setContracts(combined)
    setLoading(false)
  }, [])

  useEffect(() => { fetchContracts() }, [fetchContracts])

  const addContract = async (contract: ContractInsert) => {
    const { error } = await supabase.from('contracts').insert(contract)
    if (error) throw new Error(error.message)
    await fetchContracts()
  }

  const updateContract = async (id: string, contract: Partial<ContractInsert>) => {
    const { error } = await supabase.from('contracts').update(contract).eq('id', id)
    if (error) throw new Error(error.message)
    await fetchContracts()
  }

  const deleteContract = async (id: string) => {
    const { error } = await supabase.from('contracts').delete().eq('id', id)
    if (error) throw new Error(error.message)
    await fetchContracts()
  }

  const totalValue = contracts.reduce((sum, c) => sum + Number(c.value), 0)
  const activeCount = contracts.filter((c) => c.status === 'active').length
  const expiringCount = contracts.filter((c) => c.status === 'expiring').length

  return { contracts, loading, addContract, updateContract, deleteContract, totalValue, activeCount, expiringCount, refetch: fetchContracts }
}
