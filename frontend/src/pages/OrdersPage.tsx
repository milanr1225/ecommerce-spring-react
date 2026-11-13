import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchOrders } from '../api/orders'
import { useAuth } from '../auth/useAuth'
import OrderStatusBadge from '../components/OrderStatusBadge'
import { formatDate, formatPrice } from '../utils/format'

export default function OrdersPage() {
  const { user } = useAuth()
  const { data: orders, isPending, isError } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: fetchOrders,
  })

  if (isPending) return <p>Loading...</p>
  if (isError) return <p role="alert">Could not load your orders.</p>

  return (
    <div>
      <h1>My orders</h1>

      {orders.length === 0 ? (
        <p>
          You have no orders yet. <Link to="/">Browse products</Link>
        </p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id}>
              <Link to={`/orders/${order.id}`} className="order-row">
                <strong>Order #{order.id}</strong>
                <span className="muted">{formatDate(order.createdAt)}</span>
                <OrderStatusBadge status={order.status} />
                <strong>{formatPrice(order.total)}</strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}