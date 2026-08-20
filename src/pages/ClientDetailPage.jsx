import { useParams } from "react-router-dom"
import { getJobs } from "../api/jobs"
import { getClients } from "../api/clients"
import { useState, useEffect } from "react"
import JobList from "../components/JobList"

export default function ClientDetailPage() {
  const { id } = useParams()
  const [jobs, setJobs] = useState([])
  const [client, setClient] = useState({})
  const [formOpened, setFormOpened] = useState(false)
  const [error, setError] = useState(null)

  function loadJobs() {
    setError(null)
    getJobs({client_id: id})
      .then((data) => {
          setJobs(data)
          console.log(("jobs: ", data))})
      .catch((err) => setError(err.message))
  }

  function loadClient() {
    setError(null)
    getClients({client_id: id})
      .then((data) => setClient(data[0] ?? {}))
      .catch((err) => setError(err.message))
    console.log("client: ", client)
  }

  useEffect(() => {
    loadClient()
    loadJobs()
  }, [])

  return (
    <section className="flex-1 overflow-y-auto bg-slate-50 min-h-screen p-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Clients
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            {client.first_name} {client.last_name}
          </h1>
          <p className="mt-1 text-slate-600">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} total
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpened(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          <i className="fa-solid fa-plus text-xs"></i>
          Add Job
        </button>
      </header>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <JobList jobs={jobs} />

      {/* {formOpened && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={() => setFormOpened(false)}
      >
        <div
          className="w-full max-w-md rounded-xl bg-white p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-center mb-5 font-bold">Add Client</h2>
          <NewClientForm
            onCancel={() => setFormOpened(false)}
            onSuccess={() => {
              setFormOpened(false)
              loadClients()
            }}
          />
        </div>
      </div>
    )} */}
    </section>
  )
}
