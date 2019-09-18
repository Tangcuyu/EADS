/**
 * Created by zhj on 2017/6/22.
 */
let gisPagination;
gisPagination = function(ops) {

  var hasEl = $('body').find(ops.el).length;
  var elName = ops.el.substr(1);
  if (!hasEl) {
    $('body').append('<div id="' + elName + '"></div>');
  }

  this.el = ops.el;
  this.$el = $(ops.el);
  this.data = ops.data;
  this.simple = ops.data.simple || true;
  this.pageSize = ops.data.pageSize || 5;
  this.showTotal = ops.data.showTotal || true;
  this.total = ops.data.total || 0;
  this.clickCallback = ops.data.clickCallback || null;

  var currentPage = ops.data.currentPage || 1;
  Object.defineProperty(this, 'currentPage', {
    get: function() {
      return currentPage;
    },
    set: function(val) {
      currentPage = val;
      this.createPage();
      if (this.clickCallback) {
        this.clickCallback(this);
      }
    }
  });

  this.createPage();

};

gisPagination.prototype.createPage = function() {

  this.$el.find('.gis-pagination').remove();

  var tpl = '', startPage, endPage, maxPage, i, prevClass, nextClass;

  //  创建DOM结构
  tpl += '<div class="gis-pagination">';
  maxPage = Math.ceil(this.data.total / this.data.pageSize);
  prevClass = 'gis-pagination__prev';
  nextClass = 'gis-pagination__next';

  // 增加prev、next按钮的disabled效果；
  if (this.currentPage == 1) {
    prevClass += ' gis-pagination-disabled';
  }
  if (this.currentPage == maxPage) {
    nextClass += ' gis-pagination-disabled';
  }

  // 是否显示总条数
  if (this.showTotal) {
    tpl += '<div class="gis-pagination__total">共<span>' + this.total + '</span>条</div>';
  }

  tpl += '<ul class="gis-pagination__box">\
                        <li class="' + prevClass + '">\
                            <a class="iconMap-pullWest"></a>\
                        </li>';

  // 简单分页模式 --默认

  if (this.simple == true) {

    startPage = (this.currentPage - 2) <= 0 ? 1 : (this.currentPage - 2);
    endPage = (startPage + 4) <= maxPage ? (startPage + 4) : maxPage;

    // 防止末尾缺页
    if (endPage - startPage < 4) {
      startPage = (startPage - (4 - (endPage - startPage))) <= 0 ? 1 : (startPage - (4 - (endPage - startPage)));
    }

    for (i = startPage; i <= endPage; i++) {
      if (i == this.currentPage) {
        tpl += '<li class="gis-pagination__number gis-pagination-active"><a>' + i + '</a></li>';
      } else {
        tpl += '<li class="gis-pagination__number"><a>' + i + '</a></li>';
      }

    }
  }

  // 复杂模式

  tpl += '<li class="' + nextClass + '">\
                        <a class="iconMap-pullRight"></a>\
                    </li>';
  tpl += '</ul>';

  this.$el.append(tpl);

  // 事件绑定
  var self = this;
  this.$el.find('.gis-pagination__prev').on('click', function() {
    self.currentPage = Math.max(1, (self.currentPage - 1));
  });
  this.$el.find('.gis-pagination__next').on('click', function() {
    self.currentPage = Math.min((self.currentPage + 1), maxPage);
  });
  this.$el.find('.gis-pagination__number').on('click', function() {
    self.currentPage = parseInt($(this).text());
  });

};
if (window.G.common == undefined) {
  window.G.common = {};
};
window.G.common.gisPagination = gisPagination;
