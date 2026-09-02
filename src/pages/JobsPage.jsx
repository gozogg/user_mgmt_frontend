import NewJobForm from "../components/NewJobForm"
import JobList from "../components/JobList"
import { getJobs } from "../api/jobs"
import { useState, useEffect, useMemo, useRef } from "react"
import { getJobDates } from "../api/jobDates"
import Loader from "../components/Loader"
import { useOrganization } from "../components/OrganizationProvider"
import { JOB_STATUSES, jobStatusLabel } from "../utils/jobStatus"

const FREQUENCIES = [
  { value: "onetime", label: "One time" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
]

const dateInputClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"

function formatDate(value) {
  if (!value) return ""
  return String(value).slice(0, 10)
}

function calendarYearRange(year = new Date().getFullYear()) {
  return {
    start: `${year}-01-01`,
    end: `${year}-12-31`,
  }
}

function toggleValue(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]
}

function jobOverlapsRange(job, start, end) {
  if (!start && !end) return true
  const jobStart = formatDate(job.start_date)
  const jobEnd = formatDate(job.end_date) || jobStart
  if (!jobStart) return true
  if (start && jobEnd < start) return false
  if (end && jobStart > end) return false
  return true
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

function FilterToggle({ selected, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
        selected
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  )
}

export default function JobsPage() {
  const { organization } = useOrganization()
  const { start: defaultStart, end: defaultEnd } = calendarYearRange()

  const [jobs, setJobs] = useState([])
  const [formOpened, setFormOpened] = useState(false)
  const [jobDates, setJobDates] = useState([])
  const [error, setError] = useState(null)
  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)
  const [searchTerm, setSearchTerm] = useState("")
  const [frequencies, setFrequencies] = useState([])
  const [statuses, setStatuses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const skipDateFetch = useRef(true)

  const filteredJobs = useMemo(() => {
    const query = searchTerm.toLowerCase()
    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        (job.first_name || "").toLowerCase().includes(query) ||
        (job.last_name || "").toLowerCase().includes(query) ||
        (job.description || "").toLowerCase().includes(query)
      const matchesFrequency =
        frequencies.length === 0 || frequencies.includes(job.frequency)
      const matchesStatus =
        statuses.length === 0 || statuses.includes(job.status)
      const matchesDates = jobOverlapsRange(job, startDate, endDate)
      return matchesSearch && matchesFrequency && matchesStatus && matchesDates
    })
  }, [jobs, searchTerm, frequencies, statuses, startDate, endDate])

  const hasCustomFilters =
    searchTerm.trim() !== "" ||
    frequencies.length > 0 ||
    statuses.length > 0 ||
    startDate !== defaultStart ||
    endDate !== defaultEnd
  const isFiltered = hasCustomFilters || filteredJobs.length !== jobs.length

  const totalProfit = useMemo(() => {
    const visibleIds = new Set(filteredJobs.map((job) => job.id))
    const sum = jobDates
      .filter((row) => visibleIds.has(row.job_id))
      .reduce((total, row) => total + Number(row.price || 0), 0)
    return sum.toLocaleString("en-US", { style: "currency", currency: "USD" })
  }, [jobDates, filteredJobs])

  function loadAll() {
    setError(null)
    const datesPromise =
      startDate && endDate
        ? getJobDates({ start_date: startDate, end_date: endDate }).then(setJobDates)
        : Promise.resolve().then(() => setJobDates([]))
    return Promise.all([getJobs().then(setJobs), datesPromise]).catch((err) =>
      setError(err.message)
    )
  }

  useEffect(() => {
    setIsLoading(true)
    loadAll().finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (skipDateFetch.current) {
      skipDateFetch.current = false
      return
    }
    if (!startDate || !endDate) {
      setJobDates([])
      return
    }
    getJobDates({ start_date: startDate, end_date: endDate })
      .then(setJobDates)
      .catch((err) => setError(err.message))
  }, [startDate, endDate])

  function clearFilters() {
    setSearchTerm("")
    setFrequencies([])
    setStatuses([])
    setStartDate(defaultStart)
    setEndDate(defaultEnd)
  }

  if (isLoading && jobs.length === 0) {
    return (
      <section className="flex min-h-screen flex-1 items-center justify-center bg-slate-50">
        <Loader message="Loading jobs…" />
      </section>
    )
  }

  return (
    <section className="flex-1 overflow-y-auto bg-slate-50 min-h-screen p-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Jobs
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Job list
          </h1>
          <p className="mt-1 text-slate-600">
            {isFiltered
              ? `${filteredJobs.length} of ${jobs.length} ${jobs.length === 1 ? "job" : "jobs"}`
              : `${jobs.length} ${jobs.length === 1 ? "job" : "jobs"} total`}
            {` · ${totalProfit} total profit`}
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
        </div>
      </header>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
          <FilterSection label="Frequency">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {FREQUENCIES.map(({ value, label }) => (
                <FilterToggle
                  key={value}
                  selected={frequencies.includes(value)}
                  onClick={() =>
                    setFrequencies((prev) => toggleValue(prev, value))
                  }
                >
                  {label}
                </FilterToggle>
              ))}
            </div>
          </FilterSection>

          <div className="hidden h-9 w-px shrink-0 bg-slate-200 sm:block" />

          <FilterSection label="Status">
            <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-slate-50 p-1">
              {JOB_STATUSES.map((status) => (
                <FilterToggle
                  key={status}
                  selected={statuses.includes(status)}
                  onClick={() => setStatuses((prev) => toggleValue(prev, status))}
                >
                  {jobStatusLabel(status)}
                </FilterToggle>
              ))}
            </div>
          </FilterSection>

          <div className="hidden h-9 w-px shrink-0 bg-slate-200 lg:block" />

          <FilterSection label="Date range">
            <div className="flex flex-wrap items-center gap-2">
              <label className="sr-only" htmlFor="jobs-start-date">
                Start date
              </label>
              <input
                id="jobs-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={dateInputClass}
              />
              <span className="text-slate-400">–</span>
              <label className="sr-only" htmlFor="jobs-end-date">
                End date
              </label>
              <input
                id="jobs-end-date"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className={dateInputClass}
              />
            </div>
          </FilterSection>

          {hasCustomFilters && (
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
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <JobList jobs={filteredJobs} isFiltered={isFiltered} />

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
              loadAll()
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
