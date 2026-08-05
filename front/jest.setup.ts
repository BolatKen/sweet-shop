// jest.setup.ts
import '@testing-library/jest-dom'

// Мок для jsdom
Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
  value: jest.fn(),
})