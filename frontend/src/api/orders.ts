import { apiFetch } from './client'
import type { CheckoutData, Order } from '../types'

export function checkout(data: CheckoutData) {
  return apiFetch<Order>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function fetchOrders() {
  return apiFetch<Order[]>('/api/orders')
}

export function fetchOrder(id: number) {
  return apiFetch<Order>(`/api/orders/${id}`)
}

export function cancelOrder(id: number) {
  return apiFetch<Order>(`/api/orders/${id}/cancel`, { method: 'POST' })
}