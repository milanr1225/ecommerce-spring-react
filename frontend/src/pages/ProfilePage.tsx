import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div>
      <h1>My profile</h1>
      <p>
        {user.firstName} {user.lastName} (@{user.username})
      </p>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
      <Link to="/">Back</Link>
    </div>
  )
}