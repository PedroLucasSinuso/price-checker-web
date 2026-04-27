import { useState, useEffect, useRef } from 'react'
import { triggerSync, getSyncStatus, getSyncHistory } from '../api/admin'
import { logout } from '../api/auth'

interface SyncJob {
  job_id: number
  started_at: string
  finished_at: string | null
  status: 'sucesso' | 'em_progresso' | 'erro'
  produtos_count: number | null
  codigos_count: number | null
  error_message: string | null
}

interface SyncHistory {
  jobs: SyncJob[]
  total: number
}

function StatusBadge({ status }: { status: SyncJob['status'] }) {
  const styles = {
    sucesso: 'bg-green-100 text-green-700',
    em_progresso: 'bg-yellow-100 text-yellow-700',
    erro: 'bg-red-100 text-red-700',
  }
  const labels = {
    sucesso: 'Sucesso',
    em_progresso: 'Em progresso',
    erro: 'Erro',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR')
}

export default function Admin() {
  const [history, setHistory] = useState<SyncHistory | null>(null)
  const [activeJob, setActiveJob] = useState<SyncJob | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function carregarHistorico() {
    try {
      const data = await getSyncHistory()
      setHistory(data)
    } catch {
      setErro('Erro ao carregar histórico.')
    }
  }

  useEffect(() => {
    carregarHistorico()
  }, [])

  function pararPolling() {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }

  async function handleSync() {
    setErro('')
    setLoading(true)
    setActiveJob(null)
    try {
      const { job_id } = await triggerSync()

      pollingRef.current = setInterval(async () => {
        try {
          const status: SyncJob = await getSyncStatus(job_id)
          setActiveJob(status)
          if (status.status !== 'em_progresso') {
            pararPolling()
            setLoading(false)
            carregarHistorico()
          }
        } catch {
          pararPolling()
          setLoading(false)
          setErro('Erro ao verificar status do sync.')
        }
      }, 2000)

    } catch {
      setLoading(false)
      setErro('Erro ao iniciar sync.')
    }
  }

  useEffect(() => () => pararPolling(), [])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-10">

      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Price Checker — Admin</h1>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-red-500 transition"
        >
          Sair
        </button>
      </div>

      {/* Trigger sync */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Sincronização ETL</h2>

        <button
          onClick={handleSync}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Sincronizando...' : 'Iniciar Sync'}
        </button>

        {erro && <p className="text-red-500 text-sm mt-3">{erro}</p>}

        {/* Status do job ativo */}
        {activeJob && (
          <div className="mt-4 border-t pt-4 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Status:</span>
              <StatusBadge status={activeJob.status} />
            </div>
            {activeJob.produtos_count != null && (
              <p className="text-sm text-gray-600">
                Produtos: <span className="font-semibold">{activeJob.produtos_count}</span>
                {' · '}
                Códigos: <span className="font-semibold">{activeJob.codigos_count}</span>
              </p>
            )}
            {activeJob.finished_at && (
              <p className="text-sm text-gray-600">
                Finalizado em: <span className="font-semibold">{formatDate(activeJob.finished_at)}</span>
              </p>
            )}
            {activeJob.error_message && (
              <p className="text-sm text-red-500">{activeJob.error_message}</p>
            )}
          </div>
        )}
      </div>

      {/* Histórico */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          Histórico de Sincronizações
          {history && <span className="text-gray-400 font-normal text-sm ml-2">({history.total} total)</span>}
        </h2>

        {!history && <p className="text-sm text-gray-400">Carregando...</p>}

        {history && history.jobs.length === 0 && (
          <p className="text-sm text-gray-400">Nenhuma sincronização registrada.</p>
        )}

        {history && history.jobs.length > 0 && (
          <div className="flex flex-col gap-3">
            {history.jobs.map((job) => (
              <div key={job.job_id} className="border rounded-lg p-4 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Job #{job.job_id}</span>
                  <StatusBadge status={job.status} />
                </div>
                <p className="text-xs text-gray-400">
                  Iniciado: {formatDate(job.started_at)}
                  {job.finished_at && ` · Finalizado: ${formatDate(job.finished_at)}`}
                </p>
                {job.produtos_count != null && (
                  <p className="text-xs text-gray-600">
                    {job.produtos_count} produtos · {job.codigos_count} códigos
                  </p>
                )}
                {job.error_message && (
                  <p className="text-xs text-red-500">{job.error_message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}