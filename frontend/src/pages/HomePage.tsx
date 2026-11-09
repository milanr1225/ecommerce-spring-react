import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function HomePage() {
  const { user, logout } = useAuth()

  return (
    <div>
      <h1>Shop</h1>
      {user ? (
        <>
          <p>Hello, {user.firstName}!</p>
          <p>
            <Link to="/profile">My profile</Link>
          </p>
          <button onClick={logout}>Log out</button>
        </>
      ) : (
        <p>
          <Link to="/login">Log in</Link> or <Link to="/register">register</Link>
        </p>
      )}
    </div>
  )
}