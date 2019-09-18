/**
 * 物资储备库
 */
define([], function () {
    var detail = {};
    /**
     *
     * @param cb
     */
    detail.loadTemplate = function (cb) {
        var template = '<div class="common-detailContainer sy-repersity-detaileContainer" id="sy-reposity-detail-container">\
            \<div class="sy-repersity-detaileTitle title-title-title">\
            \<span title="{{title}}">{{name}}</span><a href="javascript:;" class="detail-container-close" name="detailclose"></a>\
            \</div>\
            \<div class="common-detailContent"><div class="sy-reposity-content"><div class="sy-repersity-detailListBox box-box-box">\
            \<div class="sy-repersity-detailListLeft">\
            \<ul>\
            \<li><span>管理机构:<b title="{{orgnametitle}}">{{orgname}}</b></span></li>\
            \<li><span>级别:<b>{{levelname}}</b></span></li><li><span>行政区划:<b title="{{districttitle}}">{{district}}</b></span></li>\
            \<li><span>地址:<b>{{address}}</b></span></li><li><span>办公电话:<b>{{dutytel}}</b></span></li>\
            \<li><span class="sy-repersity-detailListName">联系人: <b title="{{contacttitle}}">{{contact}}</b></span><span class="sy-repersity-detailListPhone">联系电话:<b>{{telephone}}</b></span></li>\
            \</ul>\
            \</div>\
            \<div class="sy-repersity-detailListRight" id="rep_dis">\
            \<p>距离事发地:<span>{{distance}}</span></p>\
            \</div>\
            \</div>\
            \<div class="sy-repersity-detaileContent content-content-content">\
            \<ul>\
            \<li><span>救灾帐篷（顶）<b>{{救灾帐篷}}</b></span><span>救灾被服（件）<b>{{救灾被服}}</b></span></li>\
            \<li><span>救灾食品（件）<b>{{救灾食品}}</b></span><span>生活用品（件）<b>{{生活用品}}</b></span></li>\
            \<li><span>照明用具（件）<b>{{照明用具}}</b></span><span>能源动力（件）<b>{{能源动力}}</b></span></li>\
            \<li><span>应急救生（件）<b>{{应急救生}}</b></span><span>交通工具（台）<b>{{交通工具}}</b></span></li>\
            \<li><span>彩条苫布（件）<b>{{彩条苫布}}</b></span><span>卫生设施（件）<b>{{卫生设施}}</b></span></li>\
            \<li><span>生活家具（件）<b>{{生活家具}}</b></span><span>装备工具（件）<b>{{装备工具}}</b></span></li>\
            \</ul>\
            \</div >\
            \</div></div>';
        cb && cb.call(this, template);
    };
    /**
     * 显示详情
     * @param data
     */
    detail.showDetailPanel = function (data) {
        this.loadTemplate(function (template) {
            var html = template,
                tag = data.tag || {},
                district = data.district || {},
                materials = data.materials || [];
            var level=data.level[0]||{};
            var tempshow={};
            if(isNaN(data.distance)){
                tempshow.distance = "";
            }else{
                tempshow.distance = parseFloat(data.distance/1000).toFixed(2) + "km" || "";
            }
            tempshow.levelname=level.tag.LEVELNAME||"";
            tempshow.orgname=tag.ORGNAME || '';
            tempshow.orgnametitle=tag.ORGNAME || '';
            tempshow.name = tag.REPERTORYNAME || '';
            tempshow.title = tag.REPERTORYNAME || '';
            if(district&&district.tag) {
                tempshow.district = district.tag.FULLNAME||"";
                tempshow.districttitle= district.tag.FULLNAME||"";
            }else{
                tempshow.district = "";
            }

            tempshow.address = tag.ADDRESS || '';
            tempshow.contact = tag.CONCATEPER || '';
            tempshow.contacttitle = tag.CONCATEPER || '';
            tempshow.telephone = tag.CONCATEMOBTEL || '';
            tempshow.dutytel = tag.DUTYTEL || '';
            if (tempshow.telephone) {
                tempshow.telephone += '<img src="'+ webApp + 'src/modules/GisPureModule/img/telphoon.png" class="sy-allphone" key="' + tempshow.telephone + '">';
            }
            for (var k in tempshow) {
                var regex = new RegExp('\{\{' + k + '\}\}');
                html = html.replace(regex, tempshow[k]);
            }
            //物资列表
            var tempshowlist = {
                'TP001': {key:"救灾帐篷",num:0},
                'TP002': {key:"救灾被服",num:0},
                'TP003': {key:"救灾食品",num:0},
                'TP004': {key:"生活用品",num:0},
                'TP005': {key:"照明用具",num:0},
                'TP006': {key:"能源动力",num:0},
                'TP007': {key:"应急救生",num:0},
                'TP008': {key:"交通工具",num:0},
                'TP009': {key:"彩条苫布",num:0},
                'TP010': {key:"卫生设施",num:0},
                'TP011': {key:"生活家具",num:0},
                'TP012': {key:"装备工具",num:0}
            };
            for (var j = 0; j < materials.length; j++) {
                var material = materials[j],
                    tag = material.tag || {};
                if(!!tempshowlist[(tag.MATERIALTYPE + '').trim()]){
                    tempshowlist[(tag.MATERIALTYPE + '').trim()].num = tag.MATERIALNUM || 0;
                }
            }
            for (var k in tempshowlist) {
                var regex = new RegExp('\{\{' + tempshowlist[k].key + '\}\}');
                html = html.replace(regex, tempshowlist[k].num);
            }
            G.options.commonGIS._addPopupDetaills(data.point,html,[-230, -35]);
            if(tempshow.distance == ""){
                $("#rep_dis").css('display','none');
            }
            $('.sy-allphone').on('click',function (e) {
                //G.interfaces.callphone($(this).attr('key'));
            });
            this.contentDom = jQuery('#sy-reposity-detail-container');
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