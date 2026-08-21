import { Link } from "react-router-dom"
import { useState } from "react"
import {
  JOB_DATE_STATUSES,
  jobDateCardClass,
  jobDateStatusLabel,
} from "../utils/jobDateStatus"
import JobDateForm from "./JobDateForm"

export default function DailyJobDateItem({
  row,
  onStatusChange,
  onDateChange,
  onDelete,
  isSaving,
  from = "/day",
  compact = false,
}) {
  const [formOpened, setFormOpened] = useState(false)
  const clientName = [row.first_name, row.last_name].filter(Boolean).join(" ")

  return (
    <li
      className={`rounded-xl border shadow-sm transition ${
        compact ? "p-3" : "p-4"
      } ${jobDateCardClass(row.status)}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/jobs/${row.job_id}`}
            state={{ from }}
            className={`block truncate font-semibold text-slate-900 hover:text-slate-700 ${
              compact ? "text-sm" : ""
            }`}
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
      
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            title="Edit date"
            onClick={() => setFormOpened(true)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100"
          >
            <i className="fa-solid fa-pencil text-xs"></i>
          </button>
          <button
            type="button"
            title="Delete date"
            disabled={isSaving}
            onClick={() => onDelete?.(row)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-700 transition hover:bg-red-50 disabled:opacity-60"
          >
            <i className="fa-solid fa-trash text-xs"></i>
          </button>
        </div>
        
      </div>

      <div className="flex items-start justify-between gap-3">
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
      </div>

      <div className="mt-3">
        <label className="block text-xs font-medium text-slate-500">
          <select
            value={row.status || "not_complete"}
            disabled={isSaving}
            onChange={(e) => onStatusChange(row, e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
          >
            {JOB_DATE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {jobDateStatusLabel(status)}
              </option>
            ))}
          </select>
        </label>
      </div>
      </div>

      {formOpened && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setFormOpened(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-5 text-center text-lg font-bold text-slate-900">
              Edit job date
            </h2>
            <JobDateForm
              row={row}
              onCancel={() => setFormOpened(false)}
              onSuccess={(newDate) => {
                setFormOpened(false)
                onDateChange?.(row, newDate)
              }}
            />
          </div>
        </div>
      )}
    </li>
  )
}
