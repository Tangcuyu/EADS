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
        var template = '<div class="popup-detail-div sy-expert-detaileContainer alert_dialogStyle1" id="sy-expert-detail-container">\
            \<div class="sy-expert-detaileTitle detail-title">\
            \<span title="{{title}}">{{name}}</span><a href="javascript:;" class="detail_hd_close  detail_hd_close_zz_wo" name="detailclose"></a>\
            \</div>\
            \<div class="sy-expert-detaileContent">\
            \<div class="sy-expert-detailListBox box-box-box">\
            \<div class="sy-expert-detailList">\
            \<div class="sy-expert-detailListLeft">\
            \<ul class="sy_expert_detailListLeft_uls">\
            \<li id="sy_expert_detailListLeft_uls_li">危险源类型:<span id="sy_expert_detailListLeft_uls_span" >{{dangertype}}</span></li>\
            \</ul>\
            \</div>\
            \<div class="sy-expert-detailListRight">\
            \<p>距离事发地:</p>\
            \<p><span>{{distance}}</span></p>\
            \</div>\
            \</div>\
            \</div>\
            \<ul>\
            \<li><span>危险源等级:<b>{{hazardlevel}}</b></span></li>\
            \<li><span>所属区域:<b>{{DISTRICT}}</b></span></li>\
            \<li><span>地址:<b title="{{ADDRESStitle}}">{{ADDRESS}}</b></span></li>\
            \<li><span>隶属单位:<b>{{FIRMNAME}}</b></span></li>\
            \</ul>\
            \</div>\
            \</div>';
        cb && cb.call(this, template);
    };
    // <li><span>物质名称:<b>{{DANGERFACTER}}</b></span><span>是否完善监控设施:<b>{{ISHAVESAFESYS}}</b></span></li>
    // <li><span>物质质量:<b>{{DAGRVALUE}}</b></span><span>是否属于生产装备:<b>{{ISPRODUCTQQUIP}}</b></span></li>
    // <li><span>计量单位:<b>{{MEASUREUNIT}}</b></span><span>是否属于装备紧急停车系统:<b>{{ISEMERGENCYSTOPSYS}}</b></span></li>
    // <li><span>是否涉及毒性物质:<b>{{ISTOXICTHING}}</b></span><span>是否在城区内:<b>{{ISINCITY}}</b></span></li>
    /**
     *
     * @param data
     */
    detail.showDetailPanel = function (data) {
        this.loadTemplate(function (template) {
            var html = template,
                tag = data.tag || {},
                dangertype = data.dangertype || {},
                hazardlevel = data.hazardlevel || {},
                dist = data.district || {};
            var data2show = {};

            data2show.name = tag.DANGERNAME || "";
            data2show.title = tag.DANGERNAME || "";
            if(isNaN(data.distance)){
                data2show.distance = "";
            }else{
                data2show.distance = parseFloat(data.distance).toFixed(2) + "km" || "";
            }
            data2show.dangertype = dangertype.tag.DANGERTYPENAME || "";
            data2show.hazardlevel = hazardlevel.tag.HAZARDLEVELNAME || "";
            data2show.ADDRESS = tag.ADDRESS || "";
            data2show.FIRMNAME = tag.FIRMNAME || "";
            data2show.ADDRESStitle = tag.ADDRESS || "";
            data2show.DUTYTEL = tag.DUTYTEL || "";
            data2show.PHONEKEY = tag.DUTYTEL || "";
            data2show.DISTRICT="";
            if(dist.tag)
            {
                data2show.DISTRICT = dist.tag.FULLNAME || "";
            }
            data2show.DANGERFACTER = tag.DANGERFACTER || "";//物资名称
            data2show.DAGRVALUE = tag.DAGRVALUE || "";//物资质量
            data2show.MEASUREUNIT = tag.MEASUREUNIT || "";//单位
            data2show.ISHAVESAFESYS = tag.ISHAVESAFESYS || "";//是否完善监控设施
            data2show.ISPRODUCTQQUIP = tag.ISPRODUCTQQUIP || "";//是否属于生产装备
            data2show.ISEMERGENCYSTOPSYS = tag.ISEMERGENCYSTOPSYS || "";//是否属于装备紧急停车系统
            data2show.ISTOXICTHING = tag.ISTOXICTHING || "";//是否设计毒性物资
            data2show.ISINCITY = tag.ISINCITY || "";//是否在城区内
            //
            for (var k in data2show){
                var regex = new RegExp('\{\{' + k + '\}\}');
                html = html.replace(regex, data2show[k]);
            }
            G.options.commonGIS._addPopupDetaills(data.point,html,[-230, -35]);
            if(data2show.distance==""){
                $(".sy-expert-detailListRight").css('display','none');
            }
            this.contentDom = jQuery('#sy-expert-detail-container');
            //
            var self=this;
            this.contentDom.find('[name=detailclose]').on('click',function(){
                self.clear();
            });
        });
    };
    /**
     * 清除框
     */
    detail.clear = function () {
        G.options.toolTipWare.clear();
    };
    return detail;
});