/**
 * @title: 工矿企业烟花爆竹
 */
define(["jquery"], function ($) {
    var util = {};

    util.onOpen = function (data) {
        console.log(data)


        // alert(464168416416941694)


        // $('.noncoalmin_basic_left_title').text(data[0].tag.WKKMC);//企业名称
        $('.noncoalmin_left_industrycode').text(data[0].district.tag.DISTRICTNAME||"暂无信息");//行政区划
        // $('.noncoalmin_left_empnum').text(data[0].tag.PTGRZRS);//职工人数
        // $('.noncoalmin_phone_principal').text(data[0].tag.WKKFZR);//主要负责人
        // $('.noncoalmin_phone_tel').text(data[0].tag.AQFZRBGSDH);//主要负责人电话


        $('.noncoalminEnterprise_title_view').text(data[0].tag.WKKMC||"暂无信息");//企业名称
        $('.noncoalmin_list_1').text(data[0].tag.WKKDZMC||"暂无信息");//所在地址
        $('.noncoalmin_list_1').attr("title",""+data[0].tag.WKKDZMC||"暂无信息"+"");//所在地址title
        $('.noncoalmin_list_9').text(data[0].tag.WKKFZR||"暂无信息");//主要负责人
        $('.noncoalmin_list_2').text(data[0].tag.WKKFZRBGSDH||"暂无信息");//主要负责人办公电话
        if(data[0].tag.SFSYZDWXY)
        {
            data[0].tag.SFSYZDWXY=="0"? "是" : "";
            data[0].tag.SFSYZDWXY=="1"? "否" : "";
            data[0].tag.SFSYZDWXY=="9"? "不确定" : "";
            $('.noncoalmin_list_3').text(data[0].tag.SFSYZDWXY);//是否属于重大危险源
        }
        $('.noncoalmin_list_4').text(data[0].tag.TZZYRYSL||"暂无信息");//特种作业人数
        $('.noncoalmin_list_5').text(data[0].tag.PTGRZRS||"暂无信息");//普通工人总人数
        $('.noncoalmin_list_6').text(data[0].type.tag.TAILINGPONDTYPEMC||"暂无信息");//尾矿库型式
        $('.noncoalmin_list_7').text(data[0].ws.tag.WKKDBNAME||"暂无信息");//尾矿库等级
        $('.noncoalmin_list_8').text(data[0].tag.MQDJBGD||"暂无信息");//目前堆积坝高度
        $('.noncoalmin_list_10').text(data[0].tag.MQZBC||"暂无信息");//目前主坝长
        $('.noncoalmin_list_11').text(data[0].tag.MQZBC||"暂无信息");//尾矿库现状安全度

        $('.WKKFZR').text(data[0].tag.WKKFZR||"暂无信息");
        $('.WKKFZRYDDH').text(data[0].tag.WKKFZRYDDH||"暂无信息")



        if($('.noncoalmin_phone_fte').text()!=""){
            $('.icon_tel').show()
        }else {
            $('.noncoalmin_phone_safetymager').text('暂无数据')
            $('.icon_tel').hide()
        }


        $('.close_noncoalminEnterprise_view').on('click',function () {
            $('#noncoalminEnterprise_Details').remove()
        });

        var enterprise_name=$('.noncoalminEnterprise_title_view').html();
        $('.baidu_Corporate_portrait iframe').attr('src',EMAP_CONFIG.common.iframeUrl+'/'+enterprise_name);
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
                if(result.msg=="success"&&result.data.report!=""){
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