import { createContext } from 'react'
import type { RegisterData, User } from '../types'

export interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)