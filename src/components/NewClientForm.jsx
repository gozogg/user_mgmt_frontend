import { createClient, updateClient } from "../api/clients"

const fieldClass =
  "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
const labelClass = "block text-sm font-medium text-slate-700"

export default function NewClientForm({ onCancel, onSuccess, client }) {
  const isEdit = Boolean(client?.id)

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const body = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      phone_number: formData.get("phone_number"),
      address: formData.get("address"),
      city: formData.get("city"),
    }

    if (isEdit) {
      await updateClient(client.id, body)
    } else {
      await createClient(body)
    }
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className={labelClass}>
            First name
          </label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            defaultValue={client?.first_name ?? ""}
            required
            placeholder="Jane"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="last_name" className={labelClass}>
            Last name
          </label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            defaultValue={client?.last_name ?? ""}
            required
            placeholder="Doe"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            defaultValue={client?.email ?? ""}
            required
            placeholder="jane@example.com"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="phone_number" className={labelClass}>
            Phone number
          </label>
          <input
            id="phone_number"
            type="tel"
            name="phone_number"
            defaultValue={client?.phone_number ?? ""}
            required
            placeholder="(555) 123-4567"
            className={fieldClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className={labelClass}>
            Address
          </label>
          <input
            id="address"
            type="text"
            name="address"
            defaultValue={client?.address ?? ""}
            required
            placeholder="123 Main St"
            className={fieldClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="city" className={labelClass}>
            City
          </label>
          <input
            id="city"
            type="text"
            name="city"
            defaultValue={client?.city ?? ""}
            required
            placeholder="Columbus"
            className={fieldClass}
          />
        </div>
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
          {isEdit ? "Update client" : "Save client"}
        </button>
      </div>
    </form>
  )
}
