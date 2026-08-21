export const JOB_DATE_STATUSES = ["not_complete", "complete", "invoiced"]

export function jobDateStatusLabel(status) {
  return (
    {
      not_complete: "Not complete",
      complete: "Complete",
      invoiced: "Invoiced",
    }[status] || status
  )
}

export function jobDateStatusClass(status) {
  return (
    {
      not_complete: "bg-slate-100 text-slate-700",
      complete: "bg-green-100 text-green-800",
      invoiced: "bg-blue-100 text-blue-800",
    }[status] || "bg-slate-100 text-slate-700"
  )
}

export function jobDateCardClass(status) {
  return (
    {
      not_complete: "border-slate-200",
      complete: "border-green-200 bg-green-50/40",
      invoiced: "border-blue-200 bg-blue-50/40",
    }[status] || "border-slate-200"
  )
}

export function jobDateStatusIcon(status) {
  return (
    {
      not_complete: "fa-circle text-slate-300",
      complete: "fa-circle-check text-green-600",
      invoiced: "fa-file-invoice-dollar text-blue-600",
    }[status] || "fa-circle text-slate-300"
  )
}

export function nextJobDateStatus(status) {
  const current = JOB_DATE_STATUSES.indexOf(status)
  const index = current === -1 ? 0 : (current + 1) % JOB_DATE_STATUSES.length
  return JOB_DATE_STATUSES[index]
}
