/**
 * Created by onsinsin on 2018/7/10.
 */
define([], function () {
  /**
   *
   * @param opts
   * @param opts.containerId
   * @param opts.columnList []
   */
  var table = function (opts) {
    this.onCreate(opts);
  }
  /**
   *
   * @type {{}}
   */
  table.prototype = {
    /**
     *
     * @returns {*}
     */
    getTemplate: function (opts) {
      var template = null,
        pageSizes = opts.pageSizes || [10, 20, 30, 50];
      template = '<div id="' + opts.containerId + '" class="'+opts.class+'">\
      \<el-row>'
        +
        this.getTableTemplate(opts)
        +
        '</el-row>\
        \<el-row  type="flex" justify="end">\
        \<el-col :span="6">\
        \</el-col>\
        \<el-col :span="18">\
        \<el-pagination style="float: right" @size-change="pageSizeChange" @current-change="currentPageChange" \
        \:current-page="currentPage" :page-sizes="[' + pageSizes.join(',') + ']" :page-size="pageSize" \
        \layout="total, sizes, prev, pager, next, jumper" :total="total">\
        \</el-pagination>\
        \</el-col>\
        \</el-row>\
        \</div>';
      return template;
    },
    /**
     *
     * @param opts
     * @returns {string}
     */
    getTableTemplate: function (opts) {
      var columnList = opts.columnList;
      var template = '<el-table\
      \:data="tableData" @row-click="rowClick" @row-dblclick="rowDblclick" @sort-change="sortChange"\
      \style="width: 100%">';
      for (var i = 0; i < columnList.length; i++) {
        var column = columnList[i];
        template += ' <el-table-column prop="' + column.prop + '"';
        if (column.sortable) {
          template += ' sortable';
        }
        template += ' label="' +
          column.label + '" width="' +
          column.width + '"> </el-table-column>';
      }
      template += '</el-table>';
      return template;
    },
    onCreate: function (opts) {
      var methods = {
        updateData: function () {
          this.getData(this.pageIndex, this.pageSize, jQuery.proxy(function (data) {
            this.tableData = data;
          }, this));
        },
        //分页大小修改事件
        pageSizeChange: function (val) {
          this.pageSize = val;
          this.updateData();
        },
        //当前页修改事件
        currentPageChange: function (val) {
          this.currentPage = val;
          this.updateData();
        },
        rowClick: function (row, event, column) {
        },
        rowDblclick: function (row, event) {
        },
        sortChange: function (column, prop, order) {
        }
      };
      jQuery.extend(true, methods, opts.methods);
      this.tableObj = new Vue({
        el: '#' + opts.containerId,
        data: opts.data,
        template: opts.template || this.getTemplate(opts),
        methods: methods,
        mounted: function () {
          this.updateData();
        }
      });
    },
    destroy: function () {

    }
  }
  return table;
});