import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchProduct } from '../api/catalog'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/useAuth'
import { useCart } from '../cart/useCart'
import { formatPrice } from '../utils/format'

export default function ProductDetailPage() {
  const { slug = '' } = useParams()
  const { user } = useAuth()
  const { add } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

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

  const outOfStock = product.stockQuantity === 0

  const handleAdd = () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    add.mutate(product.id)
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
          <p>{outOfStock ? 'Out of stock' : `In stock (${product.stockQuantity} available)`}</p>

          <button onClick={handleAdd} disabled={outOfStock || add.isPending}>
            {add.isPending ? 'Adding...' : 'Add to cart'}
          </button>

          {add.isError && (
            <p role="alert">
              {add.error instanceof ApiError ? add.error.message : 'Could not add to cart'}
            </p>
          )}
          {add.isSuccess && (
            <p>
              Added to cart. <Link to="/cart">View cart</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}