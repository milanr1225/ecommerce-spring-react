import { Link } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useCart } from '../cart/useCart'
import { formatPrice } from '../utils/format'

export default function CartPage() {
  const { cart, isLoading, isError, update, remove } = useCart()

  if (isLoading) return <p>Loading...</p>
  if (isError || !cart) return <p role="alert">Could not load the cart.</p>

  const busy = update.isPending || remove.isPending
  const mutationError = update.error ?? remove.error
  const errorMessage =
    mutationError instanceof ApiError ? mutationError.message : mutationError ? 'Something went wrong' : null

  return (
    <div>
      <h1>Your cart</h1>

      {cart.items.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/">Browse products</Link>
        </p>
      ) : (
        <>
          {errorMessage && <p role="alert">{errorMessage}</p>}

          <ul className="cart-list">
            {cart.items.map((item) => (
              <li key={item.productId} className="cart-item">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}

                <div className="cart-item-info">
                  <Link to={`/products/${item.slug}`}>{item.name}</Link>
                  <span className="muted">{formatPrice(item.unitPrice)} each</span>
                  {item.quantity > item.stockQuantity && (
                    <span className="warning">Only {item.stockQuantity} left in stock</span>
                  )}
                </div>

                <div className="quantity">
                  <button
                    disabled={busy || item.quantity <= 1}
                    onClick={() => update.mutate({ productId: item.productId, quantity: item.quantity - 1 })}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    disabled={busy || item.quantity >= item.stockQuantity}
                    onClick={() => update.mutate({ productId: item.productId, quantity: item.quantity + 1 })}
                  >
                    +
                  </button>
                </div>

                <strong>{formatPrice(item.lineTotal)}</strong>

                <button disabled={busy} onClick={() => remove.mutate(item.productId)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <p>
              Subtotal ({cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'}):{' '}
              <strong>{formatPrice(cart.subtotal)}</strong>
            </p>
            <button disabled title="Coming in the next phase">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}