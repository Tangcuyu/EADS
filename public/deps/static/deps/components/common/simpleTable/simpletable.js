/**
 * Created by onsinsin on 2018/7/11.
 */

/**
 *
 * @param opts
 * @param opts.containerId {String} 容器id
 * @param opts.fields {Array}
 * @param opts.isPaging {Boolean} 是否分页
 * @param opts.pageSize
 * @param opts.pageIndex
 * @param opts.total
 * @param opts.pageChangeCallback 分页变化的回调
 * @param opts.rowClickCallback 行点击回调
 * @param opts.suffixClickCallback 单元格后缀点击事件
 * @param opts.btnColClickCallback 操作按钮
 * @param opts.callbackContext
 */
var simpleTable;
simpleTable = function(opts) {
  var options = {
    isPaging: true,
    pageIndex: 0,
    pageSize: 6
  };
  this.opts = jQuery.extend(true, options, opts);
  var tableContainer = jQuery('#' + opts.containerId);
  //
  var tableHtml = this._createTableStr();
  if (opts.total < 1) {
    tableContainer.append('<span style="color: #fff;position: absolute;top: 45%;left: 45%;font-size: 24px;">暂无数据</span>');
    return;
  }
  tableContainer.append(tableHtml);
  if (opts.isPaging) {
    var self = this;
    // 分页
    var pageDomId = opts.containerId + '_page_container';
    this.pagination = new gisPagination({
      el: '#' + pageDomId,
      data: {
        currentPage: opts.pageIndex,
        pageSize: opts.pageSize,
        simple: true,
        showTotal: true,
        total: opts.total,
        clickCallback: function(obj) {
          var currentPage = obj.currentPage - 1;
          self.opts.pageIndex = currentPage;
          self.getData();
        }
      }
    });
    //
    jQuery('#' + pageDomId).find('.gis-pagination').attr('id', pageDomId + '_page');
  }
  //
  this._bindEvents();
  //
  this.getData();
};
/**
   * 创建表dom
   * @param tableObj
   * @returns {string}
   */
simpleTable.prototype._createTableStr = function() {
  var fields = this.opts.fields,
    colCount = fields.length;
  var html = '<div class="pt-table-box opt-scroll gis-table"><table class="pt-table pt-table-hover">';
  // 表头
  var theadStr = '<thead><tr>';
  for (var i = 0; i < colCount; i++) {
    var field = fields[i];
    if (field.class) {
      theadStr += '<th width="' + field.width + '" class="' + field.class + '">';
    } else {
      theadStr += '<th width="' + field.width + '">';
    }

    theadStr += field.label;
    theadStr += '</th>';
  }
  html += theadStr;
  html += '</table></div>';
  //
  html += '<div id="' + this.opts.containerId + '_page_container" ></div>';
  return html;
};

/**
   * 创建记录dom
   * @param tableObj
   * @param dataList
   * @returns {string}
   */
simpleTable.prototype._createTableContent = function(dataList) {
  var fields = this.opts.fields,
    rows = dataList,
    colCount = fields.length,
    rowCount = rows.length;

  var bodyStr = '<tbody>';
  var numStart = this.opts.pageIndex * this.opts.pageSize;
  for (var i = 0; i < rowCount; i++) {
    var itemData = rows[i];
    bodyStr += '<tr ';
    bodyStr += ' data-id="' + itemData.id + '" >';
    for (var j = 0; j < colCount; j++) {
      var field = fields[j],
        value = itemData[field.name];
      if (field.name == '$num') {// 编号列
        value = i + 1 + numStart;
      } else {
        if (field.type == 'Number') {
          if (value == null || value == '' || isNaN(value)) {
            value = '';
          } else {
            value = parseFloat(value);
          }
        } else {
          value = value || '';
        }
      }

      if (field.class) {
        bodyStr += '<td data-field="' + field.name + '"  class="' + field.class + '"><span class="text-nowrap" title="' + value + '">';
      } else {
        bodyStr += '<td data-field="' + field.name + '"><span class="text-nowrap" title="' + value + '">';
      }

      bodyStr += value + (field.unit || '');
      if (field.name.indexOf('$btn') == 0) {// 按钮列
        bodyStr += '<span data-type="btn">' + field.template + '</span>';
      } else {
        // 图标
        if (value != null && value != '' && field.suffix) {
          var regex = new RegExp('\{\{PHONE\}\}');
          field.suffix = field.suffix.replace(regex, itemData[field.name]);
          bodyStr += '<span data-type="suffix">' + field.suffix + '</span>';

        }
      }
      bodyStr += '</span></td>';
    }
    bodyStr += '</tr>';
  }
  bodyStr += '</tbody>';
  return bodyStr;
};
/**
   *
   */
simpleTable.prototype.getData = function() {
  var pageIndex = this.opts.pageIndex,
    pageSize = this.opts.pageSize;
  var cb = jQuery.proxy(function(data) {
    this._updateContent(data);
  }, this);
  this.opts.pageChangeCallback &&
    this.opts.pageChangeCallback.call(
      this.opts.callbackContext, pageIndex, pageSize, cb);
};

/**
   *清空表格
   */
simpleTable.prototype.clearContent = function() {
  var tableContainer = jQuery('#' + this.opts.containerId),
    tableDom = tableContainer.find('table');
  tableDom.find('tbody').remove();
};
/**
   * 更新数据
   */
simpleTable.prototype._updateContent = function(dataList) {
  var tableContainer = jQuery('#' + this.opts.containerId),
    tableDom = tableContainer.find('table');
  this.clearContent();
  var tableContent = this._createTableContent(dataList);
  tableDom.append(tableContent);
  $('.allphone').on('click', function(e) {
    G.interfaces.callphone($(this).parent().parent()[0].innerText);
  });
  //
  this.currentList = dataList;
};

/**
   *
   * @param tableObj
   */
simpleTable.prototype._bindEvents = function() {
  var self = this;
  var tableContainer = jQuery('#' + this.opts.containerId);
  // 行点击事件
  tableContainer.off('click');
  tableContainer.on('click', 'tr', function(event) {
    var index = jQuery(this).index();
    var data = self.currentList[index];
    self.opts.rowClickCallback && self.opts.rowClickCallback.call(self.opts.callbackContext, data, index + 1);
  });
  // 按钮列点击
  tableContainer.on('click', 'span[data-type=btn]', function(event) {
    var index = jQuery(this).parents('tr').index();
    var field = jQuery(this).parents('td').attr('data-field');
    var data = self.currentList[index];
    self.opts.btnColClickCallback &&
        self.opts.btnColClickCallback.call(self.opts.callbackContext, field, data, event);
    event.stopPropagation();
  });
  // 图标点击事件
  tableContainer.on('click', 'span[data-type=suffix]', function(event) {
    var index = jQuery(this).parents('tr').index();
    var field = jQuery(this).parents('td').attr('data-field');
    var data = self.currentList[index];
    self.opts.suffixClickCallback &&
        self.opts.suffixClickCallback.call(self.opts.callbackContext, field, data);
    event.stopPropagation();
  });
};
/**
   *
   */
simpleTable.prototype.destroy = function() {
  var tableContainer = jQuery('#' + this.opts.containerId);
  tableContainer.empty();
  //  this.opts=null;
  //  this.currentList=null;
  var tableContainer = jQuery('#' + this.opts.containerId);
  tableContainer.unbind('click');
};
window.G.common.simpleTable = simpleTable;
