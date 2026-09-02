import { useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"

const fieldClass =
  "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const location = useLocation()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from?.pathname || "/"

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(username, password)
    } catch (err) {
      setError(err.message || "Could not sign in")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-white">
            <i className="fa-solid fa-layer-group"></i>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">
            Use the client account for real work, or the demo account to explore sample data.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={fieldClass}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={fieldClass}
            />
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            <i className={`fa-solid ${submitting ? "fa-spinner fa-spin" : "fa-right-to-bracket"} text-xs`}></i>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Demo login: <span className="font-medium text-slate-700">demo</span> /{" "}
          <span className="font-medium text-slate-700">DemoJobs1!</span>
        </p>
      </div>
    </section>
  )
}
