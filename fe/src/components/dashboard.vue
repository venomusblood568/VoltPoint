<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <header>
        <h2>Welcome, {{ username }}</h2>
        <button @click="logout" class="logout-btn">Logout</button>
      </header>

      <button @click="showCreateForm = !showCreateForm" class="toggle-form-btn">
        {{ showCreateForm ? "Hide" : "Create New Charging Station" }}
      </button>

      <div v-if="showCreateForm" class="form-popup">
        <h3>Create Charging Station</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label>Station Name:</label>
            <input v-model="form.stationName" required />
          </div>

          <div class="form-group">
            <label>Latitude:</label>
            <input v-model.number="form.latitude" type="number" step="any" required />
          </div>

          <div class="form-group">
            <label>Longitude:</label>
            <input v-model.number="form.longitude" type="number" step="any" required />
          </div>

          <div class="form-group">
            <label>Status:</label>
            <select v-model="form.status">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div class="form-group">
            <label>Power Output (kW):</label>
            <input v-model.number="form.powerOutput" type="number" min="0" required />
          </div>

          <div class="form-group">
            <label>Connector Type:</label>
            <select v-model="form.connectorType">
              <option>Type1</option>
              <option>Type2</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="submit">Submit</button>
            <button type="button" @click="showCreateForm = false">Cancel</button>
          </div>
        </form>
      </div>

      <section class="stations-list">
        <h3>Charging Stations</h3>
        <ul>
          <li v-if="chargers.length === 0">No charging stations available.</li>
          <li v-for="charger in chargers" :key="charger._id || charger.stationName" class="charger-item">
            <strong>{{ charger.stationName }}</strong><br />
            Status: {{ charger.status }}<br />
            Power: {{ charger.powerOutput }} kW<br />
            Connector: {{ charger.connectorType }}
            <button @click="focusOn(charger)" class="focus-btn">Focus on Map</button>
          </li>
        </ul>
      </section>
    </aside>

    <!-- Main Map View -->
    <main class="map-area">
      <MapView ref="mapViewRef" :chargers="chargers" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import MapView from "./mapView.vue"; // Import only, no duplicate declaration

const chargers = ref<any[]>([]);
const mapViewRef = ref<InstanceType<typeof MapView> | null>(null);

const router = useRouter();

const username = ref("");
const token = localStorage.getItem("token");

const showCreateForm = ref(false);
const form = ref({
  stationName: "",
  latitude: null as number | null,
  longitude: null as number | null,
  status: "Active",
  powerOutput: null as number | null,
  connectorType: "Type1",
});

onMounted(async () => {
  const storedUser = localStorage.getItem("username");
  if (!storedUser || !token) {
    router.push("/signin");
    return;
  }
  username.value = storedUser;

  try {
    const res = await fetch("http://localhost:3000/api/v1/station/getstation");
    const data = await res.json();
    chargers.value = data.stations || data || [];
  } catch (error) {
    console.error("Error fetching stations:", error);
  }
});

function focusOn(charger: any) {
  if (mapViewRef.value?.focusOnCharger) {
    mapViewRef.value.focusOnCharger(charger);
  } else {
    alert(`Focus on station: ${charger.stationName}`);
  }
}

function logout() {
  localStorage.clear();
  router.push("/signin");
}

async function submitForm() {
  if (!token) {
    alert("Please login again.");
    router.push("/signin");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/v1/station/createstation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stationName: form.value.stationName,
        location: {
          latitude: form.value.latitude,
          longitude: form.value.longitude,
        },
        status: form.value.status,
        powerOutput: form.value.powerOutput,
        connectorType: form.value.connectorType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert("Failed to create station: " + (data.message || "Unknown error"));
      return;
    }

    chargers.value.push(data.station || data);
    alert("Charging station created successfully!");
    showCreateForm.value = false;

    form.value = {
      stationName: "",
      latitude: null,
      longitude: null,
      status: "Active",
      powerOutput: null,
      connectorType: "Type1",
    };
  } catch (error) {
    console.error(error);
    alert("An error occurred while creating station.");
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

/* Sidebar styling */
.sidebar {
  width: 320px;
  background-color: #f4f4f4;
  border-right: 1px solid #ccc;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.logout-btn {
  background-color: #d9534f;
  border: none;
  padding: 0.4rem 0.8rem;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.toggle-form-btn {
  margin-bottom: 1rem;
  background-color: #0275d8;
  color: white;
  border: none;
  padding: 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}

.form-popup {
  background: white;
  border: 1px solid #aaa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 0.8rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.4rem;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.form-actions button {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions button[type="submit"] {
  background-color: #5cb85c;
  color: white;
}

.form-actions button[type="button"] {
  background-color: #d9534f;
  color: white;
}

.stations-list {
  flex-grow: 1;
  overflow-y: auto;
}

.stations-list h3 {
  margin-bottom: 0.5rem;
}

.charger-item {
  background: white;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  box-shadow: 0 0 3px rgba(0,0,0,0.1);
}

.focus-btn {
  margin-top: 0.5rem;
  background-color: #0275d8;
  border: none;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

/* Main map area */
.map-area {
  flex-grow: 1;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>