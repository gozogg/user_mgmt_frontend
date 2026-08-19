export default function JobOccurrenceRow({ job }) {
  return (
    <li>
      {job.date} — {job.first_name} {job.last_name}: {job.description} ({job.status})
    </li>
  )
}
