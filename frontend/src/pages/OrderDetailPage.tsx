import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { cancelOrder, fetchOrder } from '../api/orders'
import { useAuth } from '../auth/useAuth'
import OrderStatusBadge from '../components/OrderStatusBadge'
import { formatDate, formatPrice } from '../utils/format'

export default function OrderDetailPage() {
  const { id: idParam } = useParams()
  const id = Number(idParam)
  const validId = Number.isInteger(id)
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const queryKey = ['orders', user?.id, 'detail', id]

  const { data: order, isPending, error } = useQuery({
    queryKey,
    queryFn: () => fetchOrder(id),
    enabled: validId,
    retry: false,
  })

  const cancel = useMutation({
    mutationFn: () => cancelOrder(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKey, updated)
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
    },
  })

  if (!validId || (error instanceof ApiError && error.status === 404)) {
    return (
      <div>
        <p role="alert">Order not found.</p>
        <Link to="/orders">Back to orders</Link>
      </div>
    )
  }
  if (isPending) return <p>Loading...</p>
  if (error) return <p role="alert">Could not load the order.</p>

  function handleCancel() {
    if (window.confirm('Cancel this order?')) {
      cancel.mutate()
    }
  }

  return (
    <div>
      <Link to="/orders">← Back to orders</Link>
      <h1>Order #{order.id}</h1>
      <p>
        <OrderStatusBadge status={order.status} />{' '}
        <span className="muted">Placed on {formatDate(order.createdAt)}</span>
      </p>

      <h2>Items</h2>
      <ul className="order-items">
        {order.items.map((item) => (
          <li key={item.productId}>
            <span>
              {item.quantity} × {item.name} ({formatPrice(item.unitPrice)})
            </span>
            <span>{formatPrice(item.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <p>
        Total: <strong>{formatPrice(order.total)}</strong>
      </p>

      <h2>Shipping address</h2>
      <p>
        {order.fullName}
        <br />
        {order.address}
        <br />
        {order.postalCode} {order.city}
        <br />
        {order.country}
      </p>

      {order.status === 'PENDING_PAYMENT' && (
        <div className="actions">
          <button disabled title="Coming in the next phase">
            Pay now
          </button>
          <button onClick={handleCancel} disabled={cancel.isPending}>
            {cancel.isPending ? 'Cancelling...' : 'Cancel order'}
          </button>
        </div>
      )}

      {cancel.isError && (
        <p role="alert">
          {cancel.error instanceof ApiError ? cancel.error.message : 'Could not cancel the order'}
        </p>
      )}
    </div>
  )
}