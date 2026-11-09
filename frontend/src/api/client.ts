const TOKEN_KEY = 'token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string>

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body) {
    headers.set('Content-Type', 'application/json')
  }
  const token = tokenStorage.get()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(path, { ...options, headers })

  if (!res.ok) {
    let message = 'Something went wrong'
    let fieldErrors: Record<string, string> = {}
    try {
      const body = await res.json()
      message = body.message ?? message
      fieldErrors = body.errors ?? {}
    } catch {
      // odgovor nema JSON telo (npr. 401 bez poruke)
    }
    throw new ApiError(res.status, message, fieldErrors)
  }

  return res.json() as Promise<T>
}