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

router.beforeEach((to, from, next) => {
  let vuexdata = localStorage.getItem("vuex");
  if (vuexdata) {
    vuexdata = JSON.parse(vuexdata);
  }
  if (to.path == "/admin" || to.path == "/edititem") {
    if (vuexdata.loginstate.admintoken) {
      next();
    } else {
      alert("非管理员不可访问");
    }
  } else {
    next();
  }
});

export default router;
