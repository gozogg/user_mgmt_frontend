import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  applySchedule,
  getUnassignedJobs,
  previewSchedule,
} from "../api/schedule"
import { DAYS_OF_WEEK, jobDateStatusLabel, jobDayColor } from "../utils/jobDay"

function todayString() {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${month}-${day}`
}

function endOfYearString() {
  const d = new Date()
  return `${d.getFullYear()}-12-31`
}

export default function SchedulePage() {
  const [fromDate, setFromDate] = useState(todayString)
  const [toDate, setToDate] = useState(endOfYearString)
  const [unassigned, setUnassigned] = useState([])
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState(false)
  const [applyResult, setApplyResult] = useState(null)

  function loadUnassigned() {
    setError(null)
    getUnassignedJobs()
      .then(setUnassigned)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadUnassigned()
  }, [])

  async function handlePreview() {
    setLoading(true)
    setError(null)
    setApplyResult(null)
    try {
      const result = await previewSchedule({
        from_date: fromDate,
        to_date: toDate,
      })
      setPreview(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleApply() {
    if (!preview) return
    if (
      !window.confirm(
        "Apply this schedule? Future job dates will be updated with new assignments and stop order."
      )
    ) {
      return
    }

    setApplying(true)
    setError(null)
    try {
      const result = await applySchedule({
        from_date: fromDate,
        to_date: toDate,
        preview,
      })
      setApplyResult(result)
      setPreview(null)
      loadUnassigned()
    } catch (err) {
      setError(err.message)
    } finally {
      setApplying(false)
    }
  }

  const totalStops = preview
    ? Object.values(preview.routes).reduce((sum, r) => sum + r.stop_count, 0)
    : 0

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Planning
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Schedule generator
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Assign unscheduled jobs and optimize visit order by weekday
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">From</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">To</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <button
              type="button"
              onClick={handlePreview}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              <i className={`fa-solid ${loading ? "fa-spinner fa-spin" : "fa-wand-magic-sparkles"} text-xs`}></i>
              {loading ? "Generating…" : "Generate preview"}
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {applyResult && (
          <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Schedule applied — {applyResult.assigned_jobs} job
            {applyResult.assigned_jobs === 1 ? "" : "s"} assigned,{" "}
            {applyResult.updated_stop_orders} stop order
            {applyResult.updated_stop_orders === 1 ? "" : "s"} updated.
          </p>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Needs a day ({unassigned.length})
                </h2>
                <p className="text-sm text-slate-600">
                  Recurring jobs without a weekday assignment
                </p>
              </div>
              {preview && preview.assignments.length > 0 && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                  {preview.assignments.length} will be assigned on apply
                </span>
              )}
            </div>

            {!unassigned.length ? (
              <p className="text-sm text-slate-500">
                All recurring jobs have a weekday assigned.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {unassigned.map((job) => {
                  const assignment = preview?.assignments?.find(
                    (a) => a.job_id === job.id
                  )
                  return (
                    <li
                      key={job.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div>
                        <Link
                          to={`/jobs/${job.id}`}
                          className="font-medium text-slate-900 hover:underline"
                        >
                          {job.first_name} {job.last_name}
                        </Link>
                        <p className="text-sm text-slate-600">{job.description}</p>
                        <p className="text-xs capitalize text-slate-500">
                          {job.frequency}
                        </p>
                      </div>
                      {assignment ? (
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">
                            Suggested:{" "}
                            <span className="capitalize">
                              {assignment.suggested_day_of_week}
                            </span>
                          </p>
                          {assignment.nearest_miles != null && (
                            <p className="text-xs text-slate-500">
                              {assignment.nearest_miles} mi to nearest stop
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">
                          Run preview to suggest a day
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {preview && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-600">
                  Preview for {preview.from_date} → {preview.to_date} ·{" "}
                  {totalStops} total stops across all days
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPreview(null)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={applying}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800 disabled:opacity-60"
                  >
                    <i className={`fa-solid ${applying ? "fa-spinner fa-spin" : "fa-check"} text-xs`}></i>
                    {applying ? "Applying…" : "Apply schedule"}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {DAYS_OF_WEEK.map((day) => {
                  const route = preview.routes[day]
                  const color = jobDayColor(day)
                  return (
                    <div
                      key={day}
                      className="rounded-xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div
                        className="border-b border-slate-100 px-4 py-3"
                        style={{ borderLeftWidth: 4, borderLeftColor: color }}
                      >
                        <h3 className="font-semibold text-slate-900">
                          {jobDateStatusLabel(day)}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {route.stop_count}{" "}
                          {route.stop_count === 1 ? "stop" : "stops"}
                          {route.estimated_miles > 0 &&
                            ` · ~${route.estimated_miles} mi`}
                        </p>
                      </div>
                      <ol className="space-y-1 p-3">
                        {!route.stops.length ? (
                          <li className="px-1 py-4 text-center text-xs text-slate-400">
                            No jobs
                          </li>
                        ) : (
                          route.stops.map((stop) => (
                            <li
                              key={stop.job_id}
                              className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50"
                            >
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-700">
                                {stop.stop_order}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate font-medium text-slate-900">
                                  {stop.first_name} {stop.last_name}
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                  {stop.description}
                                </p>
                              </div>
                            </li>
                          ))
                        )}
                      </ol>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {!preview && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <i className="fa-solid fa-route mb-3 text-2xl text-slate-400"></i>
              <p className="text-slate-600">No preview yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Set a date range and generate a preview to see weekday routes
                and suggested assignments.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
