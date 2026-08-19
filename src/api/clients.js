import { request } from "./http"

export function getClients() {
  return request("/clients")
}

export function createClient(client) {
  return request("/clients", {
    method: "POST",
    body: JSON.stringify(client),
  })
}

export function updateClient(id, client) {
  return request(`/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(client),
  })
}

export function deleteClient(id) {
  return request(`/clients/${id}`, { method: "DELETE" })
}
