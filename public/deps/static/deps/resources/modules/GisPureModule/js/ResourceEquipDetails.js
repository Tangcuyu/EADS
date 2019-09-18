/**
 * @title: 监控视频
 */

require.config({
    shim: {},
    paths: {}
});
define(["jquery","queryData","DetailInfoServices","FireTeamDetail","RepersityDetail","ExpertInfoDetail","RescueTeamDetail","WarbaseDetail"],
    function ($, queryData,DetailInfoServices,FireTeamDetail,RepersityDetail,ExpertInfoDetail,RescueTeamDetail,WarbaseDetail) {
    var util = {};
    util.DetailInfoServices = new DetailInfoServices({
        serverUrl: EMAP_CONFIG.common.mongoService
    });
    //监控视频
    util.getMoreInf=function(data,layerId,eleInf){
        var self=this;
        var param={};
        var tableName=data.tag.tableName;
        var id=data.tag.id;
        var query={"_id":id};
        param[tableName]={};
        param[tableName].query=query;

        var TITLENAME=data.tag.TITLENAME;
        var callBack=function(newData){
            for(var key in newData){
                var dataInf=newData[key][0];
                for(var keyTwo in data){
                    if(keyTwo!="tag"){
                        dataInf[keyTwo]=data[keyTwo];
                    }
                }
                dataInf.tag.TITLENAME=TITLENAME;
                G.options.commonGIS._openPopupBlinck(layerId,dataInf,eleInf);
            }
        }
        queryData.queryAllEquField(param,callBack);
    };
    /**
     * 资源分析点击图标查询详情框
     */
     util.analoGetMoreInf=function(tagIng,layerid,point){
        var self=this;

        var tableTatle=tagIng.table_label;
         var queryParam={};
        if(G.equConfig)
        {
            queryParam=G.equConfig.queryParam;
        }
        var queryParamStr=JSON.stringify(queryParam);
        var reg=new RegExp("rescueIdPlaceCode","g");
        var queryStr=new RegExp("tag.RESCUEID","g");
        var queryParamStrNew=queryParamStr.replace(reg,tagIng.id);
        if(tagIng.table_label=="装备"){//装备的需要换query的key
            queryParamStrNew=queryParamStrNew.replace(queryStr,"_id");
        }
        var queryParamJson=JSON.parse(queryParamStrNew);
        var param={};
        if(tagIng.table_label=="装备"){
            var eleEquConfig=queryParamJson[tagIng.table_name];
            eleEquConfig.select=eleEquConfig.select+" tag.RESCUEID";
            param[tagIng.table_name]=eleEquConfig;
            //详情框回调
            var callBack=function(data){
                var callBackTwo=function(dataTwo){
                    var resDataInf=dataTwo.attributes;
                    var zd={"NAME":"","ADDRESS":"","LEADER":"","LEADERMTEL":""};
                    for(var n=0;n<resDataInf.length;n++){
                        if(zd.hasOwnProperty(resDataInf[n].name)){
                            data[0].tag[resDataInf[n].name]=resDataInf[n].value;
                        }
                    }
                    util.jointPanel(data,tableTatle,point,layerid,"",tagIng.table_name);
                }
                var rescueId=data[0].tag.RESCUEID;
                //救援队查询详情
                var param = {
                    tableName: "EQUIP_TEA_RESCUE",
                    dataId: rescueId
                }
                queryData.queryDetail(param,callBackTwo);
            }
            queryData.queryEquDetail(param,callBack);
        }else{
            param.tableName=tagIng.table_name;
            param.dataId=tagIng.id;
            param.label=tagIng.table_label;
            if(tagIng.table_name=="EQUIP_TEA_RESCUE"
                // ||tagIng.table_name=="JC_FIRETEAMSTA"
            ){
                param.equConfig=queryParamJson;
            }
            //详情框回调
            var callBack=function(data){
                util.jointPanel(data,tableTatle,point,layerid);
            }
            if(param.tableName=="JC_REPERTORY")//dataId 储备库
            {
                var id = param.dataId;
                var callBack = function (data) {
                    var point = new g2.geom.Point({
                            x: parseFloat(data.result.tag.LONGITUDE),
                            y: parseFloat(data.result.tag.LATITUDE),
                            spatialReference: G.options.map.spatialReference
                        }
                    );
                    data.result.point = point;
                    RepersityDetail.showDetailPanel(data.result);
                    // G.options.commonGIS._blinkHighlight("ANJIAN_REPERTORY※01", point.x,point.y, true);
                }
                self.DetailInfoServices.getReposityDetail(id, callBack, self);
            }
            else if(param.tableName=="JC_FIRETEAMSTA")//消防队站
            {
                var id = param.dataId;
                var callBack = function (data) {
                    var point = new g2.geom.Point({
                            x: parseFloat(data.result.tag.LONGITUDE),
                            y: parseFloat(data.result.tag.LATITUDE),
                            spatialReference: G.options.map.spatialReference
                        }
                    );
                    data.result.point = point;
                    FireTeamDetail.showDetailPanel(data.result);
                    // G.options.commonGIS._blinkHighlight("JC_FIRETEAMSTA※03", point.x,point.y, true);
                }
                self.DetailInfoServices.getFireTeamDetail(id, callBack, self);
            }
            else if(param.tableName=="JYXX_TEA_RESCUE")//队伍新表（资源查询用）
            {
                var id = param.dataId;
                var callBack = function (data) {
                    var point = new g2.geom.Point({
                            x: parseFloat(data.result.tag.LONGITUDE),
                            y: parseFloat(data.result.tag.LATITUDE),
                            spatialReference: G.options.map.spatialReference
                        }
                    );
                    data.result.point = point;
                    FireTeamDetail.showDetailPanel(data.result);
                    // G.options.commonGIS._blinkHighlight("JC_FIRETEAMSTA※03", point.x,point.y, true);
                }
                self.DetailInfoServices.getFireTeamDetail(id, callBack, self);
            }
            else
            {
                queryData.queryDetail(param,callBack);
            }
        }


    };
    /**
     * 点击详情
     */
    util.detailsMoreInf=function(layerid,id,point){
        var self=this;
        debugger
        if(layerid.indexOf('MaterialStore')>-1){
            G.options.commonGIS.clearHighlight();
            var callBack = function(data){
                //移动视野
                var tagObj={};
                var tempItem={};
                var geom={
                    type:"Point",
                    coordinates:[data.result.tag.LONGITUDE,data.result.tag.LATITUDE]
                }
                tempItem.geom=geom;
                tempItem.tag=tagObj;
                //tempItem.view=true;
                tempItem.center=true;
                G.options.commonGIS._openPopupBlinck('MaterialStoreLayer', tempItem);
                //计算距离
                var points=[];
                var pointStart=new g2.geom.Point({
                        x: parseFloat(G.centerPoint.x),
                        y: parseFloat(G.centerPoint.y),
                        spatialReference: G.options.map.spatialReference
                    }
                );
                points.push(pointStart);
                var pointEnd=new g2.geom.Point({
                        x: parseFloat(data.result.tag.LONGITUDE),
                        y: parseFloat(data.result.tag.LATITUDE),
                        spatialReference: G.options.map.spatialReference
                    }
                );
                points.push(pointEnd);
                var distance=util.measurePolyline(points);
                data.result.distance=distance;
                data.result.point=pointEnd;
                RepersityDetail.showDetailPanel(data.result);
            }
            util.DetailInfoServices.getReposityDetail(id,callBack,this);
        };
        if(layerid.indexOf('MaterialBase')>-1){
            G.options.commonGIS.clearHighlight();
            var callBack = function(data){
                //移动视野
                var tagObj={};
                var tempItem={};
                var geom={
                    type:"Point",
                    coordinates:[data.result.longitude,data.result.latitude]
                }
                tempItem.geom=geom;
                tempItem.tag=tagObj;
                //tempItem.view=true;
                tempItem.center=true;
                G.options.commonGIS._openPopupBlinck('MaterialBaseLayer', tempItem);
                //计算距离
                var points=[];
                var pointStart=new g2.geom.Point({
                        x: parseFloat(G.centerPoint.x),
                        y: parseFloat(G.centerPoint.y),
                        spatialReference: G.options.map.spatialReference
                    }
                );
                points.push(pointStart);
                var pointEnd=new g2.geom.Point({
                        x: parseFloat(data.result.longitude),
                        y: parseFloat(data.result.latitude),
                        spatialReference: G.options.map.spatialReference
                    }
                );
                points.push(pointEnd);
                var distance=util.measurePolyline(points);
                data.result.distance=distance;
                data.result.point=pointEnd;
                WarbaseDetail.showDetailPanel(data.result);
            }
            util.DetailInfoServices.getWarBaseDetail(id,callBack,this);
        };
        if(layerid.indexOf('RescueTeam')>-1){
            G.options.commonGIS.clearHighlight();
            if(layerid.indexOf('rescueTeamT003')>-1){
                var callBack = function(data){
                    //移动视野
                    var tagObj={};
                    var tempItem={};
                    var geom={
                        type:"Point",
                        coordinates:[data.result.tag.LONGITUDE,data.result.tag.LATITUDE]
                    }
                    tempItem.geom=geom;
                    tempItem.tag=tagObj;
                    //tempItem.view=true;
                    tempItem.center=true;
                    G.options.commonGIS._openPopupBlinck(layerid, tempItem);
                    //计算距离
                    var points=[];
                    var pointStart=new g2.geom.Point({
                            x: parseFloat(G.centerPoint.x),
                            y: parseFloat(G.centerPoint.y),
                            spatialReference: G.options.map.spatialReference
                        }
                    );
                    points.push(pointStart);
                    var pointEnd=new g2.geom.Point({
                            x: parseFloat(data.result.tag.LONGITUDE),
                            y: parseFloat(data.result.tag.LATITUDE),
                            spatialReference: G.options.map.spatialReference
                        }
                    );
                    points.push(pointEnd);
                    var distance=util.measurePolyline(points);
                    data.result.distance=distance;
                    data.result.point=pointEnd;
                    FireTeamDetail.showDetailPanel(data.result);
                }
                util.DetailInfoServices.getFireTeamDetail(id,callBack,this);
            }else{
                var callBack = function(data){
                    //移动视野
                    var tagObj={};
                    var tempItem={};
                    var geom={
                        type:"Point",
                        coordinates:[data.result.tag.LONGITUDE,data.result.tag.LATITUDE]
                    }
                    tempItem.geom=geom;
                    tempItem.tag=tagObj;
                    ///tempItem.view=true;
                    tempItem.center=true;
                    G.options.commonGIS._openPopupBlinck(layerid, tempItem);
                    //计算距离
                    var points=[];
                    var pointStart=new g2.geom.Point({
                            x: parseFloat(G.centerPoint.x),
                            y: parseFloat(G.centerPoint.y),
                            spatialReference: G.options.map.spatialReference
                        }
                    );
                    points.push(pointStart);
                    var pointEnd=new g2.geom.Point({
                            x: parseFloat(data.result.tag.LONGITUDE),
                            y: parseFloat(data.result.tag.LATITUDE),
                            spatialReference: G.options.map.spatialReference
                        }
                    );
                    points.push(pointEnd);
                    var distance=util.measurePolyline(points);
                    data.result.distance=distance;
                    data.result.point=pointEnd;
                    RescueTeamDetail.showDetailPanel(data.result);
                };
                util.DetailInfoServices.getRescueTeamDetail(id,callBack,this);
            }
        };
    };
    /**
     * 获取距离
     * @private
     */
    util.measurePolyline=function(pointArr){
        var path = new g2.geom.Path({
            spatialReference: G.options.map.spatialReference
        });
        for(var i=0,len=pointArr.length;i<len;i++){
            path.addPoint(pointArr[i]);
        }
        var polyline = new g2.geom.Polyline({
            spatialReference: G.options.map.spatialReference
        });
        polyline.addGeometry(path);
        var projectService = new g2.ext.ProjectService();
        var measureService = new g2.ext.MeasureService({projectService: projectService});
        var length = measureService.length(polyline);
        return length;
    };
    /**
     * 拼接详情框里的html
     */
        util.jointPanel=function(tag,tableTatle,point,layerid,selfCss,tableName){
        var self=this;
        var contentTemplate = '<div class="popup_self_class popup_self_class_Z">';
        if(tableTatle!="-"){
            if(!tag.attributes)
            {
                if(tag[0].tag.EQUIPTYPENAME)
                {
                    contentTemplate+='<div class="title-title-title">'+tag[0].tag.EQUIPTYPENAME+'<a class="detail-container-close detail_hd_close"></a></div><div id="inf_box" class="inf_box common-detailContent"></div></div>';
                }
                else
                {
                    contentTemplate+='<div class="title-title-title">'+tag[0].tag.NAME+'<a class="detail-container-close detail_hd_close"></a></div><div id="inf_box" class="inf_box common-detailContent"></div></div>';
                }
            }
            else
            {
                contentTemplate+='<div class="title-title-title">'+tag.attributes[0].value+'<a class="detail-container-close detail_hd_close"></a></div><div id="inf_box" class="inf_box common-detailContent"></div></div>';
            }
        }else{
            contentTemplate+='<div class="title-title-title">'+tag.attributes[0].value+'<a class="detail-container-close detail_hd_close"></a></div><div class="common-detailContent" id="inf_box"></div></div>';
        }

        var offsetXY=[-100, -585];
        var classSelf="g2-tooltip-sml";
        if(selfCss){
            offsetXY=selfCss.offsetXY;
            classSelf="g2-tooltip-sml";
        }
        var tooltip = new g2.ext.Tooltip({
            anchor: point,  //提示在地图上停靠位置
            content: contentTemplate,  //提示内容
            autoPan:true,
            layerId: layerid, //提示所在图层ID
            offset: offsetXY, //位置偏移量
            className: classSelf //tooltip样式
        });
            G.options.toolTipWare.clear();
            G.options.toolTipWare.add(tooltip);

            if(layerid=="DisasterPerLayer")
            {
                $('.common-detailContent').addClass('yjzxdetail');
            }
            else {

            }

        $('.detail_hd_close').click(function (e) {
            G.options.toolTipWare.clear();
        })
        if(Object.keys(tag).length>2){//多tab的详情
            util.moreTabPop(tag);
        }else{//单tab详情
            util.singleTabPop(tag,tableTatle,tableName);
        }


    };
        util.singleTabPop=function(tag,tableTatle,tableName){
        for(var key in tag){
            if(key!="id"){
                var eleTabInf=tag[key];
                var eleHtml="<div style='color: #0d223b' class='attributes_content_div'>";
                if(tableTatle=="装备"){
                    var equipConfig=G.equConfig.equipConfig;
                    var allInf=eleTabInf.tag;
                    var allEleEquCon=equipConfig[tableName];
                    eleHtml+="<div>所属单位:<span title='"+allInf.NAME+"'>"+allInf.NAME+"</span></div>";//所属单位
                    eleHtml+="<div><label>联系人:<span>"+allInf.LEADER+"</span><span>"+allInf.LEADERMTEL+"</span></label></div>";//联系人
                    // eleHtml+="<div>联系电话:<span>"+allInf.LEADERMTEL+"</span></div>";//联系电话
                    eleHtml+="<div>驻地位置:<span title='"+allInf.ADDRESS+"'>"+allInf.ADDRESS+"</span></div>";//驻地位置
                    eleHtml+="<div>主要装备:<span>"+allInf.EQUIPTYPENAME+"</span></div>";//主要装备放到第一位
                    for(var mKey in allInf){
                        var disLaberName=allEleEquCon[mKey];
                        var disValueName=allInf[mKey]||"-";
                        if(disLaberName){
                            if(typeof(disValueName)=="object"){//如果是个关联表对象
                                eleHtml+="<div>"+disLaberName+":<span>"+disValueName.tag.PARAMETERNAME+"</span></div>";
                            }else{
                                if(disValueName.indexOf(":")!=-1){//核心参数
                                    eleHtml+="<div><span>"+disValueName+"</span></div>";
                                }else{
                                    eleHtml+="<div>"+disLaberName+":<span>"+disValueName+"</span></div>";
                                }
                            }
                        }
                    }
                }else{
                    if (eleTabInf.length<=0){
                        eleHtml+="暂无数据";
                    }
                    for(var eleKey in eleTabInf){
                        if(eleTabInf[eleKey].label){
                            var valueName="-";
                            if(eleTabInf[eleKey].value){
                                valueName=eleTabInf[eleKey].value;
                            }
                            eleHtml+="<div>"+eleTabInf[eleKey].label+":<span>"+valueName+"</span></div>";
                        }
                        else
                        {
                            var valueName="-";
                            if(eleTabInf[eleKey].value){
                                valueName=eleTabInf[eleKey].value;
                            }
                            var label="";
                            if(eleTabInf[eleKey].name=="SHELTERNAME"){
                                label="名称";
                            }
                           else if(eleTabInf[eleKey].name=="DISTRICTCODE"){
                                label="行政区划";
                            }
                            else if(eleTabInf[eleKey].name=="DUTYTEL"){
                                label="值班电话";
                            }
                            else if(eleTabInf[eleKey].name=="OPENTIME"){
                                label="开放时间";
                            }
                            else if(eleTabInf[eleKey].name=="ABACUSAREA"){
                                label="蓬宿区面积";
                            }
                            else if(eleTabInf[eleKey].name=="LEVELCODE"){
                                label="等级";
                            }
                            else if(eleTabInf[eleKey].name=="ADDRESS"){
                                label="地址";
                            }
                            else if(eleTabInf[eleKey].name=="MAXPERSONNUM"){
                                label="可容纳人数";
                            }
                            else if(eleTabInf[eleKey].name=="CHARGEDEPT"){
                                label="主管单位";
                            }
                            else if(eleTabInf[eleKey].name=="RESPPER"){
                                label="负责人";
                            }
                            else if(eleTabInf[eleKey].name=="RESPOTEL"){
                                label="负责人办公电话";
                            }
                            else if(eleTabInf[eleKey].name=="SHELTERTYPECODE"){
                                label="类型";
                                valueName="避难场所";
                            }
                            eleHtml+="<div>"+label+":<span>"+valueName+"</span></div>";
                        }
                    }

                    eleHtml+="</div>";
                }
                $("#inf_box").append(eleHtml);
            }
        }

    };
        util.moreTabPop=function(tag){
        var self=this;
        var firstClass="";
        var option=[];
        var codeNum=0;
        for(var key in tag){
            if(key!="id"){
                var eleTabInf=tag[key];
                //多tab名称
                var nameTatle="";
                if("attributes"==key){
                    nameTatle="基础信息";
                }else if("equTable"==key){
                    nameTatle="装备信息";
                }else{
                    nameTatle=key;
                }
                var eleHtml1="";
                var eleHtml="<div  style='color: #0d223b' class='attributes_content_div'>";
                if("equTable"==key){
                    eleHtml="";
                }

                //第一个节点
                if(codeNum==0){
                    firstClass="detailDiv"+key;
                }
                if (eleTabInf.length<=0){
                    eleHtml+="暂无数据";
                }else{
                    var equipConfig=G.equConfig.equipConfig;
                    if("equTable"==key){//救援队关联的装备
                        if(!$.isEmptyObject(eleTabInf)){
                            var iindex=0;
                            eleHtml1="<div class=\"sy-fireTeam-equipmentNum\">            <div>主要装备:<span id=\"unkown\"></span></div>            </div><div class='sy-fireTeam-equipmentTableBox'><ul id=\"sy-fireTeam-equipmentlist\">            <div class=\"pt-table-box opt-scroll gis-table\"><table class=\"pt-table pt-table-hover\"><thead><tr><th width=\"10%\" class=\"ta-center\">序号</th><th width=\"20%\">装备类型</th><th width=\"10%\" class=\"ta-center\">装备数量</th><th width=\"10%\" class=\"ta-center\">计量单位</th></tr></thead><tbody>"
                            for(var smlKey in eleTabInf){
                                iindex++;
                                var allEleEquCon=equipConfig[smlKey];
                                var allEleEqu=eleTabInf[smlKey];
                                eleHtml1+="<tr>"
                                for(var n=0;n<allEleEqu.length;n++){
                                    var allInf=allEleEqu[n].tag;
                                    eleHtml1+="<td>"+iindex+"</td>";
                                    eleHtml1+="<td>"+allInf.EQUIPTYPENAME+"</td>";//主要装备放到第一位
                                    eleHtml1+="<td>"+allInf.EQUIPNUM+"</td>"
                                    eleHtml1+="<td>"+allInf.UNITCODE.tag.PARAMETERNAME+"</td>"
                                    // for(var mKey in allInf){
                                    //     var disLaberName=allEleEquCon[mKey];
                                    //     var disValueName=allInf[mKey]||"-";
                                    //     if(disLaberName){
                                    //         if(typeof(disValueName)=="object"){//如果是个关联表对象
                                    //             eleHtml+="<div>"+disLaberName+":<span>"+disValueName.tag.PARAMETERNAME+"</span></div>";
                                    //         }else{
                                    //             if(disValueName.indexOf(":")!=-1){//核心参数
                                    //                 eleHtml+="<div><span>"+disValueName+"</span></div>";
                                    //             }else{
                                    //                 eleHtml+="<div>"+disLaberName+":<span>"+disValueName+"</span></div>";
                                    //             }
                                    //         }
                                    //     }
                                    // }
                                }
                                eleHtml1+="</tr>"
                            }
                            eleHtml1+="</tbody></table></ul></div>";
                        }else{
                            eleHtml1+="";
                        }
                    }else if("attributes"==key){//救援队，装备，灾情信息员，储备库的通用
                        for(var eleKey in eleTabInf){
                            if(eleTabInf[eleKey].label){
                                var valueName="-";
                                if(eleTabInf[eleKey].value){
                                    valueName=eleTabInf[eleKey].value;
                                }
                                if(eleKey=="3")
                                {
                                    eleHtml+="<div class='singlelines'><label title='"+valueName+"'>"+eleTabInf[eleKey].label+":<span>"+valueName+"</span><span>"+eleTabInf["4"].value+"</span></label></div>";
                                }
                                else
                                {
                                    if(eleKey!="4")
                                    {
                                        eleHtml+="<div class='singlelines'><label title='"+valueName+"'>"+eleTabInf[eleKey].label+":<span>"+valueName+"</span></label></div>";
                                    }
                                }
                            }

                        }
                    }else{//储备库关联的储备物资
                        if(!eleTabInf[0].attributes){
                            eleHtml+=""
                        }
                        else{
                            for(var eleKey in eleTabInf){
                                var smlEle=eleTabInf[eleKey].attributes;
                                eleHtml+="<div class='gl_equ_inf_ele'>"
                                for(var n=0;n<smlEle.length;n++){
                                    if(smlEle[n].label){
                                        var valueName="-";
                                        if(smlEle[n].value){
                                            valueName=smlEle[n].value;
                                        }
                                        eleHtml+="<div>"+smlEle[n].label+":<span>"+valueName+"</span></div>";
                                    }
                                }
                                eleHtml+="</div>"
                            }
                        }
                    }
                }

                eleHtml+="</div>";

                $("#inf_box").append(eleHtml);
                if(eleHtml1!="")
                {
                    $('.attributes_content_div').append(eleHtml1);
                }

                // var eleOption={};
                // eleOption.key=nameTatle;
                // eleOption.name="detailDiv"+key;
                // eleOption.value=eleHtml;
                // option.push(eleOption);
                // codeNum++;
            }
        }
        // var options = {
        //     containerId: "inf_box",
        //     data: {
        //         class: 'myred',
        //         name: 'tabName',
        //         type: 'border-card',
        //         options: option,
        //         activeName: firstClass
        //     },
        //     methods: {
        //     }
        // };
        // GS.gs_tabs.create(options);
    };
    return util;
});