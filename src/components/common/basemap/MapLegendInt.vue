<!--  -->
<template>
  <div class="legend_al_id">
    <div class="legendControl_topTitleBox" @click="closeLegendContainer"></div>
    <div class="legendControl_box">
      <div class="legendControl_content">
        <div
          code="item.layerId"
          :class="['ele_legend_class', {'lengend_sign_class':item.isShow}]"
          v-for="item of dataInt"
          :key="item.layerId"
          @click="clickTypeFn(item)"
        >
          <span class="img_class">
            <img :src="getImgUrl(item)" alt />
          </span>
          <span :title="item.name">{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
// import baseMapComponent from './gisMethodNew'

@Component
export default class MapLegendInt extends Vue {
  private dataInt = [
    {
      name: '烈度圈',
      png: 'earDis.png',
      pngBase64: '',
      clickPngBase64: '',
      isShow: false,
      layerId: 'earInfluenceDisLayer',
    },
    {
      name: '人口热力',
      png: 'populationDisLayer_img.png',
      pngBase64: '',
      clickPngBase64: '',
      isShow: false,
      layerId: 'populationDisLayer',
    }
  ]
  private getImgUrl(item: any) {
    let imgSrc: string = ''
    imgSrc = require('' + item.png)
    return imgSrc
  }

  // private clickTypeFn(data: any) {
  //   baseMapComponent.initPopulationHeatCmp()
  //   baseMapComponent.initIIcmp()
  //   if (data.isShow) {
  //     data.isShow = !data.isShow
  //     if (data.layerId === 'populationDisLayer') {
  //       baseMapComponent.clearAllPopulationHeat()
  //     } else if (data.layerId === 'earInfluenceDisLayer') {
  //       baseMapComponent.clearAllIICmp()
  //     }
  //   } else {
  //     data.isShow = !data.isShow
  //     if (data.layerId === 'populationDisLayer')  {
  //       baseMapComponent.drawPopulationHeat()
  //     } else if (data.layerId === 'earInfluenceDisLayer') {
  //       baseMapComponent.drawIICmp()
  //     }
  //   }
  // }

  private closeLegendContainer() {
    this.$emit('changeLegendFn')
  }
}

</script>
<style lang='less' scoped>
.legend_all_id {
  background: url(../../../assets/img/toolsMap/legendbg.png) no-repeat;
  background-size: 100% 100%;
  padding: 30px;
}
.legend_sign_class span {
  font-weight: 600;
  color: #fff;
}
.legendControl_content {
  display: inline-block;
  font-size: 18px;
}
</style>
