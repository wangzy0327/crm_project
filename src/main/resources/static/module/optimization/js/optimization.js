var module = {};

module.data = {
    m: 4000000,
    rank_obj: {
        share: [],
        relay: [],
        visit: [],
        sign: []
    }
};

module.service = {
    initControls: function () {
        this.initDom();
        this.initWxConfig();
    },

    initDom: function () {
        var self = this;

        this.createSortHtml();

        //$.showLoading('加载中...');

        YT.getUserInfo(function (userInfo) {
            module.data.userInfo = userInfo;
            self.createRankHtml(false);
        });
    },

    initWxConfig: function () {
        wxCommon.service.initWxConfig(
            [
                'onHistoryBack', 'closeWindow'
            ],
            function () {
                wx.onHistoryBack(function () {
                    wx.closeWindow();
                });
            },
            function () {
            },
            function () {
            },
            function () {
            }
        );
    },

    createSortHtml: function () {
        var rank_obj = module.data.rank_obj, rank_show = sessionStorage.getItem('rank_show') || 'share', html = '';

        for (var i in rank_obj) {
            var order = sessionStorage.getItem('sort_' + i) || 'desc';

            html += '<a class="weui-navbar__item sort sort_' + i + '" href="#tab_' + i + '" " data-type="' + i + '" data-o="' + order + '">';

            switch (i) {
                case 'share':
                    html += '分享';
                    break;
                case 'relay':
                    html += '转发';
                    break;
                case 'visit':
                    html += '拜访';
                    break;
                case 'sign':
                    html += '签单';
                    break;
            }

            if ('asc' === order) {
                html += '<i class="iconfont">&#xe60d;</i>'; // 正序
            } else {
                html += '<i class="iconfont">&#xe60e;</i>'; // 倒序
            }
            html += '</a>';
        }

        $('.weui-navbar').append(html);
        $('.sort.sort_' + rank_show).addClass('action');
        $('#tab_' + rank_show).addClass('weui-tab__bd-item--active');
    },

    createRankHtml: function (hasLoading) {
        if (hasLoading) {
            //$.showLoading('加载中...');
        }

        this.getRankList(function (sort_type, data) {
            var $tab = $('#tab_' + sort_type), loading = false, idx = data.idx;

            if (idx < data.pageCount) {
                loading = true;
            } else {
                $tab.find('.weui-loadmore').addClass('weui-loadmore_line')
                    .html('<span class="weui-loadmore__tips" style="background: #f1f5f8;">无更多数据</span>');
            }

            $tab.data('page', idx + 1);
            $tab.data('loading', loading);

            CustomerComm.comm.createCellsHtml({
                el: '#rank_' + sort_type,
                data: data.items,
                index: (idx - 1) * data.pageSize,
                detail: {
                    has: true,
                    params: {
                        sid: 'staff_id',
                        cid: 'customer_id',
                        type: sort_type
                    }
                },
                has_swiped: true
            });

            $.hideLoading();
        });
    },

    getRankList: function (callback) {
        var module_d = module.data, $sort = $('.sort.action'), sort_type = $sort.data('type'),
            sort_order = $sort.data('o'), page = $('#tab_' + sort_type).data('page') || 1;

        var filter = [
            {field: 'staff_id', value: module_d.userInfo.id, operator: '=', relation: 'and'}
        ];

        var data = {
            m: module_d.m,
            t: 'v_rank_' + sort_type,
            filter: JSON.stringify(filter),
            order: 'count ' + sort_order + ',customer_id',
            page: page,
            rows: 15
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    callback(sort_type, data.object);
                } else {
                    $.alert(data.message);
                }
            }
        });
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleClickSort();
        this.handleBtnToAdd();
        this.handleBtnDelete();
        this.handleInfinite();
    },

    handleClickSort: function () {
        $('.sort').click(function () {
            var $this = $(this), sort_type = $this.data('type'), sort_order = $this.data('o'),
                $tab = $('.infinite.weui-tab__bd-item--active'), $rank = $('#rank_' + sort_type);

            $('.sort').removeClass('action');
            $this.addClass('action');

            if ($tab.attr('id') === 'tab_' + sort_type) {
                // 当前箭头方向，默认下降
                if ('asc' === sort_order) {
                    // 上升
                    $this.data('o', 'desc');
                    $this.find('.iconfont').html('&#xe60e;');
                } else if ('desc' === sort_order) {
                    // 下降
                    $this.data('o', 'asc');
                    $this.find('.iconfont').html('&#xe60d;');
                }

                $rank.empty();
                $tab.data('page', 1).find('.weui-loadmore').removeClass('weui-loadmore_line')
                    .html('<i class="weui-loading"></i><span class="weui-loadmore__tips">正在加载</span>');

                module.service.createRankHtml(true);
            } else {
                if ($rank.children().length === 0) {
                    module.service.createRankHtml(true);
                }
            }

            // 会话存储
            $('.sort').each(function (i, e) {
                sessionStorage.setItem('sort_' + $(e).data('type'), $(e).data('o'));
            });
            sessionStorage.setItem('rank_show', sort_type);
        });
    },

    handleBtnToAdd: function () {
        $('#btn-add').click(function () {
            window.location.href = '/module/customer/customer-add.html' + YT.setUrlParams();
        });
    },

    handleBtnDelete: function () {
        var module_d = module.data;
        $(document.body).on('click', '.delete-swipeout', function (e) {
            var $this = $(this);
            $.confirm("您确定解除与该客户的关系？", function () {
                //点击确认后的回调函数
                var $detail = $this.parents('.weui-cell_swiped').find('.detail'), rank_id = $detail.data('cid'),
                    rank_obj = module_d.rank_obj;

                $('.detail[data-cid="' + rank_id + '"]').parent().remove();

                for (var i in rank_obj) {
                    // 重新排序
                    $('#rank_' + i + ' .weui-cell_swiped').each(function (i, e) {
                        var html = '';
                        switch (i) {
                            case 0:
                                html = CustomerComm.comm.createRankIconHtml('#icon-jichutubiao_jinpai');
                                break;
                            case 1:
                                html = CustomerComm.comm.createRankIconHtml('#icon-jichutubiao_jinpaifuben');
                                break;
                            case 2:
                                html = CustomerComm.comm.createRankIconHtml('#icon-jichutubiao_jinpaifuben1');
                                break;
                            default:
                                html = '<div class="cell_num">' + (i + 1) + '</div>';
                                break;
                        }
                        $(e).find('.rank_sort').html(html);
                    });
                }

                // todo 后台修改 staff_customers_relation 关系
                var filter = [
                    {field: 'staff_id', value: module_d.userInfo.id, operator: '=', relation: 'and'},
                    {field: 'customer_id', value: rank_id, operator: '=', relation: 'and'}
                ];

                var data = {
                    m: 1010000,
                    t: 'staff_customers_relation',
                    v: JSON.stringify([
                        {
                            t: 'staff_customers_relation',
                            data: {delFlag: 1},
                            filter: filter
                        }
                    ])
                };

                YT.update({
                    data: data,
                    successCallback: function (data) {
                        if (200 == data.status) {

                        } else {
                            $.alert('操作失败!');
                        }
                    }
                });
            }, function () {
                //点击取消后的回调函数
            });
        });
    },

    handleInfinite: function () {
        $(".infinite").infinite(100).on("infinite", function () {
            if ($(this).data('loading')) {
                $(this).data('loading', false);
                module.service.createRankHtml(true);
            }
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});