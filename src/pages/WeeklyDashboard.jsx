import { useEffect, useMemo, useState } from "react"
import { deleteJobDate, getJobDates, updateJobDate } from "../api/jobDates"
import DailyJobDateItem from "../components/DailyJobDateItem"

function toDateString(d) {
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${month}-${day}`
}

function startOfWeek(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day // Monday start
  d.setDate(d.getDate() + diff)
  return d
}

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatDate(value) {
  if (!value) return ""
  return String(value).slice(0, 10)
}

function formatDayHeading(dateStr) {
  const d = new Date(`${dateStr}T12:00:00`)
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export default function WeeklyDashboard() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek())
  const [jobDates, setJobDates] = useState([])
  const [error, setError] = useState(null)
  const [savingKey, setSavingKey] = useState(null)

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => toDateString(addDays(weekStart, i))),
    [weekStart]
  )

  const start_date = weekDays[0]
  const end_date = weekDays[6]

  const jobsByDay = useMemo(() => {
    const map = Object.fromEntries(weekDays.map((day) => [day, []]))
    for (const row of jobDates) {
      const day = formatDate(row.date)
      if (map[day]) map[day].push(row)
    }
    return map
  }, [jobDates, weekDays])

  const completedCount = jobDates.filter((row) => row.status === "complete").length
  const invoicedCount = jobDates.filter((row) => row.status === "invoiced").length

  useEffect(() => {
    setError(null)
    getJobDates({ start_date, end_date })
      .then(setJobDates)
      .catch((err) => setError(err.message))
  }, [start_date, end_date])

  function loadJobDates() {
    setError(null)
    getJobDates({ start_date, end_date })
      .then(setJobDates)
      .catch((err) => setError(err.message))
  }

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

  async function handleDateChange() {
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

  function shiftWeek(delta) {
    setWeekStart((prev) => addDays(prev, delta * 7))
  }

  const rangeLabel = `${formatDayHeading(start_date)} – ${formatDayHeading(end_date)}`

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Weekly
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Weekly dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {rangeLabel} · {jobDates.length}{" "}
              {jobDates.length === 1 ? "job" : "jobs"} · {completedCount} complete ·{" "}
              {invoicedCount} invoiced
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => shiftWeek(-1)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <i className="fa-solid fa-chevron-left text-xs"></i>
              Prev
            </button>
            <button
              type="button"
              onClick={() => setWeekStart(startOfWeek())}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              This week
            </button>
            <button
              type="button"
              onClick={() => shiftWeek(1)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Next
              <i className="fa-solid fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-4 md:p-6">
        <div className="grid min-w-[64rem] grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const rows = jobsByDay[day] || []
            const isToday = day === toDateString(new Date())

            return (
              <div
                key={day}
                className={`flex min-h-[28rem] flex-col rounded-xl border bg-white shadow-sm ${
                  isToday ? "border-slate-400 ring-1 ring-slate-300" : "border-slate-200"
                }`}
              >
                <div
                  className={`border-b px-3 py-3 ${
                    isToday ? "border-slate-300 bg-slate-100" : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {formatDayHeading(day)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {rows.length} {rows.length === 1 ? "job" : "jobs"}
                  </p>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto p-2">
                  {!rows.length ? (
                    <p className="px-1 py-6 text-center text-xs text-slate-400">No jobs</p>
                  ) : (
                    <ul className="space-y-2">
                      {rows.map((row) => {
                        const key = `${row.job_id}-${formatDate(row.date)}`
                        return (
                          <DailyJobDateItem
                            key={key}
                            row={row}
                            compact
                            from="/week"
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
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
