import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { buscarProduto } from '../api/produtos'
import AdminHeader from '../components/AdminHeader'
import LeitorCodigo from '../components/LeitorCodigo'
import { useAuth } from '../hooks/useAuth'
import { gerarCSV, baixarCSV, type CsvRow } from '../utils/csv'

interface ItemInventario {
  codigo: string
  nome: string
  quantidade: number
}

export default function Inventario() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [itens, setItens] = useState<ItemInventario[]>([])
  const [erro, setErro] = useState('')
  const [camera, setCamera] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleCodigo(codigo: string) {
    setErro('')
    const codigoLimpo = codigo.trim()
    if (!codigoLimpo) return

    const existente = itens.find(i => i.codigo === codigoLimpo)
    if (existente) {
      setItens(prev => prev.map(i =>
        i.codigo === codigoLimpo ? { ...i, quantidade: i.quantidade + 1 } : i
      ))
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    try {
      const produto = await buscarProduto(codigoLimpo)
      setItens(prev => [...prev, { codigo: produto.codigo_chamada, nome: produto.nome, quantidade: 1 }])
      if (inputRef.current) inputRef.current.value = ''
    } catch (e: unknown) {
      const error = e as { response?: { status?: number } }
      if (error.response?.status === 404) setErro('Produto não encontrado.')
      else if (error.response?.status === 400) setErro('Código inválido.')
      else setErro('Erro ao consultar.')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleCodigo((e.target as HTMLInputElement).value)
    }
  }

  function ajustarQuantidade(codigo: string, delta: number) {
    setItens(prev => prev
      .map(i => i.codigo === codigo ? { ...i, quantidade: i.quantidade + delta } : i)
      .filter(i => i.quantidade > 0)
    )
  }

  function handleExportar() {
    if (itens.length === 0) return
    const rows: CsvRow[] = itens.map(i => ({ codigo: i.codigo, tipo: 'chamada', quantidade: i.quantidade }))
    baixarCSV(gerarCSV(rows), 'inventario')
  }

  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-10">
      {camera && (
        <LeitorCodigo
          onLeitura={(codigo) => { setCamera(false); handleCodigo(codigo) }}
          onFechar={() => setCamera(false)}
        />
      )}

      <AdminHeader titulo="Inventário" paginaAtual="inventario" onLogout={() => { logout(); navigate('/login') }} />

      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Bipar produtos</h2>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              aria-label="Código do produto"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite ou bipe o código"
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button
              onClick={() => setCamera(true)}
              className="md:hidden bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg transition"
              aria-label="Ler código de barras"
            >
              📷
            </button>
          </div>
          {erro && <p className="text-red-500 text-sm mt-2" role="alert">{erro}</p>}
        </div>

        {/* Lista */}
        {itens.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gray-700">
                Contagem
                <span className="text-gray-400 font-normal text-sm ml-2">
                  ({itens.length} produtos · {totalItens} unidades)
                </span>
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setItens([])}
                  className="text-sm text-gray-400 hover:text-red-500 transition"
                >
                  Limpar
                </button>
                <button
                  onClick={handleExportar}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition"
                >
                  Exportar CSV
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {itens.map(item => (
                <div key={item.codigo} className="flex justify-between items-center border rounded-lg px-4 py-2">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">{item.codigo}</span>
                    <span className="text-sm text-gray-400 ml-3">{item.nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => ajustarQuantidade(item.codigo, -1)}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition"
                      aria-label={`Diminuir quantidade de ${item.nome}`}
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold text-gray-700 w-6 text-center">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => ajustarQuantidade(item.codigo, 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition"
                      aria-label={`Aumentar quantidade de ${item.nome}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
