var listManager = listManager || {};

listManager.data = $.extend({
    user_id:getUrlParam("userid"),
    customer_id:getUrlParam("customerid"),
    dataId:-1,
    dataIdList:[],
    currentPopId:-1,
    lastSlide:-1
},listManager.data || {});
var pager = {
    loading: false,
    page: 1,
    size: 20
};
$(function () {
    listManager.service.initControls();
    listManager.eventHandler.handleEvents();
});
listManager.service = $.extend({
    initControls: function () {
        if(listManager.data.myFlag){
            this.getUserInfo(function (user) {
                listManager.data.user = user;
                listManager.service.initGrid();
            });
        }else{
            listManager.service.initGrid();
        }
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
    cutStr: function (str, length) {
        if(str){
            if (str.length <= length) {
                return str;
            } else {
                return str.substr(0, length) + "...";
            }
        }else{
            return '';
        }
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
            return Math.floor(second) + '秒';
        } else if (hour < 1) {
            return Math.floor(minute) + '分' + _secondStr;
        } else if (day < 1) {
            return Math.floor(hour) + '小时' + _minuteStr + _secondStr;
        } else if (week < 1) {
            return Math.floor(day) + '天';
        }

    },
    // 初始化列表
    initGrid: function () {
        var noMore =
            '<div  class="noMore" style="margin-top: 10px;text-align: center;">' +
            '无更多记录' +
            '</div> ';
        var dataFilter = listManager.service.getSearchData();
        $.showLoading('加载中，请稍后...');
        $.ajax({
            type: 'post',
            url: "/customer/readMessage",
            data:JSON.stringify(dataFilter),
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if (result.code == 0) {
                    var data = result.data;
                    console.log("data.length:"+data.length);
                    if (data.length > 0) {
                        listManager.service.getHtmlListStr(data);
                    }
                    else {
                        $("#more").html(noMore);
                        pager.loading = true;
                        console.log("pager.loading:   "+pager.loading);
                    }
                    $.hideLoading();
                }
            }
        });
    },
    getSearchData: function () {
        var user_id = null;
        var customer_id = listManager.data.customer_id;
        if(listManager.data.myFlag){
            user_id = listManager.data.user_id;
        }
        return {
            userId:user_id,
            customerId:customer_id,
            page:pager.page,
            size:pager.size
        };
    },
    //列表展示
    getHtmlListStr: function (data) {
        var str = '';
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var id = item.messageId;
                var msgType = item.msgType;
                var titleData = item.titleText;
                var openCount = item.openCount;
                var shareCount = item.transmitTimes;
                if (openCount == null || openCount == '') {
                    openCount = 0;
                }
                if (shareCount == null || shareCount == '') {
                    shareCount = 0;
                }
                str += '<a class="weui-cell weui-cell_access detail detail_'+id+'" data-user="'+listManager.data.user_id+'" data-id="' + id + '" href="javascript:;"> ' +
                    '<div class="weui-cell__bd"> ' +
                    '<p>' + listManager.service.cutStr(titleData, 26) + '</p> ' +
                    '</div> ' +
                    '<div class="weui-cell__ft"> ' +
                    '<div style="height:20px;"><span style="font-size: 13px;color:#666666;">点击：</span><span style="color:red;">' +openCount + '</span></div>' +
                    '<div style="height:20px;"><span style="font-size: 13px;color:#666666;">转发：</span><span style="color:red;">' +shareCount + '</span></div>' +
                    '</div> ' +
                    '</a>';
                str += '<div class="weui-cell weui-cell_access detail_content detail_content_'+id+'_'+listManager.data.user_id+'" style="display: none"> ' +
                    '<div class="weui-cell__bd"> ' +
                    '</div> ' +
                    '</div>';
            }
        }
        $('#full-pop-content').nextAll().remove();
        $('#full-pop-content').html(str).after('<div class="weui-cell__bd" style="text-align: center">无更多记录</div>');
    },

    initDetailContent:function(){
        var userId;
        if(listManager.data.myFlag){
            userId = listManager.data.user_id;
        }
        var postData = {
            userId:userId,
            messageId:listManager.data.lastSlide,
            customerId:listManager.data.customer_id
        };
        var noMore =
            '<div  class="noMore" style="margin-top: 10px;text-align: center;">' +
            '无更多记录' +
            '</div> ';
        $.showLoading('加载中，请稍后...');
        $.ajax({
            type: 'post',
            url: "/message/shareDetail",
            data:JSON.stringify(postData),
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if (result.code == 0) {
                    var data = result.data;
                    console.log("data.length:"+data.length);
                    if (data.length > 0) {
                        listManager.service.getDetailContentListStr(data);//列表的方式显示
                    }
                    else {
                        $("#more").html(noMore);
                        pager.loading = true;
                        console.log("pager.loading:   "+pager.loading);
                    }
                    $.hideLoading();
                }
            }
        });
        // YT.query({
        //     loading:false,
        //     data: postData,
        //     successCallback: function (data) {
        //         listManager.service.getDetailContentListStr(data);//列表的方式显示
        //         $.hideLoading();
        //     }
        // });
    },
    //列表展示
    getDetailContentListStr: function (data) {
        var html = '';
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var address = data[i].city || '';
                var readInfo = data[i].readInfo;
                var messageType = data[i].msgType;
                var openCount = data[i].openCount;
                var shareCount = data[i].transmitTimes;
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
                if (messageType == 1) {
                    currentArray.push(viewTime);
                    viewTime = data[i].viewTime - 0;
                    showTime += getFlexItem(viewTime,1);
                } else if (messageType == 5 || messageType == 2) {
                    currentArray = JSON.parse(readInfo || '[0]');//阅读信息
                    for (var m = 0; m < currentArray.length; m++) {
                        var time = parseInt(currentArray[m]);
                        viewTime += time;
                        showTime += getFlexItem(time,(m+1));
                    }
                    pageShowNum = currentArray.length;
                }
                html+='<div class="weui-media-box weui-media-box_text" style="padding-top:5px;margin-bottom: 5px"> ' +
                    '<p class="weui-media-box__desc">' +
                    '于<span style="font-size:14px;color: #666;font-weight: 600;">'+new Date(data[i].openTime).Format("yyyy年MM月dd日") +'</span>'+
                    '在<span style="font-size:14px;color: #666;font-weight: 600;">' +address +'</span>浏览了'+
                    '<span style="font-size:14px;color: #666;font-weight: 600;">' + listManager.service.formatSeconds(viewTime)+'</span>';
                if(openCount>1){
                    html+='浏览过'+'<span style="font-size:14px;color: #666;font-weight: 600;">' + openCount+'次</span>'
                }
                if(shareCount){
                    html+='并转发了'+'<span style="font-size:14px;color: #666;font-weight: 600;">' + shareCount+'次</span>'
                }
                html+='<div class="flex-box">'+showTime+'</div>'+
                    '</p> ' +
                    '</div>';
            }
        }
        $('.detail_content_'+listManager.data.lastSlide+'_'+listManager.data.user_id+' .weui-cell__bd').empty().html(html);
    }
},listManager.service || {});
listManager.eventHandler = $.extend({
    handleEvents: function () {
        this.handleClickDetail();
    },
    hideDetail:function(){
        $('#full-pop-content .detail').each(function(){
            $(this).removeClass('active');
        });
        $('#full-pop-content .detail_content').each(function(){
            $(this).hide();
        });
    },
    showDetail:function(id){
        $('.detail_'+id).addClass('active');
        listManager.service.initDetailContent();
        $('.detail_content_'+id+'_'+listManager.data.user_id).fadeIn(300);
    },
    handleClickDetail:function(){
        $('#full-pop-content').on('click','.detail',function(){
            var self = this;
            var id = $(self).data('id');
            var userId = $(self).data('user');
            if(listManager.data.lastSlide == id && listManager.data.lastDataId == userId){
                listManager.data.lastSlide = -1;
                listManager.eventHandler.hideDetail();
            }else{
                listManager.data.lastSlide = id;
                listManager.data.lastDataId = userId;
                listManager.eventHandler.hideDetail();
                listManager.eventHandler.showDetail(id);
            }

        });
    }
},listManager.eventHandler || {});