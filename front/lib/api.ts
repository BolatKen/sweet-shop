import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })


  if (res.status === 401) {
    const refreshToken = cookieStore.get('refreshToken')?.value
    if (!refreshToken) redirect('/auth/login')

    const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })

    if (!refreshRes.ok) redirect('/auth/login');

    const { accessToken } = await refreshRes.json()

    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 15
    })

    const retryRes = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    })

    return retryRes.json()
  }

  return res.json()
}