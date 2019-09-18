define(['jquery'], function ($) {

    var gisTitleList = function (options) {
        var data = options.data;
        var elName = options.container.substr(1);
        var type = options.type;
        var clickCallback = options.clickCallback || null;
        var buttonClickCallback = options.buttonClickCallback || null;
        var tableClickCallback = options.tableClickCallback || null;
        //判断菜单容器是否存在
        var hasContainerEl = $("body").find(options.container).length;
        if (!hasContainerEl) {
            $('body').append('<div class="' + elName + '"></div>');
        };
        //详情DOM列表生成
        if (data.listsData && data.listsData.length > 0) {
            data = data.listsData;
            var classname="yjzh-disasterSituation-container ";
            var htmlStr = '<div class='+classname+'>';

            for (var i = 0; i < data.length; i++) {
                var curData = data[i];
                // console.log(curData,8888888888)
                htmlStr += ' <div class="yjzh-disasterSituation-detailList clearfloat">' +
                    '<ul class="clearfloat disasterSituation-scrollNew">';
                for (var j = 0; j < curData.detailList.length; j++) {
                    var curItemData = curData.detailList[j];
                    // console.log(curItemData,99999999999)
                    if (curItemData.num == "0" || curItemData.num == "") {
                        htmlStr += ' <li><span style="display: none;"><img src="' + webApp + curItemData.logoUrl + '"></span><span class="yjzh-disasterSituation-slideContainer">' + curItemData.desc + '<b data-code="' + curItemData.code + '" data-flag="false">0</b>' + curItemData.unit + '</span>';
                    } else {
                        if(j==0){
                            htmlStr += ' <li><span style="display: none;"><img src="' + webApp + curItemData.logoUrl + '"></span><span class="yjzh-disasterSituation-slideContainer slideDown">' + curItemData.desc + '<b data-code="' + curItemData.code + '" data-flag="true">' + curItemData.num + '</b>' + curItemData.unit + '</span>';
                        }else{
                            htmlStr += ' <li><span style="display: none;"><img src="' + webApp + curItemData.logoUrl + '"></span><span class="yjzh-disasterSituation-slideContainer">' + curItemData.desc + '<b data-code="' + curItemData.code + '" data-flag="true">' + curItemData.num + '</b>' + curItemData.unit + '</span>';
                        };
                    };
                    if (curItemData.num > 0 && curItemData.tableList && curItemData.tableList.length > 0) {
                        if(j==0){
                            htmlStr += '<div class="yjzh-disasterSituation-tableList" style="display: block;"><ul>';
                        }else{
                            htmlStr += '<div class="yjzh-disasterSituation-tableList" style="display: none;"><ul>';
                        };
                        for (var k = 0; k < curItemData.tableList.length; k++) {
                            var curButtonData = curItemData.tableList[k];
                            if (curItemData.num > 0) {
                                if ((curItemData.code == "village") || (curItemData.code == "towmship")) {
                                    var name=curButtonData.name;
                                    var poptotal=curButtonData.poptotal;
                                    var id=curButtonData.id;
                                    var x=curButtonData.geom.coordinates[0];
                                    var y=curButtonData.geom.coordinates[1];
                                    htmlStr += '<li data-wktdata="' + id + ',' + x + ','+y+',' + poptotal + ',' + name + '" data-code="' + curItemData.code + '"><span class="list_icons_creat"><span class="disasterSituation-littleSquare"></span><span  class="disasterSituation-nameSpan">' + name + '</span></span></li>';
                                } else {
                                    htmlStr += '<li data-wktdata="' + curButtonData.wkt + '" data-code="' + curItemData.code + '"><span class="list_icons_creat"><span class="disasterSituation-littleSquare"></span><span  class="disasterSituation-nameSpan">' + curButtonData.name + '</span></span><span style="display: none;">' + curButtonData.distance + '</span></li>';

                                }
                            };
                        };
                        htmlStr += '</ul></div>';
                    };
                    htmlStr += '</li>';
                };
                htmlStr += '</ul></div>'
            };
            htmlStr += '</div>';
            $(".navDrag-"+type+" > section" ).html(htmlStr);
            //绑定数字的点击事件
            /*$(".yjzh-disasterSituation-detailList > ul > li > span > b").unbind("click").click(function (event) {
                event.stopPropagation();
                $(this).toggleClass("curNumSpanSelect");
                // $(this).toggleClass("curNumSpanSelect").parent().parent("li").siblings().children().find("b").removeClass("curNumSpanSelect");
                /!*var newArray = [];
                var codeObj = $(".yjzh-disasterSituation-container ul li").find("b.curNumSpanSelect");
                for(var i = 0; i < codeObj.length; i++){
                    newArray.push($(codeObj[i]).attr("data-code"));
                };*!/
                clickCallback && clickCallback($(this), $(this).attr("data-code"));
            });*/

          //更换滚动条样式
            $(".yjzh-disasterSituation-tableList").niceScroll({
                cursorborder:'',
                cursorcolor:'#ccc'
            });
            //绑定按钮的点击事件
            $(".yjzh-disasterSituation-buttonlList > span").unbind("click").click(function () {
                event.stopPropagation();
                $(this).toggleClass("buttonSpanSelect").siblings().removeClass("buttonSpanSelect");
                buttonClickCallback && buttonClickCallback($(this), $(this).children('b').html());
            });
            //绑定列表的点击事件
            $(".yjzh-disasterSituation-tableList > ul > li").unbind("click").click(function () {
                event.stopPropagation();
                $(this).toggleClass("tableLiSelect").siblings("li").removeClass("tableLiSelect");
                tableClickCallback && tableClickCallback($(this).attr("data-wktdata"), $(this).attr("data-code"),$(this));
            });
            //绑定容器的伸缩展开
            $('.yjzh-disasterSituation-detailList span.yjzh-disasterSituation-slideContainer').unbind("click").click(function () {
                event.stopPropagation();
                if($(this).hasClass('slideDown')){
                    $(this).removeClass('slideDown');
                    $(this).next().slideUp();
                }else{
                    $(this).addClass('slideDown');
                    $(this).next().slideDown();
                    $(this).parent().siblings().find('.yjzh-disasterSituation-slideContainer').removeClass('slideDown');
                    $(this).parent().siblings().find('.yjzh-disasterSituation-tableList').slideUp();
                }
            });
        };

    };
    return {
        gisTitleList: gisTitleList,
    }
});