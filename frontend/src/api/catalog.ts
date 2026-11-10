import { apiFetch } from './client'
import type { Category, PageResponse, Product } from '../types'

export interface ProductQuery {
  q?: string
  category?: string
  sort?: string
  page?: number
}

export function fetchProducts({ q, category, sort, page = 0 }: ProductQuery) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (category) params.set('category', category)
  if (sort) params.set('sort', sort)
  params.set('page', String(page))
  params.set('size', '8')
  return apiFetch<PageResponse<Product>>(`/api/products?${params}`)
}

export function fetchProduct(slug: string) {
  return apiFetch<Product>(`/api/products/${encodeURIComponent(slug)}`)
}

export function fetchCategories() {
  return apiFetch<Category[]>('/api/categories')
}