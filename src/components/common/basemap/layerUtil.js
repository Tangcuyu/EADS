import WVTSHelper from './misc/WVTSHelper'
export default {
    /**
     * 创建底图
     * @param layerOpts
     * @returns {*}
     */
    createEGISBaseLayer(layerOpts) {
        if (!(Object.prototype.toString.call(layerOpts) === '[object Object]')) {
            throw(new Error('参数类型错误!'));
        }
        let layer = null;
        //需要支持图层组
        if (layerOpts.type == 'group') {
            let layers = layerOpts.layers,
                layerId = layerOpts.id;
            let groupLayer = new egis.carto.GroupLayer({
                id: layerId,
                name: layerOpts.title || '',
                zIndex: layerOpts.zIndex,
                layers: []
            });
            for (let i = 0, len = layers.length; i < len; i++) {
                let config = layers[i];
                if (layerOpts.template) {
                    for (let kk in layerOpts.template) {
                        config[kk] = layerOpts.template[kk];
                    }
                }
                let lyr = createSingleLayer(config,groupLayer);
            }
            layer = groupLayer;
        } else {
            layer = createSingleLayer(layerOpts);
            layer.name = layerOpts.title || '';
        }
        /**
         * 标识图层为底图
         * @type {string}
         * @private
         */
        layer._type = '_base_layer_tag';
        layer.layerGroups = layerOpts.layerGroups || '';
        layer._cfg = JSON.stringify(layerOpts);
        return layer;
        /**
         *
         * @param cfg
         * @returns {*}
         */
        function createSingleLayer(cfg,groupLayer) {
            let layer = null;
            cfg.wrapX= true;
            if (cfg.type == 'WVTS') {
                cfg._type_ = cfg.type;
                // delete cfg.type;
                layer = WVTSHelper.createVectorLayer(cfg.url,cfg);
                let bgLayer=WVTSHelper.createBackgourndLayer(cfg.url,cfg);
                groupLayer&& groupLayer.addLayer(bgLayer);
                groupLayer&& groupLayer.addLayer(layer);
            } else {
                layer = new egis.carto.TileLayer(cfg);
                groupLayer&&groupLayer.addLayer(layer);
            }
            if (layerOpts.zIndex) {
                layer.setZIndex(layerOpts.zIndex);
            }
            layer._cfg = JSON.stringify(cfg)
            return layer;
        }
    },
    /**
     * 更新矢量瓦片样式
     * @param layer
     * @param layersConfig
     */
    updateWVTS2dStyle(map, layer, layersConfig, cb, ctx) {
        return WVTSHelper.updateWVTS2dStyle.apply(this, arguments);
    },

    /**
     * 获取所有底图，单图层，忽略注记
     * @param map
     */
    getBaseLayer(map) {
        if (map instanceof egis.carto.Map) {
            let layers = map.layers;
            let baseLayerList = [];
            for (let key in layers) {
                let layer = layers[key];
                if (layer._type === "_base_layer_tag") {
                    getLayer(baseLayerList, layer);
                }
            }
            return baseLayerList;
        } else if (map instanceof egis.carto.Globe) {
            let layers = map.layers;
            let baseLayerList = [];
            for (let key in layers) {
                let layer = layers[key];
                if (layer._type === "_base_layer_tag") {
                    if (!((layer._cfg.indexOf('cta') > -1) || (layer._cfg.indexOf('cia') > -1 || layer._cfg.indexOf('cva') > -1))) {
                        baseLayerList.push(layer)
                    }
                }
            }
            console.log(baseLayerList);
            return baseLayerList;
        }

        function getLayer(baseLayerList, layer) {
            if (layer instanceof egis.carto.GroupLayer) {
                let lys = layer.groupLayers;
                lys[0].visible = layer.visible;
                getLayer(baseLayerList, lys[0])
            } else {
                baseLayerList.push(layer)

            }
        }
    },

    /**
     * 获取底图，包括图层组,按照层级返回
     * @param map
     */
    getBaseLayers(map){
        if (map instanceof egis.carto.Map) {
            let layers = map.layers;
            let baseLayerList = [];
            for (let key in layers) {
                let layer = layers[key];
                if (layer._type === "_base_layer_tag") {
                    baseLayerList.push(layer);
                }
            }
            baseLayerList.sort(function (a, b) {
                return b.getZIndex()-a.getZIndex();
            })
            return baseLayerList;
        }
    },

    /**
     * 获取当前底图
     * @param map
     */
    getCurrentBaseLayer(map) {
        let list = this.getBaseLayer(map);
        let currentLayer;
        for (let i = list.length - 1; i >= 0; i--) {
            let layer = list[i];
            if (layer.visible) {
                currentLayer = layer;
                return currentLayer
            }
        }
    },

    /**
     * 创建底图
     * @param layerOpts
     * @returns {*}
     */
    createEgis3dBaseLayer(layerOpts) {
        if (!(Object.prototype.toString.call(layerOpts) === '[object Object]')) {
            throw(new Error('参数类型错误!'));
        }
        let layer = null;
        layer = createSingleLayer(layerOpts);
        layer.name = layerOpts.title || '';
        /**
         * 标识图层为底图
         * @type {string}
         * @private
         */
        layer._type = '_base_layer_tag';
        layer.layerGroups = layerOpts.layerGroups || '';
        return layer;

        //
        function createSingleLayer(cfg) {
            let layer = new egis.carto.TileLayer3D(cfg);
            if (layerOpts.zIndex) {
                layer.setZIndex(layerOpts.zIndex);
            }
            layer._cfg = JSON.stringify(cfg)
            return layer;
        }
    },

    /**
     * 创建三维地形图层
     * @param layerOpts
     */
    createEgis3dTerrainLayer(layerOpts) {
        layerOpts.layerType = layerOpts.layerType || egis.carto.LayerType.TerrainLayer;
        let layer = new egis.carto.TerrainLayer3D(layerOpts);
        return layer;
    },

    /**
     * 创建三维倾斜图层
     * @param layerOpts
     */
    createEgis3dBuildingLayer(layerOpts) {
        layerOpts.layerType = layerOpts.layerType || egis.carto.LayerType.BuildingLayer;
        let layer = new egis.carto.BuildingLayer3D(layerOpts);
        return layer;
    },
    /**
     * 根据layerId获取图层对象
     * @method
     * @param map {egis.maps.Map} 必填，地图对象
     * @param layerId {String} 必填，图层id
     * @returns {egis.lys.Layer}
     */
    getLayerById(map, layerId) {
        if (layerId) {
            // var g2map = map.getMap();
            var layers = map.layers;
            var obj = {};
            for (var key in layers) {
                var layer = layers[key];
                getLayer(obj, layer, layerId);
                if (obj.layer) {
                }
            }
            return obj.layer || null;
        } else {
            return null;
        }

        function getLayer(obj, layer, layerId) {
            if (obj.layer) {
                return;
            }
            if (layer.id == layerId) {
                obj.layer = layer;
                return;
            } else if (layer instanceof egis.carto.GroupLayer) {
                var lys = layer.groupLayers;
                for (var k in lys) {
                    var lyr = lys[k];
                    getLayer(obj, lyr, layerId);
                }
            }
        }
    }
}
