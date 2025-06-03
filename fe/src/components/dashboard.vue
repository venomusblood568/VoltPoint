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
            <input
              v-model.number="form.latitude"
              type="number"
              step="any"
              required
            />
          </div>

          <div class="form-group">
            <label>Longitude:</label>
            <input
              v-model.number="form.longitude"
              type="number"
              step="any"
              required
            />
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
            <input
              v-model.number="form.powerOutput"
              type="number"
              min="0"
              required
            />
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
            <button type="button" @click="showCreateForm = false">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <section class="stations-list">
        <h3>Charging Stations</h3>
        <ul>
          <li v-if="chargers.length === 0">No charging stations available.</li>
          <li
            v-for="charger in chargers"
            :key="charger._id"
            class="charger-item"
          >
            <div class="station-header">
              <strong>{{ charger.stationName }}</strong>
              <button
                v-if="userId && charger.createdBy === userId"
                @click="deleteStation(charger)"
                class="delete-btn"
                title="Delete Station"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" x2="10" y1="11" y2="17" />
                  <line x1="14" x2="14" y1="11" y2="17" />
                </svg>
              </button>
            </div>
            Status: {{ charger.status }}<br />
            Power: {{ charger.powerOutput }} kW<br />
            Connector: {{ charger.connectorType }}<br/>
            Latitude: {{ charger.location?.latitude ?? "N/A" }}<br />
            Longitude: {{ charger.location?.longitude ?? "N/A" }}
            <button @click="focusOn(charger)" class="focus-btn">
              Focus on Map
            </button>
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
const userId = ref("");

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
    const res = await fetch(
      "https://voltpoint.onrender.com/api/v1/station/getstation",
      {
        method: "POST",
      }
    );
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

  if (
    !form.value.stationName ||
    form.value.latitude === null ||
    form.value.longitude === null ||
    form.value.powerOutput === null
  ) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const response = await fetch(
      "https://voltpoint.onrender.com/api/v1/station/createstation",
      {
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
          createdBy: userId.value,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(
        "Failed to create station: " +
          (data.message || "Unknown error") +
          (data.message?.includes("already exists")
            ? `\nNote: A station already exists at Latitude or Longitude.`
            : "")
      );
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
    const response = await fetch(
      "https://voltpoint.onrender.com/api/v1/station/deletestation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stationName: charger.stationName,
        }),
      }
    );

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
  background-color: #fff;
  border-right: 1px solid #ddd;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.logout-btn {
  background-color: #e74c3c;
  border: none;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.toggle-form-btn {
  background-color: #3498db;
  border: none;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.toggle-form-btn:hover {
  background-color: #2980b9;
}

.form-popup {
  background-color: #f4f6f9;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.form-popup h3 {
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 0.75rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.form-actions button {
  flex: 1;
  padding: 0.6rem;
  font-weight: 600;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.form-actions button[type="submit"] {
  background-color: #27ae60;
  color: white;
}

.form-actions button[type="submit"]:hover {
  background-color: #219150;
}

.form-actions button[type="button"] {
  background-color: #e0e0e0;
}

.form-actions button[type="button"]:hover {
  background-color: #cfcfcf;
}

.stations-list {
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 1rem;
}

.stations-list h3 {
  margin-bottom: 0.75rem;
}

.charger-item {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.station-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #e74c3c;
}

.delete-btn:hover {
  color: #c0392b;
}

.focus-btn {
  align-self: flex-start;
  margin-top: 0.5rem;
  background-color: #3498db;
  border: none;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}

.focus-btn:hover {
  background-color: #2980b9;
}

.map-area {
  flex-grow: 1;
  position: relative;
}
</style>
