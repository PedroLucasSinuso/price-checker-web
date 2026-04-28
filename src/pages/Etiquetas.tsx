import { useState, useRef } from 'react'
import { buscarProduto } from '../api/produtos'
import AdminHeader from '../components/AdminHeader'
import LeitorCodigo from '../components/LeitorCodigo'

interface ItemEtiqueta {
  codigo: string
  nome: string
}

function gerarCSV(itens: ItemEtiqueta[]): string {
  const linhas = itens.map(i => `${i.codigo};chamada;1`)
  return linhas.join('\n')
}

function baixarCSV(conteudo: string) {
  const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `etiquetas_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function Etiquetas() {
  const [itens, setItens] = useState<ItemEtiqueta[]>([])
  const [erro, setErro] = useState('')
  const [camera, setCamera] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleCodigo(codigo: string) {
    setErro('')
    const codigoLimpo = codigo.trim()
    if (!codigoLimpo) return

    if (itens.some(i => i.codigo === codigoLimpo)) {
      setErro(`Produto ${codigoLimpo} já está na lista.`)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    try {
      const produto = await buscarProduto(codigoLimpo)
      setItens(prev => [...prev, { codigo: produto.codigo_chamada, nome: produto.nome }])
      if (inputRef.current) inputRef.current.value = ''
    } catch (e: any) {
      if (e.response?.status === 404) setErro('Produto não encontrado.')
      else if (e.response?.status === 400) setErro('Código inválido.')
      else setErro('Erro ao consultar.')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleCodigo((e.target as HTMLInputElement).value)
    }
  }

  function remover(codigo: string) {
    setItens(prev => prev.filter(i => i.codigo !== codigo))
  }

  function handleExportar() {
    if (itens.length === 0) return
    baixarCSV(gerarCSV(itens))
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-10">
      {camera && (
        <LeitorCodigo
          onLeitura={(codigo) => { setCamera(false); handleCodigo(codigo) }}
          onFechar={() => setCamera(false)}
        />
      )}

      <AdminHeader titulo="Etiquetas" />

      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Bipar produtos</h2>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite ou bipe o código"
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button
              onClick={() => setCamera(true)}
              className="md:hidden bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg transition"
            >
              📷
            </button>
          </div>
          {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
        </div>

        {/* Lista */}
        {itens.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-gray-700">
                Lista <span className="text-gray-400 font-normal text-sm">({itens.length} produtos)</span>
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
                  <button
                    onClick={() => remover(item.codigo)}
                    className="text-gray-300 hover:text-red-500 transition text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}