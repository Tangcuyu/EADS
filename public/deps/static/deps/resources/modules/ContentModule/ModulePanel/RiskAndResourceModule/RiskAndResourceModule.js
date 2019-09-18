/**
 * @title:救援进展
 */
'use strict';
require.config({
    paths: {
        "RiskAndResource":webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/js/RiskAndResource',
        "RiskSourceService": webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/service/RiskSourceService',
        "EmerSourceService": webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/service/EmerSourceService',
        "BaseDataService": webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/service/BaseDataService',
        "DetailInfoServices": webApp + 'src/modules/GisPureModule/js/DetailInfoServices',
        "DangerEnterpriseDetail":webApp + 'src/modules/GisPureModule/js/DangerEnterpriseDetail',
        "CoalEnterpriseDetail":webApp + 'src/modules/GisPureModule/js/CoalEnterpriseDetail',
        "FireworkEnterpriseDetail":webApp + 'src/modules/GisPureModule/js/FireworkEnterpriseDetail',
        "IndustryEnterpriseDetail":webApp + 'src/modules/GisPureModule/js/IndustryEnterpriseDetail',
        "GeologDisaterDetail":webApp + 'src/modules/GisPureModule/js/GeologDisaterDetail',
        "TailingPondDetail":webApp + 'src/modules/GisPureModule/js/TailingPondDetail',
        "RepersityDetail":webApp + 'src/modules/GisPureModule/js/RepersityDetail',
        "WarbaseDetail":webApp + 'src/modules/GisPureModule/js/WarbaseDetail',
        "FireTeamDetail":webApp + 'src/modules/GisPureModule/js/FireTeamDetail',
        "RescueTeamDetail":webApp + 'src/modules/GisPureModule/js/RescueTeamDetail',
        "ExpertInfoDetail":webApp + 'src/modules/GisPureModule/js/ExpertInfoDetail',
        "ShelterInfoDetail":webApp + 'src/modules/GisPureModule/js/ShelterInfoDetail',
        "DangerInfoDetail":webApp + 'src/modules/GisPureModule/js/DangerInfoDetail',
        "BaseDataDetail":webApp + 'src/modules/GisPureModule/js/BaseDataDetail',
        "MapMarkerDisplay": webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/js/MapMarkerDisplay',
        "provinceDistrictDataRes": webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/data/provinceData',
        "enterpriseCrisis": webApp + 'src/modules/GisPureModule/popdialog/js/enterpriseCrisis',//工矿企业的危化品
        "coalenterprise": webApp + 'src/modules/GisPureModule/popdialog/js/coalenterprise',//煤炭企业的危化品
        "fireworksCompany": webApp + 'src/modules/GisPureModule/popdialog/js/fireworksCompany',//工矿企业的烟花爆竹
        "industrialEnterpriseView": webApp + 'src/modules/GisPureModule/popdialog/js/industrialEnterpriseView',//工矿企业的工贸企业
    },
    shim: {
        RiskAndResource:{
            deps: [
                'css!' + webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/css/RiskAndResource.css'
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
define(["provinceDistrictDataRes","RiskSourceService","EmerSourceService","BaseDataService","DetailInfoServices","RiskAndResource","MapMarkerDisplay","RepersityDetail","WarbaseDetail","FireTeamDetail"
    ,"RescueTeamDetail","ExpertInfoDetail","ShelterInfoDetail","DangerInfoDetail","DangerEnterpriseDetail","CoalEnterpriseDetail","FireworkEnterpriseDetail","IndustryEnterpriseDetail","GeologDisaterDetail","TailingPondDetail","BaseDataDetail","enterpriseCrisis","coalenterprise","fireworksCompany","industrialEnterpriseView"],
    function(provinceDistrictDataRes,RiskSourceService,EmerSourceService,BaseDataService,DetailInfoServices,RiskAndResource,MapMarkerDisplay,RepersityDetail,WarbaseDetail,FireTeamDetail
    ,RescueTeamDetail,ExpertInfoDetail,ShelterInfoDetail,DangerInfoDetail,DangerEnterpriseDetail,CoalEnterpriseDetail,FireworkEnterpriseDetail,IndustryEnterpriseDetail,GeologDisaterDetail,TailingPondDetail,BaseDataDetail,enterpriseCrisis,coalenterprise,fireworksCompany,industrialEnterpriseView) {
    var module = G.base.ModuleBase;
    var RiskAndResourceModule = module.extend({
        options: {
            /**
             * 控件名称，必须与类名一致
             */
            name: 'RiskAndResourceModule',
            /**
             * 默认配置文件名
             */
            config: false,
            msg: '风险隐患与应急资源'
        },
        includes: G.base.ContainerManager.prototype,
        /***
         * @constructor
         * @param options
         */
        initialize: function(options) {
            //基类初始化
            module.prototype.initialize.call(this, options);
            this.riskService = new RiskSourceService(
                {
                    serverUrl: EMAP_CONFIG.common.mongoService,
                    configUrl: webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/data/nearby.json'
                });
            this.emerService = new EmerSourceService(
                {
                    serverUrl: EMAP_CONFIG.common.mongoService,
                    configUrl: webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/data/nearby.json'
                });
            this.basedataservice = new BaseDataService(
                {
                    serverUrl: EMAP_CONFIG.common.mongoService,
                    configUrl: webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/data/nearby.json'
                });
            this.DetailInfoServices = new DetailInfoServices(
                {
                    serverUrl: EMAP_CONFIG.common.mongoService
                });
        },
        /**
         * 打开
         * @method
         *
         * */
        onOpen: function(container,title) {
            var self=this;
                RiskAndResource.initDomFun(container,title);
                RiskAndResource.initia();
                MapMarkerDisplay.initia();
                self.emerService.getStatistics(function (err, data) {
                    if(data.list.length>0){
                        RiskAndResource.initResource(data.list);
                    }
                });
                self.riskService.getStatistics(function (err, data) {
                    if(data.list.length>0){
                        RiskAndResource.initTrouble(data.list);
                    }
                });
                self.basedataservice.getStatistics(function (err, data) {
                    if(data.list.length>0){
                        RiskAndResource.baseData(data.list);
                    }
                });
            G.options.map.on("click", function (event) {
                self.mapClickListener(event);
            },self);
        },
        /**
         * 关闭
         * @method
         *
         * */
        onClose: function() {
            module.prototype.onClose.call(this);
            G.options.map.off('click', this.mapClickListener, this);
            if ($("#riskListPanel")) {
                $("#riskListPanel").remove();
            }
            if($('.act-titleActive').find('span')[0]&&$('.act-titleActive').find('span')[0].className.split(' ')[2])
            {
                $('.act-titleActive').find('span').removeClass($('.act-titleActive').find('span')[0].className.split(' ')[2]);
            }
            $('.act-titleActive').removeClass('act-titleActive');
            // $(".yujing_active").removeClass("yujing_active")
            // $(".hotspot_early_warning_infor_popu").hide()
            $("#resourceTrouble_box").empty();
            G.options.toolTipWare.clear();
            MapMarkerDisplay.clearLayerinfo();
        },
        /**
         * 销毁
         * @method
         *
         * */
        destroy: function() {
            //
            module.prototype.destroy.call(this);
        }
    });

    /**
     * 对外接口
     */
    RiskAndResourceModule.include({
        /**
         * 地图监听
         * @method
         * */
        //todo RiskAndResourceModule 地图监听
        mapClickListener: function (event) {
            var layers = G.options.map.layers;
            var layersnum = layers.length;
            for (var i = 0; i < layersnum; i++) {
                var layer = layers[i];
                if (layer.id.indexOf('RescueTeam※03') > -1) {//救援队伍
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        var code = ele.feature.code;
                        if(code=="T003"){
                            var callBack = function (data) {
                                var point = new g2.geom.Point({
                                        x: parseFloat(data.result.tag.LONGITUDE),
                                        y: parseFloat(data.result.tag.LATITUDE),
                                        spatialReference: G.options.map.spatialReference
                                    }
                                );
                                data.result.point = point;
                                FireTeamDetail.showDetailPanel(data.result);
                                G.options.commonGIS._blinkHighlight("RescueTeam※03", point.x,point.y, true);
                            }
                            this.DetailInfoServices.getFireTeamDetail(id, callBack, this);
                        }else{
                            var callBack = function(data){
                                var point=new g2.geom.Point({
                                        x: parseFloat(data.result.tag.LONGITUDE),
                                        y: parseFloat(data.result.tag.LATITUDE),
                                        spatialReference: G.options.map.spatialReference
                                    }
                                );
                                data.result.point=point;
                                RescueTeamDetail.showDetailPanel(data.result);
                                if(data.result.tag.ISHAVAIRPORT=="1"){
                                    G.options.commonGIS._blinkHighlight("RescueTeam※03PORT", point.x,point.y, true);
                                }else{
                                    G.options.commonGIS._blinkHighlight("RescueTeam※03", point.x,point.y, true);
                                }

                            };
                            this.DetailInfoServices.getRescueTeamDetail(id,callBack,this);
                        }

                    }
                };
                if (layer.id.indexOf('Expert※01') > -1) {//专家
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        var callBack = function (data) {
                            var point = new g2.geom.Point({
                                    x: parseFloat(data.result.tag.LONGITUDE),
                                    y: parseFloat(data.result.tag.LATITUDE),
                                    spatialReference: G.options.map.spatialReference
                                }
                            );
                            data.result.point = point;
                            ExpertInfoDetail.showDetailPanel(data.result);
                            G.options.commonGIS._blinkHighlight("Expert※01", point.x,point.y, true);
                        }
                        this.DetailInfoServices.getExpertDataDetail(id, callBack, this);
                    }
                };
                if (layer.id.indexOf('Shelter※01') > -1) {//避难场所
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        var callBack = function (data) {
                            var point = new g2.geom.Point({
                                    x: parseFloat(data.result.geom.coordinates[0]),
                                    y: parseFloat(data.result.geom.coordinates[1]),
                                    spatialReference: G.options.map.spatialReference
                                }
                            );
                            data.result.point = point;
                            ShelterInfoDetail.showDetailPanel(data.result);
                            G.options.commonGIS._blinkHighlight("Shelter※01", point.x,point.y, true);
                        }
                        this.DetailInfoServices.getShelterDataDetail(id, callBack, this);
                    }
                };
                if (layer.id.indexOf('School※01') > -1) {//避难场所
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        this.DetailInfoServices.getBaseDataDetail(id,'BAS_SCHOOL', function (err, resultData) {
                            if (resultData && resultData.length > 0) {
                                var point={};
                                point.x=resultData[0].geom.coordinates[0];
                                point.y=resultData[0].geom.coordinates[1];
                                resultData[0].point=point;
                                G.options.map.setCenter(point)
                                setTimeout(function () {
                                    BaseDataDetail.showDetailPanel(resultData[0],'SCHOOLNAME');
                                },10)
                                G.options.commonGIS._blinkHighlight("School※01Layer", point.x,point.y, true);
                            }
                        });
                    }
                };
                if (layer.id.indexOf('Hospital※01') > -1) {//避难场所
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        this.DetailInfoServices.getBaseDataDetail(id,'BAS_HEALTHORG', function (err, resultData) {
                            if (resultData && resultData.length > 0) {
                                var point={};
                                point.x=resultData[0].geom.coordinates[0];
                                point.y=resultData[0].geom.coordinates[1];
                                resultData[0].point=point;
                                G.options.map.setCenter(point)
                                setTimeout(function () {
                                    BaseDataDetail.showDetailPanel(resultData[0],'ORGNAME');
                                },10)
                                G.options.commonGIS._blinkHighlight("Hospital※01Layer", point.x,point.y, true);
                            }
                        });
                    }
                };
                if (layer.id.indexOf('Airport※01') > -1) {//避难场所
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        this.DetailInfoServices.getBaseDataDetail(id,'BAS_AIRPORT', function (err, resultData) {
                            if (resultData && resultData.length > 0) {
                                var point={};
                                point.x=resultData[0].geom.coordinates[0];
                                point.y=resultData[0].geom.coordinates[1];
                                resultData[0].point=point;
                                G.options.map.setCenter(point)
                                setTimeout(function () {
                                    BaseDataDetail.showDetailPanel(resultData[0],'AIRPORTNAME');
                                },10)
                                G.options.commonGIS._blinkHighlight("Airport※01Layer", point.x,point.y, true);
                            }
                        });
                    }
                };
                if (layer.id.indexOf('Station※01') > -1) {//避难场所
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        this.DetailInfoServices.getBaseDataDetail(id,'BAS_RAILWAYSTATION', function (err, resultData) {
                            if (resultData && resultData.length > 0) {
                                var point={};
                                point.x=resultData[0].geom.coordinates[0];
                                point.y=resultData[0].geom.coordinates[1];
                                resultData[0].point=point;
                                G.options.map.setCenter(point)
                                setTimeout(function () {
                                    BaseDataDetail.showDetailPanel(resultData[0],'STATIONNAME');
                                },10)
                                G.options.commonGIS._blinkHighlight("Station※01Layer", point.x,point.y, true);
                            }
                        });
                    }
                };
                if (layer.id.indexOf('Resrrvoir※01') > -1) {//避难场所
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        this.DetailInfoServices.getBaseDataDetail(id,'BAS_RESERVOIR', function (err, resultData) {
                            if (resultData && resultData.length > 0) {
                                var point={};
                                point.x=resultData[0].geom.coordinates[0];
                                point.y=resultData[0].geom.coordinates[1];
                                resultData[0].point=point;
                                G.options.map.setCenter(point)
                                setTimeout(function () {
                                    BaseDataDetail.showDetailPanel(resultData[0],'NAME');
                                },10)
                                G.options.commonGIS._blinkHighlight("Resrrvoir※01Layer", point.x,point.y, true);
                            }
                        });
                    }
                };
                if (layer.id.indexOf('Nuclearinfo※01') > -1) {//避难场所
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        this.DetailInfoServices.getBaseDataDetail(id,'BAS_NUCLEARINFO', function (err, resultData) {
                            if (resultData && resultData.length > 0) {
                                var point={};
                                point.x=resultData[0].geom.coordinates[0];
                                point.y=resultData[0].geom.coordinates[1];
                                resultData[0].point=point;
                                G.options.map.setCenter(point)
                                setTimeout(function () {
                                    BaseDataDetail.showDetailPanel(resultData[0],'NUCLEARNAME');
                                },10)
                                G.options.commonGIS._blinkHighlight("Nuclearinfo※01Layer", point.x,point.y, true);
                            }
                        });
                    }
                };
                if (layer.id.indexOf('Portwharf※01') > -1) {//避难场所
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        this.DetailInfoServices.getBaseDataDetail(id,'BAS_PORTWHARF', function (err, resultData) {
                            if (resultData && resultData.length > 0) {
                                var point={};
                                point.x=resultData[0].geom.coordinates[0];
                                point.y=resultData[0].geom.coordinates[1];
                                resultData[0].point=point;
                                G.options.map.setCenter(point)
                                setTimeout(function () {
                                    BaseDataDetail.showDetailPanel(resultData[0],'PORTWHARFNAME');
                                },10)
                                G.options.commonGIS._blinkHighlight("Portwharf※01Layer", point.x,point.y, true);
                            }
                        });
                    }
                };
                if (layer.id.indexOf('ANJIAN_DANGER※01') > -1) {//重大危险源
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        var callBack = function (error,data) {
                            var point = new g2.geom.Point({
                                    x: parseFloat(data[0].geom.coordinates[0]),
                                    y: parseFloat(data[0].geom.coordinates[1]),
                                    spatialReference: G.options.map.spatialReference
                                }
                            );
                            data[0].point = point;
                            DangerInfoDetail.showDetailPanel(data[0]);////adadas
                            G.options.commonGIS._blinkHighlight("ANJIAN_DANGER※01", point.x,point.y, true);
                        }
                        this.DetailInfoServices.getDangerDetail(id, callBack, this);
                    }
                };
                if (layer.id.indexOf('ANJIAN_REPERTORY※01') > -1) {//物资储备库
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        var callBack = function (data) {
                            var point = new g2.geom.Point({
                                    x: parseFloat(data.result.tag.LONGITUDE),
                                    y: parseFloat(data.result.tag.LATITUDE),
                                    spatialReference: G.options.map.spatialReference
                                }
                            );
                            data.result.point = point;
                            RepersityDetail.showDetailPanel(data.result);
                            G.options.commonGIS._blinkHighlight("ANJIAN_REPERTORY※01", point.x,point.y, true);
                        }
                        this.DetailInfoServices.getReposityDetail(id, callBack, this);
                    }
                };
                if (layer.id.indexOf('JC_WARBASE※01') > -1) {//战保基地
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        var callBack = function (data) {
                            var point = new g2.geom.Point({
                                    x: parseFloat(data.result.longitude),
                                    y: parseFloat(data.result.latitude),
                                    spatialReference: G.options.map.spatialReference
                                }
                            );
                            data.result.point = point;
                            WarbaseDetail.showDetailPanel(data.result);
                            G.options.commonGIS._blinkHighlight("JC_WARBASE※01", point.x,point.y, true);
                        }
                        this.DetailInfoServices.getWarBaseDetail(id, callBack, this);
                    }
                };
                if (layer.id.indexOf('BAS_GEOLOGICHAZARD※01') > -1) {//地质灾害隐患点
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        this.DetailInfoServices.getGEODISASTERDetail(id, function (err, resultData) {
                            if (resultData && resultData.length > 0) {
                                var point={};
                                point.x=resultData[0].geom.coordinates[0];
                                point.y=resultData[0].geom.coordinates[1];
                                resultData[0].point=point;
                                GeologDisaterDetail.showPanel(resultData[0]);
                                G.options.commonGIS._blinkHighlight("BAS_GEOLOGICHAZARD※01", point.x,point.y, true);
                            }
                        });
                    }
                };
                if (layer.id.indexOf('ANJIAN_DAGCHEMENT※DangerousChemical') > -1) {//危化品企业
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        // this.DetailInfoServices.getDangerQYDetail(id, function (err, resultData) {
                        //     if (resultData && resultData.length > 0) {
                        //         var point = {};
                        //         point.x = resultData[0].geom.coordinates[0];
                        //         point.y = resultData[0].geom.coordinates[1];
                        //         resultData[0].point = point;
                        //         DangerEnterpriseDetail.showPanel(resultData[0]);
                        //         G.options.commonGIS._blinkHighlight("ANJIAN_DAGCHEMENT※DangerousChemical", point.x,point.y, true);
                        //     }
                        // });


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



                    };
                };
                if (layer.id.indexOf('BAS_COALMINE※01') > -1) {//煤矿企业
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        // this.DetailInfoServices.getMKQYDetail(id, function (err, resultData) {
                        //     if (resultData && resultData.length > 0) {
                        //         var point = {};
                        //         point.x = resultData[0].geom.coordinates[0];
                        //         point.y = resultData[0].geom.coordinates[1];
                        //         resultData[0].point = point;
                        //         CoalEnterpriseDetail.showPanel(resultData[0]);
                        //         G.options.commonGIS._blinkHighlight("BAS_COALMINE※01", point.x,point.y, true);
                        //     }
                        // });

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


                    }
                };
                if (layer.id.indexOf('ANJIAN_TAILINGPOND※01') > -1) {//尾矿库企业
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        this.DetailInfoServices.getFMKQYDetail(id, function (err, resultData) {
                            if (resultData && resultData.length > 0) {
                                var point = {};
                                point.x = resultData[0].geom.coordinates[0];
                                point.y = resultData[0].geom.coordinates[1];
                                resultData[0].point = point;
                                TailingPondDetail.showPanel(resultData[0]);
                                G.options.commonGIS._blinkHighlight("ANJIAN_TAILINGPOND※01", point.x,point.y, true);
                            }
                        });


                    }
                };
                if (layer.id.indexOf('ANJIAN_ENT_WHSMYHBZ※01') > -1) {//工贸企业
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        /*this.DetailInfoServices.getGMQYDetail(id, function (err, resultData) {
                            if (resultData && resultData.length > 0) {
                                var point = {};
                                point.x = resultData[0].geom.coordinates[0];
                                point.y = resultData[0].geom.coordinates[1];
                                resultData[0].point = point;
                                IndustryEnterpriseDetail.showPanel(resultData[0]);
                                G.options.commonGIS._blinkHighlight("ANJIAN_ENT_WHSMYHBZ※01", point.x,point.y, true);
                            }
                        });*/


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
                    }
                };
                if (layer.id.indexOf('ANJIAN_FIREWORKENT※1') > -1) {//烟花爆竹企业
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        var id = ele.feature.id;
                        /*this.DetailInfoServices.getYHBZQYDetail(id, function (err, resultData) {
                            if (resultData && resultData.length > 0) {
                                var point = {};
                                point.x = resultData[0].geom.coordinates[0];
                                point.y = resultData[0].geom.coordinates[1];
                                resultData[0].point = point;
                                FireworkEnterpriseDetail.showPanel(resultData[0]);
                                G.options.commonGIS._blinkHighlight("ANJIAN_FIREWORKENT※1", point.x,point.y, true);
                            }
                        });*/


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
                    }
                };
                if (layer.id.indexOf('provinceDistrictDataLayer') > -1) {//统计图层
                    var ele = layer.hitTest(event.screenX, event.screenY);
                    if (!!ele) {
                        //G.options.map.map.getView().animate({center:[ele.element.geometry.x,ele.element.geometry.y],duration:600},{zoom:8,duration:800});
                        G.options.map.pan(ele.element.geometry);
                        G.options.map.zoomTo(8);
                    }
                };
            }
        }
    });
    return RiskAndResourceModule;
});