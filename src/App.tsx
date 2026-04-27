import Login from './pages/Login'

function isAuthenticated() {
  return !!localStorage.getItem('token')
}

function App() {
  const path = window.location.pathname

  if (!isAuthenticated() || path === '/login') {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-800">Em construção...</h1>
    </div>
  )
}

export default App