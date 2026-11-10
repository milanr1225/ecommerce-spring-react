import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCategories, fetchProducts } from '../api/catalog'
import Pagination from '../components/Pagination'
import ProductCard from '../components/ProductCard'

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? ''
  const sort = searchParams.get('sort') ?? ''
  const page = Math.max(0, Number(searchParams.get('page')) || 0)

  const [search, setSearch] = useState(q)

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const products = useQuery({
    queryKey: ['products', { q, category, sort, page }],
    queryFn: () => fetchProducts({ q, category, sort, page }),
    placeholderData: keepPreviousData,
  })

  // menja jedan ili vise parametara u URL-u; promena filtera vraca na prvu stranicu
  function updateParams(changes: Record<string, string>) {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    if (!('page' in changes)) next.delete('page')
    setSearchParams(next)
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    updateParams({ q: search.trim() })
  }

  return (
    <div>
      <h1>Products</h1>

      <form className="filters" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>

        <select value={category} onChange={(e) => updateParams({ category: e.target.value })}>
          <option value="">All categories</option>
          {categories.data?.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <select value={sort} onChange={(e) => updateParams({ sort: e.target.value })}>
          <option value="">Newest</option>
          <option value="price,asc">Price: low to high</option>
          <option value="price,desc">Price: high to low</option>
          <option value="name,asc">Name: A to Z</option>
        </select>
      </form>

      {products.isPending && <p>Loading...</p>}
      {products.isError && <p role="alert">Could not load products.</p>}

      {products.data && (
        <>
          {products.data.content.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="grid">
              {products.data.content.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <Pagination
            page={products.data.page}
            totalPages={products.data.totalPages}
            onChange={(p) => updateParams({ page: p > 0 ? String(p) : '' })}
          />
        </>
      )}
    </div>
  )
}