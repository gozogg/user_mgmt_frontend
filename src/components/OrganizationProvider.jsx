import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { getOrganization } from "../api/organizations"
import { ORGANIZATION_ID } from "../api/http"
import Loader from "./Loader"

const OrganizationContext = createContext(null)

export function useOrganization() {
  return useContext(OrganizationContext)
}

export function OrganizationProvider({ children }) {
  const [organization, setOrganization] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshOrganization = useCallback(() => {
    if (!ORGANIZATION_ID) {
      return Promise.resolve(null)
    }
    return getOrganization().then(setOrganization)
  }, [])

  useEffect(() => {
    if (!ORGANIZATION_ID) {
      setError("ORGANIZATION_ID is not set in your environment")
      setLoading(false)
      return
    }

    refreshOrganization()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [refreshOrganization])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader message="Loading organization…" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
        <p className="max-w-md rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </div>
    )
  }

  return (
    <OrganizationContext.Provider value={{ organization, refreshOrganization }}>
      {children}
    </OrganizationContext.Provider>
  )
}
