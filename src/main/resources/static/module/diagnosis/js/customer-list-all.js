var module = {};

module.data = {
    corpid: YT.getUrlParam('corpid'),
    rank_type: YT.getUrlParam("type"),
    groupid: YT.getUrlParam("groupid")
};

module.service = {
    initControls: function () {
        this.initDom();
    },

    initDom: function () {
        var module_d = module.data, rank_type = module_d.rank_type, title = '', cell_title = '';

        if (rank_type === 'share') {
            title = '分享排名';
            cell_title = '分享排名（分享给客户的消息次数）';
        } else if (rank_type === 'relay') {
            title = '转发排名';
            cell_title = '转发排名（客户转发的消息次数）';
        } else if (rank_type === 'visit') {
            title = '拜访排名';
            cell_title = '拜访排名（拜访客户的次数）';
        } else if (rank_type === 'sign') {
            title = '签单排名';
            cell_title = '签单排名（与客户签单的次数）';
        }
        $('title').html(title);
        $('.weui-cells__title').text(cell_title);

        this.createRankHtml(true);
    },

    createRankHtml: function (hasLoading) {
        if (hasLoading) {
            //$.showLoading('加载中...');
        }

        this.getRankList(function (data) {
            var $doc = $(document.body), loading = false, idx = data.idx;

            if (idx < data.pageCount) {
                loading = true;
            } else {
                $doc.find('.weui-loadmore').addClass('weui-loadmore_line')
                    .html('<span class="weui-loadmore__tips" style="background: #f1f5f8;">无更多数据</span>');
            }

            $doc.data('page', idx + 1);
            $doc.data('loading', loading);

            CustomerComm.comm.createCellsHtml({
                el: '#rank_list',
                data: data.items,
                index: (idx - 1) * data.pageSize
            });

            $.hideLoading();
        });
    },

    getRankList: function (callback) {
        var module_d = module.data, corpid = module_d.corpid, rank_type = module_d.rank_type,
            groupid = module_d.groupid, page = $(document.body).data('page') || 1;

        var filter = [
            {field: 'corpid', value: corpid, operator: '=', relation: 'and'},
            {field: 'group_id', value: groupid, operator: '=', relation: 'and'}
        ];

        var data = {
            m: 2000000,
            t: 'v_rank_' + rank_type + '_corpid',
            filter: JSON.stringify(filter),
            order: 'count desc,customer_id',
            page: page,
            rows: 15
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    callback(data.object);
                } else {
                    $.alert(data.message);
                }
            }
        });
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleInfinite();
    },

    handleInfinite: function () {
        $(document.body).infinite(100).on("infinite", function () {
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