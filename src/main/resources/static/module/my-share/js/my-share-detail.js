var listManager = {};
var messageCommmon = {};

listManager.data = {
    mid:-1,
    currentPopId:-1,
    recordId:0
};
var pager2 = {
    loading: false,
    page: 1,
    rows: 15
};
$(function () {
    listManager.service.initControls();
    listManager.eventHandler.handleEvents();
});

listManager.service = {
    initControls: function () {
        listManager.data.user_id = getUrlParam("userid");
        listManager.data.mid = getUrlParam('msgid');
        var self = this;
        self.getUserInfo(function (user) {
            listManager.data.user = user;
            listManager.service.initGrid();
        });
    },
    // 初始化列表
    initGrid: function () {
        $.showLoading('加载中，请稍后...');
        $.ajax({
            type: 'post',
            url: "/message/shareDetail?userId="+listManager.data.user_id+"&messageId="+listManager.data.mid,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    listManager.service.getHtmlListStr(data);//列表的方式显示
                    $.hideLoading();
                }else{
                    $.alert(result.msg);
                }
            }
        });
    },
    getUserInfo: function (callback) {
        var self = this;
        $.ajax({
            type: 'get',
            url: "/staff/self?userId="+listManager.data.user_id,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    callback(data);
                }else{
                    $.alert(result.msg);
                }
            }
        });
    },
    // getDefaultFilter: function () {
    //     return [
    //         {field: 'corpid', value: '' + YT.getCorpId(), operator: '=', relation: 'AND'},
    //         {field: 'staffId', value: listManager.data.user.id, operator: '=', relation: 'AND'},
    //         {field: 'messageId', value: listManager.data.mid, operator: '=', relation: 'AND'}
    //     ];
    // },
    // getSearchData: function () {
    //     return {
    //         userid: listManager.data.user_id,
    //         messageid: listManager.data.mid
    //     };
    // },
    //列表展示
    getHtmlListStr: function (data) {
        var html = '';
        if (data.length > 0) {
            $('head title').html(listManager.service.cutStr(data[0].titleText,16));
            for (var i = 0; i < data.length; i++) {
                var sameId = data[i].sameId;
                var dataCustonerId = data[i].shareId+data[i].messageId;
                var dispOrder = data[i].dispOrder;
                var person = '';
                var address = data[i].city || '';
                var personFlag = false;
                if (parseInt(data[i].customerId) == -1) {  //匿名用户
                    person = '匿名用户'+dataCustonerId;
                    /*if (dispOrder == data.object[i].customerId) {
                     person = '匿名用户'+dataCustonerId;
                    } else {
                        person = '匿名用户'+dispOrder;
                    }*/
                } else {
                    person = data[i].customerName;
                    personFlag = true;
                }
                var readInfo = data[i].readInfo;
                var currentArray = [];
                var viewTime = 0;
                var pageShowNum = 1;
                var showTime = '';
                function getFlexItem(time,index){
                    return '<div class="flex-item">' +
                        '<div class="flex-item-content" style="background-color: '+(time?"#43b1d0":"#aaa")+'">' +
                        '<span style="font-weight: 600;">第'+index+'页：</span>' +
                        '<span style="font-weight: 600;">'+listManager.service.formatSeconds(time)+'</span>' +
                        '</div>'+
                        '</div>';
                }
                if (data[i].msgType == 1) {
                    currentArray.push(viewTime);
                    viewTime = data[i].viewTime - 0;
                    showTime += getFlexItem(viewTime,1);
                } else if (data[i].msgType == 5 || data[i].msgType == 2) {
                    currentArray = JSON.parse(readInfo || '[0]');//阅读信息
                    for (var m = 0; m < currentArray.length; m++) {
                        var time = parseInt(currentArray[m]);
                        viewTime += time;
                        showTime += getFlexItem(time,(m+1));
                    }
                    pageShowNum = currentArray.length;
                }
                html+='<div class="weui-media-box weui-media-box_text"> ' +
                    /*'<h4 class="weui-media-box__title">'+person+'('+address+')</h4> ' +*/
                    '<p class="weui-media-box__desc">' +
                    '<i class="iconfont" style="color:#bbb">&#xe008;</i>  ';
                if(!personFlag){
                    html+='<a href="javascript:;" class="new-c" data-id="'+dataCustonerId+'"><span style="font-size:14px;font-weight: 600;">'+
                        person+'</span>[+]</a>';
                }else{
                    html+='<span style="font-size:14px;color: #666;font-weight: 600;">'+
                        person+'</span>';
                }
                html+= '于'+new Date(data[i].openTime).Format("yyyy年MM月dd日") +
                    '在<span style="font-size:14px;color: #666;font-weight: 600;">' +address +'</span>浏览了'+
                    '<span style="font-size:14px;color: #666;font-weight: 600;">' + listManager.service.formatSeconds(viewTime)+'</span>' +
                    '并浏览过'+
                    '<span style="font-size:14px;color: #666;font-weight: 600;">'+data[i].times+'</span>'+
                    '次'+
                    '<div class="flex-box">'+showTime+'</div>'+
                    '</p> ' +
                    '</div>';
            }
        }
        $('.noMore').remove();
        $('#full-pop-content').html(html).after('<div class="noMore" style="margin-top: 10px;text-align: center">无更多记录</div>');
    },
    formatSeconds: function (value) {
        var second = value; // 秒
        var minute = second / 60; // 分
        var hour = minute / 60; // 小时
        var day = hour / 24; // 天
        var week = day / 7; // 周
        var _second = Math.floor(second % 60);
        var _minute = Math.floor(minute % 60);
        var _secondStr = _second == 0 ? '' : '' + (_second < 10 ? '0' + _second : _second) + '秒';
        var _minuteStr = _minute == 0 ? '' : '' + (_minute < 10 ? '0' + _minute : _minute) + '分';

        if (minute < 1) {
            return Math.floor(second) + '秒'/*(second == 0 ? '' : '秒')*/;
        } else if (hour < 1) {
            return Math.floor(minute) + '分' + _secondStr;
        } else if (day < 1) {
            return Math.floor(hour) + '小时' + _minuteStr + _secondStr;
        } else if (week < 1) {
            return Math.floor(day) + '天';
        }

    },
    cutStr: function (str, length) {
        if (str != null && str !== undefined) {
            if (str.length <= length) {
                return str;
            } else {
                return str.substr(0, length) + "...";
            }
        } else {
            return "";
        }
    }
};

listManager.eventHandler = {
    handleEvents: function () {
        this.handleNewCustomer();
        MessageComm.customer.init();
        this.handleSave();
    },
    handleNewCustomer:function(){
        $('#full-pop-content').on('click', '.new-c', function () {
            listManager.data.recordId = $(this).data('id');
            MessageComm.customer.recordId = listManager.data.recordId;
            MessageComm.customer.callback = function () {
                location.reload();
            };
            $('#popup_customer').popup();
        });
    },
    handleSave:function(){
        $('#save, #toolbar-save').click(function () {

            MessageComm.customer.triggerSaveBtn();
        });
    }
};