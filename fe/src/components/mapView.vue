<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  chargers: {
    _id: { $oid?: string } | string
    stationName: string
    location: { latitude?: number; longitude?: number; coordinates?: number[] }
  }[]
}>()

const mapElement = ref<HTMLDivElement | null>(null)
const mapRef = ref<L.Map>()
const markerMap = new Map<string, L.Marker>()

// Helper to get unique ID string
function getId(charger: any) {
  if (typeof charger._id === 'string') return charger._id
  if (charger._id && charger._id.$oid) return charger._id.$oid
  return JSON.stringify(charger) // fallback (should not happen)
}

// Helper to get lat/lng safely
function getLatLng(charger: any): [number, number] {
  if (charger.location?.latitude !== undefined && charger.location?.longitude !== undefined) {
    return [charger.location.latitude, charger.location.longitude]
  } else if (charger.location?.coordinates && charger.location.coordinates.length === 2) {
    // GeoJSON coordinates: [lng, lat]
    return [charger.location.coordinates[1], charger.location.coordinates[0]]
  }
  return [0, 0] // fallback location
}

onMounted(() => {
  mapRef.value = L.map(mapElement.value!).setView([20.5937, 78.9629], 5) // Center of India

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapRef.value)
})

watch(
  () => props.chargers,
  (newChargers) => {
    // Remove existing markers
    markerMap.forEach((marker) => marker.remove())
    markerMap.clear()

    newChargers.forEach((charger) => {
      const [lat, lng] = getLatLng(charger)
      const status = charger.status ?? 'Unknown'
      const powerOutput = charger.powerOutput ?? 'N/A'
      const connectorType = charger.connectorType ?? 'N/A'

      const popupContent = `
        <b>${charger.stationName}</b><br>
        Status: ${status}<br>
        Power Output: ${powerOutput} kW<br>
        Connector Type: ${connectorType}<br>
        Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}
      `

      const marker = L.marker([lat, lng])
        .addTo(mapRef.value!)
        .bindPopup(popupContent)

      markerMap.set(getId(charger), marker)
    })
  },
  { immediate: true }
)


function focusOnCharger(charger: any) {
  const marker = markerMap.get(getId(charger))
  if (marker) {
    mapRef.value?.setView(marker.getLatLng(), 13, { animate: true })
    marker.openPopup()
  }
}

defineExpose({ focusOnCharger })
</script>

<template>
  <div ref="mapElement" class="w-full h-screen"></div>
</template>
