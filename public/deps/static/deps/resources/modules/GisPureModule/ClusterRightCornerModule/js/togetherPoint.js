/**
* @title:图层聚合右上角显示数字
* @time:2019/5/22
*/
define(["jquery"],function($){
    var util = {};
    /**
     * 数据拼接
     * @param data:每一类站点对应的数据
     * @param code：站点类型（如：“1”）
     * @param map
     */
    util.jointData=function(data,code,map){
        var self=this;
        self.map=map;
        self.bzDis=40;//聚合效果的像素坐标标准，即多大距离时可聚合
        self.resultArr=[];
        self.originalArr=data;
        if(code=="hazardous"){
            self.togetherIcon(self.noJhData(data),code);
        }else{
            self.pointData(data,code);
        }
        // //聚合效果的控制
        // // if(code=="4"||code=="3"){
        // self.togetherIcon(self.noJhData(data),code);
        // // }else{
        // //     self.pointData(data,code);
        // // }
    }
    /**
     * 不需要聚合处理的类型
     */
    util.noJhData=function(data){
        var resultArr=[];
        for(var i=0;i<data.length;i++){
            var ele=[];
            ele.push(data[i]);
            resultArr.push(ele);
        }
        return resultArr;
    }
    /**
     * 单例循环删除数据
     * @param data
     */
    util.pointData=function(data,code){
        var self=this;
        var arr=self.pointDataDeal(data);
        self.resultArr.push(arr);
        // var idname="_id";
        var lastArr=self.pointDataDelete(data,arr);//剩余的点
        if(lastArr.length>0){
            self.pointData(lastArr,code);
        }else{
            //判断应该采用聚和策略还是分支展示
            if(1!=self.map.getZoomLevel()){
                // window.originalMapInf.zoom="";
                self.togetherIcon(self.resultArr,code);
            }else{
                // window.originalMapInf.zoom="";
                self.methodForFz(window.gisDataYc[code].data,code);
            }
        }

    }
    /**
     * 处理数组的距离相近的数据
     * @param data
     * @returns {Array}
     */
    util.pointDataDeal = function(data) {
        var self=this;
        var arr=[];
        if(data.length>0){
            var i=0;
            var latLng1=[data[i].geom.coordinates[0],data[i].geom.coordinates[1]];
            arr.push(data[i]);
            for(var j=i+1;j<data.length;j++){
                var latLng2=[data[j].geom.coordinates[0],data[j].geom.coordinates[1]]
                var deis=self.getDistance(latLng1,latLng2);
                if(deis<self.bzDis){
                    arr.push(data[j]);
                }
            }
        }
        return arr;
    }
    /**
     * 两数组相减
     * @param arr1：数组1
     * @param arr2：数组2
     * @param code：判断相同的字段
     */
    util.pointDataDelete = function(arr1,arr2,code) {
        var arrRes=[];
        for(var i=0;i<arr1.length;i++){
            var isOneCode=1;
            for(var j=0;j<arr2.length;j++){
                if(arr1[i]==arr2[j]){
                    isOneCode=0;
                }
            }
            if(isOneCode==1){
                arrRes.push(arr1[i]);
            }
        }
        return arrRes;
    }
    /**
     * 计算两经纬度的距离
     * @param latLng1
     * @param latLng2
     * @returns {number}:返回距离，单位千米
     */
    util.getDistance=function(latLng1,latLng2){
        //计算像素距离
        var mapPoint1 = this.map.getPixelFromCoordinate(latLng1);
        var mapPoint2 = this.map.getPixelFromCoordinate(latLng2);
        var x=mapPoint1[0]-mapPoint2[0];
        var y=mapPoint1[1]-mapPoint2[1];
        var s=Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        //计算距离
        // var radLat1=latLng1[1]*Math.PI/180.0;
        // var radLat2=latLng2[1]*Math.PI/180.0;
        // var a=radLat1-radLat2;
        // var b=latLng1[0]*Math.PI/180.0-latLng1[0]*Math.PI/180.0;
        // var s=2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2)
        // +Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        // s=s*6378.137;
        // s=Math.round(s*10000)/10000;
        return s;
    }
    /**
     * 聚合图片和单个图片的添加
     * @param data：数据
     * @param type：类型
     */
    util.togetherIcon=function(data,type){
        var self=this;
        var stationlayer=null;

        if(self.map.getLayerById(type+"Layer")==null){
            //todo 所有的图层可以在项目初始化的时候进行加载。
            stationlayer = new g2.lys.ElementLayer({
                map: self.map,
                id: type+"Layer",
                name: type+"Layer"
            });
            stationlayer.setZIndex(20);//将点标在上层
            self.map.addLayer(stationlayer);
            G.options.markerLayers.push(type+"Layer");
        }else{
            stationlayer= self.map.getLayerById(type+"Layer");
            stationlayer.clear();
        }

        for(var i=0;i<data.length;i++){
            if(data[i].length>1){//需要聚合展示的
                // var pngName = "jh";
                var icon=EMAP_CONFIGICON.modules.MenuModule[ type + "_img"];//聚合的地图图标
                var lngLat=self.centralPoint(data[i]);
                var dataInf={
                    name:data[i].length,
                    dataEle:data[i],
                    isMore:true
                };
                var x=lngLat[0]*1;
                var y=lngLat[1]*1;
                self.makePoint(x,y,icon,stationlayer,dataInf,type,"",true);
            }else{//单个图标展示
                // var pngName = "normal";
                // if (data[i][0].status != 0) {
                //     pngName = "unNormal"
                // }
                var icon=data[i][0].icon||EMAP_CONFIGICON.modules.MenuModule[type + "_img"];
                self.makePoint(data[i][0].geom.coordinates[0],data[i][0].geom.coordinates[1],icon,stationlayer,data[i][0],type);
            }
        }
    }
    /**
     * 中心点坐标计算
     * @param arr=经纬度的数组
     */
    util.centralPoint=function(arr){
        var longitudeAll=0;
        var latitudeAll=0;
        for(var i=0;i<arr.length;i++){
            var longitude=arr[i].geom.coordinates[0];
            var latitude=arr[i].geom.coordinates[1];
            longitudeAll+=longitude;
            latitudeAll+=latitude;
        }
        var lng=(longitudeAll/(arr.length)).toFixed(3);
        var lat=(latitudeAll/(arr.length)).toFixed(3);
        var lngLat=[lng,lat];
        return lngLat;
    }
    /**
     * 画点和聚合点
     * @param x=经度
     * @param y=纬度
     * @param base64=图片
     * @param layer=图层
     * @param row=隐藏内容
     * @param kind=类型
     */
    util.makePoint=function(x, y, base64,layer,row,kind,off,isMoreCode){
        var name=""
        if (row.name) {
            name = row.name+"";
        }
        var p1 = new g2.geom.Point({
            x: x,
            y: y,
            spatialReference: g2.geom.SpatialReference.EPSG4326
        });
        var textSymbol = new g2.syms.TextSymbol({//右上角的数字
            text: name,
            fontSize: 16,
            fontWeight: 700,
            borderColor: new g2.syms.Color({alpha: 0, r: 255, g: 255, b: 255}),
            borderThickness: 0,
            foreground: new g2.syms.Color({r: 0, g: 0, b: 0, a: 255}),
            offsetX: 1,
            offsetY: -15
        });
        var offsetX="";
        var	offsetY="";
        if(off){
            offsetX=off[0];
            offsetY=off[1];
        }else{
            offsetX=17;
            offsetY=46;
        }
        var symbol = new g2.syms.Picturemarkersymbol({
            source: base64,
            width: 34,
            height: 46,
            rotation: 0,
            opacity: 1,
            offsetX: offsetX,
            offsetY: offsetY
        });


        var fillSimple = new g2.syms.FillSymbol({
            borderColor: new g2.syms.Color({r: 0, g: 0, b: 0, a: 255})

        });
        var currencySymbol=new g2.syms.CurrencySymbol({markerSymbol:symbol,textSymbol:textSymbol});
        var ele = new g2.ele.Element({geometry: p1, symbol: currencySymbol});
        ele._data=row;
        ele.kind=kind;
        ele.isMoreCode=isMoreCode;
        layer.add(ele);
    };
    /**********************************************分支展示*****************************************************/
    /**
     * 经纬度点相同的聚合
     */
    util.methodForFz=function(arr,typecode){
        // var self=this;
        // var layer=self.map.getLayerById(typecode+"Layer");
        // layer.clear();

        // var radius=0.00005;
        // var lngLatMap=window.originalMapInf.center;
        // var lngLat=[lngLatMap.mapX,lngLatMap.mapY];
        // //每个对应角度
        // var onePartLimit=360/(arr.length);
        // //每份对应弧度
        // var ahd=onePartLimit*Math.PI/180;
        // for(var i=0;i<arr.length;i++){
        //     var x=lngLat[0]+Math.sin(ahd*i)*radius;
        //     var y=lngLat[1]-Math.cos(ahd*i)*radius;
        //     var pointArr=[x,y];
        //
        //     var elemenTag=arr[i];
        //     var icon = EMAP_CONFIGICON.modules.MenuModule[ type + "_img"];
        //     //线数据集合
        //     var lineArr=[];
        //     lineArr.push(lngLat);
        //     lineArr.push(pointArr);
        //     self._addPoint(pointArr[0],pointArr[1],icon,layer,elemenTag,lineArr);
        //
        // }

    }
    /**
     * 画点和连线
     * @method
     * */
    util._addPoint=function (x, y, base64, layer, row,lineArr) {
        var p1 = new g2.geom.Point({
            x: x,
            y: y,
            spatialReference: g2.geom.SpatialReference.EPSG4326
        });
        var symbol = new g2.syms.Picturemarkersymbol({
            source: base64,
            width: "32",
            height: "32",
            rotation: "0",
            opacity: "1",
            offsetX: "20",
            offsetY: "26"
        });
        var ele = new g2.ele.Element({geometry: p1, symbol: symbol});
        layer.add(ele);
        //构造线发符号实例和线实例
        var lineStringGeoJson = {type:"LineString",coordinates:lineArr};
        var ploylineSymbol=new g2.syms.SimpleLinesymbol({color:new g2.syms.Color({a: 153, r: 255, g: 0, b: 0})});
        var polyline = g2.geom.GeometryFactory.createGeometryFromGeoJson(lineStringGeoJson,g2.geom.SpatialReference.EPSG4326);
        var ele2 = new g2.ele.Element({geometry: polyline, symbol: ploylineSymbol});
        layer.add(ele2);
        ele._data = row;
        ele.isNotBig = true;
    }
    return util;
})