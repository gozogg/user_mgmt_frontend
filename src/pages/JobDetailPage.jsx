import { Link, useNavigate, useParams, useLocation } from "react-router-dom"
import { useEffect, useState, useMemo } from "react"
import { deleteJob, getJobs } from "../api/jobs"
import { getJobDates, updateJobDate } from "../api/jobDates"
import NewJobForm from "../components/NewJobForm"
import {
  JOB_DATE_STATUSES,
  jobDateStatusClass,
  jobDateStatusIcon,
  jobDateStatusLabel,
} from "../utils/jobDateStatus"

function formatDate(value) {
  if (!value) return ""
  return String(value).slice(0, 10)
}

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [jobDates, setJobDates] = useState([])
  const [formOpened, setFormOpened] = useState(false)
  const [error, setError] = useState(null)
  const [savingDate, setSavingDate] = useState(null)
  const location = useLocation()
  const backTo = location.state?.from ?? "/jobs"

  const totalProfit = useMemo(() => {
    const sum = jobDates.reduce((total, row) => total + Number(row.price || 0), 0)
    return sum.toLocaleString("en-US", { style: "currency", currency: "USD" })
  }, [jobDates])

  const completedCount = jobDates.filter((row) => row.status === "complete").length
  const invoicedCount = jobDates.filter((row) => row.status === "invoiced").length

  function loadJob() {
    setError(null)
    getJobs({ job_id: id })
      .then((data) => setJob(data[0] ?? null))
      .catch((err) => setError(err.message))
  }

  function loadJobDates() {
    setError(null)
    getJobDates({ job_id: id })
      .then(setJobDates)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadJob()
    loadJobDates()
  }, [id])

  async function handleStatusChange(row, status) {
    const date = formatDate(row.date)
    setSavingDate(date)
    setError(null)
    try {
      await updateJobDate(id, date, { status })
      setJobDates((prev) =>
        prev.map((item) =>
          formatDate(item.date) === date ? { ...item, status } : item
        )
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingDate(null)
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this job and all of its dates?")) return
    setError(null)
    try {
      await deleteJob(id)
      navigate(job?.client_id ? `/clients/${job.client_id}` : "/jobs")
    } catch (err) {
      setError(err.message)
    }
  }

  const price =
    job?.price != null && !Number.isNaN(Number(job.price))
      ? Number(job.price).toLocaleString("en-US", { style: "currency", currency: "USD" })
      : "—"

  return (
    <section className="flex-1 overflow-y-auto bg-slate-50 min-h-screen p-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to={backTo}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            ← Back
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            {job?.description || "Job"}
          </h1>
          <p className="mt-1 text-slate-600">
            {job?.first_name} {job?.last_name}
            {job?.frequency ? ` · ${job.frequency}` : ""}
            {` · ${totalProfit}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFormOpened(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
          >
            <i className="fa-solid fa-pencil text-xs"></i>
            Edit job
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
          >
            <i className="fa-solid fa-trash text-xs"></i>
            Delete
          </button>
        </div>
      </header>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Details</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {job?.frequency && (
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-repeat w-4 text-center text-slate-400"></i>
                <span className="capitalize">{job.frequency}</span>
              </div>
            )}
            {(job?.start_date || job?.end_date) && (
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-calendar-days w-4 text-center text-slate-400"></i>
                <span>
                  {formatDate(job.start_date)}
                  {job.end_date ? ` – ${formatDate(job.end_date)}` : ""}
                </span>
              </div>
            )}
            {job?.day_of_week && (
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-clock w-4 text-center text-slate-400"></i>
                <span className="capitalize">{job.day_of_week}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-dollar-sign w-4 text-center text-slate-400"></i>
              <span>{price}</span>
            </div>
            {job?.day_of_week && (
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-location-dot w-4 text-center text-slate-400"></i>
              <span>{job.address}, {job.city}</span>
            </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Dates</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{jobDates.length}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Completed</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{completedCount}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Invoiced</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{invoicedCount}</p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Scheduled dates</h2>
        <p className="mt-1 text-sm text-slate-500">
          Update status to not complete, complete, or invoiced.
        </p>
      </div>

      {!jobDates.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <i className="fa-solid fa-calendar mb-3 text-2xl text-slate-400"></i>
          <p className="text-slate-600">No job dates yet</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {jobDates.map((row) => {
            const date = formatDate(row.date)
            const isSaving = savingDate === date

            return (
              <li
                key={date}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <i className={`fa-solid ${jobDateStatusIcon(row.status)}`}></i>
                  <div>
                    <p className="font-medium text-slate-900">{date}</p>
                    <span
                      className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${jobDateStatusClass(row.status)}`}
                    >
                      {jobDateStatusLabel(row.status)}
                    </span>
                  </div>
                </div>

                <select
                  value={row.status || "not_complete"}
                  disabled={isSaving}
                  onChange={(e) => handleStatusChange(row, e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
                >
                  {JOB_DATE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {jobDateStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </li>
            )
          })}
        </ul>
      )}

      {formOpened && job && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setFormOpened(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-5 text-center text-lg font-bold text-slate-900">Edit job</h2>
            <NewJobForm
              job={job}
              client_id={job.client_id}
              onCancel={() => setFormOpened(false)}
              onSuccess={() => {
                setFormOpened(false)
                loadJob()
                loadJobDates()
              }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
