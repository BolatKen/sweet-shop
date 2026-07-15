import { apiFetch } from '@/lib/api'

export async function login(email:string, password:string) {
    return apiFetch<{token:string; message:string}>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({email,password}),
    })
}

export async function register(email:string, password:string) {
    return apiFetch<{message:string}>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({email, password}),
    })
}