/**
 * @title:监测管理
 */
define(["jquery"], function ($) {
    var module = G.base.ModuleBase;
    var util = {
        options: {
            /**
             * 控件名称，必须与类名一致
             */
            name: 'legendControlModule',
            /**
             * 默认配置文件名
             */
            config: false
        },
        includes: G.base.ContainerManager.prototype,
        /***
         * @constructor
         * @param options
         */

        initialize: function (options) {
            //基类初始化
            module.prototype.initialize.call(this, options);
            //
        },
        /**
         * 打开
         * @method
         *
         * */
        onOpen: function () {

        },
        /**
         * 拼接初始的图例
         */
        legend: function () {
            var self = this;
            G.addOrRemoveLegendFor = self.addOrRemoveLegend;
            $("#legend_all_id").remove();
            $("#map").append("<div id='legend_all_id'></div>");
            $("#legend_all_id").load(webApp + "src/modules/legendControlModule/html/legendControl.html", function () {
                var fixLegends = G.eventModuleConfig.fixationLegendConfig;
                var html = "";
                for (var key in fixLegends) {
                    if(fixLegends[key].isShow=="true")//图例判断
                    {
                        html += "<div code=" + fixLegends[key].layerId + " class='ele_legend_class legend_sign_class'>";
                    }
                    else
                    {
                        html += "<div code=" + fixLegends[key].layerId + " class='ele_legend_class'>";
                    }
                    html += "<span class='img_class'><img src='" + webApp + "src/modules/legendControlModule/img/legend/" + fixLegends[key].png + "'></span>";
                    html += "<span title='"+fixLegends[key].name+"'>" + fixLegends[key].name + "</span></div>";
                }
                $(".legendControl_content").append(html);
                $("#legend_all_id").niceScroll({
                    cursorborder:'',
                    cursorcolor:'#ccc'
                });
                self.legendClick();
            });
        },
        /**
         * 添加或删除图例
         */


        addOrRemoveLegend: function (code) {
            var self = this;
            //储备库和战保基地图例code
            if(code.type.indexOf("MaterialBase")>-1){
                code.type="MaterialBase";
            }
            if(code.type.indexOf("MaterialStore")>-1){
                code.type="MaterialStore";
            }
            if(code.isChoice){//是否是选中
                //如果图例框内无此图例则添加
                if (!($(".legendControl_content").find(".ele_legend_class[code=" + code.type + "Layer]").length > 0)) {
                    var html = ""
                    html += "<div code='" + code.type + "Layer' class='ele_legend_class legend_sign_class'>";
                    html += "<span class='img_class'><img src='" + webApp + "src/modules/legendControlModule/img/icon/" + code.type + "_img.png'></span>";
                    html += "<span>" + code.name + "</span></div>";
                    $(".legendControl_content").append(html);
                    util.legendClick();
                }
                //图层控制
                if (G.options.map.getLayerById(code.type + "Layer")) {
                    G.options.map.getLayerById(code.type + "Layer").setVisible(true);
                }
            }else{
                //如果图例框内有此图例则删除
                if (($(".legendControl_content").find(".ele_legend_class[code=" + code.type + "Layer]").length > 0)) {
                    $(".legendControl_content").find(".ele_legend_class[code=" + code.type + "Layer]").remove();
                }
                //图层控制
                if (G.options.map.getLayerById(code.type + "Layer")) {
                    G.options.map.getLayerById(code.type + "Layer").setVisible(false);
                }
            }
            //控制总是显示最下方的图例
            if($(".legendControl_content").length>0){
                $(".legendControl_content").animate({scrollTop:$(".legendControl_content")[0].scrollHeight},1000);
            }
        },
        /**
         * 图例点击
         */
        legendClick: function () {
            var self = this;
            $(".legendControl_content").find(".ele_legend_class").unbind("click").click(function () {
                //清除闪烁
                G.options.commonGIS.clearHighlight();
                if ($(this).hasClass("legend_sign_class")) {
                    $(this).removeClass("legend_sign_class");
                    if (G.options.map.getLayerById($(this).attr("code"))) {
                        G.options.map.getLayerById($(this).attr("code")).setVisible(false);
                    }

                    $('.wave1').css("display","none");
                    //在overlayer上添加的内容
                    if($(this).attr("code")=="earCenterLayer"){
                        $("#gifDiv").css("display","none");
                        $('.wave').css("display","none");
                    }else if($(this).attr("code")=="townsDisLayer"){
                        $(".townsDisLayer-text").css("display","none");
                    }else if($(this).attr("code")=="earDisLayer"){
                        $(".earDisLayeroverlay-buffertext").css("display","none");
                    }
                    else if ($(this).attr("code")=="earInfluenceDisLayer")
                    {
                        $(".liedu").css("display","none");
                    }
                } else {
                    $(this).addClass("legend_sign_class");
                    if (G.options.map.getLayerById($(this).attr("code"))) {
                        G.options.map.getLayerById($(this).attr("code")).setVisible(true);
                        if($(this).attr("code")=="populationDisLayer"){
                            G.modules['PanelSwitchModuleSelf'].heatMapLayerResolutionchanged();
                        }
                    }
                    $('.wave1').css("display","block");
                    //在overlayer上添加的内容
                    if($(this).attr("code")=="earCenterLayer"){
                        $("#gifDiv").css("display","block");
                        $('.wave').css("display","block");
                    }else if($(this).attr("code")=="townsDisLayer"){
                        $(".townsDisLayer-text").css("display","block");
                    }else if($(this).attr("code")=="earDisLayer"){
                        $(".earDisLayeroverlay-buffertext").css("display","block");
                    }
                    else if ($(this).attr("code")=="earInfluenceDisLayer")
                    {
                        $(".liedu").css("display","block");
                    }
                }
            })
        },
        /**
         * 关闭
         * @method
         *
         * */
        onClose: function () {
            //to do
            module.prototype.onClose.call(this);
        },
        /**
         * 销毁
         * @method
         *
         * */
        destroy: function () {
            //
            module.prototype.destroy.call(this);
        }
    };
    return util;
});