import JobOccurrenceBlock from "./JobOccurrenceBlock"

export default function JobList({ jobs }) {
  if (!jobs.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <i className="fa-solid fa-briefcase mb-3 text-2xl text-slate-400"></i>
        <p className="text-slate-600">No jobs yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Add your first job to get started.
        </p>
      </div>
    )
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <li key={job.id}>
          <JobOccurrenceBlock job={job} />
        </li>
      ))}
    </ul>
  )
}
