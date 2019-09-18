/**
 * 救援队伍详情
 */
define(['simpleTable'], function (SimpleTable) {
    var detail = {};
    /**
     *
     * @param cb
     */
    detail.loadTemplate = function (cb) {
        var template ='<div class="sy-rescueForces-detailContainer common-detailContainer" id="sy-rescueForces-detail-container">\
            \<div class="sy-rescueForces-detailTitle title-title-title">\
            \<span title="{{title}}">{{name}}</span><a href="javascript:;" class="detail-container-close" name="detailclose"></a>\
            \</div>\
            \<div class="common-detailContent">\
            \<div class="sy-rescueForces-detailContent">\
            \<div class="sy-rescueForces-detailListBox box-box-box">\
            \<div class="sy-rescueForces-detailList">\
            \<div class="sy-rescueForces-detailListLeft">\
            \<ul>\
            \<li>类型:<span>{{teamstatype}}</span></li>\
            \<li>地址:<span title="{{taddress}}" class="address">{{address}}</span></li>\
            \<li>行政区划:<span>{{district}}</span></li>\
            \<li><label id="mineTotal">总人数(人):<span>{{pernum}}</span></label></li>\
            \</ul>\
            \</div>\
            \<div class="sy-rescueForces-detailListRight">\
            \<p>距离事发地距离：<span>{{distance}}</span></p>\
            \</div>\
            \</div>\
            \<div class="sy-rescueForces-peopleListBox " id="sy-rescueteam-personlist">\
            \</div>\
            \</div>\
            \<div class="sy-rescueForces-equipmentNum">\
            \<div>主要装备:<span id="unkown"></span></div>\
            \</div>\
            \<div class="sy-rescueForces-equipmentTableBox">\
            \<ul id="sy-rescueteam-equipmentlist">\
            \</ul>\
            \</div>\
            \</div>\
            \</div></div>';
        cb && cb.call(this, template);
    };
    /**
     *
     * @param data
     */
    detail.showDetailPanel = function (data) {
        this.loadTemplate(function (template) {
            var html = template;
            var tag = data.tag || {};
            var district = data.district || {};
            var teamstatype = data.teamstatype || {};
            var data2show = {};
            data2show.name = tag.RESCUENAME || "";
            data2show.title = tag.RESCUENAME || "";
            data2show.address = tag.ADDRESS || "";
            data2show.taddress = tag.ADDRESS || "";
            if(teamstatype&&teamstatype.tag) {
                data2show.teamstatype = teamstatype.tag.RESCUETYPENAME||"";
            }else{
                data2show.teamstatype = "";
            }
            if(isNaN(data.distance) || data.distance==""){
                data2show.distance = "";
            }else{
                data2show.distance = parseFloat(data.distance/1000).toFixed(2) + "km" || "";
            }
            if(district&&district.tag) {
                data2show.district = district.tag.FULLNAME||"";
            }else{
                data2show.district = "";
            }
            data2show.pernum = tag.TOTALPERNUM || "";
            for (var k in data2show) {
                var regex = new RegExp('\{\{' + k + '\}\}');
                html = html.replace(regex, data2show[k]);
            }
            G.options.commonGIS._addPopupDetaills(data.point,html,[-230, -35]);
            if(!data2show.distance||data2show.distance==""){
                $(".sy-rescueForces-detailListRight").css('display','none');
            }
            var self=this;
            self.showPerson(data);
            self.showEquipmentList(data.equipments);
            if(!data.pernum || data.pernum==""||data.pernum==0){
                //$("#mineTotal").hide();
            }
            var self = this;
            this.contentDom = jQuery('#sy-rescueForces-detail-container');
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
    detail.showPerson = function (data) {
        var personListDom = jQuery('#sy-rescueteam-personlist');
        var personTemplate = '<ul>' +
            '<li>队长：<span>{{PERSONNAME}}</span>' +
            '<span class="phone-img-items">{{MOBILEPHONE}}</span>' +
            '<img src="'+ webApp +'src/modules/GisPureModule/img/telphoon.png"  class="allphone" key="{{MOBILEPHONEKEY}}"/>'+
            '</li>' +
            //'<li>职务：<span>{{POSITION}}</span></li>' +
            '</ul>';
        var data2show = {};
        data2show.PERSONNAME = data.tag.LEADER || "";
        data2show.POSITION = "队长";
        data2show.MOBILEPHONE = data.tag.LEADERMTEL || "无";
        data2show.MOBILEPHONEKEY = data.tag.LEADERMTEL || "无";
        for (var k in data2show) {
            var regex = new RegExp('\{\{' + k + '\}\}');
            personTemplate = personTemplate.replace(regex, data2show[k]);
        }
        personListDom.append(personTemplate);
        $('.allphone').on('click',function (e) {
            //G.interfaces.callphone($(this).attr('key'));
        });
        if($(".phone-img-items").text() == '无') {
            $('.allphone').css('display','none');
        }
    }

    detail.showPersonList = function (data) {
        var personListDom=jQuery('#sy-rescueteam-personlist');
        data.sort(function(a,b){
            return a.tag. ORDERNUM-b.tag.ORDERNUM;
        });
        for(var i=0;i<data.length;i++){
            var personTemplate = '<ul>' +
                '<li>姓名：<span>{{PERSONNAME}}</span></li>' +
                '<li>职务：<span>{{POSITION}}</span></li>' +
                '<li>手机号：<span>{{MOBILEPHONE}}</span></li>' +
                '<li>电话：<span>{{OFFICETEL}}</span></li>' +
                '</ul>';
            var data2show = {};
            data2show.id=i+1;
            data2show.PERSONNAME = data[i].tag.PERSONNAME||"";
            data2show.POSITION = data[i].tag.POSITION||"";
            data2show.MOBILEPHONE = data[i].tag.MOBILEPHONE||"";
            data2show.OFFICETEL = data[i].tag.OFFICETEL||"";
            for (var k in data2show) {
                var regex = new RegExp('\{\{' + k + '\}\}');
                personTemplate = personTemplate.replace(regex, data2show[k]);
            }
            personListDom.append(personTemplate);
        }
    }
    detail.showEquipmentList = function (data) {
        if(!data || data.length==0){
            $(".sy-rescueForces-equipmentTableBox").css("display","none");
            $(".sy-rescueForces-detailContainer").css("height","420px");
            $("#unkown").html("不详");
            $("#sy-rescueForces-detail-container").find(".sy-rescueForces-equipmentNum").remove();
            $("#sy-rescueForces-detail-container").find(".sy-rescueForces-detailListBox").css({
                "border-color":"none"
            });
            //移除下面黑线
            return;
        }
        var opts = {};
        opts.containerId = 'sy-rescueteam-equipmentlist';
        opts.isPaging = true;//是否分页
        opts.pageSize = 3;//每页数目
        opts.total = data.length;//总数
        opts.fields =[{
                "name": "$num",
                "label": "序号",
                "width": "10%",
                "class":"ta-center"
            },
            {
                "name": "EQUIPMENTNAME",
                "label": "装备类型",
                "width": "30%"
            },
            {
                "name": "EQUIPMENTNUM",
                "label": "装备数量",
                "width": "20%",
                "class":"ta-center"
            },
            {
                "name": "EQUIPMENTUNIT",
                "label": "计量单位",
                "width": "20%",
                "class":"ta-center"
            }];
        opts.pageChangeCallback = function (pageIndex, pageSize, cb) {
            var list = [];
            for (var i = pageIndex * pageSize; i < (pageIndex + 1) * pageSize; i++) {
                if(!!data[i]){
                    var item = {};
                    item.EQUIPMENTNAME = data[i].tag.EQUIPTYPENAME||"";
                    item.EQUIPMENTNUM = data[i].tag.EQUIPNUM||"0";
                    item.EQUIPMENTUNIT = data[i].tag.PARAMETERNAME||"套";
                    list.push(item);
                }
            }
            cb(list);
        };
        opts.rowClickCallback = function (data) {
        };
        var table = new SimpleTable(opts);
    };
    return detail;
});