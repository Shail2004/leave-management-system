import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const link = "px-3 py-2 rounded-lg hover:bg-gray-100"
  const active = ({isActive}) => isActive ? link + " bg-gray-200" : link
  return (
    <header className="bg-white shadow">
      <nav className="container flex items-center justify-between py-3">
        <div className="font-bold">Admin Dashboard</div>
        <div className="flex gap-2">
          <NavLink className={active} to="/">Dashboard</NavLink>
          <NavLink className={active} to="/employees">Employees</NavLink>
          <NavLink className={active} to="/leaves">Leaves</NavLink>
          <NavLink className={active} to="/leaves/apply">Apply</NavLink>
        </div>
      </nav>
    </header>
  )
}
