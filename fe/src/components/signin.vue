<script setup lang="ts">
import { reactive,ref } from "vue";
import { Eye, EyeOff } from 'lucide-vue-next';
// reactive form data
const form = reactive({
  firstname: "",
  lastname: "",
  username: "",
  password: "",
});

// toggle password visibility
const showPassword = ref(false);

function onSubmit() {
  alert(
    `Signing in ${form.firstname} ${form.lastname} with username ${form.username}`
  );
  // You can add your API call here
}
</script>

<template>
  <div class="min-h-screen radial-bg flex items-center justify-center px-4">
    <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
        Sign In
      </h1>
      <form @submit.prevent="onSubmit" class="space-y-5">
        <div>
          <label class="block mb-1 text-gray-700" for="username"
            >Username</label
          >
          <input
            id="username"
            v-model="form.username"
            name="username"
            type="text"
            placeholder="john_doe"
            required
            class="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <label class="block mb-1 text-gray-700" for="password">Password</label>
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="form.password"
            name="password"
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
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Sign In
        </button>
      </form>
      <p class="text-center text-sm text-gray-500 mt-6">
        Create account ? 
        <a href="/signup" class="text-blue-600 hover:underline">Sign Up</a>
      </p>
    </div>
  </div>
</template>
