require.config({
    shim: {},
    paths: {}
});
define([], function () {
    var util = {};
    //处理天气图片
    function formatFlgToImg(str) {
        var strTmp = '';
        var imgMap ={ '严重霾': 'en_0',
            '中到大雨': 'en_1',
            '中到大雪': 'en_2',
            '中度霾': 'en_3',
            '中雨': 'en_4',
            '中雪': 'en_5',
            '农雾': 'en_6',
            '冻雨': 'en_7',
            '多云': 'en_8',
            '大到暴雨': 'en_9',
            '大到暴雪': 'en_10',
            '大暴雨': 'en_11',
            '大暴雨到特大暴雨': 'en_12',
            '大雨': 'en_13',
            '大雪': 'en_14',
            '大雾': 'en_15',
            '小到中雨': 'en_16',
            '小到中雪': 'en_17',
            '小雨': 'en_18',
            '小雪': 'en_19',
            '强沙尘暴': 'en_20',
            '强浓雾': 'en_21',
            '扬沙': 'en_22',
            '晴': 'en_23',
            '暴雨': 'en_24',
            '暴雨到大暴雨': 'en_25',
            '暴雪': 'en_26',
            '沙尘暴': 'en_27',
            '浮尘': 'en_28',
            '特大暴雨': 'en_29',
            '特强浓雾': 'en_30',
            '重度霾': 'en_31',
            '阴': 'en_32',
            '阵雨': 'en_33',
            '阵雪': 'en_34',
            '雨夹雪': 'en_35',
            '雪': 'en_36',
            '雷阵雨': 'en_37',
            '雷阵雨伴有冰雹': 'en_38',
            '雾': 'en_39',
            '霾': 'en_40' };

        str.split('转').forEach(function (item) {
            strTmp += '<span><img src="' + webApp + 'src/modules/ContentModule/ModulePanel/weatherInfoModule/img/weather/' + imgMap[item] + '.png"></span>';
        });
        return strTmp;
    }
    //未来三天预报
    util.threeDaysWeather=function (adcode,cb) {
        //查询24小时天气信息
        $.ajax({url:EMAP_CONFIG.common.urlWeb+'/weatherdata/catchdata/weather/3D?districtCode='+adcode}).done(function (res){
            var success = res.success;
            var message = res.message;
            if(success && message && message.length > 0) {
                var data1 = JSON.parse(res.message);
                cb(data1);
            }}).fail(function() {
            var res={};
            res.message = '[{"DAYHIGHT":"最高：32℃","DAYMS":"多云","DQ":"北京","DQQW":"25℃","FL":"3级","FX":"西北风","ID":"69871fe14677409b8d1d766477b63126","KWXL":"--","NIGHLOW":"最低：22℃","NIGHTMS":"多云","NJD":"16 KM","QY":"1026 hPa","RC":"07:35","RELID":"110000","RL":"17:04","RQ":"2019-01-07 13","RQTJ":"today","SD":"15%","STATE":"0","TEMPHOUR":"","ZWX":"最弱"},{"DAYHIGHT":"最高：30℃","DAYMS":"多云","DQ":"北京","DQQW":"","FL":"1级","FX":"东南风","ID":"a2cff0fc9abd4a389747d22fbc3f786a","KWXL":"中度污染","NIGHLOW":"最低：22℃","NIGHTMS":"多云","NJD":"","QY":"","RC":"06:53","RELID":"110000","RL":"18:01","RQ":"2019-02-24 04","RQTJ":"fourth","SD":"","STATE":"0","TEMPHOUR":"","ZWX":""},{"DAYHIGHT":"最高：30℃","DAYMS":"多云","DQ":"北京","DQQW":"","FL":"1级","FX":"东南风","ID":"686dd175c05945a08f834b9d2f68ddcb","KWXL":"中度污染","NIGHLOW":"最低：22℃","NIGHTMS":"多云","NJD":"","QY":"","RC":"06:53","RELID":"110000","RL":"18:01","RQ":"2019-02-24 04","RQTJ":"third","SD":"","STATE":"0","TEMPHOUR":"","ZWX":""},{"DAYHIGHT":"最高：30℃","DAYMS":"多云","DQ":"北京","DQQW":"","FL":"东南风2级","FX":"","ID":"4382bee1d5a6422ea9f20a7d605505e0","KWXL":"中度污染","NIGHLOW":"最低：22℃","NIGHTMS":"多云","NJD":"","QY":"","RC":"06:55","RELID":"110000","RL":"17:59","RQ":"2019-02-24 04","RQTJ":"tomorrow","SD":"31%","STATE":"0","TEMPHOUR":"","ZWX":"中等"}]'
            //jb 温度 jc风向编号 jd风速 je相对湿度 jf预报时间
            var data1=JSON.parse(res.message);
            cb(data1);
        })
    }
    //渲染24小时天气预报
    util.render24HHtml=function (data1) {
//处理风向
        function translateWindX(num) {
            var temp2 = parseInt(num);
            var windX = '';

            if (temp2 == 0) {
                windX = '持续无风';
            } else if (temp2 == 1) {
                windX = '东北风';
            } else if (temp2 == 2) {
                windX = '东风';
            } else if (temp2 == 3) {
                windX = '东南风';
            } else if (temp2 == 4) {
                windX = '南风';
            } else if (temp2 == 5) {
                windX = '西南风';
            } else if (temp2 == 6) {
                windX = '西风';
            } else if (temp2 == 7) {
                windX = '西北风';
            } else if (temp2 == 8) {
                windX = '北风';
            } else if (temp2 == 9) {
                windX = '旋转风';
            }
            return windX;
        }

        var str='<div style="background: #030d1e;padding-right:10px;"><p class="secondsSecens-titledetail"><span class="realtimebtn spanActive">24小时</span><span class="tomorrow">明天</span><span class="third">后天</span><a class="detail_hd_close"></a></p><div class="secondsSecens-jxyubaodetail">\n' +
            '        <div class="secondsSecens-jxyubao-title"><span>未来时刻</span>';
        str+='<span>'+data1[19].jf.substr(8,2)+':'+data1[19].jf.substr(10,2)+'</span><span>'+data1[22].jf.substr(6,2)  +'日'+data1[22].jf.substr(8,2)+':'+data1[22].jf.substr(10,2)+'</span><span>'+data1[1].jf.substr(8,2)+':'+data1[1].jf.substr(10,2)+'</span><span>'+data1[4].jf.substr(8,2)+':'+data1[4].jf.substr(10,2)+'</span><span>'+data1[8].jf.substr(8,2)+':'+data1[8].jf.substr(10,2)+'</span><span>'+data1[13].jf.substr(8,2)+':'+data1[13].jf.substr(10,2)+'</span><span>'+data1[16].jf.substr(8,2)+':'+data1[16].jf.substr(10,2)+'</span><span>'+data1[21].jf.substr(8,2)+':'+data1[21].jf.substr(10,2)+'</span></div>';
        str+='<ul class="secondsSecens-jxyubao-ul"><li><span class="secondsSecens-yubao-color"><b class="xiaowendu"></b>气温</span>';
        str+='<span>'+ data1[0].jb+'</span><span>'+ data1[3].jb+'</span><span>'+ data1[6].jb+'</span><span>'+ data1[9].jb+'</span><span>'+ data1[12].jb+'</span><span>'+ data1[15].jb+'</span><span>'+ data1[18].jb+'</span><span>'+ data1[21].jb+'</span></li>';

        str+='<li><span class="secondsSecens-yubao-color"><b class="xiaojiangshui"></b>湿度</span>';
        str+='<span>'+ data1[0].je+'</span><span>'+ data1[3].je+'</span><span>'+ data1[6].je+'</span><span>'+ data1[9].je+'</span><span>'+ data1[12].je+'</span><span>'+ data1[15].je+'</span><span>'+ data1[18].je+'</span><span>'+ data1[21].je+'</span></li>';

        str+='<li><span class="secondsSecens-yubao-color"><b class="weatherFengSu"></b>风速</span>';
        str+='<span>'+ data1[0].jd+'</span><span>'+ data1[3].jd+'</span><span>'+ data1[6].jd+'</span><span>'+ data1[9].jd+'</span><span>'+ data1[12].jd+'</span><span>'+ data1[15].jd+'</span><span>'+ data1[18].jd+'</span><span>'+ data1[21].jd+'</span></li>';

        str+='<li><span class="secondsSecens-yubao-color"><b class="weatherFengXiang"></b>风向</span>';
        str+='<span>'+ translateWindX(data1[0].jc)+'</span><span>'+ translateWindX(data1[3].jc)+'</span><span>'+ translateWindX(data1[6].jc)+'</span><span>'+ translateWindX(data1[9].jc)+'</span><span>'+ translateWindX(data1[12].jc)+'</span><span>'+ translateWindX(data1[15].jc)+'</span><span>'+ translateWindX(data1[18].jc)+'</span><span>'+ translateWindX(data1[21].jc)+'</span></li></ul></div></div>';
        // $('.secondsSecens-jxyubao-ul').html(module.str);
        return str;
    }
    //查询24小时数据
    util.query24H=function (adcode,cb) {
        //查询24小时天气信息
        $.ajax({url:EMAP_CONFIG.common.Weatherservice.split('catchdata/')[0]+'catchdata/weather/24H?districtCode='+adcode}).done(function (res) {
            var success = res.success;
            var message = res.message;
            if(success && message && message.length > 0) {
                var data1 = JSON.parse(res.message);
                cb(data1);
            }}).fail(function() {
            var res={};
            res.message =  '[' +
                '{"ja":"53","jb":"26","jc":"8","jd":"4","je":"96","jf":"201902240400"},{"ja":"53","jb":"28","jc":"8","jd":"4","je":"96","jf":"201902240500"},{"ja":"53","jb":"30","jc":"8","jd":"4","je":"96","jf":"201902240600"},{"ja":"53","jb":"31","jc":"8","jd":"5","je":"95","jf":"201902240700"},{"ja":"53","jb":"32","jc":"8","jd":"5","je":"94","jf":"201902240800"},{"ja":"01","jb":"31","jc":"8","jd":"5","je":"84","jf":"201902240900"},{"ja":"01","jb":"31","jc":"1","jd":"5","je":"74","jf":"201902241000"},{"ja":"00","jb":"30","jc":"1","jd":"5","je":"64","jf":"201902241100"},{"ja":"00","jb":"29","jc":"1","jd":"4","je":"61","jf":"201902241200"},{"ja":"00","jb":"30","jc":"1","jd":"4","je":"58","jf":"201902241300"},{"ja":"00","jb":"29","jc":"1","jd":"4","je":"56","jf":"201902241400"},{"ja":"00","jb":"30","jc":"1","jd":"4","je":"60","jf":"201902241500"},{"ja":"00","jb":"28","jc":"1","jd":"4","je":"63","jf":"201902241600"},{"ja":"00","jb":"29","jc":"1","jd":"4","je":"67","jf":"201902241700"},{"ja":"00","jb":"29","jc":"1","jd":"4","je":"70","jf":"201902241800"},{"ja":"00","jb":"30","jc":"1","jd":"4","je":"72","jf":"201902241900"},{"ja":"00","jb":"30","jc":"1","jd":"4","je":"74","jf":"201902242000"},{"ja":"01","jb":"29","jc":"2","jd":"4","je":"80","jf":"201902242100"},{"ja":"01","jb":"29","jc":"3","jd":"4","je":"85","jf":"201902242200"},{"ja":"01","jb":"28","jc":"8","jd":"4","je":"90","jf":"201902242300"},{"ja":"01","jb":"31","jc":"3","jd":"4","je":"88","jf":"201902250000"},{"ja":"01","jb":"31","jc":"2","jd":"4","je":"85","jf":"201902250100"},{"ja":"01","jb":"30","jc":"8","jd":"5","je":"83","jf":"201902250200"},{"ja":"02","jb":"30","jc":"8","jd":"4","je":"83","jf":"201902250300"}]';
            //jb 温度 jc风向编号 jd风速 je相对湿度 jf预报时间
            var data1=JSON.parse(res.message);
            cb(data1);
        })
    }

    //打开默认详情
    util.showDetailPanel=function (data) {

        $('.realtimebtn').addClass('spanActive');
            var data1="";
                util.query24H(data.tag.tag.adcode,function (res) {
                    data1=res;
                    var str=util.render24HHtml(data1);
                    var point = G.options.commonGIS._createPoint(parseFloat(data.pointX), parseFloat(data.pointY));
                    G.options.commonGIS._addPopupDetaills(point,str,[-230, -35]);
                    $('.secondsSecens-titledetail span').unbind('click').click(function (e) {
                        $(this).addClass('spanActive').siblings().removeClass('spanActive');
                        if($(this).hasClass('tomorrow'))//如果点击明天
                        {
                            var objDate=new Date();
                            objDate.setDate(objDate.getDate()+1);
                            var days=objDate.format('yyyy-MM-dd');
                            var nWeek = objDate.getDay();

                            if(nWeek==0)nWeek='日';
                            if(nWeek==1)nWeek='一';
                            if(nWeek==2)nWeek='二';
                            if(nWeek==3)nWeek='三';
                            if(nWeek==4)nWeek='四';
                            if(nWeek==5)nWeek='五';
                            if(nWeek==6)nWeek='六';
                            util.threeDaysWeather(data.tag.tag.adcode,function (res) {
                                res.forEach(function (item) {
                                  if(item.RQTJ=='tomorrow')
                                  {
                                      var str1= '<li style="display: flex;padding-left: 20px;">\
                    <div class="weatherDate">' + days + '</div>\
                     <div class="yjgl-dateData">星期' + nWeek + '</div>\
                     <div class="weatherPic">' + formatFlgToImg(item.DAYMS) + '</div>\
                     <div>' + item.DAYMS + '</div>\
                    <div>' + item.DAYHIGHT + '<br>' + item.NIGHLOW  + '</div>\
                    <div class="wind">' + item.FX + item.FL + '</div>\
                    </li>';
                     $('.secondsSecens-jxyubaodetail').html(str1);
                                  }
                                })
                            })
                        }
                        else if($(this).hasClass('third'))//如果点击后天
                        {
                            var objDate=new Date();
                            objDate.setDate(objDate.getDate()+2);
                            var days=objDate.format('yyyy-MM-dd');
                            var nWeek = objDate.getDay();
                            if(nWeek==0)nWeek='日';
                            if(nWeek==1)nWeek='一';
                            if(nWeek==2)nWeek='二';
                            if(nWeek==3)nWeek='三';
                            if(nWeek==4)nWeek='四';
                            if(nWeek==5)nWeek='五';
                            if(nWeek==6)nWeek='六';
                            util.threeDaysWeather(data.tag.tag.adcode,function (res) {
                                res.forEach(function (item) {
                                    if(item.RQTJ=='third')
                                    {
                                        var str1= '<li style="display: flex;padding-left: 20px;">\
                    <div class="weatherDate">' + days + '</div>\
                     <div class="yjgl-dateData">星期' + nWeek + '</div>\
                     <div class="weatherPic">' + formatFlgToImg(item.DAYMS) + '</div>\
                     <div>' + item.DAYMS + '</div>\
                    <div>' + item.DAYHIGHT + '<br>' + item.NIGHLOW  + '</div>\
                    <div class="wind">' + item.FX + item.FL + '</div>\
                    </li>';
                                        $('.secondsSecens-jxyubaodetail').html(str1);
                                    }
                                })
                            })
                        }
                        else
                        {
                            //恢复到24小时实时
                            util.showDetailPanel(data);
                        }
                    });
            });
    }
    return util;
})