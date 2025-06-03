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
const userId = ref("");  // Initialize as empty string and update in onMounted

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
    const res = await fetch("https://voltpoint.onrender.com/api/v1/station/getstation", {
  method: "POST", // important because the backend expects POST
});
    const data = await res.json();

    chargers.value = Array.isArray(data.stations)
      ? data.stations
      : Array.isArray(data)
      ? data
      : [];
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
  userId.value = "";
  router.push("/");
}

async function submitForm() {
  if (!token || !userId.value) {
    alert("Please login again.");
    router.push("/signin");
    return;
  }

  // Validate all required fields
  if (!form.value.stationName || 
      form.value.latitude === null || 
      form.value.longitude === null || 
      form.value.powerOutput === null) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const response = await fetch("https://voltpoint.onrender.com/api/v1/station/createstation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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
        createdBy: userId.value  // ADDED createdBy FIELD
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert("Failed to create station: " + (data.message || "Unknown error"));
      return;
    }

    const newStation = {
      ...(data.station || data),
      createdBy: userId.value,
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
    console.error("Submit form error:", error);
    alert("An error occurred while creating station.");
  }
}

async function deleteStation(charger: any) {
  if (!confirm("Are you sure you want to delete this charging station?")) return;

  try {
    const response = await fetch("https://voltpoint.onrender.com/api/v1/station/deletestation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stationName: charger.stationName,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      alert("Failed to delete station: " + (data.message || "Unknown error"));
      return;
    }

    chargers.value = chargers.value.filter((c) => c._id !== charger._id);
    alert("Charging station deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("An error occurred while deleting station.");
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");

.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: "Inter", sans-serif;
  background-color: #f8f9fb;
}

.sidebar {
  width: 340px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logout-btn {
  background-color: #d32f2f;
  border: none;
  color: white;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}
.logout-btn:hover {
  background-color: #b71c1c;
}

.toggle-form-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}
.toggle-form-btn:hover {
  background-color: #1565c0;
}

.form-popup {
  background-color: #f1f1f1;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 0.8rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.3rem;
  font-weight: 600;
}

.form-group input,
.form-group select {
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.form-actions button {
  cursor: pointer;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  border: none;
  font-weight: 600;
}

.form-actions button[type="submit"] {
  background-color: #388e3c;
  color: white;
}
.form-actions button[type="submit"]:hover {
  background-color: #2e7d32;
}

.form-actions button[type="button"] {
  background-color: #9e9e9e;
  color: white;
}
.form-actions button[type="button"]:hover {
  background-color: #757575;
}

.stations-list {
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 1rem;
}

.stations-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.charger-item {
  background-color: #ffffff;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);
}

.station-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #d32f2f;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.delete-btn:hover {
  color: #b71c1c;
}

.focus-btn {
  margin-top: 0.5rem;
  background-color: #0288d1;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.focus-btn:hover {
  background-color: #0277bd;
}

.map-area {
  flex-grow: 1;
  background-color: #e6f0fa;
  position: relative;
}
</style>
