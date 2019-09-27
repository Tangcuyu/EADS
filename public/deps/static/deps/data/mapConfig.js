var EAMP_MAPCONFIG = {
    "targetId": "map",
    "defaultExtent": {
        "level": 5,
        "maxZoom": 18,
        "minZoom": 4,
        "center": [105.1086425, 33.1906835625],
        "projection": "EPSG:4326"
    },
    "fullExtent": {
        "center": [105.1086425, 33.1906835625],
        "level": 5
    },
    "defaultExtentMini": {
        "level": 5,
        "maxZoom": 18,
        "minZoom": 3,
        "center": [105.1086425, 33.1906835625],
        "projection": "EPSG:4326"
    },
    "fullExtentMini": {
        "center": [105.1086425, 33.1906835625],
        "level": 5
    },
    "baseLayers": [
        {
            "id": "basemap",
            "name": "底图",
            "title": "底图",
            'imgSrc': './src/modules/GisModule/img/chenan.png',
            "layers": "beijing:publish", "//": "图层名称",
            "matrix": 14,"//": "切图级别小于等于切图级别",
            "matrixSet": "EPSG:4326", "//": "切图策略",
            "matrixPrefix": "EPSG:4326:","//": "切图策略加冒号：",
            // "extent": [73.62,16.7,134.77,53.56],
            "resolutions":[
                0.703125,
                0.3515625,
                0.17578125,
                0.087890625,
                0.0439453125,
                0.02197265625,
                0.010986328125,
                0.0054931640625,
                0.00274658203125,
                0.001373291015625,
                0.0006866455078125,
                0.0003433227539062,
                0.0001716613769531,
                0.0000858306884766,
                0.0000429153442383,
                0.0000214576721191,
                0.0000107288360596,
                0.0000053644180298,
                0.0000026822090149,
                0.0000013411045074,
                0.0000006705522537,
                0.0000003352761269
            ],
            "format": "image/png","//": "图层格式",
            "projection": "EPSG:4326","//": "投影参考",
            "layerType": 1,"//": "图层类型",
            "tileType": 102,"//": "瓦片类型",
            "opacity": 1.0,"//": "透明度",
            "visible": true,"//": "是否显示",
            "url": "http://106.37.227.20:58080/geoserver/gwc/service/wmts/"
        },
        {
            "id": "tiandituLayer_img",
            "title": "影像",
            'imgSrc': './src/modules/GisModule/img/earth.png',
            "type": "group",
            "attr": "basics",
            "style": "default",
            "layers": [
                {
                    "layers": "img",
                    "matrixSet": "c",
                    "format": "tiles",
                    "tileType": 102,
                    "style": "default",
                    "url": "http://120.52.31.27:181/img_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&",
                    "projection": "EPSG:4326"
                },
                {
                    "layers": "cta",
                    "matrixSet": "c",
                    "format": "tiles",
                    "tileType": 102,
                    "style": "default",
                    "url": "http://120.52.31.27:181/cta_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&",
                    "projection": "EPSG:4326"
                },
                {
                    "id": "guojiexian",
                    "name": "国界线",
                    "layers": "guojiexian:guojiexian",
                    "layerType": 1,
                    "tileType": 101,
                    "opacity": 1.0,
                    "visible":true,
                    "version":"1.1.1",
                    "projection": "EPSG:4326",
                    "styles":"",
                    "crossOrigin":"anonymous",
                    "url": "http://106.37.227.20:58080/geoserver/guojiexian/wms"
                }

            ]
        },
        {
            "id": "tiandituLayer_vec",
            "imgSrc": "./src/modules/GisModule/img/vector.png",
            "title": "矢量",
            "type": "group",
            "layers": [
                {
                    "layers": "vec",
                    "matrixSet": "c",
                    "format": "tiles",
                    "tileType": 102,
                    "url": "http://120.52.31.27:181/vec_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&&",
                    "projection": "EPSG:4326"
                },
                {
                    "layers": "cva",
                    "matrixSet": "c",
                    "format": "tiles",
                    "tileType": 102,
                    "url": "http://120.52.31.27:181/cva_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&&",
                    "projection": "EPSG:4326"
                }
            ]
        },
        {
            "id": "tiandituLayer_vec",
            "imgSrc": "./src/modules/GisModule/img/ter.png",
            "title": "地形",
            "type": "group",
            "layers": [
                {
                    "layers": "ter",
                    "matrixSet": "c",
                    "format": "tiles",
                    "tileType": 102,
                    "url": "http://120.52.31.27:181/ter_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&&",
                    "projection": "EPSG:4326"
                },
                {
                    "layers": "cta",
                    "matrixSet": "c",
                    "format": "tiles",
                    "tileType": 102,
                    "url": "http://120.52.31.27:181/cta_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&&",
                    "projection": "EPSG:4326"
                }
            ]
        },
        {
            "id":"xyz",
            "layerType":1,
            "title": "谷歌地图",
            "tileType": 104,
            "url":"http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
        }

    ]
}