define(['jquery'], function ($) {

    var menuNavModule = function (options) {
        var menuClickBack = options.menuClickBack || null;
        var hoverClickBack = options.hoverClickBack || null;

        var navData=ALLLEGEND.menuNav['default'];
        var navStr="";
        var navHover="";
        if(navData){
            for(var i=0;i<navData.length;i++){
                navStr  +='<li class="Message_list'+i+'" menuKey="'+navData[i].key+'">' +
                                    '<span class="dot"></span> ' +
                                    '<span class="dot"></span>' +
                                    '<span class="dot"></span>' +
                                    '<span class="dot"></span> ' +
                                    '<span class="dot"></span>' +
                                    '<span class="dot"></span>' +
                                    '<span class="dot"></span>' +
                                    '<span class="dot"></span> ' +
                                    '<span class="dot"></span>' +
                                    '<span class="dot"></span>' +
                            '</li>';
                navHover+='<p menuKey="'+navData[i].key+'"><span class="right_tab1 tabactive" active-key="shipin" ><i>视频信息</i></span><span class="right_tab2" active-key="liebiao"><i>图表信息</i></span></p>';

            }
        }
        $('.QH-defendNav').html('<div class="YJ-navHover">'+navHover+'</div><ul class="QH-navBtn">'+navStr+'</ul>');
        $(".QH-defendNav ul li").eq(0).addClass('curMenuNav');
        MessageUtil.ZwGis.onPopulationFeve(function (newData) {
            $('.QH-navBtn').show();
            $(".QH-defendNav ul li").eq(0).trigger("click")
        });

        //导航点击事件
        var menuClickItem = $(".QH-defendNav ul li");
        menuClickItem.unbind("click");
        menuClickItem.on("click",function () {
            if($('.dialong_bg_pao').length>0){
                $('.dialong_bg_pao').remove()
            }
            var menuKey=$(this).attr('menuKey');
            $(".QH-defendNav ul li").removeClass('curMenuNav');
            $(this).addClass('curMenuNav');
            $(".YJ-navHover p[menukey='"+menuKey+"'] .right_tab1").addClass('tabactive');
            $(".YJ-navHover p[menukey='"+menuKey+"'] .right_tab2").removeClass('tabactive')
            if(menuClickBack) {
                menuClickBack(menuKey);
            }
        });
        //导航hover点击事件
        var hoverClickItem = $(".YJ-navHover p span");
        hoverClickItem.unbind("click");
        hoverClickItem.on("click",function () {
            var hoverKey=$(this).parent().attr('menuKey');
            var tabkey=$(this).attr('class');
            var keyCode=$(this).attr('active-key');

            $(this).addClass('tabactive').siblings().removeClass('tabactive');
            if(hoverClickBack) {
                hoverClickBack(hoverKey,tabkey);
            }


            if($(this).hasClass('tabactive')){
                if(keyCode=='shipin'){
                    if(menuClickBack) {
                        menuClickBack(hoverKey);
                    }
                    for(var i=0;i<$('.QH-navBtn li').length;i++){
                        if($('.QH-navBtn li').eq(i).attr('menukey')==hoverKey){
                            $('.QH-navBtn li').eq(i).addClass('curMenuNav').siblings().removeClass('curMenuNav')
                        }
                    }

                }else {
                    if(menuClickBack) {
                        menuClickBack(hoverKey);
                    }
                    for(var i=0;i<$('.QH-navBtn li').length;i++){
                        if($('.QH-navBtn li').eq(i).attr('menukey')==hoverKey){
                            $('.QH-navBtn li').eq(i).addClass('curMenuNav').siblings().removeClass('curMenuNav')
                        }
                    }
                    if(keyCode=='liebiao'){
                        if(hoverClickBack) {
                            hoverClickBack(hoverKey,tabkey);
                        }
                    }


                }
            }


        });
        var timer=null;
        $('.QH-defendNav ul li').click(function () {
            var menuKey=$(this).attr('menuKey');
            $(".YJ-navHover p[menukey='"+menuKey+"']").show().siblings().hide();
        })

        // $('.QH-defendNav ul li').mouseout(function () {
        //     var menuKey=$(this).attr('menuKey');
        //     if(timer){
        //         clearTimeout(timer);
        //         timer=null;
        //     }
        //     timer=setTimeout(function () {
        //         $(".YJ-navHover p[menukey='"+menuKey+"']").hide();
        //     },500)
        //
        // })
        $(".YJ-navHover p").click(function(){
            if(timer){
                clearTimeout(timer);
                timer=null;
            }
            $(this).show();
        })
        // $(".YJ-navHover p").mouseout(function(){
        //     $(this).hide();
        // })

    };
    return menuNavModule;
});