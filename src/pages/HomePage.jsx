import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getClients } from "../api/clients"
import { getJobs } from "../api/jobs"
import { getJobDates } from "../api/jobDates"
import { jobDateStatusClass, jobDateStatusLabel } from "../utils/jobDateStatus"

function today() {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${month}-${day}`
}

function formatDateLabel(dateStr) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

const quickLinks = [
  {
    to: "/day",
    label: "Daily dashboard",
    description: "See today’s jobs and update their status",
    icon: "fa-calendar-day",
  },
  {
    to: "/week",
    label: "Weekly schedule",
    description: "Browse the full week at a glance",
    icon: "fa-calendar-days",
  },
  {
    to: "/clients",
    label: "Clients",
    description: "Manage client details and contact info",
    icon: "fa-users",
  },
  {
    to: "/jobs",
    label: "Jobs",
    description: "View and edit all service jobs",
    icon: "fa-briefcase",
  },
]

export default function HomePage() {
  const [clientsCount, setClientsCount] = useState(0)
  const [jobsCount, setJobsCount] = useState(0)
  const [todaysJobs, setTodaysJobs] = useState([])
  const [error, setError] = useState(null)
  const date = today()

  const completedToday = todaysJobs.filter((row) => row.status === "complete").length
  const invoicedToday = todaysJobs.filter((row) => row.status === "invoiced").length
  const remainingToday = todaysJobs.filter((row) => row.status === "not_complete").length

  useEffect(() => {
    setError(null)
    Promise.all([getClients(), getJobs(), getJobDates({ date })])
      .then(([clients, jobs, jobDates]) => {
        setClientsCount(clients.length)
        setJobsCount(jobs.length)
        setTodaysJobs(jobDates)
      })
      .catch((err) => setError(err.message))
  }, [])

  return (
    <section className="flex-1 overflow-y-auto bg-slate-50 min-h-screen p-8">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Home
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          Welcome back
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Here’s a quick look at your clients, jobs, and what’s on the schedule for{" "}
          {formatDateLabel(date)}.
        </p>
      </header>

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Clients
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{clientsCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Jobs
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{jobsCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Today
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{todaysJobs.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Remaining today
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{remainingToday}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Quick links</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-white">
                  <i className={`fa-solid ${link.icon} text-sm`}></i>
                </div>
                <p className="font-semibold text-slate-900 group-hover:text-slate-700">
                  {link.label}
                </p>
                <p className="mt-1 text-sm text-slate-500">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Today’s jobs</h2>
            <Link
              to="/day"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Open daily →
            </Link>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            {!todaysJobs.length ? (
              <div className="px-5 py-12 text-center">
                <i className="fa-solid fa-calendar-day mb-3 text-2xl text-slate-400"></i>
                <p className="text-slate-600">Nothing scheduled today</p>
                <p className="mt-1 text-sm text-slate-500">
                  {completedToday} complete · {invoicedToday} invoiced · {remainingToday}{" "}
                  remaining
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {todaysJobs.slice(0, 6).map((row) => {
                  const name = [row.first_name, row.last_name].filter(Boolean).join(" ")
                  return (
                    <li key={`${row.job_id}-${row.date}`} className="px-5 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">
                            {row.description || "Untitled job"}
                          </p>
                          {name && (
                            <p className="truncate text-sm text-slate-500">{name}</p>
                          )}
                        </div>
                        <span
                          className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium ${jobDateStatusClass(row.status)}`}
                        >
                          {jobDateStatusLabel(row.status)}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
