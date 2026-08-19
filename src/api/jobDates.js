import { request } from "./http"

export function getJobDates({ date, startDate, endDate, clientId } = {}) {
  const params = new URLSearchParams()
  if (date) params.set("date", date)
  if (startDate) params.set("start_date", startDate)
  if (endDate) params.set("end_date", endDate)
  if (clientId) params.set("client_id", clientId)
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
