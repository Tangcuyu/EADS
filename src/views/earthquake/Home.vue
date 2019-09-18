<!--  -->
<template>
<div class="yj-home">
  <!-- 头 -->
  <Head></Head>
  <!-- 主体 -->
  <div class="yj-cont">
    <LayoutGrid3cols></LayoutGrid3cols>
  </div>
  <!-- 导航 -->
  <Nav v-show="$store.getters.navStatus === 'show'"></Nav>
  <!-- 地图装饰 -->
  <div class="yj-cont-mapbj"></div>
  <!-- 其他（弹窗） -->
  <event-list v-if="false"></event-list>
  <!-- 天气面板 -->
  <div class="weatherPanel" v-if="isShowWeather">
    <weather-disaster-area-panel></weather-disaster-area-panel>
  </div>
</div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import EventList from '@/components/feature/eventList/EventList.feature.vue';
import Head from '@/views/earthquake/layout/Head.common.vue';
import Nav from '@/views/earthquake/layout/Nav.common.vue';
import LayoutGrid3cols from '@/views/common/layout/LayoutGrid3cols.vue';
import WeatherDisasterAreaPanel from '@/views/common/weatherDisasterArea/WeatherDisasterAreaPanel.vue';

@Component({
  components: {
    EventList,
    Head,
    Nav,
    LayoutGrid3cols,
    WeatherDisasterAreaPanel,
  }
})
export default class Home extends Vue {
  private get isShowWeather() {
    return this.$store.getters.getShowWeatherPanel;
  }
};
</script>
<style lang='less' scoped>
  .yj-home {
    width: 3840px;
    height: 1080px;
    background: rgba(0, 0, 0, 0.5);
    overflow: hidden;
    background: url(../../assets/img/bg.png) no-repeat;
    position: relative;
  }
  .yj-cont-center-map {
    width: 1663px;
    height: 885px;
    margin-top: -25px;
    margin-left: 53px;
  }
  .yj-cont-mapbj {
    width: 1925px;
    height: 980px;
    background: url(../../assets/img/gisbg.png) no-repeat, url(../../assets/img/gisdemo.png) no-repeat center 63px;
    position: absolute;
    top: 45px;
    left: 954px;
    pointer-events: none;
    z-index: 2;
  }
  .yj-cont {
    width: 100%;
    height: calc(100% - 140px);
    color: #fff;
  }
  .weatherPanel {
    box-sizing: border-box;
    position: absolute;
    top: 100px;
    right: 20px;
    width: 980px;
    height: calc(100% - 130px);
  }
</style>