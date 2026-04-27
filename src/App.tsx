import Login from './pages/Login'
import Busca from './pages/Busca'
import Admin from './pages/Admin'

function isAuthenticated() {
  return !!localStorage.getItem('token')
}

function App() {
  const path = window.location.pathname
  const role = localStorage.getItem('role')

  if (!isAuthenticated() || path === '/login') {
    return <Login />
  }

  if (role === 'admin' && path === '/admin') {
    return <Admin />
  }

  return <Busca />
}

export default App