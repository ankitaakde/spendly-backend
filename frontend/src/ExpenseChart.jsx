import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function ExpenseChart({ expenses }) {
  const categoryData = expenses.reduce((result, expense) => {
    const category = expense.category || 'other'
    const amount = Number(expense.amount || 0)

    result[category] = (result[category] || 0) + amount

    return result
  }, {})

  const chartData = Object.entries(categoryData).map(
    ([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    })
  )

  if (chartData.length === 0) {
    return <p>No expense data available for chart.</p>
  }

  return (
    <div style={{ width: '100%', height: '350px' }}>
      <h2>Category-wise Expenses</h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} />
            ))}
          </Pie>

          <Tooltip formatter={(value) => `₹${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ExpenseChart