const MAPBOX_GEOCODE_URL = "https://api.mapbox.com/search/geocode/v6/forward"

function extractPostalCode(feature) {
  const properties = feature?.properties || {}
  if (properties.postcode) return String(properties.postcode)

  const postcode = properties.context?.postcode
  if (postcode && typeof postcode === "object" && postcode.name) {
    return String(postcode.name)
  }
  return null
}

export async function geocodeAddress({ address, city }) {
  const query = [address, city]
    .map((part) => (part || "").trim())
    .filter(Boolean)
    .join(", ")

  if (!query) {
    throw new Error("Address and city are required to place this client on the map")
  }

  const token = import.meta.env.VITE_MAPBOX_TOKEN
  if (!token) {
    throw new Error("Mapbox token is not set")
  }

  const params = new URLSearchParams({
    q: query,
    access_token: token,
    limit: "1",
    types: "address,place",
  })

  const response = await fetch(`${MAPBOX_GEOCODE_URL}?${params}`)
  if (!response.ok) {
    throw new Error("Could not look up that address")
  }

  const data = await response.json()
  const feature = data.features?.[0]
  const coordinates = feature?.geometry?.coordinates
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    throw new Error("No map location found for that address")
  }

  const [longitude, latitude] = coordinates
  return {
    latitude,
    longitude,
    postal_code: extractPostalCode(feature),
  }
}
