const API = import.meta.env.VITE_API_URL

export async function loginRequest(username, password) {
  const response = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })

  const payload = await parseBody(response)

  if (!response.ok) {
    throw new Error(errorMessage(payload, "Could not sign in"))
  }

  if (!payload?.token || !payload?.user) {
    throw new Error("Login response was missing a token")
  }

  return payload
}

async function parseBody(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function errorMessage(payload, fallback) {
  if (payload && typeof payload === "object" && payload.error) {
    return payload.error
  }
  if (typeof payload === "string" && payload.trim()) {
    return payload
  }
  return fallback
}
