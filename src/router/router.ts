import Vue from 'vue';
import Router from 'vue-router';

import Home from '../views/earthquake/Home.vue';
import Earthquake from '@/views/earthquake/themePrimary/EQthemehome.vue';
import Flood from '@/views/flood/Flood.vue';
import Typhoon from '@/views/typhoon/Typhoon.vue';
// import GsAdmc from '../components/gisdemo/GsAdmc.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    // {
    //   path: '/gistest',
    //   name: 'GsAdmc',
    //   component: GsAdmc,
    // },
    {
      path: '/flood',
      name: 'flood',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/flood/Flood.vue'),
    },
    {
      path: '/typhoon',
      name: 'typhoon',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/typhoon/Typhoon.vue'),
    }
  ],
});
