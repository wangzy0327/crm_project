var listManager = {};

listManager.data = {
    m: 10180000,
    typeTab: [],
    order: 'createTime desc',
    corpid: YT.getUrlParam('corpid'),
    groupid: YT.getUrlParam('groupid')
};

var pager = {
    loading: false,
    page: 1,
    rows: 15
};

$(function () {
    $(document.body).infinite(100);
    listManager.service.initControls();
    listManager.eventHandler.handleEvents();
});

listManager.service = {
    initControls: function () {
        this.initGrid();
        this.initTagData();
    },

    cutStr: function (str, length) {
        if (str != null && str !== undefined) {
            if (str.length <= length) {
                return str;
            } else {
                return str.substr(0, length) + "...";
            }
        } else {
            return "";
        }
    },

    // 初始化列表
    initGrid: function (otherFilter) {
        var noMore =
            '<div  id="noMore" style="margin-top: 10px;text-align: center;">' +
            '无更多记录' +
            '</div> ';

        var postData = this.initSearch(otherFilter);
        YT.query({
            data: postData,
            successCallback: function (data) {
                if (200 == data.status) {
                    listManager.data.typeTab.push(1);
                    if (pager.page == 1) {
                        $("#noMore").remove();
                    }
                    var items = data.object.items, str = '';
                    pager.page = data.object.idx + 1;

                    for (var i = 0; i < items.length; i++) {
                        var id = items[i].id;
                        var titleData = items[i].titleText;
                        var personCreate = items[i].createUser;
                        var dateCreate = new Date(items[i].createTime).Format("yyyy-MM-dd");
                        var openCount = items[i].openCount;
                        if (openCount == null || openCount == '') {
                            openCount = 0;
                        }
                        str += '<a class="weui-cell weui-cell_access detail" data-id="' + id + '" data-type="' + items[i].msgType + '" href="javascript:;"> ' +
                            '<div class="weui-cell__bd"> ' +
                            '<p>' + listManager.service.cutStr(titleData, 8) + '(<span style="font-size: 15px;color:#666666;">' +
                            personCreate + '</span>&nbsp;&nbsp;<span style="font-size: 13px;color:#666666;">' +
                            dateCreate + '</span>)</p> ' +
                            '</div> ' +
                            '<div class="weui-cell__ft"> ' +
                            '<span style="font-size: 13px;color:#666666;">点击热度：</span><span style="color:red;">' +
                            openCount + '</span>' +
                            '</div> ' +
                            '</a>';
                    }
                    $("#list").append(str);
                    if (data.object.idx >= data.object.pageCount) {
                        //最后一页
                        pager.loading = true;
                        $('#infinite').remove();
                        $("#more").append(noMore);
                        return;
                    }
                } else {
                    $.alert(data.message);
                }
                pager.loading = false;
            }
        });
    },

    // 热门标签
    initTagData: function () {
        var module_d = listManager.data;

        var filter = [
            {field: 'corpid', value: module_d.corpid, operator: '=', relation: 'and'},
            {field: 'group_id', value: module_d.groupid, operator: '=', relation: 'and'}
        ];

        var data = {
            m: module_d.m,
            t: 'v_message_tag_hot',
            filter: JSON.stringify(filter),
            order: 'count desc',
            r: 10
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    var items = data.object,
                        html = '<p style="font-size: 14px;color: #9e9e9e;margin-top: 15px;">暂无数据</p>';

                    if (items.length) {
                        html = '';

                        var defaultClass = ['blue', 'green', 'orange', 'red', 'purple', 'grey'];
                        var tagClass = [].concat(defaultClass);

                        for (var i in items) {
                            var item = items[i];

                            if (tagClass.length == 0) {
                                tagClass = [].concat(defaultClass);
                            }
                            var index = Math.floor(Math.random() * tagClass.length);
                            var count = item.count > 99 ? '99+' : item.count;
                            html += '<i class="tag ' + tagClass.splice(index, 1)[0] + '" data-ids=' + item.message_ids + ' data-shareIds= ' + item.share_id + '>' + item.tag_name + ' ' + count + '</i>';
                        }
                    }

                    $('.tag-box').append(html);

                } else {
                    $.alert('网络异常，请与管理员联系！');
                }
            }
        });
    },

    initSearch: function (otherFilter) {
        var module_d = listManager.data;

        var filter = [
            {field: 'corpid', value: module_d.corpid, operator: '=', relation: 'AND'},
            {field: 'status', value: 1, operator: '=', relation: 'AND'},
            {field: 'group_id', value: module_d.groupid, operator: '=', relation: 'AND'}
        ];

        if (otherFilter) {
            filter.push({field: 'id', value: '', operator: 'in (' + otherFilter + ')', relation: 'AND'});
        }

        return {
            m: module_d.m,
            t: 'v_message_test_m',
            filter: JSON.stringify(filter),
            order: module_d.order,
            page: pager.page,
            rows: pager.rows
        };
    }
};

listManager.eventHandler = {
    handleEvents: function () {
        this.handleInfinite();
        this.handleDetail();
        this.handleTagBtn();
        this.handleSearchAllBtn();
        this.handleSortBtn();
        this.handlePopupToAdd();
    },

    handleInfinite: function () {
        $(document.body).infinite().on("infinite", function () {
            if (pager.loading) return;
            pager.loading = true;
            listManager.service.initGrid();
        });
    },

    handleDetail: function () {
        $('#list').on('click', '.detail', function () {
            var dataId = $(this).data('id'), msgType = +$(this).data('type'), url = '';

            // 1文章 2资料 3图片 4没有二维码图片 5H5 6平面
            switch (msgType) {
                case 1:
                case 3:
                case 4:
                    url = 'message-share.html';
                    break;
                case 2:
                    url = 'doc/doc-share.html';
                    break;
                case 5:
                    url = 'h5/h5-share.html';
                    break;
                case 6:
                    url = 'graphic/graphic-share.html';
                    break;
            }

            YT.getUserInfo(function (user) {
                window.location.href = url + YT.setUrlParams({
                    d: dataId,
                    s: 0,
                    u: user.id
                });
            });
        });
    },

    handleTagBtn: function () {
        $('.tag-box').on('click', '.tag', function () {
            $('#list a').remove();
            $("#noMore").remove();
            pager = {
                loading: false,
                page: 1,
                rows: 15
            };
            var $this = $(this);
            $this.addClass('action');
            $this.siblings().removeClass('action');
            listManager.service.initGrid($(this).data('ids'));
        });
    },

    handleSearchAllBtn: function () {
        $('.search_all').click(function () {
            //智库
            $('#list a').remove();
            $("#noMore").remove();
            $('.tag.action').removeClass('action');
            pager = {
                loading: false,
                page: 1,
                rows: 15
            };
            listManager.service.initGrid();
        });
    },

    handleSortBtn: function () {
        $('.sort_time').click(function () {
            btnAction(this, 'createTime');
        });

        $('.sort_heat').click(function () {
            btnAction(this, 'openCount');
        });

        function btnAction(ele, str) {
            var $this = $(ele), order = $this.data('o');

            if ($this.hasClass('action')) {
                if (order == 'asc') {
                    order = 'desc';
                } else if (order == 'desc') {
                    order = 'asc';
                }
            }
            // 设置箭头方向
            if (order == 'desc') {
                // 下降
                $this.find('.iconfont').html('&#xe60e;');
            } else if (order == 'asc') {
                // 上升
                $this.find('.iconfont').html('&#xe60d;');
            }

            $this.addClass('action');
            $this.siblings().removeClass('action');
            $this.data('o', order);
            listManager.data.order = str + ' ' + order;

            // 刷新列表
            $('#list a').remove();
            $("#noMore").remove();
            pager = {
                loading: false,
                page: 1,
                rows: 15
            };
            listManager.service.initGrid($('.tag.action').data('ids'));
        }
    },

    handlePopupToAdd: function () {
        $('.message-type').click(function () {
            var type = $(this).data('type'), url = '';
            switch (type) {
                case 2:
                    url = '/module/message/doc/doc-add.html';
                    break;
                case 5:
                    url = '/module/message/h5/h5-add.html';
                    break;
                case 6:
                    url = '/module/message/graphic/graphic-add.html';
                    break;
            }
            if (url !== '') {
                window.location.href = url + YT.setUrlParams({groupid: YT.getUrlParam('groupid')});
            }
        });
    }
};