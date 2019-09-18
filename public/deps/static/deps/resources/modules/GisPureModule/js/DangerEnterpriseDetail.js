/**
 * Created by melon on 2018/7/7.
 */
/**
 * 危化企业
 */
define([], function () {
    var detail = {};
    /**
     *
     * @param cb
     */
    detail.loadTemplate = function (cb) {
        var template = '<div class="bj-jywz-detaileContainer" id="dangerQY-detail-container">\
      \<div class="title-title-title bj-jywz-detaileTitle ">\
      \<span title="{{title}}">{{name}}</span><a href="javascript:;" class="detail-container-close" name="detailclose"></a>\
      \</div>\
      \<div class="common-detailContent bj-jywz-detaileContent bj-dangerousChemical-detaileContent">\
      \<div class="bj-rescueForces-detailListBox">\
            \<div class="bj-rescueForces-detailList">\
            \<div class="bj-rescueForces-detailListLeft">\
                \<ul class="first-items-list">\
                    \<li><i>安全风险等级：</i></li>\
                    \<li><i>单位地址：</i><span class="list_nowarp" title="{{addresstitle}}">{{address}}</span></li>\
                \</ul>\
            \</div>\
       \<div class="bj-rescueForces-detailListRight">\
            \<p>距离事发地</p>\
            \<p><span>{{distance}}</span></p>\
        \</div>\
        \</div>\
            </div>\
      \<ul class="ul_nowarp">\
      \<li><span class="ul_nowarp_li"><i>行业分类及行业代码：</i><b>{{property}}</b></span></li>\
      \<li><span class="ul_nowarp_li"><i>主要产品及生产规模：</i><b title="{{producttitle}}">{{product}}</b></span></li>\
      \<li><span ><i>企业主要负责人：</i><b>{{principal}}</b></span><span>职工人数：<b>{{economy}}</b></span></li>\
      \<li><span class="ul_nowarp_li"><i>企业主要负责人电话：</i><b>{{principalTel}}</b><img src="'+ webApp + 'src/modules/RiskAndResourceModule/img/tell.png"  class="allphone" key="{{PHONEKEY}}" style="display:none"/></span></li>\
      \<li><span><i>总生产量(万吨)：</i><b title="{{PROCESSNAMEtitle}}">{{PROCESSNAME}}</b></span><span><i>总储存量(万吨)：</i><b title="{{CASTTIMEtitle}}">{{CASTTIME}}</b></span></li>\
      \</ul>\
    \</div >\
    \</div > ';
        // 更改留一份
        //src/modules/RiskAndResourceModule/img/tell.png"  class="allphone" key="{{PHONEKEY}}" style="display:none"/></span></li>\
        //       \<li><span class="ul_nowarp_li_sapn"><i>主要产品及生产规模：</i><b>{{safeDutyTel}}</b></span></li>\
        //         \<li><i class=ass_process>关联工艺</i></li>\
        //       \<li><span><i>工艺名称：</i><b>{{PROCESSNAME}}</b></span><span>投用时间：<b>{{CASTTIME}}</b></span></li>\
        //       \<li><i>发生危险的最近安全距离(米)：</i><b>{{MINSAFEDISTANCE}}</b></li>\
        //       \<li><i>重点监控单元：</i><b >{{KEYMONUNIT}}</b></li>\
        //       \<li><i>危险性描述：</i><b >{{DAGDESC}}</b></li>\
        //       \<li><i>重点监控工艺参数：</i><b >{{KEYMONTECH}}</b></li>\
        //       \<li><i>工艺流程反应类型：</i><b>{{RESPONTYPE}}</b></li>\
        //       \<li><i>安全控制的基本要求及宜采用的控制方式：</i><b>{{SAFEREQCONMETH}}</b></li>\
        //       \<li><i>单位内主要装置设置及生产（储存）规模：</i><b>{{MAINDEV}}</b></li>\
        //       \<li><span style="width: 100%"><i>关联化学品名称：</i><b  style="width: 70%">{{CHENAME}}</b></span></li>\
        //       \</ul>\
        //     \</div >\
        //     \</div > '
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
                property = data.property || {},
                economy = data.economy? data.economy.tag : {},
                tech = data.tech? data.tech.tag : {},
                chem = data.chem? data.chem.tag :{};
            var data2show = {};
            data2show.name = tag.DAGCHEMENTNAME ? tag.DAGCHEMENTNAME : "";
            data2show.title = tag.DAGCHEMENTNAME ? tag.DAGCHEMENTNAME : "";
            if(isNaN(data.distance)){
                data2show.distance = "";

            }else{
                data2show.distance = parseFloat(data.distance).toFixed(2) + "km" || "";
            }

            data2show.district = tag.HAZARDLEVELCODE ? tag.HAZARDLEVELCODE :"";
            data2show.address = tag.ADDRESS ? tag.ADDRESS :"";
            data2show.addresstitle = tag.ADDRESS ? tag.ADDRESS :"";
            if(!!data.property) {
                data2show.property = tag.INDUSTRYCODE ? tag.INDUSTRYCODE : "";
            }
            else{
                data2show.property="";
            }
            data2show.economy = tag.EMPNUM? tag.EMPNUM:"";
            data2show.product = tag.MAINPROTANDSCALESTR?tag.MAINPROTANDSCALESTR: "";
            data2show.producttitle = tag.MAINPROTANDSCALESTR?tag.MAINPROTANDSCALESTR: "";
            data2show.totalStore = tag.TOTALSTORCAP ? tag.TOTALSTORCAP:"";
            data2show.principal = tag.PRINCIPAL ? tag.PRINCIPAL:"";
            data2show.principalTel = tag.PRINCIPALTEL ? tag.PRINCIPALTEL:"";
            data2show.safeDutyTel = tag.MAINPROTANDSCALESTR ? tag.MAINPROTANDSCALESTR:"";

            data2show.PHONEKEY = tag.PRINCIPALTEL ? tag.PRINCIPALTEL:"";
            data2show.PROCESSNAME = tag.SUMOUTPUT ? tag.SUMOUTPUT:"";
            data2show.PROCESSNAMEtitle = tag.SUMOUTPUT ? tag.SUMOUTPUT:"";
            data2show.CASTTIME = tag.TOTALSTORCAP ? tag.TOTALSTORCAP:"";
            data2show.CASTTIMEtitle = tag.TOTALSTORCAP ? tag.TOTALSTORCAP:"";
            data2show.MINSAFEDISTANCE = tech.MINSAFEDISTANCE ? tech.MINSAFEDISTANCE:"";
            data2show.KEYMONUNIT = tech.KEYMONUNIT ? tech.KEYMONUNIT:"";
            data2show.KEYMONUNITTitle = data2show.KEYMONUNIT;
            if(data2show.KEYMONUNIT.length > 40){
                data2show.KEYMONUNIT = data2show.KEYMONUNIT.substr(0,40) + "...";
            }
            data2show.DAGDESC = tech.DAGDESC ? tech.DAGDESC:"";
            data2show.DAGDESCTitle = data2show.DAGDESC;
            if(data2show.DAGDESC.length > 50){
                data2show.DAGDESC = data2show.DAGDESC.substr(0,50) + "...";
            }
            data2show.KEYMONTECH = tech.KEYMONTECH ? tech.KEYMONTECH:"";
            data2show.KEYMONTECHTitle = data2show.KEYMONTECH;
            if(data2show.KEYMONTECH.length > 12){
                data2show.KEYMONTECH = data2show.KEYMONTECH.substr(0,12) + "...";
            }
            data2show.RESPONTYPE = tech.RESPONTYPE ? tech.RESPONTYPE:"";
            data2show.RESPONTYPETitle = data2show.RESPONTYPE;
            if(data2show.RESPONTYPE.length > 12){
                data2show.RESPONTYPE = data2show.RESPONTYPE.substr(0,12) + "...";
            }
            data2show.SAFEREQCONMETH = tech.SAFEREQCONMETH ? tech.SAFEREQCONMETH:"";
            data2show.SAFEREQCONMETHTitle = data2show.SAFEREQCONMETH;
            if(data2show.SAFEREQCONMETH.length > 50){
                data2show.SAFEREQCONMETH = data2show.SAFEREQCONMETH.substr(0,50) + "...";
            }
            data2show.MAINDEV = tech.MAINDEV ? tech.MAINDEV:"";
            data2show.MAINDEVTitle = data2show.MAINDEV;

            data2show.CHENAME = chem.CHENAME ? chem.CHENAME:"";
			data2show.CHENAMETitle = data2show.CHENAME;

            //
            for (var k in data2show) {
                var regex = new RegExp('\{\{' + k + '\}\}');
                html = html.replace(regex, data2show[k]);
            }
            G.options.commonGIS._addPopupDetaills(data.point,html,[-230, -35]);
            if(data2show.distance==""){
                $(".bj-rescueForces-detailListRight").css('display','none');
            }

            if(data2show.district)
            {
                $('#dangerQY-detail-container li').eq(0).append('<p class="enterprise_basic_right_0'+data2show.district+'">'+data2show.district+'</p>')
            }

            this.contentDom = jQuery('#dangerQY-detail-container');
            //
            var self=this;
            this.contentDom.find('[name=detailclose]').on('click',function(){
                self.clear();
            });
             //添加tooltip显示
            // $('.bj-dangerousChemical-detaileContent ul li b').tooltip();
        });
    };

    //其它模块调用生成html
    detail.renderPanel = function (data,cb) {
        var containerId = '';
        this.loadTemplate(function (template) {
            var html = template,
                tag = data.tag || {},
                district = data.district || {},
                property = data.property || {},
                economy = data.economy? data.economy.tag : {},
                tech = data.tech? data.tech.tag : {},
                chem = data.chem? data.chem.tag :{};
            var data2show = {};
            data2show.name = tag.DAGCHEMENTNAME ? tag.DAGCHEMENTNAME : "";
            data2show.title = tag.DAGCHEMENTNAME ? tag.DAGCHEMENTNAME : "";
            if(isNaN(data.distance)){
                data2show.distance = "";

            }else{
                data2show.distance = parseFloat(data.distance).toFixed(2) + "km" || "";
            }

            data2show.district = tag.HAZARDLEVELCODE ? tag.HAZARDLEVELCODE :"";
            data2show.address = tag.ADDRESS ? tag.ADDRESS :"";
            data2show.addresstitle = tag.ADDRESS ? tag.ADDRESS :"";
            if(!!data.property) {
                data2show.property = tag.INDUSTRYCODE ? tag.INDUSTRYCODE : "";
            }
            else{
                data2show.property="";
            }
            data2show.economy = tag.EMPNUM? tag.EMPNUM:"";
            data2show.product = tag.MAINPROTANDSCALESTR?tag.MAINPROTANDSCALESTR: "";
            data2show.producttitle = tag.MAINPROTANDSCALESTR?tag.MAINPROTANDSCALESTR: "";
            data2show.totalStore = tag.TOTALSTORCAP ? tag.TOTALSTORCAP:"";
            data2show.principal = tag.PRINCIPAL ? tag.PRINCIPAL:"";
            data2show.principalTel = tag.PRINCIPALTEL ? tag.PRINCIPALTEL:"";
            data2show.safeDutyTel = tag.MAINPROTANDSCALESTR ? tag.MAINPROTANDSCALESTR:"";

            data2show.PHONEKEY = tag.PRINCIPALTEL ? tag.PRINCIPALTEL:"";
            data2show.PROCESSNAME = tag.SUMOUTPUT ? tag.SUMOUTPUT:"";
            data2show.CASTTIME = tag.TOTALSTORCAP ? tag.TOTALSTORCAP:"";
            data2show.MINSAFEDISTANCE = tech.MINSAFEDISTANCE ? tech.MINSAFEDISTANCE:"";
            data2show.KEYMONUNIT = tech.KEYMONUNIT ? tech.KEYMONUNIT:"";
            data2show.KEYMONUNITTitle = data2show.KEYMONUNIT;
            if(data2show.KEYMONUNIT.length > 40){
                data2show.KEYMONUNIT = data2show.KEYMONUNIT.substr(0,40) + "...";
            }
            data2show.DAGDESC = tech.DAGDESC ? tech.DAGDESC:"";
            data2show.DAGDESCTitle = data2show.DAGDESC;
            if(data2show.DAGDESC.length > 50){
                data2show.DAGDESC = data2show.DAGDESC.substr(0,50) + "...";
            }
            data2show.KEYMONTECH = tech.KEYMONTECH ? tech.KEYMONTECH:"";
            data2show.KEYMONTECHTitle = data2show.KEYMONTECH;
            if(data2show.KEYMONTECH.length > 12){
                data2show.KEYMONTECH = data2show.KEYMONTECH.substr(0,12) + "...";
            }
            data2show.RESPONTYPE = tech.RESPONTYPE ? tech.RESPONTYPE:"";
            data2show.RESPONTYPETitle = data2show.RESPONTYPE;
            if(data2show.RESPONTYPE.length > 12){
                data2show.RESPONTYPE = data2show.RESPONTYPE.substr(0,12) + "...";
            }
            data2show.SAFEREQCONMETH = tech.SAFEREQCONMETH ? tech.SAFEREQCONMETH:"";
            data2show.SAFEREQCONMETHTitle = data2show.SAFEREQCONMETH;
            if(data2show.SAFEREQCONMETH.length > 50){
                data2show.SAFEREQCONMETH = data2show.SAFEREQCONMETH.substr(0,50) + "...";
            }
            data2show.MAINDEV = tech.MAINDEV ? tech.MAINDEV:"";
            data2show.MAINDEVTitle = data2show.MAINDEV;

            data2show.CHENAME = chem.CHENAME ? chem.CHENAME:"";
            data2show.CHENAMETitle = data2show.CHENAME;
            data2show.faren=tag.PRINCIPAL||"";
            data2show.farenTel=tag.PRINCIPALTEL||"";

            //
            for (var k in data2show) {
                var regex = new RegExp('\{\{' + k + '\}\}');
                html = html.replace(regex, data2show[k]);
            }
            cb(html);
            // G.options.commonGIS._addPopupDetaills(data.point,html,[-230, -35]);
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