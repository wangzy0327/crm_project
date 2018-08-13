var module = {};

module.data = {
    m: 1010000,
    customer_id: YT.getUrlParam('customer_id')
};

var pager = {
    loading: false,
    lastPage: false,
    pageCount: 0,
    page: 1,
    rows: 13
};

module.service = {
    initControls: function () {
        common.visit.initTagList();
        this.initList();
    },

    initList: function () {
        YT.query({
            loading: false,
            data: this.getSearchData(),
            successCallback: function (data) {
                if (200 == data.status) {
                    var html = '', items = data.object.items;

                    pager.page = data.object.idx + 1;
                    pager.pageCount = data.object.pageCount;
                    pager.lastPage = data.object.idx >= data.object.pageCount;

                    for (var i in items) {
                        var item = items[i];
                        html += '<a class="weui-cell weui-cell_access detail" href="javascript:;" data-id="' + item.id + '" data-staffid="' + item.staff_id + '">';
                        html += '<div class="weui-cell__bd">';
                        html += '<p>' + item.staff_name + '于' + new Date(item.recordTime).Format('yyyy-MM-dd hh:mm:ss') + '拜访</p>';
                        html += '</div>';
                        html += '<div class="weui-cell__ft"></div>';
                        html += '</a>';
                    }

                    $('#memo-list').append(html);

                    if (pager.lastPage) {
                        //最后一页
                        pager.loading = true;
                        $('#infinite').hide();
                        $('#memo-list').after('<div class="weui-loadmore weui-loadmore_line msg-content"><span class="weui-loadmore__tips">共' + data.object.recordCount + '条数据</span></div>');
                        return;
                    }

                } else {

                }
                pager.loading = false;
            }
        });
    },

    getSearchData: function () {
        var filter = [
            {field: 'customer_id', value: module.data.customer_id, operator: '=', relation: 'and'}
        ];

        return {
            m: 1010000,
            t: 'v_customers_memo',
            filter: JSON.stringify(filter),
            order: 'recordTime desc',
            page: pager.page,
            rows: pager.rows
        }
    },

    clearList: function () {
        pager = {
            loading: false,
            lastPage: false,
            pageCount: 0,
            page: 1,
            rows: 13
        };

        $('#memo-list').empty();
        $('.msg-content').remove();
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleClickDeatil();

        // 下拉刷新
        $(document.body).pullToRefresh().on('pull-to-refresh', function (done) {
            var self = this;
            setTimeout(function () {
                module.service.clearList();
                module.service.initList();
                $(self).pullToRefreshDone();
            }, 1000);
        });

        // 滚动加载
        $(document.body).infinite().on("infinite", function () {
            if (pager.loading) return;
            pager.loading = true;
            $('#infinite').show();
            module.service.initList();
        });

    },

    handleClickDeatil: function () {
        $('#memo-list').on('click', '.detail', function () {
            location.href = '/module/discuss/visit-detail-evaluation.html' + YT.setUrlParams({
                    staff_id: $(this).data('staffid'),
                    visit_id: $(this).data('id'),
                    type: 2,
                    iscomment: 1
                });
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});
