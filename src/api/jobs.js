import { request } from "./http"

function toCsv(value) {
  if (value == null || value === "") return null
  if (Array.isArray(value)) {
    const items = value.map(String).map((v) => v.trim()).filter(Boolean)
    return items.length ? items.join(",") : null
  }
  return String(value)
}

export function getJobs({ client_id, job_id, frequency, day_of_week } = {}) {
  const params = new URLSearchParams()
  if (client_id) params.set("client_id", client_id)
  if (job_id) params.set("job_id", job_id)
  const frequencyCsv = toCsv(frequency)
  console.log(frequencyCsv)
  if (frequencyCsv) params.set("frequency", frequencyCsv)
  const dayCsv = toCsv(day_of_week)
  if (dayCsv) params.set("day_of_week", dayCsv)
  const query = params.toString()
  console.log("Query: ", query)
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
