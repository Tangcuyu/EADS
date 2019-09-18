/**
 * @title: 重点设施地圖點位
 */
define(["jquery"], function ($) {
    var util = {};

    util.onOpen = function (data) {
        console.log(data)
        // alert(11111)

        $('.industrial_basic_left_title').text(data[0].tag.WHSMYHBZNAME||"暂无信息");//企业名称
        $('.industrial_left_address').text(data[0].tag.ADDRESS||"暂无信息");//地址
        $('.industrial_left_industrycode').text(data[0].nature.tag.ENTNATURENAME||"暂无信息");//企业性质
        $('.industrial_left_empnum').text(data[0].tag.EMPNUM||"暂无信息");//员工总数
        $('.industrial_phone_principal').text(data[0].tag.ARTIFICIALPER||"暂无信息");//法定负责人
        $('.industrial_phone_tel').text(data[0].tag.ARTIFICIALPERTEL||"暂无信息");//法定负责人电话


        $('.industrialEnterprise_title_view').text(data[0].tag.WHSMYHBZNAME||"暂无信息");//企业名称




        $('.industrial_list_1').text(data[0].industry.tag.INDUSTRYNAME||"暂无信息");//所属行业
        $('.industrial_list_9').text(data[0].district.tag.FULLNAME||"暂无信息");//行政区划
        $('.industrial_list_2').text(data[0].tag.ADDRESS||"暂无信息");//地址
        $('.industrial_list_2').attr("title",""+data[0].tag.ADDRESS||"暂无信息"+"");//地址title
        $('.industrial_list_3').text(data[0].nature.tag.ENTNATURENAME||"暂无信息");//企业性质
        $('.industrial_list_4').text(data[0].tag.EMPNUM||"暂无信息");//员工总数
        $('.industrial_list_5').text(data[0].tag.SPECIALNUM||"暂无信息");//特种作业人数
        $('.industrial_list_6').text(data[0].tag.FULLGADMINNUM||"暂无信息");//专职安全管理人员
        $('.industrial_list_7').text(data[0].tag.CONTACTPER ||"暂无信息");//法定代表人
        $('.industrial_list_8').text(data[0].tag.CONTACTPERTEL||"暂无信息");//法定代表人电话



        if($('.industrial_phone_fte').text()!=""){
            $('.icon_tel').show()
        }else {
            $('.industrial_phone_safetymager').text('暂无数据')
            $('.icon_tel').hide()
        }





        $('.close_industrialEnterprise_view').on('click',function () {
            $('#industrialEnterprise_Details').remove()
        });


        var enterprise_name=$('.industrialEnterprise_title_view').html();
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