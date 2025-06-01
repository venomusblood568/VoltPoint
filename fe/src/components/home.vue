<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import MapView from "./mapView.vue";

const chargers = ref<any[]>([]);
const mapViewRef = ref();
const router = useRouter();

function focusOn(charger: any) {
  mapViewRef.value?.focusOnCharger(charger);
}

function goToSignIn() {
  router.push("/signin");
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
    <!-- Sidebar -->
    <aside class="w-96 bg-black text-white p-6 flex flex-col">
      <h1 class="text-3xl font-bold mb-6">⚡ Chargers</h1>

      <!-- Charger List -->
      <ul
        class="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
      >
        <li
          v-for="charger in chargers"
          :key="charger._id?.$oid || charger._id"
          @click="focusOn(charger)"
          class="cursor-pointer  rounded-lg p-4 hover:bg-gray-700 transition-shadow shadow-sm"
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

      <!-- Login Button -->
      <button
        @click="goToSignIn"
        class="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
      >
       Login
      </button>
    </aside>

    <!-- Main Map View -->
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
