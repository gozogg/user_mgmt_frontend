import { NavLink, Outlet } from "react-router-dom"

const navItems = [
  { to: "/day", label: "Daily", icon: "fa-calendar-day" },
  { to: "/week", label: "Weekly", icon: "fa-calendar-days" },
  { to: "/clients", label: "Clients", icon: "fa-users" },
  { to: "/jobs", label: "Jobs", icon: "fa-briefcase" },
]

function linkClass({ isActive }) {
  return [
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
    isActive
      ? "bg-slate-700 text-white shadow-sm"
      : "text-slate-300 hover:bg-slate-800 hover:text-white",
  ].join(" ")
}

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-slate-900/40 bg-slate-900 md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700 text-white">
            <i className="fa-solid fa-layer-group text-sm"></i>
          </div>
          <div className="min-w-0">
            <NavLink to="/" className="block truncate text-sm font-semibold text-white">
              User Management
            </NavLink>
            <p className="truncate text-xs text-slate-400">Jobs & clients</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <i className={`fa-solid ${item.icon} w-4 text-center text-xs opacity-80`}></i>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <p className="text-xs text-slate-500">Manage schedules and clients</p>
        </div>
      </aside>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
