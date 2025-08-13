import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Employees from './pages/Employees.jsx'
import AddEmployee from './pages/AddEmployee.jsx'
import ApplyLeave from './pages/ApplyLeave.jsx'
import Leaves from './pages/Leaves.jsx'
import NotFound from './pages/NotFound.jsx'
import Navbar from './components/Navbar.jsx'

export default function App() {
  return (
    <div>
      <Navbar />
      <main className="container py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/new" element={<AddEmployee />} />
          <Route path="/leaves/apply" element={<ApplyLeave />} />
          <Route path="/leaves" element={<Leaves />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
