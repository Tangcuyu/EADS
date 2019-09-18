/**
 * Created by melon on 2018/7/12.
 */
/**
 * 煤矿企业
 */
define([], function () {
    var detail = {};


    /**
     *
     * @param cb
     */
    detail.loadTemplate = function (cb) {
        var template = '<div class="bj-jywz-detaileContainer" id="dangerQY-detail-container">\
      \<div class="title-title-title bj-jywz-detaileTitle">\
      \<span title="{{title}}">{{name}}</span><a href="javascript:;" class="detail-container-close" name="detailclose"></a>\
      \</div>\
      \<div class="common-detailContent bj-jywz-detaileContent bj-dangerousChemical-detaileContent">\
      \<div class="bj-rescueForces-detailListBox">\
         \<div class="bj-rescueForces-detailList">\
            \<div class="bj-rescueForces-detailListLeft">\
            \<ul>\
                \<li><i>行政区划：</i><span class="list_nowarp">{{district}}</span></li>\
                \<li><i>矿井地址：</i><span class="list_nowarp" title="{{ADDRESStitle}}">{{ADDRESS}}</span></li>\
            \</ul>\
        \</div>\
       \<div class="bj-rescueForces-detailListRight">\
            \<p>距离事发地</p>\
            \<p><span>{{distance}}</span></p>\
        \</div>\
        \</div>\
            </div>\
      \<ul class="ul_nowarp">\
      \<li><span><i>矿井状态：</i><b title="{{statetitle}}" >{{state}}</b></span><span><i>职工人数：</i><b>{{WORERNUM}}</b></span></li>\
      \<li><span><i class="yjzh-list-maxlength" style="width: 285px;">设计生产能力（万吨/年）：</i><b style="width: 20%">{{DESIGN_OUTPUT}}</b></span><span><i style="width: 125px">调度室电话：</i><b>{{CONTROLCENTERTEL}}</b><img src="'+ webApp + 'src/modules/RiskAndResourceModule/img/tell.png"  class="allphone" key="{{PHONEKEY}}" style="display:none"/></span></li>\
      \<li><span><i>瓦斯等级：</i><b>{{ws}}</b></span><span><i>投产时间：</i><b>{{PRODUCT_DATE}}</b></span></li>\
      \<li><span><i>开拓方式：</i><b>{{mine}}</b></span><span><i>上级企业：</i><b>{{PARENTNAME}}</b></span></li>\
      \</ul>\
    \</div >\
    \</div > ';
    // <li><span><i>主要灾害类型：</i><b title="{{RF_LITHOLOGYtitle}}">{{RF_LITHOLOGY}}</b></span></li>  暂时没有字段先留着
        cb && cb.call(this, template);
    }

    /**
     *
     * @param data
     */
    detail.showPanel = function (data) {
        var containerId = '';
        this.loadTemplate(function (template) {
            var html = template,
                tag = data.tag || {},
                district = data.district || {},
                state = data.state || {},
                type = data.type || {},
                dept = data.dept || {},
                mine = data.mine || {},
                ventilatestyle=data.vent || {},
                ws = data.ws || {},
                hydro = data.hydro || {},
                power = data.power || {},
                transmit = data.transmit || {};

            var data2show = {};
            data2show.name = tag.COALNAME || "";
            data2show.title = tag.COALNAME || "";
            if(isNaN(data.distance)){
                data2show.distance = "";

            }else{
                data2show.distance = parseFloat(data.distance).toFixed(2) + "km" || "";
            }

            data2show.district = district.tag? district.tag.DISTRICTNAME : "";
            data2show.state = state.tag? state.tag.COALSTATENAME : "";
            data2show.statetitle = state.tag? state.tag.COALSTATENAME : "";
            data2show.type = type.tag? type.tag.COALTYPENAME : "";
            data2show.dept = dept.tag? dept.tag.DEPTCLASSNAME : "";
            data2show.mine = mine.tag? mine.tag.MINESTYLENAME : "";
            data2show.ws = ws.tag? ws.tag.WS_GRADENAME : "";
            data2show.hydro = hydro.tag? hydro.tag.HYDROGEOLOGICALNAME : "";
            data2show.power = power.tag? power.tag.OWERSTYLENAME : "";
            data2show.transmit = transmit.tag? transmit.tag.TRANSMITSTYLENAME : "";


            data2show.ADDRESS = tag.ADDRESS || "";
            data2show.ADDRESStitle = tag.ADDRESS || "";
            data2show.DESIGN_OUTPUT = tag.DESIGN_OUTPUT || "";
            data2show.CONTROLCENTERTEL = tag.CONTROLCENTERTEL || "";
            data2show.PHONEKEY = tag.CONTROLCENTERTEL || "";
            data2show.PARENTNAME = tag.PARENTNAME || "";
            data2show.APPROVED_MINE_DEPTH = tag.APPROVED_MINE_DEPTH || "";
            data2show.MINE_WATERBURST = tag.MINE_WATERBURST || "";
            data2show.MINE_WATERBURST_MAX = tag.MINE_WATERBURST_MAX || "";
            data2show.RF_LITHOLOGY = tag.RF_LITHOLOGY || "";
            data2show.RF_LITHOLOGYtitle = tag.RF_LITHOLOGY || "";


            data2show.PROVED_OUTPUT = tag.PROVED_OUTPUT || "";
            data2show.WORERNUM = tag.WORERNUM || "";
            data2show.LEGAL_NAME = tag.LEGAL_NAME || "";
             data2show.VENTILATESTYLE = ventilatestyle.tag? ventilatestyle.tag.VENTILATESTYLENAME: "";
            data2show.STANDARDCLASS = tag.STANDARDCLASS || "";
            data2show.PRODUCT_DATE = timegeshi(tag.PRODUCT_DATE) || "";

            function timegeshi(time) {
                var str = '';
                str+=time.split('T')[0]+'/'+time.split('T')[1].substr(0,8);
                return str
            }

            //
            for (var k in data2show) {
                var regex = new RegExp('\{\{' + k + '\}\}');
                html = html.replace(regex, data2show[k]);
            }
            G.options.commonGIS._addPopupDetaills(data.point,html,[-230, -35]);
            if(data2show.distance==""){
                $(".bj-rescueForces-detailListRight").css('display','none');
            }
            this.contentDom = jQuery('#dangerQY-detail-container');
            //
            var self=this;
            this.contentDom.find('[name=detailclose]').on('click',function(){
                self.clear();
            });
        });
    }

    /**
     * 清除框
     */
    detail.clear = function () {
        G.options.toolTipWare.clear();
    };
    return detail;
});