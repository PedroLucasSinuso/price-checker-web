import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Busca from './pages/Busca'
import Admin from './pages/Admin'
import Etiquetas from './pages/Etiquetas'
import Inventario from './pages/Inventario'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Busca /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
        <Route path="/admin/etiquetas" element={<ProtectedRoute allowedRoles={['admin']}><Etiquetas /></ProtectedRoute>} />
        <Route path="/admin/inventario" element={<ProtectedRoute allowedRoles={['admin']}><Inventario /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
