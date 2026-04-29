import { Navigate } from 'react-router-dom'
import type { Role } from '../types'

function isAuthenticated(): boolean {
  return !!localStorage.getItem('token')
}

function getRole(): Role | null {
  return localStorage.getItem('role') as Role | null
}

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Role[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles) {
    const role = getRole()
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}
