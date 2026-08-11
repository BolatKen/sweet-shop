import request from 'supertest'
import app from '../app'
import prisma from '../lib/prisma'

jest.mock('../lib/prisma')

const mockedPrisma = prisma as jest.Mocked<typeof prisma>

const mockProduct = {
  id: 'product-1',
  name: 'Test Product',
  slug: 'test-product',
  description: 'Test description',
  images: [],
  isActive: true,
  categoryId: 'category-1',
  variants: [],
  createdAt: new Date().toISOString(),
}

describe('Products', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET /api/products — should return array', async () => {
    ;(mockedPrisma.product.findMany as jest.Mock).mockResolvedValue([mockProduct])
    ;(mockedPrisma.product.count as jest.Mock).mockResolvedValue(1)

    const response = await request(app).get('/api/products').expect(200)

    expect(Array.isArray(response.body.products)).toBe(true)
    expect(response.body.products.length).toBe(1)
  })

  it('GET /api/products/:slug — should return product', async () => {
    ;(mockedPrisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct)

    const response = await request(app).get('/api/products/test-product').expect(200)

    expect(response.body.slug).toBe('test-product')
    expect(response.body.name).toBe('Test Product')
  })

  it('GET /api/products/:slug — non-existent slug should return null', async () => {
    ;(mockedPrisma.product.findUnique as jest.Mock).mockResolvedValue(null)

    const response = await request(app).get('/api/products/non-existent-slug').expect(200)

    expect(response.body).toBeNull()
  })

  it('POST /api/products — should reject without token', async () => {
    await request(app)
      .post('/api/products')
      .send({ name: 'Unauthorized Product', slug: 'unauth-product' })
      .expect(401)
  })
})