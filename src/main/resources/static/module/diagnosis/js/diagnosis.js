var module = {};

module.data = {
    m: 2000000,
    corpid: YT.getUrlParam('corpid'),
    groupid: YT.getUrlParam("groupid")
};

module.service = {
    initControls: function () {
        this.initDom();
    },

    initDom: function () {
        this.createRankHtml(false, 'share');
        this.createRankHtml(false, 'relay');
        this.createRankHtml(false, 'visit');
        this.createRankHtml(false, 'sign');
    },

    createRankHtml: function (hasLoading, rank_type) {
        if (hasLoading) {
            $.showLoading('加载中...');
        }

        this.getRankList(rank_type, function (groupid, type, data) {
            var rank_params = {
                el: '#rank_' + type,
                data: data,
                more: {
                    has: true,
                    num: 4,
                    params: {type: type, groupid: groupid},
                    url: '/module/diagnosis/customer-list-all.html'
                }
            };

            var url = '';

            if (type === 'share') {
                //url = '/module/diagnosis/message-share.html';
            } else if (type === 'relay') {

            }

            if (url) {
                rank_params.detail = {
                    has: true,
                    params: {
                        type: type
                    },
                    url: url
                }
            }

            CustomerComm.comm.createCellsHtml(rank_params);
            $.hideLoading();
        });
    },

    getRankList: function (rank_type, callback) {
        var module_d = module.data, groupid = module_d.groupid;

        var filter = [
            {field: 'corpid', value: module_d.corpid, operator: '=', relation: 'and'},
            {field: 'group_id', value: groupid, operator: '=', relation: 'and'}
        ];

        var data = {
            m: module_d.m,
            t: 'v_rank_' + rank_type + '_corpid',
            filter: JSON.stringify(filter),
            order: 'count desc,customer_id',
            r: 5
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    callback(groupid, rank_type, data.object);
                } else {
                    $.alert(data.message);
                }
            }
        });
    }
};

module.eventHandler = {
    handleEvents: function () {

    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});