const TOKEN_KEY = "um_access_token"
const USER_KEY = "um_user"

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null")
  } catch {
    return null
  }
}

export function storeSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function redirectToLogin() {
  if (window.location.pathname !== "/login") {
    window.location.assign("/login")
  }
}
