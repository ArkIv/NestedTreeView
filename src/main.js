import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
//window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = App.constructor;
createApp(App)
  .use(store)
  .use(router)
  .mount("#app");
