var listManager = listManager || {};

listManager.data = $.extend({
    m: 1010000,
    dataId:-1,
    dataIdList:[],
    currentPopId:-1,
    lastSlide:-1
},listManager.data || {});
var pager = {
    loading: false,
    page: 1,
    rows: 20
};
$(function () {
    listManager.service.initControls();
    listManager.eventHandler.handleEvents();
});
listManager.service = $.extend({
    initControls: function () {
        listManager.data.dataId = YT.getUrlParam('dataId');
        if(listManager.data.myFlag){
            YT.getUserInfo(function (user) {
                listManager.data.user = user;
                listManager.service.initGrid();
            });
        }else{
            listManager.service.initGrid();
        }
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
        var dataFilter = listManager.service.getSearchData();
        $.showLoading('加载中，请稍后...');
        YT.query({
            loading:false,
            data: dataFilter,
            successCallback: function (data) {
                listManager.service.getHtmlListStr(data);//列表的方式显示
                $.hideLoading();
            }
        });
    },
    getDefaultFilter: function () {
        var filter = [
            {field: 'customerId', value: listManager.data.dataId, operator: '=', relation: 'AND'},
            {field: 'status', value: 1, operator: '=', relation: 'AND'}
        ];
        if(listManager.data.myFlag){
            filter.push({field: 'staffId', value: listManager.data.user.id, operator: '=', relation: 'AND'});
        }
        return filter;
    },
    getSearchData: function () {
        var filter = listManager.service.getDefaultFilter();
        var t = 'v_customers_all_msg';
        if(listManager.data.myFlag){
            t = 'v_customers_my_msg';
        }
        return {
            m: listManager.data.m,
            t: t,
            filter: JSON.stringify(filter),
            order: " messageId desc "
        };
    },
    //列表展示
    getHtmlListStr: function (data) {
        var str = '';
        if (data.status == 200 && data.object.length > 0) {
            for (var i = 0; i < data.object.length; i++) {
                var item = data.object[i];
                var id = item.messageId;
                var msgType = item.msgType;
                var titleData = item.titleText;
                var openCount = item.openCount;
                var shareCount = item.shareCount;
                if (openCount == null || openCount == '') {
                    openCount = 0;
                }
                if (shareCount == null || shareCount == '') {
                    shareCount = 0;
                }
                str += '<a class="weui-cell weui-cell_access detail detail_'+id+'" data-user="'+listManager.data.dataId+'" data-id="' + id + '" data-type="' + msgType + '" href="javascript:;"> ' +
                    '<div class="weui-cell__bd"> ' +
                    '<p>' + listManager.service.cutStr(titleData, 26) + '</p> ' +
                    '</div> ' +
                    '<div class="weui-cell__ft"> ' +
                    '<div style="height:20px;"><span style="font-size: 13px;color:#666666;">点击：</span><span style="color:red;">' +openCount + '</span></div>' +
                    '<div style="height:20px;"><span style="font-size: 13px;color:#666666;">转发：</span><span style="color:red;">' +shareCount + '</span></div>' +
                    '</div> ' +
                    '</a>';
                str += '<div class="weui-cell weui-cell_access detail_content detail_content_'+id+'_'+listManager.data.dataId+'" style="display: none"> ' +
                    '<div class="weui-cell__bd"> ' +
                    '</div> ' +
                    '</div>';
            }
        }
        $('#full-pop-content').nextAll().remove();
        $('#full-pop-content').html(str).after('<div class="weui-cell__bd" style="text-align: center">无更多记录</div>');
    },

    initDetailContent:function(){
        var filter = [
            {field: 'messageId', value: listManager.data.lastSlide, operator: '=', relation: 'AND'},
            {field: 'customerId', value: listManager.data.dataId, operator: '=', relation: 'AND'}
        ];
        if(listManager.data.myFlag){
            filter.push({field: 'staffId', value: listManager.data.user.id, operator: '=', relation: 'AND'});
        }
        var postData = {
            m: listManager.data.m,
            t: 'v_customers_all_msg_record',
            filter: JSON.stringify(filter),
            order: " id "
        };
        $.showLoading('加载中，请稍后...');
        YT.query({
            loading:false,
            data: postData,
            successCallback: function (data) {
                listManager.service.getDetailContentListStr(data);//列表的方式显示
                $.hideLoading();
            }
        });
    },
    //列表展示
    getDetailContentListStr: function (data) {
        var html = '';
        if (data.status == 200 && data.object.length > 0) {
            for (var i = 0; i < data.object.length; i++) {
                var address = data.object[i].city || '';
                var readInfo = data.object[i].readInfo;
                var messageType = data.object[i].msgType;
                var shareCount = data.object[i].shareCount;
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
                    viewTime = data.object[i].viewTime - 0;
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
                    '于<span style="font-size:14px;color: #666;font-weight: 600;">'+new Date(data.object[i].openTime).Format("yyyy年MM月dd日") +'</span>'+
                    '在<span style="font-size:14px;color: #666;font-weight: 600;">' +address +'</span>浏览了'+
                    '<span style="font-size:14px;color: #666;font-weight: 600;">' + listManager.service.formatSeconds(viewTime)+'</span>';
                if(shareCount){
                    html+='并转发了'+'<span style="font-size:14px;color: #666;font-weight: 600;">' + shareCount+'次</span>'
                }
                html+='<div class="flex-box">'+showTime+'</div>'+
                    '</p> ' +
                    '</div>';
            }
        }
        $('.detail_content_'+listManager.data.lastSlide+'_'+listManager.data.dataId+' .weui-cell__bd').empty().html(html);
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
        $('.detail_content_'+id+'_'+listManager.data.dataId).fadeIn(300);
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