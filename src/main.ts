import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import _ from 'lodash';
import router from './router/router';
import store from './store/store';
import vueBus from 'vue-bus';
import VueSocketIOExt from 'vue-socket.io-extended';
import VueScoketConnect from './util/socket';

import '@/util/registVmixin';
import '@/util/registComponents';
import './assets/css/common.css';
import 'animate.css';
import './assets/css/gisPopupStyle.css';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(vueBus);
/* Use VueSocketIOExt: https://www.npmjs.com/package/vue-socket.io-extended */
Vue.use(VueSocketIOExt, VueScoketConnect, {store});

Vue.prototype._ = _;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
