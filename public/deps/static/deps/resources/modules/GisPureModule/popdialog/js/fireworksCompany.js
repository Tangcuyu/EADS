/**
 * @title: 工矿企业烟花爆竹
 */
define(["jquery"], function ($) {
    var util = {};

    util.onOpen = function (data) {
        console.log(data)


        $('.fireworksCompany_title_view').text(data[0].tag.FIREWORKENTNAME||"暂无信息");//企业名称

        $('.fireworks_left_address').text(data[0].tag.ADDRESS||"暂无信息");//地址
        $('.fireworks_left_industrycode').text(data[0].dept.tag.DEPTTYPENAME||"暂无信息");//单位类型
        $('.fireworks_left_empnum').text(data[0].tag.WORKERNUM||"暂无信息");//职工人数
        $('.fireworks_phone_principal').text(data[0].tag.ARTIFICIALPER||"暂无信息");//主要负责人
        $('.fireworks_phone_tel').text(data[0].tag.TEL);//负责人电话


        $('.fireworks_list_1').text(data[0].district.tag.FULLNAME||"暂无信息");//行政区划
        $('.fireworks_list_2').text(data[0].dept.tag.DEPTTYPENAME||"暂无信息");//单位类型
        $('.fireworks_list_3').text(data[0].tag.ARTIFICIALPER||"暂无信息");//法定代表人姓名
        $('.fireworks_list_4').text(data[0].tag.WORKERNUM||"暂无信息");//作业人数（人）
        $('.fireworks_list_5').text(data[0].tag.TEL||"暂无信息")//电话号码
        $('.fireworks_list_8').text(data[0].tag.QUALITYINFO||"暂无信息")//产品质量检测信息
        $('.fireworks_list_9').text(data[0].tag.ADDRESS||"暂无信息")//单位地址







        if($('.fireworks_phone_fte').text()!=""){
            $('.icon_tel').show()
        }else {
            $('.fireworks_phone_safetymager').text('暂无数据')
            $('.icon_tel').hide()
        }

        //关闭面板
        $('.close_fireworksCompany_view').on('click',function () {
            $('#fireworksCompany_Details').remove().hide()
        });

        var enterprise_name=$('.fireworksCompany_title_view').html();
        $('.baidu_Corporate_portrait iframe').attr('src',EMAP_CONFIG.common.iframeUrl+'/'+enterprise_name)


        //企业画像按钮
        $('.openBaiduPicture').on('click',function () {
            $('.baidu_Corporate_portrait').show().addClass('slideInLeft');
        })

        //渲染百度标签
        $.ajax({
            url:"http://smartbot.baidu.com/show/main/chenantmp1?token=chenan#/dapingShowForchenan/query_name=%E6%B1%9F%E8%8B%8F%E5%A4%A9%E5%98%89%E5%AE%9C%E5%8C%96%E5%B7%A5%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8",
            async:false,
            type : 'POST',
            data:{query_name:enterprise_name},
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