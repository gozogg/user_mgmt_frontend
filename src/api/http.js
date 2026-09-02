import { clearSession, getStoredToken, redirectToLogin } from "../auth/session"

const API = import.meta.env.VITE_API_URL

function authHeaders() {
  const token = getStoredToken()
  const headers = { "Content-Type": "application/json" }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

async function parseBody(response) {
  if (response.status === 204) {
    return null
  }
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function errorMessage(payload) {
  if (payload && typeof payload === "object" && payload.error) {
    return payload.error
  }
  if (typeof payload === "string" && payload.trim()) {
    return payload
  }
  return "Request failed"
}

export async function request(path, options = {}) {
  const { body, headers, ...rest } = options
  const serializedBody =
    body == null || typeof body === "string" ? body : JSON.stringify(body)

  const response = await fetch(`${API}${path}`, {
    ...rest,
    body: serializedBody,
    headers: {
      ...authHeaders(),
      ...headers,
    },
  })

  if (response.status === 401) {
    clearSession()
    redirectToLogin()
    throw new Error("Please sign in")
  }

  const payload = await parseBody(response)

  if (!response.ok) {
    throw new Error(errorMessage(payload))
  }

  return payload
}

/** Organization endpoints that only need the JWT, not a client-supplied org id. */
export async function orgRequest(path, options = {}) {
  return request(path, options)
}
