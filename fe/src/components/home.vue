<script setup lang="ts">
import { ref, onMounted } from "vue";
import MapView from "./MapView.vue";

const chargers = ref<any[]>([]);
const mapViewRef = ref();

function focusOn(charger: any) {
  mapViewRef.value?.focusOnCharger(charger);
}

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/station/getstation");
    const data = await res.json();
    chargers.value = data.stations || data || [];
  } catch (error) {
    console.error("Error fetching stations:", error);
  }
});
</script>

<template>
  <div class="h-screen flex">
    <aside class="w-80 bg-gray-900 text-white p-6 flex flex-col">
      <h1 class="text-3xl font-bold mb-6">⚡ Chargers</h1>
      <ul
        class="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
      >
        <li
          v-for="charger in chargers"
          :key="charger._id?.$oid || charger._id"
          @click="focusOn(charger)"
          class="cursor-pointer bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-shadow shadow-sm"
        >
          <p class="font-semibold text-lg truncate">
            {{ charger.stationName || "Unknown Station" }}
          </p>
          <p class="text-sm text-gray-400 truncate">
            📍
            {{
              charger.location?.latitude !== undefined
                ? charger.location.latitude.toFixed(4)
                : charger.location?.coordinates
                ? charger.location.coordinates[1].toFixed(4)
                : "N/A"
            }},
            {{
              charger.location?.longitude !== undefined
                ? charger.location.longitude.toFixed(4)
                : charger.location?.coordinates
                ? charger.location.coordinates[0].toFixed(4)
                : "N/A"
            }}
          </p>
        </li>
      </ul>
    </aside>

    <main class="flex-1">
      <MapView ref="mapViewRef" :chargers="chargers" />
    </main>
  </div>
</template>

<style scoped>
/* Smooth scrollbar styling */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #4b5563; /* gray-700 */
  border-radius: 3px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background-color: #1f2937; /* gray-900 */
}
</style>
