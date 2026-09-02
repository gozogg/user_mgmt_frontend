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
import LoginPage from "./pages/LoginPage"
import { OrganizationProvider } from "./components/OrganizationProvider"
import { AuthProvider } from "./auth/AuthProvider"
import RequireAuth from "./auth/RequireAuth"
import "@fortawesome/fontawesome-free/css/all.min.css"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route
              element={
                <OrganizationProvider>
                  <Layout />
                </OrganizationProvider>
              }
            >
              <Route path="/" element={<HomePage />} />
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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
