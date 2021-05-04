import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
const index = () => import("@/components/myindex");
const item = () => import("@/components/myitem");
const admin = () => import("@/components/myadmin");
const edititem = () => import("@/components/myedititem");
const router = new Router({
  routes: [
    {
      path: "/",
      name: "/",
      redirect: "/index"
    },
    {
      path: "/index",
      name: "index",
      component: index
    },
    {
      path: "/item",
      name: "item",
      component: item
    },
    {
      path: "/admin",
      name: "admin",
      component: admin
    },
    {
      path: "/edititem",
      name: "edititem",
      component: edititem
    }
  ]
});

export default router;
