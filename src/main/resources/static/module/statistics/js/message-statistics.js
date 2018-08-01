var listManager = {};
var messageCommmon = {};
messageCommmon.service = {
    getUserInfo: function () {
        YT.getUserInfo(function (data) {
            messageCommmon.userInfo = data;
        });
    }
};

listManager.data = {
    m: 10180000
};
var pager2 = {
    loading: false,
    page: 1,
    rows: 20
};
$(function () {
    listManager.service.initControls();
    listManager.eventHandler.handleEvents();
    messageCommmon.service.getUserInfo();
    $('#tab2').infinite();
});

listManager.service = {
    initControls: function () {
        this.initGrid1();
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

    initGrid1:function(){
        this.initGrid1_1();
        this.initGrid1_2();
        this.initGrid1_3();
        this.initGrid1_4();
    },
    //热度之最
    initGrid1_1:function(){
        var filter = [
            {field: 'corpid', value: '' + YT.getUrlParam('corpid'), operator: '=', relation: 'AND'},
            {field: 'app_id', value: '' + YT.apps.sales_ass_id, operator: '=', relation: 'AND'},
            {field: 'status', value: 1, operator: '=', relation: 'AND'},
            {field: 'delFlag', value: 0, operator: '=', relation: 'AND'}
        ];

        var postData = {
            m: listManager.data.m,
            t: 'v_message_test',
            filter: JSON.stringify(filter),
            order: ' openCount desc,id desc',
            page: 1,
            rows: 3
        };
        YT.query({
            loading:false,
            data: postData,
            successCallback: function (data) {
                if (200 == data.status && data.object.items.length > 0) {
                    $('#list1_1').empty().append(listManager.service.getMessageStr(data.object.items));
                }else{
                    $('#list1_1').empty().append('<div  class="noMore" style="margin-top: 10px;text-align: center;">无更多数据</div>');
                }
            }
        });
    },
    //转发之最
    initGrid1_2:function(){
        var filter = [
            {field: 'corpid', value: '' + YT.getUrlParam('corpid'), operator: '=', relation: 'AND'},
            {field: 'app_id', value: '' + YT.apps.sales_ass_id, operator: '=', relation: 'AND'},
            {field: 'status', value: 1, operator: '=', relation: 'AND'},
            {field: 'delFlag', value: 0, operator: '=', relation: 'AND'}
        ];

        var postData = {
            m: listManager.data.m,
            t: 'v_message_transmit',
            filter: JSON.stringify(filter),
            order: ' transmitTimes desc,id desc ',
            page: 1,
            rows: 3
        };
        YT.query({
            loading:false,
            data: postData,
            successCallback: function (data) {
                if (200 == data.status && data.object.items.length > 0) {
                    $('#list1_2').empty().append(listManager.service.getMessageStr(data.object.items,'transmitTimes','转发次数'));
                }else{
                    $('#list1_2').empty().append('<div  class="noMore" style="margin-top: 10px;text-align: center;">无更多数据</div>');
                }
            }
        });
    },
    //热度员工之最
    initGrid1_3:function(){
        var filter = [
            {field: 'corpid', value: '' + YT.getUrlParam('corpid'), operator: '=', relation: 'AND'},
            {field: 'app_id', value: '' + YT.apps.sales_ass_id, operator: '=', relation: 'AND'}
        ];

        var postData = {
            m: listManager.data.m,
            t: 'v_staffs_hot',
            filter: JSON.stringify(filter),
            order: ' hotTimes desc,id asc ',
            page: 1,
            rows: 3
        };
        YT.query({
            loading:false,
            data: postData,
            successCallback: function (data) {
                if (200 == data.status && data.object.items.length > 0) {
                    $('#list1_3').empty().append(listManager.service.getPersonStr(data.object.items));
                }else{
                    $('#list1_3').empty().append('<div  class="noMore" style="margin-top: 10px;text-align: center;">无更多数据</div>');
                }
            }
        });
    },
    //转发客户之最
    initGrid1_4:function(){
        var filter = [
            {field: 'corpid', value: '' + YT.getUrlParam('corpid'), operator: '=', relation: 'AND'},
            {field: 'app_id', value: '' + YT.apps.sales_ass_id, operator: '=', relation: 'AND'}
        ];

        var postData = {
            m: listManager.data.m,
            t: 'v_customers_transmit',
            filter: JSON.stringify(filter),
            order: ' transmitTimes desc,id asc ',
            page: 1,
            rows: 3
        };
        YT.query({
            loading:false,
            data: postData,
            successCallback: function (data) {
                if (200 == data.status && data.object.items.length > 0) {
                    $('#list1_4').empty().append(listManager.service.getPersonStr(data.object.items,'transmitTimes','转发次数'));
                }else{
                    $('#list1_4').empty().append('<div  class="noMore" style="margin-top: 10px;text-align: center;">无更多数据</div>');
                }
            }
        });
    },

    initGrid2: function (otherFilter) {
        var noMore =
            '<div  class="noMore" style="margin-top: 10px;text-align: center;">' +
            '无更多记录' +
            '</div> ';
        $.showLoading('加载中，请稍后...');
        var postData = this.initSearch(otherFilter);
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
    initSearch: function (otherFilter) {
        var filter = [
            {field: 'corpid', value: '' + YT.getUrlParam('corpid'), operator: '=', relation: 'AND'},
            {field: 'app_id', value: '' + YT.apps.sales_ass_id, operator: '=', relation: 'AND'},
            {field: 'status', value: 1, operator: '=', relation: 'AND'},
            {field: 'delFlag', value: 0, operator: '=', relation: 'AND'}
        ];

        if (otherFilter) {
            filter.push({field: 'id', value: '', operator: 'in (' + otherFilter + ')', relation: 'AND'});
        }

        return {
            m: listManager.data.m,
            t: 'v_message_test',
            filter: JSON.stringify(filter),
            order: ' id desc',
            page: pager2.page,
            rows: pager2.rows
        };
    },
    getMessageStr :function(items,timesName,timesNameTxt){
        var str = '';
        for (var i = 0; i < items.length; i++) {
            var id = items[i].id;
            var titleData = items[i].titleText;
            var personCreate = items[i].createUser;
            var dateCreate = new Date(items[i].createTime).Format("yyyy-MM-dd");
            var openCount = items[i].openCount;
            if(timesName){
                openCount = items[i][''+timesName];
            }
            if (openCount == null || openCount == '') {
                openCount = 0;
            }
            str += '<a class="weui-cell weui-cell_access detail" data-id="' + id + '" data-type="' + items[i].msgType + '" href="javascript:;"> ' +
                '<div class="weui-cell__bd"> ' +
                '<p>' + listManager.service.cutStr(titleData, 13) + '</p> ' +
                '</div> ' +
                '<div class="weui-cell__ft"> ' +
                '<span style="font-size: 13px;color:#666666;">'+(timesNameTxt?timesNameTxt:"点击热度")+'：</span><span style="color:red;">' +
                openCount + '</span>' +
                '</div> ' +
                '</a>';
        }
        return str;
    },
    getMessageStr2 :function(items,timesName,timesNameTxt){
        var str = '';
        for (var i = 0; i < items.length; i++) {
            var id = items[i].id;
            var titleData = items[i].titleText;
            var dateCreate = new Date(items[i].createTime).Format("yyyy-MM-dd");
            var openCount = items[i].openCount;
            if(timesName){
                openCount = items[i][''+timesName];
            }
            if (openCount == null || openCount == '') {
                openCount = 0;
            }
            str += '<a class="weui-cell weui-cell_access detail" data-id="' + id + '" data-type="' + items[i].msgType + '" href="javascript:;"> ' +
                '<div class="weui-cell__bd"> ' +
                '<p>' + listManager.service.cutStr(titleData, 14) + '</p> ' +
                '</div> ' +
                '<div class="weui-cell__ft"> ' +
                '<span style="font-size: 13px;color:#666666;">' + dateCreate + '</span>' +
                '</div> ' +
                '</a>';
        }
        return str;
    },
    getPersonStr :function(items,timesName,timesNameTxt){
        var str = '';
        for (var i = 0; i < items.length; i++) {
            var id = items[i].id;
            var name = items[i].name;
            var hotTimes = items[i].hotTimes;
            if(timesName){
                hotTimes = items[i][''+timesName];
            }
            if (hotTimes == null || hotTimes == '') {
                hotTimes = 0;
            }
            var iconClass = '';
            switch(i){
                case 0:
                    iconClass = '#icon-jichutubiao_jinpai';
                    break;
                case 1:
                    iconClass = '#icon-jichutubiao_jinpaifuben';
                    break;
                case 2:
                    iconClass = '#icon-jichutubiao_jinpaifuben1';
                    break;
            }
            str += '<div class="weui-cell" data-id="' + id + '"> ' +
                '<div class="weui-cell__hd"><svg aria-hidden="true" style="width:30px;height:24px;margin-right:5px;display:block">' +
                '<use xlink:href="'+iconClass+'"></use>' +
                '</svg></div> ' +
                '<div class="weui-cell__bd"> ' +
                '<p>'+name+'</p> ' +
                '</div> ' +
                '<div class="weui-cell__ft"> ' +
                '<span style="font-size: 13px;color:#666666;">'+(timesNameTxt?timesNameTxt:"分享热度")+'：</span>' +
                '<span style="color:red;">' + hotTimes + '</span>' +
                '</div> ' +
                '</div>';
        }
        return str;
    }
};

listManager.eventHandler = {
    handleEvents: function () {
        this.handleClickTab();
        this.handleDetail();
        this.handleInfinite();
        this.handleRefresh();
    },
    handleClickTab:function(){
        $('.weui-navbar__item').click(function(){
            var self = this;
            if(!$(self).is('.weui-bar__item--on')){
                var id = parseInt($(self).attr('href').substring(4));
                switch(id)
                {
                    case 1:
                        listManager.service.initGrid1_1();
                        listManager.service.initGrid1_2();
                        listManager.service.initGrid1_3();
                        listManager.service.initGrid1_4();
                        break;
                    case 2:
                        $("#more2").empty();
                        listManager.service.initGrid2();
                        break;
                    default: break;
                }
            }

        });
    },
    handleInfinite: function () {
        $('#tab2').infinite().on("infinite", function () {
            if (pager2.loading) return;
            pager2.loading = true;
            $('#infinite2').show();
            listManager.service.initGrid2();
        });
    },
    handleRefresh:function(){
        $('#tab2').pullToRefresh({
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
                $('#tab2').pullToRefreshDone();
            },
            distance: 50 /* 下拉刷新的触发距离， 注意，如果你重新定义了这个值，那么你需要重载一部分CSS才可以，请参考下面的自定义样式部分 */
        });
    },
    handleDetail: function () {
        var documentList = ['#list1_1','#list1_2','#list2'];
        for(var i =0;i<documentList.length;i++){
            $(''+documentList[i]).on('click', '.detail', function () {
                var mId = $(this).data('id'),type = $(this).data('type');
                window.location.href = 'message-statistics-detail.html'+YT.setUrlParams({
                        mId:mId,
                        type:type
                    });
            });
        }
    }
};