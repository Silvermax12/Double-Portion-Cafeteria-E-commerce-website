import { useMemo, useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { ExpenseForm } from '../expenses/ExpenseForm'
import { ExpenseList } from '../expenses/ExpenseList'

export type Expense = { id: string; title: string; amount: number; category: string; date: string }

function load() {
  try {
    const raw = localStorage.getItem('expenses')
    return raw ? (JSON.parse(raw) as Expense[]) : []
  } catch {
    return []
  }
}

export function App() {
  const [expenses, setExpenses] = useState<Expense[]>(load())

  function save(next: Expense[]) {
    setExpenses(next)
    try { localStorage.setItem('expenses', JSON.stringify(next)) } catch {}
  }

  const monthly = useMemo(() => {
    const map = new Map<string, number>()
    for (const e of expenses) {
      const key = new Date(e.date).toISOString().slice(0, 7)
      map.set(key, (map.get(key) || 0) + e.amount)
    }
    return Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b)).map(([m, total]) => ({ month: m, total }))
  }, [expenses])

  return (
    <div className="container">
      <h1 className="title">Expense Tracker</h1>
      <ExpenseForm onAdd={(e) => save([{ ...e, id: crypto.randomUUID() }, ...expenses])} />
      <div className="card">
        <div className="card-body">
          <div className="chart">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthly} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="total" stroke="#4f46e5" fill="#6366f1" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <ExpenseList
        items={expenses}
        onDelete={(id) => save(expenses.filter((x) => x.id !== id))}
        onEdit={(it) => save(expenses.map((x) => (x.id === it.id ? it : x)))}
      />
    </div>
  )
}


