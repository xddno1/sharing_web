import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import App from "./App";
import router from "./router";
import ANT from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

Vue.use(Vuex);
Vue.use(ANT);
Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    loginstate: {},
    maxpage: {}
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage
    })
  ],
  mutations: {
    upDateToken(state, data) {
      state.loginstate = data;
    }
  }
});
const myVue = new Vue({
  el: "#app",
  store,
  router,
  render: h => h(App)
});
