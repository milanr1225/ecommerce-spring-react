import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { checkout } from '../api/orders'
import { useCart } from '../cart/useCart'
import type { CheckoutData } from '../types'
import { formatPrice } from '../utils/format'

const fields: { name: keyof CheckoutData; label: string }[] = [
  { name: 'fullName', label: 'Full name' },
  { name: 'address', label: 'Address' },
  { name: 'city', label: 'City' },
  { name: 'postalCode', label: 'Postal code' },
  { name: 'country', label: 'Country' },
]

export default function CheckoutPage() {
  const { cart, isLoading } = useCart()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form, setForm] = useState<CheckoutData>({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  })

  const mutation = useMutation({
    mutationFn: checkout,
    onSuccess: (order) => {
      // korpa je ispraznjena, a zalihe i istorija porudzbina su se promenili
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
      navigate(`/orders/${order.id}`, { replace: true })
    },
    onError: () => {
      // npr. 409 zbog zalihe: osvezi korpu da se vidi stvarno stanje
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const apiError = mutation.error instanceof ApiError ? mutation.error : null
  const fieldErrors = apiError?.fieldErrors ?? {}
  const message = mutation.error ? (apiError?.message ?? 'Could not reach the server') : null

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    mutation.mutate(form)
  }

  if (isLoading) return <p>Loading...</p>

  if (!cart || (cart.items.length === 0 && !mutation.isSuccess)) {
    return (
      <p>
        Your cart is empty. <Link to="/">Browse products</Link>
      </p>
    )
  }

  return (
    <div>
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form onSubmit={handleSubmit}>
          <h2>Shipping address</h2>
          {fields.map((f) => (
            <div key={f.name}>
              <label>
                {f.label}
                <input
                  value={form[f.name]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.name]: e.target.value }))}
                />
              </label>
              {fieldErrors[f.name] && <p role="alert">{fieldErrors[f.name]}</p>}
            </div>
          ))}
          {message && <p role="alert">{message}</p>}
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Placing order...' : 'Place order'}
          </button>
        </form>

        <aside className="order-summary">
          <h2>Order summary</h2>
          <ul>
            {cart.items.map((item) => (
              <li key={item.productId}>
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span>{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <p>
            Total: <strong>{formatPrice(cart.subtotal)}</strong>
          </p>
          <Link to="/cart">Edit cart</Link>
        </aside>
      </div>
    </div>
  )
}