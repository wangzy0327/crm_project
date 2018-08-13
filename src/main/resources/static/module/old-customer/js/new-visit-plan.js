var module = {};

module.data = {
    m: 1010000,
    customer_id: YT.getUrlParam("customer_id"),
    customer_name: YT.getUrlParam("customer_name"),
    company: YT.getUrlParam('company')
};

module.service = {
    initControls: function () {
        this.initDom();
    },

    initDom: function () {
        common.visit.initDom_plan();
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleBtnSave();
    },

    handleBtnSave: function () {
        $('#btn-save').click(function () {
            var customer_id = module.data.customer_id;

            var info = common.visit.getPlanData(customer_id);

            var data = {
                m: module.data.m,
                t: 'visit_plan',
                v: JSON.stringify([info]),
                params: JSON.stringify({customer_id: customer_id, plan_staff: info.data.to_staff})
            };

            YT.insert({
                data: data,
                successCallback: function (data) {
                    if (data.status == 200) {
                        var planVisitId = data.object['visit_plan'][0];
                        var planAutoIds = data.object['plan'];

                        common.service.getUserInfo(function (data) {
                            // 推送消息
                            var userIds = common.select.data['plan'].userIds;
                            var ids = common.select.data['plan'].ids;

                            common.visit.pushMsg({
                                staff_id: data.id,
                                staff_name: data.name,
                                time: info.data.time,
                                company: module.data.company,
                                customer_name: module.data.customer_name,
                                visit_id: planVisitId,
                                comment_id: planAutoIds,
                                userIds: userIds,
                                ids: ids,
                                type: 1,
                                isComment: 0
                            });

                            $.alert('提交成功', function () {
                                $(location).attr('href', '/module/customer-list/customer-list-my.html' + YT.setUrlParams());
                            });
                        });
                    } else {
                        $.alert(data.message);
                    }
                }
            });
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});