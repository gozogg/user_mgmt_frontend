import { createClient } from "../api/clients"

export default function NewClientForm({onCancel, onSuccess}) {
  // local state for each field (or one form object)
  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget;
    const formData = new FormData(form)
    const body = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      phone_number: formData.get("phone_number"),
      address: formData.get("address"),
      city: formData.get("city")
    }
    await createClient(body)
    onSuccess()
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm/6 font-semibold">First Name</label>
          <div className="mt-2.5">
            <input
              id="first_name"
              type="text"
              name="first_name"
              required
              className="block w-full rounded-md px-3.5 py-2 border"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm/6 font-semibold">Last Name</label>
          <div className="mt-2.5">
            <input
              id="last_name"
              type="text"
              name="last_name"
              required
              className="block w-full rounded-md px-3.5 py-2 border"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm/6 font-semibold">Email</label>
          <div className="mt-2.5">
            <input
              id="email"
              type="email"
              name="email"
              required
              className="block w-full rounded-md px-3.5 py-2 border"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm/6 font-semibold">Phone Number</label>
          <div className="mt-2.5">
            <input
              id="phone_number"
              type="phone"
              name="phone_number"
              required
              className="block w-full rounded-md px-3.5 py-2 border"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm/6 font-semibold">Address</label>
          <div className="mt-2.5">
            <input
              id="address"
              type="address"
              name="address"
              required
              className="block w-full rounded-md px-3.5 py-2 border"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm/6 font-semibold">City</label>
          <div className="mt-2.5">
            <input
              id="city"
              type="city"
              name="city"
              required
              className="block w-full rounded-md px-3.5 py-2 border"
            />
          </div>
        </div>
      </div>
      <div className='mt-5 flex justify-between'>
        <button className="rounded bg-red-800 text-white border p-2 "type="button" onClick={onCancel}><i className="fa-solid fa-x"></i>Cancel</button>
        <button className="rounded bg-green-800 text-white border p-2 "type="submit"><i className="fa-solid fa-check"></i>Save</button>
      </div>
    </form>
  )
}
