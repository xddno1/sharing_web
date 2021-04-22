import Vue from "vue";
import App from "./App";
import router from "./router";

Vue.config.productionTip = false;
//注释
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
