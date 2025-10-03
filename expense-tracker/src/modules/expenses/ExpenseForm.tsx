import { useState } from 'react'

type Props = { onAdd: (e: { title: string; amount: number; category: string; date: string }) => void }

export function ExpenseForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('General')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  return (
    <div className="card">
      <div className="card-body">
        <div className="form">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" min="0" step="0.01" />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>General</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Utilities</option>
            <option>Shopping</option>
          </select>
          <input value={date} onChange={(e) => setDate(e.target.value)} type="date" />
          <button
            onClick={() => {
              const amountNum = parseFloat(amount)
              if (!title || isNaN(amountNum)) return
              onAdd({ title, amount: amountNum, category, date })
              setTitle(''); setAmount(''); setCategory('General'); setDate(new Date().toISOString().slice(0, 10))
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}


