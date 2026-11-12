import { apiFetch } from './client'
import type { Cart } from '../types'

export function fetchCart() {
  return apiFetch<Cart>('/api/cart')
}

export function addToCart(productId: number, quantity = 1) {
  return apiFetch<Cart>('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  })
}

export function updateCartItem(productId: number, quantity: number) {
  return apiFetch<Cart>(`/api/cart/items/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  })
}

export function removeCartItem(productId: number) {
  return apiFetch<Cart>(`/api/cart/items/${productId}`, { method: 'DELETE' })
}