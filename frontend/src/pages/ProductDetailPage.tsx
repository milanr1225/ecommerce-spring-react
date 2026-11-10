import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct } from '../api/catalog'
import { ApiError } from '../api/client'
import { formatPrice } from '../utils/format'

export default function ProductDetailPage() {
  const { slug = '' } = useParams()

  const { data: product, isPending, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug),
    retry: false,
  })

  if (isPending) return <p>Loading...</p>

  if (error) {
    const notFound = error instanceof ApiError && error.status === 404
    return (
      <div>
        <p role="alert">{notFound ? 'Product not found.' : 'Could not load the product.'}</p>
        <Link to="/">Back to products</Link>
      </div>
    )
  }

  return (
    <div className="detail">
      <Link to="/">← Back to products</Link>
      <div className="detail-layout">
        {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
        <div>
          <span className="muted">{product.category.name}</span>
          <h1>{product.name}</h1>
          <p className="price">{formatPrice(product.price)}</p>
          <p>{product.description}</p>
          <p>
            {product.stockQuantity > 0
              ? `In stock (${product.stockQuantity} available)`
              : 'Out of stock'}
          </p>
        </div>
      </div>
    </div>
  )
}