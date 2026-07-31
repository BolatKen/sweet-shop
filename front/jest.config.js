module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // ← добавьте setup файл
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^next/navigation$': '<rootDir>/__mocks__/next-navigation.ts',
    '^next/navigation$': '<rootDir>/__mocks__/next-navigation.ts', // ← добавьте эту строку
  },
  testMatch: ['**/__tests__/**/*.test.tsx'],
}