'use strict';
require.config({
    paths: {
    },
    shim: {
    }
});
define(["jquery",'ol'], function ($,ol) {
    var util = {};
    util.layerArr=[];
    /**
     * 初始化
     */
    util.initia=function(){
        var self = this;
        self.map = G.options.map;
    };
    /**
     * 加载省级统计数据
     * @method
     */
    util.addProvinceCountOnMap=function(dataArr){
        var self = this;
        G.options.commonGIS.clearHighlight();G.options.toolTipWare.clear();
        var layer = G.utils.LayerUtil.getLayerById(G.options.map, "provinceDistrictDataLayer");
        if (!layer) {
            layer = new g2.lys.ElementLayer({
                id: "provinceDistrictDataLayer",
                name: "provinceDistrictDataLayer",
                map: G.options.map
            });
            G.options.map.addLayer(layer);
        }
        var level = G.options.map.getZoomLevel();
        if(level==EMAP_CONFIG.clusterlevel||level>EMAP_CONFIG.clusterlevel){
            layer.setVisible(false);
        }else{
            layer.setVisible(true);
        }
        if(G.newModule.HotspotEarlyWarningInforModule)
        {
            G.newModule.HotspotEarlyWarningInforModule.onClose();
        }
        G.CloseTreeDetail();//关闭右侧树

        layer.clear();
        G.options.commonGIS._removeLayer('event1Layer');
        G.options.commonGIS._removeLayer('event2Layer');
        G.options.commonGIS._removeLayer('event3Layer');
        G.options.commonGIS._removeLayer('event4Layer');
        G.options.commonGIS._removeLayer('event5Layer');
        G.options.commonGIS._removeLayer('event6Layer');
        G.options.commonGIS._removeLayer('event7Layer');
        G.options.commonGIS._removeLayer('event8Layer');
        G.options.commonGIS._removeLayer('event9Layer');
        G.options.commonGIS._removeLayer('event10Layer');
        G.options.commonGIS._removeLayer('event11Layer');
        G.options.commonGIS._removeLayer('event12Layer');
        G.options.commonGIS._removeLayer('event13Layer');
        G.options.commonGIS.clearHighlight();

        for (var i in dataArr) {
            var point = new g2.geom.Point({
                x: parseFloat(dataArr[i].lng),
                y: parseFloat(dataArr[i].lat),
                spatialReference: g2.geom.SpatialReference.EPSG4326
            });
            var symbol=new g2.syms.SimpleMarkersymbol({
                offsetX:0,
                offsetY:0,
                fillColor:new g2.syms.Color({a:150,r:200,g:0,b:0}),
                borderColor:new g2.syms.Color({a:150,r:200,g:0,b:0}),
                borderThickness:4,
                size:16
            });
            var textSymbol = new g2.syms.TextSymbol({
                text: dataArr[i].count+"",
                borderColor: new g2.syms.Color({a: 255, r: 255, g: 255, b: 255}),
                borderThickness: 1,
                fontSize:16,
                fontWeight:"bold",
                fontFamilyName: "宋体",
                foreground: new g2.syms.Color({a: 255, r: 255, g: 255, b: 255}),
                offsetX: 0,
                offsetY: 0
            });
            //复合符号
            var currencySymbol = new g2.syms.CurrencySymbol({
                markerSymbol: symbol,
                textSymbol: textSymbol
            });
            var ele = new g2.ele.Element({geometry: point, symbol: currencySymbol});
            layer.add(ele);
        }
    };
    /**
     * 加载市级统计数据
     * @method
     */
    util.addCityCountOnMap=function(dataArr){
        var self = this;
        G.options.commonGIS.clearHighlight();G.options.toolTipWare.clear();
        var layer = G.utils.LayerUtil.getLayerById(G.options.map, "cityDistrictDataLayer");
        if (!layer) {
            layer = new g2.lys.ElementLayer({
                id: "cityDistrictDataLayer",
                name: "cityDistrictDataLayer",
                map: G.options.map
            });
            G.options.map.addLayer(layer);
        }
        var level = G.options.map.getZoomLevel();
        if(level>EMAP_CONFIG.clusterlevel&&level<EMAP_CONFIG.vilagelevel){
            layer.setVisible(true);
        }else{
            layer.setVisible(false);
        }
        layer.clear();
        for (var i in dataArr) {
            var point = new g2.geom.Point({
                x: parseFloat(dataArr[i].tag.LONGITUDE),
                y: parseFloat(dataArr[i].tag.LATITUDE),
                spatialReference: g2.geom.SpatialReference.EPSG4326
            });
            var symbol=new g2.syms.SimpleMarkersymbol({
                offsetX:0,
                offsetY:0,
                fillColor:new g2.syms.Color({a:150,r:200,g:0,b:0}),
                borderColor:new g2.syms.Color({a:150,r:200,g:0,b:0}),
                borderThickness:4,
                size:16
            });
            var textSymbol = new g2.syms.TextSymbol({
                text: dataArr[i].count+"",
                borderColor: new g2.syms.Color({a: 255, r: 255, g: 255, b: 255}),
                borderThickness: 1,
                fontSize:16,
                fontWeight:"bold",
                fontFamilyName: "宋体",
                foreground: new g2.syms.Color({a: 255, r: 255, g: 255, b: 255}),
                offsetX: 0,
                offsetY: 0
            });
            //复合符号
            var currencySymbol = new g2.syms.CurrencySymbol({
                markerSymbol: symbol,
                textSymbol: textSymbol
            });
            var ele = new g2.ele.Element({geometry: point, symbol: currencySymbol});
            layer.add(ele);
        }
    };
    /**
     * 加载地图点位-feature
     * @method
     */
    util.addPointsOnMap=function(typeCode, pointArr){
        var base64 = EMAP_CONFIGICON.modules.MenuModule[typeCode + '_img'];
        G.options.commonGIS.clearHighlight();G.options.toolTipWare.clear();
        var flag=false;
        var level = G.options.map.getZoomLevel();
        if(level==EMAP_CONFIG.vilagelevel||level>EMAP_CONFIG.vilagelevel){
            flag=true;
        }
        var paramObj={};
        paramObj.layerID=typeCode + 'Layer';
        paramObj.arrData=pointArr;
        paramObj.icon=base64;
        paramObj.width="34";
        paramObj.height="34";
        paramObj.offsetX="17";
        paramObj.offsetY="17";
        paramObj.isDetailMoreInf=true;//调用详情
        paramObj.visible=flag;
        G.options.commonGIS._createFeatureMarker(paramObj);
        util.layerArr.push(typeCode + 'Layer');
    };
    /**
     * 清除图层
     * @method
     */
    util.clearLayerinfo=function(){
        var layerArr=G.options.featureLayers;
        if(layerArr.length>0){
            for(var i in layerArr){
                G.options.map.removeLayer(layerArr[i]);
            }
             // G.options.featureLayers=[];
        }
        G.options.commonGIS.clearHighlight();
        if (G.options.map.getLayerById("provinceDistrictDataLayer")) {
            G.options.commonGIS._removeLayer("provinceDistrictDataLayer");
        }
        if (G.options.map.getLayerById("cityDistrictDataLayer")) {
            G.options.commonGIS._removeLayer("cityDistrictDataLayer");
        }

    };
    /**
     * 清除指定类型的图层
     * @method
     */
    util.clearCodeLayerinfo=function(typeCode){
        G.options.commonGIS._removeLayer(typeCode + 'Layer');
        G.options.commonGIS.clearHighlight();
        G.options.toolTipWare.clear();
        if(G.options.featureLayers.length>0){
            for(var i in G.options.featureLayers){
                if(G.options.featureLayers[i].id==typeCode + 'Layer')
                {
                    G.options.map.removeLayer(G.options.featureLayers[i]);
                    G.options.featureLayers.splice(i,1);
                }
            }
        }
        if (G.options.map.getLayerById("provinceDistrictDataLayer")) {
            G.options.commonGIS._removeLayer("provinceDistrictDataLayer");
        }
        if (G.options.map.getLayerById("cityDistrictDataLayer")) {
            G.options.commonGIS._removeLayer("cityDistrictDataLayer");
        }
    };
    return util
});