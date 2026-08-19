import JobOccurrenceRow from "./JobOccurrenceRow"

export default function JobList({ jobs }) {
  if (!jobs.length) {
    return <p>No jobs.</p>
  }

  return (
    <ul>
      {jobs.map((job) => (
        <JobOccurrenceRow key={`${job.job_id}-${job.date}`} job={job} />
      ))}
    </ul>
  )
}
