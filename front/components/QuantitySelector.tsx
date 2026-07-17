'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addToCart } from '@/lib/actions/cart'

interface QuantitySelectorProps {
    variantId: string
    initialQuantity: number
    onQuantityChange?: (newQuantity: number) => void
}

export default function QuantitySelector({ 
    variantId, 
    initialQuantity,
    onQuantityChange 
}: QuantitySelectorProps) {
    const [quantity, setQuantity] = useState(initialQuantity)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();

    const handleQuantityChange = async (change: number) => {
        if (isLoading) return
        if (change < 0 && quantity + change < 0) return
        
        setIsLoading(true)
        
        try {
            await addToCart(variantId, change)
            const newQuantity = quantity + change
            setQuantity(newQuantity)
            onQuantityChange?.(newQuantity)
            router.refresh();
        } catch (error) {
            console.error('Failed to update cart:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-1 mt-3">
            <button
                onClick={() => handleQuantityChange(-1)}
                disabled={isLoading}
                className={`
                    w-9 h-9 flex items-center justify-center 
                    border border-gray-300 rounded-l-lg
                    transition-colors duration-200
                    ${quantity <= 1 
                        ? 'bg-gray-100 text-gray-400 ' 
                        : 'hover:bg-gray-100 active:bg-gray-200'
                    }
                    disabled:opacity-50
                `}
                aria-label="Уменьшить количество"
            >
                {quantity === 1 ? '🗑️' : '−'}
            </button>
            
            <div className="w-10 h-9 flex items-center justify-center border-y border-gray-300 bg-white font-medium text-sm">
                {isLoading ? '...' : quantity}
            </div>
            
            <button
                onClick={() => handleQuantityChange(1)}
                disabled={isLoading}
                className="
                    w-9 h-9 flex items-center justify-center 
                    border border-gray-300 rounded-r-lg
                    hover:bg-gray-100 active:bg-gray-200
                    transition-colors duration-200
                    disabled:opacity-50
                "
                aria-label="Увеличить количество"
            >
                +
            </button>
        </div>
    )
}