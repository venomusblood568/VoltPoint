<template>
  <div class="min-h-screen radial-bg flex items-center justify-center px-4">
    <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
        Create an Account
      </h1>

      <form @submit.prevent="onSubmit" class="space-y-5">
        <!-- Error / Success Messages -->
        <div v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="text-green-600 text-sm text-center">
          {{ successMessage }}
        </div>

        <!-- First Name -->
        <div>
          <label class="block mb-1 text-gray-700" for="firstname">First Name</label>
          <input
            id="firstname"
            v-model="form.firstname"
            type="text"
            placeholder="John"
            required
            class="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block mb-1 text-gray-700" for="lastname">Last Name</label>
          <input
            id="lastname"
            v-model="form.lastname"
            type="text"
            placeholder="Doe"
            required
            class="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Username -->
        <div>
          <label class="block mb-1 text-gray-700" for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="john_doe"
            required
            class="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Password -->
        <label class="block mb-1 text-gray-700" for="password">Password</label>
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="form.password"
            placeholder="••••••••"
            required
            class="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-2 pr-3 flex items-center text-gray-600 hover:text-gray-900"
          >
            <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
          </button>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
        >
          {{ loading ? "Signing Up..." : "Sign Up" }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Already have an account?
        <a href="/signin" class="text-blue-600 hover:underline">Sign In</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { Eye, EyeOff } from "lucide-vue-next";

// Form state
const form = reactive({
  firstname: "",
  lastname: "",
  username: "",
  password: "",
});

// Toggles
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// Submit handler
async function onSubmit() {
  errorMessage.value = "";
  successMessage.value = "";
  loading.value = true;

  try {
    const response = await fetch("http://localhost:3000/api/v1/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    successMessage.value = "Signup successful! Please sign in.";
    window.location.href = "/signin";
  } catch (err: any) {
    errorMessage.value = err.message || "An error occurred";
  } finally {
    loading.value = false;
  }
}
</script>
