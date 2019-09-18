/**
 * 战勤保障基地
 */
define(['simpleTable'], function (SimpleTable) {
    var detail = {};
    /**
     * @param cb
     */
    detail.loadTemplate = function (cb) {
        var template = '<div class="common-detailContainer sy-warbase-detailContainer detail-detail-detail" id="sy-warbase-detail-container">\
            \<div class="sy-warbase-detailTitle title-title-title">\
            \<span title="{{title}}">{{name}}</span><a href="javascript:;" class="detail-container-close" name="detailclose"></a>\
            \</div>\
            \<div class="common-detailContent sy-warbase-detailContent"><div class="sy-warbase-content">\
            \<div class="sy-warbase-detailList">\
            \<div class="sy-warbase-detailListBox box-box-box">\
            \<div class="sy-warbase-detailListLeft">\
            \<ul>\
            \<li>地址:<a href="javascript:;" class="address"  title="{{taddresstitle}}">{{address}}</a></li>\
            \<li>行政区划:<span>{{district}}</span></li>\
            \<li><label class="sy-Allpersonnum">总人数(人):<span class="sy-Allpersonnum">{{pernum}}</span></label></li>\
            \<li><label class="sy-Allcarnum">车辆总数(辆):<span class="sy-Allcarnum">{{carnum}}</span></label></li>\
            \</ul>\
            \</div>\
            \<div class="sy-warbase-detailListRight">\
            \<p>距离事发地：<span>{{distance}}</span></p>\
            \</div>\
            \</div>\
            \<div class="sy-warbase-peopleListBox" id="sy-war-base-persons">\
            \</div>\
            \</div>\
            \<div class="sy-warbase-equipmentNum">\
            \<div>主要装备<span id="unkown"></span></div>\
            \</div>\
            \<div class="sy-warbase-equipmentTableBox">\
            \<ul  id="sy-warbase-equipmentlist">\
            \</ul>\
            \</div>\
            \</div>\
            \</div></div>';
        cb && cb.call(this, template);
    };
    /**
     * 显示战保基地详情
     * @param data
     */
    detail.showDetailPanel = function (data) {
        this.loadTemplate(function (template) {
            var html = template,
                tag = data.tag || {},
                district = data.district || {},
                persons = data.persons || [],
                equipments = data.equipments || [];
            var data2show = {};
            data2show.name = data.name || '';
            data2show.title = data.name || '';
            data2show.address = data.address || "";
            data2show.addresstitle = data.address || "";
            data2show.taddress = data.address || "";
            if(isNaN(data.distance)){
                data2show.distance = "";
            }else{
                data2show.distance = parseFloat(data.distance/1000).toFixed(2) + "km" || "";
            }
            data2show.infoMan = data.infoMan || "";
            data2show.infoTel = data.infoTel || "";
            data2show.pernum = isNaN(data.pernum)? "" : data.pernum;
            data2show.carnum = isNaN(data.carnum)? "" : data.carnum;
            if(data2show.pernum == null){
                data2show.pernum = "";
            }
            if (district && district.tag && district.tag.FULLNAME) {
                data2show.district = district.tag.FULLNAME || '';
            } else {
                data2show.district = '';
            }
            data2show.equipmentCount = equipments.length;
            for (var k in data2show) {
                var regex = new RegExp('\{\{' + k + '\}\}');
                html = html.replace(regex, data2show[k]);
            }
            G.options.commonGIS._addPopupDetaills(data.point,html,[-230, -35]);
            if(data2show.distance == ""){
                $(".sy-warbase-detailListRight").css('display','none');
            }
            if( data2show.pernum == ""||data2show.pernum=="0") {
                //$('.sy-Allpersonnum').css('display','none');
            }
            if(data2show.carnum==""||data2show.carnum==null) {
                //$('.sy-Allcarnum').css('display','none');
            }
            //
            this.showPersonList(data);
            //
            this.showEquipmentList(equipments);
            this.contentDom = jQuery('#sy-warbase-detail-container');
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
    /**
     *  显示人员
     * @param persons
     */
    detail.showPersonList = function (data) {
        var personListDom = jQuery('#sy-war-base-persons');
        var personTemplate = '<ul>' +
            '<li class="sy-warbase-personName">' +
            '<label>联系人：<span>{{infoMan}}</span>' +
            '<span>{{infoTel}}</span><img id="sy-warPhone" src="'+ webApp + 'src/modules/GisPureModule/img/telphoon.png" class="sy-allphone" key="{{INFOPHONE}}">' +
            '</label></li>'+
            //'<li>职务：<span>{{position}}</span></li>' +
            '</ul>';
        var data2show = {};
        data2show.id = i + 1;
        data2show.infoMan = data.infoMan || "";
        data2show.infoTel = data.infoTel || "";
        data2show.INFOPHONE = data.infoTel || "";
        if(data2show.infoTel == ""){
            $("#sy-warPhone").css("display","none");
        }
        data2show.position=data.position || "";
        for (var k in data2show) {
            var regex = new RegExp('\{\{' + k + '\}\}');
            personTemplate = personTemplate.replace(regex, data2show[k]);
        }
        personListDom.append(personTemplate);
        $('.sy-allphone').on('click',function (e) {
            //G.interfaces.callphone($(this).attr('key'));
        })
    };
    /**
     * 显示装备
     * @param data
     */
    detail.showEquipmentList = function (data) {
        var show=0;
        if(data && data.length>0) {
            for(var kk in data) {
                if(data[kk].tag.EQUIPMENTNUM==0) {
                    show++;
                }
            }
        }
        if(!data || data.length==0||show==data.length){
            $(".sy-warbase-equipmentTableBox").css("display","none");
            $(".sy-warbase-detailContainer").css("height","250px");
            $("#unkown").html("无");
            $("#sy-warbase-detail-container").find(".sy-warbase-equipmentNum").remove();
            $("#sy-warbase-detail-container").find(".sy-warbase-detailListBox").css({
                "border-bottom":"none",
                "border-color":"none"
            });//移除下面黑线
            return;
        }
        var opts = {};
        opts.containerId = 'sy-warbase-equipmentlist';
        opts.isPaging = true;//是否分页
        opts.pageSize = 3;//每页数目
        opts.total = data.length;//总数
        opts.fields =[{
            "name": "$num",
            "label": "序号",
            "width": "8%",
            "class":"ta-center"
        }, {
            "name": "EQUIPMENTNAME",
            "label": "装备名称",
            "width": "12%"
        }, {
            "name": "EQUIPMENTNUM",
            "label": "装备数量",
            "width": "12%"
        }, {
            "name": "WATERCARRYCAP",
            "label": "载水量(吨)",
            "width": "12%"
        }, {
            "name": "FOAMOUTPUT",
            "label": "泡沫量(吨)",
            "width": "12%"
        }, {
            "name": "LIFTHEIGHT",
            "label": "举升高度(米)",
            "width": "20%"
        }, {
            "name": "DRYPOWERQUY",
            "label": "干粉量(千克)",
            "width": "20%"
        }];
        opts.pageChangeCallback = function (pageIndex, pageSize, cb) {
            var list = [];
            for (var i = pageIndex * pageSize; i < (pageIndex + 1) * pageSize; i++) {
                if(!!data[i]){
                    var item = {};
                    item.EQUIPMENTNAME = data[i].tag.EQUIPMENTNAME || "";
                    item.EQUIPMENTNUM = data[i].tag.EQUIPMENTNUM || "0";
                    item.WATERCARRYCAP = data[i].tag.WATERCARRYCAP == "0"? "" : data[i].tag.WATERCARRYCAP;
                    item.FOAMOUTPUT = data[i].tag.FOAMOUTPUT=="0"? "" : data[i].tag.FOAMOUTPUT;
                    item.LIFTHEIGHT = data[i].tag.LIFTHEIGHT == "0"? "" : data[i].tag.LIFTHEIGHT;
                    item.DRYPOWERQUY = data[i].tag.DRYPOWERQUY=="0"? "" : data[i].tag.DRYPOWERQUY;
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