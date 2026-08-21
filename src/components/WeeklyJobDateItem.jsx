import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import {
  JOB_DATE_STATUSES,
  jobDateCardClass,
  jobDateStatusIcon,
  jobDateStatusLabel,
} from "../utils/jobDateStatus"
import JobDateForm from "./JobDateForm"

export default function WeeklyJobDateItem({
  row,
  onStatusChange,
  onDateChange,
  onDelete,
  isSaving,
  from = "/week",
}) {
  const [formOpened, setFormOpened] = useState(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const statusMenuRef = useRef(null)
  const clientName = [row.first_name, row.last_name?.[0] ? `${row.last_name[0]}.` : null]
    .filter(Boolean)
    .join(" ")
  const status = row.status || "not_complete"

  useEffect(() => {
    if (!statusMenuOpen) return

    function handleClickOutside(event) {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setStatusMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [statusMenuOpen])

  return (
    <li
      className={`rounded-xl border  p-3 shadow-sm transition ${jobDateCardClass(status)}`}
    >
      <div className="min-w-0">
        <Link
          to={`/jobs/${row.job_id}`}
          state={{ from }}
          className="block truncate text-sm font-semibold text-slate-900 hover:text-slate-700"
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

      <div className="mt-3 flex items-center gap-1">
        <div className="relative" ref={statusMenuRef}>
          <button
            type="button"
            title={`Status: ${jobDateStatusLabel(status)}`}
            disabled={isSaving}
            onClick={() => setStatusMenuOpen((open) => !open)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
          >
            <i className={`fa-solid text-xs ${jobDateStatusIcon(status)}`}></i>
          </button>

          {statusMenuOpen && (
            <div className="absolute left-0 z-20 mt-1 flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
              {JOB_DATE_STATUSES.map((option) => (
                <button
                  key={option}
                  type="button"
                  title={jobDateStatusLabel(option)}
                  disabled={isSaving}
                  onClick={() => {
                    setStatusMenuOpen(false)
                    if (option !== status) onStatusChange?.(row, option)
                  }}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-slate-100 disabled:opacity-60 ${
                    option === status ? "bg-slate-100 ring-1 ring-slate-300" : ""
                  }`}
                >
                  <i className={`fa-solid text-xs ${jobDateStatusIcon(option)}`}></i>
                </button>
              ))}
            </div>
          )}
        </div>

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
