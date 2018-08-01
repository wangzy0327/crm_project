var module = {};

module.data = {
    sid: YT.getUrlParam('sid'),
    cid: YT.getUrlParam("cid"),
    rank_type: YT.getUrlParam("type")
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
                index: (idx - 1) * data.pageSize,
                cell_name_key: 'titleText'
            });

            $.hideLoading();
        });
    },

    getRankList: function (callback) {
        var module_d = module.data, sid = module_d.sid, cid = module_d.cid, rank_type = module_d.rank_type,
            page = $(document.body).data('page') || 1;

        var filter = [
            {field: 'staffId', value: sid, operator: '=', relation: 'and'},
            {field: 'customerId', value: cid, operator: '=', relation: 'and'}
        ];

        var data = {
            m: 2000000,
            t: 'v_rank_' + rank_type + '_detail',
            filter: JSON.stringify(filter),
            order: 'count desc,messageId',
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
        var module_d = module.data;
        this.handleInfinite();
        pushHistory('/module/customer/customer-detail.html', {
            sid: module_d.sid,
            cid: module_d.cid,
            type: module_d.rank_type
        });
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