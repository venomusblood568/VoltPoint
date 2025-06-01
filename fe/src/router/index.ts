// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import SignUp from "../components/signup.vue";


const routes = [
  { path: "/signup", name: "SignUp", component: SignUp },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
