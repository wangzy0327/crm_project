var module = module || {};
$(function () {
    module.service.initControls();
    module.eventHandlerPager.handlerPagerLoad();
});
module.data = {
    ticket: YT.getUrlParam('tkt'),
    corpid: YT.getUrlParam('corpid'),
    groupid: YT.getUrlParam('groupid') || '-1'
};
module.service = {
    initControls: function () {
        this.initList();
    },
    initList: function () {
        var data = {
            m: 1050000,
            t: 'v_staffs_groups',
            params: JSON.stringify({groupid:YT.getUrlParam('groupid'),ticket: module.data.ticket, rank_category: 1})
        };
        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    var items = data.object;
                    var str = commonModule.eventHandler.getRankStr(items);
                    $('#month_list_items').html(str);
                } else {
                    $('#month_list_items').text(data.message);
                }
            }
        });
    }
};
module.eventHandlerPager = {
    handlerPagerLoad: function () {
        commonModule.eventHandler.handleEvents();
    }
};
