import Vue from 'vue'
import App from './App.vue'

//BOOTSTRAP
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);

// Import FontAwesome
import "vue-awesome/icons";
import Icon from "vue-awesome/components/Icon";
Vue.component("icon", Icon);

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
