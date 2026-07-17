'use client'

interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    isLoading?: boolean
    loadingText?: string
    variant?: 'primary' | 'secondary' | 'outline'
    className?: string
}

export default function Button({
    children,
    onClick,
    type = 'button',
    disabled = false,
    isLoading = false,
    loadingText = 'Загрузка...',
    variant = 'primary',
    className = ''
}: ButtonProps) {
    const baseStyles = "px-6 py-3 rounded-xl transition disabled:opacity-50 font-medium"
    
    const variantStyles = {
        primary: "bg-black text-white hover:bg-gray-800",
        secondary: "bg-gray-200 text-black hover:bg-gray-300",
        outline: "border-2 border-black text-black hover:bg-black hover:text-white"
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {isLoading ? loadingText : children}
        </button>
    )
}
