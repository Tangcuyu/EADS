define(['jquery'],function ($) {

    function gisTabPanel(options){
        this.hasEl = $("body").find(options.contentId).length;
        this.containerName = options.contentId.substr(1);
        this.ifClick = (options.ifClick == false) ? false : true;
        this.clickNumCallback = options.clickNumCallback || null;
        this.clickTitleCallback = options.clickTitleCallback || null;
        //判断菜单容器是否存在
        if (!this.hasEl) {
        	$('body').append('<div id="' + this.containerName + '"></div>');
        };
        $("#"+this.containerName).addClass("aj-gisTabPanel-containerBox");
        var tabData = options.tabData || null;//tab数据
        var ifClick = options.ifClick;//是否禁止点击事件
        Object.defineProperty(this,'tabData',{
            get: function () {
                return tabData;
            },
            set: function (val) {
                if (tabData != val){
                    tabData = val;
                    this.createTabPanel(tabData,ifClick);
                };
            }
        });

        Object.defineProperty(this,'ifClick',{
            get: function () {
                return ifClick;
            },
            set: function (val) {
                if (ifClick != val){
                    ifClick = val;
                    this.createTabPanel(tabData,ifClick);
                };
            }
        })
        this.createTabPanel(tabData,ifClick);
    };
    gisTabPanel.prototype.createTabPanel = function(tabData,ifClick){
    	 //拼接html,创建DOM结构,添加到容器中
        var htmlStr = '',dataLength = tabData.length,showNumStyle;
    	htmlStr += '<div class="aj-gisTabContainer-container"><dl>';
    	for(var i = 0;i < dataLength; i++){
    		var curItem = tabData[i];
    		htmlStr += '<dd style="width:calc(100% / '+dataLength+')">';
    		htmlStr += '<div class="aj-gisTabContainer-item">';
    		if(curItem.tabNumber == ""){
    			showNumStyle = "display:none;"
    		}else{
    			showNumStyle = "display:block;"
    		}
    		htmlStr += '<p><span class="aj-gisTabContainer-itemName" data-codeKey="'+curItem.codeKey+'">'+curItem.tabTitle+'</span><span class="aj-gisTabContainer-itemNumber" style="'+showNumStyle+'">('+curItem.tabNumber+')</span></p>';
    	}
    	$("#"+this.containerName).html(htmlStr);
        
        
        var self = this;  
        //获取每一个tab,并分别为数字绑定点击事件
        var clickTabItem = $("#"+this.containerName).find(".aj-gisTabContainer-itemNumber");
        var clickTitleItem = $("#"+this.containerName).find(".aj-gisTabContainer-itemName"); 
        if(self.ifClick){  
	        //解绑点击事件
        	clickTabItem.unbind("click");
        	clickTabItem.on("click",function () {
	        	if(self.clickNumCallback) {
	                self.clickNumCallback($(this));
	            }
        	});
        	
        	//解绑点击事件
	        clickTitleItem.unbind("click");
	        clickTitleItem.on("click",function () {
	        	$(this).closest("dd").addClass("aj-gisTabContainer-itemActive").siblings().removeClass("aj-gisTabContainer-itemActive");
	        	if(self.clickTitleCallback) {
	                self.clickTitleCallback($(this).attr("data-codeKey"));
	            }
	        });
	        
        	clickTitleItem.on("mouseover",function () {
	        	$(this).closest("dd").addClass('hover').removeClass('leave');
        	});
        	clickTitleItem.on("mouseout",function () {
	        	$(this).closest("dd").removeClass('hover').addClass('leave');
        	});
        }else{
        	//解绑点击事件
        	clickTabItem.unbind("click");
        	clickTitleItem.unbind("click");
        }
    }
    //更新tab数据,更新是否禁止点击
    gisTabPanel.prototype.updateTabPanelData = function (tabData, ifClick) {
        this.tabData = tabData;
        this.ifClick = ifClick;
    };
    //销毁组件
    gisTabPanel.prototype.closeGisTabPanel = function () {
       $("#"+this.containerName).find(".aj-gisTabContainer-container").remove(); 
    };
 	gisTabPanel.prototype.selectGisTabItem = function (index) {
       $("#"+this.containerName).find(".aj-gisTabContainer-container > dl > dd").eq(index).addClass("aj-gisTabContainer-itemActive").siblings().removeClass("aj-gisTabContainer-itemActive"); 
    };
    gisTabPanel.prototype.unSelectGisTabItem = function (index) {
        $("#"+this.containerName).find(".aj-gisTabContainer-container > dl > dd").eq(index).removeClass("aj-gisTabContainer-itemActive").siblings().removeClass("aj-gisTabContainer-itemActive");
    };
    return gisTabPanel;
})