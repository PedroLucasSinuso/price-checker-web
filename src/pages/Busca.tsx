import { useState } from 'react'
import { buscarProduto } from '../api/produtos'
import type { ProdutoBasico, ProdutoCompleto } from '../types'
import { logout } from '../api/auth'
import LeitorCodigo from '../components/LeitorCodigo'
import { formatCurrency } from '../utils/formatters'

function isCompleto(p: ProdutoBasico | ProdutoCompleto): p is ProdutoCompleto {
  return 'preco_custo' in p
}

export default function Busca() {
  const [codigo, setCodigo] = useState('')
  const [produto, setProduto] = useState<ProdutoBasico | ProdutoCompleto | null>(null)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [cameras, setCameras] = useState(false)

  const role = localStorage.getItem('role')

  async function handleBuscar(codigoParam?: string) {
    const valor = (codigoParam ?? codigo).trim()
    if (!valor) return
    setErro('')
    setProduto(null)
    setLoading(true)
    try {
      const data = await buscarProduto(valor)
      setProduto(data)
    } catch (e: any) {
      if (e.response?.status === 404) setErro('Produto não encontrado.')
      else if (e.response?.status === 400) setErro('Código inválido.')
      else setErro('Erro ao consultar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleLeitura(codigoLido: string) {
    setCameras(false)
    setCodigo(codigoLido)
    handleBuscar(codigoLido)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-10">

      {cameras && (
        <LeitorCodigo
          onLeitura={handleLeitura}
          onFechar={() => setCameras(false)}
        />
      )}

      {/* Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">Price Checker</h1>
          {role === 'admin' && (
            <button
              onClick={() => window.location.href = '/admin'}
              className="text-sm text-gray-500 hover:text-blue-600 transition"
            >
              ← Painel Admin
            </button>
          )}
        </div>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-red-500 transition"
        >
          Sair
        </button>
      </div>

      {/* Input de busca */}
      <div className="w-full max-w-md flex gap-2 mb-6">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite o código EAN ou PLU"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
          autoFocus
        />
        <button
          onClick={() => setCameras(true)}
          className="md:hidden bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg transition"
          title="Ler código de barras"
        >
          📷
        </button>
        <button
          onClick={() => handleBuscar()}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? '...' : 'Buscar'}
        </button>
      </div>

      {erro && (
        <p className="text-red-500 text-sm mb-4">{erro}</p>
      )}

      {produto && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Produto</p>
            <p className="text-lg font-bold text-gray-800">{produto.nome}</p>
          </div>

          <div className="flex gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Grupo</p>
              <p className="text-sm text-gray-700">{produto.grupo}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Família</p>
              <p className="text-sm text-gray-700">{produto.familia}</p>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Preço de Venda</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(produto.preco_venda)}
            </p>
          </div>

          <div className="border-t pt-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Estoque</p>
            <p className="text-sm font-semibold text-gray-700">{produto.estoque} un.</p>
          </div>

          {isCompleto(produto) && (
            <>
              <div className="flex gap-4 border-t pt-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Preço de Custo</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {formatCurrency(produto.preco_custo)}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Markup</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {(produto.markup * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Margem</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {(produto.margem * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}