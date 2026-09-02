import { orgRequest } from "./http"

export function getOrganization() {
  return orgRequest("/organizations/me")
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
