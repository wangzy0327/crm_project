var module = {};
$(function () {
    module.service.initControls();
});
module.service = {
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
        var data = {
            m: 1010000,
            t: 'fighting_score_everyday',
            filter: JSON.stringify(filter)
        };
        YT.query({
            data: data,
            successCallback: function (data) {
                if (data.status == 200) {
                    var arr = new Array();//声明一维数组
                    for (var x = 0; x < data.object.length; x++) {
                        arr[x] = new Array();//声明二维数组
                    }
                    for (var i=0;i<data.object.length;i++) {
                        arr[i].push(data.object[i].date);
                        arr[i].push(data.object[i].score);
                    }
                    continuous.continuousDisplay(arr);
                } else {
                    $('#msg').text(data.message);
                }
            }
        });
    }
};












