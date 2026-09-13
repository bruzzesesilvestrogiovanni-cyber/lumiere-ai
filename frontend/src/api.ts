const TOKEN_KEY = 'token'
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t)

// Backend URL - Render
const API_BASE = import.meta.env.PROD
  ? 'https://lumiere-ai-6t4u.onrender.com'
  : 'http://localhost:8000'

async function req(path: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as any) }
  const t = getToken()
  if (t) headers.Authorization = `Bearer ${t}`
  const url = path.startsWith('/api') ? `${API_BASE}${path}` : path
  const r = await fetch(url, { ...opts, headers })
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail || r.statusText)
  return r.json()
}

export const api = {
  register: (email: string, password: string) => req('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) => req('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => req('/api/auth/me'),
  create: (body: object) => req('/api/generations', { method: 'POST', body: JSON.stringify(body) }),
  list: () => req('/api/generations'),
  get: (id: number) => req(`/api/generations/${id}`),
}

export interface Generation {
  id: number; kind: 'image' | 'video'; status: string
  result_url: string | null; cost: number; prompt?: string
}
