import { createJob } from "../api/jobs";
import { useState } from "react";

export default function NewJobForm({onCancel, onSuccess, client_id}) {
    const [frequency, setFrequency] = useState("")
  // local state for each field (or one form object)
  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget;
    const formData = new FormData(form)
    const body = {
      client_id: client_id,
      frequency: formData.get("frequency"),
      price: formData.get("price"),
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
      day_of_week: formData.get("day_of_week"),
      description: formData.get("description")
    }
    await createJob(body)
    onSuccess()
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm/6 font-semibold">Description</label>
          <div className="mt-2.5">
            <input
              id="description"
              type="description"
              name="description"
              required
              className="block w-full rounded-md px-3.5 py-2 border"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm/6 font-semibold">Frequency</label>
          <div className="mt-2.5">
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              id="frequency"
              name="frequency"
              required
              className="block w-full rounded-md px-3.5 py-2 border"
            >
              <option value="onetime">One Time</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">BiWeekly</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm/6 font-semibold">Price</label>
          <div className="mt-2.5">
            <input
              id="price"
              type="number"
              name="price"
              required
              className="block w-full rounded-md px-3.5 py-2 border"
            />
          </div>
        </div>

        {frequency === "onetime" ? (
          <>
          <div className="sm:col-span-2">
            <label className="block text-sm/6 font-semibold">Date</label>
            <div className="mt-2.5">
                <input
                id="start_date"
                type="date"
                name="start_date"
                required
                className="block w-full rounded-md px-3.5 py-2 border"
                />
            </div>
        </div>
        </>
        ) : (
        <>
        <div>
          <label className="block text-sm/6 font-semibold">Start Date</label>
          <div className="mt-2.5">
            <input
              id="start_date"
              type="date"
              name="start_date"
              required
              className="block w-full rounded-md px-3.5 py-2 border"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm/6 font-semibold">End Date</label>
          <div className="mt-2.5">
            <input
              id="end_date"
              type="date"
              name="end_date"
              required
              className="block w-full rounded-md px-3.5 py-2 border"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm/6 font-semibold">Day of the Week</label>
          <div className="mt-2.5">
            <select
              id="day_of_week"
              type="day_of_week"
              name="day_of_week"
              required
              className="block w-full rounded-md px-3.5 py-2 border"
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
        </div>
        </>
        )}
      </div>
      <div className='mt-5 flex justify-between'>
        <button className="rounded bg-red-800 text-white border p-2 "type="button" onClick={onCancel}><i className="fa-solid fa-x"></i>Cancel</button>
        <button className="rounded bg-green-800 text-white border p-2 "type="submit"><i className="fa-solid fa-check"></i>Save</button>
      </div>
    </form>
  )
}