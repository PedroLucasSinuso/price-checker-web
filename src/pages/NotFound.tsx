import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-6">Página não encontrada</p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
