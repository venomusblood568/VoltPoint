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
          <li v-for="charger in chargers" :key="charger._id" class="charger-item">
            <div class="station-header">
              <strong>{{ charger.stationName }}</strong>
              <button 
                v-if="userId && charger.createdBy === userId" 
                @click="deleteStation(charger)" 
                class="delete-btn"
                title="Delete Station"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  <line x1="10" x2="10" y1="11" y2="17"/>
                  <line x1="14" x2="14" y1="11" y2="17"/>
                </svg>
              </button>
            </div>
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
import MapView from "./mapView.vue";

const chargers = ref<any[]>([]);
const mapViewRef = ref<InstanceType<typeof MapView> | null>(null);
const router = useRouter();

const username = ref("");
const token = localStorage.getItem("token");
const userId = ref(localStorage.getItem("userId"));

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
  const storedUserId = localStorage.getItem("userId");
  
  if (!storedUser || !token || !storedUserId) {
    router.push("/signin");
    return;
  }
  
  username.value = storedUser;
  userId.value = storedUserId;

  try {
    const res = await fetch("http://localhost:3000/api/v1/station/getstation");
    const data = await res.json();
    
    chargers.value = Array.isArray(data.stations) ? data.stations : 
                     Array.isArray(data) ? data : [];
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
  if (!token || !userId.value) {
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

    const newStation = {
      ...(data.station || data),
      createdBy: userId.value
    };
    
    chargers.value.push(newStation);
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

async function deleteStation(charger: any) {
  if (!confirm("Are you sure you want to delete this charging station?")) return;
  
  try {
    const response = await fetch("http://localhost:3000/api/v1/station/deletestation", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stationName: charger.stationName
      })
    });

    if (!response.ok) {
      const data = await response.json();
      alert("Failed to delete station: " + (data.message || "Unknown error"));
      return;
    }

    chargers.value = chargers.value.filter(c => c._id !== charger._id);
    alert("Charging station deleted successfully!");
    
  } catch (error) {
    console.error(error);
    alert("An error occurred while deleting station.");
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  background-color: #f8f9fb;
}

/* Sidebar styling */
.sidebar {
  width: 340px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.sidebar header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.sidebar h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.logout-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #dc3545;
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.2s ease-in-out;
}

.logout-btn:hover {
  color: #a71d2a;
}

.toggle-form-btn {
  background-color: #007bff;
  border: none;
  padding: 0.65rem 1rem;
  color: white;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.2s ease-in-out;
}

.toggle-form-btn:hover {
  background-color: #0056b3;
}

.form-popup {
  background: #f1f3f5;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 6px rgba(0,0,0,0.1);
}

.form-popup h3 {
  margin-top: 0;
  font-weight: 700;
  color: #222;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.25rem;
  font-weight: 600;
  color: #555;
}

.form-group input,
.form-group select {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline-offset: 2px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.form-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.form-actions button[type="submit"] {
  background-color: #28a745;
  color: white;
}

.form-actions button[type="submit"]:hover {
  background-color: #218838;
}

.form-actions button[type="button"] {
  background-color: #6c757d;
  color: white;
}

.form-actions button[type="button"]:hover {
  background-color: #5a6268;
}

.stations-list {
  flex-grow: 1;
  overflow-y: auto;
}

.stations-list h3 {
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #222;
}

.stations-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.charger-item {
  background-color: #fff;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
}

.station-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #dc3545;
  transition: color 0.2s ease-in-out;
}

.delete-btn:hover {
  color: #a71d2a;
}

.focus-btn {
  align-self: flex-start;
  background-color: #007bff;
  border: none;
  padding: 0.35rem 0.6rem;
  color: white;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s ease-in-out;
}

.focus-btn:hover {
  background-color: #0056b3;
}

/* Main map area */
.map-area {
  flex-grow: 1;
  background-color: #e6ecf3;
  position: relative;
}
</style>
