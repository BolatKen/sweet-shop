'use server'

import { login, register } from '@/lib/api/authenticate'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginUser(prevState: string | undefined, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const res = await login(email, password)
    if (!res.token) return 'Incorrect email or password'
    
    const cookieStore = await cookies()
    cookieStore.set('token', res.token, {
      httpOnly: true,
      path: '/',
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
    await register(email, password)
  } catch {
    return 'Registration error'
  }

  redirect('/auth/login')
}


export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  redirect('/');
}