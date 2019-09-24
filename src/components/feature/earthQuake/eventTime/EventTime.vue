<!--  -->
<template>
  <p class="timeBlock-p">
    <span>事故已发生:</span>
    <span class="timeBlockNum">{{time}}</span>
  </p>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'EventTime'
})
export default class EventTime extends Vue {
  @Prop() private date!: string;
  /* 重置计时标志 */
  private resetEvent = '';
  private time = '';

  mounted() {
    const timeInt = setInterval(() => {
      if (this.resetEvent === 'stop') {
        clearInterval(timeInt);
      }
      this.init();
    }, 1000);
  }
  destroyed() {}

  // 计算事件发生时间到现在的天、小时、分钟、秒
  public countTime(eventTime: string) {
    let tteNumber =
      new Date().getTime() / 1000 - new Date(eventTime).getTime() / 1000;

    const d = parseInt((tteNumber / 60 / 60 / 24).toString(), 10);
    tteNumber = tteNumber - d * 60 * 60 * 24;
    const h = parseInt((tteNumber / 60 / 60).toString(), 10);
    tteNumber = tteNumber - h * 60 * 60;
    const m = parseInt((tteNumber / 60).toString(), 10);
    tteNumber = tteNumber - m * 60;
    const s = parseInt(tteNumber.toString(), 10);
    // console.log(`tteNumber:${new Date()}, d:${d}, h:${h}, m:${m}, s:${s}`);
    return {
      days: d,
      hours: h,
      minutes: m,
      seconds: s
    };
  }
  private startTime() {
    /* 当直接使用setInterval的时候，因为类型问题报错：setInterval - Type 'Timer' is not assignable to type 'number' */
    // this.setCounter = window.setInterval(this.init, 1000);
  }
  private init() {
    if (this.date) {
      const tte = this.countTime(this.date);
      if (tte.days > 0) {
        this.time = `${tte.days}天${tte.hours}小时${tte.minutes}分${tte.seconds}秒`;
      }
      if (tte.days <= 0 && tte.hours > 0) {
        this.time = `${tte.hours}小时${tte.minutes}分${tte.seconds}秒`;
      }
      if (tte.hours <= 0 && tte.minutes > 0) {
        this.time = `${tte.minutes}分${tte.seconds}秒`;
      }
      if (tte.minutes <= 0 && tte.seconds > 0) {
        this.time = `${tte.seconds}秒`;
      }
    }
  }
}
</script>
<style lang='less' scoped>
</style>