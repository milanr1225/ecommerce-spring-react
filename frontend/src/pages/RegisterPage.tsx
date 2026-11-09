import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/useAuth'
import type { RegisterData } from '../types'

const fields: { name: keyof RegisterData; label: string; type?: string }[] = [
  { name: 'firstName', label: 'First name' },
  { name: 'lastName', label: 'Last name' },
  { name: 'username', label: 'Username' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  function update(field: keyof RegisterData, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setSubmitting(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        setFieldErrors(err.fieldErrors)
      } else {
        setError('Could not reach the server')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {fields.map((f) => (
          <div key={f.name}>
            <label>
              {f.label}
              <input
                type={f.type ?? 'text'}
                value={form[f.name]}
                onChange={(e) => update(f.name, e.target.value)}
              />
            </label>
            {fieldErrors[f.name] && <p role="alert">{fieldErrors[f.name]}</p>}
          </div>
        ))}
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}