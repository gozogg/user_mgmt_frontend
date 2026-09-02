import { useState } from "react"
import {
  createOrganization,
  updateOrganization,
} from "../api/organizations"
import { ORGANIZATION_ID } from "../api/http"
import { useOrganization } from "../components/OrganizationProvider"

const fieldClass =
  "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
const labelClass = "block text-sm font-medium text-slate-700"

function formatDate(value) {
  if (!value) return ""
  return String(value).slice(0, 10)
}

function OrganizationForm({ organization, onSuccess }) {
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const body = {
      business_name: formData.get("business_name"),
      default_start_date: formData.get("default_start_date") || null,
      default_end_date: formData.get("default_end_date") || null,
    }

    try {
      await updateOrganization(organization.id, body)
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="business_name" className={labelClass}>
          Business name
        </label>
        <input
          id="business_name"
          name="business_name"
          type="text"
          required
          defaultValue={organization.business_name ?? ""}
          className={fieldClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="default_start_date" className={labelClass}>
            Default start date
          </label>
          <input
            id="default_start_date"
            name="default_start_date"
            type="date"
            defaultValue={formatDate(organization.default_start_date)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="default_end_date" className={labelClass}>
            Default end date
          </label>
          <input
            id="default_end_date"
            name="default_end_date"
            type="date"
            defaultValue={formatDate(organization.default_end_date)}
            className={fieldClass}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          <i className={`fa-solid ${saving ? "fa-spinner fa-spin" : "fa-check"} text-xs`}></i>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  )
}

function CreateOrganizationForm() {
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setCreated(null)

    const formData = new FormData(e.currentTarget)
    const body = {
      business_name: formData.get("business_name"),
      default_start_date: formData.get("default_start_date") || null,
      default_end_date: formData.get("default_end_date") || null,
    }

    try {
      const org = await createOrganization(body)
      setCreated(org)
      e.target.reset()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="new_business_name" className={labelClass}>
          Business name
        </label>
        <input
          id="new_business_name"
          name="business_name"
          type="text"
          required
          placeholder="Acme Lawn Care"
          className={fieldClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="new_default_start_date" className={labelClass}>
            Default start date
          </label>
          <input
            id="new_default_start_date"
            name="default_start_date"
            type="date"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="new_default_end_date" className={labelClass}>
            Default end date
          </label>
          <input
            id="new_default_end_date"
            name="default_end_date"
            type="date"
            className={fieldClass}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {created && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Organization created (ID {created.id}). Set{" "}
          <code className="rounded bg-green-100 px-1.5 py-0.5 text-xs">
            VITE_ORGANIZATION_ID={created.id}
          </code>{" "}
          in your <code className="rounded bg-green-100 px-1.5 py-0.5 text-xs">.env</code>{" "}
          to use it.
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <i className={`fa-solid ${saving ? "fa-spinner fa-spin" : "fa-plus"} text-xs`}></i>
          {saving ? "Creating…" : "Create organization"}
        </button>
      </div>
    </form>
  )
}

export default function OrganizationPage() {
  const { organization, refreshOrganization } = useOrganization()
  const [saved, setSaved] = useState(false)

  async function handleSaveSuccess() {
    await refreshOrganization()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <section className="flex-1 overflow-y-auto bg-slate-50 min-h-screen p-8">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Settings
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          Organization
        </h1>
        <p className="mt-1 text-slate-600">
          Manage your business profile and default schedule dates
        </p>
      </header>

      {saved && (
        <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Organization updated.
        </p>
      )}

      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Current organization
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            ID {ORGANIZATION_ID} · changes apply to this workspace
          </p>
          <div className="mt-5">
            {organization ? (
              <OrganizationForm
                organization={organization}
                onSuccess={handleSaveSuccess}
              />
            ) : (
              <p className="text-sm text-slate-500">No organization loaded.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Create new organization
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Add another business. You will need to update your environment to
            switch to it.
          </p>
          <div className="mt-5">
            <CreateOrganizationForm />
          </div>
        </div>
      </div>
    </section>
  )
}
