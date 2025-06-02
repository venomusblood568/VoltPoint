<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-600">
    <div class="max-w-md w-full p-6 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center">
      <h2 class="text-2xl font-bold text-center mb-6">🔐 Sign In</h2>

      <form @submit.prevent="onSubmit" class="w-full space-y-5">
        <div>
          <label for="username" class="block mb-1 text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            v-model="form.username"
            id="username"
            type="text"
            required
            placeholder="Your username"
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
          {{ loading ? "Signing In..." : "Sign In" }}
        </button>
      </form>
      <div class="mt-4 text-sm text-center">
  <span>Don't have an account? </span>
  <router-link to="/signup" class="text-blue-700 hover:underline font-medium">
    Signup
  </router-link>
</div>
      <p v-if="errorMessage" class="mt-4 text-center text-sm text-red-600">{{ errorMessage }}</p>
      <p v-if="successMessage" class="mt-4 text-center text-sm text-green-600">{{ successMessage }}</p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { Eye, EyeOff } from "lucide-vue-next";

const form = reactive({
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
    const response = await fetch("http://localhost:3000/api/v1/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Sign in failed");

    successMessage.value = "Signed in successfully!";
    localStorage.setItem("username", form.username);
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);

    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  } catch (err: any) {
    errorMessage.value = err.message || "Something went wrong";
  } finally {
    loading.value = false;
  }
}
</script>
