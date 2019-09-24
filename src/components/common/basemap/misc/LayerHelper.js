/**
 * Created by onsinsin on 2019/8/9.
 * 资源数据与图层配置转换工具
 */
import WVTSHelper from './WVTSHelper';

let util = {};

/**
 * 数据库记录转换为图层参数
 * @param layerConfig
 * @returns {*}
 */
util.parseLayerOpts = function (layerConfig) {
    let handler = util['parseLayerOpts_' + layerConfig.serverType];
    if (handler) {
        return handler(layerConfig);
    } else {
        return null;
    }
}

/**
 * 数据库记录转换为图层参数-同步
 * @param layerConfig
 * @returns {*}
 */
util.parseLayerOptsBase = function (layerConfig) {
    if (layerConfig.serverType == 'WMTS') {
        return util._parseWMTS(layerConfig)
    } else {
        return util._parseWVTS(layerConfig)
    }
}

/**
 *
 * @param layerConfig
 * @returns {Promise}
 */
util.parseLayerOpts_WVTS = function (layerConfig) {
    return new Promise((resolve, reject) => {
        resolve(util._parseWVTS(layerConfig))
})
}

util.parseLayerOpts_WMTS = function (layerConfig) {
    return new Promise((resolve, reject) => {
        resolve(util._parseWMTS(layerConfig));
})
}

/**
 * 解析栅格瓦片，并分组
 * @param list
 */
util.groupBaseLayers = function (list) {
    let newList = [];
    let groupSet = {};
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.classifyId == '1101' && item.tag) {
            let groupList = groupSet[item.tag] || [];
            groupList.push(item);
            groupSet[item.tag] = groupList;
        } else {
            newList.push(item);
        }
    }
    for (let k in groupSet) {
        let groupList = groupSet[k];
        let groupObj = {};
        groupObj.type='group';
        groupObj.layers = [];
        let annoList=[];
        for (let i = 0; i < groupList.length; i++) {
            let item = groupList[i];
            let layerName = item.resourcesName || '';
            if (layerName && layerName.indexOf('注记') >= 0) {
                annoList.push(item);
            } else {
                groupObj.resourcesId = item.resourcesId;
                groupObj.resourcesName = item.resourcesName;
                groupObj.resourcesIcon = item.resourcesIcon;
                groupObj.classifyId = item.classifyId;
                groupObj.layers.push(item);
            }
            delete item.resourcesIcon;
        }
        groupObj.layers=groupObj.layers.concat(annoList);
        newList.push(groupObj);
    }
    return newList;
}

util._parseWMTS = function (layerConfig) {
    let layerOpts = {};
    let attrMap = {
        id: 'resourcesId',
        type: 'serverType',
        layers: 'layerName',
        url: 'url',
        previewUrl: 'previewUrl',
        style: 'styleName',
        styleUrl: 'styleUrl',
        version: 'serverVersion',
        tileMatrixSet: 'titleMatrixSet',
        scale: 'scale',
        classifyId: 'classifyId',
        minZoom: 'minZoom',
        maxZoom: 'maxZoom'
    }
    for (let k in attrMap) {
        layerOpts[k] = layerConfig[attrMap[k]];
    }
    //地图配置
    let mapOpts = {
        defaultExtent: {},
        previewExtent: null
    };
    //最大最小比例尺
    if (layerConfig.minZoom && !isNaN(layerConfig.minZoom)) {
        mapOpts.defaultExtent.minZoom = parseInt(layerConfig.minZoom);
        layerOpts.minZoom = parseInt(layerConfig.minZoom);
    }
    if (layerConfig.maxZoom && !isNaN(layerConfig.maxZoom)) {
        mapOpts.defaultExtent.maxZoom = parseInt(layerConfig.maxZoom);
        layerOpts.maxZoom = parseInt(layerConfig.maxZoom);
    }
    //
    if (layerConfig.range) {
        try {
            if (Object.prototype.toString.call(layerConfig.range) == '[object String]') {
                mapOpts.defaultExtent.extent = JSON.parse(layerConfig.range);
            } else if (Object.prototype.toString.call(layerConfig.range) == '[object Array]') {
                mapOpts.defaultExtent.extent = layerConfig.range;
            }
        } catch (e) {
        }
    }
    //预览范围
    if (layerConfig.previewExtent) {
        try {
            if (Object.prototype.toString.call(layerConfig.previewExtent) == '[object String]') {
                mapOpts.previewExtent = JSON.parse(layerConfig.previewExtent);
            } else if (Object.prototype.toString.call(layerConfig.previewExtent) == '[object Array]') {
                mapOpts.previewExtent = layerConfig.previewExtent;
            }
        } catch (e) {
        }
    } else if (mapOpts.defaultExtent.extent) {
        mapOpts.previewExtent = mapOpts.defaultExtent.extent;
    }
    if (layerConfig.origin) {
        try {
            if (Object.prototype.toString.call(layerConfig.origin) == '[object String]') {
                layerOpts.origin = JSON.parse(layerConfig.origin);
            } else if (Object.prototype.toString.call(layerConfig.origin) == '[object Array]') {
                layerOpts.origin = layerConfig.origin;
            }
        } catch (e) {
        }
    }
    if (layerConfig.coordinateSystem) {
        layerOpts.projection = 'EPSG:' + layerConfig.coordinateSystem;
    }
    return {
        layerOpts: layerOpts,
        mapOpts: mapOpts
    }
}

util._parseWVTS = function (layerConfig) {
    let layerOpts = {};
    let attrMap = {
        id: 'resourcesId',
        type: 'serverType',
        layers: 'layerName',
        url: 'url',
        style: 'styleName',
        styleUrl: 'styleUrl',
        matrixSet: 'titleMatrixSet'
    }
    for (let k in attrMap) {
        layerOpts[k] = layerConfig[attrMap[k]];
    }
    if (layerConfig.origin) {
        try {
            if (Object.prototype.toString.call(layerConfig.origin) == '[object String]') {
                layerOpts.origin = JSON.parse(layerConfig.origin);
            } else if (Object.prototype.toString.call(layerConfig.origin) == '[object Array]') {
                layerOpts.origin = layerConfig.origin;
            }
        } catch (e) {
        }
    }
    let layersConf = {};
    layersConf.id = layerConfig.resourcesId;
    layersConf.type = 'group';
    layersConf.layers = [];
    let layerUrls = layerConfig.previewUrl.split(',');
    let layerNames = layerOpts.layers.split(',');
    let maxZooms = layerConfig.maxZoom.split(',');
    let minZooms = layerConfig.minZoom.split(',');
    let layerIndexConf = {};
    for (let i = 0; i < layerUrls.length; i++) {
        let layerUrl = layerUrls[i];
        let index = /^.*\/tiles\/(\d{1,})\/.*$/.exec(layerUrl)[1];
        layerIndexConf[index] = WVTSHelper.createLayerConf(minZooms[i], maxZooms[i]);
    }
    //
    let vtLayerConf = {};
    vtLayerConf.url = WVTSHelper.getUrlTemplate(layerUrls[0]);
    vtLayerConf.styleUrl = layerConfig.styleUrl;
    vtLayerConf.type = 'WVTS';
    vtLayerConf.name = layerConfig.resourcesName;
    vtLayerConf.layerIndexMap = layerIndexConf;
    vtLayerConf.sources = layerNames;
    layersConf.layers.push(vtLayerConf);
    return {
        layerOpts: layersConf,
        mapOpts: {}
    };
}

util.parseLayerOpts_WTTS = function (layerConfig) {
    return new Promise((resolve, reject) => {
        let layerOpts = {};
    let attrMap = {
        id: 'resourcesId',
        type: 'serverType',
        layers: 'layerName',
        url: 'url',
        previewUrl: 'previewUrl',
        style: 'styleName',
        styleUrl: 'styleUrl',
        version: 'serverVersion',
        tileMatrixSet: 'titleMatrixSet',
        scale: 'scale',
        classifyId: 'classifyId',
        minZoom: 'minZoom',
        maxZoom: 'maxZoom'
    }
    for (let k in attrMap) {
        layerOpts[k] = layerConfig[attrMap[k]];
    }
    //地图配置
    let mapOpts = {
        defaultExtent: {},
        previewExtent: null
    };
    //最大最小比例尺
    if (layerConfig.minZoom && !isNaN(layerConfig.minZoom)) {
        mapOpts.defaultExtent.minZoom = parseInt(layerConfig.minZoom);
        layerOpts.minZoom = parseInt(layerConfig.minZoom);
    }
    if (layerConfig.maxZoom && !isNaN(layerConfig.maxZoom)) {
        mapOpts.defaultExtent.maxZoom = parseInt(layerConfig.maxZoom);
        layerOpts.maxZoom = parseInt(layerConfig.maxZoom);
    }
    //
    if (layerConfig.range) {
        try {
            if (Object.prototype.toString.call(layerConfig.range) == '[object String]') {
                mapOpts.defaultExtent.extent = JSON.parse(layerConfig.range);
            } else if (Object.prototype.toString.call(layerConfig.range) == '[object Array]') {
                mapOpts.defaultExtent.extent = layerConfig.range;
            }
        } catch (e) {
        }
    }
    //预览范围
    if (layerConfig.previewExtent) {
        try {
            if (Object.prototype.toString.call(layerConfig.previewExtent) == '[object String]') {
                mapOpts.previewExtent = JSON.parse(layerConfig.previewExtent);
            } else if (Object.prototype.toString.call(layerConfig.previewExtent) == '[object Array]') {
                mapOpts.previewExtent = layerConfig.previewExtent;
            }
        } catch (e) {
        }
    } else if (mapOpts.defaultExtent.extent) {
        mapOpts.previewExtent = mapOpts.defaultExtent.extent;
    }
    if (layerConfig.origin) {
        try {
            if (Object.prototype.toString.call(layerConfig.origin) == '[object String]') {
                layerOpts.origin = JSON.parse(layerConfig.origin);
            } else if (Object.prototype.toString.call(layerConfig.origin) == '[object Array]') {
                layerOpts.origin = layerConfig.origin;
            }
        } catch (e) {
        }
    }
    if (layerConfig.coordinateSystem) {
        layerOpts.projection = 'EPSG:' + layerConfig.coordinateSystem;
    }
    resolve({
        layerOpts: layerOpts,
        mapOpts: mapOpts
    });
})
}

util.parseLayerOpts_WOPS = function (layerConfig) {
    return new Promise((resolve, reject) => {
        let layerOpts = {};
    let attrMap = {
        id: 'resourcesId',
        type: 'serverType',
        layers: 'layerName',
        url: 'url',
        previewUrl: 'previewUrl',
        style: 'styleName',
        styleUrl: 'styleUrl',
        version: 'serverVersion',
        tileMatrixSet: 'titleMatrixSet',
        scale: 'scale',
        classifyId: 'classifyId',
        minZoom: 'minZoom',
        maxZoom: 'maxZoom'
    }
    for (let k in attrMap) {
        layerOpts[k] = layerConfig[attrMap[k]];
    }
    //地图配置
    let mapOpts = {
        defaultExtent: {},
        previewExtent: null
    };
    //最大最小比例尺
    if (layerConfig.minZoom && !isNaN(layerConfig.minZoom)) {
        mapOpts.defaultExtent.minZoom = parseInt(layerConfig.minZoom);
        layerOpts.minZoom = parseInt(layerConfig.minZoom);
    }
    if (layerConfig.maxZoom && !isNaN(layerConfig.maxZoom)) {
        mapOpts.defaultExtent.maxZoom = parseInt(layerConfig.maxZoom);
        layerOpts.maxZoom = parseInt(layerConfig.maxZoom);
    }
    //
    if (layerConfig.range) {
        try {
            if (Object.prototype.toString.call(layerConfig.range) == '[object String]') {
                mapOpts.defaultExtent.extent = JSON.parse(layerConfig.range);
            } else if (Object.prototype.toString.call(layerConfig.range) == '[object Array]') {
                mapOpts.defaultExtent.extent = layerConfig.range;
            }
        } catch (e) {
        }
    }
    //预览范围
    if (layerConfig.previewExtent) {
        try {
            if (Object.prototype.toString.call(layerConfig.previewExtent) == '[object String]') {
                mapOpts.previewExtent = JSON.parse(layerConfig.previewExtent);
            } else if (Object.prototype.toString.call(layerConfig.previewExtent) == '[object Array]') {
                mapOpts.previewExtent = layerConfig.previewExtent;
            }
        } catch (e) {
        }
    } else if (mapOpts.defaultExtent.extent) {
        mapOpts.previewExtent = mapOpts.defaultExtent.extent;
    }
    if (layerConfig.origin) {
        try {
            if (Object.prototype.toString.call(layerConfig.origin) == '[object String]') {
                layerOpts.origin = JSON.parse(layerConfig.origin);
            } else if (Object.prototype.toString.call(layerConfig.origin) == '[object Array]') {
                layerOpts.origin = layerConfig.origin;
            }
        } catch (e) {
        }
    }
    if (layerConfig.coordinateSystem) {
        layerOpts.projection = 'EPSG:' + layerConfig.coordinateSystem;
    }
    resolve({
        layerOpts: layerOpts,
        mapOpts: mapOpts
    });
})
}

util.parseLayerOpts_WMS = function (layerConfig) {
    return new Promise((resolve, reject) => {
        let layerOpts = {};
    let attrMap = {
        id: 'resourcesId',
        type: 'serverType',
        layers: 'layerName',
        url: 'url',
        previewUrl: 'previewUrl',
        style: 'styleName',
        styleUrl: 'styleUrl',
        version: 'serverVersion',
        tileMatrixSet: 'titleMatrixSet',
        scale: 'scale',
        classifyId: 'classifyId',
        minZoom: 'minZoom',
        maxZoom: 'maxZoom'
    }
    for (let k in attrMap) {
        layerOpts[k] = layerConfig[attrMap[k]];
    }
    //地图配置
    let mapOpts = {
        defaultExtent: {},
        previewExtent: null
    };
    //最大最小比例尺
    if (layerConfig.minZoom && !isNaN(layerConfig.minZoom)) {
        mapOpts.defaultExtent.minZoom = parseInt(layerConfig.minZoom);
        layerOpts.minZoom = parseInt(layerConfig.minZoom);
    }
    if (layerConfig.maxZoom && !isNaN(layerConfig.maxZoom)) {
        mapOpts.defaultExtent.maxZoom = parseInt(layerConfig.maxZoom);
        layerOpts.maxZoom = parseInt(layerConfig.maxZoom);
    }
    //
    if (layerConfig.range) {
        try {
            if (Object.prototype.toString.call(layerConfig.range) == '[object String]') {
                mapOpts.defaultExtent.extent = JSON.parse(layerConfig.range);
            } else if (Object.prototype.toString.call(layerConfig.range) == '[object Array]') {
                mapOpts.defaultExtent.extent = layerConfig.range;
            }
        } catch (e) {
        }
    }
    //预览范围
    if (layerConfig.previewExtent) {
        try {
            if (Object.prototype.toString.call(layerConfig.previewExtent) == '[object String]') {
                mapOpts.previewExtent = JSON.parse(layerConfig.previewExtent);
            } else if (Object.prototype.toString.call(layerConfig.previewExtent) == '[object Array]') {
                mapOpts.previewExtent = layerConfig.previewExtent;
            }
        } catch (e) {
        }
    } else if (mapOpts.defaultExtent.extent) {
        mapOpts.previewExtent = mapOpts.defaultExtent.extent;
    }
    if (layerConfig.origin) {
        try {
            if (Object.prototype.toString.call(layerConfig.origin) == '[object String]') {
                layerOpts.origin = JSON.parse(layerConfig.origin);
            } else if (Object.prototype.toString.call(layerConfig.origin) == '[object Array]') {
                layerOpts.origin = layerConfig.origin;
            }
        } catch (e) {
        }
    }
    if (layerConfig.coordinateSystem) {
        layerOpts.projection = 'EPSG:' + layerConfig.coordinateSystem;
    }
    resolve({
        layerOpts: layerOpts,
        mapOpts: mapOpts
    });
})
}

export default util;
