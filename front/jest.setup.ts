// jest.setup.ts
import '@testing-library/jest-dom'

// JSDOM does not implement HTMLFormElement.prototype.requestSubmit.
// Override it so form submit clicks in tests do not throw "Not implemented" errors.
Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
  configurable: true,
  writable: true,
  value: function () {
    const event = new Event('submit', { bubbles: true, cancelable: true })
    this.dispatchEvent(event)
  },
})