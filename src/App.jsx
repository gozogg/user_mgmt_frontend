import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import DailyDashboard from "./pages/DailyDashboard"
import WeeklyDashboard from "./pages/WeeklyDashboard"
import ClientsPage from "./pages/ClientsPage"
import ClientDetailPage from "./pages/ClientDetailPage"
import JobsPage from "./pages/JobsPage"
import JobDetailPage from "./pages/JobDetailPage"
import HomePage from "./pages/HomePage"
import MapPage from "./pages/MapPage"
import SchedulePage from "./pages/SchedulePage"
import OrganizationPage from "./pages/OrganizationPage"
import { OrganizationProvider } from "./components/OrganizationProvider"
import "@fortawesome/fontawesome-free/css/all.min.css"

export default function App() {
  return (
    <OrganizationProvider>
      <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage/>} />
          <Route path="/day" element={<DailyDashboard />} />
          <Route path="/week" element={<WeeklyDashboard />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:id" element={<ClientDetailPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/organization" element={<OrganizationPage />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </OrganizationProvider>
  )
}
