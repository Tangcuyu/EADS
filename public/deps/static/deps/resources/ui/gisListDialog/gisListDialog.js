define(['jquery'], function ($) {

    var gisListDialog = function (options) {
        var liClickBack = options.liClickBack || null;
        var searchBack = options.searchBack || null;

        var head=options.head;
        var body=options.body;
        var containerId=options.containerId;
        var title=options.title;

        if(head.length>0){
            var listHead='<ol class="list_head">';
            for(var i=0;i<head.length;i++){
                listHead += ' <li style="width:'+head[i].width+'">'+head[i].name+'</li>'
            }
            listHead+=' </ol>';
        }

        var listBody='<div class="list_body">';
        for(var j=0;j<body.length;j++){
            var listBodyrow=""
            for(var k in body[j]){
                if(k!="id"&&k!="x"&&k!="y")
                {
                    if(body[j][k] == ""){
                        listBodyrow +='<li>暂无数据</li>';
                    }else {
                        listBodyrow +='<li>'+body[j][k]+'</li>';
                    }

                }
            }
            listBody += '<ul id="'+body[j].id+'">'+listBodyrow+'</ul>'
        }
        var str1 = "";
        var str = ""
        if($("#"+containerId).length>0){
            str1 += '<h1 class="list_title">'+title+'</h1>' +
            '<P class="list_search"><input type="text"><button>搜索</button></P>'+listHead+listBody+'<span class="close-list-dialog"></span>'
            $("#"+containerId).html(str1)
        }else{
        str += '<div class="listDialog" id="temp">' +
            '<h1 class="list_title">'+title+'</h1>' +
            '<P class="list_search"><input type="text"><button>搜索</button></P>'+listHead+listBody+'<span class="close-list-dialog"></span></div>'

        $('body').append(str);

            for(var r=0;r<head.length;r++){
                $('.list_body ul li:nth-child('+(r+1)+')').css('width',head[r].width);
            }
        }

        //拖拽
        $("#"+containerId).Tdrag({
            scope:"body",
            handle:".list_title"
        });
        //关闭
        $(".close-list-dialog").click(function(){
            $(this).parents('.listDialog').remove();
        })

        //列表点击事件
        var liClickItem = $(".list_body ul");
        liClickItem.unbind("click");
        liClickItem.on("click",function (e) {
            if(liClickBack) {
                var tmpdata;
                for(var i in body)
                {
                    if(body[i].id==$(this)[0].id)
                    {
                        tmpdata=body[i]
                    }
                }

                liClickBack(tmpdata);
            }
        });

        //查询点击事件
        var btClickItem = $(".listDialog button");
        btClickItem.unbind("click");
        btClickItem.on("click",function () {
            var text=$(".listDialog input").val();
            text=text.trim();
            // var tmpdata;
            if(text==""){
                // tmpdata=body;
                $(".list_body").find('ul').show();
            }
            else
            {
                for(var i in body)
                {
                    if(body[i].name.indexOf(text)==-1)
                    {
                        $(".list_body").find('#'+body[i].id).hide();
                    }
                    else
                    {
                        $(".list_body").find('#'+body[i].id).show();
                    }
                }
            }
            // if(searchBack) {
            //     searchBack(tmpdata);
            // }
        });
    };
    return gisListDialog;
});