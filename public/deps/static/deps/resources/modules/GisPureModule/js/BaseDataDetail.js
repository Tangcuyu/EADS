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
            \</div>\
            \<div class="sy-expert-detailListRight">\
            \<p>距离事发地:</p>\
            \<p><span>{{distance}}</span></p>\
            \</div>\
            \</div>\
            \</div>\
            \<ul>\
            \<li><span>地址:<b title="{{ADDRESStitle}}">{{ADDRESS}}</b></span></li>\
            \<li><span>行政区划:<b>{{DISTRICT}}</b></span></li>\
            \<li><span>联系电话:<b>{{DUTYTEL}}</b><img src="'+ webApp +'src/modules/GisPureModule/img/tell.png" class="sy-allphone" key="{{PHONEKEY}}" style="display:none"/></span></li>\
            \</ul>\
            \</div>\
            \</div>';
        cb && cb.call(this, template);
    };

    /**
     *
     * @param data
     */
    detail.showDetailPanel = function (data,name) {
        this.loadTemplate(function (template) {
            var html = template,
                tag = data.tag || {},
                dist = data.district || {};
            var data2show = {};
            data2show.name = tag[name] || "";
            data2show.title = tag[name] || "";
            if(isNaN(data.distance)){
                data2show.distance = "";
            }else{
                data2show.distance = parseFloat(data.distance).toFixed(2) + "km" || "";
            }
            data2show.ADDRESS = tag.ADDRESS || "";
            data2show.ADDRESStitle = tag.ADDRESS || "";
            data2show.DUTYTEL = tag.DUTYTEL || "";
            data2show.PHONEKEY = tag.DUTYTEL || "";
            data2show.DISTRICT="";
            if(dist.tag)
            {
                data2show.DISTRICT = dist.tag.FULLNAME || "";
            }
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