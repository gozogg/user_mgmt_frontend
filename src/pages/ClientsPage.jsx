import ClientList from "../components/ClientList"
import NewClientForm from "../components/NewClientForm"
import { getClients } from "../api/clients"
import { useState, useEffect } from "react"

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [formOpened, setFormOpened] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClients = clients.filter((client) =>
    client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function loadClients() {
    setError(null)
    getClients()
      .then(setClients)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadClients()
  }, [])

  return (
    <section className="flex-1 overflow-y-auto bg-slate-50 min-h-screen p-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Clients
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Client list
          </h1>
          <p className="mt-1 text-slate-600">
            {clients.length} {clients.length === 1 ? "client" : "clients"} total
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative block w-full min-w-[14rem] sm:w-64">
            <span className="sr-only">Search client names</span>
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
            <input
              type="text"
              placeholder="Search clients…"
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
          <button
            type="button"
            onClick={() => setFormOpened(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            Add client
          </button>
        </div>
      </header>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <ClientList clients={filteredClients} />

      {formOpened && (
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
    )}
    </section>
  )
}
