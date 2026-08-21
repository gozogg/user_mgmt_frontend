import { request } from "./http"

export function getJobs({ client_id, job_id } = {}) {
  const params = new URLSearchParams()
  if (client_id) params.set("client_id", client_id)
  if (job_id) params.set("job_id", job_id)
  const query = params.toString()
  return request(`/jobs${query ? `?${query}` : ""}`)
}

export function createJob(job) {
  return request("/jobs", {
    method: "POST",
    body: JSON.stringify(job),
  })
}

export function updateJob(id, job) {
  return request(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(job),
  })
}

export function deleteJob(id) {
  return request(`/jobs/${id}`, { method: "DELETE" })
}
