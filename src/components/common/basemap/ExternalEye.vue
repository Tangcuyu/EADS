<!--  -->
<template>
  <div class="secondary-skySytem-new-shouye">
    <iframe :src="urlPath" frameborder="0" ref="iframeUrl"></iframe>
    <span class="close-secondary-skySystem">X</span>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
const externalEye = require('@/config/eysExternal');

@Component({})
export default class ExternalEye extends Vue {
  private urlPath = externalEye;
  private closeEyeExternal() {
    this.$emit('hideEyeExternal');
  }
}
</script>
<style lang='less' scoped>
.secondary-skySystem-new-shouye {
  widows: 100%;
  height: 100%;
  background: rgba(105, 92, 92, 0.8);
}
.secondary-skySystem-new-shouye iframe {
  width: 100%;
  height: 100%;
}
.close-secondary-skySytem {
  color: #fff;
  font-size: 26px;
  top: -40px;
  right: 0;
  position: absolute;
  cursor: pointer;
}
</style>