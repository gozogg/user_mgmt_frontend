import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { jobDayColor } from "../utils/jobDay"

function markerTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.62 ? "#0f172a" : "#ffffff"
}

function createStopMarker(stopLabel, color) {
  const el = document.createElement("div")
  el.className = "daily-map-marker"
  el.innerHTML = `
    <div class="daily-map-marker__body" style="--marker-color: ${color}; --marker-text: ${markerTextColor(color)};">
      <span class="daily-map-marker__number">${stopLabel}</span>
    </div>
    <span class="daily-map-marker__point" style="--marker-color: ${color};"></span>
  `
  return el
}

export default function DailyMap({ center, zoom, jobs = [] }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  // Create the map once
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
    map.on("load", () => map.resize())

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update markers whenever jobs change (after fetch completes)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    const bounds = new mapboxgl.LngLatBounds()
    let hasPoint = false

    jobs.forEach((job, index) => {
      const lng = Number(job.longitude)
      const lat = Number(job.latitude)
      if (Number.isNaN(lng) || Number.isNaN(lat)) return

      const color = jobDayColor(job.day_of_week)
      const stopLabel = job.stop_order ?? index + 1
      const el = createStopMarker(stopLabel, color)

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 16 }).setText(
             `#${stopLabel} ${job.first_name} ${job.last_name}`
          )
        )
        .addTo(map)

      markersRef.current.push(marker)
      bounds.extend([lng, lat])
      hasPoint = true
    })

    if (hasPoint) {
      map.fitBounds(bounds, { padding: 48, maxZoom: 14 })
    }
  }, [jobs])

  return (
    <div
      ref={containerRef}
      className="h-full min-h-[24rem] w-full overflow-hidden rounded-xl border border-slate-200"
    />
  )
}
