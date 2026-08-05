'use client'

import { useActionState } from 'react';
import { registerUser } from '@/lib/actions/auth'
import Link from 'next/link'

export default function RegisterPage() {
    const [errorMessage, formAction, isPending] = useActionState(
        registerUser,
        undefined,
    )

    return (
        <main className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-white animate-fade-in">
            <div className="w-full max-w-md bg-neutral-50 border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xl">
                <div className="text-center mb-8">
                    <span className="font-black text-2xl tracking-tighter uppercase text-black block mb-2">
                        SWEETSHOP
                    </span>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-black">
                        BECOME A MEMBER
                    </h1>
                    <p className="text-neutral-500 text-xs mt-1">
                        Create your SweetShop pass for free shipping & exclusive drops.
                    </p>
                </div>

                <form action={formAction} className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-black block mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            required
                            className="w-full bg-white border border-neutral-300 rounded-2xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-black text-black"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-black block mb-1.5">
                            Password (Min 6 Characters)
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className="w-full bg-white border border-neutral-300 rounded-2xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-black text-black"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-2 w-full bg-black text-white font-extrabold py-4 rounded-full text-xs uppercase tracking-wider hover:bg-neutral-800 transition active:scale-[0.99]"
                    >
                        {isPending ? 'Creating Account...' : 'Join SweetShop Club'}
                    </button>

                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-xs font-bold text-center">
                            {errorMessage}
                        </div>
                    )}
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-200 text-center text-xs text-neutral-500">
                    Already a member?{' '}
                    <Link href="/auth/login" className="text-black font-extrabold underline uppercase tracking-wider">
                        Sign In
                    </Link>
                </div>
            </div>
        </main>
    )
}