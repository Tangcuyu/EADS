<!--  -->
<template>
  <div class="yj-cont-center-map">
    <div class="baseMap-container" id="baseMap2D">
      <e-map
        :default-extent="defaultExtent"
        :full-extent="fullExtent"
        :base-layers="baseLayers"
        :show-mouse-positon="true"
        @initialized="onMapReady"
        :mousePositionOptions="mousePositionOptions"
        :switchMapOptions="switchMapOptions"
        :eagleEyeMapOptions="eagleEyeMapOptions"
      ></e-map>
      <gs-event-receive></gs-event-receive>
      <gs-warning-receive></gs-warning-receive>
      <gs-emergency-recources></gs-emergency-recources>
      <gs-mark></gs-mark>
      <gs-intensity-influence></gs-intensity-influence>
      <gs-population-heat></gs-population-heat>
      <gs-district-influence></gs-district-influence>
      <div class="map-gis-tools-container">
        <div class="dialong_Sharing_icon" @click="clearGisMap"></div>
        <div class="dialong_Sharing_btn" @click="showEyeExternal"></div>
        <map-tools
          ref="childData"
          @administrativeDivision="administrativeDivision"
          v-show="$store.state.gisMapInt.toolsInt === 'hide' ? false : true"
        ></map-tools>
      </div>
      {{$store.state.gisMapInt.mapLegendInt}}
      <div
        class="map-gis-legend-container"
        v-show="$store.state.gisMapInt.mapLegendInt === 'hide' ? false : true"
      >
        <map-legend-int v-show="!gisLegendFlag" @changeLegendFn="changeLegendFn"></map-legend-int>
        <div class="open_Legend1" v-show="gisLegendFlag" @click="changeLegendFn"></div>
      </div>
      <div class="map-gis-eye-container" v-show="showHideFlag">
        <external-eye @hideEyeExternal="hideEyeExternal"></external-eye>
      </div>
      <div class="screenLeft1" v-show="desDivsionFlage">
        <div class="dialong_list_02">
          <span
            class="map_list_ck"
            data-code="affectedTown"
            status="close"
            @click="affectedClick20Fn"
          >
            20KM的乡镇
            <b>4</b>个
          </span>
          <br />
          <span
            class="map_list_ck"
            data-code="affectedCountry"
            status="open"
            @click="affectedClick50Fn"
          >
            50KM的乡镇
            <b>3</b>个
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import baseMapComponent from './gisMethodNew';
import MapTools from '@/components/common/baseMap/MapTools.vue';
import MapLegendInt from '@/components/common/baseMap/MapLegendInt.vue';
import ExternalEye from '@/components/common/baseMap/ExternalEye.vue';
import {
  EMap,
  GsEventReceive,
  GsWarningReceive,
  GsEmergencyResources,
  GsMark,
  GsIntentsityInfluence,
  GsPopulationHeat,
  GsDistrictInfluence
} from '../../../../public/deps/static/deps/ts-emap/tsemap.vue';

Vue.use(EMap);
Vue.use(GsEventReceive);
Vue.use(GsWarningReceive);
Vue.use(GsEmergencyResources);

import '../../../../public/deps/static/deps/components/common/gisPagination/gisPagination';
import '../../../../public/deps/static/deps/components/common/simpleTable/simpletable';
import '../../../../public/deps/static/deps/components/common/CommonService';
import '../../../../public/deps/static/deps/components/common/EmerSourceService';

import '../../../../public/deps/static/deps/data/demoDataFzjc';
import '../../../../public/deps/static/deps/data/demoDataFzjcDemo';
import '../../../../public/deps/static/deps/data/demoFzjcOptions';

import '../../../../public/deps/static/deps/theme-chalk/less/emap/EMap.less';
import '../../../../public/deps/static/deps/theme-chalk/less/switchmap/SwitchMap.less';
import '../../../../public/deps/static/deps/theme-chalk/less/eagleeyemap/EagleEyeMap.less';

declare global {
  interface Window {
    G: any;
    demo: any;
    map: any;
    EAMP_MAPCONFIG: any;
  }
}

@Component({
  components: {
    EMap,
    GsEventReceive,
    GsWarningReceive,
    GsEmergencyResources,
    GsMark,
    GsIntentsityInfluence,
    GsPopulationHeat,
    GsDistrictInfluence,
    MapTools,
    MapLegendInt,
    ExternalEye
  }
})
export default class BaseMap extends Vue {
  private affectedCountySum = 0;
  private affectedTownSum = 0;
  private showHideFlag = false;
  private desDivsionFlag = false;
  private gisLegendFlag = false;
  private defaultExtent = {
    zoom: 4,
    maxZoom: 20,
    minZoom: 4,
    center: [116.390833, 39.904832],
    projection: 'EPSG:4326'
  };
  private fullExtent = {
    center: [116.390833, 39.904832],
    zoom: 5
  };

  private baseLayers = window.EAMP_MAPCONFIG.baseLayers;

  // 移动经纬度显示
  private mousePositionOptions = {
    formatType: '2', // 1显示E N， 2 显示 X Y
    formatTable: ['X', 'Y'],
    format: '{x} | {y}',
    precision: 6,
    lnglatFormat: 'DD' // DD显示经纬度 DMS显示度数
  };

  // 底图切换参数
  private switchMapOptions = {
    direction: 'down',
    modeData: window.EAMP_MAPCONFIG.baseLayers
  };

  private eagleEyeMapOptions = {
    listShow: false,
    zoomGap: 4,
    rectSymbol: {
      type: 'SimpleFillSymbol',
      options: {
        borderColor: {
          alpha: 153,
          r: 0,
          g: 0,
          b: 255
        },
        fillColor: {
          alpha: 79,
          r: 193,
          g: 72,
          b: 6
        },
        borderThickness: 1,
        opacity: 1
      }
    }
  };
  private clearGisMap() {
    baseMapComponent.clearWarningAll(); // 清楚预警信息
    baseMapComponent.clearEventAll(); // 清楚事件信息
    baseMapComponent.clearMarkAll();
    // 清楚应急物资
    baseMapComponent.clearResourcesTeam();
  }
  private changeLegendFn() {
    this.gisLegendFlag = !this.gisLegendFlag;
  }

  private showEyeExternal() {
    this.showHideFlag = true;
  }

  private hideEyeExternal() {
    this.showHideFlag = false;
  }

  private administrativeDivision(data: any) {
    this.desDivsionFlag = data.isMutex;
  }

  private affectedClick20Fn() {
    baseMapComponent.initDistrictInfluenceCmp();
    baseMapComponent.showDistrictInfluence('Town');
  }

  private affectedClick50Fn() {
    baseMapComponent.initDistrictInfluenceCmp();
    baseMapComponent.showDistrictInfluence('County');
  }

  // 定义接收行政区划地图组件的回调函数
  private getCountryInfluenceSum(ele: any) {
    this.affectedCountySum = ele.affectedCountySum;
  }

  private getTownInfluenceSum(ele: any) {
    this.affectedTownSum = ele.affectedTownSum;
  }

  private mounted() {
    // 获取ts-gis map对象
    window.map = (this.$children[0] as any).getMap();
    // 事件信息组件对象
    const eventObj = this.$children[1];
    window.demo.eventObj = eventObj;
    window.demo.eventRecieveComponentOptions.map = window.map;

    // 预警信息组件对象
    const warningObj = this.$children[2];
    window.demo.warningObj = warningObj;
    window.demo.warningRecieveComponentOptions.map = window.map;

    // 应急资源组件
    const erObj = this.$children[3];
    window.demo.erObj = erObj;
    window.demo.emergencyResourcesComponentOptions.map = window.map;

    // Mark组件
    const markObj = this.$children[4];
    window.demo.markObj = markObj;
    window.demo.markOptions.map = window.map;

    // 【地震】强度组件对象
    window.demo.iiobj = this.$children[5];

    // 人口热力图组件对象
    window.demo.populationHeatObj = this.$children[6];

    // 影响行政区划地图组件对象
    window.demo.districtInfluenceObj = this.$children[7];

    const msgTownSumName =
      window.demo.districtInfluenceOptions.interfaceMsg.townsum;
    this.$bus.on(msgTownSumName, this.getTownInfluenceSum);

    const msgCountrySumName =
      window.demo.districtInfluenceOptions.interfaceMsg.townsum;
    this.$bus.on(msgCountrySumName, this.getCountryInfluenceSum);

    window.demo.admcDemo = this;
  }
}
</script>
<style lang='less' scoped>
.baseMap-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.map-gis-tools-container {
  position: absolute;
  top: 26px;
  right: 100px;
  display: flex;
  align-items: center;
  width: 300px;
}
.dialong_Sharing_icon {
  width: 60px;
  height: 60px;
  background: url(../../../assets/img/qingping.png) no-repeat;
  background-size: 100% 100%;
  float: right;
  cursor: pointer;
}
.dialong_Sharing_icon:hover {
  background: url(../../../assets/img/qingpinghover.png) no-repeat;
}
.map-gis-legend-container {
  position: absolute;
  bottom: 5px;
  width: 212px;
  height: 157px;
  color: #000;
  right: 0;
  z-index: 10;
}
.dialong_Sharing_btn {
  width: 60px;
  height: 60px;
  background: url(../../../assets/img/toolsMap/ty.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.map-gis-eye-container {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 104;
  width: 1660px;
  height: 867px;
}
.screenLeft1 {
  color: white;
  top: 200px;
  right: 421px;
  font-size: 18px;
  position: absolute;
  z-index: 3;
  padding: 20px;
}
.dialong_list_02 {
  font-size: 24px;
}
.map_list_ck {
  cursor: pointer;
}
.open_Legend1 {
  width: 103px;
  height: 95px;
  background: url(../../../assets/img/toolsMap/legend.png) no-repeat;
  background-size: 100% 100%;
  margin-left: 30px;
  margin-top: 20px;
}
.open_Legend1:hover {
  cursor: pointer;
  background: url(../../../assets/img/toolsMap/legendhover.png) no-repeat 50%
    center !important;
  background-size: 100% 100%;
}
</style>