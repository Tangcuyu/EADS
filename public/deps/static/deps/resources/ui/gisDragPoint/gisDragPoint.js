define(['jquery'], function ($) {
    var DragPoint = {};
    DragPoint.gisDragPoint = function (elementLayer,mouseMoveCallBack) {
        var selectElemet = null;
        var mousedownFlag = false;
        var g2map = G.options.map;
        //添加监听地图mousedown事件
        /***
         * 鼠标按下事件
         * @param Number button 按下的鼠标按键
         * @param Number shift 是否同时按下的键盘上的shift键
         * @param Number screenX 事件发生时鼠标在屏幕上的X坐标
         * @param Number screenY 事件发生时鼠标在屏幕上的Y坐标
         * @param Number mapX 鼠标在地图上的X坐标
         * @param Number mapY 鼠标在地图上的Y坐标
         * @param Boolean handle 该事件是否已经不需要再处理
         */
        g2map.on("mousedown", function (button, shift, screenX, screenY, mapX, mapY, handle) {
            //console.log("监听鼠标按下事件:map.on('mousedown',callback);");
            mousedownFlag = true;
            var graphic = elementLayer.hitTest(button.screenX, button.screenY);
            if (!!graphic) {
                g2map.stopDragPan();
                var element;
                if(graphic.feature){
                    element=graphic.feature
                }else{
                    element=graphic.element
                }
                selectElemet =element;
            }
            else {
                selectElemet = null;
            }
        })

        //添加监听地图mousemove事件
        /***
         * 鼠标移动事件
         * @param Number button 按下的鼠标按键
         * @param Number shift 是否同时按下的键盘上的shift键
         * @param Number screenX 事件发生时鼠标在屏幕上的X坐标
         * @param Number screenY 事件发生时鼠标在屏幕上的Y坐标
         * @param Number mapX 鼠标在地图上的X坐标
         * @param Number mapY 鼠标在地图上的Y坐标
         * @param Boolean handle 该事件是否已经不需要再处理
         */
        g2map.on("mousemove", function (button, shift, screenX, screenY, mapX, mapY, handle) {

            //console.log("监听鼠标移动事件:map.on('mousemove',callback);");
            if (!!selectElemet && !!mousedownFlag) {
                selectElemet.geometry.x = button.mapX;
                selectElemet.geometry.y = button.mapY;
                elementLayer.update(selectElemet, false);
                mouseMoveCallBack(selectElemet);
            }
        })


        //添加监听地图mouseup事件
        /***
         * 鼠标按下后抬起事件
         * @param Number button 按下的鼠标按键
         * @param Number shift 是否同时按下的键盘上的shift键
         * @param Number screenX 事件发生时鼠标在屏幕上的X坐标
         * @param Number screenY 事件发生时鼠标在屏幕上的Y坐标
         * @param Number mapX 鼠标在地图上的X坐标
         * @param Number mapY 鼠标在地图上的Y坐标
         * @param Boolean handle 该事件是否已经不需要再处理
         */
        g2map.on("mouseup", function (button, shift, screenX, screenY, mapX, mapY, handle) {
            mousedownFlag = false;
            selectElemet = null;
            g2map.resumeDragPan();

           // console.log("监听鼠标按下后抬起事件:map.on('mouseup',callback);");
        })
    }
    return DragPoint;
})