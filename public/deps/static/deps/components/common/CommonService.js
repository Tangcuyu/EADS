/**
 * Created by onsinsin on 2018/7/11.
 * 政务屏救援力量、危险源、物资与装备的查询统计公共方法
 */

/**
     *
     * @param opts
     * @constructor
     */
var commService;
commService = function(opts) {
  this.opts = opts;
  //
  this._resourceTemp = null;
  //
  this._configTemp = null;
  //
  this.seperator = '※';
  // 事件类型
  this.eventTypeList = null;
};
/**
     * 获取资源类型
     * @param callback
     * @param ctx
     */
commService.prototype.getResources = function(callback, ctx) {
  if (this._resourceTemp == null) {
    var self = this;
    var aggregate = [
      {
        '$lookup': {
          // 字典表需要加上user_safety_前缀；
          'from': 'user_safety_REL_RESOURCE_EMTYPE',
          // 主表里的关联字段
          'localField': 'tag.NODEID',
          // 字典表的关联字段
          'foreignField': 'tag.NODEID',
          // 结果信息存放属性
          'as': 'REL'
        }
      },
      {
        // 展开数组
        '$unwind': {
          path: '$REL',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        '$lookup': {
          // 字典表需要加上user_safety_前缀；
          'from': 'user_safety_JC_RESTEAMCFG',
          // 主表里的关联字段
          'localField': 'tag.NODEID',
          // 字典表的关联字段
          'foreignField': 'tag.FIRETEAMTYPECODE',
          // 结果信息存放属性
          'as': 'CFG'
        }
      },
      {
        // 展开数组
        '$unwind': {
          path: '$CFG',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          'tag': '$tag',
          'type': '$REL.tag.TYPECODE',
          'orderNum': '$REL.tag.ORDERNUM',
          'config': '$CFG.tag'
        }
      },
      {
        $sort: {
          'tag.ORDERNUM': 1
        }
      }
    ];
    var query = {};
    var data = {};
    data.dataSetId = 'RESOURCE_CATALOG';
    data.query = JSON.stringify(query);
    data.aggregate = JSON.stringify(aggregate);
    data.eId = 'safety';
    var opts = {};
    opts.url = this.opts.serverUrl + '/dataStatics/aggregate';
    opts.data = data;
    opts.type = 'get';
    opts.dataType = 'json';
    opts.success = function(data) {
      self._resourceTemp = data.data;
      callback && callback.call(ctx, null, jQuery.extend(true, [], self._resourceTemp));
    };
    opts.error = function(err) {
      callback && callback.call(ctx, new Error('服务器问题'));
    };
    return jQuery.ajax(opts);
  } else {
    callback && callback.call(ctx, null, jQuery.extend(true, [], this._resourceTemp));
    return null;
  }
};

/**
     * 获取资源配置
     * @param callback
     * @param ctx
     */
commService.prototype.getResourceConfig = function(callback, ctx) {
  if (this._configTemp == null) {
    var self = this;
    var opts = {};
    opts.url = this.opts.configUrl;
    opts.dataType = 'json';
    opts.success = function(data) {
      self._configTemp = plainConfig.call(self, data.resources);
      callback && callback.call(ctx, null, jQuery.extend(true, {}, self._configTemp));
    };
    opts.error = function(err) {
      callback && callback.call(ctx, new Error('服务器问题'));
    };
    jQuery.ajax(opts);
  } else {
    callback && callback.call(ctx, null, jQuery.extend(true, {}, this._configTemp));
  }
  //
  function plainConfig(resources) {
    var resourceSet = {};
    var seperator = this.seperator;
    for (var resourceKey in resources) {
      var resource = resources[resourceKey];
      var serviceObj = resource.service || {};
      if (resource.children && Object.keys(resource.children).length > 0) {
        for (var childKey in resource.children) {
          var resourceId = resourceKey + seperator + childKey,
            childResource = resource.children[childKey];
          var serviceObjClone = jQuery.extend(true, {}, serviceObj);
          childResource.service = jQuery.extend(true, serviceObjClone, childResource.service || {});
          childResource.id = resourceId;
          childResource.tableFields = childResource.tableFields || resource.tableFields;
          childResource.tableName = childResource.tableName || resource.tableName;
          childResource.districtField = childResource.districtField || resource.districtField;
          childResource.keyWordFields = childResource.keyWordFields || resource.keyWordFields;
          childResource.keyField = childResource.keyField || resource.keyField;
          childResource.fieldMap = childResource.fieldMap || resource.fieldMap;
          childResource.sort = childResource.sort || resource.sort;
          resourceSet[resourceId] = childResource;
        }
      } else {
        var resourceId = resourceKey;
        resource.id = resourceId;
        resourceSet[resourceId] = resource;
      }
    }
    return resourceSet;
  }
};

/**
     * 根据事件类型，获取相关联的资源类型树
     * @param eventType
     * @param cb
     * @param ctx
     */
commService.prototype.getResourceTreeByEventType = function(eventType, cb, ctx) {
  this.getResources(function(err, data) {
    var allList = [];
    var rootId = 'c_root';
    var nodeMap = {},
      matchNodeMap = {},
      filterType = !(eventType == null || eventType == '');
    //
    var index = 0;
    for (var i = 0; i < data.length; i++) {
      var item = data[i],
        tag = item.tag,
        itemId = tag.NODEID,
        tempObj = {};
      nodeMap[itemId] = tempObj;
      tempObj.id = itemId;
      tempObj.name = tag.NAME;
      tempObj.parentId = tag.PARENTID;
      tempObj.resourceTag = tag.NODEKEY || null;
      tempObj.e_orderNum = item.orderNum;
      tempObj.orderNum = tag.ORDERNUM;
      if (item.config) {
        tempObj.allCount = item.config.ALLTEAMNUM;
        tempObj.limit = [item.config.NEARBYTEAMNUM, item.config.READYTEANUM];
        // console.log(JSON.stringify(item),'  ',tempObj.limit)
      }
      if (!filterType || item.type == eventType) {
        matchNodeMap[itemId] = tempObj;
      }
      allList.push(tempObj);
    }
    //
    var resultMap = {};
    resultMap[rootId] = nodeMap[rootId];
    for (var nodeId in matchNodeMap) {
      var matchNode = matchNodeMap[nodeId];
      handleEachNode(matchNode, resultMap, matchNodeMap, nodeMap);
    }
    var newList = [];
    for (var nId in resultMap) {
      newList.push(resultMap[nId]);
    }
    // 排序
    if (eventType == null) {
      // 深度优先遍历排序
      var treeData = this.formatTree(newList, {
        pIdField: 'parentId',
        idField: 'id'
      });
      visitAndSortByDepth(treeData[0], {
        idx: 1
      }, nodeMap);
      newList.sort(function(a, b) {
        return a._order_num - b._order_num;
      });
    } else {
      newList.sort(function(a, b) {
        var aN = a.e_orderNum || 10000,
          bN = b.e_orderNum || 10000;
        return aN - bN;
      });
    }
    // console.log('>>', newList.length);
    cb && cb.call(ctx, null, newList);
  }, this);
  function handleEachNode(node, resultMap, matchMap, fullMap) {
    resultMap[node.id] = node;
    visitParent(node, fullMap, resultMap);
    visitChildren(node, fullMap, resultMap);
  }

  function visitParent(node, fullMap, resultMap) {
    var parent = fullMap[node.parentId];
    if (parent) {
      if (!node.limit && parent.limit) {
        node.limit = parent.limit;
      }
      ensureOrderNum(node, parent);
      resultMap[parent.id] = parent;
      visitParent(parent, fullMap, resultMap);
    }
  }

  function visitChildren(node, fullMap, resultMap) {
    var nodeId = node.id;
    for (var kk in fullMap) {
      var tempNode = fullMap[kk];
      if (tempNode.parentId == nodeId) {
        ensureOrderNum(tempNode, node);
        if (!tempNode.limit && node.limit) {
          tempNode.limit = node.limit;
        }
        resultMap[tempNode.id] = tempNode;
        visitChildren(tempNode.id, fullMap, resultMap);
      }
    }
  }

  function ensureOrderNum(node, parent) {
    if (isNaN(node.e_orderNum) && !isNaN(parent.e_orderNum)) {
      node.e_orderNum = parent.e_orderNum;
    }
    if (isNaN(node.orderNum) && !isNaN(parent.orderNum)) {
      node.orderNum = parent.orderNum;
    }
  }

  //
  function visitAndSortByDepth(node, obj, fullNodeSet) {
    var nodeTemp = fullNodeSet[node.id] || {};
    nodeTemp._order_num = obj.idx++;
    var children = node.children || [];
    if (children.length > 0) {
      for (var j = 0; j < children.length; j++) {
        visitAndSortByDepth(children[j], obj, fullNodeSet);
      }
    }
  }
};

/**
     * 根据类型获取资源
     * @param eventType
     * @param cb
     * @param ctx
     */
commService.prototype.getResourcesByEventType = function(eventType, cb, ctx) {
  this.getResourceConfig(function(err, resources) {
    // this.getResourceTreeByEventType(eventType, function (err, data) {
    if (err == null) {
      var resourceNodeMap = {};
      var regex = /^(.*)\_([^\_]*)$/;
      for (var i = 0; i < data.length; i++) {
        var item = data[i],
          resourceTag = item.resourceTag;
        if (resourceTag) {
          if (regex.test(resourceTag)) {
            var groups = regex.exec(resourceTag);
            resourceTag = groups[1] + this.seperator + groups[2];
          }
          var resource = resources[resourceTag];
          if (resource && item.limit) {
            resource.limit = item.limit;
          }
          if (resource) {
            resource._order_num = item._order_num;
          }
          resourceNodeMap[resourceTag] = resource;
        }
      }
      cb.call(ctx, null, resourceNodeMap);
    } else {
      cb.call(ctx, err);
    }
    // }, this);
  }, this);
};

/**
     * 获取事件类型
     * @param cb
     * @param ctx
     */
commService.prototype.getEventType = function(cb, ctx) {
  if (this.eventTypeList == null) {
    var self = this;
    jQuery.ajax({
      url: this.opts.serverUrl + '/dataOperate/queryMulti',
      dataType: 'json',
      data: {
        eId: 'safety',
        data: JSON.stringify({
          'CODE_EMERGENCY_CLASS': {
            'query': {},
            'sort': '_id'
          }
        })
      },
      success: function(data) {
        var data = data.data;
        var list = data[Object.keys(data)[0]];
        self.eventTypeList = list;
        cb && cb.call(ctx, null, list);
      },
      error: function(err) {
        cb && cb.call(ctx, err);
      }
    });
  } else {
    cb && cb.call(ctx, null, jQuery.extend(true, [], this.eventTypeList));
  }
};

/**
     * 获取事件类型信息
     * @param eventType
     * @param cb
     * @param ctx
     */
commService.prototype.getEventData = function(eventType, cb, ctx) {
  this.getEventType(function(err, data) {
    var obj = null;
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      if (item && item.tag.TYPECODE === eventType) {
        obj = item;
        break;
      }
    }
    cb && cb.call(ctx, null, obj);
  }, this);
};

/**
     * 格式化为树形式
     * @param nodes {Array} 节点数组
     * @param opts {Object}
     * @param opts.idField {String} id字段名
     * @param opts.pIdField {String} pId字段名
     */
commService.prototype.formatTree = function(nodes, opts) {
  if (!(nodes && opts && opts.idField &&
        opts.pIdField)) {
    return null;
  }
  var nodeList = jQuery.extend(true, [], nodes || []),
    idField = opts.idField,
    pIdField = opts.pIdField;
  //
  var nodeMap = {};
  for (var i = 0; i < nodeList.length; i++) {
    var node = nodeList[i];
    var temp = {};
    temp.id = node[idField];
    temp.pId = node[pIdField];
    temp.orig = node;
    nodeMap[temp.id] = temp;
  }
  //
  var treeData = [];
  var visitMap = {};
  for (var k in nodeMap) {
    var node = nodeMap[k];
    if (visitMap.hasOwnProperty(k)) {
      continue;
    }
    visitNode(node, nodeMap, visitMap, treeData);
  }
  return treeData;
  function visitNode(node, nodeMap, visitMap, treeData) {
    if (nodeMap.hasOwnProperty(node.pId)) {
      var parentNode = nodeMap[node.pId];
      if (!visitMap.hasOwnProperty(parentNode.id)) {
        arguments.callee(parentNode, nodeMap, visitMap, treeData);
      }
      var treeNode = visitMap[parentNode.id];
      var children = treeNode.children || [];
      children.push(node.orig);
      treeNode.children = children;
      visitMap[node.id] = node.orig;
    } else {// is root
      treeData.push(node.orig);
      visitMap[node.id] = node.orig;
    }
  }
};

/**
     * 统计资源
     * @param resourceKeys 资源
     * @param filter 过滤条件
     * @param filter.districtCode
     * @param filter.keyword
     * @param callback
     * @param ctx
     */
commService.prototype.getStatistics = function(resourceKeys, filter, callback, ctx) {
  this.getFilterResources(null, resourceKeys, function(err, resources) {
    var aggregateList = [];
    for (var resourceKey in resources) {
      var resource = resources[resourceKey];
      if (resource) {
        var aggregateObj = this.getStatisticsAggregate(resources[resourceKey], filter);
        aggregateList.push(aggregateObj);
      }
    }
    this.statisticsMulti(aggregateList, function(err, data) {
      var resultList = [];
      var total = 0;
      var resourceList = [];
      for (var k in resources) {
        var r = resources[k];
        resourceList.push(r);
      }
      // 排序
      resourceList.sort(function(a, b) {
        return a._order_num - b._order_num;
      });
      for (var i = 0; i < resourceList.length; i++) {
        var resource = resourceList[i] || {},
          rk = resource.id;
        var count = (isNaN(data[rk]) || isNaN(parseInt(data[rk]))) ? 0 : parseInt(data[rk]);
        total += count;
        var title = resource.title;
        resultList.push({
          codeKey: rk,
          tabTitle: title,
          tabNumber: count
        });
      }
      // for (var k in resources) {
      //   var count = (isNaN(data[k]) || isNaN(parseInt(data[k]))) ? 0 : parseInt(data[k]);
      //   total += count;
      //   if (k) {
      //     var title = resources[k].title;
      //     resultList.push({
      //       codeKey: k,
      //       tabTitle: title,
      //       tabNumber: count
      //     });
      //   }
      // }
      callback && callback.call(ctx, null, {
        total: total,
        list: resultList
      });
    }, this);
  }, this);
};

/**
     *  拼接统计管道
     * @param resource
     * @param opts
     */
commService.prototype.getStatisticsAggregate = function(resource, opts) {
  var aggregateObj = {},
    resourceId = resource.id,
    tableName = resource.tableName,
    serviceObj = resource.service;
  opts = opts || {};
  var aggregate = [];
  // 行政区划过滤
  var districtMatch = this.getDistrictMatch(opts.districtCode, resource);
  if (districtMatch) {
    aggregate.push(districtMatch);
  }
  if (serviceObj.queryParams) {
    var query = serviceObj.queryParams[tableName].query || {};
    aggregate.push({
      $match: query
    });
  }
  aggregate.push({
    $count: '_count'
  });
  aggregateObj.aggregate = aggregate;
  aggregateObj.query = {};
  aggregateObj.searchId = resourceId;
  aggregateObj.dataSetId = tableName;
  aggregateObj.queryIndex = 1;
  return aggregateObj;
};

/**
     * 查询列表数据
     * @param opts
     * @param opts.resourceKey，多个逗号分隔
     * @param opts.pageSize
     * @param opts.pageIndex
     * @param opts.districtCode 政区过滤编码
     * @param opts.keyword 关键字-预留参数
     * @param opts.flatTag 是否平铺tag属性
     * @param callback
     * @param ctx
     */
commService.prototype.getDataList = function(opts, callback, ctx) {
  this.getResourceConfig(function(err, resources) {
    if (err == null) {
      var resourceList = [],
        resourceKey = opts.resourceKey,
        resourceKeyList = resourceKey.split(',');
      var aggregateList = [];
      for (var i = 0; i < resourceKeyList.length; i++) {
        var resource = resources[resourceKeyList[i]];
        if (resource) {
          var aggregateObj = this.getAllListAggregate(resource, {
            pageSize: opts.pageSize,
            pageIndex: opts.pageIndex,
            flatTag: opts.flatTag,
            districtCode: opts.districtCode,
            keyword: opts.keyword
          });
          aggregateList.push(aggregateObj);
        }
      }
      this.aggregateMulti(aggregateList, function(err, data) {
        if (err == null) {
          var resultSet = {};
          for (var k in data) {
            try {
              var itemData = data[k];
              resultSet[k] = itemData[Object.keys(itemData)[0]];
            } catch (e) {
            }
          }
          callback.call(ctx, null, resultSet);
        } else {
          callback.call(ctx, err);
        }
      }, this);

    } else {
      callback.call(ctx, err);
    }
  }, this);
};

/**
     * 拼接查询管道
     * @param resource
     * @param opts
     */
commService.prototype.getAllListAggregate = function(resource, opts) {
  var aggregateObj = {},
    resourceId = resource.id,
    tableName = resource.tableName,
    serviceObj = resource.service,
    pageSize = opts.pageSize,
    pageIndex = opts.pageIndex,
    flatTag = !!opts.flatTag,
    skipVal = null,
    limitVal = null;
  if (pageSize !== null && pageSize !== '' && pageIndex !== null && pageIndex !== '') {
    pageSize = parseInt(pageSize);
    pageIndex = parseInt(pageIndex);
    skipVal = pageSize * pageIndex;
    limitVal = pageSize * (1 + pageIndex);
  } else {
    // todo 暂时最多查询
    limitVal = 50 * 1000;
  }
  var aggregate = [];
  // 灾情信息员
  if (resource.id === 'JC_DISINFOPER※01' ||
        resource.id === 'BAS_SCHOOL※01' || resource.id === 'BAS_SHELTER※01') {
    aggregate.push({
      $limit: 10000
    });
  }
  // 行政区划过滤
  var districtMatch = this.getDistrictMatch(opts.districtCode, resource);
  if (districtMatch) {
    aggregate.push(districtMatch);
  }
  // 关键字过滤
  var kwMatch = this.getSearchMatch(opts.keyword, resource);
  if (kwMatch) {
    aggregate.push(kwMatch);
  }
  if (serviceObj.queryParams) {
    var query = serviceObj.queryParams[tableName].query || {};
    aggregate.push({
      $match: query
    });
  }
  var fieldMap = resource.fieldMap,
    project = {},
    projectSuffix = flatTag ? '' : 'tag.';
  for (var field in fieldMap) {
    if (Object.prototype.toString.call(fieldMap[field]) == '[object Object]') {
      var lookUpObj = fieldMap[field],
        lookupAlias = field + '_rel';
      lookUpObj.as = lookupAlias;
      aggregate.push({
        $lookup: lookUpObj
      });
      aggregate.push({
        $unwind: {
          'path': '$' + lookupAlias,
          'preserveNullAndEmptyArrays': true
        }
      });
      project[projectSuffix + field] = '$' + lookupAlias + '.tag.' + field;
    } else {
      project[projectSuffix + fieldMap[field]] = '$tag.' + field;
    }
  }
  project['geom'] = '$geom';
  aggregate.push({
    $project: project
  });
  if (resource.sort) {
    aggregate.push({
      $sort: resource.sort
    });
  }
  if (!isNaN(skipVal) && skipVal != null) {
    aggregate.push({
      $skip: skipVal
    });
  }
  if (!isNaN(limitVal) && limitVal != null) {
    aggregate.push({
      $limit: limitVal
    });
  }
  aggregateObj.aggregate = aggregate;
  aggregateObj.query = {};
  aggregateObj.searchId = resourceId;
  aggregateObj.dataSetId = tableName;
  aggregateObj.queryIndex = 1;
  return aggregateObj;
};

/**
     * 拼接行政区划条件
     * @param districtCode
     * @param resource
     * @param resource.districtField 行政区划字段名
     * @param resource.districtKey 可选，默认为空
     */
commService.prototype.getDistrictMatch = function(districtCode, resource) {
  var match = null;
  if (districtCode && districtCode !== '000000' && resource.districtField) {
    var districtCodes = districtCode.split(','),
      districtField = resource.districtField;
    var or = [],
      districtKey = null;
    if (resource.districtKey) {
      districtKey = resource.districtKey;
    } else {
      districtKey = 'tag.' + districtField;
    }
    for (var i = 0; i < districtCodes.length; i++) {
      var districtCode = districtCodes[i];
      if (districtCode) {
        var eachFilter = {};
        eachFilter[districtKey] = {
          $regex: getDistrictRegex(districtCode)
        };
        or.push(eachFilter);
      }
    }
    match = {
      $match: {
        $or: or
      }
    };
  } else {
    console.debug('ignore district filter');
  }
  return match;
  function getDistrictRegex(code) {
    var c = code.substr(0, 6);
    if (c == '000000') {// 全国不过滤
      c = '.*';
    } else if (/^\d{2}0000$/.test(c)) {
      c = c.substr(0, 2) + '.*';
    } else if (/^\d{4}00$/.test(c)) {
      c = c.substr(0, 4) + '.*';
    }
    return '^' + c + '$';
  }
};

/**
     * 根据政区等获取数据id--暂时用于物资/储备库、战勤基地/装备的过滤
     * @param opts
     * @param opts.districtCode
     * @param opts.tables
     * @param opts.tables[n].tableName
     * @param opts.tables[n].districtField 行政区划字段名
     * @param callback
     * @param ctx
     * @private
     */
commService.prototype.getRecordIdListByFilter = function(opts, callback, ctx) {
  opts = opts || {};
  var tables = opts.tables || [],
    tableCount = tables.length,
    districtCode = opts.districtCode;
  var aggregateList = [];
  for (var i = 0; i < tableCount; i++) {
    var tableObj = tables[i];
    var aggregateObj = {},
      aggregate = [];
    var districtMatch = this.getDistrictMatch(districtCode, tableObj);
    if (districtMatch) {
      aggregate.push(districtMatch);
    }
    aggregate.push({
      $project: {
        '_id': '$_id'
      }
    });
    aggregateObj.aggregate = aggregate;
    aggregateObj.query = {};
    aggregateObj.searchId = i;
    aggregateObj.dataSetId = tableObj.tableName;
    aggregateList.push(aggregateObj);
  }
  if (aggregateList.length == 0) {
    callback.call(ctx, null, []);
  } else {
    this.aggregateMulti(aggregateList, function(err, data) {
      var resultList = [];
      for (var i = 0; i < tableCount; i++) {
        var itemResult = data[i] || {},
          itemList = itemResult[Object.keys(itemResult)[0]];
        var idList = [];
        for (var j = 0; j < itemList.length; j++) {
          idList.push(itemList[j]._id);
        }
        resultList.push({
          tableName: tables[i].tableName,
          idList: idList
        });
      }
      callback.call(ctx, null, resultList);
    }, this);
  }
};

/**
     * 拼接关键字条件--预留方法
     * @param kw
     * @param resource
     */
commService.prototype.getSearchMatch = function(kw, resource) {

};

/**
     * 多个管道执行方法-公共
     * @param aggregateList 管道列表
     * @param cb
     * @param ctx
     * @returns {*}
     */
commService.prototype.aggregateMulti = function(aggregateList, cb, ctx) {
  var opts = {},
    data = {};
  opts.url = this.opts.serverUrl + '/dataStatics/aggregateMulti';
  opts.dataType = 'json';
  opts.type = 'POST';
  data.data = JSON.stringify(aggregateList);
  data.eId = 'safety';
  opts.data = data;
  opts.success = function(d) {
    cb && cb.call(ctx, null, d.data);
  };
  opts.error = function(err) {
    cb && cb.call(ctx, new Error(err));
  };
  return jQuery.ajax(opts);
};
/**
     * 多个管道统计
     * @param aggregateList
     * @param cb
     * @param ctx
     */
commService.prototype.statisticsMulti = function(aggregateList, cb, ctx) {
  this.aggregateMulti(aggregateList, function(err, data) {
    for (var k in data) {
      var item = data[k],
        itemData = item[Object.keys(item)[0]];
      if (itemData.length == 0) {
        data[k] = 0;
      } else {
        data[k] = itemData[0]._count;
      }
    }
    cb && cb.call(ctx, null, data);
  }, this);
};

/**
     * 周边列表查询
     * @param opts
     * @param opts.eventType 事件类型
     * @param opts.resourceKeys 资源key值
     * @param opts.config
     * @param opts.config.limit {Array/Number} 可选 返回记录的限制数 数组或者数字，数组形式对应救援力量的[就近数，增援数]
     * @param opts.config.radius {Number} 可选 查询半径
     * @param opts.config.idList {Array} 可选 id数组，用于过滤
     * @param opts.flatTag
     * @param callback
     * @param ctx
     */
commService.prototype.getNearbyList = function(opts, callback, ctx) {
  var eventType = opts.eventType,
    config = opts.config || {};
  this.getFilterResources(eventType, opts.resourceKeys, function(err, resources) {
    if (err == null) {
      var aggregateList = [];
      for (var resourceKey in resources) {
        var resourceObj = resources[resourceKey],
          thisConfig = config[resourceKey] || {};
        var aggregateObj = this.getNearbyAggregate(resourceObj, {
          limit: thisConfig.limit || resourceObj.limit,
          buffer: opts.buffer,
          radius: thisConfig.radius,
          point: opts.point,
          flatTag: !!opts.flatTag,
          Keyword: opts.Keyword,
          districtCode: opts.districtCode
        });
        aggregateList.push(aggregateObj);
      }
      this.aggregateMulti(aggregateList, function(err, data) {
        if (err == null) {
          var resultSet = {},
            resultArr = [],
            total = 0;
          for (var rk in data) {
            var itemObj = data[rk],
              itemList = itemObj[Object.keys(itemObj)[0]] || [],
              itemConfig = config[rk] || {},
              limit = itemConfig.limit || resourceObj.limit;
            total += itemList.length;
            // var listArr = [];
            // listArr.push(itemList.slice(0, limit[0]));
            // listArr.push(itemList.slice(limit[0]));
            var resultObj = {};
            resultObj.data = itemList;
            resultObj.codeKey = rk;
            resultObj.tabTitle = resources[rk].title;
            resultObj.limit = limit;
            resultObj.radius = itemConfig.radius;
            resultObj.tabNumber = itemList.length;
            resultArr.push(resultObj);
          }
          resultSet.list = resultArr;
          resultSet.total = total;
          callback.call(ctx, null, resultSet);
        } else {
          callback.call(ctx, err);
        }

      }, this);
    } else {
      callback.call(ctx, err);
    }
  }, this);
};

/**
     * 拼接周边查询管道
     * @param resource
     * @param opts
     * @param opts.point 中心点
     * @param opts.radius 缓冲半径
     * @param opts.limit {Array[2]}
     * @param opts.idList Id过滤数组
     * @param opts.flatTag
     */
commService.prototype.getNearbyAggregate = function(resource, opts) {
  var aggregateObj = {},
    resourceId = resource.id,
    tableName = resource.tableName,
    flatTag = !!opts.flatTag,
    serviceObj = resource.service;
  var aggregate = [];
  // geonear
  var geoNear = {};
  geoNear.limit = 1000 * 1000;
  geoNear.maxDistance = opts.radius ? parseFloat(opts.radius) : 5000 * 1000;
  geoNear.spherical = true;
  geoNear.near = {
    type: 'Point',
    coordinates: opts.point
  };
  geoNear.includeLocs = 'geom';
  geoNear.distanceField = 'dis';
  aggregate.push({
    $geoNear: geoNear
  });
  // geometry 过滤
  if (opts.buffer) {
    aggregate.push({
      $match: {
        'geom': {
          '$geoIntersects': {
            '$geometry': opts.buffer
          }
        }
      }
    });
  }
  if (opts.Keyword) {// 关键字过滤
    var query = {};
    var filter = {};
    filter['$regex'] = '^.*' + opts.Keyword + '.*$';
    query[resource.keyWordFields] = filter;
    aggregate.push({
      $match: query
    });
  }
  // 行政区划过滤
  var districtMatch = this.getDistrictMatch(opts.districtCode, resource);
  if (districtMatch) {
    aggregate.push(districtMatch);
  }
  if (serviceObj.queryParams) {
    var query = serviceObj.queryParams[tableName].query || {};
    aggregate.push({
      $match: query
    });
  }
  var project = this.parseProject(aggregate, resource.fieldMap, flatTag);
  project['geom'] = '$geom';
  project['dis'] = '$dis';
  aggregate.push({
    $project: project
  });
  if (Object.prototype.toString.call(opts.limit) == '[object Array]' && opts.limit.length == 2) {
    aggregate.push({
      $limit: opts.limit[0] + opts.limit[1]
    });
  } else if (!isNaN(opts.limit)) {
    aggregate.push({
      $limit: parseInt(opts.limit)
    });
  }
  aggregateObj.aggregate = aggregate;
  aggregateObj.query = {};
  aggregateObj.searchId = resourceId;
  aggregateObj.dataSetId = tableName;
  aggregateObj.queryIndex = 1;
  return aggregateObj;
};

/**
     * 过滤获取列表
     * @param queryResources
     * @param queryResources[key].idList {Array}
     * @param queryResources[key].districtCode 行政区划编码，多个逗号分隔
     * @param callback
     * @param ctx
     */
commService.prototype.getListByFilter = function(queryResources, callback, ctx) {
  var resourceKeys = Object.keys(queryResources || {});
  this.getFilterResources(null, resourceKeys, function(err, resources) {
    var aggregateList = [];
    for (var rk in queryResources) {
      var resource = resources[rk],
        qResource = queryResources[rk];
      var aggregateObj = this.getListByFilterAggregate(resource, {
        idList: qResource.idList,
        flatTag: false,
        districtCode: qResource.districtCode
      });
      aggregateList.push(aggregateObj);
    }
    this.aggregateMulti(aggregateList, function(err, resultSet) {
      var resultList = [];
      for (var resultKey in resultSet) {
        var resultObj = resultSet[resultKey] || {},
          tempObj = {};
        tempObj.codeKey = resultKey;
        tempObj.data = resultObj[Object.keys(resultObj)[0]];
        tempObj.tabTitle = resources[resultKey].title;
        tempObj.tabNumber = tempObj.data.length;
        resultList.push(tempObj);
      }
      callback.call(ctx, null, resultList);
    }, this);
  }, this);
};

/**
     *
     * @param resource
     * @param opts
     * @param opts.idList
     * @param opts.flatTag
     * @returns {{}}
     */
commService.prototype.getListByFilterAggregate = function(resource, opts) {
  var aggregateObj = {},
    resourceId = resource.id,
    tableName = resource.tableName,
    flatTag = !!opts.flatTag,
    serviceObj = resource.service;
  var aggregate = [];
  // 传递的id
  if (opts.idList && opts.idList.length > 0) {
    aggregate.push({
      $match: {
        _id: {
          $in: opts.idList
        }
      }
    });
  }
  // 行政区划过滤
  var districtMatch = this.getDistrictMatch(opts.districtCode, resource);
  if (districtMatch) {
    aggregate.push(districtMatch);
  }
  if (serviceObj.queryParams) {
    var query = serviceObj.queryParams[tableName].query || {};
    aggregate.push({
      $match: query
    });
  }
  var project = this.parseProject(aggregate, resource.fieldMap, flatTag);
  project['geom'] = '$geom';
  project['dis'] = '$dis';
  aggregate.push({
    $project: project
  });
  aggregateObj.aggregate = aggregate;
  aggregateObj.query = {};
  aggregateObj.searchId = resourceId;
  aggregateObj.dataSetId = tableName;
  return aggregateObj;
};

/**
     *  获取指定事件类型关联的资源
     * @param eventType 事件类型
     * @param resourceKeys {Array} 匹配的资源key
     * @param callback
     * @param ctx
     * @private
     */
commService.prototype.getFilterResources = function(eventType, resourceKeys, callback, ctx) {
  // this.getResourcesByEventType(eventType, function (err, resources) {
  //   var resourceKeyMatches = resourceKeys,
  //     matchLength = resourceKeyMatches.length,
  //     resourceMap = {};
  //   for (var resourceKey in resources) {
  //     var flag = false;
  //     for (var j = 0; j < matchLength; j++) {
  //       if (resourceKey.indexOf(resourceKeyMatches[j]) == 0) {
  //         flag = true;
  //         break;
  //       }
  //     }
  //     if (flag) {
  //       resourceMap[resourceKey] = resources[resourceKey];
  //     }
  //   }
  //   callback.call(ctx, null, resourceMap);
  // }, this);
  this.getResourceConfig(function(err, resources) {
    if (err == null) {
      var resourceNodeMap = {};
      for (var i = 0; i < resourceKeys.length; i++) {
        var resourceTag = resourceKeys[i];
        if (resourceTag) {
          var resource = resources[resourceTag];

          resourceNodeMap[resourceTag] = resource;
        }
      }
      callback.call(ctx, null, resourceNodeMap);
    } else {
      callback.call(ctx, err);
    }
  }, this);
};

/**
     * 拼接project
     * @param aggregate
     * @param fieldMap
     * @param flatTag
     * @returns {{}}
     */
commService.prototype.parseProject = function(aggregate, fieldMap, flatTag) {
  var project = {},
    projectSuffix = flatTag ? '' : 'tag.';
  for (var field in fieldMap) {
    if (Object.prototype.toString.call(fieldMap[field]) == '[object Object]') {
      var lookUpObj = fieldMap[field],
        lookupAlias = field + '_rel';
      lookUpObj.as = lookupAlias;
      aggregate.push({
        $lookup: lookUpObj
      });
      aggregate.push({
        $unwind: {
          'path': '$' + lookupAlias,
          'preserveNullAndEmptyArrays': true
        }
      });
      project[projectSuffix + field] = '$' + lookupAlias + '.tag.' + field;
    } else {
      project[projectSuffix + fieldMap[field]] = '$tag.' + field;
    }
  }
  return project;
};

/**
     * 单例
     * @type {{}}
     */
var holder = {};
holder.getInstance = function(opts) {
  if (holder.instance == null) {
    holder.instance = new commService(opts);
  }
  return holder.instance;
};

window.G.common.CommonService =holder;
