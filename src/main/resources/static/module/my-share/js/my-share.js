var listManager = {};
var messageCommmon = {};

listManager.data = {
    m: 10180000,
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
    $(document.body).infinite();
});

listManager.service = {
    initControls: function () {
        YT.getUserInfo(function (user) {
            listManager.data.user = user;
            listManager.service.initGrid2();
        });
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
    },
    initGrid2: function () {
        var noMore =
            '<div  class="noMore" style="margin-top: 10px;text-align: center;">' +
            '无更多记录' +
            '</div> ';
        $.showLoading('加载中，请稍后...');
        var postData = this.initSearch();
        YT.query({
            loading:false,
            data: postData,
            successCallback: function (data) {
                if (200 == data.status) {
                    if (pager2.page == 1) {
                        $("#more2 .noMore").remove();
                    }
                    pager2.page = data.object.idx + 1;
                    $.closePopup();
                    $("#list2").append(listManager.service.getMessageStr2(data.object.items));
                    $.hideLoading();
                    if (data.object.idx >= data.object.pageCount) {
                        //最后一页
                        pager2.loading = true;
                        $('#infinite2').hide();
                        $("#more2").append(noMore);
                        return;
                    }
                } else {
                    pager2.loading = true;
                    $('#infinite2').hide();
                    $("#more2").append(noMore);
                    return;
                }
                pager2.loading = false;
            }
        });
    },
    initSearch: function () {
        var filter = [
            {field: 'staffId', value: '' + listManager.data.user.id, operator: '=', relation: 'AND'},
            {field: 'corpid', value: '' + YT.getUrlParam('corpid'), operator: '=', relation: 'AND'},
            {field: 'status', value: 1, operator: '=', relation: 'AND'},
            {field: 'app_id', value: '' + YT.apps.sales_ass_id, operator: '=', relation: 'AND'}
        ];

        return {
            m: listManager.data.m,
            t: 'v_message_test_my',
            filter: JSON.stringify(filter),
            order: ' id desc',
            page: pager2.page,
            rows: pager2.rows
        };
    },
    getMessageStr2 :function(items){
        var str = '';
        for (var i = 0; i < items.length; i++) {
            var id = items[i].id;
            var titleData = items[i].titleText;
            var openCount = items[i].openCount;
            var shareCount = items[i].shareCount;
            if (openCount == null || openCount == '') {
                openCount = 0;
            }
            if (shareCount == null || shareCount == '') {
                shareCount = 0;
            }
            var toFlag = 1;
            if(openCount == 0 && shareCount == 0){
                toFlag = 0;
            }
            str += '<a class="weui-cell weui-cell_access detail" data-to="'+toFlag+'" data-id="' + id + '" data-type="' + items[i].msgType + '" href="javascript:;"> ' +
                '<div class="weui-cell__bd"> ' +
                '<p>' + listManager.service.cutStr(titleData, 26) + '</p> ' +
                '</div> ' +
                '<div class="weui-cell__ft"> ' +
                '<div style="height:20px;"><span style="font-size: 13px;color:#666666;">转发：</span><span style="color:red;">' +shareCount + '</span></div>' +
                '<div style="height:20px;"><span style="font-size: 13px;color:#666666;">点击：</span><span style="color:red;">' +openCount + '</span></div>' +
                '</div> ' +
                '</a>';
        }
        return str;
    }
};

listManager.eventHandler = {
    handleEvents: function () {
        this.handlePopUp();
        this.handleInfinite();
        this.handleRefresh();
        MessageComm.customer.init();
        this.handleSave();
    },
    handleInfinite: function () {
        $(document.body).infinite().on("infinite", function () {
            if (pager2.loading) return;
            pager2.loading = true;
            $('#infinite2').show();
            listManager.service.initGrid2();
        });
    },
    handleRefresh:function(){
        $(document.body).pullToRefresh({
            onRefresh: function () {
                pager2 = {
                    loading: false,
                    page: 1,
                    rows: 20
                };
                $("#list2").empty();
                $("#more2").empty();
                $('#infinite2').hide();
                listManager.service.initGrid2();
                $(document.body).pullToRefreshDone();
            },
            distance: 50 /* 下拉刷新的触发距离， 注意，如果你重新定义了这个值，那么你需要重载一部分CSS才可以，请参考下面的自定义样式部分 */
        });
    },
    handlePopUp: function () {
        $('#list2').on('click', '.detail', function () {
            var self = this;
            var toFlag = $(self).data('to');
            if(''+toFlag == '0'){
                $.alert('无记录');
            }else{
                location.href= 'my-share-detail.html'+YT.setUrlParams({
                        mid:$(self).data('id')
                    });
            }
        });
    },
    handleSave:function(){
        $('#save').click(function () {
            MessageComm.customer.recordId = listManager.data.recordId;
            MessageComm.customer.triggerSaveBtn();
        });
    }
};