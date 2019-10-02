import LayerUtil from './layerUtil';
import jQuery from 'jquery';

export default {
  /**
   *
   * @param opts
   * @param opts.resultClickCallback
   * @param opts.clearRouteCallback
   */

  demoData: window.demo.EventData,
  optionsG: '',

  init(optionsG: any) {
    this.optionsG = optionsG;
  },

  initMap(callback: any, ctx: any) {},

  onMapReady() {
    console.log('mapready');
  },
  // 显示一下示例数据
  showDwon() {
    window.demo.eventObj.markpoints(this.demoData);
  },

  initMarkCmp() {
    window.demo.markOptions.map = window.map;
    window.demo.markObj.init(window.demo.markOptions);
  },
  unloadMark() {
    window.demo.markObj.unload();
  },

  loadMarkDemoData(item: any) {
    const data = [
      {
        id: item.eventId,
        title: item.title,
        type: item.type,
        // reportMan: '黄祖超',
        // reportTime: '2019-08-04 23:49:15',
        // updateDate: '2019-08-04 23:46:15',
        // sendDept: '00670100',
        // signMan: '朱自强',
        // sendDeptName: '地震台网中心',
        eventId: item.eventId,
        // contentid: 'a044d1aba4df4ae199dfa369ebd3c828',
        longitude: item.longitude,
        latitude: item.latitude,
        // province: '吉林省',
        // city: '长春市',
        // county: '九台区',
        address: item.address,
        description: item.description,
        magnitude: item.magnitude,
        range: item.range,
        starTime: item.starTime,
        // wordContent: null,
        typeCode: '1',
        bigtype: 'big1'
      }
    ];
    window.demo.markDemoData = data;
    window.demo.markObj.markpoints(data);
    const popupDisplay = false;
    window.demo.markObj.selectInfo(window.demo.markDemoData[0], popupDisplay);
  },
  showMarkDemoData() {
    const i = this.randomNum(1, window.demo.markDemoData.length);
    let popupDisplay = false;
    popupDisplay = true;
    window.demo.markObj.selectInfo(
      window.demo.markDemoData[i - 1],
      popupDisplay
    );
  },

  clearMarkAll() {
    window.demo.markObj.clearAll();
  },

  initEventCmp() {
    window.demo.eventRecieveComponentOptions.map = window.map;
    window.demo.eventObj.init(window.demo.eventRecieveComponentOptions);
  },
  unloadEvent() {
    window.demo.eventObj.unload();
  },

  loadEventDemoData(data: any) {
    window.demo.eventObj.markpoints(data);
  },
  showEventDemoData(data: any) {
    window.demo.eventObj.showpoint(data);
  },

  randomNum(lower: any, upper: any) {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  },

  clearEventAll() {
    window.demo.eventObj.clearAll();
  },
  validEvent() {
    if (window.demo.eventObj.enable === true) {
      window.$alert('可用', 'Event组件', {
        confirmButtonText: '确定',
        //                        callback:null
        callback: (action: any) => {
          window.$message({
            type: 'info',
            message: 'Event组件,可用'
          });
        }
      });
    } else {
      window.$alert('不可用', 'Event组件', {
        confirmButtonText: '确定',
        callback: (action: any) => {
          window.$message({
            type: 'info',
            message: 'Event组件,不可用，请初始化......'
          });
        }
      });
    }
  },

  initWarningTyphoonCmp() {
    window.demo.warningRecieveComponentOptions.map = window.map;
    window.demo.warningObj.init(window.demo.warningRecieveComponentOptions);
  },

  loadWarningTyphoonDemoData(data: any) {
    window.demo.warningObj.markpoints(data);
  },
  loadWarningRainStormDemoData() {
    window.demo.warningObj.markpoints(window.demo.rainstormWarning);
  },

  loadWarningHighTemperatureDemoData() {
    window.demo.warningObj.markpoints(window.demo.highTemperatureWarning);
  },
  loadWarningForestFireDemoData() {
    window.demo.warningObj.markpoints(window.demo.forestFireWarning);
  },
  clearWarningAll() {
    window.demo.warningObj.clearAll();
  },
  clickWarningOne(data: any) {
    window.demo.warningObj.clickPoint(data);
  },

  clickWarningRainStormOne() {
    const i = this.randomNum(1, window.demo.rainstormWarning.length);
    window.demo.warningObj.selectInfo(window.demo.rainstormWarning[i]);
  },

  // 资源
  initEmergencyResourcesCmp() {
    window.demo.emergencyResourcesComponentOptions.map = window.map;
    window.demo.erObj.init(window.demo.emergencyResourcesComponentOptions);
  },

  loadResourcesTeamCityDemoData() {
    window.demo.erObj.addCityCountOnMap(window.demo.rescueTeamCityData);
  },
  loadResourcesTeamProvinceDemoData() {
    window.demo.erObj.addProvinceCountOnMap(window.demo.rescueTeamProviceData);
  },
  loadResourcesTeamDemoData() {
    const codeKey = 'RescueTeam※03';
    const datas = window.demo.rescueTeamData;
    window.demo.erObj.addPointsOnMap(codeKey, datas);
  },

  showResourcesTeamDemoData() {
    const datas = window.demo.rescueTeamData;
    const i = this.randomNum(1, datas.length);
    const typeCode = 'RescueTeam※03';
    window.demo.erObj.selectInfo(datas[i - 1], typeCode);
  },
  clearResourcesTeam() {
    window.demo.erObj.clearAll();
  },

  loadResureExpertDemoData() {
    window.demo.erObj.clearAll();
    window.demo.erObj.addCityCountOnMap(window.demo.rescueTeamCityData);
    window.demo.erObj.addProvinceCountOnMap(window.demo.rescueTeamProviceData);
    const typeCode = 'Expert※01';
    const datas = window.demo.resureExpertData;
    window.demo.erObj.addPointsOnMap(typeCode, datas);
  },
  showResureExpert() {
    const datas = window.demo.resureExpertData;
    const i = this.randomNum(1, datas.length);
    const typeCode = 'Expert※01';
    window.demo.erObj.selectInfo(datas[i - 1], typeCode);
  },

  loadRescueShelterDemoData() {
    window.demo.erObj.clearAll();
    window.demo.erObj.addCityCountOnMap(window.demo.rescueTeamCityData);
    window.demo.erObj.addProvinceCountOnMap(window.demo.rescueTeamProviceData);
    const typeCode = 'Shelter※01';
    const datas = window.demo.rescueShelterData;
    window.demo.erObj.addPointsOnMap(typeCode, datas);
  },

  showRescueShelter() {
    const datas = window.demo.rescueShelterData;
    const i = this.randomNum(1, datas.length);
    const typeCode = 'Shelter※01';
    window.demo.erObj.selectInfo(datas[i - 1], typeCode);
  },
  loadRescueReposityDemoData() {
    window.demo.erObj.clearAll();
    window.demo.erObj.addCityCountOnMap(window.demo.rescueTeamCityData);
    window.demo.erObj.addProvinceCountOnMap(window.demo.rescueTeamProviceData);
    const typeCode = 'ANJIAN_REPERTORY※01';
    const datas = window.demo.rescueReposityData;
    window.demo.erObj.addPointsOnMap(typeCode, datas);
  },
  showRescueReposity() {
    const datas = window.demo.rescueReposityData;
    const i = this.randomNum(1, datas.length);
    const typeCode = 'ANJIAN_REPERTORY※01';
    window.demo.erObj.selectInfo(datas[i - 1], typeCode);
  },

  loadRescueWarBaseDemoData() {
    window.demo.erObj.clearAll();
    window.demo.erObj.addCityCountOnMap(window.demo.rescueTeamCityData);
    window.demo.erObj.addProvinceCountOnMap(window.demo.rescueTeamProviceData);
    const typeCode = 'JC_WARBASE※01';
    const datas = window.demo.rescueWarBaseData;
    window.demo.erObj.addPointsOnMap(typeCode, datas);
  },
  showRescueWarBase() {
    const datas = window.demo.rescueWarBaseData;
    const typeCode = 'JC_WARBASE※01';
    const i = this.randomNum(1, datas.length);
    window.demo.erObj.selectInfo(datas[i - 1], typeCode);
  },
  markInfo(typeCode: any) {
    const opt = {
      resourceKey: typeCode // 'Expert※01',
      // districtCode: '110000'
    };
    window.demo.erObj.markInfo(opt);
  },
  created() {},

  /**
   * 地图重置
   * -清除所有点位
   * -清除迁徙图
   * -清除弹窗
   * -清除规划路径
   * -清除中心定位图标
   * -清除波纹效果
   * -中心点经纬度归零
   */
  clearResult() {},

  /**
   * 创建图层--有则清空，无则创建
   * @param layerid
   * @returns {egis.ElementLayer}
   * @private
   */
  _createLayer(layerid: any) {
    let layer = LayerUtil.getLayerById(window.map, layerid);
    if (!layer) {
      layer = new egis.carto.ElementLayer({
        id: layerid,
        name: layerid,
        map: window.map
      });
      window.map.addLayer(layer);
      return layer;
    } else {
      layer.clear();
      return layer;
    }
  },

  /**
   * 清空所有地图图层
   * @private
   */
  _clearAllLayer() {
    for (const i of window.map.layers) {
      window.map.layers[i].clear();
    }
  }

  // mapclick4PickCoordinate(){},
};
