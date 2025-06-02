<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-600">
    <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
      <h2 class="text-2xl font-bold text-center mb-6"> Sign Up</h2>

      <form @submit.prevent="onSubmit" class="space-y-5">
        <div>
          <label for="firstname" class="block mb-1 text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            v-model="form.firstname"
            id="firstname"
            required
            placeholder="Your first name"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="lastname" class="block mb-1 text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            v-model="form.lastname"
            id="lastname"
            required
            placeholder="Your last name"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="username" class="block mb-1 text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            v-model="form.username"
            id="username"
            required
            placeholder="Choose a username"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="password" class="block mb-1 text-sm font-medium text-gray-700">
            Password
          </label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              id="password"
              required
              placeholder="••••••••"
              class="w-full pr-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {{ loading ? "Signing Up..." : "Sign Up" }}
        </button>
      </form>

      <p v-if="errorMessage" class="mt-4 text-center text-sm text-red-600">{{ errorMessage }}</p>
      <p v-if="successMessage" class="mt-4 text-center text-sm text-green-600">{{ successMessage }}</p>

      <div class="mt-4 text-sm text-center">
        <span>Already have an account? </span>
        <router-link to="/signin" class="text-blue-700 hover:underline font-medium">
          Signin
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { Eye, EyeOff } from "lucide-vue-next";

const form = reactive({
  firstname: "",
  lastname: "",
  username: "",
  password: "",
});

const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const router = useRouter();

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

    setTimeout(() => {
      router.push("/signin");
    }, 1500);
  } catch (err: any) {
    errorMessage.value = err.message || "An error occurred";
  } finally {
    loading.value = false;
  }
}
</script>
