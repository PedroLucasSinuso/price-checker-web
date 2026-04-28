import { logout } from '../api/auth'

interface Props {
  titulo: string
}

export default function AdminHeader({ titulo }: Props) {
  const navegar = (path: string) => window.location.href = path

  return (
    <div className="w-full max-w-2xl flex justify-between items-center mb-8">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-gray-800">{titulo}</h1>
        <nav className="flex gap-4 text-sm">
          <button
            onClick={() => navegar('/admin')}
            className="text-gray-500 hover:text-blue-600 transition"
          >
            Sync
          </button>
          <button
            onClick={() => navegar('/etiquetas')}
            className="text-gray-500 hover:text-blue-600 transition"
          >
            Etiquetas
          </button>
          <button
            onClick={() => navegar('/inventario')}
            className="text-gray-500 hover:text-blue-600 transition"
          >
            Inventário
          </button>
          <button
            onClick={() => navegar('/')}
            className="text-gray-500 hover:text-blue-600 transition"
          >
            Busca
          </button>
        </nav>
      </div>
      <button
        onClick={logout}
        className="text-sm text-gray-500 hover:text-red-500 transition"
      >
        Sair
      </button>
    </div>
  )
}