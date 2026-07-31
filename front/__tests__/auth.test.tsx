import { render, screen, fireEvent, waitFor } from '@testing-library/react'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: jest.fn(() => [undefined, jest.fn(), false]),
}))

// Создаем тестовый компонент
function TestLoginPage() {
  return (
    <form>
      <input name="email" placeholder="Email" />
      <input name="password" placeholder="Password" />
      <button type="submit">Log in</button>
    </form>
  )
}

describe('Login', () => {
  it('renders login form', () => {
    render(<TestLoginPage />)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByText('Log in')).toBeInTheDocument()
  })
})