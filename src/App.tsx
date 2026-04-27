import Login from './pages/Login'
import Busca from './pages/Busca'

function isAuthenticated() {
  return !!localStorage.getItem('token')
}

function App() {
  const path = window.location.pathname

  if (!isAuthenticated() || path === '/login') {
    return <Login />
  }

  return <Busca />
}

export default App