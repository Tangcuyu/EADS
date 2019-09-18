/**
 * 消防队站详情
 */
define(['simpleTable'], function (SimpleTable) {
    var detail = {};
    /**
     *
     * @param cb
     */
    detail.loadTemplate = function (cb) {
        var template ='<div class="common-detailContainer sy-fireTeam-detailContainer  detail-detail-detail" id="sy-fireTeam-detail-container">\
            \<div class="sy-fireTeam-detailTitle title-title-title">\
            \<span title="{{title}}">{{name}}</span><a href="javascript:;" class="detail-container-close" name="detailclose"></a>\
            \</div>\
            \<div class="common-detailContent "><div class="sy-fireTeam-detailContent ">\
            \<div class="sy-fireTeam-detailListBox box-box-box">\
            \<div class="sy-fireTeam-detailList">\
            \<div class="sy-fireTeam-detailListLeft">\
            \<ul>\
            \<li>类型:<span>{{teamstatype}}</span></li>\
            \<li>地址:<span title="{{taddress}}" class="address">{{address}}</span></li>\
            \<li>行政区划:<span>{{district}}</span></li>\
            \<li><label id="rescueTotal">官兵人数(人):<span>{{pernum}}</span></label><label id="rescueCarNumTotal">车辆总数(辆):<span>{{carnum}}</span></label></li>\
            \</ul>\
            \</div>\
            \<div class="sy-fireTeam-detailListRight">\
            \<p>距离事发地：<span>{{distance}}</span></p>\
            \</div>\
            \</div>\
            \<div class="sy-fireTeam-peopleListBox" id="sy-fireTeam-personlist">\
            \</div>\
            \</div>\
            \<div class="sy-fireTeam-equipmentNum">\
            \<div>主要装备:<span id="unkown"></span></div>\
            \</div>\
            \<div class="sy-fireTeam-equipmentTableBox">\
            \<ul id="sy-fireTeam-equipmentlist">\
            \</ul>\
            \</div>\
            \</div></div>\
            \</div>';
        cb && cb.call(this, template);
    }

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
                data2show.teamstatype = teamstatype.tag.NAME||"";
            }else{
                data2show.teamstatype = "";
            }
            if (isNaN(data.distance) || data.distance == "") {
                data2show.distance = "";
            } else {
                data2show.distance = parseFloat(data.distance/1000).toFixed(2) + "km" || "";
            }
            if(district&&district.tag) {
                data2show.district = district.tag.FULLNAME||"";
            }else{
                data2show.district = "";
            }
            data2show.pernum = tag.TOTALPERNUM || "";
            data2show.carnum = tag.CARNUM || "";
            data2show.countpe = data.persons.length || "";
            data2show.counteq = data.equipments.length || "";
            for (var k in data2show) {
                var regex = new RegExp('\{\{' + k + '\}\}');
                html = html.replace(regex, data2show[k]);
            }
            G.options.commonGIS._addPopupDetaills(data.point,html,[-230, -35]);
            if (!data2show.distance || data2show.distance == "") {
                $(".sy-fireTeam-detailListRight").css('display', 'none');
            }
            //
            var self = this;
            self.showPerson(data);
            self.showEquipmentList(data.equipments);
            if(!data.pernum || data.pernum==""||data.pernum==0) {
                //$("#rescueTotal").hide();
            }
            if(!data.carnum || data.carnum=="" || data.carnum==0){
                //$("#rescueCarNumTotal").hide();
            }
            this.contentDom = jQuery('#sy-fireTeam-detail-container');
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
        var personListDom = jQuery('#sy-fireTeam-personlist');
        var personTemplate = '<ul>' +
            '<li><label>负责人：<span title="{{PERSONNAMEtitle}}">{{PERSONNAME}}</span><span>{{MOBILEPHONE}}</span><img src="'+ webApp +'src/modules/GisPureModule/img/telphoon.png" class="sy-allphone" key="{{MOBILEPHONEKEY}}"/></label> <label>职务：<span>{{POSITION}}</span></label></li>' +
            '</ul>';
        var data2show = {};
        data2show.PERSONNAME = data.tag.LEADER || "";
        data2show.POSITION = "队长";
        data2show.MOBILEPHONE = data.tag.LEADERMTEL || "无";
        data2show.MOBILEPHONEKEY = data.tag.LEADERMTEL || "无";
        for (var k in data2show) {
            var regex = new RegExp('\{\{' + k + '\}\}');
            personTemplate = personTemplate.replace(regex, data2show[k]);
            personTemplate = personTemplate.replace(regex, data2show[k]);
        }
        personListDom.append(personTemplate);
        $('.sy-allphone').on('click', function (e) {
            //G.interfaces.callphone($(this).attr('key'));
        })
    };

    detail.showPersonList = function (data) {
        if (data.length < 1) {
            return;
        }
        var personListDom = jQuery('#sy-fireTeam-personlist');
        data.sort(function (a, b) {
            return a.tag.ORDERNUM - b.tag.ORDERNUM;
        });
        for (var i = 0; i < 2; i++) {

            var personTemplate = '<ul>' +
                '<li>姓名：<span>{{PERSONNAME}}</span></li>' +
                '<li>职务：<span>{{POSITION}}</span></li>' +
                '<li>手机号：<span>{{MOBILEPHONE}}</span><img src="'+ webApp + 'src/modules/GisPureModule/img/telphoon.png"  class="allphone" key="{{MOBILEPHONEKEY}}"/></li>' +
                '<li>电话：<span>{{OFFICETEL}}</span></li>' +
                '</ul>';
            var data2show = {};
            data2show.id = i + 1;
            data2show.PERSONNAME = data[i].tag.PERSONNAME || "";
            data2show.PERSONNAMEtitle = data[i].tag.PERSONNAME || "";
            data2show.POSITION = data[i].tag.POSITION || "";
            data2show.MOBILEPHONE = data[i].tag.MOBILEPHONE || "";
            data2show.MOBILEPHONEKEY = data[i].tag.MOBILEPHONE || "";
            data2show.OFFICETEL = data[i].tag.OFFICETEL || "";
            for (var k in data2show) {
                var regex = new RegExp('\{\{' + k + '\}\}');
                personTemplate = personTemplate.replace(regex, data2show[k]);
            }
            personListDom.append(personTemplate);
        }
        $('.allphone').on('click', function (e) {
            //G.interfaces.callphone($(this).attr('key'));
        })
    }
    detail.showEquipmentList = function (data) {
        if (!data || data.length == 0) {
            $(".sy-fireTeam-equipmentTableBox").css("display", "none");
            $(".sy-fireTeam-detailContent").css("height", "250px");
            $("#unkown").html("无");
            $("#sy-fireTeam-detail-container").find(".sy-fireTeam-equipmentNum").remove();
            $("#sy-fireTeam-detail-container").find(".sy-fireTeam-detailListBox").css({
                "border-bottom":"none",
                "border-color":"none"
            });//移除下面黑线
            return;
        }
        var opts = {};
        opts.containerId = 'sy-fireTeam-equipmentlist';
        opts.isPaging = true;//是否分页
        opts.pageSize = 3;//每页数目
        opts.total = data.length;//总数
        opts.fields = [{
            "name": "$num",
            "label": "序号",
            "width": "5%",
            "class": "ta-center"
        }, {
            "name": "EQUIPMENTNAME",
            "label": "装备名称",
            "width": "20%"
        }, {
            "name": "EQUIPMENTNUM",
            "label": "装备数量",
            "width": "10%",
            "class": "ta-center",
            type: 'Number'
        }, {
            "name": "WATERCARRYCAP",
            "label": "载水量(吨)",
            "width": "15%",
            "class": "ta-center"
        }, {
            "name": "FOAMOUTPUT",
            "label": "泡沫量(吨)",
            "width": "15%",
            "class": "ta-center"
        }, {
            "name": "LIFTHEIGHT",
            "label": "举升高度(米)",
            "width": "15%",
            "class": "ta-center"
        }, {
            "name": "DRYPOWERQUY",
            "label": "干粉量(千克)",
            "width": "15%",
            "class": "ta-center"
        }];
        opts.pageChangeCallback = function (pageIndex, pageSize, cb) {
            var list = [];
            for (var i = pageIndex * pageSize; i < (pageIndex + 1) * pageSize; i++) {
                if (!!data[i]) {
                    var item = {};
                    item.EQUIPMENTNAME = data[i].tag.EQUIPMENTNAME || "";
                    item.EQUIPMENTNUM = data[i].tag.EQUIPMENTNUM || "0";
                    item.WATERCARRYCAP = data[i].tag.WATERCARRYCAP == "0" ? "" : data[i].tag.WATERCARRYCAP;
                    item.FOAMOUTPUT = data[i].tag.FOAMOUTPUT == "0" ? "" : data[i].tag.FOAMOUTPUT;
                    item.LIFTHEIGHT = data[i].tag.LIFTHEIGHT == "0" ? "" : data[i].tag.LIFTHEIGHT;
                    item.DRYPOWERQUY = data[i].tag.DRYPOWERQUY == "0" ? "" : data[i].tag.DRYPOWERQUY;
                    list.push(item);
                }
            }
            cb(list);
        };
        opts.rowClickCallback = function (data) {

        }
        var table = new SimpleTable(opts);
    };

    return detail;
});