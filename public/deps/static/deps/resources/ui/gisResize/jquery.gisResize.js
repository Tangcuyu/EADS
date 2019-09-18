;(function (factory) {
    if (typeof define === "function" && define.amd) {
        define([ "jquery" ], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    // 调整大小元素类
    function ResizeElement(node,callback) {

        this.target = node;
        this.callback = callback;
        this.point = null;
        this.borderWidth = 5; /* 默认值5; borderWidth > .gis-resize__L's width */

        node.onselectstart = function () {
            //防止调整对象内的文字被选中
            return false;
        }
    }
    ResizeElement.prototype = {
        constructor: ResizeElement,
        setXY: function (x, y) {
            this.x = parseInt(x) || 0;
            this.y = parseInt(y) || 0;
            return this;
        },
        getWH: function () {
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            return this;
        },
        setPoint: function (X) {
            this.point = X;
        },
        setTargetCss: function (css) {
            $(this.target).css(css);
            return this;
        },
        getLimitXY: function () {

            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            this.limitX = windowWidth - this.borderWidth;
            this.limitY = windowHeight - this.borderWidth;

            return this;
        }
    }

    // 鼠标元素
    function Mouse() {
        this.x = 0;
        this.y = 0;
    }
    Mouse.prototype.setXY = function (x, y) {
        this.x = parseInt(x);
        this.y = parseInt(y);
    }

    // 调整配置
    var resizableConfig = {
        zIndex: 99,
        resizeElement: null,
        mouse: new Mouse()
    };

    var $document = $(document);

    function gisResize($ele,callback) {
        var $resizeNode = $ele.find(".gis-resize");
        $resizeNode = $resizeNode.length > 0 ? $resizeNode : $ele;

        var html = '<div class="gis-resize__L"></div>\
                    <div class="gis-resize__R"></div>\
                    <div class="gis-resize__T"></div>\
                    <div class="gis-resize__B"></div>\
                    <div class="gis-resize__LT"></div>\
                    <div class="gis-resize__LB"></div>\
                    <div class="gis-resize__RT"></div>\
                    <div class="gis-resize__RB"></div>';

        $resizeNode.append(html);

        $resizeNode.find('div[class^="gis-resize__"]').on({
            "mousedown": function (event) {
                var resizeElement = resizableConfig.resizeElement = new ResizeElement($ele.get(0),callback);

                resizableConfig.mouse.setXY(event.clientX, event.clientY);
                resizableConfig.resizeElement
                    .setTargetCss({
                        "zIndex": resizableConfig.zIndex++,
                        "position": "absolute"
                    })
                    .getLimitXY()
                    .setXY($(resizeElement.target).css('left'), $(resizeElement.target).css('top'))
                    .getWH()
                    .setPoint(event.target.className);

                return false
            }
        })
    }

    function move(event) {
        if (resizableConfig.resizeElement) {

            var mouse = resizableConfig.mouse,
                resizeElement = resizableConfig.resizeElement;


            var extendB = function () {
                var distenceY, height;
                event.clientY = Math.min(event.clientY, resizeElement.limitY);
                distenceY = event.clientY - mouse.y;
                height = resizeElement.height + distenceY;
                resizeElement.setTargetCss({
                    "height": height + "px"
                })
            }

            var extendT = function () {
                var distenceY, height, top;
                event.clientY = Math.max(event.clientY, resizeElement.borderWidth);
                distenceY = mouse.y - event.clientY;
                height = resizeElement.height + distenceY;
                top = resizeElement.y - distenceY;
                resizeElement.setTargetCss({
                    "height": height + "px",
                    "top": top +"px"
                })
            }

            var extendR = function () {
                var distenceX, width;
                event.clientX = Math.min(event.clientX, resizeElement.limitX);
                distenceX = event.clientX - mouse.x;
                width = resizeElement.width + distenceX;
                resizeElement.setTargetCss({
                    "width": width + "px"
                })
            }

            var extendL = function () {
                var distenceX, width, left;
                event.clientX = Math.max(event.clientX, resizeElement.borderWidth);
                distenceX = mouse.x - event.clientX;
                width = resizeElement.width + distenceX;
                left = resizeElement.x - distenceX;
                resizeElement.setTargetCss({
                    "width": width + "px",
                    "left": left +"px"
                })
            }

            switch (resizeElement.point){
                case 'gis-resize__B':
                    extendB();
                    break;
                case 'gis-resize__T':
                    extendT();
                    break;
                case 'gis-resize__R':
                    extendR();
                    break;
                case 'gis-resize__L':
                    extendL();
                    break;
                case 'gis-resize__RB':
                    extendR()
                    extendB()
                    break;
                case 'gis-resize__RT':
                    extendR()
                    extendT()
                    break;
                case 'gis-resize__LT':
                    extendL()
                    extendT()
                    break;
                case 'gis-resize__LB':
                    extendL()
                    extendB()
                    break;
            }

            $document.off("mousemove", move);
            setTimeout(function () {
                $document.on("mousemove", move);
            }, 25);
        }
    }

    $document.on({
        "mousemove": move,
        "mouseup": function () {
            resizableConfig.resizeElement &&
            resizableConfig.resizeElement.callback &&
            resizableConfig.resizeElement.callback(
                resizableConfig.resizeElement.target.offsetWidth,
                resizableConfig.resizeElement.target.offsetHeight
            );

            resizableConfig.resizeElement = null;
        }
    });

    $.fn.gisResize = function (callback) {
        gisResize(this,callback);
    }

}));