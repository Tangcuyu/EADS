<!-- This is App component -->
<template>
  <component :is="layout">
    <router-view :layout.sync="layout"></router-view>
  </component>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import baseMapComponent from './components/common/gisMethodNew';
import router from './router/router';
import socket from './util/socket';
import SocketLayout from './util/SocketLayout';

@Component({
  router
})
export default class App extends Vue {
  private socket: string = '';
  private layout: string = 'div';

  private created() {
    /* 切换专题布局 */
    // SocketLayout.earthquake(() => {
    //   router.push('/');
    // });
    // SocketLayout.typhoon(() => {
    //   router.push('/typhoon');
    // });
    // SocketLayout.flood(() => {
    //   router.push('/flood');
    // });
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