import request from 'supertest'
import app from '../app'
import prisma from '../lib/prisma'
import bcrypt from 'bcrypt'

jest.mock('../lib/prisma')

const mockedPrisma = prisma as jest.Mocked<typeof prisma>

describe('Auth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('POST /api/auth/register — should return 201', async () => {
    ;(mockedPrisma.user.create as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'test@test.com' })

    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: '123456' })
      .expect(201)

    expect(response.body.message).toBe('User registered successfully')
  })

  it('POST /api/auth/login — should return token', async () => {
    const hashedPassword = await bcrypt.hash('123456', 10)
    ;(mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      passwordHash: hashedPassword,
      role: 'CUSTOMER',
    })
    ;(mockedPrisma.user.update as jest.Mock).mockResolvedValue({})

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: '123456' })
      .expect(200)

    expect(response.body.accessToken).toBeDefined()
  })

  it('POST /api/auth/login — invalid credentials should return 400', async () => {
    ;(mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@gmail.com', password: 'wrongpassword' })
      .expect(400)

    expect(response.body.message).toBe('Invalid credentials')
  })
})