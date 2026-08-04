import { render, screen, fireEvent } from '@testing-library/react'
import VariantSelector from '../components/VariantSelector'

jest.mock('../components/AddToCartButton', () => ({
  __esModule: true,
  default: ({ variantId }: { variantId: string }) => (
    <button data-testid={`add-to-cart-${variantId}`}>Add to Cart</button>
  ),
}))

const mockVariants = [
  { id: '1', size: 'S', color: 'Black', price: 10000, stock: 5 },
  { id: '2', size: 'M', color: 'White', price: 15000, stock: 3 },
]

jest.mock('../lib/actions/cart', () => ({
  addToCart: jest.fn()
}))

describe('VariantSelector', () => {
  it('shows first variant price by default', () => {
    render(<VariantSelector variants={mockVariants} />)
    expect(screen.getByText('100 ₸')).toBeInTheDocument()
  })

  it('changes price when variant is selected', () => {
    render(<VariantSelector variants={mockVariants} />)
    fireEvent.click(screen.getByText('White'))
    expect(screen.getByText('150 ₸')).toBeInTheDocument()
  })

  it('shows out of stock when stock is 0', () => {
    const variants = [{ id: '1', size: 'S', color: 'Black', price: 10000, stock: 0 }]
    render(<VariantSelector variants={variants} />)
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })
})