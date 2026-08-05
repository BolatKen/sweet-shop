"use client"

import { addToCart } from '@/lib/actions/cart'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AddToCartResult {
    message?: string;
    [key: string]: unknown;
}

export default function AddToCartButton({ variantId }: { variantId: string }) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const router = useRouter();

    async function handleClick() {
        if (!variantId) return
        setStatus('loading')
        const result = (await addToCart(variantId)) as AddToCartResult | null
        
        if (result?.message === 'Token missing') {
            router.push('/auth/login')
            return
        }
        
        if (result) {
            setStatus('success')
            router.refresh()
        } else {
            setStatus('error')
        }
        
        setTimeout(() => setStatus('idle'), 2500)
    }

    return (
        <button
            onClick={handleClick} 
            disabled={status === 'loading' || !variantId}
            className={`w-full py-4 rounded-full font-extrabold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                status === 'success' 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : status === 'error' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-black text-white hover:bg-neutral-800 active:scale-[0.99]'
            }`}
        >
            {status === 'idle' && (
                <>
                    <span>Add to Bag</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </>
            )}
            {status === 'loading' && (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Adding to Bag...
                </span>
            )}
            {status === 'success' && '✓ Added to Bag'}
            {status === 'error' && 'Failed to Add - Try Again'}
        </button>
    )
}