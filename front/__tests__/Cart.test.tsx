import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CartPage from '../app/cart/page'
import { getCart } from '@/lib/actions/cart'

jest.mock('@/lib/actions/cart')
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

describe('Cart', () => {
  it('shows empty cart message when cart is empty', async () => {
    (getCart as jest.Mock).mockResolvedValue([])
    render(await CartPage())
    expect(screen.getByText('Cart is empty')).toBeInTheDocument()
  })

  it('displays cart items correctly', async () => {
    const mockCart = [
      {
        id: '1',
        quantity: 2,
        variant: {
          id: 'v1',
          size: 'M',
          color: 'Black',
          price: 10000,
          product: { name: 'T-Shirt', slug: 't-shirt' }
        }
      }
    ]
    ;(getCart as jest.Mock).mockResolvedValue(mockCart)
    render(await CartPage())
    expect(screen.getByText('T-Shirt')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})