import Vue from "vue";
import Vuex from "vuex";
import App from "./App";
import router from "./router";
import ANT from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

Vue.use(Vuex);
Vue.use(ANT);
Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    token: ""
  },
  mutations: {
    upDateToken(state, token) {
      state.token = token;
    }
  }
});

new Vue({
  el: "#app",
  store,
  router,
  render: h => h(App)
});
