// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import SignUp from "../components/signup.vue";
import signin from "../components/signin.vue";
import Home from "../components/home.vue";

const routes = [
  {path:"/",name:"Home",component:Home},
  { path: "/signup", name: "SignUp", component: SignUp },
  {path:"/signin",name:"Signin", component: signin},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
