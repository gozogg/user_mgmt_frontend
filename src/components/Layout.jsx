import { NavLink, Outlet } from "react-router-dom"
import { useState } from "react"

export default function Layout() {
  const [page, setPage] = useState("")

  function handleClick(page) {
    setPage(page)
  }

  return (
    <div className="flex h-screen">
    <div className="hidden md:flex flex-col w-64 bg-gray-800 h-screen">
        <div className="flex items-center justify-center h-16 bg-gray-900">
            <NavLink to="/" onClick={() => handleClick('home')} className="text-white font-bold uppercase">User Management</NavLink>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 bg-gray-800">
              <div className={`flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700 gap-3 ${page == 'daily' ? 'bg-gray-700': ''}`}>
                <i className="fa-solid fa-calendar-day"></i>
                <NavLink to="/day" onClick={() => handleClick('daily')}>Daily</NavLink>
              </div>
              <div className={`flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700 gap-3 ${page == 'weekly' ? 'bg-gray-700': ''}`}>
              <i className="fa-solid fa-calendar-days"></i>
                <NavLink to="/week" onClick={() => handleClick('weekly')}>Weekly</NavLink>
              </div>
              <div className={`flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700 gap-3 ${page == 'clients' ? 'bg-gray-700': ''}`}>
              <i className="fa-solid fa-user"></i>
                <NavLink to="/clients" onClick={() => handleClick('clients')}>Clients</NavLink>
              </div>
              <div className={`flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700 gap-3 ${page == 'jobs' ? 'bg-gray-700': ''}`}>
              <i className="fa-solid fa-briefcase"></i>
                <NavLink to="/jobs" onClick={() => handleClick('jobs')}>Jobs</NavLink>
              </div>
              {/* <div className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700 gap-3">
                <i className="fa-solid fa-calendar-day"></i>
                <NavLink to="/map" onClick={handleClick('map')}>Map</NavLink>
              </div> */}
            </nav>
        </div>
      </div>
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
