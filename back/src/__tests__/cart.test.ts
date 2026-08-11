import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../app'
import prisma from '../lib/prisma'

jest.mock('../lib/prisma')

const mockedPrisma = prisma as jest.Mocked<typeof prisma>

// Generate a valid JWT token using the test secret so authenticateToken passes.
const TEST_USER_ID = 'test-user-1'
const token = jwt.sign({ id: TEST_USER_ID, role: 'CUSTOMER' }, 'test_secret', { expiresIn: '1h' })

const mockVariantId = 'variant-1'
const mockCartItem = {
  id: 'cart-1',
  userId: TEST_USER_ID,
  variantId: mockVariantId,
  quantity: 1,
}

describe('Cart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET /api/cart — should reject without token', async () => {
    await request(app).get('/api/cart').expect(401)
  })

  it('GET /api/cart — should return empty array for new user', async () => {
    ;(mockedPrisma.cartItem.findMany as jest.Mock).mockResolvedValue([])

    const response = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBe(0)
  })

  it('POST /api/cart — should add item to cart', async () => {
    ;(mockedPrisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null)
    ;(mockedPrisma.cartItem.create as jest.Mock).mockResolvedValue(mockCartItem)

    const response = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ variantId: mockVariantId, quantity: 1 })
      .expect(200)

    expect(response.body.variantId).toBe(mockVariantId)
    expect(response.body.quantity).toBe(1)
  })

  it('POST /api/cart — should increment quantity on duplicate', async () => {
    const existingItem = { ...mockCartItem, quantity: 1 }
    const updatedItem = { ...mockCartItem, quantity: 2 }

    ;(mockedPrisma.cartItem.findFirst as jest.Mock).mockResolvedValue(existingItem)
    ;(mockedPrisma.cartItem.update as jest.Mock).mockResolvedValue(updatedItem)

    const response = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ variantId: mockVariantId, quantity: 1 })
      .expect(200)

    expect(response.body.quantity).toBe(2)
  })

  it('DELETE /api/cart/:id — should remove item', async () => {
    ;(mockedPrisma.cartItem.delete as jest.Mock).mockResolvedValue(mockCartItem)

    await request(app)
      .delete(`/api/cart/${mockCartItem.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
})