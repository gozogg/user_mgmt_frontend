export default function JobOccurrenceBlock({ job }) {
  return (
    // <Link
    //   to={`/clients/${client.id}`}
    //   className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
    // >
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-slate-900 group-hover:text-slate-700">
            {job.description}
          </h2>
          <p className="text-xs text-slate-500">Job #{job.id}</p>
        </div>
      </div>

      <div className="mt-auto space-y-2 text-sm text-slate-600">
        {job.frequency == 'onetime' ? (
          <div className="flex items-start gap-2">
            <i className="fa-solid fa-location-dot mt-0.5 w-4 text-center text-slate-400"></i>
            <span>{job.start_date}</span>
          </div>
        ) : (
          <div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-phone w-4 text-center text-slate-400"></i>
            <span>{job.start_date} - {job.end_date}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-phone w-4 text-center text-slate-400"></i>
            <span>Day of Week: {job.day_of_week}</span>
          </div>
          </div>
        )}
      </div>
      </>
    // </Link>
  )
}
