import Login from './pages/Login'
import Busca from './pages/Busca'
import Admin from './pages/Admin'
import Etiquetas from './pages/Etiquetas'
import Inventario from './pages/Inventario'

function isAuthenticated() {
  return !!localStorage.getItem('token')
}

function App() {
  const path = window.location.pathname
  const role = localStorage.getItem('role')
  const isAdmin = role === 'admin'

  if (!isAuthenticated() || path === '/login') {
    return <Login />
  }

  if (isAdmin && path === '/admin') return <Admin />
  if (isAdmin && path === '/etiquetas') return <Etiquetas />
  if (isAdmin && path === '/inventario') return <Inventario />

  return <Busca />
}

export default App