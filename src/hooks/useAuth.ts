import { useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import { login as apiLogin } from '../api/auth'
import type { JwtPayload, Role } from '../types'

function getToken(): string | null {
  return localStorage.getItem('token')
}

function parseJwtPayload(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token)
  } catch {
    return null
  }
}

function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token)
  if (!payload) return true

  const exp = (payload as JwtPayload & { exp?: number }).exp
  if (!exp) return false

  const now = Date.now() / 1000
  return exp < now
}

export function useAuth() {
  const isAuthenticated = useCallback((): boolean => {
    const token = getToken()
    if (!token) return false
    if (isTokenExpired(token)) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      return false
    }
    return true
  }, [])

  const getRole = useCallback((): Role | null => {
    const token = getToken()
    if (!token || isTokenExpired(token)) return null

    const payload = parseJwtPayload(token)
    return payload?.role ?? (localStorage.getItem('role') as Role | null)
  }, [])

  const getUsername = useCallback((): string | null => {
    const token = getToken()
    if (!token) return null
    const payload = parseJwtPayload(token)
    return payload?.sub ?? null
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const data = await apiLogin(username, password)
    const decoded = jwtDecode<JwtPayload>(data.access_token)
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('role', decoded.role)
    return decoded.role as Role
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }, [])

  const checkAuth = useCallback(() => {
    const valid = isAuthenticated()
    return valid
  }, [isAuthenticated])

  return { isAuthenticated, getRole, getUsername, login, logout, checkAuth }
}
