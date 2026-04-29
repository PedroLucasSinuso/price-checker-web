import { logout } from '../api/auth'

interface Props {
  titulo: string
  paginaAtual: 'sync' | 'etiquetas' | 'inventario' | 'busca'
}

export default function AdminHeader({ titulo, paginaAtual }: Props) {
  const navegar = (path: string) => window.location.href = path

  const linkClass = (pagina: string) =>
    `text-sm transition ${paginaAtual === pagina
      ? 'text-blue-600 font-semibold'
      : 'text-gray-500 hover:text-blue-600'
    }`

  return (
    <div className="w-full max-w-2xl mb-8">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold text-gray-800">{titulo}</h1>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-red-500 transition"
        >
          Sair
        </button>
      </div>
      <nav className="flex gap-6 border-b pb-3">
        <button onClick={() => navegar('/admin')} className={linkClass('sync')}>
          Sync
        </button>
        <button onClick={() => navegar('/etiquetas')} className={linkClass('etiquetas')}>
          Etiquetas
        </button>
        <button onClick={() => navegar('/inventario')} className={linkClass('inventario')}>
          Inventário
        </button>
        <button onClick={() => navegar('/')} className={linkClass('busca')}>
          Busca
        </button>
      </nav>
    </div>
  )
}