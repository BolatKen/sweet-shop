import request from 'supertest'
import app from '../app'
import prisma from '../lib/prisma'

let token: string
let userId: string
let variantId: string
let categoryId: string
let productId: string

beforeAll(async () => {
  // Create test user and get token
  const email = `cart_test_${Date.now()}@test.com`
  await request(app)
    .post('/api/auth/register')
    .send({ email, password: '123456' })

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email, password: '123456' })

  token = loginRes.body.accessToken
  userId = loginRes.body.id

  const user = await prisma.user.findUnique({ where: { email } })
  userId = user!.id

  // Create category, product, variant
  const category = await prisma.category.create({
    data: { name: 'Cart Test Category', slug: `cart-test-cat-${Date.now()}` }
  })
  categoryId = category.id

  const product = await prisma.product.create({
    data: {
      name: 'Cart Test Product',
      slug: `cart-test-product-${Date.now()}`,
      categoryId: category.id,
      images: [],
      isActive: true,
    }
  })
  productId = product.id

  const variant = await prisma.productVariant.create({
    data: {
      productId: product.id,
      size: 'M',
      color: 'Black',
      price: 10000,
      stock: 10,
    }
  })
  variantId = variant.id
})

afterAll(async () => {
  await prisma.cartItem.deleteMany({ where: { userId } })
  await prisma.productVariant.deleteMany({ where: { productId } })
  await prisma.product.deleteMany({ where: { id: productId } })
  await prisma.category.deleteMany({ where: { id: categoryId } })
  await prisma.user.deleteMany({ where: { id: userId } })
  await prisma.$disconnect()
})

describe('Cart', () => {
  it('GET /api/cart — should reject without token', async () => {
    await request(app)
      .get('/api/cart')
      .expect(401)
  })

  it('GET /api/cart — should return empty array for new user', async () => {
    const response = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBe(0)
  })

  it('POST /api/cart — should add item to cart', async () => {
    const response = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ variantId, quantity: 1 })
      .expect(200)
    expect(response.body.variantId).toBe(variantId)
    expect(response.body.quantity).toBe(1)
  })

  it('POST /api/cart — should increment quantity on duplicate', async () => {
    const response = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ variantId, quantity: 1 })
      .expect(200)
    expect(response.body.quantity).toBe(2)
  })

  it('DELETE /api/cart/:id — should remove item', async () => {
    const cart = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`)
    
    const itemId = cart.body[0].id

    await request(app)
      .delete(`/api/cart/${itemId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const updatedCart = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`)
    
    expect(updatedCart.body.length).toBe(0)
  })
})