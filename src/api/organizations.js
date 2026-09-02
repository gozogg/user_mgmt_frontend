import { ORGANIZATION_ID, orgRequest } from "./http"

export function getOrganization() {
  if (!ORGANIZATION_ID) {
    return Promise.reject(new Error("VITE_ORGANIZATION_ID is not set"))
  }
  return orgRequest(`/organizations/${ORGANIZATION_ID}`)
}

export function createOrganization(data) {
  return orgRequest("/organizations", {
    method: "POST",
    body: data,
  })
}

export function updateOrganization(id, data) {
  return orgRequest(`/organizations/${id}`, {
    method: "PUT",
    body: data,
  })
}
