import { useEffect, useState } from 'react'
import { api } from '../api/client'

export default function Leaves() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    const params = {}
    if (status) params.status = status
    const r = await api.get('/api/leaves/all', { params })
    setItems(r.data)
    setLoading(false)
  }

  useEffect(()=>{ load() },[status])

  async function decide(id, action) {
    setError(null)
    try {
      await api.patch(`/api/leaves/${id}/${action}`, { decidedBy: 'HR Admin' })
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Leave Requests</h2>
        <select className="select max-w-xs" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? 'Loading...' : (
        <table className="table">
          <thead>
            <tr>
              <th className="th">Employee</th>
              <th className="th">Dates</th>
              <th className="th">Days</th>
              <th className="th">Reason</th>
              <th className="th">Status</th>
              <th className="th">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(l => (
              <tr key={l._id}>
                <td className="td">{l.employee?.name} ({l.employee?.email})</td>
                <td className="td">{new Date(l.startDate).toLocaleDateString()} → {new Date(l.endDate).toLocaleDateString()}</td>
                <td className="td">{l.days}</td>
                <td className="td">{l.reason}</td>
                <td className="td">
                  {l.status === 'APPROVED' && <span className="badge badge-green">Approved</span>}
                  {l.status === 'PENDING' && <span className="badge badge-yellow">Pending</span>}
                  {l.status === 'REJECTED' && <span className="badge badge-red">Rejected</span>}
                </td>
                <td className="td">
                  {l.status === 'PENDING' ? (
                    <div className="flex gap-2">
                      <button className="btn" onClick={()=>decide(l._id, 'approve')}>Approve</button>
                      <button className="btn" onClick={()=>decide(l._id, 'reject')}>Reject</button>
                    </div>
                  ) : <span>-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
