
import { useState } from 'react'
import './Login.css'

const API_URL = 'http://127.0.0.1:8000'

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (!email.trim() || !password) {
      setMessage('Please enter email and password.')
      return
    }

    setLoading(true)

    try {
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
      console.log('FULL LOGIN RESPONSE:', JSON.stringify(result, null, 2))

      if (!response.ok) {
        const error = result.detail || result.message || 'Login failed.'

        if (Array.isArray(error)) {
          setMessage(error.map((item) => item.msg).join(', '))
        } else {
          setMessage(String(error))
        }

        return
      }

      const token =
        result.data?.access_token ||
        result.access_token ||
        result.data?.token ||
        result.token

      if (!token) {
        console.error(
          'Login response:',
          JSON.stringify(result, null, 2)
        )
        setMessage('Login response does not contain an access token.')
        return
      }

      localStorage.setItem('token', token)

      setMessage('Login successful!')
      setPassword('')

      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } catch (error) {
      console.error('Login error:', error)
      setMessage('Cannot connect to server. Check FastAPI and CORS settings.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

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

        {message && <p role="status">{message}</p>}
      </form>
    </div>
  )
}

export default Login
