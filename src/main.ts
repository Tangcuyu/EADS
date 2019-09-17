import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router/router';
import store from './store/store';
import _ from 'lodash';

import './assets/css/common.css';
import 'animate.css';
import './assets/css/gisPopupStyle.css';

Vue.config.productionTip = false;

Vue.use(ElementUI);

Vue.prototype._ = _;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
