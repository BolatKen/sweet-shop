'use server'

import { apiFetch } from '@/lib/api'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginUser(prevState: string | undefined, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const res = await apiFetch<{accessToken:string; refreshToken:string; message:string}>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({email, password})
    })
    if (!res.accessToken || !res.refreshToken) return 'Incorrect email or password'
    
    const cookieStore = await cookies()
    cookieStore.set('accessToken', res.accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 15 
    })
    cookieStore.set('refreshToken', res.refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60  * 24 * 30
    })

  } catch {
    return 'Login error'
  }
  redirect('/')
}


export async function registerUser(prevState: string | undefined, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    await apiFetch<{message:string}>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({email, password}),
    })
  } catch {
    return 'Registration error'
  }

  redirect('/auth/login')
}


export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  redirect('/');
}