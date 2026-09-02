export const JOB_STATUSES = ["active", "completed", "future", "cancelled"]
export const JOB_DATE_STATUSES = JOB_STATUSES

export function jobStatusLabel(status) {
  return (
    {
      active: "Active",
      completed: "Completed",
      future: "Future",
      cancelled: "Cancelled",
    }[status] || status
  )
}

export function jobStatusClass(status) {
  return (
    {
      active: "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-800",
      future: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    }[status] || "bg-slate-100 text-slate-700"
  )
}

export function jobCardClass(status) {
  return (
    {
      active: "border-yellow-200 bg-yellow-50/40",
      completed: "border-green-200 bg-green-50/40",
      future: "border-blue-200 bg-blue-50/40",
      cancelled: "border-red-200 bg-red-50/40",
    }[status] || "border-slate-200"
  )
}

