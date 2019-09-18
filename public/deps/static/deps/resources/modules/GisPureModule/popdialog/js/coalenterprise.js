/**
 * @title: 重点设施地圖點位
 */
define(["jquery"], function ($) {
    var util = {};

    util.onOpen = function (data) {
        data=data[0]
        $('.cola-title_view').text(data.tag.COALNAME||"无");//企业名称

        $('.coal-basic_left_address').text(data.tag.ADDRESS||"无");//地址
        if(data.district)
        {
            $('.coal-xzqhua').text(data.district.tag.DISTRICTNAME||"无");//行政区划
        }
        else
        {
            $('.coal-xzqhua').text("无");//行政区划
        }
        if(data.type)
        {
            $('.coal-type').text(data.type.tag.COALTYPENAME||"无");//煤矿类型
        }
        else
        {
            $('.coal-type').text("无");//煤矿类型
        }
        $('.coal-farpre').text(data.tag.LEGAL_NAME||"无");//法人代表
        $('.coal-personnum').text(data.tag.WORERNUM||"暂无信息");//职工人数
        if(data.state)
        {
            $('.coal-status').text(data.state.tag.COALSTATENAME||"暂无信息");//职工人数
        }
        else
        {
            $('.coal-status').text("暂无信息");//职工人数
        }
        $('.coal_phone_tel').text(data.tag.CONTROLCENTERTEL||"暂无信息");//

        if(data.district)
        {
            $('.coal-design').text(data.district.tag.FULLNAME||"暂无信息");//行政区划
        }
        else
        {
            $('.coal-design').text("暂无信息");//行政区划
        }

        $('.coal-PROVED_OUTPUT').text(data.tag.ADDRESS||"暂无信息");//矿井地址
        $(".coal-PROVED_OUTPUT").attr("title",""+data.tag.ADDRESS||"暂无信息"+"")

        $('.VENTILATESTYLE').text(data.tag.DESIGN_OUTPUT||"");//设计生产能力
        $('.STANDARDCLASS').text(data.tag.WORERNUM||"暂无信息");//职工人数
        $('.PRODUCT_DATE').text(data.tag.CONTROLCENTERTEL||"暂无信息");//调度室电话
        if(data.dept)
        {
            $('.dept').text(data.dept.tag.PARENTNAME||"暂无信息");//上级企业
        }
        else
        {
            $('.dept').text("暂无信息");//上级企业
        }


        if(data.ws)
        {
            $('.PARENTNAME').text(data.ws.tag.WS_GRADENAME||"暂无信息");//瓦斯等级
        }
        else
        {
            $('.PARENTNAME').text("暂无信息");//瓦斯等级
        }
        $('.APPROVED_MINE_DEPTH').text(data.tag.PRODUCT_DATE.substring(0,10)||"暂无信息");//投产时间
        if(data.mine)
        {
            $('.mine_meikuang').text(data.mine.tag.MINESTYLENAME||"暂无信息");//开拓方式
        }
        else
        {
            $('.mine_meikuang').text("暂无信息");//开拓方式
        }


        $('.WS_GRADE').text(data.tag.WS_GRADE||"暂无信息");//主要灾害类型
        if(data.hydro)
        {
            $('.hydro-HYDROGEOLOGICALNAME').text(data.hydro.tag.HYDROGEOLOGICALNAME||"暂无信息");//水文地质类型
        }
        else
        {
            $('.hydro-HYDROGEOLOGICALNAME').text("暂无信息");//水文地质类型
        }
        if(data.transmit)
        {
            $('.transmit-TRANSMITSTYLENAME').text(data.transmit.tag.TRANSMITSTYLENAME||"暂无信息");//
        }
        else
        {
            $('.transmit-TRANSMITSTYLENAME').text("暂无信息");//
        }
        if(data.power)
        {
            $('.power-OWERSTYLENAME').text(data.power.tag.OWERSTYLENAME||"暂无信息");//
        }
        else
        {
            $('.power-OWERSTYLENAME').text("暂无信息");//
        }
        $('.MINE_WATERBURST').text(data.tag.MINE_WATERBURST||"暂无信息");//
        $('.MINE_WATERBURST_MAX').text(data.tag.MINE_WATERBURST_MAX||"暂无信息");//
        $('.RF_LITHOLOGY').text(data.tag.RF_LITHOLOGY||"暂无信息");//

        $('.LEGAL_NAME').text(data.tag.LEGAL_NAME||"暂无信息");
        $('.CONTROLCENTERTEL').text(data.tag.CONTROLCENTERTEL||"暂无信息");






        // 判断是否为修改的两个公司
        var pointTitle = $('.cola-title_view').html();
        var addstr;
        if (pointTitle == '新平鑫福矿产资源开发有限公司' || pointTitle == '镇沅县三章田煤矿' || pointTitle ==  '石屏县龙武育英煤矿二号井') {
            addstr += '<div class="enterpriseCrisis_view_addmsg">\n' +
                '        <div class="addmsg_close"></div>\n' +
                '        <div class="addmsg_close_title_new_02" pointTitles="'+pointTitle+'">工矿视频</div>\n' +
                '        <div class="addmsg_text_meikuang">';
            if (pointTitle == '新平鑫福矿产资源开发有限公司') {
                addstr += '井口';
            } else if (pointTitle == '镇沅县三章田煤矿') {
                addstr += '井口';
            } else if (pointTitle == '石屏县龙武育英煤矿二号井') {
                addstr += '井口';
            }
            addstr += '</div>\n'

                if(pointTitle == '新平鑫福矿产资源开发有限公司'){
                    addstr+='<div class="addmsg_imgs_meikuang_01"></div></div>'
                }else if(pointTitle == '镇沅县三章田煤矿'){
                    addstr+='<div class="addmsg_imgs_meikuang_02"></div></div>'
                }else if(pointTitle == '石屏县龙武育英煤矿二号井'){
                    addstr+='<div class="addmsg_imgs_meikuang_03"></div></div>'
                }
                // '            <div class="addmsg_imgs_meikuang"></div>\n' +
                // '            <div class="addmsg_position" style="display: none">\n' +
                // '                周边环境如下：</br>\n' +
                // '                东面：厂区距离小学600米；西面：厂区距离高速公路约1000米；北面、南面均为耕地。\n' +
                // '            </div>\n' +
                // '        </div>'
        };

        $('.enterpriseCrisis_view').append(addstr);
        $('.enterpriseCrisis_view_addmsg').show();

        console.log(pointTitle)


        /*点击知识图谱*/

        $('.addmsg_close_title_new_02').on('click',function () {

            var ids=$('.addmsg_close_iframe');
            if(ids.length==0){
                $('body').append('<div class="addmsg_close_iframe"><video style="width: 100%;height: 100%"  src="" controls="controls" autoplay="autoplay"><source></video><div class="close_zhishi"></div></div>');
            }

            var pointTitles=$(this).attr('pointTitles');

            // $('.addmsg_close_iframe video').attr('src',)
            if(pointTitles=='新平鑫福矿产资源开发有限公司'){
                $('.addmsg_close_iframe video ').attr('src',EMAP_CONFIG.common.videoPath+'video/0726001.mp4')
            }else if(pointTitles=='镇沅县三章田煤矿'){
                $('.addmsg_close_iframe video ').attr('src',EMAP_CONFIG.common.videoPath+'video/0726002.mp4')
            }else if(pointTitles=='石屏县龙武育英煤矿二号井'){
                $('.addmsg_close_iframe video ').attr('src',EMAP_CONFIG.common.videoPath+'video/0726003.mp4')
            }
            // console.log($(this).attr('pointTitles'))
        })

        /*关闭知识图谱*/
        $('body').on('click','.close_zhishi',function () {
            $('.addmsg_close_iframe').remove();
        })







        $('body').on('click','.coal-close_enterpriseCrisis_view',function () {
            $(this).parents('#coalenterprise_Details').remove()
        })


        var enterprise_name=$('.cola-title_view').html();
        //企业画像按钮
        $('.openBaiduPicture').on('click',function () {
            $('.baidu_Corporate_portrait').show().addClass('slideInLeft');
        })
        $('.baidu_Corporate_portrait iframe').attr('src',EMAP_CONFIG.common.iframeUrl+'/'+enterprise_name);
        //渲染百度标签
        $.ajax({
            url:"http://smartbot.baidu.com/show/main/chenantmp1?token=chenan#/dapingShowForchenan/query_name=%E6%B1%9F%E8%8B%8F%E5%A4%A9%E5%98%89%E5%AE%9C%E5%8C%96%E5%B7%A5%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8",
            async:false,
            type : 'POST',
            data:{'query_name':enterprise_name},
            success: function (result) {
                if(result.msg=="success"){
                    $('.baiduLabel p span:first-child').html(result.data.riskLevel);
                    $('.baiduLabelCont').html(result.data.report);
                }else{
                    throw new Error('查询失败');
                }
            },
            error: function (e) {
                throw new Error('查询失败');
            }
        })



    }
    return util
})