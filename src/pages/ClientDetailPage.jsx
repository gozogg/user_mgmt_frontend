import { Link, useNavigate, useParams } from "react-router-dom"
import { getJobs } from "../api/jobs"
import { deleteClient, getClients } from "../api/clients"
import { getJobDates } from "../api/jobDates"
import { useState, useEffect, useMemo } from "react"
import JobList from "../components/JobList"
import NewJobForm from "../components/NewJobForm"
import NewClientForm from "../components/NewClientForm"
import ClientMap from "../components/ClientMap"
import PlantLoader from "../components/PlantLoader"

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [jobDates, setJobDates] = useState([])
  const [client, setClient] = useState({})
  const [jobFormOpened, setJobFormOpened] = useState(false)
  const [clientFormOpened, setClientFormOpened] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const totalProfit = useMemo(() => {
    const sum = jobDates.reduce((total, row) => total + Number(row.price || 0), 0)
    return sum.toLocaleString("en-US", { style: "currency", currency: "USD" })
  }, [jobDates])

  const name = [client.first_name, client.last_name].filter(Boolean).join(" ") || "Client"

  function loadAll() {
    setIsLoading(true)
    setError(null)
    Promise.all([
      getClients({ client_id: id }).then((data) => setClient(data[0] ?? {})),
      getJobs({ client_id: id }).then(setJobs),
      getJobDates({ client_id: id }).then(setJobDates),
    ])
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadAll()
  }, [id])

  async function handleDelete() {
    const label = name !== "Client" ? name : "this client"
    if (!window.confirm(`Delete ${label}? This will also remove their jobs and job dates.`)) {
      return
    }
    setError(null)
    try {
      await deleteClient(id)
      navigate("/clients")
    } catch (err) {
      setError(err.message)
    }
  }

  if (isLoading) {
    return (
      <section className="flex min-h-screen flex-1 items-center justify-center bg-slate-50">
        <PlantLoader message="Loading client…" />
      </section>
    )
  }

  return (
    <section className="flex-1 overflow-y-auto bg-slate-50 min-h-screen p-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/clients"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            ← Clients
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{name}</h1>
          <p className="mt-1 text-slate-600">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} · {totalProfit} total
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setClientFormOpened(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
          >
            <i className="fa-solid fa-pencil text-xs"></i>
            Edit client
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
          >
            <i className="fa-solid fa-trash text-xs"></i>
            Delete
          </button>
          <button
            type="button"
            onClick={() => setJobFormOpened(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            Add job
          </button>
        </div>
      </header>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Contact</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {(client.address || client.city) && (
              <div className="flex items-start gap-2">
                <i className="fa-solid fa-location-dot mt-0.5 w-4 text-center text-slate-400"></i>
                <span>
                  {[client.address, client.city].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
            {client.phone_number && (
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-phone w-4 text-center text-slate-400"></i>
                <span>{client.phone_number}</span>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-envelope w-4 text-center text-slate-400"></i>
                <span className="truncate">{client.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="min-h-[12rem] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 lg:min-h-0">
          <ClientMap
            client={client}
            center={[-83.35697, 42.43716]}
            zoom={12}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Jobs</h2>
      </div>

      <JobList jobs={jobs} />

      {jobFormOpened && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setJobFormOpened(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-5 text-center text-lg font-bold text-slate-900">Add job</h2>
            <NewJobForm
              client_id={id}
              onCancel={() => setJobFormOpened(false)}
              onSuccess={() => {
                setJobFormOpened(false)
                loadAll()
              }}
            />
          </div>
        </div>
      )}

      {clientFormOpened && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setClientFormOpened(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-5 text-center text-lg font-bold text-slate-900">Edit client</h2>
            <NewClientForm
              client={client}
              onCancel={() => setClientFormOpened(false)}
              onSuccess={() => {
                setClientFormOpened(false)
                loadAll()
              }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
