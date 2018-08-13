var module={}
module.data={
    m1:1010000,
    m2:1010000
};
$(function(){
    module.service.initControls();
    module.eventHandler.handleEvents();
});
module.service={
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    initControls:function () {
        $("#save").attr('data-id',this.getUrlParam('data-id'));
        var id =this.getUrlParam('data-id');
        this.initList();
    },
    initList:function(){
        var filter= [
            {field:'id',value:this.getUrlParam('data-id'),operator:'=',relation:''}
        ];
        var data={
            m:module.data.m1,
            t:'customers',
            filter:JSON.stringify(filter)
        };
        YT.query({
            data:data,
            successCallback: function (data) {
                if (data.status == 200) {
                    console.log(data.object[0].name);
                    $('#name').val(data.object[0].name);
                    $('#time').val(data.object[0])
                } else {
                    $('#name').text(data.message);
                }
            }
        });
    }
};
module.eventHandler={
    handleEvents:function(){
        this.add();
        this.edit();
    },
    formatterDateTime : function(date) {
        var datetime = date.getFullYear()
            + "-"// "年"
            + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : "0"
                + (date.getMonth() + 1))
            + "-"// "月"
            + (date.getDate() < 10 ? "0" + date.getDate() : date
                .getDate())
            + " "
            + (date.getHours() < 10 ? "0" + date.getHours() : date
                .getHours())
            + ":"
            + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
                .getMinutes())
            + ":"
            + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
                .getSeconds());
        return datetime;
    },
    add:function(){
        $(document).on('click', '#save', function () {
            var time = new Date($('#time').val());
            var remind = $('#remind').val();
            console.log(typeof (time));
            console.log(time);
            console.log(typeof($('#time').val()));
            console.log('提醒时间:'+remind);
            var remindDate;
            var remindStr;
            if(remind == '不提醒'){
                remindStr=null;
            }else if(remind == '1天前'){
                remindDate = new Date(time.getTime()-1*86400000);
                console.log(remindDate);
            }else if(remind == '2天前'){
                remindDate = new Date(time.getTime()-2*86400000);
                console.log(remindDate);
            }else if(remind == '3天前'){
                remindDate = new Date(time.getTime()-3*86400000);
                console.log(remindDate);
            }else if(remind == '一周前') {
                remindDate = new Date(time.getTime() - 7 * 86400000);
                console.log(remindDate);
            }
            remindStr = module.eventHandler.formatterDateTime(remindDate);
            console.log(remindStr);
            // remindStr = remindDate.getFullYear()+'-'+remindDate.getMonth()+'-'+remindDate.getDay()+' '+remindDate.getHours()+':'+remindDate.getMinutes()+':'+remindDate.getSeconds();
            var info = {
                data: {
                    staff_id:1,
                    customer_id:$(this).data('id'),
                    time:$('#time').val(),
                    content:$('#content').val(),
                    remind:remindStr
                },
                t: 'visit_plan',
                ai: true
            };
            var data = {
                m: module.data.m2,
                t:'visit_plan',
                v: JSON.stringify([info])
            };

            YT.insert({
                data: data,
                successCallback: function (data) {
                    if (data.status == 200) {
                        console.log(data);
                        window.location.reload();
                        // setTimeout(function () {
                        //     module.service.initList();
                        // }, 500);
                    } else {
                        $('#name').text(data.message);
                    }
                }
            });
        });
    },
    edit:function(){

    }
};