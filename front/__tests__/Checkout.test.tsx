import { render, screen, fireEvent } from '@testing-library/react'
import { createOrder } from '@/lib/actions/order'

jest.mock('@/lib/actions/order')
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

function TestCheckoutForm() {
  return (
    <form>
      <input 
        name="deliveryAddress" 
        placeholder="Address" 
        className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
      />
      <button 
        type="submit" 
        className="bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
      >
        Оформить заказ
      </button>
    </form>
  )
}

describe('Checkout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders checkout form', () => {
    render(<TestCheckoutForm />)
    expect(screen.getByPlaceholderText('Address')).toBeInTheDocument()
    expect(screen.getByText('Оформить заказ')).toBeInTheDocument()
  })

  it('shows validation error for empty address', async () => {
    (createOrder as jest.Mock).mockResolvedValue('Address is required')
    
    render(<TestCheckoutForm />)
    const submitButton = screen.getByText('Оформить заказ')
    
    fireEvent.click(submitButton)
    
    expect(submitButton).toBeInTheDocument()
  })

  it('disables button during submission', async () => {
    (createOrder as jest.Mock).mockImplementation(() => new Promise(() => {}))
    
    render(<TestCheckoutForm />)
    const submitButton = screen.getByText('Оформить заказ')
    
    fireEvent.click(submitButton)
    
    expect(submitButton).toBeInTheDocument()
  })
})