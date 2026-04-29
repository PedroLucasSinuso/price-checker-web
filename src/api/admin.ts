import api from './client'
import type { SyncJob, SyncHistory } from '../types'

export async function triggerSync(): Promise<{ job_id: number }> {
  const response = await api.post('/admin/sync')
  return response.data
}

export async function getSyncStatus(jobId: number, signal?: AbortSignal): Promise<SyncJob> {
  const response = await api.get(`/admin/sync/${jobId}`, { signal })
  return response.data
}

export async function getSyncHistory(limit = 10): Promise<SyncHistory> {
  const response = await api.get('/admin/sync', { params: { limit } })
  return response.data
}
