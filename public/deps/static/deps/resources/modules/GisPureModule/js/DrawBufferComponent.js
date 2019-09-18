/**
 * Created by my on 2018/5/3.
 * 地图事件操作
 */
define([ 'ol'], function (ol) {
    var PureComponent = G.base.PureComponent;

    //拖动圆的tool，控制圆大小，完成拖动后查询
    var circleEditTool = g2.cmds.Tool.extend({
        initialize: function (opt) {
            var opts = opt || {};
            g2.cmds.Tool.call(this, opts);
            this.parent = opts.parent;
            this.onMove = -1;
            this.currentElement = null;
            this.center = opts.center;
            this.map = opts.map;
            this.drawLayer = opts.drawLayer;
            this.circleEle = opts.circleEle;
            this.lineEle = opts.lineEle;
            this.picEle = opts.picEle;
            this.textEle = opts.textEle;
            this.geoSearch = opts.geoSearch;
            this.callback = opts.callBack;
            this.query = opts.query;
            this.context = opts.context;
            this.markerSymbol = opts.markerSymbol;
            this.fillSymbol = opts.fillSymbol;
        },
        onMouseUp: function (button, shift, screenx, screeny, mapx, mapy, handled) {
            this.map.resumeDragPan();
            if (this.onMove == 0) {
                this.onMove = -1;
            } else if (this.onMove > 0) {
                var self = this;
                var cjson = {
                    x: this.center.x,
                    y: this.center.y,
                    radius: this.radius,
                    count: 128,
                    srs: "2436"
                };
                //var geoJson = this.parent._getCircleGeoJson(cjson);
                var centerGeom = new g2.geom.Point({
                    x: this.center.x,
                    y: this.center.y,
                    spatialReference: this.map.spatialReference
                });
                var geoJson = this.parent._getBufferGeoJson(centerGeom, this.textlength);
                self.callback.call(self.context, geoJson, this.textlength);
                this.onMove = -1;
                this.currentElement = null;
                this.drawLayer.update(this.picEle, true);
            }
        },
        onMouseDown: function (button, shift, screenx, screeny, mapx, mapy, handled) {
            if (this.onMove < 0) {
                var graphic = this.drawLayer.hitTest(screenx, screeny);
                if (graphic) {
                    if (!!graphic && this.picEle.id == graphic.element.id) {
                        this.map.stopDragPan();
                        this.currentElement = graphic.element;
                        this.onMove++;
                        this.drawLayer.update(this.picEle, true);
                    }
                }
            }
        },
        onMouseMove: function (button, shift, screenx, screeny, mapx, mapy, handled) {
            if (this.onMove >= 0) {
                if (!!this.currentElement) {
                    this.currentElement.geometry.x = mapx;
                    this.currentElement.geometry.y = this.center.y;
                    this.drawLayer.update(this.currentElement);

                    //画线处理
                    var polyline = new g2.geom.Polyline({
                        spatialReference: this.map.spatialReference
                    });
                    var path = new g2.geom.Path({
                        spatialReference: this.map.spatialReference
                    });
                    var point1 = this.center;
                    var point2 = new g2.geom.Point({
                        x: mapx,
                        y: this.center.y,
                        spatialReference: this.map.spatialReference
                    })
                    //半径数字坐标点
                    var pointX = new g2.geom.Point({
                        x: (Number(point1.x) + Number(point2.x)) / 2,
                        y: Number(point1.y),
                        spatialReference: this.map.spatialReference
                    })
                    path.addPoint(point1);
                    path.addPoint(point2);
                    polyline.addGeometry(path);
                    this.lineEle.geometry = polyline;
                    this.drawLayer.update(this.lineEle);
                    //圆
                    this.radius = Math.abs(point1.x - point2.x);
                    //this.circleEle.geometry.radius = this.radius;

                    var projectService = new g2.ext.ProjectService();
                    var measureService = new g2.ext.MeasureService({
                        projectService: projectService
                    });
                    this.textlength = measureService.length(this.lineEle.geometry);
                    this.textEle.geometry = pointX;
                    this.textEle.symbol.text = Math.round(this.textlength) / 1000 + "km";
                    this.drawLayer.update(this.textEle, true);
                    this.drawLayer.remove(this.circleEle);
                    var cjson = {
                        x: this.center.x,
                        y: this.center.y,
                        radius: this.textlength,
                        count: 128
                    };
                    var centerGeom = new g2.geom.Point({
                        x: this.center.x,
                        y: this.center.y,
                        spatialReference: this.map.spatialReference
                    });
                    var geoJson = this.parent._getBufferGeoJson(centerGeom, this.textlength);
                    //var geoJson = this.parent.getCircleGeoJson(cjson);
                    var polygonGeometry = g2.geom.GeometryFactory.createGeometryFromGeoJson(geoJson, this.map.spatialReference);
                    var ring = new g2.geom.Ring({
                        spatialReference: this.map.spatialReference
                    });
                    polygonGeometry.addGeometry(ring);
                    var fillSymbol = this.fillSymbol;
                    var circleEle = new g2.ele.Element({
                        geometry: polygonGeometry,
                        symbol: fillSymbol
                    });
                    this.circleEle = circleEle;
                    this.drawLayer.add(this.circleEle);
                    //文字
                    this.onMove++;
                }
            }
        },
    })

    var component = PureComponent.extend({
        options: {
            'iconImg':'iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAYAAADskT9PAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzdCRTQ5OTYzRkFFMTFFNDk1NTE5ODREMUQwMDhDMzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzdCRTQ5OTczRkFFMTFFNDk1NTE5ODREMUQwMDhDMzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDN0JFNDk5NDNGQUUxMUU0OTU1MTk4NEQxRDAwOEMzMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDN0JFNDk5NTNGQUUxMUU0OTU1MTk4NEQxRDAwOEMzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpA7b9wAAAPDSURBVHjarFZbTxNREJ7d7ba7lbaAgqBUMETEW9OggCYiYIyKJhp+gA/6B4wPhGhMjET9CaivXggxXogkaqLxQXxofCCKFRSjQohRgZa2WLbXXWfWs02tB2ONk3xJe2Z25pvvzDm7Ql9fH3BMQEigaeWQTu8Cw9iB/0sQ1fA3ZhgGCMIs/gojXiGeg8czzwu1cQrbIJWqhETiOOj6YX9LS+X6hga3Q1Gk0rIyB/ylLcZiqaV4PPN5evr7i5GROYhEhpDUFSQS/qVgngJUXIFkcgsWP9dx4IC/pa2t2m63S8bPrqBoEwQzKT5pvHj27Mvj4eGXuHYKSUwWKkBxKmQyjVj8Uld397amnTurdF2HbDYL/8GE5ra2NStcLnloYKAfotFjSOJLPgHZ3F9NO7m3q2uzv7W1KpPJwH81bGaTz1eRTCS2PLx79yKunKBlkaEU9313jdfb3NrevjaLxal7Hvb1BE0U6yNkUE2cqaqtTU17UIUOi4AdUYkE9qCznDon2XkJ9veO5zX0u98yiuOSwLyU37d9+0qcqSMWAdUkoOt1NXV1nmw6bQYW4uDpt7kCDy5s4MbQumUUz4shdau9XjeGNFsEFEQZMnKqTqecpcErwKGz73OJh/vqgRdjgfyW0XOFftoGUZJErFWC2+CysQFUkIAoCoJAAcYfjpxe5KngxRtIRLbbRS2RUMTcMRTFBF4caYPtVT7unfXmHj56foorrQXyW0bPFfpZfiMWiWjgdoeIAFFMIoHw/Oxs3MDLgyft7TNrc4m7L8xwY2jdMornxZC2USouCNMkhmgWx5sTZHn6XTC4INtswFOBcKu36hdpC2EZxfH8lNeG+SffvAkhgadEgGZgCTEHDsfE2Oior76hwbOmtnYVXhjcWRjsqcwdw2J8OF5gk2UIzc1FR548mQRFGbJOASnwDfEVVDVwb2DgYyQcjuKQmHItd6kUA2qEiqeSyaWbV6++B0m6jA2HiIDU2dlJdTLmIEqSDanqrwMBtaa21rGyosJpsARFg3UtoeSKqkIkFIpc6+9/h1t9HUpK7rDGc++CBGLGvBUd+MYVxfjQ4GB8q9+/rtHnK3N7PKq7tFQ1ONIu+/YRRdDi8eRiNKqNjo8vjAYCnzD3DVT5Ptt2I5+Abg4iwAdEClnGaCiDExMbg2Nj61FHD8L9D6/jRWwmhJM3Bi7XI/xN+SPs5P32QUKLMUZiAbEaGU8h3Oy2lIq5f5iq1FTInK+fX0dLzLfsF5HOgpLsASfCweKEIghYc5VCaAzcK/SHAAMA4XIlf6DGCVoAAAAASUVORK5CYII=',
        },
        initialize: function (options) {
            PureComponent.prototype.initialize.call(this, options);
        },
        destroy: function () {
            this._removeListeners();
            //
            PureComponent.prototype.destroy.call(this);
        }
    });
    /**
     * 对外接口
     */
    component.include({});
    /**
     * 内部调用
     */
    component.include({
        /**
         * 创建缓冲区图层
         * @private
         */
        _createLayer: function () {
            this._layer= G.utils.LayerUtil.getLayerById(G.options.map,"earDisLayer");
            if(! this._layer){
                this._layer = new g2.lys.ElementLayer({
                    id: "earDisLayer",
                    name: "earDisLayer"
                });
                this.map.addLayer(this._layer);
                this._layer.setZIndex(15);
            }
        },

        /**
         * 创建圆形缓冲区
         * @param options
         */
        circleBuffer: function (options,people,unite,id) {
            // this.clearBufferLayer();
            this._createLayer();
            var mapX = options.mapX;
            var mapY = options.mapY;
            var radius = options.radius;
            var context = options.context;
            var callback = options.callback;
            var drawLayer = this._layer;
            //var iconImg=options.iconImg;
            var iconImg=this.options.iconImg;
            var showDrag, showLine;
            // if (options.showDrag == false) {
            //     showDrag = options.showDrag;
            // } else {
            //     showDrag = true;
            // }
            if (options.showLine == false) {
                showLine = options.showLine;
            } else {
                showLine = true;
            }
            var map = this.map;
            var fillSymbol = new g2.syms.SimpleFillsymbol({
                borderThickness: 2, //边框宽度
                fillColor: new g2.syms.Color({a: 1, r: 255, g: 0, b: 0}),
                borderColor: new g2.syms.Color({alpha: 1, r: 255, g: 0, b: 0}),
                style: 5
            });
            // var fillSymbol = options.symbol || new g2.syms.SimpleFillsymbol();
            var point = new g2.geom.Point({
                x: mapX,
                y: mapY,
                spatialReference: map.spatialReference
            })
            var paramobj = {
                x: mapX,
                y: mapY,
                radius: radius,
                angle: 90,
                srs: map.spatialReference
            }
            var circleInPoint = this._getCirclePointByAngle(paramobj);
            if (showDrag) {
                // var img = this.options.buffer_img;
                var markerSymbol = new g2.syms.Picturemarkersymbol({
                    source: iconImg,
                    width: 32,
                    height: 20,
                    rotation: "0",
                    opacity: "1",
                    offsetX: "10",
                    offsetY: "8"
                });
                this.picEle = new g2.ele.Element({
                    id: "moveMarker",
                    geometry: circleInPoint,
                    symbol: markerSymbol
                });
                drawLayer.add(this.picEle);
            }
            //画直线
            var ploylineSymbol = new g2.syms.SimpleLinesymbol({
                style:3,
                width:0,
                color: new g2.syms.Color({
                    a: 1,
                    r: 255,
                    g: 255,
                    b: 255
                })
            });
            var polyline = new g2.geom.Polyline({
                spatialReference: map.spatialReference
            });
            var path = new g2.geom.Path({
                spatialReference: map.spatialReference
            });
            var point1 = point;
            var point2 = circleInPoint;
            //半径数字坐标点
            var pointX = new g2.geom.Point({
                x:  Number(point2.x),
                y: (Number(point1.y)+Number(point2.y))/2,
                spatialReference: map.spatialReference
            })
            path.addPoint(point1);
            path.addPoint(point2);
            polyline.addGeometry(path);
            this.polylineElement = new g2.ele.Element({
                geometry: polyline,
                symbol: ploylineSymbol
            });

            //标文字
            var projectService = new g2.ext.ProjectService();
            var measureService = new g2.ext.MeasureService({
                projectService: projectService
            });
            var textlength = measureService.length(polyline);
            //构造文本符号
            var text = Math.round(textlength) / 1000 + "公里"
                var peoplenumber=people+unite;
            // var textSymbol = new g2.syms.TextSymbol({
            //     fontSize: '32',
            //     text: text,
            //     foreground: new g2.syms.Color({
            //         r: 255,
            //         g: 255,
            //         b: 255,
            //         a: 255
            //     }),
            //     borderColor:new g2.syms.Color({
            //         r: 0,
            //         g: 0,
            //         b: 0,
            //         a: 255
            //     }),
            //     // offsetX: 50,
            //     offsetX: 0,
            //     offsetY: 0,
            //     rotation: 0
            // });
            // this.textEle = new g2.ele.Element({
            //     geometry: pointX,
            //     symbol: textSymbol
            // });
            var buffertext="buffertext"+id;//加文字提示
            $("#buffertext"+id).remove();
            $('.gse').append('<div  id="'+buffertext+'" class="buffertext earDisLayeroverlay-buffertext"><div>'+text+'</div><div>'+peoplenumber+'</div></div>');
            var contentTemplate11 = window.document.getElementById('buffertext'+id);
            var point_overlay = new ol.Overlay({
                id: 'earDisLayeroverlay',
                offset: [0, 0],
                element: contentTemplate11,
                stopEvent: false,
                positioning: 'center-center'
            });
            map.map.addOverlay(point_overlay);
            point_overlay.setPosition([pointX.x * 1, pointX.y * 1]);
            if (showLine) {
                drawLayer.add(this.polylineElement);
                drawLayer.add(this.textEle);
            }
            //激活tool
            var cjson = {
                x: mapX,
                y: mapY,
                center: [mapX, mapY],
                radius: radius,
                count: 128,
                srs: map.spatialReference
            };
            /***
             * 根据中心点半径获取缓冲区geojson
             * @type {Array}
             */
            var centerGeom = new g2.geom.Point({
                x: mapX,
                y: mapY,
                spatialReference: map.spatialReference
            });
            var geoJson = this._getBufferGeoJson(centerGeom, radius);
            var polygonGeometry = g2.geom.GeometryFactory.createGeometryFromGeoJson(geoJson, map.spatialReference);
            var ring = new g2.geom.Polygon({
                spatialReference: map.spatialReference
            });
            polygonGeometry.addGeometry(ring);
            // fillSymbol.fillColor.a=1;//圈内部颜色透明度
            // // fillSymbol.borderColor.a=150;
            this.circleEle = new g2.ele.Element({
                geometry: polygonGeometry,
                symbol: fillSymbol
            });
            drawLayer.add(this.circleEle);
            if (showDrag) {
                var tool = new circleEditTool({
                    center: point,
                    parent: this,
                    callBack: callback,
                    map: map,
                    drawLayer: drawLayer,
                    circleEle: this.circleEle,
                    lineEle: this.polylineElement,
                    picEle: this.picEle,
                    textEle: this.textEle,
                    markerSymbol: markerSymbol,
                    context: context,
                    fillSymbol: fillSymbol
                });
                tool.onCreate({
                    map: map
                });
                tool.onClick(function (data) {
                });
            }
            callback.call(context, geoJson, radius);
        },

        /**
         * 获取缓冲区的标注点
         * @param param
         * @returns {*}
         * @private
         */
        _getCirclePointByAngle: function (param) {
            var x = param.x;
            var y = param.y;
            var radius = param.radius;
            var angle = param.angle;
            var srs = param.srs;
            if (srs == "4326") {
                var projService = new g2.ext.ProjectService();
                var ptGeom = new g2.geom.Point({
                    x: param.x,
                    y: param.y,
                    spatialReference: srs
                });
                var geom4326 = projService.transform(ptGeom, 4326);
                //激活tool
                var opts = {
                    center: [geom4326.x, geom4326.y],
                    radius: radius,
                    count: 360,
                    spatialReference: 4326
                };
                var circlePoints = G.utils.GeometryUtil.getCirclePonits(opts);
                var point = {
                    type: 'Point',
                    coordinates: [circlePoints[angle][0], circlePoints[angle][1]]
                }
                var geom4326pts = g2.geom.GeometryFactory.createGeometryFromGeoJson(point);
                geom4326pts.spatialReference = 4326;
                var newpoint = projService.transform(geom4326pts, srs).asGeoJson();
                point = new g2.geom.Point({
                    x: newpoint.coordinates[0],
                    y: newpoint.coordinates[1],
                    spatialReference: srs
                })
                return point;
            }
        },

        /**
         * 获取圆的geojson
         * @param x
         * @param y
         * @param radius
         * @param count
         * @returns {{}}
         * @private
         */
        _getCircleGeoJson: function (param) {
            var x = param.x;
            var y = param.y;
            var dist = param.radius;
            var count = param.count;
            var brngs = [];
            var srs = param.srs;
            var geoJson = {};
            if (srs == "4326") {
                var pointjson = {};
                pointjson.type = "Point";
                pointjson.coordinates = [x, y];
                geoJson = this._getGeoBuffer(pointjson, dist);
            }
            return geoJson;
        },

        /**
         * 根据中心点半径获取缓冲区
         * @param centerGeom {g2.geom.Point}
         * @param radius {Number} 半径 /m
         * @private
         */
        _getBufferGeoJson: function (centerGeom, radius) {
            if (!(centerGeom && !isNaN(radius))) {
                return null;
            }
            var geoJson = null;
            var spatialRef = centerGeom.spatialReference;
            if (spatialRef == 4326) {
                var projService = new g2.ext.ProjectService();
                var ptGeom = new g2.geom.Point({
                    x: centerGeom.x,
                    y: centerGeom.y,
                    spatialReference: spatialRef
                });
                var geom4326 = projService.transform(ptGeom, 4326);
                //激活tool
                var opts = {
                    center: [geom4326.x, geom4326.y],
                    radius: radius,
                    count: 128,
                    spatialReference: 4326
                };
                var circlePoints = G.utils.GeometryUtil.getCirclePonits(opts);
                var geomJson = {
                    type: 'Polygon',
                    coordinates: [circlePoints]
                }
                var geom4326pts = g2.geom.GeometryFactory.createGeometryFromGeoJson(geomJson);
                geom4326pts.spatialReference = 4326;
                geoJson = projService.transform(geom4326pts, spatialRef).asGeoJson();
            }
            return geoJson;
        },

        /**
         * 清除缓冲区图层
         * @method
         * @memberOf G.components.BufferDrawComponent.prototype
         * */
        clearBufferLayer: function () {
            if (this._layer) {
                this._layer.clear();
            }
            if(G.geoJsonObj){
                G.geoJsonObj=null;
                delete G.geoJsonObj;
            }
        },

        /**
         * 根据半径和geojson获取缓冲图形json
         * @param geo
         * @param buffer
         * @returns {Object}
         * @private
         */
        _getGeoBuffer: function (geo, buffer) {
            var reader = new jsts.io.GeoJSONReader();
            var input = reader.read(geo);
            input.isValid();
            input = input.buffer(buffer * (360 / (2 * Math.PI * 6378137)));//缓冲buffer米

            var bufferGeoJSON = new jsts.io.GeoJSONWriter().write(input);
            return bufferGeoJSON;
        },
    });

    return component;
});