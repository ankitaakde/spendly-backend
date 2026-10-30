
import { useState } from 'react'

// FastAPI backend URL
const API_URL = 'http://127.0.0.1:8000'

function AddExpense({ onExpenseAdded }) {
  // Form ki values store karna
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Expense form submit karna
  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

    // Login token lena
    const token = localStorage.getItem('token')

    if (!token) {
      setMessage('Please login first.')
      return
    }

    setLoading(true)

    try {
      // Expense backend ko send karna
      const response = await fetch(`${API_URL}/expenses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          amount: Number(amount),
          category,
          date,
        }),
      })

      // Backend response read karna
      const result = await response.json()

      if (response.ok && result.status === 'success') {
        setMessage('Expense added successfully!')

        // Form reset karna
        setName('')
        setAmount('')
        setCategory('food')
        setDate(new Date().toISOString().split('T')[0])

        // Expense list refresh karna
        if (onExpenseAdded) {
          onExpenseAdded()
        }
      } else {
        setMessage(
          result.message || result.detail || 'Could not add expense.'
        )
      }
    } catch (error) {
      // Server connection error
      console.error('Add expense error:', error)
      setMessage('Server connection failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Add Expense</h2>

        {/* Expense name */}
        <input
          type="text"
          placeholder="Expense name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Expense amount */}
        <input
          type="number"
          placeholder="Amount in rupees"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />

        {/* Expense category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '7px',
            border: '1px solid #d1d5db',
          }}
        >
          <option value="food">Food</option>
          <option value="rent">Rent</option>
          <option value="shopping">Shopping</option>
          <option value="travel">Travel</option>
          <option value="bills">Bills</option>
          <option value="other">Other</option>
        </select>

        {/* Expense date */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {/* Submit button */}
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Expense'}
        </button>

        {/* Success ya error message */}
        <p className="login-message" role="status">{message}</p>
      </form>
    </div>
  )
}

export default AddExpense
