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

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  stockQuantity: number
  imageUrl: string | null
  category: Category
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface CartItem {
  productId: number
  slug: string
  name: string
  imageUrl: string | null
  unitPrice: number
  quantity: number
  stockQuantity: number
  lineTotal: number
}

export interface Cart {
  items: CartItem[]
  totalQuantity: number
  subtotal: number
}

export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  productId: number
  name: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface Order {
  id: number
  status: OrderStatus
  total: number
  fullName: string
  address: string
  city: string
  postalCode: string
  country: string
  createdAt: string
  items: OrderItem[]
}

export interface CheckoutData {
  fullName: string
  address: string
  city: string
  postalCode: string
  country: string
}