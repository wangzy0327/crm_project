var module = {};

module.data = {
    user_id:getUrlParam("userid"),
    customer_id: getUrlParam("customer_id"),
    customer_name:getUrlParam("customer_name"),
    company:getUrlParam("company")
};

module.service = {
    initControls: function () {
        this.initDom();
    },

    initDom: function () {
        $.ajax({
            type: 'get',
            url: "/staff/self?userId="+module.data.user_id,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log("staff_name: "+data.name);
                    module.data.staff_name = data.name;
                    common.visit.initDom_plan();
                }
            }
        });
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
            info['userId'] = module.data.user_id;
            info['staffName'] = module.data.staff_name;
            info['company'] = module.data.company;
            console.log("company:"+module.data.company);
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
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});