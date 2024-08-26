import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Import the router
import "./style.css"; // Import Tailwind CSS

createApp(App)
  .use(router) // Use the router
  .mount("#app");
