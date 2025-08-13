import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function AddEmployee() {
  const nav = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', department:'', joiningDate:'', leaveBalanceDays:24 })
  const [error, setError] = useState(null)

  function onChange(e){
    const {name, value} = e.target
    setForm(prev => ({...prev, [name]: value}))
  }

  async function onSubmit(e){
    e.preventDefault()
    setError(null)
    try {
      await api.post('/api/employees/addEmployee', form)
      nav('/employees')
    } catch (err) {
      setError(err.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="card max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" placeholder="Name" name="name" value={form.name} onChange={onChange} required />
        <input className="input" placeholder="Email" name="email" type="email" value={form.email} onChange={onChange} required />
        <input className="input" placeholder="Department" name="department" value={form.department} onChange={onChange} required />
        <input className="input" placeholder="Joining Date" name="joiningDate" type="date" value={form.joiningDate} onChange={onChange} required />
        <input className="input" placeholder="Initial Leave Balance" name="leaveBalanceDays" type="number" min="0" value={form.leaveBalanceDays} onChange={onChange} />
        {error && <div className="text-red-600">{error}</div>}
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  )
}
