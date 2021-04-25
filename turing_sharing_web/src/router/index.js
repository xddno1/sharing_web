import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
const index = () => import("@/components/myindex");
const item = () => import("@/components/myitem");
export default new Router({
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
    }
  ]
});
