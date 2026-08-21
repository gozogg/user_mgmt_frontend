import { request } from "./http"

export function getJobDates({ date, startDate, endDate, client_id, job_id } = {}) {
  const params = new URLSearchParams()
  if (date) params.set("date", date)
  if (startDate) params.set("start_date", startDate)
  if (endDate) params.set("end_date", endDate)
  if (client_id) params.set("client_id", client_id)
  if (job_id) params.set("job_id", job_id)
  return request(`/job-dates?${params}`)
}

export function updateJobDate(jobId, date, body) {
  return request(`/job-dates/${jobId}/${date}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

export function deleteJobDate(jobId, date) {
  return request(`/job-dates/${jobId}/${date}`, { method: "DELETE" })
}
