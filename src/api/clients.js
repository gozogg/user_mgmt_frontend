import { request } from "./http"

export function getClients({city, client_id} = {}) {
  const params = new URLSearchParams()
  if (city) params.set("city", city)
  if (client_id) params.set("client_id", client_id)
  return request(`/clients?${params}`)
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
