import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { getOrganization } from "../api/organizations"
import Loader from "./Loader"

const OrganizationContext = createContext(null)

export function useOrganization() {
  return useContext(OrganizationContext)
}

export function OrganizationProvider({ children }) {
  const [organization, setOrganization] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshOrganization = useCallback((nextOrganization) => {
    if (nextOrganization) {
      setOrganization(nextOrganization)
      return Promise.resolve(nextOrganization)
    }
    return getOrganization().then((org) => {
      setOrganization(org)
      return org
    })
  }, [])

  useEffect(() => {
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
