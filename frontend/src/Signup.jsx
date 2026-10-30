import { useState } from 'react'
import './Signup.css'

const API_URL = 'http://127.0.0.1:8000'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle signup form submission
  async function handleSignup(event) {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          user_name: name.trim(),
          email: email.trim(),
          password: password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        const error = result.detail ?? result.message

        if (Array.isArray(error)) {
          setMessage(
            error
              .map((item) => {
                const field = item.loc?.join('.') || 'Field'
                return `${field}: ${item.msg}`
              })
              .join(', ')
          )
        } else if (typeof error === 'string') {
          setMessage(error)
        } else {
          setMessage(`Signup failed. Status: ${response.status}`)
        }

        return
      }

      setMessage('Account created successfully! Please login.')

      setName('')
      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('Signup error:', error)
      setMessage('Server connection failed. Check FastAPI server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>Create Account</h2>

        {/* User name field */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        {/* Email field */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        {/* Password field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />

        {/* Signup button */}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {/* Display signup message */}
        {message && <p>{message}</p>}
      </form>
    </div>
  )
}

export default Signup