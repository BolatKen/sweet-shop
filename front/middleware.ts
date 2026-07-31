import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (!accessToken && refreshToken) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })

    if (res.ok) {
      const { accessToken: newToken } = await res.json()
      const response = NextResponse.next()
      response.cookies.set('accessToken', newToken, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 15
      })
      return response
    }

    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile', '/cart', '/checkout', '/admin/:path*']
}