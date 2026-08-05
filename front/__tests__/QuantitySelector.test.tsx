import { render, screen, fireEvent, act } from '@testing-library/react'
import QuantitySelector from '../components/QuantitySelector'
import { addToCart } from '@/lib/actions/cart'

jest.mock('@/lib/actions/cart')
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}))

describe('QuantitySelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows X icon when quantity is 1', () => {
    render(<QuantitySelector variantId="1" initialQuantity={1} />)
    expect(screen.getByText('x')).toBeInTheDocument()
  })

  it('shows minus icon when quantity > 1', () => {
    render(<QuantitySelector variantId="1" initialQuantity={3} />)
    expect(screen.getByText('−')).toBeInTheDocument() 
  })

  it('increases quantity on plus click', async () => {
    render(<QuantitySelector variantId="1" initialQuantity={2} />)
    const plusButton = screen.getByText('+')
    
    await act(async () => {
      fireEvent.click(plusButton)
    })
    
    expect(addToCart).toHaveBeenCalledWith('1', 1)
  })

  it('decreases quantity on minus click', async () => {
    render(<QuantitySelector variantId="1" initialQuantity={3} />)
    const minusButton = screen.getByText('−')
    
    await act(async () => {
      fireEvent.click(minusButton)
    })
    
    expect(addToCart).toHaveBeenCalledWith('1', -1)
  })

  it('does not decrease below 1', async () => {
    render(<QuantitySelector variantId="1" initialQuantity={1} />)
    const trashButton = screen.getByText('x')
    
    await act(async () => {
      fireEvent.click(trashButton)
    })
    
    expect(addToCart).toHaveBeenCalledWith('1', -1)
  })
})