const API = import.meta.env.VITE_API_URL
export const ORGANIZATION_ID = import.meta.env.VITE_ORGANIZATION_ID

function requireOrgId() {
  if (!ORGANIZATION_ID) {
    throw new Error("ORGANIZATION_ID is not set")
  }
  return ORGANIZATION_ID
}

function withOrgQuery(path) {
  const orgId = requireOrgId()
  const [base, query = ""] = path.split("?")
  const params = new URLSearchParams(query)
  params.set("organization_id", orgId)
  const qs = params.toString()
  return `${base}?${qs}`
}

function withOrgBody(body) {
  const orgId = Number(requireOrgId())
  if (!body) {
    return JSON.stringify({ organization_id: orgId })
  }
  const parsed = typeof body === "string" ? JSON.parse(body) : body
  return JSON.stringify({ ...parsed, organization_id: orgId })
}

export async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase()
  const usesQueryOrg = method === "GET" || method === "DELETE"
  const url = usesQueryOrg ? withOrgQuery(path) : path
  const body = usesQueryOrg ? options.body : withOrgBody(options.body)

  const response = await fetch(`${API}${url}`, {
    ...options,
    body,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

/** Organization endpoints — not scoped by organization_id. */
export async function orgRequest(path, options = {}) {
  console.log("orgRequest", path, options)
  const body = typeof options.body === "string" ? options.body : JSON.stringify(options.body)
  console.log("body", body)
  const response = await fetch(`${API}${path}`, {
    ...options,
    body,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}
