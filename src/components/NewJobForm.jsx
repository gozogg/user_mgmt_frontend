import { createJob, updateJob } from "../api/jobs"
import { useState } from "react"

const fieldClass =
  "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
const labelClass = "block text-sm font-medium text-slate-700"

export default function NewJobForm({ onCancel, onSuccess, client_id, job }) {
  const isEdit = Boolean(job?.id)
  const [frequency, setFrequency] = useState(job?.frequency || "onetime")

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const body = {
      client_id: client_id || job?.client_id,
      frequency: formData.get("frequency"),
      price: formData.get("price"),
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date") || null,
      day_of_week: formData.get("day_of_week") || null,
      description: formData.get("description"),
    }

    if (isEdit) {
      await updateJob(job.id, body)
    } else {
      await createJob(body)
    }
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <input
            id="description"
            type="text"
            name="description"
            defaultValue={job?.description ?? ""}
            required
            placeholder="Lawn mowing"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="frequency" className={labelClass}>
            Frequency
          </label>
          <select
            id="frequency"
            name="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            required
            className={fieldClass}
          >
            <option value="onetime">One time</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
          </select>
        </div>

        <div>
          <label htmlFor="price" className={labelClass}>
            Price
          </label>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
              $
            </span>
            <input
              id="price"
              type="number"
              name="price"
              step="0.01"
              min="0"
              defaultValue={job?.price ?? ""}
              required
              placeholder="0.00"
              className={`${fieldClass} mt-0 pl-7`}
            />
          </div>
        </div>

        {frequency === "onetime" ? (
          <div className="sm:col-span-2">
            <label htmlFor="start_date" className={labelClass}>
              Date
            </label>
            <input
              id="start_date"
              type="date"
              name="start_date"
              defaultValue={job?.start_date ?? ""}
              required
              className={fieldClass}
            />
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="start_date" className={labelClass}>
                Start date
              </label>
              <input
                id="start_date"
                type="date"
                name="start_date"
                defaultValue={job?.start_date ?? ""}
                required
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="end_date" className={labelClass}>
                End date
              </label>
              <input
                id="end_date"
                type="date"
                name="end_date"
                defaultValue={job?.end_date ?? ""}
                required
                className={fieldClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="day_of_week" className={labelClass}>
                Day of the week
              </label>
              <select
                id="day_of_week"
                name="day_of_week"
                defaultValue={job?.day_of_week ?? "monday"}
                required
                className={fieldClass}
              >
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
          </>
        )}
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
          {isEdit ? "Update job" : "Save job"}
        </button>
      </div>
    </form>
  )
}
