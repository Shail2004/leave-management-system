import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

export default function Employees() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchEmail, setSearchEmail] = useState('')
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState(null)

  async function loadAll(){
    setLoading(true)
    setError(null)
    try {
      const r = await api.get('/api/employees/all')
      setItems(r.data)
    } catch(e) {
      setError(e.response?.data?.message || 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    loadAll()
  },[])

  async function onSearch(e){
    e.preventDefault()
    if (!searchEmail) return loadAll()
    setSearching(true)
    setError(null)
    try {
      const r = await api.get('/api/employees/byEmail', { params: { email: searchEmail } })
      setItems(r.data ? [r.data] : [])
    } catch(e) {
      setItems([])
      setError(e.response?.data?.message || 'No employee found')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Employees</h2>
        <Link className="btn btn-primary" to="/employees/new">Add Employee</Link>
      </div>

      <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          className="input"
          placeholder="Search by email (e.g. jane@company.com)"
          value={searchEmail}
          onChange={e=>setSearchEmail(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="btn" type="submit" disabled={searching}>{searching ? 'Searching…' : 'Search'}</button>
          <button className="btn" type="button" onClick={loadAll}>Reset</button>
        </div>
      </form>

      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? 'Loading...' : (
        <table className="table">
          <thead>
            <tr>
              <th className="th">Name</th>
              <th className="th">Email</th>
              <th className="th">Department</th>
              <th className="th">Joining</th>
              <th className="th">Balance</th>
            </tr>
          </thead>
          <tbody>
            {items.map(e => (
              <tr key={e._id}>
                <td className="td">{e.name}</td>
                <td className="td">{e.email}</td>
                <td className="td">{e.department}</td>
                <td className="td">{new Date(e.joiningDate).toLocaleDateString()}</td>
                <td className="td">{e.leaveBalanceDays}</td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td className="td" colSpan="5">No employees to display</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
