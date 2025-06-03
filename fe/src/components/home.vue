<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import MapView from "./mapView.vue";

const chargers = ref<any[]>([]);
const mapViewRef = ref();
const router = useRouter();

// Filters
const selectedStatus = ref<string | null>(null);
const minPower = ref<number | null>(null);
const selectedConnector = ref<string | null>(null);

// Unique filter options
const uniqueStatuses = computed(() =>
  Array.from(new Set(chargers.value.map((c) => c.status).filter(Boolean)))
);
const uniqueConnectors = computed(() =>
  Array.from(new Set(chargers.value.map((c) => c.connectorType).filter(Boolean)))
);

// Filtered chargers based on selected filters
const filteredChargers = computed(() =>
  chargers.value.filter((c) => {
    const statusMatch = !selectedStatus.value || c.status === selectedStatus.value;
    const powerMatch = !minPower.value || c.powerOutput >= minPower.value;
    const connectorMatch = !selectedConnector.value || c.connectorType === selectedConnector.value;
    return statusMatch && powerMatch && connectorMatch;
  })
);

function focusOn(charger: any) {
  mapViewRef.value?.focusOnCharger(charger);
}

function goToSignIn() {
  router.push("/signin");
}

onMounted(async () => {
  try {
    const res = await fetch("https://voltpoint.onrender.com/api/v1/station/getstation", {
  method: "POST", // important because the backend expects POST
});
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
    <aside class="w-96 bg-white text-black p-6 flex flex-col">
      <h1 class="text-3xl font-bold mb-4">⚡ VoltPoints</h1>

      <!-- Filters -->
      <div class="space-y-2 mb-4 ">
        <!-- Status Filter -->
        <select v-model="selectedStatus" class="w-full p-2 border rounded">
          <option value="">All Statuses</option>
          <option v-for="status in uniqueStatuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>

        <!-- Power Output Filter -->
        <input
          v-model.number="minPower"
          type="number"
          class="w-full p-2 border rounded"
          placeholder="Min Power Output (kW)"
        />

        <!-- Connector Type Filter -->
        <select v-model="selectedConnector" class="w-full p-2 border rounded">
          <option value="">All Connectors</option>
          <option v-for="type in uniqueConnectors" :key="type" :value="type">
            {{ type }}
          </option>
        </select>

        <!-- Clear Filters Button -->
        <button
          @click="
            selectedStatus = null;
            minPower = null;
            selectedConnector = null;
          "
          class="w-full bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded"
        >
          Clear Filters
        </button>
      </div>

      <!-- Charger List -->
      <ul class="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <li
          v-for="charger in filteredChargers"
          :key="charger._id?.$oid || charger._id"
          @click="focusOn(charger)"
          class="cursor-pointer rounded-lg p-4 hover:bg-gray-500 transition-shadow shadow-sm"
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

          <div class="mt-2 text-sm text-gray-600 space-y-1">
            <p>Type: {{ charger.connectorType || "N/A" }}</p>
            <p>Power: {{ charger.powerOutput ? charger.powerOutput + ' kW' : "N/A" }}</p>
            <p>Status: {{ charger.status || "N/A" }}</p>
          </div>
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
      <MapView ref="mapViewRef" :chargers="filteredChargers" />
    </main>
  </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #4b5563;
  border-radius: 3px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background-color: #1f2937;
}
</style>
