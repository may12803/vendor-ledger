import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { ActivityLog } from '../types/database'

export function useActivity() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    setLogs((data ?? []) as ActivityLog[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  return { logs, loading, refetch: fetchLogs }
}
