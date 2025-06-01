<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import MapView from "./mapView.vue";

const router = useRouter();
const chargers = ref<any[]>([]);
const mapViewRef = ref();

function focusOn(charger: any) {
  mapViewRef.value?.focusOnCharger(charger);
}

function goToLogin() {
  router.push("/signin");
}

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/station/getstation");
    const data = await res.json();
    chargers.value = data.stations || data || [];
    console.log("chargers:", chargers.value); // Check your data shape here
  } catch (error) {
    console.error("Error fetching stations:", error);
  }
});
</script>

<template>
  <div class="h-screen flex">
    <!-- Sidebar -->
    <aside
      class="w-72 bg-gray-900 text-white p-4 flex flex-col justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold mb-4">⚡ Chargers</h1>
        <ul
          class="space-y-2 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900"
        >
          <li
            v-for="charger in chargers"
            :key="charger._id?.$oid || charger._id"
            @click="focusOn(charger)"
            class="cursor-pointer bg-gray-800 rounded p-3 hover:bg-gray-700 transition"
          >
            <p class="font-semibold">
              {{ charger.stationName || "Unknown Station" }}
            </p>
            <p class="text-sm text-gray-400">
              📍
              {{
                charger.location?.latitude !== undefined
                  ? charger.location.latitude
                  : charger.location?.coordinates
                  ? charger.location.coordinates[1]
                  : "N/A"
              }},
              {{
                charger.location?.longitude !== undefined
                  ? charger.location.longitude
                  : charger.location?.coordinates
                  ? charger.location.coordinates[0]
                  : "N/A"
              }}
            </p>
          </li>
        </ul>
      </div>

      <button
        @click="goToLogin"
        class="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded p-2"
      >
        🔐 Login
      </button>
    </aside>

    <!-- Map View -->
    <main class="flex-1">
      <MapView ref="mapViewRef" :chargers="chargers" />
    </main>
  </div>
</template>
