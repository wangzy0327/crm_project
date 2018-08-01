var module2 = {};
module2.data = {
    m: 1010000
};
$(function () {
    module2.service.initControls();
    module2.eventHandler.handleEvents();
});
module2.service = {
    initControls: function () {
        this.initList();
    },
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    initList: function () {
        var tkt = module.service.getUrlParam('tkt'),
            filter = [
                {field: 'id', value: module.service.getUrlParam('id'), operator: '=', relation: 'AND'}
            ];

        var data = {
            m: module2.data.m,
            t:'v_everyday_fight',
            filter: JSON.stringify(filter)
        };
        YT.query({
            data: data,
            successCallback: function (data) {
                if (data.status == 200) {
                    var arr = new Array();             //声明一维数组
                    for (var x = 0; x < data.object.length; x++) {
                        arr[x] = new Array();        //声明二维数组
                    }
                    for (var i in data.object) {
                        arr[i].push(data.object[i].date);
                        arr[i].push(data.object[i].score);
                    }
                    // console.log(arr);
                    continuous.continuousDisplay(arr);
                } else {
                    $('#msg').text(data.message);
                }
            }
        });
    }
};
module2.eventHandler = {
    handleEvents: function () {
        this.edit();
         },
    edit: function () {

    }
};












