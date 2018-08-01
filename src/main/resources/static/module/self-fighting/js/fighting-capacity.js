var module = {};

module.data = {
    ticket: YT.getUrlParam('tkt')
};

$(function () {
    rankCommmon.service.getUserInfo(function () {
        module.service.initControls();
        module.eventHandler.handleEvents();
    });
});

module.service = {
    initControls: function () {
        this.initList();
        this.initEchartTable();//初始化折线图
        this.initSelect();
    },
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    initList: function () {
        var data = {
            m: 10170000,
            t: 'v_self_fighting',
            params: JSON.stringify({tkt: module.data.ticket})
        };
        YT.query({
            data: data,
            successCallback: function (data) {
                if (data.status == 200) {
                    var score = [];
                    if (data.object.length <= 0) {
                        score.push(0),
                            score.push(0),
                            score.push(0),
                            score.push(0),
                            score.push(0)
                    }
                    if (score === undefined || score.length == 0) {
                        score.push(data.object[0].plan_score || 0);
                        score.push(data.object[0].customer_score || 0);
                        score.push(data.object[0].deal_score || 0);
                        score.push(data.object[0].market_score || 0);
                        score.push(data.object[0].action_score || 0);
                    }
                    $('#score_total').html(data.object[0].score);
                    $('#staff_name').html(data.object[0].staff_name);
                    radar.radarDisplay(score);
                } else {
                    $('#msg').text(data.message);
                }
            }
        });
    },
    initEchartTable: function () {
        var filter = [
            {field: 'id', value: rankCommmon.userInfo.id, operator: '=', relation: 'AND'}
        ];
        var data = {
            m: 1010000,
            t: 'v_everyday_fight',
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
                    for (var i = 0; i < data.object.length; i++) {
                        arr[i].push(data.object[i].date);
                        arr[i].push(data.object[i].score);
                    }
                    continuous.continuousDisplay(arr);
                } else {
                    $('#msg').text(data.message);
                }
            }
        });
    },
    initSelect: function () {
        var data = {
            m: 1060000,
            t: 'staffs',
            params: JSON.stringify({tkt: module.data.ticket, id: rankCommmon.userInfo.id})
        };
        var each = [];
        YT.query({
            data: data,
            successCallback: function (data) {
                if (data.status == 200) {
                    for (var i = 0; i < data.object.length; i++) {
                        each.push({
                            title: data.object[i].name,
                            value: data.object[i].id
                        });
                    }
                    var selectConfig = {
                        title: "请选择比较对象",
                        items: each
                    };
                    if (each.length == 0) {
                        $("#comparison").on("click", function (event) {
                            $.alert('暂无可比较对象！');
                            event.stopPropagation();
                            return false;
                        });
                    } else {
                        $("#comparison").select(selectConfig);
                    }
                } else {
                    $('#comparison').text(data.message);
                }
            }
        });
    }
};
module.eventHandler = {
    handleEvents: function () {
        this.query();
    },
    //战斗力对比查询
    query: function () {
        $('#compare_others').click(function () {
            var object = $("#comparison").val();
            if (object == null || object == "") {
                $.alert("请选择比较对象！");
                return false;
            }
            var compareId_left = rankCommmon.userInfo.id;
            var compareName_left = rankCommmon.userInfo.name;
            var compareId_right = $("#comparison").attr('data-values');
            var compareName_right = $("#comparison").val();
            $("#compare_others").attr('href', 'fighting-compare.html?tkt=' + module.data.ticket + '&compareId_left=' + compareId_left + '&compareName_left=' + compareName_left + '&compareId_right=' + compareId_right + '&compareName_right=' + compareName_right);
        });
    }
};