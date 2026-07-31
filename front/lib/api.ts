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
    redirect('/auth/login')
  }

  return res.json()
}