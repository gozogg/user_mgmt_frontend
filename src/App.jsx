import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import DailyDashboard from "./pages/DailyDashboard"
import WeeklyDashboard from "./pages/WeeklyDashboard"
import ClientsPage from "./pages/ClientsPage"
import ClientDetailPage from "./pages/ClientDetailPage"
import JobsPage from "./pages/JobsPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DailyDashboard />} />
          <Route path="/week" element={<WeeklyDashboard />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:id" element={<ClientDetailPage />} />
          <Route path="/jobs" element={<JobsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
