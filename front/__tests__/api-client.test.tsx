// __tests__/api-client.test.ts
import { apiFetch } from '@/lib/api'

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: 'test-token' })),
  })),
}))

describe('apiFetch', () => {
  it('sends request with token', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    })

    await apiFetch('/test')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    )
  })
})