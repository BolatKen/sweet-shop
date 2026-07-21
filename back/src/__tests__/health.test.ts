import request from 'supertest'
import app from '../app'

describe('Health Check', () => {
    it('should return 200 OK for /health', async () => {
        const response = await request(app)
            .get('/health')
            .expect(200)
        expect(response.body.ok).toBe(true)
    })
})