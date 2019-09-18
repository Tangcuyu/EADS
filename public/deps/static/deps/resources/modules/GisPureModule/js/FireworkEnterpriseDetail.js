/**
 * Created by melon on 2018/7/12.
 */
/**
 * 烟花爆竹
 */
define([], function () {
    var detail = {};
    /**
     *
     * @param cb
     */
    detail.loadTemplate = function (cb) {
        var template = '<div class="bj-jywz-detaileContainer " id="dangerQY-detail-container">\
      \<div class="title-title-title bj-jywz-detaileTitle ">\
      \<span title="{{title}}">{{name}}</span><a href="javascript:;" class="detail-container-close" name="detailclose"></a>\
      \</div>\
      \<div class="common-detailContent bj-jywz-detaileContent bj-dangerousChemical-detaileContent">\
      \<div class="bj-rescueForces-detailListBox">\
            \<div class="bj-rescueForces-detailList">\
            \<div class="bj-rescueForces-detailListLeft">\
            \<ul>\
                \<li><span class="detailListLeft_uls_li"><i>单位类型：</i><span class="list_nowarp">{{dept}}</span></li>\
                \<li><span class="detailListLeft_uls_li"><i>单位地址：</i><span class="list_nowarp">{{ADDRESS}}</span></li>\
        \</ul>\
       \</div>\
       \<div class="bj-rescueForces-detailListRight">\
            \<p>距离事发地：</p>\
            \<p><span>{{distance}}</span></p>\
        \</div>\
        \</div>\
            </div>\
      \<ul class="ul_nowarp">\
      \<li><span><i>行政区划：</i><b>{{district}}</b></span><span><i>作业人数(人)：</i><b>{{WORKERNUM}}</b></span></li>\
      \<li><span><i>法人：</i><b>{{ARTIFICIALPER}}</b></span><span><i>联系电话：</i><b>{{TEL}}</b><img src="'+ webApp + 'src/modules/RiskAndResourceModule/img/tell.png" class="allphone" key="{{PHONEKEY}}" style="display:none"/></span></li>\
      \<li><i>产品质量检测信息：</i><b class="not_list_nowarp" title="{{QUALITYINFOtitle}}">{{QUALITYINFO}}</b></li>\
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
                cred = data.cred || {},
                dept = data.dept || {},
                district = data.district || {};
            var data2show = {};
            data2show.name = tag.FIREWORKENTNAME || "";
            data2show.title = tag.FIREWORKENTNAME || "";
            if(isNaN(data.distance)){
                data2show.distance = "";

            }else{
                data2show.distance = parseFloat(data.distance).toFixed(2) + "km" || "";
            }

            data2show.dept = dept.tag? dept.tag.DEPTTYPENAME : "";
            data2show.cred = cred.tag? cred.tag.CREDTYPENAME : "";

            if(district.tag) {
                data2show.district = district.tag.FULLNAME||"";
            }
            data2show.ADDRESS = tag.ADDRESS || "";
            data2show.BUSILICNUM = tag.BUSILICNUM || "";
            data2show.WORKERNUM = tag.WORKERNUM || "";
            data2show.ARTIFICIALPER = tag.ARTIFICIALPER || "";
            data2show.TEL = tag.TEL || "";
            data2show.PHONEKEY = tag.TEL || "";
            data2show.ARTIFICIALPERCERNO = tag.ARTIFICIALPERCERNO || "";
            data2show.ARTIFICIALPERCERNOtitle = tag.ARTIFICIALPERCERNO || "";
            data2show.QUALITYINFO = tag.QUALITYINFO || "";
            data2show.QUALITYINFOtitle = tag.QUALITYINFO || "";

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