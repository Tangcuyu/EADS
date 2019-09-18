/**
 * 地质灾害
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
                \<li><i>行政区划：</i><span class="list_nowarp">{{DISTRICT}}</span></li>\
                \<li><i>地址：</i><span class="list_nowarp">{{ADDRESS}}</span></li>\
        \</ul>\
       \</div>\
        \</div>\
            </div>\
      \<ul class="ul_nowarp">\
      \<li><span><i>类型：</i><b>{{GEOHAZARDTYPE}}</b></span><span><i>危险等级：</i><b>{{HAZARDLEVEL}}</b></span></li>\
      \<li><span><i>威胁人数：</i><b>{{MAXPERSONNUM}}</b></span><span><i>监测方式：</i><b>{{MONITMODE}}</b></span></li>\
      \<li><span title="{{TTREATSTEPtitle}}"><i>治理措施：</i><b>{{TREATSTEP}}</b></span><span><i>监测责任人：</i><b>{{MONRESPPER}}</b></span></li>\
      \<li><span><i>威胁对象：</i><b>{{THREATOBJ}}</b></span><span><i>责任人联系电话：</i><b>{{MONRESPPERMTEL}}</b><img src="'+ webApp + 'src/modules/RiskAndResourceModule/img/tell.png"  class="allphone" key="{{MONRESPPEROTEL}}" style="display:none"/></span></li>\
      \<li><span><i>威胁户数：</i><b>{{HOUSEHOLDNUM}}</b></span><span><i>威胁财产(万元)：</i><b>{{THREATWEALTH}}</b></span></li>\
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
                tag = data.tag || {};
            var data2show = {};
            data2show.name = tag.HAZARDNAME || "";
            data2show.title = tag.HAZARDNAME || "";
            // if(isNaN(this.data.distance)){
            //     data2show.distance = "";
            //
            // }else{
            //     data2show.distance = parseFloat(this.data.distance).toFixed(2) + "km" || "";
            // }
            data2show.DISTRICT = data.district?data.district.tag.FULLNAME: "";
            data2show.ADDRESS = tag.ADDRESS || "";
            data2show.GEOHAZARDTYPE = data.geohazardtype?data.geohazardtype.tag.GEOHAZARDTYPENAME: "";
            data2show.HAZARDLEVEL = data.hazardlevel?data.hazardlevel.tag.HAZARDLEVELNAME: "";
            data2show.MAXPERSONNUM = tag.MAXPERSONNUM || "";
            data2show.MONITMODE = tag.MONITMODE || "";
            data2show.TTREATSTEP = tag.TREATSTEP || "";
            data2show.TTREATSTEPtitle = tag.TREATSTEP || "";
            data2show.TREATSTEP = tag.TREATSTEP || "";
            data2show.MONRESPPER = tag.MONRESPPER || "";
            data2show.THREATOBJ = tag.THREATOBJ || "";
            data2show.MONRESPPERMTEL = tag.MONRESPPERMTEL || "";
            data2show.HOUSEHOLDNUM = tag.HOUSEHOLDNUM || "";
            data2show.THREATWEALTH = tag.THREATWEALTH || "";
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
    };
    /**
     * 清除框
     */
    detail.clear = function () {
        G.options.toolTipWare.clear();
    };
    return detail;
});