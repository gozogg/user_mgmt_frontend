import { NavLink, Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div>
      <nav>
        <NavLink to="/">Daily</NavLink>
        {" | "}
        <NavLink to="/week">Weekly</NavLink>
        {" | "}
        <NavLink to="/clients">Clients</NavLink>
        {" | "}
        <NavLink to="/jobs">Jobs</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}
