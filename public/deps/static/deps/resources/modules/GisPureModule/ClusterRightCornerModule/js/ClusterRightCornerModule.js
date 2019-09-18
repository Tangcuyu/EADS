/**
 * @title:图层聚合右上角显示数字
 * @time:2019/5/22
 */
'use strict';
require.config({
    paths: {
        "togetherPoint": webApp + 'src/modules/GisPureModule/ClusterRightCornerModule/js/togetherPoint'
    }

});
define(['vue', 'ELEMENT', "jquery", "togetherPoint"], function (Vue, ELEMENT, $, togetherPoint) {
    ELEMENT.install(Vue);
    var module = G.base.ModuleBase;

    var ClusterRightCornerModule = module.extend({
        options: {
            /**
             * 控件名称，必须与类名一致
             */
            name: 'ClusterRightCornerModule',
            /**
             * 默认配置文件名
             */
            config: false,
            queryParame: {}
        },
        includes: G.base.ContainerManager.prototype,
        /***
         * @constructor
         * @param options
         */
        initialize: function (options) {
            var self = this;
            //基类初始化
            self.map = options.map;
            var toolTipWare = new g2.ext.TooltipWare({
                map: self.map
            });
            this.toolTipWare = toolTipWare;
            module.prototype.initialize.call(self, options);
        },
        /**
         * 打开
         * @method
         * */
        onOpen: function () {
            var self = this;
            module.prototype.onOpen.call(this);
            window.gisDataYc={};
        },
        _createView: function () {
        },

        /**
         * 站点标绘数据查询
         * @param idQuery:站点的类型（0:排口,1:污水处理厂,2:泵站,3:监测断面,4:雨污混接点,5:工业企业,6.随手拍,7.治理工程）
         * 例如idQuery = "0,1,2,3,4,5,6,7"
         * @private
         */
        _stationData: function (idQuery,res) {
            var self = this;
            // $.ajax({
            //     type: 'post',
            //     url: EMAP_CONFIG.common.service + 'subject/monitorsubject/getStationGisData.mvc',//查询站点的接口
            //     xhrFields: {withCredentials: true},
            //     data: {
            //         "stationtype": idQuery,
            //         "systemcode": localStorage.systemcode//王建沟的系统，一般情况下不需要
            //     },
            //     dataType: 'json',
            //     context: this
            // }).then(function (res) {
            //     if(res.code=="success"){
                    self._addClusterMethod(res, idQuery);
            //     }
            // })
        },
        /**
         * 站点标绘数据初步处理、重要
         * @param res：查询到的每类数据
         * @private
         */
        _addClusterMethod: function (res, idQuery) {
            var self = this;
            var da = res;
            if (da) {
                if (idQuery != "0,1,2,3,4,5,6,7") {
                    if (window.gisDataYc[idQuery]) {//存gis数据每类的数据
                        window.gisDataYc[idQuery].isDis = true;
                        window.gisDataYc[idQuery].data = da;
                    } else {
                        window.gisDataYc[idQuery] = {isDis: true, data: da};
                    }
                }
                if ( idQuery != "") {
                    togetherPoint.jointData(da, idQuery, G.options.map);//数据拼接
                }
            }

        },
        /**
         * 地图视野移动触发
         * @private
         */
        _extentChangeView: function () {
            var self = this;
            var extentChangeFunction = function (e) {
                var data = window.gisDataYc;
                G.zoomLevel = G.options.map.getZoomLevel();
                // console.log(G.zoomLevel);
                // self.bigIconLayer.clear();//清除大图标
                // self.clearPop();
                // self.map.getLayerById("pointSplashesLayer").clear();/清除大图标图层
                if (data) {
                    for (var key in data) {
                        if (key != "" && window.gisDataYc[key].isDis != false) {
                            if (data[key].isDis) {
                                if (data[key].data && data[key].data.length > 0) {
                                    togetherPoint.jointData(data[key].data, key, G.options.map);
                                }
                            }
                        }
                    }
                }
            };
            G.options.map.off('extentchanged',extentChangeFunction);
            G.options.map.on('extentchanged', extentChangeFunction);
        },
        /**
         * 关闭弹出框和大图标和尾标
         */
        // clearPop: function () {
        //     var self=this;
        //     //清除弹出框
        //     if (self.map.getLayerById("linepop") != null) {
        //         self.map.getLayerById("linepop").clear();
        //         $('.emap-linePopup-container').remove();
        //     }
        // }
        // ,
        /**
         * 清除图层
         * @param idQuery=图层id
         */
        // clearLayer:function(idQuery){
        //     var self=this;
        //     for (var i in self.map.layers ){
        //         var id=self.map.layers[i].id;
        //         var LayerId="stationlayer"+idQuery;
        //         if(LayerId==id){
        //             self.map.layers[i].clear();
        //         }
        //     }
        //     //大图标删除
        //     self.map.getLayerById("bigIconLayer").clear();
        //     //清除弹出框
        //     if (self.map.getLayerById("linepop")!= null){
        //         self.map.getLayerById("linepop").clear();
        //         $('.emap-linePopup-container').remove();
        //     }
        //     window.gisDataYc[idQuery].isDis=false;
        //     $("#listpop").remove();
        // },

        /**
         * 关闭
         * @method
         *
         * */
        onClose: function () {
            module.prototype.onClose.call(this);
        },
        /**
         * 销毁i
         * @method
         *
         * */
        destroy: function () {
            //
            this.layer = null;
            module.prototype.destroy.call(this);
        }

    });

    /**
     * 对外接口
     */
    ClusterRightCornerModule.include({});
    return ClusterRightCornerModule;
});