/**
 * Created by my on 2018/5/3.
 * GIS地图相关操作
 */
require.config({
    paths: {
        "DetailInfoServices": webApp + 'src/modules/GisPureModule/js/DetailInfoServices',
        "RiskSourceService": webApp + 'src/modules/RiskAndResourceModule/service/RiskSourceService',
        "IndustryEnterpriseDetail": webApp + 'src/modules/GisPureModule/js/IndustryEnterpriseDetail',
        "CoalEnterpriseDetail": webApp + 'src/modules/GisPureModule/js/CoalEnterpriseDetail',
        "TailingPondDetail": webApp + 'src/modules/GisPureModule/js/TailingPondDetail',
        "FireworkEnterpriseDetail": webApp + 'src/modules/GisPureModule/js/FireworkEnterpriseDetail',
        "GeologDisaterDetail": webApp + 'src/modules/GisPureModule/js/GeologDisaterDetail',
        "FireTeamDetail": webApp + 'src/modules/GisPureModule/js/FireTeamDetail',
        "RepersityDetail": webApp + 'src/modules/GisPureModule/js/RepersityDetail',
        "ExpertInfoDetail": webApp + 'src/modules/GisPureModule/js/ExpertInfoDetail',
        "ShelterInfoDetail": webApp + 'src/modules/GisPureModule/js/ShelterInfoDetail',
        "RescueTeamDetail": webApp + 'src/modules/GisPureModule/js/RescueTeamDetail',
        "WarbaseDetail": webApp + 'src/modules/GisPureModule/js/WarbaseDetail',
        "ResourceEquipDetails": webApp + 'src/modules/GisPureModule/js/ResourceEquipDetails',
        "enterpriseCrisis": webApp + 'src/modules/GisPureModule/popdialog/js/enterpriseCrisis',//工矿企业的危化品

        "coalenterprise": webApp + 'src/modules/GisPureModule/popdialog/js/coalenterprise',//煤炭企业的危化品
        "fireworksCompany": webApp + 'src/modules/GisPureModule/popdialog/js/fireworksCompany',//工矿企业的烟花爆竹
        "noncoalminEnterprise": webApp + 'src/modules/GisPureModule/popdialog/js/noncoalminEnterprise',//工矿企业的非煤矿山
        "industrialEnterpriseView": webApp + 'src/modules/GisPureModule/popdialog/js/industrialEnterpriseView',//工矿企业的工贸企业
        "DetailsInformation": webApp + 'src/modules/GisMapModule/DisasterCensusModule/js/DetailsInformation',
        "mapToolTipAsDialog": webApp + 'src/modules/GisPureModule/js/mapToolTipAsDialog',
        "WeatherDetail": webApp + 'src/modules/GisPureModule/js/WeatherDetail',
        'DRM_queryservice': webApp + 'src/modules/GisMapModule/DisasterResearchModule/service/queryservice',
        'HazardDetail': webApp + 'src/modules/GisMapModule/HazardDistModule/js/HazardDetail'
    },
    shim: {
        ResourceEquipDetails: {
            deps: [
                'css!' + webApp + 'src/modules/GisPureModule/css/detail.css'
            ]
        },
        enterpriseCrisis: {
            deps: [
                'css!' + webApp + 'src/modules/GisPureModule/popdialog/css/enterpriseCrisis.css',
                'css!' + webApp + 'src/modules/GisPureModule/popdialog/css/coalenterprise.css',
            ]
        },
        fireworksCompany: {
            deps: [
                'css!' + webApp + 'src/modules/GisPureModule/popdialog/css/fireworksCompany.css'
            ]
        },
        noncoalminEnterprise: {
            deps: [
                'css!' + webApp + 'src/modules/GisPureModule/popdialog/css/noncoalminEnterprise.css'
            ]
        },
        industrialEnterpriseView: {
            deps: [
                'css!' + webApp + 'src/modules/GisPureModule/popdialog/css/industrialEnterprise.css'
            ]
        },
        WeatherDetail: {
            deps: [
                'css!' + webApp + 'src/modules/ContentModule/ModulePanel/SceneModule/css/Scene.css',
                'css!' + webApp + 'src/modules/ContentModule/ModulePanel/SceneModule/css/SecondaryScene.css'
            ]
        }
    }
});
define([
        "queryData",
        "ResourceEquipDetails",
        'gisPagination',
        'json!src/modules/GisPureModule/config/PopupDetailConfig.json',
        'enterpriseCrisis',
        'coalenterprise',
        'DetailInfoServices',
        'IndustryEnterpriseDetail',
        'CoalEnterpriseDetail',
        'TailingPondDetail',
        'FireworkEnterpriseDetail',
        'GeologDisaterDetail',
        'fireworksCompany',
        'noncoalminEnterprise',
        'industrialEnterpriseView',
        'DetailsInformation',
        'mapToolTipAsDialog',
        'WeatherDetail',
        'DRM_queryservice',
        'ol', 'd3',
        'HazardDetail'
    ],
    function (queryData, ResourceEquipDetails, gisPagination,
              PopupDetailConfig, enterpriseCrisis, coalenterprise, DetailInfoServices, IndustryEnterpriseDetail, CoalEnterpriseDetail, TailingPondDetail,
              FireworkEnterpriseDetail, GeologDisaterDetail, fireworksCompany, noncoalminEnterprise, industrialEnterpriseView, DetailsInformation, mapToolTipAsDialog,
              WeatherDetail, DRM_queryservice, ol, d3, HazardDetail) {

        var PureComponent = G.base.PureComponent;
        var component = PureComponent.extend({
            includes: G.misc.AppEvent.prototype,
            initialize: function (options) {
                PureComponent.prototype.initialize.call(this, options);
                G.options.toolTipWare = this.options.toolTipWare = new g2.ext.TooltipWare({map: G.options.map});
                this.options.toolTopEvent = new g2.ext.TooltipWare({map: G.options.map});
                //保存闪烁过的点信息
                G.options.BlinkPoints = [];

                this.oldExtent = null;//保存之前正确的范围
                this.options.objEvent = {};
                //绑定地图加载配置文件
                this._bindMapEvent();
                var opts = {map: G.options.map};
                // G.options.drawBuffer = new drawBuffer(opts);
                //记录标注图层
                G.options.markerLayers = this.options.markerLayers = [];
                G.options.PolygonLayers = this.options.PolygonLayers = [];
                G.options.featureLayers = this.options.featureLayers = [];
                // var tips = webApp + 'app/modules/ResourceManage/config/toolTip.json';
                // this.options.tipUrl = G.utils.CommonUtil.getConfig({url: tips});
                //高亮图层
                this.highlightLayer = new g2.lys.ElementLayer({
                    id: 'emer-highlight-layer',
                    name: '',
                });
                G.options.map.addLayer(this.highlightLayer);

                this.highlightLayer.setZIndex(100);

                this.DetailInfoServices = new DetailInfoServices({
                    serverUrl: EMAP_CONFIG.common.mongoService
                });
                this.analoGetMoreInf = ResourceEquipDetails.analoGetMoreInf;
                //闪烁定时器
                this.highlightTimer = null;
            },
            destroy: function () {
                this._removeListeners();
                //类注销
                PureComponent.prototype.destroy.call(this);
            }
        });
        /**
         * 对外接口
         */
        component.include({
            /**
             * 控制地图视野
             * @private
             */
            _ControlZoom: function (data) {
                var coordinates = [];
                if (data[0] && data[0].geom) {
                    //点串
                    if (data[0].geom.type == "Point") {
                        for (var i in data) {
                            var eleCoordinates = [data[i].geom.coordinates[0], data[i].geom.coordinates[1]];
                            coordinates.push(eleCoordinates);
                        }
                    } else {//线串
                        for (var i in data) {
                            for (var j in data[i].geom.coordinates[0]) {
                                coordinates.push(data[i].geom.coordinates[0][j]);
                            }
                        }
                    }
                } else if (data[0] && data[0].longitude && data[0].latitude) {
                    for (var i in data) {
                        var eleCoordinates = [data[i].longitude, data[i].latitude];
                        coordinates.push(eleCoordinates);
                    }
                } else if (data[0] && data[0].x && data[0].y) {
                    for (var i in data) {
                        var eleCoordinates = [data[i].x, data[i].y];
                        coordinates.push(eleCoordinates);
                    }
                } else {
                    return;
                }
                if (G.centerPoint) {
                    var eleCoordinates = [G.centerPoint.x, G.centerPoint.y];
                    coordinates.push(eleCoordinates);
                }
                var lineStringGeoJson = {type: "LineString", coordinates: coordinates};
                var polyline = g2.geom.GeometryFactory.createGeometryFromGeoJson(lineStringGeoJson, G.options.map.spatialReference);
                //定位到缓冲区
                var view = G.options.map.map.getView();
                var size = G.options.map.map.getSize();
                var envelope = polyline.envelope();
                view.fit([envelope.minx, envelope.miny, envelope.maxx, envelope.maxy], {
                    size: size,
                    padding: [30, 30, 30, 30],
                    duration: 800
                })
               /* var level = G.options.map.getZoomLevel();
                if (level > 12) {
                    G.options.map.zoomTo(12);
                }*/
                if(coordinates.length==2)
                {
                    var startX = coordinates[0][0];
                    var startY = coordinates[0][1];
                    if((startX==116.3549&&startY==39.936)||(startX==113.333573&&startY==23.094974)) {
                        G.options.map.zoomTo(5);
                    }
                    else {
                        G.options.map.zoomTo(10);
                    }
                }
            },
            /**
             * 创建点图标
             * @param param需要传递的参数
             * @param.layerID（必填）图层ID
             * @param.width （选填）图标的宽度
             * @param.height （选填）图标的高度
             * @param.offsetX （选填）X轴方向的偏移(像素)
             * @param.offsetY （选填）Y轴方向的偏移(像素)
             * @param.opacity  （选填）图标的透明度
             * @param.scale  （选填）图标的显示比例
             * @param.pointX  （必填）图标的经度坐标（经纬度）
             * @param.pointY  （必填）图标的纬度坐标（经纬度）
             * @Param.attr （选填）图标上想要挂接的属性{object}
             * @Param.theme 显示tooltip时对应的提示信息配置文件themeconfig.json中的对应名称.如果不需要tooltip该选项可以
             * 不提供，如果需要显示tooltip该选项必填,默认值为图层的ID名称，如果根据ID找不到对应项，则不显示tooltip。
             * @Param.toolTipTem 显示tooltip的样式模板，如果此项为空提供默认模板
             * @Param.iconName iconbase64.json 文件中配置的图标名称,如果为空使用默认图标
             */
            _createMarker: function (param) {
                var layer = this._createLayer(param.layerID);
                layer.setVisible(true);
                if (param.isNotPic) {
                    return layer;
                }
                var pictureSymbol = new g2.syms.Picturemarkersymbol({
                    source: param.icon || this.options.iconConfig[param.layerID],
                    width: param.width || 64,
                    height: param.height || 70,
                    offsetX: param.offsetX || 32,
                    offsetY: param.offsetY || 20,
                    opacity: param.opacity || 1,
                    rotation:param.rotation||"0",
                    size: param.scale || 2
                });
                var pointX, pointY;
                if (param.geom) {
                    if (param.geom.type == "Point") {
                        pointX = param.geom.coordinates[0];
                        pointY = param.geom.coordinates[1];
                    } else if (param.geom.type.indexOf("LineString") != -1) {
                        var arrCoord = param.geom.coordinates;
                        var road = new g2.geom.Polyline({spatialReference: G.options.map.spatialReference});

                        for (var i = 0; i < arrCoord.length; i++) {
                            var path = new g2.geom.Path({spatialReference: G.options.map.spatialReference});
                            for (var k = 0; k < arrCoord[i].length; k++) {
                                var tempPoint = this._createPoint(arrCoord[i][k][0], arrCoord[i][k][1])
                                path.addPoint(tempPoint);
                            }
                            road.addGeometry(path);
                        }
                        var ploylineSymbol = new g2.syms.SimpleLinesymbol({
                            color: new g2.syms.Color({a: 153, r: 0, g: 0, b: 255}),
                            width: 7
                        });
                        var ele = new g2.ele.Element({geometry: road, symbol: ploylineSymbol});
                        ele.tag = param.tag;
                        ele.geom = param.geom;
                        ele.roadnames = param.tag.name != "" ? param.tag.name : "无名道路";
                        layer.add(ele);
                        return ele;
                    }
                } else {
                    pointX = param.pointX;
                    pointY = param.pointY;
                }

                var point = this._createPoint(parseFloat(pointX), parseFloat(pointY));
                var pointEle = new g2.ele.Element({geometry: point, symbol: pictureSymbol});
                pointEle.attr = param.attr || "";
                pointEle.tag = param.tag || "";
                pointEle.geom = param.geom || "";
                pointEle.imgsLength = param.imgsLength || "";
                pointEle.pointX = param.pointX || "";
                pointEle.pointY = param.pointY || "";
                pointEle.center = param.center || false;
                pointEle._distance = param._distance || "";
                pointEle.id = param.id || "";
                pointEle.videoId = param.Id || "";
                pointEle.layer = param.layerID || "";
                pointEle.theme = param.theme || param.layerID;
                pointEle.isZdfx = param.isZdfx || false;
                pointEle.toolTipTem = param.toolTipTem || "defaultTemp";
                pointEle.title = param.title || "详情查看";
                pointEle.offset = param.offset || false;
                pointEle.view = param.view || false;//移动地图视野
                pointEle.htmlSelf = param.htmlSelf || false;
                pointEle.isSelfMoreInf = param.isSelfMoreInf || false;
                pointEle.isDetailMoreInf = param.isDetailMoreInf || false;
                pointEle.isWarmInfo = param.isWarmInfo || false;
                layer.add(pointEle);
                return pointEle;
            },
            /**
             * 清空标绘图层
             * id  图层ID
             */
            _clearMarkerLayer: function () {
                var arrLayers = this.options.markerLayers;
                var _layersIdArr = G._layersIdArr || [];
                for (var i = 0; i < arrLayers.length; i++) {
                    var layer = G.utils.LayerUtil.getLayerById(G.options.map, arrLayers[i]);
                    if (layer) {
                        layer.clear();
                    }
                }
                for (var i = 0; i < _layersIdArr.length; i++) {
                    var layer = G.utils.LayerUtil.getLayerById(G.options.map, _layersIdArr[i]);
                    if (layer) {
                        layer.clear();
                    }
                }
                this.options.toolTipWare.clear();
            },
            /**
             * 清空标绘图层
             * id  图层ID
             */
            _clearMarkerLayer2: function (id) {
                var arrLayers = this.options.markerLayers;
                for (var i = 0; i < arrLayers.length; i++) {
                    var layer = G.utils.LayerUtil.getLayerById(G.options.map, arrLayers[i]);
                    if (layer && layer.id != id) {
                        layer.clear();
                    }
                }
                this.options.toolTipWare.clear();
            },
            /**
             * 设置图层可见性
             * @param id 图层id
             * @param bVisible 是否可见（true or false）
             * @private
             */
            _setMarkerLayerVisible: function (id, bVisible) {
                var layer = G.utils.LayerUtil.getLayerById(G.options.map, id);
                if (layer) {
                    layer.setVisible(bVisible || false);
                } else {
                    GS.$Message.info("图层不存在");
                }
            },
            /**
             * 根据x,y坐标创建点元素
             * @param x
             * @param y
             * @returns {*}
             * @public
             */
            _createPoint: function (x, y) {
                var point = new g2.geom.Point({
                    x: parseFloat(x),
                    y: parseFloat(y),
                    spatialReference: G.options.map.spatialReference
                });
                return point;
            },
            /**
             * 判断图层是否存在
             * @param id
             * @private
             */
            _hasLayer: function (id) {
                var layer = G.utils.LayerUtil.getLayerById(G.options.map, id);
                if (layer) {
                    return true;
                } else {
                    return false;
                }
            },
            /**
             * 设置图层可见性
             * @param id 图层id
             * @param bVisible 图层是否可见
             * @private
             */
            _setLayerVisible: function (id, bVisible) {
                var layer = G.utils.LayerUtil.getLayerById(G.options.map, id);
                if (layer) {
                    layer.setVisible(bVisible);
                    G.options.toolTipWare.clear();
                }
            },
            /**
             * 根据图层ID清空图层元素
             * @param id 图层ID
             * @public
             */
            _clearLayerById: function (id) {
                var layer = G.utils.LayerUtil.getLayerById(G.options.map, id);
                if (layer) {
                    layer.clear();
                }
                this.options.toolTipWare.clear();
            },
            /**
             * 根据ID关键字清空相关图层
             * @param id
             * @private
             */
            _clearLayerByIdFuzzy: function (id) {
                var layers = G.options.map.layers;
                for (var i = layers.length - 1; i >= 0; i--) {
                    if (layers[i].id && layers[i].id.indexOf(id) != -1) {
                        layers[i].clear();
                    }
                }
            },
            /**
             * 根据ID关键字设置图层可见性
             * @param id
             * @private
             */
            _setLayerVisibleFuzzy: function (id, bVisible) {
                var layers = G.options.map.layers;
                for (var i = layers.length - 1; i >= 0; i--) {
                    if (layers[i].id && layers[i].id.indexOf(id) != -1) {
                        layers[i].setVisible(bVisible);
                    }
                }
            },
            /**
             * 移动地图
             */
            changeMapExtent: function (arrXY, level) {
                var map = G.options.map;
                if (arrXY) {
                    var centerPoint = new g2.geom.Point({
                        x: arrXY[0],
                        y: arrXY[1],
                        spatialReference: map.spatialReference
                    })
                    if (!window.nozoom)
                        map.setCenter(centerPoint);
                }
                if (level) {
                    map.zoomTo(parseInt(level));
                }
            },
            /**
             * 点闪烁功能
             * @param param
             * @private
             */
            _openPopUpHitLightShow: function (layerid, pointX, pointY) {
                var self = this;
                /*var layer = G.utils.LayerUtil.getLayerById(G.options.map, param.layerID);
                 if (layer) {
                 layer.clear();
                 }*/
                var opt = {
                    layerID: "splash_videoInfo",
                    theme: "splash_videoInfo",
                    icon: EMAP_CONFIGICON.modules.MenuModule[layerid.replace('Layer', '') + '_img' + '_hover'],
                    pointX: pointX,
                    pointY: pointY,
                    width: 40,
                    height: 47,
                    offsetX: 20,
                    offsetY: 47
                }
                this._createMarker(opt);
                self.layerSpalsh = G.utils.LayerUtil.getLayerById(G.options.map, "splash_videoInfo");
                for (var jj = 0; jj < 10; jj++) {
                    setTimeout(function () {
                        if (self.layerSpalsh) {
                            self.layerSpalsh.setVisible(false);
                        }
                    }.bind(this), jj * 400);
                    setTimeout(function () {
                        if (self.layerSpalsh) {
                            self.layerSpalsh.setVisible(true);
                        }
                    }.bind(this), jj * 400 + 200);
                }
                self.layerSpalsh.setZIndex(15);
                setTimeout(function () {
                    if (self.layerSpalsh) {
                        self.layerSpalsh.clear();
                        self.layerSpalsh = null;
                    }
                }, 4000);
            },
            /**
             * 清除点闪烁功能
             * @param param
             * @private
             */
            _clearPopUpHitLightShow: function () {
                this.options.toolTipWare.clear();
                if (this.layerSpalsh) {
                    this.layerSpalsh.clear();
                    this.layerSpalsh = null;
                }
            },

            /**
             * 创建featureLayer图层，适用于元素个数大于5000个
             * @param param
             * @private
             */
            _createFeatureMarker: function (param) {
                var featureSet = new g2.fea.FeatureSet();
                var featureLayer = this._createFeatureLayer(param.layerID, param.visible);
                this.options.markerLayers.push(param.layerID);
                for (var i = 0; i < param.arrData.length; i++) {
                    if (param.arrData[i].geom) {
                        var pointX = param.arrData[i].geom.coordinates[0];
                        var pointY = param.arrData[i].geom.coordinates[1];
                        var tempPoint = this._createPoint(pointX, pointY);
                        var featurePoint = new g2.fea.Feature({geometry: tempPoint});
                        featurePoint.id = param.arrData[i]._id;
                        featurePoint.code = param.arrData[i].RESCUECODE || "";
                        featureSet.add(featurePoint);
                    }
                }
                featureLayer.addFeatures(featureSet);
                var pictureSymbol = new g2.syms.Picturemarkersymbol({
                    source: param.icon || this.options.iconConfig[param.layerID],
                    width: param.width || 34,
                    height: param.height || 46,
                    offsetX: param.offsetX || 17,
                    offsetY: param.offsetY || 45,
                    opacity: param.opacity || 1,
                    size: param.scale || 2
                });
                var sim = new g2.carto.SimpleRenderer({symbol: pictureSymbol});
                featureLayer.render(sim);
            },
            /**
             * 创建元素图层
             * @param id
             * @param map
             * @private
             */
            _createFeatureLayer: function (id, flag) {
                var featureLayer = G.utils.LayerUtil.getLayerById(G.options.map, id);
                if (!featureLayer) {
                    featureLayer = new g2.lys.FeatureLayer({id: id, map: G.options.map});
                    G.options.map.addLayer(featureLayer);
                    featureLayer.setVisible(flag);
                    this.options.featureLayers.push(featureLayer);
                }
                return featureLayer;
            }
        });
        /**
         * 内部调用
         */
        component.include({
            /**
             * 创建缓冲区图层
             * @private
             */
            _createLayer: function (id) {
                var layer = G.utils.LayerUtil.getLayerById(G.options.map, id);
                if (!layer) {
                    layer = new g2.lys.ElementLayer({
                        id: id,
                        name: id,
                        map: G.options.map
                    });
                    G.options.map.addLayer(layer);
                    this.options.markerLayers.push(id);
                }
                layer.setZIndex(5);
                this.options.currentLayer = layer;
                return layer;
            },
            /**
             * 创建图层备用
             * @param id
             * @returns {*}
             * @private
             */
            _createLayer2: function (id) {
                var layer = G.utils.LayerUtil.getLayerById(G.options.map, id);
                if (!layer) {
                    layer = new g2.lys.ElementLayer({
                        id: id,
                        name: id,
                        map: G.options.map
                    });
                    G.options.map.addLayer(layer);
                    this.options.PolygonLayers.push(id);
                }
                layer.setZIndex(5);
                this.options.currentLayer = layer;
                return layer;
            },

            /**
             * 创建聚类图层
             * 要聚合的数据
             * @param arrData
             *
             * 聚合等级
             *默认值： 8
             * @param clusterLevel
             *
             *离散点
             * @param picOption
             * @param picOption.source
             * @param picOption.width
             * @param picOption.height
             * @param picOption.offsetX
             * @param picOption.offsetY
             *
             *文字换号设置
             * @param  textSymbolOption
             * @param  textSymbolOption.foreground
             * @param  textSymbolOption.borderColor
             * @param  textSymbolOption.size
             *
             * 聚合符号样式
             * @param  clusterOption
             * @param  clusterOption.fillColor
             * @param  clusterOption.borderColor
             * @param  clusterOption.size
             * @public
             */
            _createClusterLayer: function (param) {
                var defclusterOption = {
                    borderColor: {a: 153, r: 19, g: 181, b: 177},
                    fillColor: {a: 153, r: 19, g: 181, b: 177},
                    borderThickness: 10,
                    size: 25
                }
                if (param.clusterOption) {
                    $.extend(defclusterOption, param.clusterOption)
                }
                defclusterOption.fillColor = new g2.syms.Color(defclusterOption.fillColor);
                defclusterOption.borderColor = new g2.syms.Color(defclusterOption.borderColor);

                var defpicOption = {
                    //图片Base64编码
                    source: EMAP_CONFIGICON.modules.MenuModule.vedioInfo,
                    //图片宽度
                    width: "32",
                    //图片高度
                    height: "32",
                    //图片旋转角度
                    rotation: "0",
                    //图片透明度
                    opacity: "1",
                    //图片X偏移量
                    offsetX: "16",
                    //图片Y偏移量
                    offsetY: "16"
                }
                if (param.picOption) {
                    $.extend(defpicOption, param.picOption)
                }
                var deftextSymbol = {
                    fontSize: 16,
                    fontFamilyName: "宋体",
                    foreground: {a: 255, r: 255, g: 255, b: 255},// new g2.syms.Color({a: 255, r: 255, g: 255, b: 255}),
                    borderColor: {a: 255, r: 255, g: 255, b: 255},// new g2.syms.Color({a: 255, r: 255, g: 255, b: 255}),
                    // fontWeight:"bold",
                    borderThickness: 1

                }
                if (param.textSymbolOption) {
                    $.extend(deftextSymbol, param.textSymbolOption)
                }
                deftextSymbol.foreground = new g2.syms.Color(deftextSymbol.foreground)
                deftextSymbol.borderColor = new g2.syms.Color(deftextSymbol.borderColor)


                //创建聚类图层
                var clusterLayer = new g2.lys.ClusterLayer({
                    map: G.options.map, clusterLevel: param.clusterLevel || 8, id: "videoInfo_district"
                });
                //聚类图层添加到地图上
                G.options.map.addLayer(clusterLayer);
                //创建图片符号
                var picSymbol = new g2.syms.Picturemarkersymbol(defpicOption);
                //创建elements对象
                var elements = [];
                for (var i = 0; i < param.arrData.length; i++) {
                    var element = new g2.ele.Element({
                        geometry: new g2.geom.Point({
                                x: parseFloat(param.arrData[i].x),
                                y: parseFloat(param.arrData[i].y),
                                spatialReference: G.options.map.spatialReference
                            }
                        ),
                        symbol: picSymbol
                    });
                    elements.push(element);
                    element.attr = param.arrData[i]
                }
                //添加elements对象
                clusterLayer.addElements(elements);
                //自定义聚类图层渲染
                clusterLayer.setStyleFunc(function (radius, size, maxFeatureCount) {
                    //创建markSymbol符号
                    var markerSymbol = new g2.syms.SimpleMarkersymbol(defclusterOption);
                    //创建文本符号
                    deftextSymbol.text = size.toString();
                    var textSymbol = new g2.syms.TextSymbol(deftextSymbol);
                    //创建通用符号
                    var currencySymbol = new g2.syms.CurrencySymbol({
                        markerSymbol: markerSymbol,
                        textSymbol: textSymbol
                    });
                    //返回通用符号
                    return currencySymbol;
                })

            },
            /**
             * @param opts.type :G.plot.TYPES.Polygon
             * @public
             */
            _createPlotComponent: function (opts) {
                var self = this;
                this._clearLayerById("plot-layer");
                this._clearLayerById("spatial_videoInfo");
                if (!opts) {
                    var opts = {};
                    opts.type = G.plot.TYPES.Polygon;
                }
                if (!this.plotComponent) {
                    // this. plotComponent
                    this.plotComponent = new G.plot.PlotComponent({
                        map: G.options.map,
                        layerId: 'plot-layer'
                    });
                    this.plotComponent.enableEdit(true);
                    this.commandManager = new g2.cmd.CommandManager();
                    this.plotComponent.on(G.misc.AppEvents.PLOT_CREATED, function (event, b, c) {
                        var plotElement = event.element;
                        if (plotElement) {
                            self.fire("drawPolygon", plotElement);
                        }
                    });
                    this.plotComponent.on(G.misc.AppEvents.PLOT_UPDATED, function (event, b, c) {
                        var plotElement = event.element;
                        if (plotElement) {
                            self._clearLayerById("spatial_videoInfo");
                            self.fire("drawPolygon", plotElement);
                        }
                    });
                }
                this.plotComponent.plot(opts);
            },
            /**
             * 设置图层高度索引
             * @param id
             * @param index
             */
            setLayerIndex: function (id, index) {
                var layer = G.utils.LayerUtil.getLayerById(G.options.map, id);
                if (layer) {
                    layer.setZIndex(index);
                }
            },
            /**
             * 删除图层
             * @param id
             * @private
             */
            _removeLayer: function (id) {
                var layer = G.utils.LayerUtil.getLayerById(G.options.map, id);
                if (layer) {
                    G.options.map.removeLayer(layer);
                }
            },
            /**
             * 根据图层包含关键字删除图层
             * @private
             */
            _removeLayerFuzzy: function (id) {
                var layers = G.options.map.layers;
                for (var i = layers.length - 1; i >= 0; i--) {
                    if (layers[i].id && layers[i].id.indexOf(id) != -1) {
                        G.options.map.removeLayer(layers[i]);
                    }
                }
            }
        });
        /**
         *地图相关事件
         */
        component.include({
            _mapClick: function (event) {
                var self = this;
                G.options.mapEvent = {"event": "click", "data": event};
                G.options.commonGIS.clearHighlight();
                if (G.options.map.getLayerById("mapToolTipTriangleLayer") && G.options.map.getLayerById("mapToolTipTriangleLayer").elements.length > 0) {
                    G.options.map.getLayerById("mapToolTipTriangleLayer").clear()
                    G.options.toolTipWare.clear()
                }
                /*点*/
                for (var key in this.options.markerLayers) {
                    var layer = G.utils.LayerUtil.getLayerById(G.options.map, this.options.markerLayers[key]);
                    if (layer && layer.id.indexOf("Layer") != -1) {
                        var ele = layer.hitTest(event.screenX, event.screenY);
                        if (ele && ele.element.attr) {
                            debugger;
                            this._openPopupBlinck(layer.id, ele.element.attr, ele.element);
                        } else if (ele && ele.element.tag) {
                            var data = {};
                            var eleInf = {}
                            data.id = ele.element.id || "";
                            data.tag = ele.element.tag || "";
                            data.geom = ele.element.geom || "";
                            data.pointX = ele.element.pointX || ele.element.geometry.x || "";
                            data.pointY = ele.element.pointY || ele.element.geometry.y || "";
                            data._distance = ele.element._distance || "";
                            data.center = ele.element.center || false;
                            data.offset = ele.element.offset || false;
                            data.view = ele.element.view || false;
                            eleInf.htmlSelf = ele.element.htmlSelf;
                            eleInf.isSelfMoreInf = ele.element.isSelfMoreInf;
                            eleInf.isDetailMoreInf = ele.element.isDetailMoreInf;
                            eleInf.isWarmInfo = ele.element.isWarmInfo;
                            if (data.tag.isFindMoreInf) {
                                ResourceEquipDetails.getMoreInf(data, layer.id, eleInf);
                                //此中断为了防止触发多次详情框 WYC 20190411
                                break
                            } else {
                                //todo 特殊处理人员伤亡、房屋损毁、失联区域、电力损毁的点图层
                                if (layer.id == "government1Layer" || layer.id == "government2Layer" || layer.id == "_casualtiesLayer" || layer.id == "_lostareaLayer" || layer.id == "_housedamageLayer"
                                    || layer.id == "_electricdamageLayer" || layer.id == "casualtiesLayer" || layer.id == "electricdamageLayer") {
                                    if (ele) {
                                        var p1 = new g2.geom.Point({
                                            x: data.pointX * 1,
                                            y: data.pointY * 1,
                                            spatialReference: G.options.map.spatialReference
                                        });
                                        var data = ele.element.tag;
                                        var title = ele.element.tag.type;
                                        DetailsInformation.onClose();
                                        DetailsInformation.addDetailsPanle(data, title);//带线的详情框
                                    }
                                }
                                else if (layer.id == "WeatherLayer")//如果是气象图标
                                {
                                    var p1 = new g2.geom.Point({
                                        x: data.pointX * 1,
                                        y: data.pointY * 1,
                                        spatialReference: G.options.map.spatialReference
                                    });
                                    G.options.map.setCenter(p1);
                                    WeatherDetail.showDetailPanel(data);
                                }
                                else {
                                    debugger;
                                    this._openPopupBlinck(layer.id, data, eleInf);
                                }
                                return;
                            }
                        } else if (ele && ele.element._data)//带聚合的数据
                        {
                            if (ele.element._data.isMore) {
                                ele.element._data = ele.element._data.dataEle[0];
                                // G.options.map.zoomIn();
                                // return
                            }
                            var data = {};
                            var eleInf = {}
                            data.id = ele.element._data._id || "";
                            data.tag = ele.element._data.tag || "";
                            data.geom = ele.element._data.geom || "";
                            data.pointX = ele.element._data.pointX || ele.element._data.geom.coordinates[0] || "";
                            data.pointY = ele.element._data.pointY || ele.element._data.geom.coordinates[1] || "";
                            data._distance = ele.element._data._distance || "";
                            data.center = ele.element._data.center || false;
                            data.offset = ele.element._data.offset || false;
                            data.view = ele.element._data.view || false;
                            eleInf.htmlSelf = ele.element._data.htmlSelf;
                            eleInf.isSelfMoreInf = ele.element._data.isSelfMoreInf;
                            eleInf.isDetailMoreInf = ele.element._data.isDetailMoreInf;
                            eleInf.isWarmInfo = ele.element._data.isWarmInfo;
                            if (data.tag.isFindMoreInf) {
                                ResourceEquipDetails.getMoreInf(data, layer.id, eleInf);
                                //此中断为了防止触发多次详情框 WYC 20190411
                                break
                            } else {
                                this._openPopupBlinck(layer.id, data, eleInf);
                                return;
                            }
                        }
                    }
                }
                ;

                if (G.options.map.getLayerById("newDisLayer")) {
                    var ele = G.options.map.getLayerById("newDisLayer").hitTest(event.screenX, event.screenY);
                    if (ele) {
                        var p1 = new g2.geom.Point({
                            x: event.mapX * 1,
                            y: event.mapY * 1,

                            spatialReference: G.options.map.spatialReference
                        });
                        G.newModule.DisasterCensusModule.clickEvent(ele.element.id, ele.element.geometry)
                        // this._openPopUpMouseMove(p1, ele.element,"newDisLayer",false);
                    }

                }
                if (G.options.map.getLayerById("districtLabelLayer")) {
                    var ele = G.options.map.getLayerById("districtLabelLayer").hitTest(event.screenX, event.screenY);
                    var elePolygon = G.options.map.getLayerById("intensityDistrictLayer").hitTest(event.screenX, event.screenY);
                    if (ele) {
                        var p1 = new g2.geom.Point({
                            x: event.mapX * 1,
                            y: event.mapY * 1,

                            spatialReference: G.options.map.spatialReference
                        });
                        if (elePolygon) {
                            //查询人口和乡镇个数
                            var diss = Number(ele.element.tag.distance) / 1000;
                            G.countyInfo = {'distance': diss.toFixed(2), 'area': ele.element.tag.area};
                            var polygonGeoJson = G.utils.GeometryUtil.getGeoJSONWriter().write(G.utils.GeometryUtil.getWktReader().read(elePolygon.element.geometry.asWkt()))
                            DRM_queryservice.getpeopleInforData([ele.element.geometry.x, ele.element.geometry.y], polygonGeoJson, function (data) {
                                var townNum = 0;
                                var countyPopNum = 0;
                                for (var key in data) {
                                    var dataArr = data[key];
                                    for (var townN = 0; townN < dataArr.length; townN++) {
                                        if (dataArr[townN].tag.distcode.length == 9) {
                                            townNum++;
                                        } else {
                                            countyPopNum = dataArr[townN].tag.poptotal;
                                        }
                                    }
                                }
                                G.countyInfo['townNum'] = townNum;
                                G.countyInfo['countyPopNum'] = countyPopNum;
                                var tag = G.countyInfo;
                                tag.offset = [100, -5];
                                self._openPopUpMouseMove(p1, tag, "districtLabelLayer");
                            });
                        }
                        return;
                    }
                }
                //todo 特殊处理烈度
                if (G.options.map.getLayerById("earInfluenceDisLayer")) {
                    var ele = G.options.map.getLayerById("earInfluenceDisLayer").hitTest(event.screenX, event.screenY);
                    if (ele) {

                        var p1 = new g2.geom.Point({
                            x: event.mapX * 1,
                            y: event.mapY * 1,

                            spatialReference: G.options.map.spatialReference
                        });
                        var tag = ele.element.tag;
                        tag.offset = [100, -5];
                        var isChangeByLiShl = true;
                        this._openPopUpMouseMove(p1, tag, "earInfluenceDisLayer", isChangeByLiShl);
                        return;
                    } else {
                        $(".earInfluence_class").remove();
                    }
                }
                //todo 特殊处理人员伤亡、房屋损毁、失联区域、电力损毁的面图层
                /*  if (G.options.map.getLayerById("DisasternewDisLayer")) {
                 var ele = G.options.map.getLayerById("DisasternewDisLayer").hitTest(event.screenX, event.screenY);
                 if (ele) {
                 var p1 = new g2.geom.Point({
                 x: event.mapX * 1,
                 y: event.mapY * 1,

                 spatialReference: G.options.map.spatialReference
                 });
                 if(ele.element.tag.data){
                 var data = ele.element.tag.data;
                 var title = ele.element.tag.data.type;
                 DetailsInformation.onClose();
                 if (title == "_lostarea" || title == "_electricdamage") {
                 G.newModule.DisasterCensusModule.clickEvent(ele.element.id, ele.element.geometry);//先放大行政区划在添加带线的详情框
                 } else {

                 DetailsInformation.addDetailsPanle(data, title);//带线的详情框
                 }
                 }
                 // G.newModule.DisasterCensusModule.clickEvent(ele.element.id, ele.element.geometry)
                 // this._openPopUpMouseMove(p1, ele.element,"newDisLayer",false);
                 }
                 }*/
            },
            _resetExtent:function (event) {
                var self = this;
                var left = event.left;
                var top = event.top;
                var right = event.right;
                var bottom = event.bottom;
                var size = G.options.map.map.getSize();
                var view = G.options.map.map.getView();
                var extent = view.calculateExtent(size);
                if (left >= -180 && bottom >= -85 && right <= 180 && top <= 85) {
                    self.oldExtent = extent;
                }
                if (left < -180) {
                    G.options.map.map.getView().fit(self.oldExtent);
                }
                if (bottom < -85) {
                    G.options.map.map.getView().fit(self.oldExtent);
                }
                if (right > 180) {
                    G.options.map.map.getView().fit(self.oldExtent);
                }
                if (top > 85) {
                    G.options.map.map.getView().fit(self.oldExtent);
                }
            },
            _mapExtendChanged: function (event) {
                // this._resetExtent(event);//范围改变重置范围
                //特殊处理区县和乡镇人口数据随着分辨率更改
                if ($('.disasterSituation-icon-influenceArea').hasClass('act')) {
                    var level = G.options.map.getZoomLevel();
                    switch (level) {
                        case EMAP_CONFIG.vilagelevel + 2: // Null
                            G.options.map.getLayerById("villages5Layer").setVisible(true);
                            G.options.map.getLayerById("villages10Layer").setVisible(false);
                            G.options.map.getLayerById("townsLayer").setVisible(false);
                            G.options.map.getLayerById("coutyLayer").setVisible(false);
                            break;
                        case EMAP_CONFIG.vilagelevel + 1: // Null
                            G.options.map.getLayerById("villages5Layer").setVisible(false);
                            G.options.map.getLayerById("villages10Layer").setVisible(true);
                            G.options.map.getLayerById("townsLayer").setVisible(false);
                            G.options.map.getLayerById("coutyLayer").setVisible(false);
                            break;
                        case EMAP_CONFIG.vilagelevel: // Null
                            G.options.map.getLayerById("townsLayer").setVisible(true);
                            G.options.map.getLayerById("villages10Layer").setVisible(false);
                            G.options.map.getLayerById("villages5Layer").setVisible(false);
                            G.options.map.getLayerById("coutyLayer").setVisible(false);
                            break;
                        case EMAP_CONFIG.vilagelevel - 1: // Null
                            G.options.map.getLayerById("coutyLayer").setVisible(true);
                            G.options.map.getLayerById("townsLayer").setVisible(false);
                            G.options.map.getLayerById("villages10Layer").setVisible(false);
                            G.options.map.getLayerById("villages5Layer").setVisible(false);
                            break;
                        case EMAP_CONFIG.vilagelevel - 3: // Null
                            G.options.map.getLayerById("coutyLayer").setVisible(false);
                            G.options.map.getLayerById("townsLayer").setVisible(false);
                            G.options.map.getLayerById("villages10Layer").setVisible(false);
                            G.options.map.getLayerById("villages5Layer").setVisible(false);
                            break;

                    }
                }
            },
            _mapResolutionchanged: function (event) {
                //特殊处理 按省市聚合缩放的处理
                var level = G.options.map.getZoomLevel();
                if (G.options.map.getLayerById('provinceDistrictDataLayer')) {

                    if (level == EMAP_CONFIG.clusterlevel || level > EMAP_CONFIG.clusterlevel) {
                        G.options.map.getLayerById('provinceDistrictDataLayer').setVisible(false);
                        if(level<EMAP_CONFIG.vilagelevel){
                            G.options.map.getLayerById('cityDistrictDataLayer').setVisible(true);
                            var layerArr = G.options.featureLayers;
                            if (layerArr.length > 0) {
                                for (var i in layerArr) {
                                    layerArr[i].setVisible(false);
                                }
                            }
                        }
                        else
                        {
                            G.options.map.getLayerById('cityDistrictDataLayer').setVisible(false);
                            var layerArr = G.options.featureLayers;
                            if (layerArr.length > 0) {
                                for (var i in layerArr) {
                                    layerArr[i].setVisible(true);
                                }
                            }
                        }
                    } else {
                        G.options.map.getLayerById('cityDistrictDataLayer').setVisible(false);
                        G.options.map.getLayerById('provinceDistrictDataLayer').setVisible(true);
                        var layerArr = G.options.featureLayers;
                        if (layerArr.length > 0) {
                            for (var i in layerArr) {
                                layerArr[i].setVisible(false);
                            }
                        }
                    }
                }

                var datacolor = ["orange","red","yellow","blue","gray"]
                if (G.options.map.getLayerById('yujingDistrictDataLayer')) {
                    if (level == EMAP_CONFIG.clusterlevel || level < EMAP_CONFIG.clusterlevel) {
                        for(var i in datacolor){
                            if (G.options.map.getLayerById( datacolor[i] + "Layer")) {
                                G.options.map.getLayerById(datacolor[i] + "Layer").setVisible(
                                    false
                                );
                            }
                        }
                        if(G.options.map.getLayerById('yujingDistrictDataLayer')){
                            G.options.map.getLayerById('yujingDistrictDataLayer').setVisible(true);
                        }
                    }else {
                        for(var i in datacolor){
                            if (G.options.map.getLayerById( datacolor[i] + "Layer")) {
                                G.options.map.getLayerById(datacolor[i] + "Layer").setVisible(true);
                            }
                        }
                        if(G.options.map.getLayerById('yujingDistrictDataLayer')){
                            G.options.map.getLayerById('yujingDistrictDataLayer').setVisible(false);
                        }
                        // var layerArr = G.options.featureLayers;
                        // if (layerArr.length > 0) {
                        //     for (var i in layerArr) {
                        //         layerArr[i].setVisible(false);
                        //     }
                        // }
                    }
                }


                var level = G.options.map.getZoomLevel();
                if (level == EMAP_CONFIG.clusterlevel || level > EMAP_CONFIG.clusterlevel) {
                    if (G.options.map.getLayerById("districtLabelLayer")) G.options.map.getLayerById("districtLabelLayer").setVisible(true);
                }
                else {
                    if (G.options.map.getLayerById("districtLabelLayer")) G.options.map.getLayerById("districtLabelLayer").setVisible(false);
                }
            },
            _mapMouseMove: function (e) {
                var self = this;
                G.options.mapEvent = {"event": "mouseMove", "data": event};

                var layers = [].concat(this.options.markerLayers)
                    .concat(this.options.PolygonLayers)
                    .concat(this.options.featureLayers);
                for (var i = 0; i < layers.length; i++) {
                    var layer = G.utils.LayerUtil.getLayerById(G.options.map, layers[i]);
                    if (!layer) {
                        continue;
                    }
                    var ele = layer.hitTest(e.screenX, e.screenY);
                    if (ele === G.options.map.oldElement) return;
                    if (ele) {
                        G.options.map.oldElement = ele;
                        G.options.map.setCursor('pointer');
                        if (layer.id == "townsLayer" || layer.id == "coutyLayer" || layer.id == "citysLayer" ||
                            layer.id == "villages5Layer" || layer.id == "villages10Layer") {
                            var ele = G.options.map.getLayerById(layer.id).hitTest(e.screenX, e.screenY);
                            if (ele && ele.element.geometry.getGeometryType() === g2.geom.GeometryType.Point) {
                                this._openPopUpMouseMove(ele.element.geometry, ele.element, "villageLayer");
                            }
                        } else if (layer.id == "villageLayer") {
                            var ele = G.options.map.getLayerById(layer.id).hitTest(e.screenX, e.screenY);
                            if (ele && ele.element.geometry.getGeometryType() === g2.geom.GeometryType.Point) {
                                this._openPopUpMouseMove(ele.element.geometry, ele.element, layer.id);

                            }
                        } else if (layer.id == "preparedvillageLayer" || layer.id == "unpreparedvillageLayer") {
                            var ele = G.options.map.getLayerById(layer.id).hitTest(e.screenX, e.screenY);
                            if (ele && ele.element.geometry.getGeometryType() === g2.geom.GeometryType.Point) {
                                this._openPopUpMouseMove(ele.element.geometry, ele.element, layer.id);

                            }
                        }
                        return;
                    } else {
                        G.options.map.setCursor('default')
                    }
                }
                //todo 特殊处理烈度圈
                // if (G.options.map.getLayerById("earInfluenceDisLayer")) {
                //     var ele = G.options.map.getLayerById("earInfluenceDisLayer").hitTest(e.screenX, e.screenY);
                //     if (ele) {
                //
                //         var p1 = new g2.geom.Point({
                //             x: e.mapX * 1,
                //             y: e.mapY * 1,
                //
                //             spatialReference: G.options.map.spatialReference
                //         });
                //         var tag = ele.element.tag;
                //         tag.offset = [100, -5];
                //         var isChangeByLiShl = true;
                //         this._openPopUpMouseMove(p1, tag, "earInfluenceDisLayer", isChangeByLiShl);
                //         return;
                //     } else {
                //         $(".earInfluence_class").remove();
                //     }
                // }
                //todo 特殊处理影响圈
                if (G.options.map.getLayerById("earDisLayer")) {
                    var ele = G.options.map.getLayerById("earDisLayer").hitTest(e.screenX, e.screenY);
                    if (ele) {
                        $(".peopletext").hide();
                        $("#buffertext" + ele.element.id.replace("buffer-element-id", "")).show();
                    } else {
                        $(".peopletext").hide();
                    }
                }
                // if(G.options.map.getLayerById("LifrLineLayer")||G.options.map.getLayerById("LifrLinewater")||G.options.map.getLayerById("LifrLinegas")||G.options.map.getLayerById("LifrLinehot")) {

                //todo 特殊处理区县和乡镇
                if (G.options.map.getLayerById("townsDisLayer")) {
                    var ele = G.options.map.getLayerById("townsDisLayer").hitTest(e.screenX, e.screenY);
                    if (ele && ele.element.geometry.getGeometryType() === g2.geom.GeometryType.Point) {
                        this._openPopUpMouseMove(ele.element.geometry, ele.element.tag, "");
                    }
                }
                if (G.options.map.getLayerById("vilageDisLayer")) {
                    var ele = G.options.map.getLayerById("vilageDisLayer").hitTest(e.screenX, e.screenY);
                    if (ele && ele.element.geometry.getGeometryType() === g2.geom.GeometryType.Point) {
                        this._openPopUpMouseMove(ele.element.geometry, ele.element.tag, "");
                    }
                }
                if (G.options.map.getLayerById("LifrLineLayer")) {
                    var ele = G.options.map.getLayerById("LifrLineLayer").hitTest(e.screenX, e.screenY);
                    if (ele && ele.element.geometry.getGeometryType() === g2.geom.GeometryType.MultiPolygon) {
                        var p1 = new g2.geom.Point({
                            x: e.mapX * 1,
                            y: e.mapY * 1,

                            spatialReference: G.options.map.spatialReference
                        });
                        this._openPopUpMouseMove(p1, ele.element.tag, "LifrLineLayer");
                    }
                }

                //todo 特殊处理人员伤亡、房屋损毁、失联区域、电力损毁的面图层
                if (G.options.map.getLayerById("DisasternewDisLayer")&&G.options.map.getLayerById("DisasternewDisLayer").getCount()>0) {
                    var layer = G.options.map.getLayerById("DisasternewDisLayer");
                    var ele = G.options.map.getLayerById("DisasternewDisLayer").hitTest(e.screenX, e.screenY);
                    if (ele) {
                        var p1 = new g2.geom.Point({
                            x: e.mapX * 1,
                            y: e.mapY * 1,
                            spatialReference: G.options.map.spatialReference
                        });
                        var elements = layer.elements;
                        for (var i = 0; i < elements.length; i++) {
                            var disasterElement = elements[i];
                            if (disasterElement !== ele.element) {
                                try {
                                    disasterElement.symbol.fillColor.a = 0;
                                    layer.update(disasterElement, true);
                                }
                                catch (e) {

                                }

                            }
                        }
                        if (ele.element.tag.data) {
                            var data = ele.element.tag.data;
                            var title = ele.element.tag.data.type;
                            G.newModule.DisasterCensusModule.mouseEvent(ele.element.id, ele.element.geometry);
                            ele.element.symbol.fillColor.a = 0.3 * 255;
                            layer.update(ele.element, true);
                            DetailsInformation.onClose();
                            DetailsInformation.addDetailsPanle(data, title);//带线的详情框
                        }

                    }
                    else {
                        DetailsInformation.onClose();
                        var elements = layer.elements;
                        for (var i = 0; i < elements.length; i++) {
                            var disasterElement = elements[i];
                            if (!!disasterElement.symbol) {
                                disasterElement.symbol.fillColor.a = 0;
                                layer.update(disasterElement, true);
                            }
                        }
                    }
                }
            },
            /**
             * 绑定地图事件触发
             * @private
             */
            _bindMapEvent: function () {
                var _self = this;
                G.options.map.un('click', this.un, this);
                G.options.map.on("click", function (event) {
                    _self._mapClick(event);
                });
                G.options.map.on("mousemove", function (event) {
                    _self._mapMouseMove(event);
                });
                G.options.map.on("extentchanged", function (event) {
                    _self._mapExtendChanged(event);

                });
                G.options.map.on("resolutionchanged", function (event) {
                    _self._mapResolutionchanged(event);
                });
            },
        });
        /**
         * tooltip专用模块
         */
        component.include({
            /**
             * 点击效果
             * @method
             */
            _openPopupBlinck: function (layerid, parma, eleInf) {
                var self = this;
                var planearr = ['RESSLHKHL0002',
                    'RESSLHKHL0006',
                    'RESSLHKHL0007',
                    'RESSLHKHL0008',
                    'RESSLHKHL0011',
                    'RESSLHKHL0015',
                    'RESSLHKHL0018',
                    'RESSLHKHL0019',
                    'RESSLHKHL0021',
                    'RESSLHKHL0025',
                    'RESSLHKHL0026',
                    'RESSLHKHL0028',
                    'RESSLHKHL0001',
                    'RESSLHKHL0029',
                    'RESSLHKHL0030',
                    'RESSLHKHL0032',
                    'RESSLHKHL0038',
                    'RESSLHKHL0040',
                    'RESSLHKHL0004',
                    'RESSLHKHL0023',
                    'RESSLHKHL0033',
                    'RESSLHKHL0036',
                    'RESSLSLJCZD0011']

                if (layerid != "rescueteamAroundLayer" && layerid != "disinfoperAroundLayer") {
                    this.options.toolTipWare.clear();
                }
                var pointX, pointY;
                if (parma.geom) {
                    if (parma.geom.type == "Point") {
                        pointX = parma.geom.coordinates[0];
                        pointY = parma.geom.coordinates[1];
                    } else if (parma.geom.type.indexOf("LineString") != -1) {
                        pointX = G.options.mapEvent.data.mapX;
                        pointY = G.options.mapEvent.data.mapY;
                    }
                } else {
                    pointX = parma.pointX;
                    pointY = parma.pointY;
                }
                if (eleInf) {
                    if (eleInf.isWarmInfo || layerid == "townLayer") {
                        //预警信息不闪烁
                    } else {
                        if (layerid == "reserveHouse11Layer" && parma.tag.RESCUEID_) {
                            if (planearr.indexOf(parma.tag.RESCUEID_) > -1) {
                                layerid = "RescueTeamT004PORTLayer";
                            } else {
                                layerid = "reserveHouse11Layer";
                            }
                        }
                        if (layerid == "resourceTeamLayer" && parma.tag.id) {
                            if (planearr.indexOf(parma.tag.id) > -1) {
                                layerid = "RescueTeamT004PORTLayer";
                            } else {
                                layerid = "resourceTeamLayer";
                            }
                        }
                        G.options.commonGIS._blinkHighlight(layerid, pointX, pointY, parma.center, parma.id);
                    }
                } else {
                    G.options.commonGIS._blinkHighlight(layerid, pointX, pointY, parma.center);
                }

                var point = G.options.commonGIS._createPoint(pointX, pointY);
                if (parma.view) {
                    var level = G.options.map.getZoomLevel();
                    if (level < 11) {
                        G.options.map.zoomTo(11);
                    }
                    this._adjustCenter(point);
                }
                var detailObj = {};
                if (parma._distance) {
                    parma.tag.distance = (parma._distance / 1000).toFixed(2);
                }
                detailObj.point = point;
                detailObj.layerid = layerid;
                detailObj.id = parma.id;
                detailObj.tag = parma.tag;
                detailObj.center = parma.center;
                detailObj.offset = parma.offset;
                if (eleInf) {
                    detailObj.htmlSelf = eleInf.htmlSelf;
                    detailObj.isSelfMoreInf = eleInf.isSelfMoreInf;
                    detailObj.isDetailMoreInf = eleInf.isDetailMoreInf;
                    detailObj.isWarmInfo = eleInf.isWarmInfo;
                }
                //显示详情
                if (layerid.replace('Layer', '') == "weatherstation" || layerid.replace('Layer', '') == "environmentChecked") {
                    this._openPopupweatherDetaills(detailObj);//气象站详情特殊处理
                } else if (layerid.replace('Layer', '') == "nearEnterprise") {
                    //this._openPopupweatherDetaills(detailObj);
                }
                else if (layerid.replace('Layer', '') == "rescueArea_disoatch_town" || layerid.replace('Layer', '') == "rescueArea_disoatch_county") {
                    mapToolTipAsDialog.addTooltip(detailObj)
                } else {
                    if (layerid == "townLayer") {
                        if ($('#' + detailObj.tag.id).length > 0)//已存在
                        {
                            return
                        }
                        $('.gse').append('<div id="' + detailObj.tag.id + '"  class="gis_flag"><p class="gis_flagArea">' + detailObj.tag.name + '</p><p class="gis_flagNum">' + detailObj.tag.pop + '</p></div>');
                        var contentTemplate11 = window.document.getElementById(detailObj.tag.id);
                        var point_overlay = new ol.Overlay({
                            id: 'Affareatip',
                            offset: [0, 0],
                            element: contentTemplate11,
                            stopEvent: false,
                            positioning: 'center-center'
                        });
                        G.options.map.map.addOverlay(point_overlay);
                        point_overlay.setPosition([detailObj.tag.geom.coordinates[0] * 1, detailObj.tag.geom.coordinates[1] * 1]);
                    }
                    else {
                        this._openPopupDetaills(detailObj);
                    }
                }
            },
            /**
             * 判断当前点是否闪烁过。
             * @param point
             * @returns {boolean}
             * @private
             */
            _isBlink: function (point) {
                var count = G.options.BlinkPoints.length;
                for (var i = 0; i < count; i++) {
                    var blinkPoint = G.options.BlinkPoints[i];
                    if (point.id == blinkPoint.id) {
                        return true
                    }
                }
                return false;
            },
            /**
             * 图标闪烁
             * @param layerid 图层id
             * @param point 标绘的点信息
             * @private
             */
            _blinkPoint: function (layerid, point) {
                if(this._isBlink(point)){return}//如果闪烁过，则不闪烁
                else {
                    G.options.BlinkPoints.push(point)
                }
                var repeatInteval = 200;//闪烁间隔
                var repeatCount = 0;
                var layer = G.options.map.getLayerById(layerid);
                var getElement = function (id) {
                    var count = layer.getCount();
                    var findEle = null;
                    for (var i = 0; i < count; i++) {
                        var ele = layer.get(i);
                        if (ele.id == id) {
                            findEle = ele;
                            break;
                        }
                    }
                    return findEle;
                }
                var repeat = function () {
                    if (layer.getCount() > 0) {
                        var highlightTimer = setTimeout(jQuery.proxy(function () {
                            if (layer.getCount() > 0) {
                                var ele = getElement(point.id);
                                if (repeatCount < 8) {
                                    layer.showElement(ele, (repeatCount % 2) == 0);
                                    repeatCount++;
                                    repeat.call(this);
                                } else {
                                    layer.showElement(ele, true);
                                }
                            }
                        }, this), repeatInteval);
                    }
                }
                repeat();
            },
            /**
             * 图标闪烁
             * @method
             */
            _blinkHighlight: function (layerid, pointX, pointY, center, eleId) {
                //this._clearBlink();
                var self = this;
                //储备库和战保基地code
                if (layerid.indexOf("MaterialBase") > -1) {
                    layerid = "MaterialBaseLayer";
                }
                if (layerid.indexOf("MaterialStore") > -1) {
                    layerid = "MaterialStoreLayer";
                }
                if (layerid.indexOf("AfterShockInfoLayer") > -1) {
                    layerid = "RescueTeamT022Layer";
                }
                var opt = {
                    icon: EMAP_CONFIGICON.modules.MenuModule[layerid.replace('Layer', '') + '_img' + '_hover'],
                    pointX: pointX,
                    pointY: pointY,
                    center: center || false,
                    layerid: layerid
                }

                //特殊处理两个危化品企业数据的高亮图标 WYC 20190713
                if (eleId == "11114" || eleId == "45287") {
                    opt.icon = EMAP_CONFIGICON.modules.MenuModule['RedCount_' + layerid.replace('Layer', '') + '_img_hover'];
                }
                if (layerid.indexOf('RescueTeamHelp') >= 0) {
                    var symbolType = layerid.replace('RescueTeamHelp', 'RescueTeam');
                    opt.icon = EMAP_CONFIGICON.modules.MenuModule[symbolType.replace('Layer', '') + '_img_hover'];
                }
                if (layerid.indexOf('RescueTeamGanFuHelp') >= 0) {
                    var symbolType = layerid.replace('RescueTeamGanFuHelp', 'RescueTeam');
                    opt.icon = EMAP_CONFIGICON.modules.MenuModule[symbolType.replace('Layer', '') + '_img_hover'];
                }
                if(layerid=="realshipLayer"||layerid.indexOf("nothigh")!=-1)
                {

                }
                else
                {
                    self._highlight(opt, eleId);
                    //闪烁间隔
                    var repeatInteval = 200,
                        repeatCount = 0;
                    repeat.call(this);

                    function repeat() {
                        if (this.highlightLayer.getCount() > 0) {
                            this.highlightTimer = setTimeout(jQuery.proxy(function () {
                                if (this.highlightLayer.getCount() > 0) {
                                    var ele = this.highlightLayer.elements[0];
                                    if (repeatCount < 15) {
                                        this.highlightLayer.showElement(ele, (repeatCount % 2) == 0);
                                        repeatCount++;
                                        repeat.call(this);
                                    } else {
                                        this.highlightLayer.showElement(ele, false);
                                    }
                                }
                            }, this), repeatInteval);
                        }
                    }
                }

            },
            /**
             * 获取高亮符号
             * @method
             */
            _highlight: function (opt) {
                this.highlightLayer.clear();
                var pictureSymbol;
                if (opt.layerid == "SituationLayer") {
                    pictureSymbol = new g2.syms.Picturemarkersymbol({
                        source: opt.icon || this.options.iconConfig[opt.layerid],
                        width: 40,
                        height: 47,
                        offsetX: 20,
                        offsetY: 47,
                        opacity: opt.opacity || 1
                    });
                } else if (opt.layerid == "rescueArea_disoatch_countyLayer" || opt.layerid == "rescueArea_disoatch_townLayer") {
                    pictureSymbol = new g2.syms.Picturemarkersymbol({
                        source: opt.icon || this.options.iconConfig[opt.layerid],
                        width: 64,
                        height: 70,
                        offsetX: 32,
                        offsetY: 35,
                        opacity: opt.opacity || 1
                    });
                } else if (opt.layerid == "RescueTeamGanFuHelpT003Layer" || opt.layerid == "RescueTeamHelpT003Layer") {
                    pictureSymbol = new g2.syms.Picturemarkersymbol({
                        source: opt.icon || this.options.iconConfig[opt.layerid],
                        width :70,
                    height : 53,
                    offsetX : 35,
                    offsetY: 29,
                        opacity: opt.opacity || 1
                    });
                } else if (opt.layerid == "orangeLayer" || opt.layerid == "redLayer" || opt.layerid == "yellowLayer" || opt.layerid == "blueLayer" || opt.layerid == "grayLayer") {
                    pictureSymbol = new g2.syms.Picturemarkersymbol({
                        source: opt.icon || this.options.iconConfig[opt.layerid],
                        width :71,
                        height : 77,
                        offsetX : 55,
                        offsetY: 40,
                        opacity: opt.opacity || 1
                    });
                } else if (!!opt.center) {
                    pictureSymbol = new g2.syms.Picturemarkersymbol({
                        source: opt.icon || this.options.iconConfig[opt.layerid],
                        width: 74,
                        height: 74,
                        offsetX: 37,
                        offsetY: 37,
                        opacity: opt.opacity || 1
                    });
                } else {
                    if (opt.icon || (this.options.iconConfig && this.options.iconConfig[opt.layerid])) {
                        pictureSymbol = new g2.syms.Picturemarkersymbol({
                            source: opt.icon || this.options.iconConfig[opt.layerid],
                            width: 66,
                            height: 71,
                            offsetX: 32,
                            offsetY: 65,
                            opacity: opt.opacity || 1
                        });
                    }
                    else {
                        return;
                    }
                }
                var point = this._createPoint(parseFloat(opt.pointX), parseFloat(opt.pointY));
                var pointEle = new g2.ele.Element({geometry: point, symbol: pictureSymbol});
                this.highlightLayer.add(pointEle);
                this.highlightLayer._resource_id = opt.layerid;
            },
            /**
             * 清空高亮
             * @param resourceId 资源标识
             */
            clearHighlight: function (resourceId) {
                // this.options.toolTipWare.clear();
                if (!resourceId || this.highlightLayer._resource_id === resourceId) {
                    if(this.highlightLayer.getCount()>0) {
                        this.highlightLayer.clear();
                        this._clearBlink();
                    }
                }
            },
            /**
             * 清空闪烁
             * @method
             */
            _clearBlink: function () {
                if (this.highlightTimer != null) {
                    try {
                        clearInterval(this.highlightTimer);
                    } catch (e) {
                    }
                }
                this.highlightTimer = null;
            },
            /**
             * 调整地图范围
             * @private
             */
            _adjustCenter: function (element) {
                var self = this;
                //如果不在可视范围内，则调整地图中心位置
                if (self.highlightLayer.getCount() > 0) {
                    if (!self._isWidthinVisibleSection(element)) {
                        var ele = self.highlightLayer.elements[0];
                        if (ele) {
                            setTimeout(function () {
                                var locationPt = self._getLocationPosition(ele.geometry.x, ele.geometry.y);
                                G.options.map.setCenter(locationPt);
                            }, 300);
                        }
                    }
                }
            },
            /**
             * 是否在可视化区域
             * @private
             */
            _isWidthinVisibleSection: function (geometry) {
                var flag = true;
                var viewSize = G.options.map.getViewSize(),
                    paddingX = 450,
                    viewExtent = {
                        left: paddingX,
                        top: 10,
                        right: viewSize[0] - paddingX,
                        bottom: 100
                    };
                if (geometry) {
                    if (geometry.$type.indexOf('Point') === 0) {//暂时处理点
                        var pointPixel = G.options.map.getPixelFromCoordinate([geometry.x, geometry.y]);
                        console.debug(viewExtent);
                        console.debug(pointPixel);
                        if (!(pointPixel[0] > viewExtent.left &&
                            pointPixel[0] < viewExtent.right &&
                            pointPixel[1] > viewExtent.top &&
                            pointPixel[1] < viewExtent.bottom)) {
                            flag = false;
                        }
                    }
                }
                return flag;
            },
            /**
             * 获取屏幕位置
             * @private
             */
            _getLocationPosition: function (mapx, mapy) {
                var screenPt = G.options.map.getPixelFromCoordinate([mapx, mapy]);
                screenPt[1] -= G.options.map.getViewSize()[1] * 1 / 7;
                var mapPt = G.options.map.getCoordinateFromPixel(screenPt);
                console.log(mapPt);
                return new g2.geom.Point({
                    x: mapPt[0],
                    y: mapPt[1]
                });
            },
            //打开天气详情
            _openPopupweatherDetaills: function (options) {
                var self = this;
                var contentTemplate = '<div class="popup-detail-div ">' +
                    '<div class="detail-title"><span title="气象站详情">气象站</span><a class="detail_hd_close"></a></div>' +
                    '<div  id="ifs"  style="width: 99%; height: 100%; overflow-y: auto;" >' +
                    '<b style="margin-top: 20px;margin-left: 10px">气象站信息查询中……</b></div>' +
                    '</div>';
                var offsetXY = [];
                if (!!options.center) {
                    offsetXY = [-158, -25];
                } else {
                    offsetXY = [-158, -35];
                }
                var num = options.tag.no;
                if (options.tag.NATSTATIONNO) {
                    num = options.tag.NATSTATIONNO;
                }

                // 气象接口
                this._queryWeatherRealData(num, function (htmlcontent) {
                    // $('#ifs').empty();
                    // $('#ifs').append(htmlcontent);
                });

                var tooltip = new g2.ext.Tooltip({
                    anchor: options.point,  //提示在地图上停靠位置
                    content: contentTemplate,  //提示内容
                    autoPan: true,
                    autoPanMargin: 200,
                    layerId: "weatherInfo", //提示所在图层ID
                    offset: offsetXY, //位置偏移量
                    className: 'g2-tooltip'  //tooltip样式
                });
                G.options.toolTipWare.clear();
                G.options.toolTipWare.add(tooltip);
                $('.detail_hd_close').click(function (e) {
                    G.options.toolTipWare.clear();
                })


                //气象站详情
                var type;
                if (options.tag.type == "01") type = "国家基本气象站";
                if (options.tag.type == "02") type = "国家基准气候站";
                if (options.tag.type == "03") type = "国家气象观测站";

                $('#ifs').empty();
                var htmlcontent1 = "<ul>" +
                    "<li><span>测站类型:</span>" + type + "</li>" +
                    "<li><span>省份:</span>" + options.tag.province + "</li>" +
                    "<li><span>观测场海拔高度（米）:</span>" + options.tag.obselevation + "</li>" +
                    "<li><span>气压传感器海拔高度（米）:</span>" + options.tag.baroelevation + "</li>" +
                    "</ul>";
                $('#ifs').append(htmlcontent1);
                $(".detail-title span").text(options.tag.name + "气象站");
            },
            //查询单个站点气象信息
            _queryWeatherRealData: function (staid, callback) {
                $.ajax({
                    url: EMAP_CONFIG.common.urlWeb + "/weather/getSurfEleByTimeRangeAndStaID",
//              contentType:"application/json",
                    type: 'POST',
                    // async:"false",
                    dataType: "json",
                    data: {staIDs: staid},
                    success: function (res) {
                        if (!res.data) {
                            console.log("气象站数据为空")
                            return
                        } else if (res.data.DS) {
                            var length = res.data.DS.length;
                            var result = res.data.DS[length - 1];
                            var str = "";

                            // 区站号(数字) "Station_Id_d": "54526",
                            // 区站号 "STATION_Id_C": "54526",
                            //     站名 "Station_Name": "东丽区",
                            //     测站类型"Station_Type": "陆地自动站",
                            //  温度"TEM": "10.2000",
                            //  相对湿度"RHU": "49"
                            // 气压 "PRS": "1020.1000",
                            //     瞬时风向 "WIN_D_INST": "229",
                            //     瞬时风速 "WIN_S_INST": "2.2000",
                            // 过去24小时最高气温 "TEM_Max_24h": "14.9000",
                            // 过去24小时最低气温 "TEM_Min_24h": "2.2000",
                            //     过去1小时降水量"PRE_1h": "0.0000",
                            //     过去3小时降水量"PRE_3h": "0.0000",
                            //     过去6小时降水量  "PRE_6h": "0.0000",
                            //     过去12小时降水量"PRE_12h": "0.0000",
                            //     过去24小时降水量 "PRE_24h": "0.0000",
                            //    省 "Province": "天津市",
                            //     地市 "City": "市辖区",
                            //     区县 "Cnty": "东丽区",
                            //     乡镇"Town": "",
                            //     年份 "Year": "2019",
                            //     月"Mon": "3",
                            //     日"Day": "2"
                            // 小时"Hour": "2",

                            str += "<ul>" +
                                "<li><span>站名:</span>" + result.Station_Name + "</li>" +
                                "<li><span>测站类型:</span>" + result.Station_Type + "</li>" +
                                "<li class='nphone'><span>温度:</span>" + result.TEM + "</li>" +
                                "<li><span>相对湿度:</span>" + result.RHU + "</li>" +
                                "<li><span>气压:</span>" + result.PRS + "</li>" +
                                "<li><span>瞬时风向:</span>" + result.WIN_D_INST + "</li>" +
                                "<li><span>瞬时风速:</span>" + result.WIN_S_INST + "</li>" +
                                "<li><span>过去24小时最高气温:</span>" + result.TEM_Max_24h + "</li>" +
                                "<li><span>过去24小时最低气温:</span>" + result.TEM_Min_24h + "</li>" +
                                "<li><span>过去1小时降水量:</span>" + result.PRE_1h + "</li>" +
                                "<li><span>过去3小时降水量:</span>" + result.PRE_3h + "</li>" +
                                "<li><span>过去6小时降水量:</span>" + result.PRE_6h + "</li>" +
                                "<li><span>过去12小时降水量:</span>" + result.PRE_12h + "</li>" +
                                "<li><span>过去24小时降水量:</span>" + result.PRE_24h + "</li>" +
                                "<li><span>地区:</span>" + result.Province + result.City + result.Cnty + "</li>" +
                                "<li><span>时间:</span>" + result.Year + "年" + result.Mon + "月" + result.Day + "日" + result.Hour + "时</li>" +
                                "</ul>";
                            callback(str);
                        }

                    }
                });
            },
            /**
             * 详情信息展示
             * @param param
             * @private
             */
            _openPopupDetaills: function (options) {
                if (options.htmlSelf) {//自定义面板
                    this._addPopupDetaills(options.point, options.htmlSelf, options.offset || [-230, -35], options.layerid);
                    $('.detail-button span').click(function () {
                        var EventTimes = $(this).attr('_time');
                        var EventTit = $(this).attr('_title');
                        var EventType = $(this).attr('_type');
                        var EventDesc = $(this).attr('_infor')
                        var EventLat = Number($(this).attr('_lat'));
                        var EventLon = Number($(this).attr('_lon'));
                        var accident = {
                            "EventTimes": EventTimes,
                            "EventTit": EventTit,
                            //"EventTime": resData,
                            //"EventLevel": "严重",
                            "EventType": EventType,
                            "EventAddr": EventTit,
                            "EventDesc": EventDesc,
                            "EventLon": EventLon,
                            "EventLat": EventLat,
                        }

                        MessageUtil.ZwGis.sendLocationToOperate({
                            event: accident
                        });
                    })

                } else if (options.isSelfMoreInf) {//资源分析的面板
                    ResourceEquipDetails.analoGetMoreInf(options.tag, options.layerid, options.point);
                } else if (options.isDetailMoreInf) {//资源分析的面板
                    ResourceEquipDetails.detailsMoreInf(options.layerid, options.id, options.point);
                } else {
                    if (options.layerid.indexOf("Count_") != -1)//处理第三幕数据详情展示
                    {
                        HazardDetail.init(options.tag)
                        return;
                    }
                    if (options.layerid.indexOf("hazardous") != -1 || options.layerid.indexOf("hazardous1_") != -1) {
                        var id;
                        if (options.tag.id) {
                            id = options.tag.id;
                        } else {
                            id = options.id;
                        }

                        this.DetailInfoServices.getDangerQYDetail(id, function (err, resultData) {
                            container.load(webApp + 'src/modules/GisPureModule/popdialog/html/enterpriseCrisis.html', function () {
                                //
                                enterpriseCrisis.onOpen(resultData[0])
                            })
                        })
                        var container = $(document.createElement('div'));
                        container.attr('id', 'enterpriseCrisis_Details');
                        container.css({
                            position: 'absolute',
                            top: '0%',
                            left: '0%',
                            width: '100%',
                            height: '100%',
                            zIndex: '99999',
                            background: 'rgba(52,52,52,.5)'
                        });
                        $("body").append(container);
                    } else if (options.layerid.indexOf("industry") != -1 || options.layerid.indexOf("industry1_") != -1) {
                        //工贸企业

                        var id;
                        if (options.tag.id) {
                            id = options.tag.id;
                        } else {
                            id = options.tag.WHSMYHBZID ? options.tag.WHSMYHBZID : options.id;
                        }

                        this.DetailInfoServices.getGMQYDetail(id, function (err, resultData) {
                            //
                            // if (resultData && resultData.length > 0) {
                            //     var point = {};
                            //     point.x = resultData[0].geom.coordinates[0];
                            //     point.y = resultData[0].geom.coordinates[1];
                            //     resultData[0].point = point;
                            //     IndustryEnterpriseDetail.showPanel(resultData[0]);
                            //     G.options.commonGIS._blinkHighlight(options.layerid, point.x,point.y, true);
                            // }
                            container.load(webApp + 'src/modules/GisPureModule/popdialog/html/industrialEnterprise.html', function () {
                                //
                                industrialEnterpriseView.onOpen(resultData)
                            })
                        });
                        var container = $(document.createElement('div'));
                        container.attr('id', 'industrialEnterprise_Details');
                        container.css({
                            position: 'absolute',
                            top: '0%',
                            left: '0%',
                            width: '100%',
                            height: '100%',
                            zIndex: '99999',
                            background: 'rgba(52,52,52,.5)'
                        });

                        $("body").append(container);


                    } else if (options.layerid.indexOf("coalMine") != -1 || options.layerid.indexOf("coalMine1_") != -1) {
                        //煤矿企业
                        var id
                        if (options.tag.id) {
                            id = options.tag.id;
                        } else {
                            id = options.tag.COALID ? options.tag.COALID : options.id;
                        }
                        this.DetailInfoServices.getMKQYDetail(id, function (err, resultData) {
                            // if (resultData && resultData.length > 0) {
                            //     var point = {};
                            //     point.x = resultData[0].geom.coordinates[0];
                            //     point.y = resultData[0].geom.coordinates[1];
                            //     resultData[0].point = point;
                            //     CoalEnterpriseDetail.showPanel(resultData[0]);
                            //     G.options.commonGIS._blinkHighlight(options.layerid, point.x,point.y, true);
                            // }
                            container.load(webApp + 'src/modules/GisPureModule/popdialog/html/coalenterprise.html', function () {
                                //
                                coalenterprise.onOpen(resultData)
                            })
                        });
                        var container = $(document.createElement('div'));
                        container.attr('id', 'coalenterprise_Details');
                        container.css({
                            position: 'absolute',
                            top: '0%',
                            left: '0%',
                            width: '100%',
                            height: '100%',
                            zIndex: '99999',
                            background: 'rgba(52,52,52,.5)'
                        });
                        $("body").append(container);
                    } else if (options.layerid.indexOf("explosive") != -1 || options.layerid.indexOf("explosive1_") != -1) {
                        //烟花爆竹企业
                        var id
                        if (options.tag.id) {
                            id = options.tag.id;
                        } else {
                            id = options.tag.FIREWORKENTID ? options.tag.FIREWORKENTID : options.id;
                        }
                        this.DetailInfoServices.getYHBZQYDetail(id, function (err, resultData) {
                            //
                            // if (resultData && resultData.length > 0) {
                            //     var point = {};
                            //     point.x = resultData[0].geom.coordinates[0];
                            //     point.y = resultData[0].geom.coordinates[1];
                            //     resultData[0].point = point;
                            //     FireworkEnterpriseDetail.showPanel(resultData[0]);
                            //     G.options.commonGIS._blinkHighlight(options.layerid, point.x,point.y, true);
                            // }
                            container.load(webApp + 'src/modules/GisPureModule/popdialog/html/fireworksCompany.html', function () {
                                //
                                fireworksCompany.onOpen(resultData)
                            })

                        });
                        var container = $(document.createElement('div'));
                        container.attr('id', 'fireworksCompany_Details');
                        container.css({
                            position: 'absolute',
                            top: '0%',
                            left: '0%',
                            width: '100%',
                            height: '100%',
                            zIndex: '99999',
                            background: 'rgba(52,52,52,.5)'
                        });

                        $("body").append(container);


                    } else if (options.layerid.indexOf("mine") != -1 || options.layerid.indexOf("mine1_") != -1) {
                        //非煤矿山企业
                        var id
                        if (options.tag.id) {
                            id = options.tag.id;
                        } else {
                            id = options.tag.WKKID ? options.tag.WKKID : options.id;
                        }
                        this.DetailInfoServices.getFMKQYDetail(id, function (err, resultData) {
                            // if (resultData && resultData.length > 0) {
                            //     var point = {};
                            //     point.x = resultData[0].geom.coordinates[0];
                            //     point.y = resultData[0].geom.coordinates[1];
                            //     resultData[0].point = point;
                            //     TailingPondDetail.showPanel(resultData[0]);
                            //     G.options.commonGIS._blinkHighlight(options.layerid, point.x,point.y, true);
                            // }
                            container.load(webApp + 'src/modules/GisPureModule/popdialog/html/noncoalminEnterprise.html', function () {
                                //
                                noncoalminEnterprise.onOpen(resultData)
                            })
                        });

                        var container = $(document.createElement('div'));
                        container.attr('id', 'noncoalminEnterprise_Details');
                        container.css({
                            position: 'absolute',
                            top: '0%',
                            left: '0%',
                            width: '100%',
                            height: '100%',
                            zIndex: '99999',
                            background: 'rgba(52,52,52,.5)'
                        });

                        $("body").append(container);


                    } else if (options.layerid.indexOf("landslideY") != -1 ||
                        options.layerid.indexOf("nishiliuY") != -1 ||
                        options.layerid.indexOf("historicalPointY") != -1 ||
                        options.layerid.indexOf("huapoY") != -1 ||
                        options.layerid.indexOf("landslideW") != -1 ||
                        options.layerid.indexOf("nishiliuW") != -1 ||
                        options.layerid.indexOf("historicalPointW") != -1 ||
                        options.layerid.indexOf("huapoW") != -1) {
                        //非煤矿山企业
                        var id = options.tag.id;
                        this.DetailInfoServices.getGEODISASTERDetail(id, function (err, resultData) {
                            if (resultData && resultData.length > 0) {
                                var point = {};
                                point.x = resultData[0].geom.coordinates[0];
                                point.y = resultData[0].geom.coordinates[1];
                                resultData[0].point = point;
                                GeologDisaterDetail.showPanel(resultData[0]);
                                G.options.commonGIS._blinkHighlight(options.layerid, point.x, point.y, true);
                            }
                        });
                    } else {
                        var contentTemplate = "";
                        var tmpobj = this._switchTemplate(options.layerid, options, contentTemplate, options.point);
                        var offsetXY = [];
                        if (!!options.center) {
                            offsetXY = [-158, -25];
                        } else {
                            offsetXY = [-158, -35];
                        }
                        this._addPopupDetaills(options.point, tmpobj.contentTemplate, offsetXY, options.layerid);
                    }
                }
            },
            /**
             * 加载详情弹框
             * @param param
             * @private
             */
            _addPopupDetaills: function (point, content, offset, layerid) {
                if (isNaN(point.x)) return;
                //周边分析
                var boolquery = true;
                var tooltip = new g2.ext.Tooltip({
                    anchor: point,  //提示在地图上停靠位置
                    content: content,  //提示内容
                    autoPan: true,
                    autoPanMargin: 200,
                    layerId: layerid, //提示所在图层ID
                    offset: [offset[0], offset[1]], //位置偏移量
                    className: 'g2-tooltip'  //tooltip样式
                });
                //详情框不得超出界外start
                var en = G.options.map.getExtent().expand(-0.25);
                if (point.x > en.maxx || point.x < en.minx || point.y > en.maxy || point.y < en.miny) {
                    // self.map.pan(p1);
                    G.options.map.setCenter(point);
                }
                //详情框不得超出界外end
                if (layerid != "rescueteamAroundLayer" && layerid != "disinfoperAroundLayer") {
                    this.options.toolTipWare.clear();
                }
                else
                {
                    boolquery=false;
                }
                this.options.toolTipWare.add(tooltip);
                $('.detail_hd_close').click(function (e) {
                    if($(this).hasClass('rescueteamAroundLayer')||$(this).hasClass('disinfoperAroundLayer'))
                    {
                        $(this).parent().parent().parent().parent().parent().remove()
                    }
                    else
                    {
                        G.options.toolTipWare.clear();
                        //得到数据进行拼接列表和标注
                        if(G.newModule.AroundQueryModule)G.newModule.AroundQueryModule.onClose();
                    }
                })

                $('.aroundBtn').click(function (e) {

                    if (boolquery) {
                        boolquery = false;
                        var latLng = [point.x, point.y];
                        var radius = 20000;//默认查询20周边
                        if (G.newModule['AroundQueryModule']) {
                            G.newModule['AroundQueryModule'].onOpen(latLng, radius);
                        }
                    }
                    else {
                        boolquery = true;
                        //得到数据进行拼接列表和标注
                        if (G.newModule['AroundQueryModule']) {
                            G.newModule['AroundQueryModule'].onClose();
                        }
                    }
                });
            },
            //切换不同的模板
            _switchTemplate: function (layerid, param, contentTemplate, geo) {
                if ((layerid == "roadLayer") || (layerid == "roadpointsLayer" || layerid == "railwayLayer")) {
                    // var center = param.geom.coordinates[0];
                    // var point = center[parseInt((center.length) / 2)];
                    // var name = param.tag.name || "";
                    // var distance = (param._distance / 1000).toFixed(2) || "";
                    // var describe = (param._distance / 1000) || "";
                    // var layerId = layerid;
                    // contentTemplate = '<div style="text-align:center;margin:0 auto;z-index: 1000" class="typecolor bargcolor content-typecolor">' +
                    //     '<label style="text-align:left;padding-top: 5px;display: block;white-space: nowrap;line-height: 20px;min-width: 180px;">' +
                    //     '<div>名称：' + name + '</div>' +
                    //     '</label>' +
                    //     '<label style="text-align:left;padding-top: 5px;display: block;white-space: nowrap;line-height: 20px;min-width: 180px;">' +
                    //     '<div>中断长度：' + distance + '公里</div>' +
                    //     '</label>' +
                    //     '<label style="text-align:left;padding-top: 5px;display: block;white-space: nowrap;line-height: 20px;min-width: 180px;">' +
                    //     '<div>损毁情况：' + describe + '</div>' +
                    //     '</label>' +
                    //     // '<button class="shpinks">视频</button>' +
                    //     '</div>';
                } else if (layerid == "earInfluenceDisLayer") {
                    var point = geo;
                    var layerId = layerid;
                    contentTemplate = '<div class="make_line_content earInfluence_class">' +
                        '<label class="lable_ele_css">' +
                        '<div>' + param.sigInf[0].label + '：' + param.sigInf[0].value + '</div>' +
                        '</label>' +
                        '<label class="lable_ele_css">' +
                        '<div>' + param.sigInf[1].label + '：' + param.sigInf[1].value + '</div>' +
                        '</label>' +
                        '<label class="lable_ele_css">' +
                        '<div>' + param.sigInf[2].label + '：' + param.sigInf[2].value + '</div>' +
                        '</label>' +
                        '</div>';
                } else {
                    //todo 判断
                    if (param.isWarmInfo) {
                        var fieldDetail = PopupDetailConfig['warmInfo'];
                        var contentTemplate = '<div class="popup-detail-div ' + fieldDetail.CLASSNAME + '">';
                        contentTemplate += '<div class="detail-title" ><span title="' + param.tag.TITLENAME + '">' + param.tag.TITLENAME + '</span><a class="detail_hd_close"></a></div>';
                        contentTemplate += '<ul>';
                        var fields = fieldDetail.FIELDMAP;
                        for (var key in fields) {
                            if (typeof (key) == "string") {
                                if (!param.tag[key]) {
                                    param.tag[key] = "无";
                                }
                                contentTemplate += '<li><span>' + fields[key] + '：</span><span title=' + param.tag[key] + '>' + param.tag[key] + '</span>';
                                if (key.indexOf("TEL") > -1) {
                                    if (param.tag[key] != "无") {
                                        contentTemplate += '<span class="detail-tel"></span></li>';
                                    }
                                } else {
                                    contentTemplate += '</li>';
                                }
                            }
                        }
                        contentTemplate += '</ul></div>';
                    } else if (param.layerid.indexOf("Troubled") != -1
                        || param.layerid.indexOf("Notchecked") != -1
                        || param.layerid.indexOf("CheckitOut") != -1 || param.layerid.indexOf("normal") != -1) {
                        var fieldDetail = {};
                        //重点资源的不同分类图层处理
                        param.layerid = param.layerid.replace("_Troubled", "");
                        param.layerid = param.layerid.replace("_Notchecked", "");
                        param.layerid = param.layerid.replace("_CheckitOut", "");
                        param.layerid = param.layerid.replace("_normal", "");
                        if (param.layerid.replace('Layer', '') in PopupDetailConfig) {
                            fieldDetail = PopupDetailConfig[param.layerid.replace('Layer', '')];
                        } else {
                            return;
                        }
                        var contentTemplate = '<div class="popup-detail-div ' + fieldDetail.CLASSNAME + '">';
                        contentTemplate += '<div class="detail-title" ><span title="' + param.tag.TITLENAME + '">' + param.tag.TITLENAME + '</span><a class="detail_hd_close"></a></div>';
                        contentTemplate += '<ul>';
                        var fields = fieldDetail.FIELDMAP;
                        for (var key in fields) {
                            if (typeof (key) == "string") {
                                if (!param.tag[key]) {
                                    param.tag[key] = "无";
                                }
                                contentTemplate += '<li><span>' + fields[key] + '：</span><span title=' + param.tag[key] + '>' + param.tag[key] + '</span>';
                                if (key.indexOf("TEL") > -1) {
                                    if (param.tag[key] && param.tag[key] != " " && param.tag[key] != "无") {
                                        contentTemplate += '<span class="detail-tel"></span></li>';
                                    }
                                } else {
                                    contentTemplate += '</li>';
                                }
                            }
                        }
                        contentTemplate += '</ul></div>';
                    } else if (layerid == "railwaystationLayer" || layerid == "airportLayer" || layerid == "developmentAffLayer" || layerid == "schoolAffLayer"
                        || layerid == "disinfoperLayer" || layerid == "developmentLayer" || layerid == "schoolLayer" || layerid == "portwharfLayer"
                        || layerid == "collapseLayer" || layerid == "disinfoperLayer" || layerid == "hospitalLayer" || layerid == "reservoirLayer"
                        || layerid == "nuclearLayer" || layerid == "mudslideLayer" || layerid == "falldownLayer" || layerid == "landslideLayer" || layerid == "reservoirLayer") {//特殊处理第二场景火车站和飞机场详情
                        if (param.layerid.replace('Layer', '') in PopupDetailConfig) {
                            fieldDetail = PopupDetailConfig[param.layerid.replace('Layer', '')];
                            var contentTemplate = '<div class="popup-detail-div alert_dialogStyle1 ' + fieldDetail.CLASSNAME + '">';
                            contentTemplate += '<div class="detail-title" ><a class="detail_hd_close '+param.layerid+'"></a><span title="' + param.tag.TITLENAME + '">' + param.tag.TITLENAME + '</span>';
                            contentTemplate += '</div><ul>';
                            var fields = fieldDetail.FIELDMAP;
                            var datas;
                            for (var key in fields) {
                                if (typeof (key) == "string") {
                                    if (!param.tag[key]) {
                                        param.tag[key] = "无";
                                    }
                                    if (key.indexOf("more") == -1) {
                                        if (fields[key] == "距离") {
                                            datas = param.tag[key] + "km";
                                        } else {
                                            datas = param.tag[key];
                                        }
                                        contentTemplate += '<li><span>' + fields[key] + '：</span><span title=' + datas + '>' + datas + '</span>';
                                    }
                                    else {
                                        contentTemplate += '<span class="aroundBtn">周边分析</span>';
                                    }
                                    contentTemplate += '</li>';

                                }
                            }
                            contentTemplate += '</ul></div>';
                        }
                    }
                    else {
                        if (param.layerid.replace('Layer', '') in PopupDetailConfig) {
                            fieldDetail = PopupDetailConfig[param.layerid.replace('Layer', '')];
                            var contentTemplate = '<div class="popup-detail-div alert_dialogStyle1 ' + fieldDetail.CLASSNAME + '">';
                            contentTemplate += '<div class="detail-title" ><a class="detail_hd_close '+param.layerid+'"></a><span title="' + param.tag.TITLENAME + '">' + param.tag.TITLENAME + '</span>';
                            // if (param.tag.distance) {
                            //     contentTemplate += '<span>' + param.tag.distance + 'km</span>';
                            // }
                            contentTemplate += '</div><ul>';
                            var fields = fieldDetail.FIELDMAP;
                            for (var key in fields) {
                                if (typeof (key) == "string") {
                                    if (!param.tag[key]) {
                                        param.tag[key] = "无";
                                    }
                                    if (key.indexOf("more") == -1) {
                                        contentTemplate += '<li><span>' + fields[key] + '：</span><span title=' + param.tag[key] + '>' + param.tag[key] + '</span>';
                                    }
                                    else {
                                        contentTemplate += '<span class="aroundBtn">周边分析</span>';
                                    }
                                    contentTemplate += '</li>';

                                }
                            }
                            contentTemplate += '</ul></div>';
                        }
                    }
                }
                var newObj = {
                    point:point,
                    contentTemplate:contentTemplate
                }
                return newObj;
            }, /**
             * 鼠标滑动显示元素名称
             * @param name
             * @private
             */
            _openPopUpMouseMove: function (geo, param, layerid, isChangeByLiShl) {
                var contentTemplate = "";
                if (isChangeByLiShl) {/*

                 $('body').append('<div class="liedutank"><svg id="tsetID"></svg><span class="closebtndk">&#10006</span></div>')
                 d3data();
                 //关闭图谱详情框
                 $('.closebtndk').click(function () {
                 $('.liedutank').remove()
                 })
                 function d3data(){
                 var marge = { top: 380, bottom: 10, left: 280, right: 10 }
                 var svg = d3.select('#tsetID')
                 var width = svg.attr('width')
                 var height = svg.attr('height')
                 var g = svg.append('g')
                 .attr('transform', 'translate(' + marge.top + ',' + marge.left + ')')

                 // 准备数据
                 // 节点集
                 var nodes = [
                 { name: '烈度等级',a:1 ,types :"circle" },  // 节点对应的显示数据
                 { name: '6级',types :"circle" ,x:150,y:-150},
                 { name: '7级',types :"circle",x:-50,y:50},
                 { name: '8级',types :"circle",x:100,y:50},
                 // { name: '9级',types :"circle",x:50,y:50},
                 {name: G.AffectedAreatotallevels[6]  +'平方公里',types :"rect",x:180,y:-20},
                 {name: G.AffectedPeopletotallevels[6] +'万人',types :"rect",x:70,y:-150},
                 {name: '乡镇'+ G.AffectedTownNum[6] +'个',types :"rect",x:180,y:-50},
                 {name: G.AffectedAreatotallevels[7]+'平方公里',types :"rect",x:-150,y:-180},
                 {name: G.AffectedPeopletotallevels[7] +'万人',types :"rect",x:-100,y:-150},
                 {name: '乡镇'+ G.AffectedTownNum[7] +'个',types :"rect",x:-130,y:110},
                 {name: G.AffectedAreatotallevels[8]+'平方公里',types :"rect",x:-50,y:100},
                 {name: G.AffectedPeopletotallevels[8] +'万人',types :"rect",x:-50,y:150},
                 {name: '乡镇'+ G.AffectedTownNum[8] +'个',types :"rect",x:150,y:50},
                 // {name: G.AffectedAreatotallevels[9]+'平方公里',types :"rect",x:-100,y:-100},
                 // {name: G.AffectedPeopletotallevels[9] +'万人',types :"rect",x:-70,y:-150},
                 // {name: '乡镇'+ G.AffectedTownNum[9] +'个',types :"rect",x:50,y:10}
                 ]
                 // 边集
                 var edges = [
                 { source: 0, target: 1, value: 2 },  //画线的 source 是开始（以nodes下标） ， target是结束（以nodes下标）,value 为 线长度
                 { source: 0, target: 2, value: 2 },
                 { source: 0, target: 3,  value: 2 },
                 // { source: 0, target: 4,  value: 2 },
                 {source: 1, target: 4,  value: 2},
                 {source: 1, target: 5,  value: 2},
                 {source: 1, target: 6,  value: 2},
                 {source: 2, target: 7,  value: 2},
                 {source: 2, target: 8,  value: 2},
                 {source: 2, target: 9,  value: 2},
                 {source: 3, target: 10,  value: 2},
                 {source: 3, target: 11,  value: 2},
                 {source: 3, target: 12,  value: 2},
                 // {source: 4, target: 14,  value: 2},
                 // {source: 4, target: 15,  value: 2},
                 // {source: 4, target: 16,  value: 2}
                 ]
                 // 设置一个颜色比例尺
                 var colorScale = d3.scaleOrdinal()
                 .domain(d3.range(nodes.length))
                 .range(d3.schemeCategory10)
                 // 新建一个力导向图
                 var forceSimulation = d3.forceSimulation()
                 .force('link', d3.forceLink())
                 .force('charge', d3.forceManyBody())
                 .force('center', d3.forceCenter())
                 // 生成节点数据
                 forceSimulation.nodes(nodes)
                 .on('tick', ticked)
                 // 生成边数据
                 forceSimulation.force('link')
                 .links(edges)
                 .distance(function (d) { // 每一边的长度
                 return d.value * 70
                 })
                 // 设置图形中心位置
                 forceSimulation.force('center')
                 .x(width-width / 2)
                 .y(height-height / 2)
                 // // 顶点集，边集
                 // 绘制边
                 var links = g.append('g')
                 .selectAll('line')
                 .data(edges)
                 .enter()
                 .append('line')
                 .attr('stroke', function (d, i) {
                 //连接线的定义
                 return '#0b98a3'
                 // return colorScale(i)
                 })
                 .attr('stroke-width',2)
                 // 边上的文字
                 var linksText = g.append('g')
                 .selectAll('text')
                 .data(edges)
                 .enter()
                 .append('text')
                 .text(function (d) {
                 return d.relation
                 })
                 // 创建分组
                 var gs = g.selectAll('.circvarext')
                 .data(nodes)
                 .enter()
                 .append('g')
                 .attr('transform', function (d) {
                 var cirX = d.x;
                 var cirY = d.y;
                 return 'translate(' + cirX + ',' + cirY + ')'
                 })
                 .call(d3.drag()
                 .on('start', started)
                 .on('drag', dragged)
                 .on('end', ended)
                 );
                 var even1 = d3.selectAll("g").filter(function(d, i) {
                 return d && d.types == 'circle'
                 });

                 var even2 = d3.selectAll("g").filter(function(d, i) {
                 return d && d.types == 'rect'
                 });


                 // 绘制节点
                 even1.append('circle')
                 .attr('r', function(d,i){
                 if(i==0) return 60
                 return 30
                 })  //修改圆的大小
                 .attr("stroke", "#0FC9E7")   // 圆形的边
                 .attr("stroke-width", function(d) { //按比例设置边的厚度
                 return 5;
                 } )
                 .attr('fill', function (d, i) {
                 //圆的颜色定义
                 //var arrr = ['#fdf','#bdf','#abd','#saf']
                 // return colorScale(i)
                 return '#015465'
                 })
                 // 文字
                 even1.append('text')
                 .attr('x', -20)
                 .attr('y', 0)
                 .attr('dy', 0)
                 .attr('style','text-align: center')
                 .attr('style','border-radius: 10px')
                 .style("fill", "#fff")
                 .text(function (d,index,nodes) {
                 return d.name
                 })
                 .on('click',function(){
                 })

                 even2.append('rect')
                 .attr('x',-30)
                 .attr('y',-0)
                 .attr('width',130)
                 .attr('height',30)
                 .attr('style','text-align: center')
                 .attr('style','border-radius: 10px')
                 .attr('style','background: url("'+webApp+'src/modules/GisPureModule/img/d3bg.png") no-repeat;background-size: 100% 100%')
                 .attr('fill','rgba(3,52,97,.8)');


                 // 文字
                 even2.append('text')
                 .attr('x', -30)
                 .attr('y', 20)
                 .attr('dy', 0)
                 .attr('style','text-align: center')
                 .attr('style','border-radius: 10px')
                 .attr('style','background: url("'+webApp+'src/modules/GisPureModule/img/d3bg.png") no-repeat;background-size: 100% 100%')
                 .style("fill", "#fff")
                 .text(function (d,index,nodes) {
                 return d.name
                 })
                 .on('click',function(){
                 })


                 // ticked
                 function ticked () {
                 links
                 .attr('x1', function (d) { return d.source.x })
                 .attr('y1', function (d) { return d.source.y })
                 .attr('x2', function (d) { return d.target.x })
                 .attr('y2', function (d) { return d.target.y })
                 linksText
                 .attr('x', function (d) { return (d.source.x + d.target.x) / 2 })
                 .attr('y', function (d) { return (d.source.y + d.target.y) / 2 })
                 gs
                 .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
                 }
                 // drag
                 function started (d) {
                 if (!d3.event.active) {
                 forceSimulation.alphaTarget(0.8).restart() // 设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0, 1]
                 }
                 d.fx = d.x
                 d.fy = d.y
                 }
                 function dragged (d) {
                 d.fx = d3.event.x
                 d.fy = d3.event.y
                 }
                 function ended (d) {
                 if (!d3.event.active) {
                 forceSimulation.alphaTarget(0)
                 }
                 d.fx = null
                 d.fy = null
                 }
                 }*/
                    contentTemplate += '<div class="earInfluence_class" style="color: white; background: rgba(0,0,0,0.6);border: 1px solid #00ffff; text-align:center;margin:0 auto;z-index: 1000" >';
                    contentTemplate += '<label style="text-align:left;padding: 5px;display: block;white-space: nowrap;line-height: 20px;min-width: 135px;">';
                    contentTemplate += '<div style="letter-spacing:2px;line-height: 30px;">' + param.Level_Tag.replace('级', '度') + '</div>';
                    contentTemplate += '<div style="letter-spacing:2px;line-height: 30px;">面积：' + G.AffectedAreatotallevels[param.Level] + 'km²</div>';
                    contentTemplate += '<div style="letter-spacing:2px;line-height: 30px;">人口：' + G.AffectedPeopletotallevels[param.Level] + '万人</div>';
                    contentTemplate += '</label></div>';
                } else {
                    // if(layerid=="villageLayer"){
                    //     //失联区域
                    //     var name = param.tag.village || "";
                    //     var district = param.tag.town || "";
                    //     var strC = name;
                    //     var poptotal = 0;
                    //     if (param && param.tag.poptotal) {
                    //         if (param.tag.poptotal != "null" && param.tag.poptotal != "undefined" && param.tag.poptotal != "") {
                    //             poptotal = parseInt(param.tag.poptotal);
                    //         }
                    //     }
                    //     contentTemplate += '<div style=" background: rgba(0,0,0,0.6);border: 1px solid #00ffff; text-align:center;margin:0 auto;z-index: 1000" >' +
                    //         '<label style="text-align:left;padding: 5px;display: block;white-space: nowrap;line-height: 20px;min-width: 135px;">';
                    //     if (poptotal > 0) {
                    //         contentTemplate += '<div>' + strC + '</div>' +
                    //             '<div>' + poptotal + '人</div>';
                    //     } else {
                    //         contentTemplate += '<div>' + strC + '</div>';
                    //     }
                    //     contentTemplate += '</label>' +
                    //         '</div>';
                    // }
                    if (layerid == "LifrLineLayer") {
                        var name = param.type || "";
                        var strC = name;
                        var poptotal;
                        var damage;
                        if (param) {
                            poptotal = parseInt(param.people);
                            damage = parseInt(param.people);
                        }
                        contentTemplate += '<div style="color:white;background: rgba(0,0,0,0.6);border: 1px solid #00ffff; text-align:center;margin:0 auto;z-index: 1000" >' +
                            '<label style="text-align:left;padding: 5px;display: block;white-space: nowrap;line-height: 20px;min-width: 135px;">';
                        if (poptotal > 0) {
                            contentTemplate += '<div>' + strC + '</div>' +
                                '<div>受影响人口:' + poptotal + '万人</div>' +
                                '<div>受损情况:' + damage + '处</div>';
                        } else {
                            contentTemplate += '<div>' + strC + '</div>';
                        }
                        contentTemplate += '</label>' +
                            '</div>';
                    } else if (layerid == "newDisLayer") {
                        var name = param.tag.name || "";
                        var strC = name;
                        var poptotal = 0;
                        if (param && param.tag.people) {
                            if (param.tag.people != "null" && param.tag.people != "undefined" && param.tag.people != "") {
                                poptotal = parseInt(param.tag.people);
                            }
                        }
                        contentTemplate += '<div style="color:white;background: rgba(0,0,0,0.6);border: 1px solid #00ffff; text-align:center;margin:0 auto;z-index: 1000" >' +
                            '<label style="text-align:left;padding: 5px;display: block;white-space: nowrap;line-height: 20px;min-width: 135px;">';
                        if (poptotal > 0) {
                            contentTemplate += '<div>' + strC + '</div>' +
                                '<div>受灾面积:' + param.tag.area + 'km²</div>' +
                                '<div>受灾人口:' + poptotal + '万人</div>';
                        } else {
                            contentTemplate += '<div>' + strC + '</div>';
                        }
                        contentTemplate += '</label>' +
                            '</div>';
                    } else if (layerid == 'districtLabelLayer') {
                        contentTemplate += '<div class="earInfluence_class" style="color: white; background: rgba(0,0,0,0.6);border: 1px solid #00ffff; text-align:center;margin:0 auto;z-index: 1000" >';
                        contentTemplate += '<label style="text-align:left;padding: 5px;display: block;white-space: nowrap;line-height: 20px;min-width: 135px;">';
                        contentTemplate += '<div>面积' + param.area + 'km²</div>';
                        contentTemplate += '<div>距离' + param.distance + 'km</div>';
                        contentTemplate += '<div>人口' + param.countyPopNum + '万人</div>';
                        contentTemplate += '<div>乡镇个数' + param.townNum + '</div>';
                        contentTemplate += '</label></div>';
                    } else {
                        var name = param.tag.downtow || "";
                        var district = param.tag.district || "";
                        var strC = name;
                        var poptotal = 0;
                        if (param && param.tag.poptotal) {
                            if (param.tag.poptotal != "null" && param.tag.poptotal != "undefined" && param.tag.poptotal != "") {
                                poptotal = parseInt(param.tag.poptotal);
                            }
                        }
                        contentTemplate += '<div style=" background: rgba(0,0,0,0.6);border: 1px solid #00ffff; text-align:center;margin:0 auto;z-index: 1000" >' +
                            '<label style="text-align:left;padding: 5px;display: block;white-space: nowrap;line-height: 20px;min-width: 135px;color:white">';
                        if (poptotal > 0) {
                            contentTemplate += '<div>' + strC + '</div>' +
                                '<div>' + poptotal + '人</div>';
                        } else {
                            contentTemplate += '<div>' + strC + '</div>';
                        }
                        contentTemplate += '</label>' +
                            '</div>';
                    }
                }
                var offset = [53, -5];
                if (param.offset) {
                    offset = param.offset;
                }
                this._addPopupDetaills(geo, contentTemplate, offset, layerid);
            }
        })
        return component;
    });