import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [employeeCount, setEmployeeCount] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [approvedCount, setApprovedCount] = useState(0)
  const [recentLeaves, setRecentLeaves] = useState([])

  useEffect(() => {
    async function load() {
      try {
        setError(null)
        setLoading(true)
        const [empRes, leavesRes] = await Promise.all([
          api.get('/api/employees/all'),
          api.get('/api/leaves/all')
        ])
        const employees = empRes.data || []
        const leaves = leavesRes.data || []
        setEmployeeCount(employees.length)
        setPendingCount(leaves.filter(l => l.status === 'PENDING').length)
        setApprovedCount(leaves.filter(l => l.status === 'APPROVED').length)
        setRecentLeaves(leaves.slice(0, 5))
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 text-white shadow-xl">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome to Leave Management</h1>
              <p className="text-white/80 mt-2">Manage employees and leave requests with speed and clarity.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/leaves/apply" className="btn bg-white text-indigo-700 border-white hover:bg-white/90">Apply Leave</Link>
              <Link to="/employees/new" className="btn bg-indigo-50 text-indigo-800 border-indigo-50 hover:bg-white">Add Employee</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <StatCard
          loading={loading}
          title="Employees"
          value={employeeCount}
          gradient="from-indigo-500 to-sky-500"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-4.418 0-8 2.239-8 5v2h16v-2c0-2.761-3.582-5-8-5Z" fill="currentColor"/></svg>
          }
        />
        <StatCard
          loading={loading}
          title="Pending"
          value={pendingCount}
          gradient="from-amber-500 to-yellow-500"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm1-10.414V7h-2v6h5v-2h-3Z" fill="currentColor"/></svg>
          }
        />
        <StatCard
          loading={loading}
          title="Approved"
          value={approvedCount}
          gradient="from-emerald-500 to-green-500"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-1.293-6.707-3-3 1.414-1.414L10.707 12.586l4.586-4.586 1.414 1.414-6 6Z" fill="currentColor"/></svg>
          }
        />
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Leave Activity</h2>
            <Link to="/leaves" className="text-indigo-700 hover:underline">View all</Link>
          </div>
          {error && <div className="text-red-600 mb-3">{error}</div>}
          {loading ? (
            <SkeletonTable rows={5} cols={5} />
          ) : recentLeaves.length === 0 ? (
            <div className="text-gray-500">No recent activity</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Employee</th>
                  <th className="th">Dates</th>
                  <th className="th">Days</th>
                  <th className="th">Reason</th>
                  <th className="th">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.map(l => (
                  <tr key={l._id}>
                    <td className="td">{l.employee?.name} ({l.employee?.email})</td>
                    <td className="td">{new Date(l.startDate).toLocaleDateString()} 
                      <span className="mx-1">→</span>
                      {new Date(l.endDate).toLocaleDateString()}</td>
                    <td className="td">{l.days}</td>
                    <td className="td">{l.reason || '-'}</td>
                    <td className="td">
                      {l.status === 'APPROVED' && <span className="badge badge-green">Approved</span>}
                      {l.status === 'PENDING' && <span className="badge badge-yellow">Pending</span>}
                      {l.status === 'REJECTED' && <span className="badge badge-red">Rejected</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ActionLink to="/employees/new" label="Add Employee" color="indigo">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2h5Z" fill="currentColor"/></svg>
            </ActionLink>
            <ActionLink to="/employees" label="View Employees" color="sky">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" fill="currentColor"/></svg>
            </ActionLink>
            <ActionLink to="/leaves/apply" label="Apply Leave" color="emerald">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M7 3h10v2H7V3ZM5 7h14v14H5V7Zm4 4h6v6H9v-6Z" fill="currentColor"/></svg>
            </ActionLink>
            <ActionLink to="/leaves" label="Review Leaves" color="amber">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M4 4h16v2H4V4Zm0 4h16v10H4V8Zm2 2v6h12v-6H6Z" fill="currentColor"/></svg>
            </ActionLink>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({ loading, title, value, gradient, icon }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow border border-gray-100">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
      <div className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="text-gray-500 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 text-gray-600">{icon}</span>
            <span className="font-medium">{title}</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{loading ? '…' : value}</span>
        </div>
      </div>
    </div>
  )
}

function ActionLink({ to, label, color, children }) {
  const base = `flex items-center gap-2 rounded-xl border px-4 py-3 transition hover:shadow bg-white`;
  const ring = {
    indigo: 'hover:border-indigo-300 hover:bg-indigo-50/50',
    sky: 'hover:border-sky-300 hover:bg-sky-50/50',
    emerald: 'hover:border-emerald-300 hover:bg-emerald-50/50',
    amber: 'hover:border-amber-300 hover:bg-amber-50/50'
  }[color] || ''
  const text = {
    indigo: 'text-indigo-700',
    sky: 'text-sky-700',
    emerald: 'text-emerald-700',
    amber: 'text-amber-700'
  }[color] || 'text-gray-700'
  return (
    <Link to={to} className={`${base} ${ring} ${text} border-gray-200`}>
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-700">{children}</span>
      <span className="font-medium">{label}</span>
    </Link>
  )
}

function SkeletonTable({ rows = 3, cols = 4 }) {
  return (
    <div className="animate-pulse">
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className="h-8 bg-gray-100 rounded border border-gray-100 m-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
