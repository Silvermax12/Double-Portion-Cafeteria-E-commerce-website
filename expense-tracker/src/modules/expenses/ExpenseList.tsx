import { useState } from 'react'
import type { Expense } from '../app/App'

type Props = {
  items: Expense[]
  onDelete: (id: string) => void
  onEdit: (item: Expense) => void
}

export function ExpenseList({ items, onDelete, onEdit }: Props) {
  const [filter, setFilter] = useState<string>('')
  const filtered = items.filter((x) => !filter || x.date.startsWith(filter))

  return (
    <div className="card">
      <div className="card-body">
        <div className="list-header">
          <div className="left">
            <strong>Expenses</strong>
          </div>
          <div className="right">
            <input type="month" value={filter} onChange={(e) => setFilter(e.target.value)} />
          </div>
        </div>
        <div className="table">
          <div className="tr th">
            <div>Title</div>
            <div>Category</div>
            <div>Date</div>
            <div>Amount</div>
            <div></div>
          </div>
          {filtered.map((x) => (
            <Row key={x.id} item={x} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Row({ item, onDelete, onEdit }: { item: Expense; onDelete: (id: string) => void; onEdit: (e: Expense) => void }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [category, setCategory] = useState(item.category)
  const [date, setDate] = useState(item.date)
  const [amount, setAmount] = useState(item.amount.toString())

  if (!editing) {
    return (
      <div className="tr">
        <div>{item.title}</div>
        <div>{item.category}</div>
        <div>{item.date}</div>
        <div>${item.amount.toFixed(2)}</div>
        <div className="actions">
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={() => onDelete(item.id)}>Delete</button>
        </div>
      </div>
    )
  }

  return (
    <div className="tr">
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>General</option>
        <option>Food</option>
        <option>Transport</option>
        <option>Utilities</option>
        <option>Shopping</option>
      </select>
      <input value={date} onChange={(e) => setDate(e.target.value)} type="date" />
      <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="0" step="0.01" />
      <div className="actions">
        <button onClick={() => setEditing(false)}>Cancel</button>
        <button onClick={() => { onEdit({ ...item, title, category, date, amount: parseFloat(amount) || 0 }); setEditing(false) }}>Save</button>
      </div>
    </div>
  )
}


