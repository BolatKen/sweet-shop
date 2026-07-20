'use server'

import { apiFetch } from '@/lib/api'
import { User } from '@/lib/types'

export async function getMe() {
    return apiFetch<User>('/api/users/me');
}