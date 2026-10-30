
import './App.css'
import { useEffect, useState } from 'react'
import Signup from './Signup'
import Login from './Login'
import AddExpense from './AddExpense'
import ExpenseChart from './ExpenseChart'

const API_URL = https//spendly-backend-15og.onrender.com

function App() {
  const [expenses, setExpenses] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem('token'))
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Fetch expenses from the backend
  async function fetchExpenses() {
    const token = localStorage.getItem('token')

    if (!token) {
      setExpenses([])
      setIsLoggedIn(false)
      setMessage('Please login first to view expenses.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/expenses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        setMessage('Could not load expenses. Please login again.')
        return
      }

      const expenseList = result.data?.expenses || []
      setExpenses(expenseList)

      setMessage(
        expenseList.length === 0 ? 'No expenses found.' : ''
      )
    } catch (error) {
      console.error('Fetch expenses error:', error)
      setMessage('Server connection failed.')
    } finally {
      setLoading(false)
    }
  }

  // Load expenses when the app opens
  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchExpenses()
    }
  }, [])

  // Handle successful login
  function handleLoginSuccess() {
    setIsLoggedIn(true)
    fetchExpenses()
  }

  // Handle logout
  function handleLogout() {
    localStorage.removeItem('token')
    setExpenses([])
    setIsLoggedIn(false)
    setSearchTerm('')
    setCategoryFilter('all')
    setMessage('You have logged out successfully.')
  }

  // Calculate dashboard totals
  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  )

  const totalTransactions = expenses.length

  const shoppingExpenses = expenses
    .filter(
      (expense) => expense.category?.toLowerCase() === 'shopping'
    )
    .reduce(
      (total, expense) => total + Number(expense.amount || 0),
      0
    )

  // Filter expenses by name and category
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory =
      categoryFilter === 'all' ||
      expense.category?.toLowerCase() === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Delete an expense
  async function deleteExpense(expenseId) {
    const token = localStorage.getItem('token')

    if (!token) {
      setMessage('Please login first.')
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this expense?'
    )

    if (!confirmed) return

    try {
      const response = await fetch(
        `${API_URL}/expenses/${expenseId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const result = await response.json()
        setMessage(result.detail || 'Failed to delete expense.')
        return
      }

      setExpenses((currentExpenses) =>
        currentExpenses.filter(
          (expense) => expense.id !== expenseId
        )
      )

      setMessage('Expense deleted successfully.')
    } catch (error) {
      console.error('Delete expense error:', error)
      setMessage('Server connection failed.')
    }
  }

  return (
    <div className="spendly-layout">
      {isLoggedIn ? (
        <>
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="brand">
              <span className="brand-icon">S</span>
              <span>Spendly</span>
            </div>

            <p className="sidebar-label">MENU</p>

            <nav className="sidebar-nav">
              <a className="nav-link active" href="#dashboard">
                <span>▦</span> Dashboard
              </a>

              <a className="nav-link" href="#expenses">
                <span>↔</span> Expenses
              </a>

              <a className="nav-link" href="#analytics">
                <span>◉</span> Analytics
              </a>

              <a className="nav-link" href="#add-expense">
                <span>＋</span> Add Expense
              </a>
            </nav>

            <div className="sidebar-bottom">
              <button className="logout-button" onClick={handleLogout}>
                <span>↪</span> Logout
              </button>
            </div>
          </aside>

          {/* Main Dashboard */}
          <main className="main-content" id="dashboard">

            {/* Top Header */}
            <header className="topbar">
              <div>
                <p className="topbar-subtitle">PERSONAL FINANCE</p>
                <h1>Dashboard</h1>
              </div>

              <div className="profile">
                <span className="profile-avatar">A</span>
                <span>My Account</span>
              </div>
            </header>

            {/* Welcome Section */}
            <section className="welcome-section">
              <div>
                <p className="welcome-label">
                  YOUR FINANCES AT A GLANCE
                </p>

                <h2>Welcome back!</h2>

                <p>
                  Track your spending and manage your money smartly.
                </p>
              </div>

              <div className="welcome-icon">₹</div>
            </section>

            {/* Dashboard Summary Cards */}
            <section className="summary-container">
              <div className="summary-card">
                <div className="card-top">
                  <span>Total Expenses</span>
                  <span className="card-icon purple">₹</span>
                </div>

                <h2>₹{totalExpenses.toLocaleString('en-IN')}</h2>
                <p>All recorded expenses</p>
              </div>

              <div className="summary-card">
                <div className="card-top">
                  <span>Total Transactions</span>
                  <span className="card-icon blue">▤</span>
                </div>

                <h2>{totalTransactions}</h2>
                <p>Recorded transactions</p>
              </div>

              <div className="summary-card">
                <div className="card-top">
                  <span>Shopping Expenses</span>
                  <span className="card-icon orange">🛍</span>
                </div>

                <h2>₹{shoppingExpenses.toLocaleString('en-IN')}</h2>
                <p>Total shopping spending</p>
              </div>
            </section>

            {/* Expense Analytics */}
            <section className="content-panel" id="analytics">
              <div className="section-heading">
                <div>
                  <h2>Expense Analytics</h2>
                  <p>See how your money is being spent.</p>
                </div>
              </div>

              <ExpenseChart expenses={expenses} />
            </section>

            {/* Add Expense Section */}
            <section
              className="content-panel add-expense-panel"
              id="add-expense"
            >
              <div className="section-heading">
                <div>
                  <h2>Add New Expense</h2>
                  <p>Record your latest spending.</p>
                </div>
              </div>

              <AddExpense onExpenseAdded={fetchExpenses} />
            </section>

            {/* Recent Expenses Section */}
            <section
              className="content-panel expenses-panel"
              id="expenses"
            >
              <div className="section-heading">
                <div>
                  <h2>Recent Expenses</h2>
                  <p>View and manage your transactions.</p>
                </div>

                <button
                  className="refresh-button"
                  onClick={fetchExpenses}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : '↻ Refresh'}
                </button>
              </div>

              {/* Search and Category Filter */}
              <div className="expense-filters">
                <input
                  type="text"
                  placeholder="Search expense by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="food">Food</option>
                  <option value="rent">Rent</option>
                  <option value="shopping">Shopping</option>
                  <option value="travel">Travel</option>
                  <option value="bills">Bills</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {message && (
                <p className="status-message">{message}</p>
              )}

              {filteredExpenses.length > 0 ? (
                <div className="table-wrapper">
                  <table className="expense-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredExpenses.map((expense) => (
                        <tr key={expense.id}>
                          <td className="expense-name">
                            {expense.name}
                          </td>

                          <td className="expense-amount">
                            ₹{Number(expense.amount).toLocaleString('en-IN')}
                          </td>

                          <td>
                            <span className="category-badge">
                              {expense.category}
                            </span>
                          </td>

                          <td>{expense.date}</td>

                          <td>
                            <button
                              className="delete-button"
                              onClick={() => deleteExpense(expense.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <span>▤</span>
                  <h3>
                    {expenses.length === 0
                      ? 'No expenses yet'
                      : 'No matching expenses found'}
                  </h3>
                  <p>
                    {expenses.length === 0
                      ? 'Add your first expense to see it here.'
                      : 'Try another search or category.'}
                  </p>
                </div>
              )}
            </section>

            {/* Dashboard Footer */}
            <footer className="app-footer">
              Spendly · Track expenses. Understand spending. Make better decisions.
            </footer>
          </main>
        </>
      ) : (
        /* Authentication Page */
        <div className="auth-page">
          <div className="auth-heading">
            <span className="brand-icon">S</span>
            <h1>Spendly</h1>
            <p>Manage your money, one expense at a time.</p>
          </div>

          <div className="auth-forms">
            <Signup />
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>

          {message && (
            <p className="status-message">{message}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default App
