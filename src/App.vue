<!-- This is App component -->
<template>
  <component :is="layout">
    <router-view :layout.sync="layout"></router-view>
  </component>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';
import router from './router/router';
import VueScoketConnect from './util/socket';

@Component({
  router
})
export default class App extends Vue {
  private layout: string = 'div';

  @Socket() // --> listens to the event by method name, e.g. `connect`
  connect() {
    console.log('connection established');
  }
}
</script>
<style lang='less' scoped>
#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50
}
</style>