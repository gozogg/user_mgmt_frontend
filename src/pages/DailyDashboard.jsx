import { useEffect, useState } from "react"
import { getJobDates } from "../api/jobDates"
import JobList from "../components/JobList"

function today() {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${month}-${day}`
}

export default function DailyDashboard() {
  const [date, setDate] = useState(today)
  const [jobs, setJobs] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null)
    getJobDates({ date })
      .then(setJobs)
      .catch((err) => setError(err.message))
  }, [date])

  return (
    <section>
      <h1>Daily dashboard</h1>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      {error && <p>{error}</p>}
      <JobList jobs={jobs} />
    </section>
  )
}
