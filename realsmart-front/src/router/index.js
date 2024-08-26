import { createRouter, createWebHistory } from "vue-router";
import signUp from "../views/Signup.vue";
import signIn from "../views/Signin.vue";
import Home from "../views/home.vue";

const routes = [
  {
    path: "/signup",
    name: "signUp",
    component: signUp,
  },
  {
    path: "/signin",
    name: "signIn",
    component: signIn,
  },
  {
    path: "/",
    redirect: "/signin",
  },
  {
    path: "/home",
    component: Home,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem("token");
      if (token) {
        next();
      } else {
        alert("Please log in to access this page.");
        next("/signin");
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
