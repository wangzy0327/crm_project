var module = {};

module.data = {
    user_id:getUrlParam("userid"),
    customer_id: getUrlParam("customer_id"),
    customer_name:getUrlParam("customer_name")
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
            console.log("customer_id:"+customer_id);
            var info = common.visit.getPlanData(customer_id);
            console.log("info:"+info);
            info['userId'] = module.data.user_id;
            console.log("info userId:"+info['userId']);
            console.log("info customerId:"+info['customerId']);
            $.ajax({
                type: 'post',
                url: "/plan/add",
                data:JSON.stringify(info),
                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                error: function (request) {
                },
                success: function (result) {
                    if (result.code == 0) {
                        $.alert('提交成功', function () {
                            $(location).attr('href', '/module/customer-list/customer-list-my.html?userid='+module.data.user_id);
                        });
                    }
                }
            });

            // YT.insert({
            //     data: data,
            //     successCallback: function (data) {
            //         if (data.status == 200) {
            //             var planVisitId = data.object['visit_plan'][0];
            //             var planAutoIds = data.object['plan'];
            //
            //             common.service.getUserInfo(function (data) {
            //                 // 推送消息
            //                 var userIds = common.select.data['plan'].userIds;
            //                 var ids = common.select.data['plan'].ids;
            //
            //                 common.visit.pushMsg({
            //                     staff_id: data.id,
            //                     staff_name: data.name,
            //                     time: info.data.time,
            //                     company: module.data.company,
            //                     customer_name: module.data.customer_name,
            //                     visit_id: planVisitId,
            //                     comment_id: planAutoIds,
            //                     userIds: userIds,
            //                     ids: ids,
            //                     type: 1,
            //                     isComment: 0
            //                 });
            //
            //                 $.alert('提交成功', function () {
            //                     $(location).attr('href', '/module/customer-list/customer-list-my.html' + YT.setUrlParams());
            //                 });
            //             });
            //         } else {
            //             $.alert(data.message);
            //         }
            //     }
            // });
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});