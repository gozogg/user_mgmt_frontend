import { Link } from "react-router-dom"

function formatDate(value) {
  if (!value) return ""
  return String(value).slice(0, 10)
}

export default function DailyJobDateItem({ row, onToggleStatus, isSaving }) {
  const date = formatDate(row.date)
  const isComplete = row.status === "complete"
  const clientName = [row.first_name, row.last_name].filter(Boolean).join(" ")
  const price =
    row.price != null && !Number.isNaN(Number(row.price))
      ? Number(row.price).toLocaleString("en-US", { style: "currency", currency: "USD" })
      : null

  return (
    <li
      className={`rounded-xl border bg-white p-4 shadow-sm transition ${
        isComplete ? "border-green-200 bg-green-50/40" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/jobs/${row.job_id}`}
            state={{ from: "/day" }}
            className="block truncate font-semibold text-slate-900 hover:text-slate-700"
          >
            {row.description || "Untitled job"}
          </Link>
          {clientName && (
            <p className="mt-1 truncate text-sm text-slate-600">
              <i className="fa-solid fa-user mr-1.5 text-xs text-slate-400"></i>
              {clientName}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium capitalize ${
            isComplete
              ? "bg-green-100 text-green-800"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {isComplete ? "complete" : "not complete"}
        </span>
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-slate-600">
        {row.address && (
          <div className="flex items-start gap-2">
            <i className="fa-solid fa-location-dot mt-0.5 w-4 text-center text-slate-400"></i>
            <span>
              {row.address}
              {row.city ? `, ${row.city}` : ""}
            </span>
          </div>
        )}
        {price && (
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-dollar-sign w-4 text-center text-slate-400"></i>
            <span>{price}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => onToggleStatus(row)}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-60 ${
            isComplete
              ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              : "bg-slate-800 text-white hover:bg-slate-700"
          }`}
        >
          <i
            className={`fa-solid text-xs ${
              isComplete ? "fa-rotate-left" : "fa-check"
            }`}
          ></i>
          {isSaving
            ? "Saving..."
            : isComplete
              ? "Mark incomplete"
              : "Mark complete"}
        </button>
      </div>
    </li>
  )
}
