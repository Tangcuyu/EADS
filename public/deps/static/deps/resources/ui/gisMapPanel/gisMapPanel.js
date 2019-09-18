define(['jquery'], function ($) {
    var gisMapPanel = function (options,fn) {
        var menukey=options.menukey||'DisasterResearchModule';
        var map_list_icon_left=ALLLEGEND.gisMapPanel[menukey]['map_list_icon_left'];
        var map_list_icon_right=ALLLEGEND.gisMapPanel[menukey]['map_list_icon_right']
        var panelClickBack = options.panelClickBack || null;


        if($('.YJ-gisPanel').length>0){
        }else{
            var panelParentData=ALLLEGEND.gisMapPanel;

            var panelParent=""
            for(k in panelParentData){

                var panelData=panelParentData[k].default;
                var panelStr="";
                for(var i=0;i<panelData.length;i++){
                    if(panelData){
                        panelStr  +='<div class="YJ-gisPanel '+panelData[i].key+'" panelKey="'+panelData[i].key+'" isMutex="'+panelData[i].isMutex+'">' +
                            '<h1 class="YJ-gisTitle"><i  class="YJ-navIcon '+panelData[i].className +'"></i></h1>' +
                            '<p>'+panelData[i].text+'</p>' +
                            '</div>';
                    }
                }
                panelParent +='<div class="mapPanel-'+k+'" style="display: none">'+panelStr+'</div>';
            }

            $('#mapPanel').html(panelParent);
        }
        $('.mapPanel-'+menukey).show().siblings().hide();




        var list_icon_left='';
        if(map_list_icon_left){
            for(var i=0;i<map_list_icon_left.length;i++){
                // console.log(map_list_icon_left[i])
                list_icon_left  +='<div class="YJ-gisListPanel '+map_list_icon_left[i].key+'" panelKey="'+map_list_icon_left[i].key+'" isMutex="'+map_list_icon_left[i].isMutex+'">' +
                    '<h1 class="YJ-gisTitle"><i  class="YJ-navIcon_list '+map_list_icon_left[i].className +'"></i></h1>' +
                    '<p>'+map_list_icon_left[i].text+'</p>' +
                    '</div>';

            }
        }
        $('.map_list_icon_left').html(list_icon_left);
        var list_icon_right='';

        if(map_list_icon_right){
            for(var i=0;i<map_list_icon_right.length;i++){

                list_icon_right  +='<div class="YJ-gisListPanel '+map_list_icon_right[i].key+'" panelKey="'+map_list_icon_right[i].key+'" isMutex="'+map_list_icon_right[i].isMutex+'">' +
                    '<h1 class="YJ-gisTitle"><i  class="YJ-navIcon_list '+map_list_icon_right[i].className +'"></i></h1>' +
                    '<p>'+map_list_icon_right[i].text+'</p>' +
                    '</div>';

            }
        }
        $('.map_list_icon_right').html(list_icon_right);


        fn();

        //按钮点击事件
        var panelClickItem = $(".YJ-gisPanel");
        panelClickItem.unbind("click");
        panelClickItem.on("click",function () {
            // 隐藏互斥面板
            $('#mapPopupWindow>div').hide();
            $('.listDialog#temp').remove();
            if (G.options.map.getLayerById('jiaotongguanzhi')) {
                G.options.map.getLayerById('jiaotongguanzhi').clear();
            }
            if (G.options.map.getLayerById('onTrafficGis')) {
                G.options.map.getLayerById('onTrafficGis').clear();
            }
            if (G.options.map.getLayerById('jiaotongguanzhiLayer')) {
                G.options.map.getLayerById('jiaotongguanzhiLayer').clear();
            }
            if (G.options.map.getLayerById('jiaotongdistanceLayer')) {
                G.options.map.getLayerById('jiaotongdistanceLayer').clear();
            }
            $('.jiaotongguanzhi_distance').remove();
            // 隐藏互斥面板end

            //清除工具栏
            if($(".Traffic_view_infor")){
                $(".Traffic_view_infor").remove()
            }
            $('.dialong_Sharing_icon').removeClass('dialong_Sharing_on');
            $('.dialong_Sharing_iconList').find('li').removeClass('List_icon_on');
            $('.dialong_Sharing_iconList').hide();

            $('.map_font_tishi').html($(this).find('p').html())
            var panelKey=$(this).attr('panelKey');
            var isMutex=$(this).attr('isMutex');
            var status='';
            if(isMutex=='true'){//互斥
                if($(this).hasClass('curMapPanel')){
                    $(this).removeClass('curMapPanel');
                    status='onClose';
                    $('.screenLeft').hide();
                    $('.RescueHelp-team-table').hide();//隐藏队伍列表
                }else{
                    $('.YJ-gisPanel').removeClass('curMapPanel');
                    $(this).addClass('curMapPanel');
                    status='onOpen';
                    $('.screenLeft').show();
                    if($('.YJ-gisPanel').attr('panelkey')=='_district'){
                        //$('.timeline-scence').show()
                    }
                }
            }else{
                if($(this).hasClass('curMapPanel')){
                    $(this).removeClass('curMapPanel');
                    status='onClose';
                    $('.screenLeft').hide();
                    if($('.YJ-gisPanel').attr('panelkey')=='_district'){
                       // $('.timeline-scence').hide()
                    }
                }else{
                    $(this).addClass('curMapPanel');
                    $('.YJ-gisPanel[isMutex="true"]').removeClass('curMapPanel');
                    status='onOpen';
                    $('.screenLeft').show();

                }
            }
            if(panelClickBack) {
                panelClickBack(panelKey,status);
                
            }

            if($(this).hasClass('curMapPanel')){
                $('.map_font_tishi').show();
                if(panelKey=="derivativerisk"){
                    $('.map_font_tishi').css('width','290px');
                }else {
                    $('.map_font_tishi').css('width','200px');
                }
                if(panelKey=='_district'||panelKey=='_disasterstyle'||panelKey=="_popluheat"){
                    $('.map_font_tishi').hide();
                }

            }else {
                $('.map_font_tishi').hide();
                if(panelKey=="derivativerisk"){
                    $('.map_font_tishi').css('width','290px');
                }else {
                    $('.map_font_tishi').css('width','200px');
                }

            }



        });


        // /*右侧列表点击显隐*/
        // $('.close_map_list_icon_right').on('click',function () {
        //     if($(this).hasClass('active')){
        //         $(this).removeClass('active');
        //         $('.map_list_icon_right').hide();
        //     }else {
        //         $(this).addClass('active');
        //         $('.map_list_icon_right').show();
        //     }
        // })
        //
        // /*左侧列表点击显隐*/
        // $('.close_map_list_icon_left').on('click',function () {
        //     if($(this).hasClass('active')){
        //         $(this).removeClass('active');
        //         $('.map_list_icon_left').hide();
        //     }else {
        //         $(this).addClass('active');
        //         $('.map_list_icon_left').show();
        //     }
        // })

        /**/

        $('.YJ-gisListPanel').on('click',function () {
            var key=$(this).attr('panelkey');
            if($(this).hasClass('active')){
                $(this).removeClass('active');
                for(var i=0;i<$('.modulePanel-item').length;i++){
                    var keys=$('.modulePanel-item').eq(i).attr('panelkey');
                    if(key==keys){
                        $('.modulePanel-item').eq(i).show()
                    }
                }
            }else {
                $(this).addClass('active');
                for(var i=0;i<$('.modulePanel-item').length;i++){
                    var keys=$('.modulePanel-item').eq(i).attr('panelkey');
                    if(key==keys){
                        $('.modulePanel-item').eq(i).hide()
                    }
                }
            }


        })






        var $oBtn="<span class='btn-more'><div class='YJ-navIcon YJ-navIcon-more'></div><div class='YJ-navIcon YJ-navIcon-back'></div></span>";


        $(".mapPanel-DisasterResearchModule .YJ-gisPanel:eq(9)").after($oBtn)
        $(".mapPanel-DisasterResearchModule .YJ-gisPanel:gt(10)").hide();
        var flag=false;

        $('span.btn-more').on('click',function(){
            if(!flag){
                /*更多*/
                $(".mapPanel-DisasterResearchModule .YJ-gisPanel:lt(11)").hide();
                $(".mapPanel-DisasterResearchModule .YJ-gisPanel:gt(10)").show();
                $('.mapPanel-DisasterResearchModule .YJ-navIcon-back').show();
                $('.mapPanel-DisasterResearchModule .YJ-navIcon-more').hide();
            }else{
                /*返回*/
                $(".mapPanel-DisasterResearchModule .YJ-gisPanel:gt(10)").hide();
                $(".mapPanel-DisasterResearchModule .YJ-gisPanel:lt(11)").show();

                $('.mapPanel-DisasterResearchModule .YJ-navIcon-more').show();
                $('.mapPanel-DisasterResearchModule .YJ-navIcon-back').hide();
            }
            flag=!flag

        })


    };
    return gisMapPanel;
});