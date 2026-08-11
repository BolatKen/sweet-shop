import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let token: string | undefined

  // cookies() throws in static contexts (SSG/generateStaticParams).
  // Wrap in try/catch so public pages can be pre-rendered at build time.
  try {
    const cookieStore = await cookies()
    token = cookieStore.get('accessToken')?.value
  } catch {
    token = undefined
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    // Enable ISR: cached pages revalidate every 60 seconds by default.
    // Individual call sites can override via options.next.
    ...(!(options as RequestInit & { next?: unknown }).next && {
      next: { revalidate: 60 },
    }),
  })

  if (res.status === 401) {
    redirect('/auth/login')
  }

  return res.json()
}