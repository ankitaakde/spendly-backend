
import { useState } from 'react'
import './Login.css'

const API_URL = 'https://spendly-backend-15og.onrender.com'

function Login({ onLoginSuccess, onSignupClick }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle login form submission
  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (!email.trim() || !password) {
      setMessage('Please enter email and password.')
      return
    }

    setLoading(true)

    try {
      // Send login request to the backend
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      })

      const result = await response.json()

      // Handle login errors
      if (!response.ok || result.status === 'error') {
        const error = result.detail || result.message || 'Login failed.'

        if (Array.isArray(error)) {
          setMessage(error.map((item) => item.msg).join(', '))
        } else {
          setMessage(String(error))
        }

        return
      }

      // Extract the access token from the response
      const token =
        result.data?.access_token ||
        result.access_token ||
        result.data?.token ||
        result.token

      if (!token) {
        setMessage('Login response does not contain an access token.')
        return
      }

      // Save the access token in local storage
      localStorage.setItem('token', token)

      setMessage('Login successful!')
      setPassword('')

      // Notify the parent component after successful login
      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } catch (error) {
      console.error('Login error:', error)
      setMessage('Cannot connect to server. Check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back!</h2>

        <p className="login-subtitle">
          Login to your Spendly account
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {message && (
          <p className="login-message" role="status">
            {message}
          </p>
        )}

        <p className="signup-link">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onSignupClick?.()}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login
