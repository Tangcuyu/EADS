/*
* tabs 选项卡插件
* 按钮上添加"j-btn"
* 内容上添加“j-box”
* 当前项添加cur
* */

$.fn.tab=function(){
    this.each(function(){
        var aBtn=$(this).find('.j-btn');
        var aBox=$(this).find('.j-box');
        aBtn.click(function(){
            aBtn.removeClass('cur');
            aBox.removeClass('cur');
            $(this).addClass('cur');
           // aBox.hide();
            aBox.removeClass('cur');
            aBox.eq($(this).index()).addClass('cur');
        })
    })
}
$('#zt-tab').tab();