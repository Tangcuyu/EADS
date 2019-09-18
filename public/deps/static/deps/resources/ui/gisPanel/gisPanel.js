/**
 * Created by zhj on 2017/6/17.
 */
require.config({
    paths: {
        RiskAndResource:webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/js/RiskAndResource',
        BaseDataService:webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/service/BaseDataService',
        EmerSourceService:webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/service/EmerSourceService',
        RiskSourceService:webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/service/RiskSourceService',
        DetailInfoServices: webApp + 'src/modules/GisPureModule/js/DetailInfoServices',
    },
    shim: {
    }
});
define(['jquery', 'gisDrag', 'gisResize','RiskAndResource','simpleTable','IndustryEnterpriseDetail','DangerEnterpriseDetail','CoalEnterpriseDetail',"FireworkEnterpriseDetail","IndustryEnterpriseDetail","GeologDisaterDetail","RepersityDetail","WarbaseDetail","FireTeamDetail","RescueTeamDetail","ExpertInfoDetail","ShelterInfoDetail","DangerInfoDetail","TailingPondDetail","BaseDataDetail",'BaseDataService','EmerSourceService','RiskSourceService','DetailInfoServices'], function ($, gisDrag, gisResize,RiskAndResource,SimpleTable,IndustryEnterpriseDetail,DangerEnterpriseDetail,CoalEnterpriseDetail,FireworkEnterpriseDetail,IndustryEnterpriseDetail,GeologDisaterDetail,RepersityDetail,WarbaseDetail,FireTeamDetail,RescueTeamDetail,ExpertInfoDetail,ShelterInfoDetail,DangerInfoDetail,TailingPondDetail,BaseDataDetail,BaseDataService,EmerSourceService,RiskSourceService,DetailInfoServices) {
    var tableDadaArr = '';
    function tabledata(tableData,code) {
        this.emerDetailService = new DetailInfoServices(
            {
                serverUrl: EMAP_CONFIG.common.mongoService
            });


        var opts = {};
        opts.containerId = 'riskTablePanel';
        opts.isPaging = true;//是否分页
        opts.pageSize = 5;//每页数目
        opts.showTotal = false;
        opts.totalData=tableData;
        opts.total = tableData.length;//总数
        opts.fields =tableDadaArr[code];
        opts.pageChangeCallback = function (pageIndex, pageSize, cb) {
            var list = [];
            for (var i = pageIndex * pageSize; i < (pageIndex + 1) * pageSize; i++) {
                if (!!tableData[i]) {
                    var item = {};
                    item._id = tableData[i]._id;
                    item.NAME = tableData[i].NAME;
                    item.ADDRESS = tableData[i].ADDRESS;
                    item.dis = tableData[i].dis;
                    item.geom = tableData[i].geom;
                    item.codeKey = tableData[i].codeKey;
                    //处理距离值
                    item.dis = parseFloat(tableData[i].dis / 1000).toFixed(2);
                    list.push(item);
                }
            }
            cb(list);
        };
        opts.rowClickCallback = function (data) {
            if (code == "other") {
                code = data.codeKey;
            }
            if(!G.options.map.getLayerById(code+"Layer"))
            {
                return;
            }
            if (code.indexOf('ANJIAN_DAGCHEMENT') == 0) {
                this.emerDetailService.getDangerQYDetail(data._id, function (err, resultData) {
                    if (resultData && resultData.length > 0) {
                        var point={};
                        point.x=resultData[0].geom.coordinates[0];
                        point.y=resultData[0].geom.coordinates[1];
                        resultData[0].point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        // G.options.map.setCenter(point)
                        setTimeout(function () {
                            DangerEnterpriseDetail.showPanel(resultData[0]);
                        },10)
                        G.options.commonGIS._blinkHighlight("ANJIAN_DAGCHEMENT※DangerousChemicalLayer", point.x,point.y, true);
                    }
                });
            }else if(code.indexOf('ANJIAN_ENT_WHSMYHBZ') == 0){
                this.emerDetailService.getGMQYDetail(data._id, function (err, resultData) {
                    if (resultData && resultData.length > 0) {
                        var point={};
                        point.x=resultData[0].geom.coordinates[0];
                        point.y=resultData[0].geom.coordinates[1];
                        resultData[0].point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            IndustryEnterpriseDetail.showPanel(resultData[0]);
                        },10)
                        G.options.commonGIS._blinkHighlight("ANJIAN_ENT_WHSMYHBZ※01Layer", point.x,point.y, true);
                    }
                });
            }else if(code.indexOf('BAS_COALMINE') == 0){
                this.emerDetailService.getMKQYDetail(data._id, function (err, resultData) {
                    if (resultData && resultData.length > 0) {
                        var point={};
                        point.x=resultData[0].geom.coordinates[0];
                        point.y=resultData[0].geom.coordinates[1];
                        resultData[0].point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            CoalEnterpriseDetail.showPanel(resultData[0]);
                        },10)
                        G.options.commonGIS._blinkHighlight("BAS_COALMINE※01Layer", point.x,point.y, true);
                    }
                });
            }
            else if(code.indexOf('ANJIAN_TAILINGPOND') == 0){
                this.emerDetailService.getFMKQYDetail(data._id, function (err, resultData) {
                    if (resultData && resultData.length > 0) {
                        var point={};
                        //由于非煤矿山没有经纬度，因此暂时先写死
                        point.x=resultData[0].geom.coordinates[0];
                        point.y=resultData[0].geom.coordinates[1];
                        resultData[0].point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            TailingPondDetail.showPanel(resultData[0]);
                        },10)
                        G.options.commonGIS._blinkHighlight("ANJIAN_TAILINGPOND※01Layer", point.x,point.y, true);
                    }
                });
            }
            else if(code.indexOf('BAS_GEOLOGICHAZARD') == 0){
                this.emerDetailService.getGEODISASTERDetail(data._id, function (err, resultData) {
                    if (resultData && resultData.length > 0) {
                        var point={};
                        point.x=resultData[0].geom.coordinates[0];
                        point.y=resultData[0].geom.coordinates[1];
                        resultData[0].point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            GeologDisaterDetail.showPanel(resultData[0]);
                        },10)
                        GeologDisaterDetail.showPanel(resultData[0]);
                        G.options.commonGIS._blinkHighlight("BAS_GEOLOGICHAZARD※01Layer", point.x,point.y, true);
                    }
                });
            }
            else if(code.indexOf('ANJIAN_FIREWORKENT') == 0){
                this.emerDetailService.getYHBZQYDetail(data._id, function (err, resultData) {
                    if (resultData && resultData.length > 0) {
                        var point={};
                        point.x=resultData[0].geom.coordinates[0];
                        point.y=resultData[0].geom.coordinates[1];
                        resultData[0].point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            FireworkEnterpriseDetail.showPanel(resultData[0]);
                        },10)
                        G.options.commonGIS._blinkHighlight("ANJIAN_FIREWORKENT※1Layer", point.x,point.y, true);
                    }
                });
            }
            else if(code.indexOf('ANJIAN_DANGER') == 0){
                this.emerDetailService.getDangerDetail(data._id, function (err, resultData) {
                    if (resultData && resultData.length > 0) {
                        var point={};
                        point.x=resultData[0].geom.coordinates[0];
                        point.y=resultData[0].geom.coordinates[1];
                        resultData[0].point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            DangerInfoDetail.showDetailPanel(resultData[0]);
                        },10)
                        G.options.commonGIS._blinkHighlight("ANJIAN_DANGER※01Layer", point.x,point.y, true);
                    }
                });
            } else if(code.indexOf('School') == 0){
                this.emerDetailService.getBaseDataDetail(data._id,'BAS_SCHOOL', function (err, resultData) {
                    if (resultData && resultData.length > 0) {
                        var point={};
                        point.x=resultData[0].geom.coordinates[0];
                        point.y=resultData[0].geom.coordinates[1];
                        resultData[0].point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            BaseDataDetail.showDetailPanel(resultData[0],'SCHOOLNAME');
                        },10)
                        G.options.commonGIS._blinkHighlight("School※01Layer", point.x,point.y, true);
                    }
                });
            }
            else if(code.indexOf('Airport') == 0){
                this.emerDetailService.getBaseDataDetail(data._id,'BAS_AIRPORT', function (err, resultData) {
                    if (resultData && resultData.length > 0) {
                        var point={};
                        point.x=resultData[0].geom.coordinates[0];
                        point.y=resultData[0].geom.coordinates[1];
                        resultData[0].point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            BaseDataDetail.showDetailPanel(resultData[0],'AIRPORTNAME');
                        },10)
                        G.options.commonGIS._blinkHighlight("Airport※01Layer", point.x,point.y, true);
                    }
                });
            }
            else if(code.indexOf('Station') == 0){
                this.emerDetailService.getBaseDataDetail(data._id,'BAS_RAILWAYSTATION', function (err, resultData) {
                    if (resultData && resultData.length > 0) {
                        var point={};
                        point.x=resultData[0].geom.coordinates[0];
                        point.y=resultData[0].geom.coordinates[1];
                        resultData[0].point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            BaseDataDetail.showDetailPanel(resultData[0],'STATIONNAME');
                        },10)
                        G.options.commonGIS._blinkHighlight("Station※01Layer", point.x,point.y, true);
                    }
                });
            }
            else if(code.indexOf('Resrrvoir') == 0){
                this.emerDetailService.getBaseDataDetail(data._id,'BAS_RESERVOIR', function (err, resultData) {
                    if (resultData && resultData.length > 0) {
                        var point={};
                        point.x=resultData[0].geom.coordinates[0];
                        point.y=resultData[0].geom.coordinates[1];
                        resultData[0].point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            BaseDataDetail.showDetailPanel(resultData[0],'NAME');
                        },10)
                        G.options.commonGIS._blinkHighlight("Resrrvoir※01Layer", point.x,point.y, true);
                    }
                });
            }
            else if(code.indexOf('Nuclearinfo') == 0){
                this.emerDetailService.getBaseDataDetail(data._id,'BAS_NUCLEARINFO', function (err, resultData) {
                    if (resultData && resultData.length > 0) {
                        var point={};
                        point.x=resultData[0].geom.coordinates[0];
                        point.y=resultData[0].geom.coordinates[1];
                        resultData[0].point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            BaseDataDetail.showDetailPanel(resultData[0],'NUCLEARNAME');
                        },10)
                        G.options.commonGIS._blinkHighlight("Nuclearinfo※01Layer", point.x,point.y, true);
                    }
                });
            }
            else if(code.indexOf('Portwharf') == 0){
                this.emerDetailService.getBaseDataDetail(data._id,'BAS_PORTWHARF', function (err, resultData) {
                    if (resultData && resultData.length > 0) {
                        var point={};
                        point.x=resultData[0].geom.coordinates[0];
                        point.y=resultData[0].geom.coordinates[1];
                        resultData[0].point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            BaseDataDetail.showDetailPanel(resultData[0],'PORTWHARFNAME');
                        },10)
                        G.options.commonGIS._blinkHighlight("Portwharf※01Layer", point.x,point.y, true);
                    }
                });
            }
            else if(code.indexOf('Hospital') == 0){
                this.emerDetailService.getBaseDataDetail(data._id,'BAS_HEALTHORG', function (err, resultData) {
                    if (resultData && resultData.length > 0) {
                        var point={};
                        point.x=resultData[0].geom.coordinates[0];
                        point.y=resultData[0].geom.coordinates[1];
                        resultData[0].point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            BaseDataDetail.showDetailPanel(resultData[0],'ORGNAME');
                        },10)
                        G.options.commonGIS._blinkHighlight("Hospital※01Layer", point.x,point.y, true);
                    }
                });
            }
            else if(code.indexOf('RescueTeam') == 0) {
                if (G.options.map.getLayerById("RescueTeam※03Layer")) {
                    var id=data._id;
                    if(data.RESCUECODE=="T003"){
                        var callBack = function(dataRes){
                            var point=new g2.geom.Point({
                                    x: parseFloat(dataRes.result.tag.LONGITUDE),
                                    y: parseFloat(dataRes.result.tag.LATITUDE),
                                    spatialReference: G.options.map.spatialReference
                                }
                            );
                            dataRes.result.point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                            setTimeout(function () {
                                FireTeamDetail.showDetailPanel(dataRes.result);
                            },10)
                            G.options.commonGIS._blinkHighlight("RescueTeam※03Layer", dataRes.result.tag.LONGITUDE, dataRes.result.tag.LATITUDE, true);
                        }
                        this.emerDetailService.getFireTeamDetail(id,callBack,this);
                    }else{
                        var callBack = function(dataRes){
                            var point=new g2.geom.Point({
                                    x: parseFloat(dataRes.result.tag.LONGITUDE),
                                    y: parseFloat(dataRes.result.tag.LATITUDE),
                                    spatialReference: G.options.map.spatialReference
                                }
                            );
                            dataRes.result.point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                            setTimeout(function () {
                                RescueTeamDetail.showDetailPanel(dataRes.result);
                            },10)
                            if(dataRes.result.tag.ISHAVAIRPORT=="1"){
                                G.options.commonGIS._blinkHighlight("RescueTeam※03PORTLayer", dataRes.result.tag.LONGITUDE, dataRes.result.tag.LATITUDE, true);
                            }else{
                                G.options.commonGIS._blinkHighlight("RescueTeam※03Layer", dataRes.result.tag.LONGITUDE, dataRes.result.tag.LATITUDE, true);
                            }
                        }
                        this.emerDetailService.getRescueTeamDetail(id,callBack,this);
                    }

                }
            }else if(code.indexOf('Expert') == 0){
                if (G.options.map.getLayerById("Expert※01Layer")) {
                    var id=data._id;
                    var callBack = function(dataRes){
                        var point=new g2.geom.Point({
                                x: parseFloat(dataRes.result.tag.LONGITUDE),
                                y: parseFloat(dataRes.result.tag.LATITUDE),
                                spatialReference: G.options.map.spatialReference
                            }
                        );
                        dataRes.result.point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            ExpertInfoDetail.showDetailPanel(dataRes.result);
                        },10)
                        G.options.commonGIS._blinkHighlight("Expert※01Layer", dataRes.result.tag.LONGITUDE, dataRes.result.tag.LATITUDE, true);
                    }
                    this.emerDetailService.getExpertDataDetail(id,callBack,this);
                }
            }
            else if(code.indexOf('Shelter') == 0){
                if (G.options.map.getLayerById("Shelter※01Layer")) {
                    var id=data._id;
                    var callBack = function(dataRes){
                        var point=new g2.geom.Point({
                                x: parseFloat(dataRes.result.tag.LONGITUDE),
                                y: parseFloat(dataRes.result.tag.LATITUDE),
                                spatialReference: G.options.map.spatialReference
                            }
                        );
                        dataRes.result.point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            ShelterInfoDetail.showDetailPanel(dataRes.result);
                        },10)
                        G.options.commonGIS._blinkHighlight("Shelter※01Layer", dataRes.result.tag.LONGITUDE, dataRes.result.tag.LATITUDE, true);
                    }
                    this.emerDetailService.getShelterDataDetail(id,callBack,this);
                }
            }else if(code.indexOf('ANJIAN_REPERTORY') == 0){
                if (G.options.map.getLayerById("ANJIAN_REPERTORY※01Layer")) {
                    var id=data._id;
                    var callBack = function(dataRes){
                        var point=new g2.geom.Point({
                                x: parseFloat(dataRes.result.tag.LONGITUDE),
                                y: parseFloat(dataRes.result.tag.LATITUDE),
                                spatialReference: G.options.map.spatialReference
                            }
                        );
                        dataRes.result.point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            RepersityDetail.showDetailPanel(dataRes.result);
                        },10)
                        G.options.commonGIS._blinkHighlight("ANJIAN_REPERTORY※01Layer", dataRes.result.tag.LONGITUDE, dataRes.result.tag.LATITUDE, true);
                    }
                    this.emerDetailService.getReposityDetail(id,callBack,this);
                }
            }else if(code.indexOf('JC_WARBASE') == 0){
                if (G.options.map.getLayerById("JC_WARBASE※01Layer")) {
                    var id=data._id;
                    var callBack = function(dataRes){
                        var point=new g2.geom.Point({
                                x: parseFloat(dataRes.result.longitude),
                                y: parseFloat(dataRes.result.latitude),
                                spatialReference: G.options.map.spatialReference
                            }
                        );
                        dataRes.result.point=point;
                        G.options.map.fullExtent();
                        G.options.map.map.getView().animate({center: [point.x, point.y],duration:1000},{zoom: 11,duration:3000});
                        setTimeout(function () {
                            WarbaseDetail.showDetailPanel(dataRes.result);
                        },10)
                        G.options.commonGIS._blinkHighlight("JC_WARBASE※01Layer", dataRes.result.longitude, dataRes.result.latitude, true);

                    }
                    this.emerDetailService.getWarBaseDetail(id,callBack,this);
                }
            }
        }
        var table = new SimpleTable(opts);
        // listPanel.showPanel();
    }

    function gisPanel(ops) {
        $.ajax({
            url: webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/data/table.json',
            dataType: 'json',
            success: function (data) {
                tableDadaArr =data
            }
        });
        var hasEl = $("body").find(ops.el).length;
        var elName = ops.el.substr(1);
        if (!hasEl) {
            $('body').append('<div class="riskListPanel-box"><div class="riskTablePanel-search"><input type="text"><span>搜索</span></div><div id="' + elName + '"></div></div>');
        }
        var data = ops.dataArr;
        $('.riskTablePanel-search span').click(function () {
            $('#riskTablePanel').empty();
            var text = $('.riskTablePanel-search input').val();
            if(text==""){
                tabledata(data,ops.code);
                return
            }
            var newdataArr = [];
            for(var i=0;i<data.length;i++){
                if(data[i].NAME.indexOf(text)!=-1){
                    newdataArr.push(data[i])
                }
            }
            // RiskAndResource.createEmerSourceList("all", ops.code, newdataArr,ops.title)
            tabledata(newdataArr,ops.code);
        });
        $('.riskTablePanel-search input').bind('input propertychange',function () {
            var text = $('.riskTablePanel-search input').val();
            if(text == ""){
                $('#riskTablePanel').empty();
                tabledata(data,ops.code);
                return
            }
        })

        this.el = ops.el;
        this.$el = $(ops.el);
        this.title = ops.data.title || '';
        this.draggable = ops.data.draggable || false;
        this.resizable = ops.data.resizable || false;
        this.hideIcon = ops.data.hideIcon || "";
        this.destroyIcon = ops.data.destroyIcon || "";
        this.popupCenter = (ops.data.popupCenter == false) ? false : true;
        this.navItemIcon = ops.data.navItemIcon || "";
        this.withoutNav = ops.data.withoutNav || false;

        this.defaultContent = ops.data.defaultContent || "";
        this.closeCallback = ops.data.closeCallback || null;
        this.resizeCallback = ops.data.resizeCallback || null;
        this.queryCallback=ops.data.queryCallback || null;
        this.searchCallback=ops.data.searchCallback || null;

        var $content = null;
        Object.defineProperty(this, '$content', {
            get: function () {
                return this.$el.find('.gis-panel__content');
            },
            set: function (val) {
                $content = val;
                this.$el.find('.gis-panel__content').empty().append($content);
            }
        })


        this.createPanel(this.defaultContent);
        if (!this.withoutNav)
            this.craetePanelNav();

        // 判断是否实现拖拽功能
        if (this.draggable) {
            this.drag()
        }

        // 判断是否实现调整大小
        if (this.resizable) {
            this.resize();
        }
    }

    gisPanel.prototype.setContent = function (content) {
        this.$content = content;
    }

    gisPanel.prototype.addContent = function (content) {
        this.$el.find('.gis-panel__content').append(content);
    }

    gisPanel.prototype.destroyPanel = function () {
        $('.riskListPanel-box').remove();
        if (this.$navli)
            this.$navli.remove();
    }

    gisPanel.prototype.createPanel = function (content) {

        // 创建DOM结构
        var tpl = '', title, hideIcon, destroyIcon, panelContent, draggableClass;

        title = this.title;
        hideIcon = this.hideIcon;
        destroyIcon = this.destroyIcon;
        panelContent = content || null;
        draggableClass = this.draggable ? 'gis-draggable' : '';
        var queryCallback=this.queryCallback;
        var searchCallback = this.searchCallback;

        //拼接html
        this.$el.append('<div class=\"gis-panel\"><div class=\"gis-panel__title ' + draggableClass + '\"></div>')
        this.$el.find('div div').append('<span class=\"gis-panel__title_name\" style="display: none;">' + title + '</span>');
        // var span1 = this.$el.find('.gis-panel__title_name')
        this.$el.find('div div').append('<span class=\"gis-panel__title_btns\"></span>');
        var span2 = this.$el.find('.gis-panel__title_btns')
        span2.append('<a class=\"gis-panel__title_hide\" style="display: none;"></a>')
        span2.append('<a class=\"gis-panel__title_close\">&#10006</a>')
        if (hideIcon && hideIcon.length > 0) this.$el.find('.gis-panel__title_hide').append('<b class=\"' + hideIcon + '\"></b>')
        if (destroyIcon && destroyIcon.length > 0) this.$el.find('.gis-panel__title_close').append('<b class=\"' + destroyIcon + '\"></b>')
        this.$el.find('.gis-panel').append('<div class=\"gis-panel__content\"></div>')


        if (panelContent) {
            this.setContent(panelContent);
        } else if (this.defaultContent) {
            this.setContent(this.defaultContent);
        }
        // 绑定事件
        var self = this;
        if (hideIcon) {
            this.$el.find('.gis-panel__title_hide').on('click', function () {
                self.hidePanel();
            })
        }
        if (destroyIcon) {
            this.$el.find('.gis-panel__title_close').on('click', function () {
                self.destroyPanel();
                self.closeCallback(self);
                $('.ResourceTrouble-num').removeClass('act-numActive');
                $('.Trouble-num').removeClass('act-numActive');
                $('.baseData-num').removeClass('act-numActive');
            })
        }
        if(queryCallback)
        {
            this.$el.find('.riskTablePanel-search b').on('click', function () {

                self.queryCallback(self);

            })
        }
        if(searchCallback){
            this.$el.find('.riskTablePanel-search span').on('click', function () {

                self.searchCallback(self);

            })
        }


        // 设置样式
        this.$el.css({
            'position': 'absolute',
            'zIndex': 9
        });

        if (this.popupCenter) {
            // 居中显示
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            var dragWidth = parseInt(this.$el.outerWidth());
            var dragHeight = parseInt(this.$el.outerHeight());
            this.$el.css({
                'left': (windowWidth - dragWidth) * 0.5 + 'px',
                'top': (windowHeight - dragHeight) * 0.5 + 'px'
            })
        }

    }

    gisPanel.prototype.craetePanelNav = function () {
        if (this.hideIcon.length < 1 || this.$el.find('.' + this.hideIcon).css('display') == 'none') return;
        var navs = $('.eMap-extend-nav:last')
        if (navs.length == 0) {
            $('body').append('<div class=\"eMap-extend-nav\"></div>')
            navs = $('.eMap-extend-nav:last')
        }
        navs.append('<li><b></b>' + this.title + '</li>')
        this.$navli = $('.eMap-extend-nav:last li:last').addClass('eMap-extend-nav-item')
        if (this.navItemIcon)
            $('.eMap-extend-nav:last li:last b').addClass(this.navItemIcon + ' eMap-extend-nav-item-icon');
        this.$navli.css('display', 'none');
        this.$navli.on('click', this.$navli_click(this))

    }
    gisPanel.prototype.$navli_click = function (self) {
        return function () {
            self.showPanel();
        }
    }

    gisPanel.prototype.hidePanel = function () {
        this.$el.find('.gis-panel').css('display', 'none');
        if (this.$navli) {
            this.$navli.css('display', 'block');
        }
    }

    gisPanel.prototype.showPanel = function () {
        this.$el.find('.gis-panel').css('display', 'block');
        if (this.$navli) {
            this.$navli.css('display', 'none');
        }
    }

    gisPanel.prototype.drag = function () {

        this.$el.gisDrag();
    }

    gisPanel.prototype.resize = function () {

        // 调整content css
        var Width = parseInt(this.$el.outerWidth());
        var Height = parseInt(this.$el.outerHeight());
        this.$el.css({
            'box-sizing': 'border-box',
            'height': Height + 'px',
            'width': Width + 'px'
        })
        this.$el.find('.gis-panel__content').children().css({
            'width': '100% !important',
            'height': '100% !important'
        })

        this.$el.gisResize(this.resizeCallback);
    }

    return gisPanel;
})


