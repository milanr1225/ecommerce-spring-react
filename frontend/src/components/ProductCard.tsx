import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { formatPrice } from '../utils/format'

export default function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stockQuantity === 0

  return (
    <Link to={`/products/${product.slug}`} className="card">
      {product.imageUrl && <img src={product.imageUrl} alt={product.name} loading="lazy" />}
      <div className="card-body">
        <span className="muted">{product.category.name}</span>
        <h3>{product.name}</h3>
        <div className="card-footer">
          <strong>{formatPrice(product.price)}</strong>
          {outOfStock && <span className="badge">Out of stock</span>}
        </div>
      </div>
    </Link>
  )
}