<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const props = defineProps<{
  chargers: Array<{
    stationName: string;
    location: { latitude: number; longitude: number };
    status: string;
    powerOutput: number;
    connectorType: string;
  }>;
}>();

const mapContainer = ref<HTMLDivElement | null>(null);
let map: L.Map | null = null;
let markersLayer: L.LayerGroup | null = null;

function updateMarkers() {
  if (!markersLayer) return;

  markersLayer.clearLayers();

  props.chargers.forEach((charger) => {
    if (
      charger.location?.latitude != null &&
      charger.location?.longitude != null
    ) {
      const marker = L.marker([
        charger.location.latitude,
        charger.location.longitude,
      ]).bindPopup(
        `<b>${charger.stationName}</b><br>Status: ${charger.status}<br>Power: ${charger.powerOutput} kW<br>Connector: ${charger.connectorType}`
      );
      if (!markersLayer) return;
      markersLayer.addLayer(marker);
    }
  });
}

onMounted(() => {
  if (mapContainer.value) {
    map = L.map(mapContainer.value).setView([0, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);

    updateMarkers();
  }
});

watch(
  () => props.chargers,
  () => {
    updateMarkers();
  },
  { deep: true }
);

function focusOnCharger(charger: any) {
  if (map && charger.location) {
    map.setView(
      [charger.location.latitude, charger.location.longitude],
      15,
      { animate: true }
    );
  }
}

// expose focusOnCharger method for parent component usage
defineExpose({ focusOnCharger });
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
</style>
