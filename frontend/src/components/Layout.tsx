import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">
          Shop
        </Link>
        <nav>
          {user ? (
            <>
              <Link to="/profile">{user.firstName}</Link>
              <button onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  )
}