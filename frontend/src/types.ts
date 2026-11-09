export type Role = 'USER' | 'ADMIN'

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: Role
}

export interface AuthResponse {
  token: string
  user: User
}

export interface RegisterData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}