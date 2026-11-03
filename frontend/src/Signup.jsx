
import { useState } from 'react'
import './Signup.css'

const API_URL = 'https://spendly-backend-15og.onrender.com'

function Signup({ onLoginClick }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  // Handle signup form submission
  async function handleSignup(event) {
    event.preventDefault()
    setMessage('')
    setSignupSuccess(false)
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
            error.map((item) => item.msg).join(', ')
          )
        } else {
          setMessage(error || 'Signup failed.')
        }

        return
      }

      setMessage('Account created successfully! Please login.')
      setSignupSuccess(true)

      setName('')
      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('Signup error:', error)
      setMessage('Server connection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

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
          minLength={8}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {message && (
          <p className="signup-message" role="status">
            {message}
          </p>
        )}

        {signupSuccess && (
          <button
            type="button"
            onClick={() => onLoginClick?.()}
          >
            Continue to Login
          </button>
        )}

        <p className="login-link">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onLoginClick?.()}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  )
}

export default Signup
