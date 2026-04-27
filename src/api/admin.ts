import api from './client'

export async function triggerSync() {
  const response = await api.post('/admin/sync')
  return response.data
}

export async function getSyncStatus(jobId: number) {
  const response = await api.get(`/admin/sync/${jobId}`)
  return response.data
}

export async function getSyncHistory(limit = 10) {
  const response = await api.get('/admin/sync', { params: { limit } })
  return response.data
}