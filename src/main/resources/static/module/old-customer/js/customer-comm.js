/**
 *
 */
var CustomerComm = CustomerComm || {};

CustomerComm.visit = {
    staffsData: {},

    init: function (ele, btn, objName) {
        this.ele = ele;
        this.btn = btn;
        /*this.staffsData[objName + ''].ids = [];
         this.staffsData[objName + ''].selectId = [];
         this.staffsData[objName + ''].userIds = [];*/
        this.createPopupHtml();
        this.initPager();
        this.initListHtml();
        this.handleOpenPopup();
        this.handleClosePopup();
        //this.handlePullToRefresh();
        this.handleInfinite();
    },

    // 打开Popup
    handleOpenPopup: function () {
        var self = this;
        $(this.btn).click(function () {
            var win_h = $(window).height();
            $(document.body).addClass('page-unScroll');
            //$(self.ele).find('.weui-panel_access').css('height', win_h - 140).addClass('page-scroll');
            $(self.ele).find('.weui-popup__container').popup();
        });
    },

    // 关闭Popup
    handleClosePopup: function () {
        $(this.ele).find('.btn-su').click(function () {
            $(document.body).removeClass('page-unScroll');
            $.closePopup();
        });
    },

    // 下拉刷新
    handlePullToRefresh: function () {
        $(this.ele).find('.popupWarp').pullToRefresh().on('pull-to-refresh', function (done) {
            var self = this;
            setTimeout(function () {
                $(self).pullToRefreshDone();
            }, 2000);
        });
    },

    // 滚动加载
    handleInfinite: function () {
        var self = this;
        $(self.ele_pager).infinite().on("infinite", function () {
            if (this.loading) return;
            this.loading = true;
            self.initListHtml();
        });
    },

    initPager: function () {
        this.ele_pager = $(this.ele).find('.weui-popup__modal');
        this.ele_pager[0].loading = false; // 滚动加载，状态标记
        this.ele_pager[0].lastPage = false;
        this.ele_pager[0].pageCount = 0;
        this.ele_pager[0].page = 1;
        this.ele_pager[0].rows = 9;
    },

    initListHtml: function () {
        var self = this;
        this.getStaffsList(function (data) {
            var html = '';
            for (var i in data) {
                html += self.createListHtml(data[i], []);
            }
            $(self.ele).find('.weui-panel__bd').append(html);

            if (self.ele_pager[0].lastPage) {
                //最后一页
                self.ele_pager[0].loading = true;
                $(self.ele).find('.weui-loadmore').hide();
                return;
            }
        });
    },

    getStaffsList: function (callback) {
        var self = this,
            data = this.getSearchData();

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    self.ele_pager[0].page = data.object.idx + 1;
                    self.ele_pager[0].pageCount = data.object.pageCount;
                    self.ele_pager[0].lastPage = data.object.idx >= data.object.pageCount;
                    callback(data.object.items);
                } else {
                    self.ele_pager[0].loading = true;
                    self.ele_pager[0].lastPage = true;
                    $(self.ele).find('.weui-loadmore').hide();
                    return;
                }
                self.ele_pager[0].loading = false;
            }
        });
    },

    getSearchData: function () {

        return {
            m: 1010000,
            t: 'staffs',
            params: JSON.stringify({operator_id: '<>'}),
            page: this.ele_pager[0].page,
            rows: this.ele_pager[0].rows
        }
    },

    createPopupHtml: function () {
        var html = '';

        html += '<!-- Popup 开始 -->';
        html += '<div class="weui-popup__container">';
        html += '<div class="weui-popup__overlay"></div>';
        html += '<div class="weui-popup__modal">';
        html += '<div class="popupWarp">';

        /*html += '<!-- 下拉刷新 -->';
         html += '<div class="weui-pull-to-refresh__layer">';
         html += '<div class="weui-pull-to-refresh__arrow"></div>';
         html += '<div class="weui-pull-to-refresh__preloader"></div>';
         html += '<div class="down">下拉刷新</div>';
         html += '<div class="up">释放刷新</div>';
         html += '<div class="refresh">正在刷新</div>';
         html += '</div>';*/

        html += '<!-- 搜索栏 -->';
        html += '<div class="weui-search-bar">';
        html += '<form class="weui-search-bar__form">';
        html += '<div class="weui-search-bar__box">';
        html += '<i class="weui-icon-search"></i>';
        html += '<input type="search" class="weui-search-bar__input searchInput" placeholder="搜索" required="">';
        html += '<a href="javascript:" class="weui-icon-clear searchClear"></a>';
        html += '</div>';
        html += '<label class="weui-search-bar__label searchText">';
        html += '<i class="weui-icon-search"></i>';
        html += '<span>搜索</span>';
        html += '</label>';
        html += '</form>';
        html += '<a href="javascript:" class="weui-search-bar__cancel-btn searchCancel">取消</a>';
        html += '</div>';

        html += '<!-- 主体内容 -->';
        html += '<div class="weui-panel weui-panel_access">';
        html += '<div class="weui-panel__bd">';
        html += '</div>';

        html += '<!-- 滚动加载 -->';
        html += '<div class="weui-loadmore">';
        html += '<i class="weui-loading"></i>';
        html += '<span class="weui-loadmore__tips">正在加载</span>';
        html += '</div>';
        html += '</div>';

        html += '<!-- 底部按钮 -->';
        html += '<div class="weui-btn-area">';
        html += '<a class="weui-btn weui-btn_primary btn-su" href="javascript:">确定</a>';
        html += '</div>';

        html += '<!-- Popup 结束 -->';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        $(this.ele).append(html);
    },

    createListHtml: function (data, checkedIds) {
        var html = '';

        html += '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg" ';
        html += 'data-id="' + data.id + '" data-userid="' + data.userid + '" data-code="' + data.code + '">';
        html += '<div class="weui-media-box__hd head-size">';
        html += '<img class="weui-media-box__thumb" src="' + (data.avatar || '') + '" alt="">';
        html += '</div>';
        html += '<div class="weui-media-box__bd weui-cells_checkbox">';
        html += '<label class="weui-cell weui-check__label">';
        html += '<div class="weui-cell__bd">';
        html += '<h4 class="weui-media-box__title">' + data.name + '</h4>';
        html += '</div>';
        html += '<div class="weui-cell__ft">';
        if ($.inArray(data.id, checkedIds) >= 0) {
            html += '<input type="checkbox" class="weui-check" name="checkbox" checked="checked">';
        } else {
            html += '<input type="checkbox" class="weui-check" name="checkbox">';
        }
        html += '<i class="weui-icon-checked"></i>';
        html += '</div>';
        html += '</label>';
        html += '</div>';
        html += '</a>';

        return html;
    },

    resetDate: function (ele, btn, flag) {
        var $box = $(btn).find('.avatar-box');
        $box.children('.avatar-cell').remove();
        this.data[flag + ''].ids = [];
        this.data[flag + ''].selectId = [];
        this.data[flag + ''].userIds = [];
        $(ele).find('.weui-check').removeAttr('checked');
    },

    initHtml: function (ele, btn, flag) {
        var self = this;

        var data = {
            m: 1010000,
            t: 'staffs',
            params: JSON.stringify({operator_id: '<>'})
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    self.data[flag + ''] = {
                        list: data.object,
                        ids: [],
                        selectId: [],
                        userIds: []
                    };

                    $(ele).find(".staff-list").append(self.createSelectHtml(self.data[flag].list, self.data[flag].ids));

                    // 搜索事件
                    $(ele).find('.searchInput').bind('input propertychange', function (e) {
                        self.searchStaffs($(this).val(), ele, self.data[flag].list, self.data[flag].ids);
                    });

                    // 选择事件
                    $(ele).find('.staff-list').on('click', 'input', function () {
                        self.selectStaffs(this, self.data[flag].ids, self.data[flag].selectId, self.data[flag].userIds);
                    });

                    // 确定事件
                    $(ele).find('.close-popup').click(function () {
                        self.createStaffsHtml(btn, self.data[flag].selectId);
                    });
                }
            }
        });
    },

    searchStaffs: function (keyword, ele, data, ids) {
        var $list = $(ele).find('.staff-list'), arr = [];
        $list.empty();
        for (var i in data) {
            if (data[i].name.indexOf(keyword) >= 0) {
                arr.push(data[i]);
            }
        }
        $list.append(this.createSelectHtml(arr, ids));
    },

    selectStaffs: function (ele, ids, selectedIds, userIds, codes) {
        var id = $(ele).parents('.weui-media-box_appmsg').data('id');
        var userId = $(ele).parents('.weui-media-box_appmsg').data('userid');
        var code = $(ele).parents('.weui-media-box_appmsg').data('code');
        if ($(ele).is(":checked")) {
            var temp = {
                id: id,
                head: $(ele).parents('.weui-media-box_appmsg').find('.weui-media-box__thumb').attr('src')
            };
            ids.push(id);
            userIds.push(userId);
            selectedIds.push(temp);
        } else {
            for (var i = 0; i < ids.length; i++) {
                if (ids[i] == id) {
                    ids.splice(i, 1);
                    userIds.splice(i, 1);
                    selectedIds.splice(i, 1);
                }
            }
        }
    },

    createSelectHtml: function (data, id) {
        var html = '';

        for (var i in data) {
            var item = data[i];

            html += '<a class="weui-media-box weui-media-box_appmsg" data-id="' + item.id + '" data-userid="' + item.userid + '" data-code="' + item.code + '">';
            html += '<div class="weui-media-box__hd head-size">';
            html += '<img class="weui-media-box__thumb head-pic" src="' + (item.avatar || '') + '">';
            html += '</div>';
            html += '<div class="weui-media-box__bd">';
            html += '<h4 class="weui-media-box__title">' + item.name + '</h4>';
            html += '</div>';
            html += '<label class="weui-cell weui-check__label muti-selected">';
            html += '<div class=\"weui-cell__hd">';

            if ($.inArray(item.id, id) >= 0) {
                html += '<input type="checkbox" class="weui-check" name="checkbox" checked="checked">';
            } else {
                html += '<input type="checkbox" class="weui-check" name="checkbox">';
            }

            html += '<i class="weui-icon-checked"></i>';
            html += '</div>';
            html += '</label>';
            html += '</a>';
        }

        return html;
    },

    createStaffsHtml: function (ele, data) {
        var $box = $(ele).find('.avatar-box');
        $box.children('.avatar-cell').remove();
        for (var i = 0; i < data.length; i++) {
            $box.prepend('<div class="btn-box avatar-cell" style="width:35px;height:35px; margin:18px 0"><img src="' + (data[i].head || '') + '"/></div>');
        }
    }
};