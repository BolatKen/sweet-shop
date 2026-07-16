"use client"

import { addToCart } from '@/lib/actions/cart'
import { useState } from 'react'

export default function AddToCartButton({ variantId }: { variantId: string }) {
    const [ status, setStatus ] = useState< 'idle' | 'loading' | 'success' | 'error'>('idle')

    async function handleClick() {
        setStatus('loading')
        const ok = await addToCart(variantId)
        setStatus(ok ? 'success' : 'error')
        setTimeout(() => setStatus('idle'), 2000)
    }

    return(
        <button 
            onClick={handleClick} 
            disabled={status === 'loading'}
            className="mt-4 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
            >
            {status === 'idle' && 'Add to cart'}
            {status === 'loading' && 'Adding...'}
            {status === 'success' && '✓ Added!'}
            {status === 'error' && 'Error, try again'}
        </button>
    )
}