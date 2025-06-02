<template>
  <div class="signin-container">
    <h2>Sign In</h2>
    <form @submit.prevent="onSubmit">
      <div>
        <label for="username">Username:</label>
        <input v-model="form.username" id="username" required />
      </div>

      <div>
        <label for="password">Password:</label>
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="form.password"
          id="password"
          required
        />
        <button type="button" @click="showPassword = !showPassword">
          {{ showPassword ? "Hide" : "Show" }}
        </button>
      </div>

      <button type="submit" :disabled="loading">Sign In</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

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

<style scoped>
.signin-container {
  max-width: 400px;
  margin: auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.error {
  color: red;
}
.success {
  color: green;
}
</style>
