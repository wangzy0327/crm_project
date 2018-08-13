var module = {};
module.data = {
    tickt:YT.getUrlParam('tkt')
};
$(function () {
            module.service.initControls();
});
module.service = {
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    initControls: function () {
        var id_first = this.getUrlParam('compareId_left');
        var name_first = this.getUrlParam('compareName_left');
        //比较对象
        var id_second = this.getUrlParam('compareId_right');
        var name_second = this.getUrlParam('compareName_right');
        this.initList(id_first, id_second,name_first,name_second);
    },
    initList: function (id_first, id_second, name_first, name_second) {
        name_first = name_first || "";
        name_second = name_second || "";

        var data = {
            m: 1080000,
            t: 'v_self_fighting',
            params: JSON.stringify({tkt:module.data.ticket,id_first: id_first,id_second: id_second})
        };
        YT.query({
            data: data,
            successCallback: function (data) {
                if (data.status == 200) {
                    var arr = new Array(); //声明一维数组
                    for (var x = 0; x < 2; x++) {
                        arr[x] = new Array();//声明二维数组
                    }
                    if(data.object.length <= 0){
                        arr[0].push(name_first);
                        arr[0].push(0);
                        arr[0].push(0);
                        arr[0].push(0);
                        arr[0].push(0);
                        arr[0].push(0);
                        arr[1].push(name_second);
                        arr[1].push(0);
                        arr[1].push(0);
                        arr[1].push(0);
                        arr[1].push(0);
                        arr[1].push(0);
                        $('#staff0_name').html(name_first + "");
                        $('#score0').html(0);
                        $('#staff1_name').html(name_second + "");
                        $('#score1').html(0);
                    }else if(data.object.length == 1){
                        var staffId =data.object[0].staff_id;
                        var staffName = data.object[0].staff_name;
                        var name_other = "";
                        if(''+id_first == ''+staffId){
                            arr[0].push(staffName);
                            arr[0].push(data.object[0].plan_score || 0);
                            arr[0].push(data.object[0].customer_score || 0);
                            arr[0].push(data.object[0].deal_score || 0);
                            arr[0].push(data.object[0].market_score || 0);
                            arr[0].push(data.object[0].action_score || 0);
                            name_other = name_second;
                            arr[1].push(name_other);
                            arr[1].push(0);
                            arr[1].push(0);
                            arr[1].push(0);
                            arr[1].push(0);
                            arr[1].push(0);
                            $('#staff0_name').html(staffName + "：");
                            $('#score0').html(data.object[0].plan_score || 0);
                            //$('#score0').html(data.object[0].score || 0);
                            $('#staff1_name').html(name_other + "：");
                            $('#score1').html(0);
                        }
                        if(''+id_second == ''+staffId){
                            name_other = name_first;
                            arr[0].push(name_other);
                            arr[0].push(0);
                            arr[0].push(0);
                            arr[0].push(0);
                            arr[0].push(0);
                            arr[0].push(0);
                            arr[1].push(staffName);
                            arr[1].push(data.object[0].plan_score || 0);
                            arr[1].push(data.object[0].customer_score || 0);
                            arr[1].push(data.object[0].deal_score || 0);
                            arr[1].push(data.object[0].market_score || 0);
                            arr[1].push(data.object[0].action_score || 0);
                            $('#staff0_name').html(name_other + "：");
                            $('#score0').html(0);
                            $('#staff1_name').html(staffName + "：");
                            $('#score1').html(data.object[0].plan_score || 0);
                           // $("#score1").html(data.object[0].score);
                        }
                    }else{
                        for (var i in data.object) {
                            var staffName = "";
                            if(''+id_first == ''+data.object[i].staff_id){
                                staffName = data.object[i].staff_name || name_first || "";
                            }
                            if(''+id_second == ''+data.object[i].staff_id){
                                staffName = data.object[i].staff_name || name_second || "";
                            }
                            arr[i].push(staffName);
                            arr[i].push(data.object[i].plan_score || 0);
                            arr[i].push(data.object[i].customer_score || 0);
                            arr[i].push(data.object[i].deal_score || 0);
                            arr[i].push(data.object[i].market_score || 0);
                            arr[i].push(data.object[i].action_score || 0);
                            $('#staff' + i + '_name').html(staffName);
                            $('#score' + i).html(data.object[i].score);
                        }
                    }
                    radarCompare.radarDisplay(arr[0], arr[1]);
                } else {
                    $('#msg').text(data.message);
                }
            }
        });
    }
};