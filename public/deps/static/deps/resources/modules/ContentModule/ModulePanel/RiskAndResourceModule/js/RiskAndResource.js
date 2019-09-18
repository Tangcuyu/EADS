
define(["RiskSourceService",'html!src/modules/ContentModule/ModulePanel/RiskAndResourceModule/html/RiskAndResource.html',"EmerSourceService","DetailInfoServices","MapMarkerDisplay","gisPanel","simpleTable","DangerEnterpriseDetail","CoalEnterpriseDetail","FireworkEnterpriseDetail","IndustryEnterpriseDetail","GeologDisaterDetail","RepersityDetail","WarbaseDetail","FireTeamDetail","RescueTeamDetail","ExpertInfoDetail","ShelterInfoDetail","DangerInfoDetail","TailingPondDetail","BaseDataDetail"],
    function (RiskSourceService,containerHtml,EmerSourceService,DetailInfoServices,MapMarkerDisplay,gisPanel,SimpleTable,
              DangerEnterpriseDetail,CoalEnterpriseDetail,FireworkEnterpriseDetail,IndustryEnterpriseDetail,GeologDisaterDetail,
              RepersityDetail,WarbaseDetail,FireTeamDetail,RescueTeamDetail,ExpertInfoDetail,ShelterInfoDetail,DangerInfoDetail,TailingPondDetail,BaseDataDetail) {
        var util = {};
        util.text = '';
        util.code = '';
        util.newData = [];
        util.initia = function(){
            $('.panel-RiskAndResourceModule').mouseup(function () {
                if ($('.panel-RiskAndResourceModule')[0].getBoundingClientRect().left <1150) {
                    $('.panel-RiskAndResourceModule').css("left", "514px");
                    $('.panel-RiskAndResourceModule').css("top", "730px");
                }
            })
            var self=this; 
            this.riskService = new RiskSourceService({
                serverUrl: EMAP_CONFIG.common.mongoService,
                configUrl: webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/data/nearby.json'
            });
            this.emerService = new EmerSourceService({
                serverUrl: EMAP_CONFIG.common.mongoService,
                configUrl: webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/data/nearby.json'
            });
            this.emerDetailService = new DetailInfoServices(
                {
                    serverUrl: EMAP_CONFIG.common.mongoService
                });
            $.ajax({
                url: webApp + 'src/modules/ContentModule/ModulePanel/RiskAndResourceModule/data/table.json',
                dataType: 'json',
                success: function (data) {
                    self.tableHeard = data;
                }
            });
            //查询城市
            util.queryCity(function (data) {
                util.CityData=data;
                util.CityDataArr=[];
                for(var k in data)
                {
                    util.CityDataArr.push(data[k].tag.DISTRICTCODE);
                }
            })
        };
        util.initDomFun = function (container,title) {
            var self=this;
            $('.'+container).html(containerHtml);
            $('.'+container+' .modulePanel-title').html(title);
            util.tmpcodekey="";
            util.initResource();
            util.initTrouble();
            util.baseData();
            /*切换按钮*/
            $('.resourceTrouble-wrappBox button').click(function(){
                var obj=$(this).attr('data-mark');
                $('.resourceTrouble-wrappBox button').removeClass('currentTab');
                $(this).addClass('currentTab');
                $('.resourceTrouble-wrappBox section>div').hide();
                $('.'+obj).show();
                if(obj=='emergencyResource'){
                    var newClassName = ['ResourceTrouble-icon-jiuyuandui-active','ResourceTrouble-icon-zhuanjia-active','ResourceTrouble-icon-binan-active','ResourceTrouble-icon-chubeiku-active','ResourceTrouble-icon-jidi-active'];
                    var $spans = $('.emergencyResource ul li>p>span');
                    $spans.each(function (index,item) {
                        $(item).removeClass(newClassName[index]);
                    });
                }else if(obj=='riskTrouble'){
                    var newClassName = ['Trouble-icon-weihua-active','Trouble-icon-gongmao-active','Trouble-icon-meikuang-active','Trouble-icon-weikuang-active','Trouble-icon-yanhua-active','Trouble-icon-dizhi-active','Trouble-icon-zhongda-active'];
                    var $spans = $('.riskTrouble ul li>p>span');
                    $spans.each(function (index,item) {
                        $(item).removeClass(newClassName[index]);
                    });
                }else if(obj=='baseData'){
                    var newClassName = ['Database-icon-school-active','Database-icon-hospital-active','Database-icon-airport-active','Database-icon-station-active','Database-icon-resrrvoir-active','Database-icon-nuclearinfo-active','Database-icon-portwharf-active'];
                    var $spans = $('.baseData ul li>p>span');
                    $spans.each(function (index,item) {
                        $(item).removeClass(newClassName[index]);
                    });
                }
            });
        };
        /**
         * 风险隐患列表
         * @method
         */
        util.createList = function (type, code, data,title) {
            var self = this;
            if ($(".riskListPanel-box")) {
                $(".riskListPanel-box").remove();
            }
            var tableData = data[code];//将数据按距离排序
            if (!tableData || tableData.length == 0) {
                return;
            }
            var listPanel = new gisPanel({
                dataArr:tableData,
                code:code,
                el: '#riskListPanel',  // 容器id
                data: {
                    title:title,
                    width: '975px',//容器的宽度
                    height: '320px',//容器的高度
                    draggable: false, /* 默认值：false，当设置为true，表示面板可拖动*/
                    resizable: false, /* 默认值：false，当设置为true，表示面板可调整大小*/
                    defaultContent: '<div style="z-index: 15;width: 100%; height: 90%;margin-top:5%;" id="riskTablePanel"></div>',
                    destroyIcon: 'true',  //  是否需要销毁关闭按钮，如果需要则要设置Icon值；
                    popupCenter: false,  // 弹窗是否居中显示，默认：true，居中显示；若为false，需要手动设置el弹窗的css位置；
                    closeCallback: function (obj) {
                        $('.ResourceTroubleLi22 ').removeClass('.act-numActive');
                        $('.ResourceTroubleLi33').removeClass('.act-numActive');

                    },
                    resizeCallback: function (width, height) {
                    },
                    queryCallback: function (obj) {
                        self.createList("all", code, util.newData,title);
                    },
                    searchCallback:function (obj) {
                        var codeKey = code;
                        util.text = $('.riskTablePanel-search input').val();
                        if(!util.text){
                            return
                        }
                        var newObj = {};
                        newObj.newdataArr = [];
                        var olddataarr  = data[codeKey];
                        for(var i=0;i<olddataarr.length;i++){
                            if(olddataarr[i].NAME.indexOf(util.text)!=-1){
                                newObj.newdataArr.push(olddataarr[i])
                            }
                        }
                        newObj[codeKey] = newObj.newdataArr;
                        self.createList("all", codeKey, newObj,title);
                    }
                }
            });
            var opts = {};
            opts.containerId = 'riskTablePanel';
            opts.isPaging = true;//是否分页
            opts.pageSize = 5;//每页数目
            opts.showTotal = false;
            opts.totalData=tableData;
            opts.total = tableData.length;//总数
            if (type == "all") {
                opts.fields = [
                    {
                        "name": "$num",
                        "label": "序号",
                        "width": "10%",
                        "class":"ta-center"
                    },
                    {
                        "name": "NAME",
                        "label": "名称",
                        "width": "40%"
                    },
                    {
                        "name": "ADDRESS",
                        "label": "地址",
                        "width": "40%"
                    }
                ];
            } else {
                opts.fields = [
                    {
                        "name": "$num",
                        "label": "序号",
                        "width": "10%",
                        "class":"ta-center"
                    },
                    {
                        "name": "NAME",
                        "label": "名称",
                        "width": "40%"
                    },
                    {
                        "name": "ADDRESS",
                        "label": "地址",
                        "width": "30%"
                    },
                    {
                        "name": "dis",
                        "label": "距离(km)",
                        "width": "15%",
                        "class":"ta-center"
                    }
                ];
            }
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
                    self.emerDetailService.getDangerQYDetail(data._id, function (err, resultData) {
                        if (resultData && resultData.length > 0) {
                            var point={};
                            point.x=resultData[0].geom.coordinates[0];
                            point.y=resultData[0].geom.coordinates[1];
                            resultData[0].point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            // G.options.map.setCenter(point)
                            setTimeout(function () {
                                DangerEnterpriseDetail.showPanel(resultData[0]);
                            },1500)
                            G.options.commonGIS._blinkHighlight("ANJIAN_DAGCHEMENT※DangerousChemicalLayer", point.x,point.y, true);
                        }
                    });
                }else if(code.indexOf('ANJIAN_ENT_WHSMYHBZ') == 0){
                    self.emerDetailService.getGMQYDetail(data._id, function (err, resultData) {
                        if (resultData && resultData.length > 0) {
                            var point={};
                            point.x=resultData[0].geom.coordinates[0];
                            point.y=resultData[0].geom.coordinates[1];
                            resultData[0].point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                IndustryEnterpriseDetail.showPanel(resultData[0]);
                            },1500)
                            G.options.commonGIS._blinkHighlight("ANJIAN_ENT_WHSMYHBZ※01Layer", point.x,point.y, true);
                        }
                    });
                }else if(code.indexOf('BAS_COALMINE') == 0){
                    self.emerDetailService.getMKQYDetail(data._id, function (err, resultData) {
                        if (resultData && resultData.length > 0) {
                            var point={};
                            point.x=resultData[0].geom.coordinates[0];
                            point.y=resultData[0].geom.coordinates[1];
                            resultData[0].point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                CoalEnterpriseDetail.showPanel(resultData[0]);
                            },1500)
                            G.options.commonGIS._blinkHighlight("BAS_COALMINE※01Layer", point.x,point.y, true);
                        }
                    });
                }
                else if(code.indexOf('ANJIAN_TAILINGPOND') == 0){
                    self.emerDetailService.getFMKQYDetail(data._id, function (err, resultData) {
                        if (resultData && resultData.length > 0) {
                            var point={};
                            //由于非煤矿山没有经纬度，因此暂时先写死
                            point.x=resultData[0].geom.coordinates[0];
                            point.y=resultData[0].geom.coordinates[1];
                            resultData[0].point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                TailingPondDetail.showPanel(resultData[0]);
                            },1500)
                            G.options.commonGIS._blinkHighlight("ANJIAN_TAILINGPOND※01Layer", point.x,point.y, true);
                        }
                    });
                }
                else if(code.indexOf('BAS_GEOLOGICHAZARD') == 0){
                    self.emerDetailService.getGEODISASTERDetail(data._id, function (err, resultData) {
                        if (resultData && resultData.length > 0) {
                            var point={};
                            point.x=resultData[0].geom.coordinates[0];
                            point.y=resultData[0].geom.coordinates[1];
                            resultData[0].point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                GeologDisaterDetail.showPanel(resultData[0]);
                            },1500)
                            GeologDisaterDetail.showPanel(resultData[0]);
                            G.options.commonGIS._blinkHighlight("BAS_GEOLOGICHAZARD※01Layer", point.x,point.y, true);
                        }
                    });
                }
                else if(code.indexOf('ANJIAN_FIREWORKENT') == 0){
                    self.emerDetailService.getYHBZQYDetail(data._id, function (err, resultData) {
                        if (resultData && resultData.length > 0) {
                            var point={};
                            point.x=resultData[0].geom.coordinates[0];
                            point.y=resultData[0].geom.coordinates[1];
                            resultData[0].point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                FireworkEnterpriseDetail.showPanel(resultData[0]);
                            },1500)
                            G.options.commonGIS._blinkHighlight("ANJIAN_FIREWORKENT※1Layer", point.x,point.y, true);
                        }
                    });
                }
                else if(code.indexOf('ANJIAN_DANGER') == 0){
                    self.emerDetailService.getDangerDetail(data._id, function (err, resultData) {
                        if (resultData && resultData.length > 0) {
                            var point={};
                            point.x=resultData[0].geom.coordinates[0];
                            point.y=resultData[0].geom.coordinates[1];
                            resultData[0].point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                DangerInfoDetail.showDetailPanel(resultData[0]);
                            },1500)
                            G.options.commonGIS._blinkHighlight("ANJIAN_DANGER※01Layer", point.x,point.y, true);
                        }
                    });
                } else if(code.indexOf('School') == 0){
                    self.emerDetailService.getBaseDataDetail(data._id,'BAS_SCHOOL', function (err, resultData) {
                        if (resultData && resultData.length > 0) {
                            var point={};
                            point.x=resultData[0].geom.coordinates[0];
                            point.y=resultData[0].geom.coordinates[1];
                            resultData[0].point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                BaseDataDetail.showDetailPanel(resultData[0],'SCHOOLNAME');
                            },1500)
                            G.options.commonGIS._blinkHighlight("School※01Layer", point.x,point.y, true);
                        }
                    });
                }
                else if(code.indexOf('Airport') == 0){
                    self.emerDetailService.getBaseDataDetail(data._id,'BAS_AIRPORT', function (err, resultData) {
                        if (resultData && resultData.length > 0) {
                            var point={};
                            point.x=resultData[0].geom.coordinates[0];
                            point.y=resultData[0].geom.coordinates[1];
                            resultData[0].point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                BaseDataDetail.showDetailPanel(resultData[0],'AIRPORTNAME');
                            },1500)
                            G.options.commonGIS._blinkHighlight("Airport※01Layer", point.x,point.y, true);
                        }
                    });
                }
                else if(code.indexOf('Station') == 0){
                    self.emerDetailService.getBaseDataDetail(data._id,'BAS_RAILWAYSTATION', function (err, resultData) {
                        if (resultData && resultData.length > 0) {
                            var point={};
                            point.x=resultData[0].geom.coordinates[0];
                            point.y=resultData[0].geom.coordinates[1];
                            resultData[0].point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                BaseDataDetail.showDetailPanel(resultData[0],'STATIONNAME');
                            },1500)
                            G.options.commonGIS._blinkHighlight("Station※01Layer", point.x,point.y, true);
                        }
                    });
                }
                else if(code.indexOf('Resrrvoir') == 0){
                    self.emerDetailService.getBaseDataDetail(data._id,'BAS_RESERVOIR', function (err, resultData) {
                        if (resultData && resultData.length > 0) {
                            var point={};
                            point.x=resultData[0].geom.coordinates[0];
                            point.y=resultData[0].geom.coordinates[1];
                            resultData[0].point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                BaseDataDetail.showDetailPanel(resultData[0],'NAME');
                            },1500)
                            G.options.commonGIS._blinkHighlight("Resrrvoir※01Layer", point.x,point.y, true);
                        }
                    });
                }
                else if(code.indexOf('Nuclearinfo') == 0){
                    self.emerDetailService.getBaseDataDetail(data._id,'BAS_NUCLEARINFO', function (err, resultData) {
                        if (resultData && resultData.length > 0) {
                            var point={};
                            point.x=resultData[0].geom.coordinates[0];
                            point.y=resultData[0].geom.coordinates[1];
                            resultData[0].point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                BaseDataDetail.showDetailPanel(resultData[0],'NUCLEARNAME');
                            },1500)
                            G.options.commonGIS._blinkHighlight("Nuclearinfo※01Layer", point.x,point.y, true);
                        }
                    });
                }
                else if(code.indexOf('Portwharf') == 0){
                    self.emerDetailService.getBaseDataDetail(data._id,'BAS_PORTWHARF', function (err, resultData) {
                        if (resultData && resultData.length > 0) {
                            var point={};
                            point.x=resultData[0].geom.coordinates[0];
                            point.y=resultData[0].geom.coordinates[1];
                            resultData[0].point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                BaseDataDetail.showDetailPanel(resultData[0],'PORTWHARFNAME');
                            },1500)
                            G.options.commonGIS._blinkHighlight("Portwharf※01Layer", point.x,point.y, true);
                        }
                    });
                }
                else if(code.indexOf('Hospital') == 0){
                    self.emerDetailService.getBaseDataDetail(data._id,'BAS_HEALTHORG', function (err, resultData) {
                        if (resultData && resultData.length > 0) {
                            var point={};
                            point.x=resultData[0].geom.coordinates[0];
                            point.y=resultData[0].geom.coordinates[1];
                            resultData[0].point=point;
                            G.options.map.fullExtent();
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                BaseDataDetail.showDetailPanel(resultData[0],'ORGNAME');
                            },1500)
                            G.options.commonGIS._blinkHighlight("Hospital※01Layer", point.x,point.y, true);
                        }
                    });
                }
            }
            var table = new SimpleTable(opts);
            listPanel.showPanel();
        };
        /**
         * 应急资源列表
         * @method
         */
        util.createEmerSourceList = function (type, code, data,title) {
            var self = this;
            if ($(".riskListPanel-box")) {
                $(".riskListPanel-box").remove();
            }
            var tableData = data[code];//将数据按距离排序
            if (!tableData || tableData.length == 0) {
                return;
            }
            var listPanel = new gisPanel({
                dataArr:tableData,
                title:title,
                code:code,
                el: '#riskListPanel',  // 容器id
                data: {
                    title: title,
                    width: '975px',//容器的宽度
                    height: '320px',//容器的高度
                    draggable: false, /* 默认值：false，当设置为true，表示面板可拖动*/
                    resizable: false, /* 默认值：false，当设置为true，表示面板可调整大小*/
                    defaultContent: '<div style="z-index: 15;width: 100%; height: 90%;margin-top:5%;" id="riskTablePanel"></div>',
                    destroyIcon: 'true',  //  是否需要销毁关闭按钮，如果需要则要设置Icon值；
                    popupCenter: false,  // 弹窗是否居中显示，默认：true，居中显示；若为false，需要手动设置el弹窗的css位置；
                    closeCallback: function (obj) {
                        $('.ResourceTroubleLi22 ').removeClass('act-numActive');
                        $('.ResourceTroubleLi33').removeClass('.act-numActive');
                    },
                    resizeCallback: function (width, height) {
                    },
                    queryCallback: function (obj) {
                        self.createEmerSourceList("all", code, util.newData,title);
                    },
                    searchCallback:function (obj) {
                        var codeKey = code;
                        util.text = $('.riskTablePanel-search input').val();
                        if(!util.text){
                            return
                        }
                        var newObj = {};
                        newObj.newdataArr = [];
                        var olddataarr  = data[codeKey];
                        for(var i=0;i<olddataarr.length;i++){
                            if(olddataarr[i].NAME.indexOf(util.text)!=-1){
                                newObj.newdataArr.push(olddataarr[i])
                            }
                        }
                        newObj[codeKey] = newObj.newdataArr;
                        self.createEmerSourceList("all", codeKey, newObj,title);
                    }
                }
            });
            var opts = {};
            opts.containerId = 'riskTablePanel';
            opts.isPaging = true;//是否分页
            opts.pageSize = 5;//每页数目
            opts.showTotal = false;
            opts.total = tableData.length;//总数
            opts.fields = this.tableHeard[code];
            opts.pageChangeCallback = function (pageIndex, pageSize, cb) {
                var list = [];
                for (var i = pageIndex * pageSize; i < (pageIndex + 1) * pageSize; i++) {
                    if (!!tableData[i]) {
                        var item = {};
                        item._id = tableData[i]._id;
                        item.RESCUECODE = tableData[i].RESCUECODE||"";
                        for(var j=1;j<self.tableHeard[code].length;j++){
                            item[self.tableHeard[code][j].name] = tableData[i][self.tableHeard[code][j].name];
                        }
                        list.push(item);
                    }
                }
                cb(list);
            };
            opts.rowClickCallback = function (data) {
                if (code.indexOf('RescueTeam') == 0) {
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
                                G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                                setTimeout(function () {
                                    G.notautopan=true;
                                    FireTeamDetail.showDetailPanel(dataRes.result);
                                },1500)
                                G.options.commonGIS._blinkHighlight("RescueTeam※03Layer", dataRes.result.tag.LONGITUDE, dataRes.result.tag.LATITUDE, true);
                            }
                            self.emerDetailService.getFireTeamDetail(id,callBack,this);
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
                                G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                                setTimeout(function () {
                                    RescueTeamDetail.showDetailPanel(dataRes.result);
                                    G.notautopan=true;
                                },1500)
                                if(dataRes.result.tag.ISHAVAIRPORT=="1"){
                                    G.options.commonGIS._blinkHighlight("RescueTeam※03PORTLayer", dataRes.result.tag.LONGITUDE, dataRes.result.tag.LATITUDE, true);
                                }else{
                                    G.options.commonGIS._blinkHighlight("RescueTeam※03Layer", dataRes.result.tag.LONGITUDE, dataRes.result.tag.LATITUDE, true);
                                }
                            }
                            self.emerDetailService.getRescueTeamDetail(id,callBack,this);
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
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                ExpertInfoDetail.showDetailPanel(dataRes.result);
                            },1500)
                            G.options.commonGIS._blinkHighlight("Expert※01Layer", dataRes.result.tag.LONGITUDE, dataRes.result.tag.LATITUDE, true);
                        }
                        self.emerDetailService.getExpertDataDetail(id,callBack,this);
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
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                ShelterInfoDetail.showDetailPanel(dataRes.result);
                            },1500)
                            G.options.commonGIS._blinkHighlight("Shelter※01Layer", dataRes.result.tag.LONGITUDE, dataRes.result.tag.LATITUDE, true);
                        }
                        self.emerDetailService.getShelterDataDetail(id,callBack,this);
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
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                RepersityDetail.showDetailPanel(dataRes.result);
                            },1500)
                            G.options.commonGIS._blinkHighlight("ANJIAN_REPERTORY※01Layer", dataRes.result.tag.LONGITUDE, dataRes.result.tag.LATITUDE, true);
                        }
                        self.emerDetailService.getReposityDetail(id,callBack,this);
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
                            G.options.map.map.getView().animate({center: [point.x*1, point.y*1],duration:500},{zoom: 11,duration:1000});
                            setTimeout(function () {
                                WarbaseDetail.showDetailPanel(dataRes.result);
                            },1500)
                            G.options.commonGIS._blinkHighlight("JC_WARBASE※01Layer", dataRes.result.longitude, dataRes.result.latitude, true);

                        }
                        self.emerDetailService.getWarBaseDetail(id,callBack,this);
                    }
                }
            }
            var table = new SimpleTable(opts);
            listPanel.showPanel();
        };
        /**
         * 标注省统计和市统计
         * @param data
         * @param codeKey
         */
        util.provinceCityCountMark=function(data, codeKey) {
            var data = data[codeKey];
            var dataCount = util.districtStatistics(data);
            var provinceDataCount = dataCount.dest;
            var provinceDataStr = JSON.stringify(provinceDistrictData.province);
            var provinceData = JSON.parse(provinceDataStr);
            for (var i in provinceDataCount) {
                for (var j in provinceData) {
                    if (provinceDataCount[i].DISTRICT == provinceData[j].code) {
                        provinceData[j].count = provinceDataCount[i].count;
                    }
                }
            }
            //去除统计结果为0的
            var dataResult = [];
            for (var k in provinceData) {
                if (provinceData[k].count != 0) {
                    dataResult.push(provinceData[k]);
                }
            }
            // MapMarkerDisplay.clearLayerinfo();
            MapMarkerDisplay.addProvinceCountOnMap(dataResult);

            //查询城市
            var cityDataCount = dataCount.citydest;
            //查询城市
            util.queryCity(function (data) {
                util.CityData=data;
                util.CityDataArr=[];
                for(var k in data)
                {
                    util.CityDataArr.push(data[k].tag.DISTRICTCODE);
                }
            })
            for (var l in cityDataCount) {
                for (var m in util.CityData) {
                    if (cityDataCount[l].DISTRICT == util.CityData[m].tag.DISTRICTCODE) {
                        util.CityData[m].count = cityDataCount[l].count;
                    }
                }
            }
            //去除统计结果为0的
            var dataResult = [];
            for (var n in util.CityData) {
                if (util.CityData[n].count && util.CityData[n].count != 0) {
                    dataResult.push(util.CityData[n]);
                }
            }
            debugger;//todo ?????应急资源 上图
            MapMarkerDisplay.addCityCountOnMap(dataResult);
        }

//查询资源
        util.initResource=function (data) {
            var self=this;
            var dataArr=[
                {
                    codeKey:'RescueTeam※03',
                    tabTitle:'救援队伍',
                    tabNumber:0
                },
                {
                    codeKey:'Expert※01',
                    tabTitle:'专家',
                    tabNumber:0
                },
                {
                    codeKey:'Shelter※01',
                    tabTitle:'避难场所',
                    tabNumber:0
                },
                {
                    codeKey:'ANJIAN_REPERTORY※01',
                    tabTitle:'物资储备库',
                    tabNumber:0
                },
                {
                    codeKey:'JC_WARBASE※01',
                    tabTitle:'战保基地',
                    tabNumber:0
                }

            ];
            var dataItem=[];
            if(data){
                dataItem=data;
            }else{
                dataItem=dataArr;
            }
            var erStr='';
            for(var i=0;i<dataItem.length;i++){
                if(dataItem.length == 4) {
                    erStr +='<li codeKey="'+dataItem[i].codeKey+'" class="ResourceTroubleLi22">' +
                        '<p class="yellowHover">'
                    if(dataItem[i].codeKey=='RescueTeam※03'){  //救援队
                        erStr += '<span class="ResourceTrouble-icon-jiuyuandui ResourceTrouble-icon"></span>'
                    }else if(dataItem[i].codeKey=='Expert※01'){   //专家
                        erStr += '<span class="ResourceTrouble-icon-zhuanjia ResourceTrouble-icon"></span>'
                    }else if(dataItem[i].codeKey=='Shelter※01'){  //避难场所
                        erStr += '<span class="ResourceTrouble-icon-binan ResourceTrouble-icon"></span>'
                    } else if(dataItem[i].codeKey=='ANJIAN_REPERTORY※01'){  //物资储备库
                        erStr += '<span class="ResourceTrouble-icon-chubeiku ResourceTrouble-icon"></span>'
                    } else if(dataItem[i].codeKey=='JC_WARBASE※01'){  //战保基地
                        erStr += '<span class="ResourceTrouble-icon-jidi ResourceTrouble-icon"></span>'
                    }
                    erStr += dataItem[i].tabTitle;
                    '</p>'
                    if(dataItem[i].codeKey=='RescueTeam※03'){  //救援队
                        erStr += '<p  class="ResourceTrouble-num">'+dataItem[i].tabNumber+'支</p>'
                    }else if(dataItem[i].codeKey=='Expert※01'){   //专家
                        erStr += '<p  class="ResourceTrouble-num">'+dataItem[i].tabNumber+'人</p>'
                    }else if(dataItem[i].codeKey=='Shelter※01'){  //避难场所
                        erStr += '<p  class="ResourceTrouble-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='ANJIAN_REPERTORY※01'){  //物资储备库
                        erStr += '<p  class="ResourceTrouble-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='JC_WARBASE※01'){  //战保基地
                        erStr += '<p  class="ResourceTrouble-num">'+dataItem[i].tabNumber+'个</p>'
                    }
                    erStr +=  '</li>';
                }else {
                    erStr +='<li codeKey="'+dataItem[i].codeKey+'" class="ResourceTroubleLi33">' +
                        '<p class="yellowHover">';
                    if(dataItem[i].codeKey=='RescueTeam※03'){  //救援队
                        erStr += '<span class="ResourceTrouble-icon-jiuyuandui ResourceTrouble-icon"></span>'
                    }else if(dataItem[i].codeKey=='Expert※01'){   //专家
                        erStr += '<span class="ResourceTrouble-icon-zhuanjia ResourceTrouble-icon"></span>'
                    }else if(dataItem[i].codeKey=='Shelter※01'){  //避难场所
                        erStr += '<span class="ResourceTrouble-icon-binan ResourceTrouble-icon"></span>'
                    } else if(dataItem[i].codeKey=='ANJIAN_REPERTORY※01'){  //物资储备库
                        erStr += '<span class="ResourceTrouble-icon-chubeiku ResourceTrouble-icon"></span>'
                    } else if(dataItem[i].codeKey=='JC_WARBASE※01'){  //战保基地
                        erStr += '<span class="ResourceTrouble-icon-jidi ResourceTrouble-icon"></span>'
                    }
                    erStr += dataItem[i].tabTitle
                    '</p>'
                    if(dataItem[i].codeKey=='RescueTeam※03'){  //救援队
                        erStr += '<p  class="ResourceTrouble-num">'+dataItem[i].tabNumber+'支</p>'
                    }else if(dataItem[i].codeKey=='Expert※01'){   //专家
                        erStr += '<p  class="ResourceTrouble-num">'+dataItem[i].tabNumber+'人</p>'
                    }else if(dataItem[i].codeKey=='Shelter※01'){  //避难场所
                        erStr += '<p  class="ResourceTrouble-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='ANJIAN_REPERTORY※01'){  //物资储备库
                        erStr += '<p  class="ResourceTrouble-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='JC_WARBASE※01'){  //战保基地
                        erStr += '<p  class="ResourceTrouble-num">'+dataItem[i].tabNumber+'个</p>'
                    }
                    erStr +=  '</li>';
                }
            }
            $('.emergencyResource ul').html(erStr);
            $('.emergencyResource .yellowHover').mouseenter(function () {
                $('.emergencyResource .yellowHover').removeClass('act-titleActive-active');
                $(this).addClass('act-titleActive-active');
                var newClassName =['ResourceTrouble-icon-jiuyuandui-active-active','ResourceTrouble-icon-zhuanjia-active-active','ResourceTrouble-icon-binan-active-active','ResourceTrouble-icon-chubeiku-active-active','ResourceTrouble-icon-jidi-active-active'];
                var $spans = $('.emergencyResource ul li>p>span');
                var index = $(this).parents('li').index();
                $spans.each(function (index,item) {
                    $(item).removeClass(newClassName[index]);
                });
                $(this).find('span').addClass(newClassName[index]);
            });
            $('.emergencyResource .yellowHover').mouseleave(function () {
                $('.emergencyResource .yellowHover').removeClass('act-titleActive-active');
                var newClassName =['ResourceTrouble-icon-jiuyuandui-active-active','ResourceTrouble-icon-zhuanjia-active-active','ResourceTrouble-icon-binan-active-active','ResourceTrouble-icon-chubeiku-active-active','ResourceTrouble-icon-jidi-active-active'];
                var $spans = $('.emergencyResource ul li>p>span');
                $spans.each(function (index,item) {
                    $(item).removeClass(newClassName[index]);
                });
            });
            //点击icon
            $('.emergencyResource .yellowHover').off("click").on("click",function(){
                //todo  点击icon  ??????
                debugger;
                var codeKey=$(this).parent().attr('codeKey');
                $(".riskListPanel-box").remove();
                $('.act-numActive').removeClass('act-numActive');
                if($(this).hasClass('act-titleActive')){
                    $(this).removeClass('act-titleActive');
                    var newClassName = ['ResourceTrouble-icon-jiuyuandui-active','ResourceTrouble-icon-zhuanjia-active','ResourceTrouble-icon-binan-active','ResourceTrouble-icon-chubeiku-active','ResourceTrouble-icon-jidi-active'];
                    var $spans = $('.emergencyResource ul li>p>span');
                    $spans.each(function (index,item) {
                        $(item).removeClass(newClassName[index]);
                    });
                    MapMarkerDisplay.clearCodeLayerinfo(codeKey);
                    MapMarkerDisplay.clearCodeLayerinfo("RescueTeam※03PORT");
                }else{
                    G.options.map.fullExtent();
                    var newClassName = ['ResourceTrouble-icon-jiuyuandui-active','ResourceTrouble-icon-zhuanjia-active','ResourceTrouble-icon-binan-active','ResourceTrouble-icon-chubeiku-active','ResourceTrouble-icon-jidi-active'];
                    var $spans = $('.emergencyResource ul li>p>span');
                    var index = $(this).parents('li').index();
                    $spans.each(function (index,item) {
                        $(item).removeClass(newClassName[index]);
                    });
                    $(this).find('span').addClass(newClassName[index]);
                    $('.yellowHover').removeClass('act-titleActive');
                    $(this).addClass('act-titleActive');
                    if(util.tmpcodekey!="") MapMarkerDisplay.clearCodeLayerinfo(util.tmpcodekey);
                    util.tmpcodekey=codeKey;
                    var opt = {
                        resourceKey: codeKey
                    };
                    self.emerService.getDataList(opt, function (err, data) {
                        debugger;
                        util.provinceCityCountMark(data,codeKey);
                        var data=data[codeKey];
                        if(codeKey=="RescueTeam※03"){
                            var normal=[];
                            var portRes=[];
                            for(var i in data){
                                if(data[i].ISHAVAIRPORT=='1'){
                                    portRes.push(data[i]);
                                }else{
                                    normal.push(data[i])
                                }
                            }
                            MapMarkerDisplay.addPointsOnMap(codeKey, normal);
                            MapMarkerDisplay.addPointsOnMap(codeKey+'PORT', portRes);
                        }else{
                            debugger
                            MapMarkerDisplay.addPointsOnMap(codeKey, data);
                        }
                    })
                }
            })
            //点击数字===========应急资源
            $('.ResourceTrouble-num').off("click").on("click",function(){
                //todo  点击数字===========应急资源  ??????
                debugger;
                var codeKey=$(this).parent().attr('codeKey');
                var title = $(this).siblings('p').find('span').text();
                $('.ResourceTroubleLi33').removeClass('act-numActive');
                $('.baseData-num').removeClass('act-numActive');
                $('.Trouble-num').removeClass('act-numActive');
                if($(this).hasClass('act-numActive')){
                    $(this).removeClass('act-numActive');
                    if ($(".riskListPanel-box")) {
                        $(".riskListPanel-box").remove();
                    }
                }else{
                    $('.ResourceTrouble-num').removeClass('act-numActive');
                    $(this).addClass('act-numActive');
                    var opt = {
                        resourceKey: codeKey
                    };
                    self.emerService.getDataList(opt, function (err, data) {
                        util.code = codeKey;
                        util.newData = data;
                        self.createEmerSourceList("all", codeKey, data,title);
                    })
                }
            })
        };
        //查询风险
        util.initTrouble=function (data) {
            var self=this;
            var dataArr=[
                {
                    codeKey:'BAS_GEOLOGICHAZARD※01',
                    tabTitle:'地质灾害隐患点',
                    tabNumber:0
                },
                {
                    codeKey:'ANJIAN_DAGCHEMENT※DangerousChemical',
                    tabTitle:'危化品企业',
                    tabNumber:0
                },
                {
                    codeKey:'BAS_COALMINE※01',
                    tabTitle:'煤矿企业',
                    tabNumber:0
                },
                {
                    codeKey:'ANJIAN_TAILINGPOND※01',//
                    tabTitle:'尾矿库企业',
                    tabNumber:0
                },
                {
                    codeKey:'ANJIAN_ENT_WHSMYHBZ※01',
                    tabTitle:'工贸企业',
                    tabNumber:0
                },
                {
                    codeKey:'ANJIAN_FIREWORKENT※1',
                    tabTitle:'烟花爆竹企业',
                    tabNumber:0
                },
                {
                    codeKey:'ANJIAN_TAILINGPOND※01',
                    tabTitle:'非煤矿山企业',
                    tabNumber:0
                },
                {
                    codeKey:'ANJIAN_DANGER※01',
                    tabTitle:'重大危险源',
                    tabNumber:0
                },
            ];
            var dataItem=[];
            if(data){
                dataItem=data;
            }else{
                dataItem=dataArr;
            }
            var rtStr='';
            for(var i=0;i<dataItem.length;i++){
                if(dataItem.length==4){
                    rtStr +='<li codeKey="'+dataItem[i].codeKey+'" class="ResourceTroubleLi22">' +
                        '<p class="yellowHover">' ;
                    if(dataItem[i].codeKey=='ANJIAN_DAGCHEMENT※DangerousChemical'){  //危化企业
                        rtStr += '<span class="Trouble-icon-weihua Trouble-icon"></span>'
                    }else if(dataItem[i].codeKey=='BAS_COALMINE※01'){   //煤矿企业
                        rtStr += '<span class="Trouble-icon-meikuang Trouble-icon"></span>'
                    }else if(dataItem[i].codeKey=='ANJIAN_TAILINGPOND※01'){  //尾矿库
                        rtStr += '<span class="Trouble-icon-weikuang Trouble-icon"></span>'
                    } else if(dataItem[i].codeKey=='ANJIAN_FIREWORKENT※1'){  //烟花爆竹
                        rtStr += '<span class="Trouble-icon-yanhua Trouble-icon"></span>'
                    } else if(dataItem[i].codeKey=='BAS_GEOLOGICHAZARD※01'){  //地质灾害隐患点
                        rtStr += '<span class="Trouble-icon-dizhi Trouble-icon"></span>'
                    }else if(dataItem[i].codeKey=='ANJIAN_ENT_WHSMYHBZ※01'){  //工贸企业
                        rtStr += '<span class="Trouble-icon-gongmao Trouble-icon"></span>'
                    } else if(dataItem[i].codeKey=='ANJIAN_DANGER※01'){  //重大危险源
                        rtStr += '<span class="Trouble-icon-zhongda Trouble-icon"></span>'
                    }
                    rtStr +=dataItem[i].tabTitle
                    '</p>'
                    if(dataItem[i].codeKey=='ANJIAN_DAGCHEMENT※DangerousChemical'){  //危化企业
                        rtStr += '<p class="Trouble-num">'+dataItem[i].tabNumber+'个</p>'
                    }else if(dataItem[i].codeKey=='BAS_COALMINE※01'){   //煤矿企业
                        rtStr += '<p class="Trouble-num">'+dataItem[i].tabNumber+'个</p>'
                    }else if(dataItem[i].codeKey=='ANJIAN_TAILINGPOND※01'){  //尾矿库
                        rtStr += '<p class="Trouble-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='ANJIAN_FIREWORKENT※1'){  //烟花爆竹
                        rtStr += '<p class="Trouble-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='BAS_GEOLOGICHAZARD※01'){  //地质灾害隐患点
                        rtStr += '<p class="Trouble-num">'+dataItem[i].tabNumber+'个</p>'
                    }else if(dataItem[i].codeKey=='ANJIAN_ENT_WHSMYHBZ※01'){  //工贸企业
                        rtStr += '<p class="Trouble-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='ANJIAN_DANGER※01'){  //重大危险源
                        rtStr += '<p class="Trouble-num">'+dataItem[i].tabNumber+'个</p>'
                    }
                    rtStr +='</li>';
                }else{
                    rtStr +='<li codeKey="'+dataItem[i].codeKey+'" class="ResourceTroubleLi33">' +
                        '<p class="yellowHover">' ;
                    if(dataItem[i].codeKey=='ANJIAN_DAGCHEMENT※DangerousChemical'){  //危化企业
                        rtStr += '<span class="Trouble-icon-weihua Trouble-icon"></span>'
                    }else if(dataItem[i].codeKey=='BAS_COALMINE※01'){   //煤矿企业
                        rtStr += '<span class="Trouble-icon-meikuang Trouble-icon"></span>'
                    }else if(dataItem[i].codeKey=='ANJIAN_TAILINGPOND※01'){  //feimei矿库
                        rtStr += '<span class="Trouble-icon-weikuang Trouble-icon"></span>'
                    } else if(dataItem[i].codeKey=='ANJIAN_FIREWORKENT※1'){  //烟花爆竹
                        rtStr += '<span class="Trouble-icon-yanhua Trouble-icon"></span>'
                    } else if(dataItem[i].codeKey=='BAS_GEOLOGICHAZARD※01'){  //地质灾害隐患点
                        rtStr += '<span class="Trouble-icon-dizhi Trouble-icon"></span>'
                    } else if(dataItem[i].codeKey=='ANJIAN_ENT_WHSMYHBZ※01'){  //工贸企业
                        rtStr += '<span class="Trouble-icon-gongmao Trouble-icon"></span>'
                    } else if(dataItem[i].codeKey=='ANJIAN_DANGER※01'){  //重大危险源
                        rtStr += '<span class="Trouble-icon-zhongda Trouble-icon"></span>'
                    }
                    rtStr += dataItem[i].tabTitle;
                    '</p>'
                    if(dataItem[i].codeKey=='ANJIAN_DAGCHEMENT※DangerousChemical'){  //危化企业
                        rtStr += '<p class="Trouble-num">'+dataItem[i].tabNumber+'个</p>'
                    }else if(dataItem[i].codeKey=='BAS_COALMINE※01'){   //煤矿企业
                        rtStr += '<p class="Trouble-num">'+dataItem[i].tabNumber+'个</p>'
                    }else if(dataItem[i].codeKey=='ANJIAN_TAILINGPOND※01'){  //尾矿库
                        rtStr += '<p class="Trouble-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='ANJIAN_FIREWORKENT※1'){  //烟花爆竹
                        rtStr += '<p class="Trouble-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='BAS_GEOLOGICHAZARD※01'){  //地质灾害隐患点
                        rtStr += '<p class="Trouble-num">'+dataItem[i].tabNumber+'个</p>'
                    }else if(dataItem[i].codeKey=='ANJIAN_ENT_WHSMYHBZ※01'){  //工贸企业
                        rtStr += '<p class="Trouble-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='ANJIAN_DANGER※01'){  //重大危险源
                        rtStr += '<p class="Trouble-num">'+dataItem[i].tabNumber+'个</p>'
                    }
                    rtStr +='</li>';
                }
            }
            $('.riskTrouble ul').html(rtStr);
            $('.riskTrouble').hide();
            $('.riskTrouble .yellowHover').mouseenter(function () {
                $('.riskTrouble .yellowHover').removeClass('act-titleActive-active');
                $(this).addClass('act-titleActive-active');
                var newClassName = ['Trouble-icon-weihua-active-active','Trouble-icon-gongmao-active-active','Trouble-icon-meikuang-active-active','Trouble-icon-weikuang-active-active','Trouble-icon-yanhua-active-active','Trouble-icon-dizhi-active-active','Trouble-icon-zhongda-active-active'];
                var $spans = $('.riskTrouble ul li>p>span');
                var index = $(this).parents('li').index();
                $spans.each(function (index,item) {
                    $(item).removeClass(newClassName[index]);
                });
                $(this).find('span').addClass(newClassName[index]);
            });
            $('.riskTrouble .yellowHover').mouseleave(function () {
                $('.riskTrouble .yellowHover').removeClass('act-titleActive-active');
                var newClassName = ['Trouble-icon-weihua-active-active','Trouble-icon-gongmao-active-active','Trouble-icon-meikuang-active-active','Trouble-icon-weikuang-active-active','Trouble-icon-yanhua-active-active','Trouble-icon-dizhi-active-active','Trouble-icon-zhongda-active-active'];
                var $spans = $('.riskTrouble ul li>p>span');
                $spans.each(function (index,item) {
                    $(item).removeClass(newClassName[index]);
                });
            });
            //点击icon
            $('.riskTrouble .yellowHover').click(function(){
                //todo  点击icon riskTrouble  ??????
                debugger;
                $(".riskListPanel-box").remove();
                $('.act-numActive').removeClass('act-numActive');
                $('.ResourceTrouble-icon').parent('p').removeClass('act-titleActive');
                $('.ResourceTrouble-icon').parent('p').removeClass('act-titleActive');
                var codeKey=$(this).parent().attr('codeKey');
                if($(this).hasClass('act-titleActive')){
                    $(this).removeClass('act-titleActive');
                    var newClassName = ['Trouble-icon-weihua-active','Trouble-icon-gongmao-active','Trouble-icon-meikuang-active','Trouble-icon-weikuang-active','Trouble-icon-yanhua-active','Trouble-icon-dizhi-active','Trouble-icon-zhongda-active'];
                    var $spans = $('.riskTrouble ul li>p>span');
                    $spans.each(function (index,item) {
                        $(item).removeClass(newClassName[index]);
                    });
                    MapMarkerDisplay.clearCodeLayerinfo(codeKey);
                    MapMarkerDisplay.clearCodeLayerinfo("RescueTeam※03PORT");
                }else{
                    var newClassName =  ['Trouble-icon-weihua-active','Trouble-icon-gongmao-active','Trouble-icon-meikuang-active','Trouble-icon-weikuang-active','Trouble-icon-yanhua-active','Trouble-icon-dizhi-active','Trouble-icon-zhongda-active'];
                    var $spans = $('.riskTrouble ul li>p>span');
                    var index = $(this).parents('li').index();
                    $spans.each(function (index,item) {
                        $(item).removeClass(newClassName[index]);
                    });
                    $(this).find('span').addClass(newClassName[index]);
                    $('.yellowHover').removeClass('act-titleActive');
                    $(this).addClass('act-titleActive');
                    if(util.tmpcodekey!="") MapMarkerDisplay.clearCodeLayerinfo(util.tmpcodekey);
                    util.tmpcodekey=codeKey;
                    var opt = {
                        resourceKey: codeKey
                    };
                    G.options.map.fullExtent();
                    self.riskService.getDataList(opt, function (err, data) {
                        util.provinceCityCountMark(data,codeKey)//标注省市统计
                        var data=data[codeKey];
                        //if(data.length>10000)data.length=10000;//暂时将数据量过大的删除一部分
                        MapMarkerDisplay.addPointsOnMap(codeKey, data);
                    })
                }
            });
            //点击数字=========风险隐患  ResourceTrouble-num
            $('.Trouble-num').click(function(){
                //todo  .Trouble-num  ??????
                debugger;
                var codeKey=$(this).parent().attr('codeKey');
                var title = $(this).siblings('p').find('span').text();
                $('.ResourceTrouble-num').removeClass('act-numActive');
                $('.baseData-num').removeClass('act-numActive');
                if($(this).hasClass('act-numActive')){
                    $(this).removeClass('act-numActive');
                    if ($(".riskListPanel-box")) {
                        $(".riskListPanel-box").remove();
                    }
                }else{
                    $('.Trouble-num').removeClass('act-numActive');
                    $(this).addClass('act-numActive');
                    var opt = {
                        resourceKey: codeKey
                    };
                    self.riskService.getDataList(opt, function (err, data) {
                        util.newData = data;
                        self.createList("all", codeKey, data,title);
                    })
                }
            })
        };
        //基础数据
        util.baseData = function(data){
            var self=this;
            var dataArr=[
                {
                    codeKey:'Hospital※01',
                    tabTitle:'医院',
                    tabNumber:0
                },
                {
                    codeKey:'School※01',
                    tabTitle:'学校',
                    tabNumber:0
                },
                {
                    codeKey:'Airport※01',
                    tabTitle:'机场',
                    tabNumber:0
                },
                {
                    codeKey:'Station※01',//
                    tabTitle:'车站',
                    tabNumber:0
                },
                {
                    codeKey:'Resrrvoir※01',
                    tabTitle:'水库大坝',
                    tabNumber:0
                },
                {
                    codeKey:'Nuclearinfo※01',
                    tabTitle:'核设施',
                    tabNumber:0
                },
                {
                    codeKey:'Portwharf※01',
                    tabTitle:'码头',
                    tabNumber:0
                }
            ];
            var dataItem=[];
            if(data){
                dataItem=data;
            }else{
                dataItem=dataArr;
            }
            var rtStr='';
            for(var i=0;i<dataItem.length;i++){
                if(dataItem.length==4){
                    rtStr +='<li codeKey="'+dataItem[i].codeKey+'" class="ResourceTroubleLi22">' +
                        '<p class="yellowHover">' ;
                    if(dataItem[i].codeKey=='School※01'){  //危化企业
                        rtStr += '<span class="Database-icon-school baseData-icon"></span>'
                    }else if(dataItem[i].codeKey=='Airport※01'){   //煤矿企业
                        rtStr += '<span class="Database-icon-airport baseData-icon"></span>'
                    }else if(dataItem[i].codeKey=='Station※01'){  //尾矿库
                        rtStr += '<span class="Database-icon-station baseData-icon"></span>'
                    } else if(dataItem[i].codeKey=='Nuclearinfo※01'){  //烟花爆竹
                        rtStr += '<span class="Database-icon-nuclearinfo baseData-icon"></span>'
                    } else if(dataItem[i].codeKey=='Hospital※01'){  //地质灾害隐患点
                        rtStr += '<span class="Database-icon-hospital baseData-icon"></span>'
                    }else if(dataItem[i].codeKey=='Resrrvoir※01'){  //工贸企业
                        rtStr += '<span class="Database-icon-resrrvoir baseData-icon"></span>'
                    } else if(dataItem[i].codeKey=='Portwharf※01'){  //重大危险源
                        rtStr += '<span class="Database-icon-portwharf baseData-icon"></span>'
                    }
                    rtStr +=dataItem[i].tabTitle
                    '</p>'
                    if(dataItem[i].codeKey=='School※01'){  //危化企业
                        rtStr += '<p class="baseData-num">'+dataItem[i].tabNumber+'个</p>'
                    }else if(dataItem[i].codeKey=='Airport※01'){   //煤矿企业
                        rtStr += '<p class="baseData-num">'+dataItem[i].tabNumber+'个</p>'
                    }else if(dataItem[i].codeKey=='Station※01'){  //尾矿库
                        rtStr += '<p class="baseData-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='Nuclearinfo※01'){  //烟花爆竹
                        rtStr += '<p class="baseData-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='Hospital※01'){  //地质灾害隐患点
                        rtStr += '<p class="baseData-num">'+dataItem[i].tabNumber+'个</p>'
                    }else if(dataItem[i].codeKey=='Resrrvoir※01'){  //工贸企业
                        rtStr += '<p class="baseData-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='Portwharf※01'){  //重大危险源
                        rtStr += '<p class="baseData-num">'+dataItem[i].tabNumber+'个</p>'
                    }
                    rtStr +='</li>';
                }else{
                    rtStr +='<li codeKey="'+dataItem[i].codeKey+'" class="ResourceTroubleLi33">' +
                        '<p class="yellowHover">' ;
                    if(dataItem[i].codeKey=='School※01'){  //危化企业
                        rtStr += '<span class="Database-icon-school baseData-icon"></span>'
                    }else if(dataItem[i].codeKey=='Airport※01'){   //煤矿企业
                        rtStr += '<span class="Database-icon-airport baseData-icon"></span>'
                    }else if(dataItem[i].codeKey=='Station※01'){  //feimei矿库
                        rtStr += '<span class="Database-icon-station baseData-icon"></span>'
                    } else if(dataItem[i].codeKey=='Nuclearinfo※01'){  //烟花爆竹
                        rtStr += '<span class="Database-icon-nuclearinfo baseData-icon"></span>'
                    } else if(dataItem[i].codeKey=='Hospital※01'){  //地质灾害隐患点
                        rtStr += '<span class="Database-icon-hospital baseData-icon"></span>'
                    } else if(dataItem[i].codeKey=='Resrrvoir※01'){  //工贸企业
                        rtStr += '<span class="Database-icon-resrrvoir baseData-icon"></span>'
                    } else if(dataItem[i].codeKey=='Portwharf※01'){  //重大危险源
                        rtStr += '<span class="Database-icon-portwharf baseData-icon"></span>'
                    }
                    rtStr += dataItem[i].tabTitle;
                    '</p>'
                    if(dataItem[i].codeKey=='School※01'){  //危化企业
                        rtStr += '<p class="baseData-num">'+dataItem[i].tabNumber+'个</p>'
                    }else if(dataItem[i].codeKey=='Airport※01'){   //煤矿企业
                        rtStr += '<p class="baseData-num">'+dataItem[i].tabNumber+'个</p>'
                    }else if(dataItem[i].codeKey=='Station※01'){  //尾矿库
                        rtStr += '<p class="baseData-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='Nuclearinfo※01'){  //烟花爆竹
                        rtStr += '<p class="baseData-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='Hospital※01'){  //地质灾害隐患点
                        rtStr += '<p class="baseData-num">'+dataItem[i].tabNumber+'个</p>'
                    }else if(dataItem[i].codeKey=='Resrrvoir※01'){  //工贸企业
                        rtStr += '<p class="baseData-num">'+dataItem[i].tabNumber+'个</p>'
                    } else if(dataItem[i].codeKey=='Portwharf※01'){  //重大危险源
                        rtStr += '<p class="baseData-num">'+dataItem[i].tabNumber+'个</p>'
                    }
                    rtStr +='</li>';
                }
            }
            $('.baseData ul').html(rtStr);
            $('.baseData').hide();
            $('.baseData .yellowHover').mouseenter(function () {
                $('.baseData .yellowHover').removeClass('act-titleActive-active');
                $(this).addClass('act-titleActive-active');
                var newClassName = ['Database-icon-school-active-active','Database-icon-hospital-active-active','Database-icon-airport-active-active','Database-icon-station-active-active','Database-icon-resrrvoir-active-active','Database-icon-nuclearinfo-active-active','Database-icon-portwharf-active-active'];
                var $spans = $('.baseData ul li>p>span');
                var index = $(this).parents('li').index();
                $spans.each(function (index,item) {
                    $(item).removeClass(newClassName[index]);
                });
                $(this).find('span').addClass(newClassName[index]);
            });
            $('.baseData .yellowHover').mouseleave(function () {
                $('.baseData .yellowHover').removeClass('act-titleActive-active');
                var newClassName = ['Database-icon-school-active-active','Database-icon-hospital-active-active','Database-icon-airport-active-active','Database-icon-station-active-active','Database-icon-resrrvoir-active-active','Database-icon-nuclearinfo-active-active','Database-icon-portwharf-active-active'];
                var $spans = $('.baseData ul li>p>span');
                $spans.each(function (index,item) {
                    $(item).removeClass(newClassName[index]);
                });
            });
            //点击icon
            $('.baseData .yellowHover').click(function(){
                //todo  点击数字===========应急资源  ??????
                debugger;

                $(".riskListPanel-box").remove();
                $('.act-numActive').removeClass('act-numActive');
                $('.ResourceTrouble-icon').parent('p').removeClass('act-titleActive');
                $('.Trouble-icon').parent('p').removeClass('act-titleActive');
                var codeKey=$(this).parent().attr('codeKey');
                if($(this).hasClass('act-titleActive')){
                    $(this).removeClass('act-titleActive');
                    var newClassName = ['Database-icon-school-active','Database-icon-hospital-active','Database-icon-airport-active','Database-icon-station-active','Database-icon-resrrvoir-active','Database-icon-nuclearinfo-active','Database-icon-portwharf-active'];
                    var $spans = $('.baseData ul li>p>span');
                    $spans.each(function (index,item) {
                        $(item).removeClass(newClassName[index]);
                    });
                    MapMarkerDisplay.clearCodeLayerinfo(codeKey);
                    MapMarkerDisplay.clearCodeLayerinfo("RescueTeam※03PORT");
                }else{
                    var newClassName = ['Database-icon-school-active','Database-icon-hospital-active','Database-icon-airport-active','Database-icon-station-active','Database-icon-resrrvoir-active','Database-icon-nuclearinfo-active','Database-icon-portwharf-active'];
                    var $spans = $('.baseData ul li>p>span');
                    var index = $(this).parents('li').index();
                    $spans.each(function (index,item) {
                        $(item).removeClass(newClassName[index]);
                    });
                    $(this).find('span').addClass(newClassName[index]);
                    $('.yellowHover').removeClass('act-titleActive');
                    $(this).addClass('act-titleActive');
                    if(util.tmpcodekey!="") MapMarkerDisplay.clearCodeLayerinfo(util.tmpcodekey);
                    util.tmpcodekey=codeKey;
                    var opt = {
                        resourceKey: codeKey
                    };
                    G.options.map.fullExtent();
                    self.riskService.getDataList(opt, function (err, data) {
                        debugger;
                        util.provinceCityCountMark(data,codeKey)//标注省市统计
                        var data=data[codeKey];
                        //if(data.length>10000)data.length=10000;//暂时将数据量过大的删除一部分
                        MapMarkerDisplay.addPointsOnMap(codeKey, data);
                    })
                }
            });
            //点击数字=========风险隐患  ResourceTrouble-num
            $('.baseData-num').click(function(){
                var codeKey=$(this).parent().attr('codeKey');
                var title = $(this).siblings('p').find('span').text();
                $('.ResourceTrouble-num').removeClass('act-numActive');
                $('.Trouble-num').removeClass('act-numActive');
                if($(this).hasClass('act-numActive')){
                    $(this).removeClass('act-numActive');
                    if ($(".riskListPanel-box")) {
                        $(".riskListPanel-box").remove();
                    }
                }else{
                    $('.baseData-num').removeClass('act-numActive');
                    $(this).addClass('act-numActive');
                    var opt = {
                        resourceKey: codeKey
                    };
                    self.riskService.getDataList(opt, function (err, data) {
                        util.newData = data;
                        self.createList("all", codeKey, data,title);
                    })
                }
            })

        };
        //行政区划统计
        util.districtStatistics=function (data) {
            //拆分数据类型
            var maps = {},
                dest = [],citydest=[];
            if (!!data) {
                for (var i = 0; i < data.length; i++) {
                    var ai = data[i];
                    if(!!ai.DISTRICT){
                        var district=ai.DISTRICT.substring(0,2)+"0000";//省
                         var citydistrict=ai.DISTRICT.substring(0,4)+"00";//市
                        if(util.CityDataArr.indexOf(ai.DISTRICT)!=-1)
                        {
                            citydistrict=ai.DISTRICT;
                        }
                        if (!maps[district]) {
                            dest.push({
                                DISTRICT: district,
                                count: 1
                            });
                            maps[district] = ai;
                        } else {
                            for (var j = 0; j < dest.length; j++) {
                                var dj = dest[j];
                                var district=ai.DISTRICT.substring(0,2)+"0000";
                                if (dj.DISTRICT.substring(0,2)+"0000" == district) {
                                    dj.count++;
                                    break;
                                }
                            }
                        }
                        // if(citydistrict.indexOf('0000')!=-1)//数据如果没有区分城市
                        // {
                        //     citydistrict=citydistrict.substring(0,2)+"0100";
                        // }
                        if (!maps[citydistrict]) {
                            citydest.push({
                                DISTRICT: citydistrict,
                                count: 1
                            });
                            maps[citydistrict] = ai;
                        } else {
                            for (var j = 0; j < citydest.length; j++) {
                                var dj = citydest[j];
                                // var citydistrict=ai.DISTRICT.substring(0,4)+"00";
                                // if(dj.DISTRICT.indexOf('0000')!=-1)
                                // {
                                //     dj.DISTRICT=dj.DISTRICT.substring(0,2)+"0100";
                                // }
                                if (dj.DISTRICT.substring(0,4)+"00" == citydistrict) {
                                    dj.count++;
                                    break;
                                }
                                else if(dj.DISTRICT==citydistrict)
                                {
                                    dj.count++;
                                    break;
                                }
                            }
                        }
                    }

                }
            }
            var alldest={};
            alldest.dest=dest;
            alldest.citydest=citydest;
            //分好的组
            return alldest;
        };
        //查询城市
        util.queryCity=function (cb) {
            $.ajax({
                url: EMAP_CONFIG.common.mongoService + '/dataOperate/queryMulti',
                dataType: 'json',
                type: 'post',
                data: {
                    eId: 'safety',
                    data: JSON.stringify({
                        'BAS_CITY': {
                            'query': {}
                        }
                    })
                },
                success: function (data) {
                    var data = data.data;
                    var list = data[Object.keys(data)[0]];
                    cb(list)
                },
                error: function (err) {
                    cb && cb(err);
                }
            })
        }
        return util
    });