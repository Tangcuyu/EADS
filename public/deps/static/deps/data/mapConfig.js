
window.EAMP_MAPCONFIG = {
  'targetId': 'baseMap2D',
  'defaultExtent': {
    'level': 5,
    'maxZoom': 18,
    'minZoom': 4,
    'center': [105.1086425, 33.1906835625],
    'projection': 'EPSG:4326'
  },
  'fullExtent': {
    'center': [105.1086425, 33.1906835625],
    'level': 5
  },
  'defaultExtentMini': {
    'level': 5,
    'maxZoom': 18,
    'minZoom': 3,
    'center': [105.1086425, 33.1906835625],
    'projection': 'EPSG:4326'
  },
  'fullExtentMini': {
    'center': [105.1086425, 33.1906835625],
    'level': 5
  },

  'baseLayers': [
    {
      'id': 'basemap',
      'name': '底图',
      'title': '底图',
      // 'imgSrc': './static/deps/data/img/earth.png',
      'icon': './deps/static/deps/data/img/earth.png',
      'layers': 'cite:publish', '//': '图层名称',
      'matrix': 14, '//': '切图级别小于等于切图级别',
      'matrixSet': 'EPSG:4326', '//': '切图策略',
      'matrixPrefix': 'EPSG:4326:', '//': '切图策略加冒号：',
      // "extent": [73.62,16.7,134.77,53.56],
      'resolutions': [
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
      'format': 'image/png', '//': '图层格式',
      'projection': 'EPSG:4326', '//': '投影参考',
      'layerType': 1, '//': '图层类型',
      'tileType': 102, '//': '瓦片类型',
      'opacity': 1.0, '//': '透明度',
      'visible': true, '//': '是否显示',
      'url': 'http://172.17.10.242:8080/geoserver/gwc/service/wmts/'
    },
    {
      'id': 'tiandituLayer_img',
      'title': '影像',
      // 'imgSrc': './static/deps/data/img/earth.png',
      'icon': './deps/static/deps/data/img/earth.png',
      'type': 'group',
      'attr': 'basics',
      'style': 'default',
      'layers': [
        {
          'layers': 'img',
          'matrixSet': 'c',
          'format': 'tiles',
          'tileType': 102,
          'style': 'default',
          'url': 'http://t0.tianditu.gov.cn/img_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&',
          'projection': 'EPSG:4326'
        },
        {
          'layers': 'cta',
          'matrixSet': 'c',
          'format': 'tiles',
          'tileType': 102,
          'style': 'default',
          'url': 'http://t0.tianditu.gov.cn/cta_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&',
          'projection': 'EPSG:4326'
        }
      ]
    },
    {
      'id': 'tiandituLayer_vec',
      // "imgSrc": "./static/deps/data/img/vector.png",
      'icon': './deps/static/deps/data/img/vector.png',
      'title': '矢量',
      'type': 'group',
      'layers': [
        {
          'layers': 'vec',
          'matrixSet': 'c',
          'format': 'tiles',
          'tileType': 102,
          'url': 'http://t0.tianditu.gov.cn/vec_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&&',
          'projection': 'EPSG:4326'
        },
        {
          'layers': 'cva',
          'matrixSet': 'c',
          'format': 'tiles',
          'tileType': 102,
          'url': 'http://t0.tianditu.gov.cn/cva_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&&',
          'projection': 'EPSG:4326'
        }
      ]
    },
    {
      'id': 'tiandituLayer_vec',
      // "imgSrc": "./static/deps/data/img/ter.png",
      'icon': './deps/static/deps/data/img/ter.png',
      'title': '地形',
      'type': 'group',
      'layers': [
        {
          'layers': 'ter',
          'matrixSet': 'c',
          'format': 'tiles',
          'tileType': 102,
          'url': 'http://t0.tianditu.gov.cn/ter_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&&',
          'projection': 'EPSG:4326'
        },
        {
          'layers': 'cta',
          'matrixSet': 'c',
          'format': 'tiles',
          'tileType': 102,
          'url': 'http://t0.tianditu.gov.cn/cta_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&&',
          'projection': 'EPSG:4326'
        }
      ]
    }

  ]
};
