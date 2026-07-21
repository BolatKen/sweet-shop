import request from 'supertest'
import app from '../app'
import prisma from '../lib/prisma'

const testEmail = `test_${Date.now()}@test.com`
const testPassword = '123456'

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: testEmail } })
  await prisma.$disconnect()
})

describe('Auth', () => {
  it('POST /api/auth/register — should return 201', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: testPassword })
      .expect(201)
    expect(response.body.message).toBe('User registered successfully')
  })

  it('POST /api/auth/login — should return token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(200)
    expect(response.body.accessToken).toBeDefined()
  })

  it('POST /api/auth/login — invalid credentials should return 400', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@gmail.com', password: 'wrongpassword' })
      .expect(400)
    expect(response.body.message).toBe('Invalid credentials')
  })
})