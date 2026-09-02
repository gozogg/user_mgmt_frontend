import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { DAYS_OF_WEEK, jobDateStatusLabel, jobDayColor } from "../utils/jobDay"

export default function FullMap({ center, zoom, jobs = [] }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    const token = import.meta.env.VITE_MAPBOX_TOKEN
    if (!token) {
      console.error("Missing MAPBOX_TOKEN in .env")
      return
    }

    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom,
    })

    map.addControl(new mapboxgl.NavigationControl(), "top-right")
    mapRef.current = map

    const resize = () => map.resize()
    map.on("load", resize)
    requestAnimationFrame(resize)

    const observer = new ResizeObserver(resize)
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    const bounds = new mapboxgl.LngLatBounds()
    let hasPoint = false

    jobs.forEach((job) => {
      const lng = Number(job.longitude)
      const lat = Number(job.latitude)
      if (Number.isNaN(lng) || Number.isNaN(lat)) return

      const color = jobDayColor(job.day_of_week)

      const marker = new mapboxgl.Marker({ color, scale: 0.8 })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 16 }).setText(
            `${job.first_name || ""} ${job.last_name || ""}`.trim() ||
              job.description ||
              "Job"
          )
        )
        .addTo(map)

      markersRef.current.push(marker)
      bounds.extend([lng, lat])
      hasPoint = true
    })

    if (hasPoint) {
      map.resize()
      map.fitBounds(bounds, { padding: 48, maxZoom: 14 })
    }
  }, [jobs])

  return (
    <div className="relative h-full min-h-[24rem] w-full">
      <div ref={containerRef} className="h-full w-full" />

      {/* <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Marker colors
        </p>
        <ul className="flex gap-3">
          {DAYS_OF_WEEK.map((day) => (
            <li key={day} className="flex items-center gap-2 text-sm text-slate-700">
              <span
                className="h-3 w-3 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: jobDayColor(day) }}
              />
              {jobDateStatusLabel(day)}
            </li>
          ))}
          <li className="flex items-center gap-2 text-sm text-slate-700">
            <span
              className="h-3 w-3 shrink-0 rounded-full border border-black/10"
              style={{ backgroundColor: jobDayColor(null) }}
            />
            One-time / no day
          </li>
        </ul>
      </div> */}
    </div>
  )
}
