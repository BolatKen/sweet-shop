// __mocks__/next-navigation.ts
export const useRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
})

export const usePathname = () => '/'
export const useSearchParams = () => new URLSearchParams()