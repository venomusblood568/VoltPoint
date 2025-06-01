<script setup lang="ts">
import { reactive } from "vue";

// reactive form data
const form = reactive({
  firstname: "",
  lastname: "",
  username: "",
  password: "",
});

function onSubmit() {
  alert(
    `Signing up ${form.firstname} ${form.lastname} with username ${form.username}`
  );
  // You can add your API call here
}
</script>

<template>
  <div class="min-h-screen radial-bg flex items-center justify-center px-4">
    <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
        Create an Account
      </h1>
      <form @submit.prevent="onSubmit" class="space-y-5">
        <div>
          <label class="block mb-1 text-gray-700" for="firstname"
            >First Name</label
          >
          <input
            id="firstname"
            v-model="form.firstname"
            name="firstname"
            type="text"
            placeholder="John"
            required
            class="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block mb-1 text-gray-700" for="lastname"
            >Last Name</label
          >
          <input
            id="lastname"
            v-model="form.lastname"
            name="lastname"
            type="text"
            placeholder="Doe"
            required
            class="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
        <div>
          <label class="block mb-1 text-gray-700" for="password"
            >Password</label
          >
          <input
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Sign Up
        </button>
      </form>
      <p class="text-center text-sm text-gray-500 mt-6">
        Already have an account?
        <a href="/signin" class="text-blue-600 hover:underline">Sign In</a>
      </p>
    </div>
  </div>
</template>
