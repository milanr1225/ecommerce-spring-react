import { useEffect, useState, type ReactNode } from 'react'
import { apiFetch, tokenStorage } from '../api/client'
import type { AuthResponse, RegisterData, User } from '../types'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => tokenStorage.get() !== null)

  // pri učitavanju stranice proveri da li sačuvani token još važi
  useEffect(() => {
    if (!tokenStorage.get()) return
    apiFetch<User>('/api/auth/me')
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const res = await apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    tokenStorage.set(res.token)
    setUser(res.user)
  }

  async function register(data: RegisterData) {
    await apiFetch<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await login(data.email, data.password)
  }

  function logout() {
    tokenStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}