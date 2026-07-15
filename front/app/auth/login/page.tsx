'use client'

import { useActionState } from 'react';
import { loginUser } from '@/lib/actions/auth'


export default function LoginPage() {

    const [errorMessage, formAction, isPending] = useActionState(
        loginUser,
        undefined,
    )

    return(
        <main className="min-h-screen flex items-center justify-center px-4">
    <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Log in</h1>
        <form action={formAction} className="flex flex-col gap-4">
        <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        />
        <input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength={6}
            className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        />
        <button
            type="submit"
            disabled={isPending}
            className="bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
        >
            {isPending ? 'Loggin in...' : 'Log in'}
        </button>
        {errorMessage && <p className="text-sm text-red-500 text-center">{errorMessage}</p>}
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
        No account? <a href="/auth/register" className="text-black underline">Register</a>
        </p>
    </div>
    </main>
    )
}