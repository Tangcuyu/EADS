/**
 * Created by melon on 2018/7/12.
 */
/**
 * 灾情研判--行政区划弹窗样式
 */
define([], function () {
    var detail = {};

    detail.addTooltip = function(detailObj){
        this._extentChangeForDrawTriangle();
        this.point = detailObj.point;
        var content = detailObj.htmlSelf;
        var offset = detailObj.offset || [-230, -35];
        var layerid = detailObj.layerid;
        this.detailObj = detailObj
        var tooltip = new g2.ext.Tooltip({
            anchor: this.point,  //提示在地图上停靠位置
            content: content,  //提示内容
            autoPan: true,
            autoPanMargin: 200,
            layerId: layerid, //提示所在图层ID
            offset: [offset[0], offset[1]], //位置偏移量
            className: 'g2-tooltip'  //tooltip样式
        });
        // if (!G.options.toolTipWare) {
        //     G.options.toolTipWare = new g2.ext.toolTipWare
        // }
        G.options.toolTipWare.clear();
        G.options.toolTipWare.add(tooltip)
        this.getTriangleCooridinate(this.detailObj)
    };

    detail._extentChangeForDrawTriangle = function(){
        var self = this;
        var extentChangeListen = function (e) {
            G.zoomLevel = G.options.map.getZoomLevel();
            console.log(G.zoomLevel);
            self.getTriangleCooridinate(self.detailObj)
            // self.bigIconLayer.clear();//清除大图标
            // self.clearPop();
            // self.map.getLayerById("pointSplashesLayer").clear();/清除大图标图层
        };
        G.options.map.off('extentchanged',extentChangeListen);
        G.options.map.on('extentchanged', extentChangeListen);
    };

    detail.getTriangleCooridinate = function(detailObj){
        var containerStr = '#' + detailObj.tag.containerId
        var top = $(containerStr).offset().top;
        var left = $(containerStr).offset().left;
        var height = $(containerStr).height();
        var width = $(containerStr).width();
        var mapLeft = $('#map').offset().left;
        var mapTop = $('#map').offset().top;
        var topAX = left + width - mapLeft + 15;
        var topAY = top + height/3 * 1 - mapTop;
        var topBY = top + height/3 * 2 - mapTop;
        this.pointAArr = G.options.map.getCoordinateFromPixel([topAX,topAY]);
        this.pointBArr = G.options.map.getCoordinateFromPixel([topAX,topBY]);
        this.drawTriangle(this.pointAArr,this.pointBArr)
    };

    detail.drawTriangle = function(pointAArr,pointBArr){
        var self = this;
        if (G.options.map.getLayerById("mapToolTipTriangleLayer")){
            G.options.map.getLayerById("mapToolTipTriangleLayer").clear()
            self.mapToolTipTriangleLayer = G.options.map.getLayerById("mapToolTipTriangleLayer")
        } else {
            //缓冲查询的图层
            self.mapToolTipTriangleLayer = new g2.lys.ElementLayer({
                map: G.options.map,
                id: "mapToolTipTriangleLayer"
            });
            G.options.map.addLayer(self.mapToolTipTriangleLayer);
            self.mapToolTipTriangleLayer.setZIndex(30)
            // G.options.markerLayers.push('circleBufferLayer');
        }
        var fillSymbol = new g2.syms.SimpleFillsymbol({
            borderThickness: 2, //边框宽度
            fillColor: new g2.syms.Color({alpha: 50, r: 30, g: 30, b: 51}),
            borderColor: new g2.syms.Color({alpha: 1, r: 30, g: 30, b: 51}),
            style: 5
        });
        var wkt = "polygon((" + pointAArr[0] + " " + pointAArr[1] + "," + pointBArr[0] + " " + pointBArr[1] +","+
            this.point.x + " " + this.point.y + "))";
        var polygon=g2.geom.GeometryFactory.createGeometryFromWkt(wkt,g2.geom.SpatialReference.EPSG4326)
        var ele = new g2.ele.Element({
            id: 'mapToolTipTriangle',
            geometry: polygon,
            symbol: fillSymbol
        });
        self.mapToolTipTriangleLayer.add(ele);

        // var pointA = new g2.geom.Point({x:pointAArr[0],y:pointAArr[1],spatialReference:this.map.spatialReference});
        // var pointB = new g2.geom.Point({x:pointBArr[0],y:pointBArr[1],spatialReference:this.map.spatialReference});

    };


    /**
     * 清除框
     */
    detail.clear = function () {
        G.options.toolTipWare.clear();
    };
    return detail;
});