export interface SyncJob {
  job_id: number
  started_at: string
  finished_at: string | null
  status: 'sucesso' | 'em_progresso' | 'erro'
  produtos_count: number | null
  codigos_count: number | null
  error_message: string | null
}

export interface SyncHistory {
  jobs: SyncJob[]
  total: number
}
