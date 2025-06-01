import { createRouter, createWebHistory } from "vue-router";
import SignUp from "../components/signup.vue";
import SignIn from "../components/signin.vue";
import Home from "../components/home.vue";
import Dashboard from "../components/dashboard.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/signup", name: "SignUp", component: SignUp },
  { path: "/signin", name: "SignIn", component: SignIn },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
