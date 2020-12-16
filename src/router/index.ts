import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/about"
  },
  {
    path: "/damage-sim",
    name: "DamageSim",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DamageSim.vue")
  },
  {
    path: "/die-roller",
    name: "DieRollerCollection",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DieRollerCollection.vue")
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
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export default router;
