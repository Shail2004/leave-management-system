import { useEffect, useState } from 'react'
import { api } from '../api/client'

export default function ApplyLeave() {
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({ employeeId:'', startDate:'', endDate:'', reason:'' })
  const [msg, setMsg] = useState(null)
  const [error, setError] = useState(null)

  useEffect(()=>{
    api.get('/api/employees/all').then(r=>setEmployees(r.data))
  },[])

  function onChange(e){
    const {name, value} = e.target
    setForm(prev => ({...prev, [name]: value}))
  }

  async function onSubmit(e){
    e.preventDefault()
    setMsg(null); setError(null)
    try {
      const r = await api.post('/api/leaves/apply', form)
      setMsg('Leave applied with id ' + r.data._id)
      setForm({ employeeId:'', startDate:'', endDate:'', reason:'' })
    } catch (err) {
      setError(err.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="card max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Apply Leave</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <select className="select" name="employeeId" value={form.employeeId} onChange={onChange} required>
          <option value="">Select Employee</option>
          {employees.map(e => <option key={e._id} value={e._id}>{e.name} ({e.email})</option>)}
        </select>
        <input className="input" name="startDate" type="date" value={form.startDate} onChange={onChange} required />
        <input className="input" name="endDate" type="date" value={form.endDate} onChange={onChange} required />
        <textarea className="input" name="reason" placeholder="Reason" value={form.reason} onChange={onChange} />
        {msg && <div className="text-green-700">{msg}</div>}
        {error && <div className="text-red-600">{error}</div>}
        <button className="btn btn-primary" type="submit">Apply</button>
      </form>
    </div>
  )
}
