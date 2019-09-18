/**
 * Created by melon on 2018/7/12.
 */
/**
 * 工贸企业
 */
define([], function () {
    var detail = {};

    /**
     *
     * @param cb
     */
    detail.loadTemplate = function (cb) {
        var template = '<div class="bj-jywz-detaileContainer" id="dangerQY-detail-container-gongmao">\
      \<div class="title-title-title bj-jywz-detaileTitle ">\
      \<span title="{{title}}">{{name}}</span><a href="javascript:;" class="detail-container-close" name="detailclose"></a>\
      \</div>\
      \<div class="common-detailContent bj-jywz-detaileContent bj-dangerousChemical-detaileContent ">\
      \<div class="bj-rescueForces-detailListBox">\
            \<div class="bj-rescueForces-detailList">\
            \<div class="bj-rescueForces-detailListLeft">\
            \<ul class="first-items-list">\
                    \<li><i>行政区划：</i><span class="list_nowarp">{{district}}</span></li>\
                    \<li><i>单位地址：</i><span class="list_nowarp">{{ADDRESS}}</span></li>\
        \</ul>\
       \</div>\
       \<div class="bj-rescueForces-detailListRight">\
            \<p>距离事发地</p>\
            \<p><span>{{distance}}</span></p>\
        \</div>\
        \</div>\
            </div>\
      \<ul class="ul_nowarp">\
      \<li><span><i>企业性质：</i><b>{{nature}}</b></span><span><i>所属行业：</i><b>{{industry}}</b></span></li>\
      \<li><span><i style="width: 125px">法定代表人：</i><b>{{ARTIFICIALPER}}</b></span><span><i style="width: 198px">法定代表人电话：</i><b>{{ARTIFICIALPERTEL}}</b><img src="'+ webApp + 'src/modules/RiskAndResourceModule/img/tell.png"  class="allphone" key="{{PHONEKEY}}" style="display:none"/></span></li>\
      \<li><span><i>员工总数：</i><b>{{EMPNUM}}</b></span><span><i class="yjzh-list-maxlength" style="width: 220px;">专职安全管理人员(人)：</i><b style="width: 20%">{{FULLGADMINNUM}}</b></span></li>\
      \<li><span><i style="width:198px ;">特种作业人员数(人)：</i><b style="width: 20%">{{SPECIALNUM}}</b></span></li>\
      \</ul>\
    \</div >\
    \</div > ';
        cb && cb.call(this, template);
    };
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
                industry = data.industry || {},
                nature = data.nature || {}
            var data2show = {};
            data2show.name = tag.WHSMYHBZNAME || "";
            data2show.title = tag.WHSMYHBZNAME || "";
            if(isNaN(data.distance)){
                data2show.distance = "";

            }else{
                data2show.distance = parseFloat(data.distance).toFixed(2) + "km" || "";
            }

            data2show.district = district.tag.DISTRICTNAME || "";
            data2show.industry = industry.tag.INDUSTRYNAME || "";
            data2show.nature = nature.tag.ENTNATURENAME || "";

            data2show.ADDRESS = tag.ADDRESS || "";
            data2show.ARTIFICIALPER = tag.ARTIFICIALPER || "";
            data2show.ARTIFICIALPERTEL = tag.ARTIFICIALPERTEL || "";
            data2show.PHONEKEY = tag.ARTIFICIALPERTEL || "";
            data2show.FAX = tag.CONTACTEMAIL || "";
            data2show.GADMINORG = tag.GADMINORG || "";
            data2show.EMPNUM = tag.EMPNUM || "";
            data2show.FULLGADMINNUM = tag.FULLGADMINNUM || "";
            data2show.SPECIALNUM = tag.SPECIALNUM || "";

            //
            for (var k in data2show) {
                var regex = new RegExp('\{\{' + k + '\}\}');
                html = html.replace(regex, data2show[k]);
            }
            G.options.commonGIS._addPopupDetaills(data.point,html,[-230, -35]);
            if(data2show.distance==""){
                $(".bj-rescueForces-detailListRight").css('display','none');
            }
            this.contentDom = jQuery('#dangerQY-detail-container-gongmao');
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