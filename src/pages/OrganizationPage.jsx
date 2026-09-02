import { useEffect, useState } from "react"
import { updateOrganization } from "../api/organizations"
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
  const [businessName, setBusinessName] = useState(organization.business_name ?? "")
  const [startDate, setStartDate] = useState(formatDate(organization.default_start_date))
  const [endDate, setEndDate] = useState(formatDate(organization.default_end_date))
  const [alertDays, setAlertDays] = useState(organization.alert_days ?? 14)
  const [alertEmail, setAlertEmail] = useState(organization.alert_email ?? "")

  useEffect(() => {
    setBusinessName(organization.business_name ?? "")
    setStartDate(formatDate(organization.default_start_date))
    setEndDate(formatDate(organization.default_end_date))
  }, [organization])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const body = {
      business_name: businessName,
      default_start_date: startDate || null,
      default_end_date: endDate || null,
      alert_days: alertDays || null,
      alert_email: alertEmail || null,
    }

    try {
      const updated = await updateOrganization(organization.id, body)
      onSuccess(updated)
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
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
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
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="alert_days" className={labelClass}>
            Alert days
          </label>
          <input
            id="alert_days"
            name="alert_days"
            type="number"
            value={alertDays}
            onChange={(e) => setAlertDays(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="alert_email" className={labelClass}>
            Alert email
          </label>
          <input
            id="alert_email"
            name="alert_email"
            type="email"
            value={alertEmail}
            onChange={(e) => setAlertEmail(e.target.value)}
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

export default function OrganizationPage() {
  const { organization, refreshOrganization } = useOrganization()
  const [saved, setSaved] = useState(false)

  async function handleSaveSuccess(updated) {
    await refreshOrganization(updated)
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
          Manage your business profile and default schedule dates. Alert emails will be sent to the email address below when jobs are completed and not invoiced past the specified number of days.
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
          {organization?.id != null && (
            <p className="mt-1 text-sm text-slate-600">
              ID {organization.id} · scoped from your signed-in account
            </p>
          )}
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
      </div>
    </section>
  )
}
