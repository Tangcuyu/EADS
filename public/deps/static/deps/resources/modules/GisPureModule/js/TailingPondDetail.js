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
        var template = '<div class="bj-jywz-detaileContainer" id="dangerQY-detail-container-weikuang">\
            \<div class="bj-jywz-detaileTitle title-title-title">\
            \<span title="{{title}}">{{name}}</span><a href="javascript:;" class="detail-container-close" name="detailclose"></a>\
            \</div>\
            \<div class="bj-jywz-detaileContent bj-dangerousChemical-detaileContent common-detailContent">\
            \<div class="bj-rescueForces-detailListBox">\
            \<div class="bj-rescueForces-detailList">\
            \<div class="bj-rescueForces-detailListLeft">\
            \<ul>\
            \<li><i>行政区划：</i><span class="list_nowarp">{{district}}</span></li>\
            \<li><i>所在地址：</i><span class="list_nowarp">{{ADDRESS}}</span></li>\
            \</ul>\
            \</div>\
            \<div class="bj-rescueForces-detailListRight">\
            \<p>距离事发地</p>\
            \<p><span>{{distance}}</span></p>\
            \</div>\
            \</div>\
            </div>\
            \<ul class="ul_nowarp">\
            \<li><span><i>运行状况：</i><b>{{state}}</b></span></li>\
            \<li><span><i>主要负责人：</i><b style="width: 20%">{{LEGAL_NAME}}</b></span><span><i style="width: 290px">主要负责人办公电话：</i><b>{{CONTROLCENTERTEL}}</b><img src="'+ webApp + 'src/modules/RiskAndResourceModule/img/telphoon.png"  class="allphone" key="{{CONTROLCENTERTEL}}" style="display:none"/></span></li>\
            \<li><span><i>是否属于重大危险源：</i><b style="width: 20%">{{SFSYZDWXY}}</b></span><span><i>特种作业人数：</i><b>{{PROVED_OUTPUT}}</b></span></li>\
            \<li><span><i>普通工人总人数：</i><b style="width: 20%">{{WORERNUM}}</b></span><span><i>尾矿库型式：</i><b>{{type}}</b></span></li>\
            \<li><span><i>尾矿库等级：</i><b style="width: 20%">{{dept}}</b></span><span><i>目前堆积坝高度：</i><b>{{MQDJBGD}}</b></span></li>\
            \<li><span><i>目前主坝长：</i><b>{{RF_LITHOLOGY}}</b></span><span><i style="width: 224px">尾矿库现状安全度：</i><b>{{mine}}</b></span></li>\
            \</ul>\
            \</div >\
            \</div > ';
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
                ws = data.ws || {},
                transmit = data.transmit || {};

            var data2show = {};
            data2show.name = tag.WKKMC || "";
            data2show.title = tag.WKKMC || "";
            if(isNaN(data.distance)){
                data2show.distance = "";
            }else{
                data2show.distance = parseFloat(data.distance/1000).toFixed(2) + "km" || "";
            }
            data2show.district = district.tag? district.tag.DISTRICTNAME : "";
            data2show.state = state.tag? state.tag.RUNSTATUSNAME : "";
            data2show.type = type.tag? type.tag.TAILINGPONDTYPEMC : "";
            data2show.dept = dept.tag? dept.tag.WKKDBNAME : "";
            data2show.mine = mine.tag? mine.tag.WKKAQDNAME : "";
            data2show.ws = ws.tag? ws.tag.WKKDBNAME : "";
            data2show.LEGAL_NAME = tag.WKKFZR || "";
            data2show.MQDJBGD = tag.MQDJBGD || "";
            //是否属于重大危险源
            var SFSYZDWXY=tag.SFSYZDWXY;
            if(SFSYZDWXY==1){
                data2show.SFSYZDWXY="否";
            }else if(SFSYZDWXY==9){
                data2show.SFSYZDWXY="未知";
            }else{
                data2show.SFSYZDWXY="是";
            }
            // data2show.hydro = hydro.tag? hydro.tag.HYDROGEOLOGICALNAME : "";
            // data2show.power = power.tag? power.tag.OWERSTYLENAME : "";
            // data2show.transmit = transmit.tag? transmit.tag.TRANSMITSTYLENAME : "";
            data2show.ADDRESS = tag.WKKDZMC || "";
            data2show.DESIGN_OUTPUT = tag.XZQKR || "";
            data2show.CONTROLCENTERTEL = tag.WKKFZRBGSDH || "";
            data2show.PHONEKEY = tag.WKKFZRYDDH || "";
            data2show.PARENTNAME = tag.AQSCXKZFZJG || "";
            data2show.APPROVED_MINE_DEPTH = tag.AQSCXKZ || "";
            data2show.MINE_WATERBURST = tag.KC || "";
            data2show.MINE_WATERBURST_MAX = tag.KDPD || "";
            data2show.RF_LITHOLOGY = tag.MQZBC || "";

            data2show.AQSCXKZJZRQ=tag.AQSCXKZJZRQ || "";
            data2show.PROVED_OUTPUT = tag.TZZYRYSL || "";
            data2show.WORERNUM = tag.PTGRZRS || "";
            data2show.AQFZR=tag.AQFZR || "";
            data2show.VENTILATESTYLE = tag.AQFZRYDDH||"";
            data2show.STANDARDCLASS = tag.STANDARDGRADE || "";
            data2show.QZRQ = tag.QZRQ || "";
            //
            for (var k in data2show) {
                var regex = new RegExp('\{\{' + k + '\}\}');
                html = html.replace(regex, data2show[k]);
            }
            G.options.commonGIS._addPopupDetaills(data.point,html,[-230, -35]);
            if(data2show.distance==""){
                $(".bj-rescueForces-detailListRight").css('display','none');
            }
            this.contentDom = jQuery('#dangerQY-detail-container-weikuang');
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