define(['jquery','gisPagination'],function ($, gisPagination) {

    function gisList(ops) {

        var hasEl = $("body").find(ops.el).length;
        var elName = ops.el.substr(1);
        if(!hasEl) {
            $('body').append('<div id="'+ elName +'"></div>');
        }

        this.el = ops.el;
        this.$el = $(ops.el);
        this.data = ops.data;
        this.tpl = ops.data.tpl;
        this.simple = ops.data.simple || true;
        this.pageSize = ops.data.pageSize || 5;
        this.showTotal = ops.data.showTotal || true;
        this.total = ops.data.total || ops.data.listData.length;
        this.serverPaging = ops.data.serverPaging || false;
        this.clickCallback = ops.data.clickCallback;
        this.pageClickCallback = ops.data.pageClickCallback;

        var listData = ops.data.listData || null;
        Object.defineProperty(this,'listData',{
            get: function () {
                return listData
            },
            set: function (val) {
                if (listData != val){
                    listData = val;
                    this.total = listData.length;
                    this.createList();
                }
            }
        })

        var currentPage = ops.data.currentPage || 1;
        Object.defineProperty(this,'currentPage',{
            get: function () {
                return currentPage
            },
            set: function (val) {
                if(currentPage != val) {
                    currentPage = val;
                    if(!this.serverPaging){
                        this.createList();
                    }
                }
            }
        })

        if(this.serverPaging){
            this.pageClickCallback(this);
        }else {
            this.createList();
        }

    }

    gisList.prototype.updateListData = function (listData) {
        this.listData = listData;
        this.currentPage = 1;
    }

    gisList.prototype.getMatches = function () {

        var reg = /\{[^\{\}]*\}/g;
        var matches =  this.tpl.match(reg);
        var props = [], prop, i;

        for(i = 0; i<matches.length; i++){
            prop = matches[i].substring(1,(matches[i].length-1));
            props.push(prop);
        }

        this.props = props;
        return props;
    };

    gisList.prototype.createList = function (dataArr) {

        if(this.serverPaging) {

            // 后端分页
            // 抽取当前页数据
            this.currentData = dataArr;

        }else {
            //  前端分页 -data
            // 抽取当前页数据
            var startDataIndex = (this.currentPage - 1) * this.pageSize;
            var endDataIndex = Math.min(this.currentPage * this.pageSize , this.listData.length);
            var listDateIndex ;

            this.currentData = [];
            for( listDateIndex=startDataIndex; listDateIndex<endDataIndex; listDateIndex++) {
                this.currentData.push(this.listData[listDateIndex]);
            }
        }


        // 填充模板
        var currentDataIndex, props, propIndex, itemTpl, itemData;
        var listHTML = '<ul class="gis-list">';
        props = this.getMatches();

        for( currentDataIndex=0; currentDataIndex<this.currentData.length; currentDataIndex++) {
            itemTpl = this.tpl;
            itemData = this.currentData[currentDataIndex];
            for( propIndex=0; propIndex<props.length; propIndex++) {
                itemTpl = itemTpl.replace('{'+ props[propIndex] +'}', itemData[props[propIndex]]);
            }
            listHTML += itemTpl;
        }

        listHTML += '</ul>';
        this.$el.html(listHTML)

        // 生成分页
      var self = this;
        /* this.pagination = new gisPagination({
           el: this.el,
           data: {
               currentPage: this.currentPage,
               pageSize: this.pageSize,
               simple: this.simple,
               showTotal: this.showTotal,
               total: this.total,
               clickCallback: function (obj) {
                   self.currentPage = obj.currentPage;
                   if(self.pageClickCallback) {
                       self.pageClickCallback(self)
                   }
               }
           }
       })*/

        // 事件绑定
        this.$el.find('.gis-list__item > span').on('click',function () {
            $(this).addClass("curSpanSelect").siblings().removeClass("curSpanSelect");
            $(this).parent("li").siblings().children("span").removeClass("curSpanSelect");
            $(this).parent("li").addClass("curLiSelect").siblings().removeClass("curLiSelect");
            if(self.clickCallback) {
                var index = $(this).parent("li").index();
                var dataName = $(this).attr("data-attr");
                self.clickCallback(dataName,self.currentData[index]);
            }
        });


        
    }

    return gisList;
})