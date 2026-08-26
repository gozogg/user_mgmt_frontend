import { useEffect, useState } from "react"
import { deleteJobDate, getJobDates, updateJobDate } from "../api/jobDates"
import DailyJobDateItem from "../components/DailyJobDateItem"
import DailyMap from "../components/DailyMap"

function formatDate(value) {
  if (!value) return ""
  return String(value).slice(0, 10)
}

function shiftDateString(dateStr, days) {
  const d = new Date(`${dateStr}T12:00:00`)
  d.setDate(d.getDate() + days)
  return todayFromDate(d)
}

function todayFromDate(d = new Date()) {
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${month}-${day}`
}

function today() {
  return todayFromDate(new Date())
}

export default function DailyDashboard() {
  const [date, setDate] = useState(today)
  const [jobDates, setJobDates] = useState([])
  const [error, setError] = useState(null)
  const [savingKey, setSavingKey] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const completedCount = jobDates.filter((row) => row.status === "complete").length
  const invoicedCount = jobDates.filter((row) => row.status === "invoiced").length

  const filteredJobs = jobDates.filter((job) =>
    job.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function loadJobDates() {
    setError(null)
    getJobDates({ date })
      .then(setJobDates)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadJobDates()
  }, [date])

  async function handleStatusChange(row, status) {
    const rowDate = formatDate(row.date)
    const key = `${row.job_id}-${rowDate}`

    setSavingKey(key)
    setError(null)
    try {
      await updateJobDate(row.job_id, rowDate, { status })
      setJobDates((prev) =>
        prev.map((item) =>
          item.job_id === row.job_id && formatDate(item.date) === rowDate
            ? { ...item, status }
            : item
        )
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingKey(null)
    }
  }

  async function handleDateChange(row, newDate) {
    const oldDate = formatDate(row.date)
    // If moved off the currently viewed day, drop it from this list.
    if (newDate !== date) {
      setJobDates((prev) =>
        prev.filter(
          (item) =>
            !(item.job_id === row.job_id && formatDate(item.date) === oldDate)
        )
      )
      return
    }
    loadJobDates()
  }

  async function handleDelete(row) {
    const rowDate = formatDate(row.date)
    const key = `${row.job_id}-${rowDate}`
    if (!window.confirm("Delete this job date?")) return

    setSavingKey(key)
    setError(null)
    try {
      await deleteJobDate(row.job_id, rowDate)
      setJobDates((prev) =>
        prev.filter(
          (item) =>
            !(item.job_id === row.job_id && formatDate(item.date) === rowDate)
        )
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingKey(null)
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Daily
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Daily dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {jobDates.length} {jobDates.length === 1 ? "job" : "jobs"} ·{" "}
              {completedCount} complete · {invoicedCount} invoiced
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <label className="relative block w-full min-w-[14rem] sm:w-64">
              <span className="sr-only">Search client names</span>
              <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
              <input
                type="text"
                placeholder="Search clients…"
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
          
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Date</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDate((prev) => shiftDateString(prev, -1))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
                aria-label="Previous day"
              >
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
              <button
                type="button"
                onClick={() => setDate((prev) => shiftDateString(prev, 1))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
                aria-label="Next day"
              >
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
              {date !== today() && (
                <button
                  type="button"
                  onClick={() => setDate(today())}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Today
                </button>
              )}
            </div>
          </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-2">
        <div className="min-h-0 overflow-y-auto border-r border-slate-200 p-6">
          {!jobDates.length ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <i className="fa-solid fa-calendar-day mb-3 text-2xl text-slate-400"></i>
              <p className="text-slate-600">No jobs scheduled</p>
              <p className="mt-1 text-sm text-slate-500">
                Pick another date or add jobs for this day.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {jobDates.map((row) => {
                const key = `${row.job_id}-${formatDate(row.date)}`
                return (
                  <DailyJobDateItem
                    key={key}
                    row={row}
                    isSaving={savingKey === key}
                    onStatusChange={handleStatusChange}
                    onDateChange={handleDateChange}
                    onDelete={handleDelete}
                  />
                )
              })}
            </ul>
          )}
        </div>

        <div className="hidden min-h-0 bg-slate-100 p-6 lg:block">
          <DailyMap
            jobs={jobDates}
            center={[-83.35697, 42.43716]}
            zoom={9}
          />
        </div>
      </div>
    </section>
  )
}
