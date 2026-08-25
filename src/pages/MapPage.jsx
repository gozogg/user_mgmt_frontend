import { useEffect, useState } from "react"
import FullMap from "../components/FullMap"
import { getJobs } from "../api/jobs"
import {
  DAYS_OF_WEEK,
  jobDateStatusLabel,
  jobDayColor,
} from "../utils/jobDay"

const FREQUENCIES = [
  { value: "onetime", label: "One time" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
]

function toggleValue(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]
}

function FilterSection({ label, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </div>
  )
}

export default function MapPage() {
  const [jobs, setJobs] = useState([])
  const [error, setError] = useState(null)
  const [frequencies, setFrequencies] = useState([])
  const [daysOfWeek, setDaysOfWeek] = useState([])

  const showDayFilter =
    frequencies.length === 0 || frequencies.some((f) => f !== "onetime")
  const hasFilters = frequencies.length > 0 || daysOfWeek.length > 0

  useEffect(() => {
    setError(null)
    getJobs({ frequency: frequencies, day_of_week: daysOfWeek })
      .then(setJobs)
      .catch((err) => setError(err.message))
  }, [frequencies, daysOfWeek])

  function clearFilters() {
    setFrequencies([])
    setDaysOfWeek([])
  }

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Map
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Job map</h1>
          <p className="mt-1 text-sm text-slate-600">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} shown
            {hasFilters ? " · filtered" : ""}
          </p>
        </div>
      </header>

      <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
          <FilterSection label="Frequency">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {FREQUENCIES.map(({ value, label }) => {
                const selected = frequencies.includes(value)
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setFrequencies((prev) => toggleValue(prev, value))
                    }
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                      selected
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </FilterSection>

          {showDayFilter && (
            <>
              <div className="hidden h-9 w-px shrink-0 bg-slate-200 sm:block" />
              <FilterSection label="Day of week">
                <div className="flex flex-wrap gap-1">
                  {DAYS_OF_WEEK.map((day) => {
                    const selected = daysOfWeek.includes(day)
                    return (
                      <button
                        key={day}
                        type="button"
                        aria-pressed={selected}
                        title={jobDateStatusLabel(day)}
                        onClick={() =>
                          setDaysOfWeek((prev) => toggleValue(prev, day))
                        }
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm transition ${
                          selected
                            ? "border-slate-300 bg-white text-slate-900 shadow-sm"
                            : "border-transparent text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: jobDayColor(day) }}
                        />
                        {jobDateStatusLabel(day).slice(0, 3)}
                      </button>
                    )
                  })}
                </div>
              </FilterSection>
            </>
          )}

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mb-0.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="min-h-0 flex-1 p-4 md:p-6">
        <div className="h-full min-h-[24rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <FullMap
            jobs={jobs}
            center={[-83.35697, 42.43716]}
            zoom={9}
          />
        </div>
      </div>
    </section>
  )
}
