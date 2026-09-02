import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { loginRequest } from "../api/auth"
import {
  clearSession,
  getStoredToken,
  getStoredUser,
  storeSession,
} from "./session"

const AuthContext = createContext(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return value
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(getStoredUser)

  const login = useCallback(async (username, password) => {
    const result = await loginRequest(username, password)
    storeSession(result.token, result.user)
    setToken(result.token)
    setUser(result.user)
    return result
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isDemo: user?.role === "demo",
      login,
      logout,
    }),
    [token, user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
