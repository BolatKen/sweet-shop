"use client"

import { addToCart } from '@/lib/actions/cart'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'

export default function AddToCartButton({ variantId }: { variantId: string }) {
    const [ status, setStatus ] = useState< 'idle' | 'loading' | 'success' | 'error'>('idle')
    const router = useRouter();

    async function handleClick() {
        setStatus('loading')
        const ok = await addToCart(variantId) as any
        if (ok?.message === 'Token missing') {
            router.push('/auth/login')
            return
        }
        setStatus(ok ? 'success' : 'error')
        setTimeout(() => setStatus('idle'), 2000)
    }

    return(
        <Button
            onClick={handleClick} 
            disabled={status === 'loading'}
            className="mt-4 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
            >
            {status === 'idle' && 'Add to cart'}
            {status === 'loading' && 'Adding...'}
            {status === 'success' && '✓ Added!'}
            {status === 'error' && 'Error, try again'}
        </Button>
    )
}