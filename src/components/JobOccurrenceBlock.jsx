import { Link, useLocation } from "react-router-dom"

export default function JobOccurrenceBlock({ job }) {
  const isOnetime = job.frequency === "onetime"
  const price = job.price != null ? Number(job.price) : null
  const location = useLocation()

  return (
    <Link
      to={`/jobs/${job.id}`}
      state={{ from: location.pathname }}
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-slate-900 group-hover:text-slate-700">
            {job.description || "Untitled job"}
          </h2>
          <p className="text-xs text-slate-500">{job.first_name} {job.last_name}</p>
        </div>
        {job.frequency && (
          <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-700">
            {job.frequency}
          </span>
        )}
      </div>

      <div className="mt-auto space-y-2 text-sm text-slate-600">
        {isOnetime ? (
          job.start_date && (
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-calendar-day w-4 text-center text-slate-400"></i>
              <span>{job.start_date}</span>
            </div>
          )
        ) : (
          <>
            {(job.start_date || job.end_date) && (
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-calendar-days w-4 text-center text-slate-400"></i>
                <span>
                  {job.start_date}
                  {job.end_date ? ` – ${job.end_date}` : ""}
                </span>
              </div>
            )}
            {job.day_of_week && (
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-clock w-4 text-center text-slate-400"></i>
                <span className="capitalize">{job.day_of_week}</span>
              </div>
            )}
          </>
        )}

        {price != null && !Number.isNaN(price) && (
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-dollar-sign w-4 text-center text-slate-400"></i>
            <span>${price.toFixed(2)}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
