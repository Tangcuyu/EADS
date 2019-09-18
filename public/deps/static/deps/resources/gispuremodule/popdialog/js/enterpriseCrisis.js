/**
 * @title: 重点设施地圖點位
 */
require.config({
    paths: {
        "DangerEnterpriseDetail":webApp + 'src/modules/GisPureModule/js/DangerEnterpriseDetail',
    }})
define(["jquery","DangerEnterpriseDetail"], function ($,DangerEnterpriseDetail) {
    var util = {};
    util.onOpen = function (data) {
        DangerEnterpriseDetail.renderPanel(data,function (html) {
            $('.enterpriseCrisis_view_information').html(html);
            $(".bj-rescueForces-detailListRight").css('display','none');

            if(data.tag.RISKLEVEL)
            {
                $('.enterpriseCrisis_view_information li').eq(0).append('<p class="enterprise_basic_right_0'+data.tag.RISKLEVEL+'">'+data.tag.RISKLEVEL+'</p>')
            }

            this.contentDom = $('.enterpriseCrisis_view_information');
            //
            var self=this;
            this.contentDom.find('[name=detailclose]').hide();

            // 判断是否为修改的两个公司
            var pointTitle = $('.title-title-title span').html();
            var addstr;
            if (pointTitle == '玉溪汇溪金属铸造制品有限公司' || pointTitle == '云南梅塞尔气体产品有限公司玉溪分公司' || pointTitle ==  '云南新蓝景化学工业有限公司') {
                addstr += '<div class="enterpriseCrisis_view_addmsg">\n' +
                    '        <div class="addmsg_close"></div>\n' +
                    '        <div class="addmsg_close_title_new_02" pointTitles="'+pointTitle+'">知识图谱</div>\n' +
                    '        <div class="addmsg_text">';
                if (pointTitle == '玉溪汇溪金属铸造制品有限公司') {
                    addstr += '主要产品为乙醇，属于易燃液体。\n' +
                        '                当前乙醇仓库发生液体泄露但尚未发生火灾。建议迅速用砂土、\n' +
                        '                硅胶、酸性粘结剂、通用粘结剂、锯木屑等惰性吸附物质吸收，\n' +
                        '                废液用防爆泵转至槽车或专用收集器内回收。';
                } else if (pointTitle == '云南梅塞尔气体产品有限公司玉溪分公司') {
                    addstr += '主要产品为黄磷，属于自燃固体，\n' +
                        '                该企业涉及黄磷精制槽三级重大危险源。\n' +
                        '                当前，黄磷精制槽处发生火灾，建议消防员穿全身耐酸碱消防服、\n' +
                        '                佩戴空气呼吸器从上风向进入火场，采用雾状水灭火。';
                } else if (pointTitle == '云南新蓝景化学工业有限公司') {
                    addstr += '主要产品为黄磷，属于自燃固体，\n' +
                        '                该企业涉及黄磷精制槽三级重大危险源。\n' +
                        '                当前，黄磷精制槽处发生火灾，建议消防员穿全身耐酸碱消防服、\n' +
                        '                佩戴空气呼吸器从上风向进入火场，采用雾状水灭火。';
                }
                addstr += '</div>'

                if(pointTitle == '玉溪汇溪金属铸造制品有限公司'){
                    addstr+='<div class="addmsg_imgs_weihua_01"></div>'
                }else if(pointTitle == '云南梅塞尔气体产品有限公司玉溪分公司'){
                    addstr+='<div class="addmsg_imgs_weihua_02"></div>'
                }else if(pointTitle == '云南新蓝景化学工业有限公司'){
                    addstr+='<div class="addmsg_imgs_weihua_03"></div>'
                }

                addstr+=

                    '            <div class="addmsg_position">\n' +
                    '                周边环境如下：</br>\n' +
                    '                东面：厂区距离小学600米；西面：厂区距离高速公路约1000米；北面、南面均为耕地。\n' +
                    '            </div>\n' +
                    '        </div>'
            };

            $('.enterpriseCrisis_view').append(addstr);
            $('.enterpriseCrisis_view_addmsg').show();



            /*点击知识图谱*/

            $('.addmsg_close_title_new_02').on('click',function () {
                var pointTitles=$(this).attr('pointTitles');
                $('body').append('<div class="addmsg_close_iframe"><video style="width: 100%;height: 100%"  src="" controls="controls" autoplay="autoplay"><source></video><div class="close_zhishi"></div></div>');
                // $('.addmsg_close_iframe video').attr('src',)
                if(pointTitles=='玉溪汇溪金属铸造制品有限公司'){
                    $('.addmsg_close_iframe video ').attr('src',EMAP_CONFIG.common.videoPath+'video/new01.mp4')
                }else if(pointTitles=='云南梅塞尔气体产品有限公司玉溪分公司'){
                    $('.addmsg_close_iframe video ').attr('src',EMAP_CONFIG.common.videoPath+'video/new02.mp4')
                }else if(pointTitles=='云南新蓝景化学工业有限公司'){
                    $('.addmsg_close_iframe video ').attr('src',EMAP_CONFIG.common.videoPath+'video/new03.mp4')
                }
                // console.log($(this).attr('pointTitles'))
            })

            /*关闭知识图谱*/
            $('body').on('click','.close_zhishi',function () {
                $('.addmsg_close_iframe').remove();
            })



            // 关闭右侧面板
            $('.addmsg_close').click(function () {
                $('.enterpriseCrisis_view_addmsg').hide();
            })

            //关闭面板
            $('.close_enterpriseCrisis_view').on('click',function () {
                $('#enterpriseCrisis_Details').remove();
                $('.enterpriseCrisis_view_addmsg').remove();
            });

            //更多按钮
            /*$('.view_btn').on('click',function () {
                $('.enterprisePicture-cotaniner').css('zIndex',99999999);
                $('.enterprisePicture-cotaniner').show();
                $('.enterprisePicture-cotaniner iframe').attr('src',EMAP_CONFIG.common.iframeUrl+'/'+enterprise_name)
            })
            $('.closeEnterprisePictureBtn').on('click',function () {
                $('.enterprisePicture-cotaniner').hide()
            })*/

            var enterprise_name=$('.title-title-title span').html();
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

        });

        return;
        /*  $('.enterprise_basic_left_title').text(data.tag.DAGCHEMENTNAME||"无");//企业名称
          $('.basic_left_address').text(data.tag.ADDRESS||"无");//地址
          $('.basic_left_industrycode').text(data.tag.INDUSTRYCODE1NAME||"无");//行业分类及行业代码
          $('.basic_left_empnum').text(); //empnum  //职工人数
          $('.enterprise_phone_principal').text(data.tag.PRINCIPAL||"无");//企业主要负责人
          $('.enterprise_phone_tel').text(data.tag.PRINCIPALTEL||"无");//企业主要负责人电话
          $('.enterprise_phone_safetymager').text(data.tag.SAFETYMAGER||"无");//分管安全负责人
          $('.enterprise_phone_fte').text(data.tag.SAFETYMAGERTEL||"无");//分管安全负责人电话
          $('.enterprise_produce_sumoutput').text(data.tag.SUMOUTPUT||"无");//总生产量
          $('.enterprise_produce_totalstorcap').text(data.tag.TOTALSTORCAP||"无");//存储量
          $('.produce_list1').text(data.tag.MAINPROTANDSCALESTR||"无")//主要产品和生产规模
          $('.coal-status').text(data.tag.MAINPROTANDSCALESTR||"无")//矿井状态




          if(data.tag.RISKLEVEL)
          {
              $('.enterprise_basic_right').append('<p class="enterprise_basic_right_0'+data.tag.RISKLEVEL+'">'+data.tag.RISKLEVEL+'级</p>')
          }



          $('.close_enterpriseCrisis_view').on('click',function () {
              $('#enterpriseCrisis_Details').remove()
          });*/




    }
    return util
})