import Vue from "vue";
import App from "./App";
import router from "./router";
import ANT from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
Vue.use(ANT);
Vue.config.productionTip = false;
//注释
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
