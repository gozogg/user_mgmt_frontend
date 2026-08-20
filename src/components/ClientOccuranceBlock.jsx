import { Link } from "react-router-dom"

export default function ClientOccuranceBlock({ client }) {
  const name = [client.first_name, client.last_name].filter(Boolean).join(" ") || "Unnamed client"
  const initials = [client.first_name?.[0], client.last_name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "?"

  return (
    <Link
      to={`/clients/${client.id}`}
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-slate-900 group-hover:text-slate-700">
            {name}
          </h2>
          <p className="text-xs text-slate-500">Client #{client.id}</p>
        </div>
      </div>

      <div className="mt-auto space-y-2 text-sm text-slate-600">
        {client.address && (
          <div className="flex items-start gap-2">
            <i className="fa-solid fa-location-dot mt-0.5 w-4 text-center text-slate-400"></i>
            <span>{client.address}, {client.city}</span>
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
    </Link>
  )
}
