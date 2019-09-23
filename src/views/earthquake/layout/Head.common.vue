<!--  -->
<template>
  <header>
    <!-- 头部动画 -->
    <div class="head-lineLeft animated slower infinite head-lineAnimate"></div>
    <div class="head-lineRight animated slower infinite head-lineAnimate"></div>
    <div class="head-lineCenter animated slower infinite flash delay-2s"></div>
    <div class="head-lineCenter-bottom animated slower infinite flash delay-2s"></div>
    <i class="spot spot1 animated spot slow infinite"></i>
    <i class="spot spot2 animated spot slower infinite delay-3s"></i>
    <i class="spot spot3 animated spot slow infinite delay-1s"></i>
    <i class="spot spot4 animated spot slower infinite delay-2s"></i>
    <!-- 事故信息 -->
    <div class="yj-eventInfo">
      <b class="eventinfobutton" @click="openFn"></b>
      <i></i>
      <response-suggest
        v-if="responseObj.state === 'suggest'"
        :responseObj="responseObj"
        style="display:inline-block;"
      ></response-suggest>
      <response-start
        v-if="responseObj.state === 'start'"
        :responseObj="responseObj"
        style="display:inline-block"
      ></response-start>
    </div>
    <!-- 事故时间 -->
    <div class="yj-headTime">
      <event-time v-if="date" :date="date"></event-time>
    </div>
    <!-- 事故天气 -->
    <div class="yj-headWeather">
      <weather-disaster-area></weather-disaster-area>
    </div>
  </header>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';

import EventTime from '@/components/feature/earthQuake/eventTime/EventTime.vue';
import { IResponse } from '../../../interface/response';
import ResponseSuggest from '@/components/feature/response/ResponseSuggest.vue';
import ResponseStart from '@/components/feature/response/ResponseStart.vue';
import WeatherDisasterArea from '@/components/feature/weatherDisasterArea/WeatherDisasterArea.vue';

@Component({
  components: {
    EventTime,
    ResponseStart,
    ResponseSuggest,
    WeatherDisasterArea
  }
})
export default class Head extends Vue {
  // TODO: 事发开始时间, 需要初始化为推送事件时候的时间
  private date: string | null = '2019-09-23 19:00:00';
  private responseObj: IResponse = {
    state: '',
    txtContent: '',
    aniTxt: '',
    childComponent: null
  };

  private clickResponseSuggest() {
    this.responseObj = {
      state: 'suggest',
      txtContent: '响应建议',
      aniTxt: '建议启动I级响应',
      childComponent: null
    };
  }

  private clickResponseStart() {
    this.responseObj = {
      state: 'start',
      txtContent: 'I级响应',
      aniTxt: 'I级响应',
      childComponent: {
        title: '启动I级响应',
        imgSrc: '',
        componentName: ''
      }
    };
  }

  /* 打开弹窗 */
  private openFn() {
    this.$emit('openFn');
  }
}
</script>


<style lang='less' scoped>
@baseimgUrl: '../../../assets/img/head';

.yj-home header {
  width: 100%;
  height: 140px;
  background: url('@{baseimgUrl}/logo.png') center top no-repeat;
  position: relative;
}
/* 头部----事故信息 */
.yj-eventInfo {
  width: 1026px;
  height: 66px;
  position: absolute;
  background: url('@{baseimgUrl}/navlefttopbg.png') center top no-repeat;
  top: 7px;
  left: 42px;
  z-index: 5;
}
/* 头部----事故时间 */
.yj-headTime {
  width: 543px;
  height: 98px;
  position: absolute;
  background: url('@{baseimgUrl}/head2bg.png') center top no-repeat;
  top: -10px;
  right: 555px;
}
.yj-headTime .timeBlock-p {
  height: 98px;
  line-height: 100px;
  width: 80%;
  margin-left: 17%;
  color: #ffffff;
  font-size: 24px;
}
.timeBlockNum .timestrNum {
  font-size: 24px;
}
.timeBlockNum i {
  padding: 0 5px;
  font-style: normal;
  color: #fff;
  font-size: 20px;
}
/* 头部----事故天气 */
.yj-headWeather {
  width: 552px;
  height: 112px;
  position: absolute;
  background: url('@{baseimgUrl}/head3bg.png') center top no-repeat;
  top: -10px;
  right: 10px;
}
/* 头部线条动画 */
@-webkit-keyframes head-lineAnimate {
  from {
    width: 0;
  }
  to {
    width: 690px;
  }
}
@keyframes head-lineAnimate {
  from {
    width: 0;
  }
  to {
    width: 690px;
  }
}
.head-lineLeft {
  width: 0px;
  height: 90px;
  background: url('@{baseimgUrl}/heada3.png') left top no-repeat;
  position: absolute;
  top: 0;
  left: 1005px;
  -webkit-animation-name: head-lineAnimate;
  animation-name: head-lineAnimate;
}
.head-lineRight {
  width: 0px;
  height: 90px;
  background: url('@{baseimgUrl}/heada2.png') right top no-repeat;
  position: absolute;
  top: 0;
  right: 1005px;
  -webkit-animation-name: head-lineAnimate;
  animation-name: head-lineAnimate;
}
.head-lineCenter {
  width: 718px;
  height: 89px;
  background: url('@{baseimgUrl}/heada1.png') left top no-repeat;
  position: absolute;
  top: 85px;
  left: 1559px;
}
.head-lineCenter-bottom {
  width: 718px;
  height: 89px;
  background: url('@{baseimgUrl}/heada1.png') left top no-repeat;
  position: absolute;
  top: 938px;
  left: 1559px;
  transform: rotate(180deg);
}
/* 头部光点动画 */
.spot {
  position: absolute;
  background: #1ad5fc;
  display: inline-block;
  width: 11px;
  height: 2px;
  box-shadow: 0 0 50px 10px #01fcf3;
  -webkit-animation-name: spot;
  animation-name: spot;
}
@-webkit-keyframes sopt {
  from {
    opacity: 0;
    -webkit-transform: scale3d(0.3, 0.3, 0.3);
    transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
    opacity: 1;
    -webkit-transform: scale3d(1.3, 1.3, 1.3);
    transform: scale3d(1.3, 1.3, 1.3);
  }
  to {
    opacity: 0;
    -webkit-transform: scale3d(0.3, 0.3, 0.3);
    transform: scale3d(0.3, 0.3, 0.3);
  }
}
@keyframes sopt {
  from {
    opacity: 0;
    -webkit-transform: scale3d(0.3, 0.3, 0.3);
    transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
    opacity: 1;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  to {
    opacity: 0;
    -webkit-transform: scale3d(0.3, 0.3, 0.3);
    transform: scale3d(0.3, 0.3, 0.3);
  }
}

.spot1 {
  top: 22px;
  left: 1310px;
}
.spot2 {
  top: 19px;
  left: 1430px;
}
.spot3 {
  top: 18px;
  left: 1426px;
}
.spot4 {
  top: 21px;
  left: 1307px;
}
.eventinfobutton {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0eaafa;
  position: absolute;
  left: 5%;
  top: 35%;
  cursor: pointer;
}
</style>