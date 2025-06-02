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
    
    // Ensure we have an array of stations
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

    // Add createdBy field to new station
    const newStation = {
      ...(data.station || data),
      createdBy: userId.value
    };
    
    chargers.value.push(newStation);
    alert("Charging station created successfully!");
    showCreateForm.value = false;

    // Reset form
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

    // Remove station from local list
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
  color: #d9534f;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: color 0.2s;
}
.logout-btn:hover {
  color: #c9302c;
}

.toggle-form-btn {
  margin-bottom: 1rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}
.toggle-form-btn:hover {
  background-color: #4338ca;
}

.form-popup {
  background: #f0f4ff;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: inset 0 0 10px #a0b9ff44;
}

.form-popup h3 {
  margin-bottom: 1rem;
  font-weight: 700;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.3rem;
  font-weight: 600;
  color: #555;
}

.form-group input,
.form-group select {
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 5px #4f46e5aa;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.form-actions button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 1.1rem;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.form-actions button[type="button"] {
  background-color: #999;
}
.form-actions button:hover {
  background-color: #4338ca;
}

.stations-list {
  flex-grow: 1;
  overflow-y: auto;
}

.stations-list h3 {
  margin-bottom: 0.75rem;
  font-weight: 700;
  color: #2c3e50;
}

.stations-list ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.charger-item {
  background: white;
  border-radius: 6px;
  padding: 0.8rem 1rem;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 6px #00000010;
  position: relative;
}

.station-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #d9534f;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}
.delete-btn:hover {
  color: #c9302c;
}

.focus-btn {
  margin-top: 0.5rem;
  background-color: #10b981;
  border: none;
  color: white;
  font-size: 0.9rem;
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.25s ease;
}
.focus-btn:hover {
  background-color: #059669;
}

/* Main map area */
.map-area {
  flex-grow: 1;
  position: relative;
  background-color: #e5e7eb;
  overflow: hidden;
}
</style>
