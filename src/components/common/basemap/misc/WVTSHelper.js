/**
 *
 * @type {{tileURL: WVTSHelper.tileURL}}
 */
const WVTSHelper = {
    /**
     *
     * @param url
     * @returns {Function}
     */
    tileURL (url) {
        return function (tileCoord) {
            return url.replace('{z}', (tileCoord[0] - 1).toString())
                .replace('{x}', tileCoord[1].toString())
                .replace('{y}', (-tileCoord[2] - 1).toString());
        }
    },
    /**
     *
     * @param minzoom
     * @param maxzoom
     * @returns {{minzoom: *, maxzoom: *, isIn: isIn}}
     */
    createLayerConf(minzoom, maxzoom) {
        return {
            minzoom: parseInt(minzoom),
            maxzoom: parseInt(maxzoom),
            isIn: function (zoom) {
                return this.minzoom <= zoom && zoom <= this.maxzoom;
            }
        }
    },
    /**
     *
     * @param url
     * @param tile
     * @param done
     */
    fetchFeatures (url, tile, done)
    {
        fetch(url).then(function (response) {
            response.arrayBuffer().then(function (data) {
                var format = tile.getFormat();
                tile.setProjection(format.readProjection(data));
                const fs = format.readFeatures(data, {});
                done(fs);
            }).catch(function () {
                done();
            });
        }).catch(function () {
            done();
        });
    },
    /**
     * 获取要渲染的图层
     * @param zoom
     * @returns {Array}
     */
    getTileLayerNames (zoom, layerIndexConf) {
        const names = [];
        for (let v in layerIndexConf) {
            const conf = layerIndexConf[v];
            if (conf.isIn(zoom)) {
                names.push(v);
            }
        }
        return names;
    },
    getUrlTemplate(url){
        return url.replace(/tiles\/\d{1,}\/{z}/g, 'tiles/{index}/{z}');
    },
    /**
     *
     * @param urlTemplate
     * @param opts
     * @returns {*}
     */
    createVectorLayer(urlTemplate, opts) {
        let options = {
            declutter: true,
            renderMode: "image",
            declutterDistance: 1,
            tileSize: 512,
            projection: "EPSG:4490",
            extent: [-180, -90, 180, 90],
        };
        let keys = ["declutter", "renderMode", "declutterDistance", "projection", "extent", "tileSize"];
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            options[key] = opts[key] || options[key]
        }
        let layerIndexConf = opts.layerIndexMap;
        let tileLoad = function (tile, url) {
            tile.setLoader(function () {
                const zoom = tile.tileCoord[0];
                const indexes = WVTSHelper.getTileLayerNames(zoom, layerIndexConf);
                const features = [];
                var count = 0;
                const done = function (fs) {
                    count++;
                    if (!!fs) {
                        fs.forEach(a => features.push(a));
                    }
                    if (count == indexes.length) {
                        const format = tile.getFormat();
                        if (features.length > 0) {
                            tile.setFeatures(features, {});
                            tile.setExtent(format.getLastExtent());
                        }
                    }
                };
                indexes.forEach(a => {
                    WVTSHelper.fetchFeatures(url.replace("{index}", a), tile, done);
            });
            })
        }
        options.tileUrlFunction = WVTSHelper.tileURL(urlTemplate);
        options.tileLoadFunction = tileLoad;
        options.wrapX=true;
        let layer = new egis.carto.VectorTileLayer(options);
        return layer;
    },
    /**
     *
     * @param urlTemplate
     * @param opts
     * @returns {*}
     */
    createBackgourndLayer(urlTemplate, opts) {
        urlTemplate = urlTemplate.replace('{index}', '11');
        let options = {
            declutter: true,
            renderMode: "image",
            declutterDistance: 1,
            tileSize: 512,
            projection: "EPSG:4490",
            extent: [-180, -90, 180, 90],
        };
        let keys = ["declutter", "renderMode", "declutterDistance", "projection", "extent", "tileSize"];
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            options[key] = opts[key] || options[key]
        }
        options.tileUrlFunction = WVTSHelper.tileURL(urlTemplate);
        options.wrapX=true;
        let layer = new egis.carto.VectorTileLayer(options);
        return layer;
    },
    /**
     *
     * @param layers
     */
    changeBackGroundStyle  (layers) {
        for (var j = 0; j < layers.length; j++) {
            var layer = layers[j];
            if (layer["source-layer"] == "ANATPL") {
                layer.paint["fill-outline-color"] = layers[0].paint["background-color"];
            }
            if (layer["source-layer"] == "water_zjpl") {
                console.log(layers[j]);
                //layers.splice(j, 1);
                layer.paint["text-halo-color"] = layers[0].paint["background-color"];
                layer.paint["text-color"] = layers[0].paint["background-color"];
            }
            if (layer["source-layer"] == "water_zjpt") {
                console.log(layers[j]);
                //layers.splice(j, 1);
                layer.paint["text-halo-color"] = layers[0].paint["background-color"];
                layer.paint["text-color"] = layers[0].paint["background-color"];
            }
        }
    },
    /**
     *
     * @param minZoom
     * @param maxZoom
     * @param tileSize
     * @returns {Array}
     */
    getResolutions(minZoom, maxZoom, tileSize){
        minZoom = (minZoom == undefined) ? 1 : minZoom;
        maxZoom = (maxZoom == undefined) ? 19 : maxZoom;
        tileSize = (tileSize == undefined) ? 512 : tileSize;
        var topResolution = 360.0 / tileSize;
        var res = [];
        for (var zoom = minZoom; zoom < maxZoom; zoom++) {
            res[zoom] = topResolution / Math.pow(2, zoom);
        }
        return res;
    },
    /**
     *
     * @param layers
     */
    removeLayer  (layers) {
        for (var j = 0; j < layers.length; j++) {
            var layer = layers[j];
            if (layer["id"] == "1191") {
                console.log(layers[j]);
                // layers.splice(j, 1);
            }
        }
    },
    /**
     *
     * @param styleUrl
     * @returns {{}}
     */
    getStyles(styleUrl){
        let styleObj = {};
        styleObj.spritesUrl = styleUrl.replace("/styles/", "/sprites/") + "/sprite.json";
        styleObj.spritesImgUrl = styleUrl.replace("/styles/", "/sprites/") + "/sprite.png";
        styleObj.styleUrl = styleUrl;
        return styleObj;
    },
    appendVisible(layers) {
        for (let i = 0, len = layers.length; i < len; i++) {
            layers[i].visible = true;
        }
    },

    /**
     * 更新矢量瓦片样式2d
     * @param map
     * @param wvtLayers
     * @param layersConfig
     * @param cb
     * @param ctx
     */
    updateWVTS2dStyle(map, wvtLayers, layersConfig, cb, ctx){
        let compositeLayer = wvtLayers.groupLayers[1];
        let backgroundLayer = wvtLayers.groupLayers[0];
        compositeLayer.map = map;
        backgroundLayer.map = map;
        let styleUrl = layersConfig.layers[0].styleUrl;
        let layerName = layersConfig.layers[0].name || '';
        let styleObj = WVTSHelper.getStyles(styleUrl);
        let sources=layersConfig.layers[0].sources;
        let res = WVTSHelper.getResolutions();
        //请求雪碧图对象---仅需请求一次，
        compositeLayer.getSprites(styleObj.spritesUrl).then(function (spritesData) {
            //请求样式---仅需请求一次
            compositeLayer.getStyle(styleObj.styleUrl).then(function (glStyle) {
                let layers = glStyle.layers;
                // 初始化时 将图层根据需要设置visible 属性，此处初始化将图层全部设为可见
                WVTSHelper.appendVisible(layers);
                if (layerName.indexOf('中国') >= 0) {
                    WVTSHelper.changeBackGroundStyle(layers);
                }
                let backgroundSpritesImgUrl=styleObj.spritesImgUrl.replace(/\/sprites\/\d{1,}\//g, '/sprites/1/');
                backgroundLayer.loadStyle(glStyle, sources, res, spritesData, backgroundSpritesImgUrl);

                compositeLayer.loadStyle(glStyle, sources, res, spritesData,
                    styleObj.spritesImgUrl);
                //保存加载样式的参数
                compositeLayer._load_style_opts={
                    glStyle,
                    sources,
                    res,
                    spritesData,
                    styleObj,
                    backgroundSpritesImgUrl
                };
                // 添加背景 ---仅需添加一次
                compositeLayer.loadBackground(glStyle);
                cb && cb.call(ctx);
            })
        })
    }
}
export default WVTSHelper;
