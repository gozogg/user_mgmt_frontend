import { updateJobDate } from "../api/jobDates"

const fieldClass =
  "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
const labelClass = "block text-sm font-medium text-slate-700"

function formatDate(value) {
  if (!value) return ""
  return String(value).slice(0, 10)
}

export default function JobDateForm({ row, onCancel, onSuccess }) {
  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const oldDate = formatDate(row.date)
    const newDate = formData.get("date")

    if (!newDate) return

    if (newDate !== oldDate) {
      await updateJobDate(row.job_id, oldDate, { date: newDate })
    }

    onSuccess(newDate)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="text-sm text-slate-600">
          {row.description || "Untitled job"}
          {row.first_name || row.last_name
            ? ` · ${[row.first_name, row.last_name].filter(Boolean).join(" ")}`
            : ""}
        </p>
      </div>

      <div>
        <label htmlFor="job_date" className={labelClass}>
          Date
        </label>
        <input
          id="job_date"
          type="date"
          name="date"
          defaultValue={formatDate(row.date)}
          required
          className={fieldClass}
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          <i className="fa-solid fa-check text-xs"></i>
          Save date
        </button>
      </div>
    </form>
  )
}
