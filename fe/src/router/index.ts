// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import SignUp from "../components/signup.vue";
import signin from "../components/signin.vue";

const routes = [
  { path: "/signup", name: "SignUp", component: SignUp },
  {path:"/signin",name:"Signin", component: signin},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
