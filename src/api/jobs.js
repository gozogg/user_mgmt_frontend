import { request } from "./http"

export function getJobs() {
  return request("/jobs")
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
