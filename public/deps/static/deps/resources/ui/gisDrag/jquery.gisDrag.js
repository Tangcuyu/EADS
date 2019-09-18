;(function (factory) {
    if (typeof define === "function" && define.amd) {
        define([ "jquery" ], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    // 拖拽元素类
    function DragElement(node) {

        this.target = node;

        node.onselectstart = function () {
            //防止拖拽对象内的文字被选中
            return false;
        }
    }
    DragElement.prototype = {
        constructor: DragElement,
        setXY: function (x, y) {
            this.x = parseInt(x) || 0;
            this.y = parseInt(y) || 0;
            return this;
        },
        setTargetCss: function (css) {
            $(this.target).css(css);
            return this;
        },
        getTargetSize: function () {

            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            this.limitLeft = windowWidth - this.width;
            this.limitTop = windowHeight - this.height;

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

    //拖拽配置
    var draggableConfig = {
        zIndex: 99,
        dragElement: null,
        mouse: new Mouse()
    };

    var draggableStyle = {
        dragging: {
            cursor: "move"
        },
        defaults: {
            cursor: "default"
        }
    }

    var $document = $(document);

    function gisDrag($ele) {
        var $dragNode = $ele.find(".gis-draggable");
        $dragNode = $dragNode.length > 0 ? $dragNode : $ele;


        $dragNode.on({
            "mousedown": function (event) {
                var dragElement = draggableConfig.dragElement = new DragElement($ele.get(0));

                draggableConfig.mouse.setXY(event.clientX, event.clientY);
                draggableConfig.dragElement
                    .setTargetCss({
                        "zIndex": draggableConfig.zIndex++,
                        "position": "absolute"
                    })
                    .getTargetSize()
                    .setXY($(dragElement.target).offset().left, $(dragElement.target).offset().top);
                return false
            },
            "mouseover": function () {
                $(this).css(draggableStyle.dragging);
            },
            "mouseout": function () {
                $(this).css(draggableStyle.defaults);
            }
        })
    }

    function move(event) {
        if (draggableConfig.dragElement) {
            var mouse = draggableConfig.mouse,
                dragElement = draggableConfig.dragElement;

            var left, top;
            left = Math.min(parseInt(event.clientX - mouse.x + dragElement.x), dragElement.limitLeft)
            top = Math.min(parseInt(event.clientY - mouse.y + dragElement.y), dragElement.limitTop)
            left = Math.max(left,0);
            top = Math.max(top,0);
            dragElement.setTargetCss({
                "left": left + "px",
                "top": top + "px"
            });

            $document.off("mousemove", move);
            setTimeout(function () {
                $document.on("mousemove", move);
            }, 25);
        }
    }

    $document.on({
        "mousemove": move,
        "mouseup": function () {
            draggableConfig.dragElement = null;
        }
    });

    $.fn.gisDrag = function () {
        gisDrag(this);
    }

}));