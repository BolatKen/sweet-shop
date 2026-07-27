import request from 'supertest'
import app from '../app'
import prisma from '../lib/prisma'

let categoryId: string
let productSlug: string

beforeAll(async () => {
  const category = await prisma.category.create({
    data: { name: 'Test Category', slug: `test-category-${Date.now()}` }
  })
  categoryId = category.id

  const product = await prisma.product.create({
    data: {
      name: 'Test Product',
      slug: `test-product-${Date.now()}`,
      description: 'Test description',
      categoryId: category.id,
      images: [],
      isActive: true,
    }
  })
  productSlug = product.slug
})

afterAll(async () => {
  await prisma.product.deleteMany({ where: { slug: { startsWith: 'test-product' } } })
  await prisma.category.deleteMany({ where: { slug: { startsWith: 'test-category' } } })
  await prisma.$disconnect()
})

describe('Products', () => {
  it('GET /api/products — should return array', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('GET /api/products/:slug — should return product', async () => {
    const response = await request(app)
      .get(`/api/products/${productSlug}`)
      .expect(200)
    expect(response.body.slug).toBe(productSlug)
    expect(response.body.name).toBe('Test Product')
  })

  it('GET /api/products/:slug — non-existent slug should return null', async () => {
    const response = await request(app)
      .get('/api/products/non-existent-slug')
      .expect(200)
    expect(response.body).toBeNull()
  })

  it('POST /api/products — should reject without token', async () => {
    await request(app)
      .post('/api/products')
      .send({ name: 'Unauthorized Product', slug: 'unauth-product' })
      .expect(401)
  })
})