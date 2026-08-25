export const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export function jobDateStatusLabel(day) {
  return (
    {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    }[day] || day
  )
}

export function jobDayColor(day) {
  return (
    {
      monday: "#FF1E00",
      tuesday: "#FF8C00",
      wednesday: "#FFD700",
      thursday: "#90EE90",
      friday: "#1E90FF",
      saturday: "#8A2BE2",
      sunday: "#FF1493",
    }[day] || "#808080"
  )
}
