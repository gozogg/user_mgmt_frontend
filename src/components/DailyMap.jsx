import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { jobDayColor } from "../utils/jobDay"

export default function DailyMap({ center, zoom, jobs = [] }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  // Create the map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    const token = import.meta.env.VITE_MAPBOX_TOKEN
    if (!token) {
      console.error("Missing VITE_MAPBOX_TOKEN in .env")
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

    jobs.forEach((job) => {
      const lng = Number(job.longitude)
      const lat = Number(job.latitude)
      if (Number.isNaN(lng) || Number.isNaN(lat)) return

      const color = jobDayColor(job.day_of_week)

      const marker = new mapboxgl.Marker({ color , scale: 0.8 })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 16 }).setText(
             `${job.first_name} ${job.last_name}`
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
