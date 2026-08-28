import { request } from "./http"

export function getUnassignedJobs() {
  return request("/schedule/unassigned")
}

export function previewSchedule({ from_date, to_date }) {
  return request("/schedule/preview", {
    method: "POST",
    body: JSON.stringify({ from_date, to_date }),
  })
}

export function applySchedule({ from_date, to_date, preview }) {
  return request("/schedule/apply", {
    method: "POST",
    body: JSON.stringify({ from_date, to_date, preview }),
  })
}
