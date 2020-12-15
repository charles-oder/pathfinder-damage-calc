import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import DamageSim from "../views/DamageSim.vue";
import DieRollerCollection from "../views/DieRollerCollection.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/about"
  },
  {
    path: "/damage-sim",
    name: "DamageSim",
    component: DamageSim
  },
  {
    path: "/die-roller",
    name: "DieRollerCollection",
    component: DieRollerCollection
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
