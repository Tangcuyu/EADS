<!--  -->
<template>
  <div class="layout-grid-3cols">
    <div class="cols3_1">
      <component :is="childrenDefaultComponent"></component>
    </div>
    <div class="cols3_2">
      <component :is="childrenAComponent"></component>
    </div>
    <div  class="cols3_1">
      <component :is="childrenBComponent"></component>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class LayoutGrid3cols extends Vue {}
</script>
<style lang='less' scoped>
.layout-grid-3cols {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}
.cols3_1 {
  width: 1035px;
  height: 980px;
  margin-top: -60px;
}
.cols3_2 {
  width: 1770px;
  height: 980px;
}
</style>