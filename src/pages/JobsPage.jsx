import NewJobForm from "../components/NewJobForm"
import ClientList from "../components/ClientList"
import JobList from "../components/JobList"
import NewClientForm from "../components/NewClientForm"
import { getJobs } from "../api/jobs"
import { useState, useEffect, useMemo } from "react"
import { getJobDates } from "../api/jobDates"
import Loader from "../components/Loader"
import { useOrganization } from "../components/OrganizationProvider"

export default function JobsPage() {
  const { organization } = useOrganization()
  const [jobs, setJobs] = useState([])
  const [formOpened, setFormOpened] = useState(false)
  const [jobDates, setJobDates] = useState([])
  const [error, setError] = useState(null)
  const [start_date, setStartDate] = useState("2026-01-01")
  const [end_date, setEndDate] = useState("2026-12-31")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true) 
  
  const totalProfit = useMemo(() => {
    const sum = jobDates.reduce((total, row) => total + Number(row.price || 0), 0)
    return sum.toLocaleString("en-US", { style: "currency", currency: "USD" })
  }, [jobDates])

  const filteredJobs = jobs.filter((job) =>
    job.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  function loadAll() {
    setIsLoading(true)
    setError(null)
    Promise.all([
      getJobs().then(setJobs),
      getJobDates({start_date: start_date, end_date: end_date }).then(setJobDates),
    ])
    .catch((err) => setError(err.message))
    .finally(() => setIsLoading(false))
}
  
  useEffect(() => {
    loadAll()
  }, [start_date, end_date])

  if (isLoading) {
    return (
      <section className="flex min-h-screen flex-1 items-center justify-center bg-slate-50">
        <Loader message="Loading jobs…" />
      </section>
    )
  }

  return (
    <section className="flex-1 overflow-y-auto bg-slate-50 min-h-screen p-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Jobs
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Job list
          </h1>
          <p className="mt-1 text-slate-600">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} total
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
        <label className="relative block w-full min-w-[14rem] sm:w-64">
            <span className="sr-only">Search jobs</span>
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            <p className="mt-1 text-slate-600">{totalProfit} total profit</p>
          </div>
        </div>
      </header>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <JobList jobs={filteredJobs} />

      {formOpened && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={() => setFormOpened(false)}
      >
        <div
          className="w-full max-w-md rounded-xl bg-white p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-center mb-5 font-bold">Add Job</h2>
          <NewJobForm
            onCancel={() => setFormOpened(false)}
            onSuccess={() => {
              setFormOpened(false)
              loadJobs()
            }}
            default_start_date={organization.default_start_date}
            default_end_date={organization.default_end_date}
          />
        </div>
      </div>
    )}
    </section>
  )
}