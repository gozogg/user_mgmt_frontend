import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

export default function ClientMap({ center, zoom, client }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)

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

    const resize = () => map.resize()
    map.on("load", resize)
    // Parent height can settle after first paint
    requestAnimationFrame(resize)

    return () => {
      markerRef.current?.remove()
      markerRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !client) return

    markerRef.current?.remove()
    markerRef.current = null

    const lng = Number(client.longitude)
    const lat = Number(client.latitude)
    if (Number.isNaN(lng) || Number.isNaN(lat)) return

    map.resize()

    const marker = new mapboxgl.Marker({ color: "#FF0000", scale: 0.8 })
      .setLngLat([lng, lat])
      .addTo(map)

    markerRef.current = marker
    map.flyTo({ center: [lng, lat], zoom: zoom ?? 14 })
  }, [client, zoom])

  return (
    <div
      ref={containerRef}
      className="h-full min-h-[12rem] w-full overflow-hidden rounded-xl"
    />
  )
}
