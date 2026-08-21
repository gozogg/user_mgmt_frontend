import { useEffect, useState } from "react"
import { deleteJobDate, getJobDates, updateJobDate } from "../api/jobDates"
import DailyJobDateItem from "../components/DailyJobDateItem"

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

  const completedCount = jobDates.filter((row) => row.status === "complete").length
  const invoicedCount = jobDates.filter((row) => row.status === "invoiced").length

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
          <div className="flex h-full min-h-[24rem] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center">
            <i className="fa-solid fa-map-location-dot mb-3 text-3xl text-slate-400"></i>
            <p className="font-medium text-slate-700">Map placeholder</p>
            <p className="mt-1 max-w-xs text-sm text-slate-500">
              Job locations for this day will appear here once Mapbox is wired up.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
