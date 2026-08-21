import NewJobForm from "../components/NewJobForm"
import ClientList from "../components/ClientList"
import JobList from "../components/JobList"
import NewClientForm from "../components/NewClientForm"
import { getJobs } from "../api/jobs"
import { useState, useEffect, useMemo } from "react"
import { getJobDates } from "../api/jobDates"


export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [formOpened, setFormOpened] = useState(false)
  const [jobDates, setJobDates] = useState([])
  const [error, setError] = useState(null)
  const [start_date, setStartDate] = useState("2026-01-01")
  const [end_date, setEndDate] = useState("2026-12-31")
  
  const totalProfit = useMemo(() => {
    const sum = jobDates.reduce((total, row) => total + Number(row.price || 0), 0)
    return sum.toLocaleString("en-US", { style: "currency", currency: "USD" })
  }, [jobDates])

  function loadJobs() {
    setError(null)
    getJobs()
      .then(setJobs)
      .catch((err) => setError(err.message))
  }
  function loadJobDates() {
    setError(null)
    getJobDates({start_date: start_date, end_date: end_date })
      .then(setJobDates)
      .catch((err) => setError(err.message))
  }  
  
  useEffect(() => {
    loadJobs()
    loadJobDates()
  }, [start_date, end_date])

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
        <div className="flex flex-wrap gap-2">
          <p className="mt-1 text-slate-600">{totalProfit} total profit</p>
        </div>
      </header>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <JobList jobs={jobs} />

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
          />
        </div>
      </div>
    )}
    </section>
  )
}