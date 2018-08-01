var listManager = listManager || {};

listManager.data = $.extend({
    m: 1010000,
    dataList:[],
    extraFilter:false,
    extraFilterData:[],
    charIndexArr:[],
    charIndexMap_1:{'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,
        'A':10,'B':11,'C':12,'D':13,'E':14,'F':15,'G':16,'H':17,'I':18,'J':19,
        'K':20,'L':21,'M':22,'N':23,'O':24,'P':25,'Q':26,'R':27,'S':28,'T':29,
        'U':30,'V':31,'W':32,'X':33,'Y':34,'Z':35,'other':36},
    charIndexMap_2:['0','1','2','3','4','5','6','7','8','9',
        'A','B','C','D','E','F','G','H','I','J',
        'K','L','M','N','O','P','Q','R','S','T',
        'U','V','W','X','Y','Z','other']
},listManager.data || {});
var pager = {
    loading: false,
    lastPage:false,
    pageCount:0,
    page: 1,
    rows: 8
};
var noFlag = true;
var noMore =
    '<div  class="noMore" style="margin-top: 10px;text-align: center;">' +
    '无更多数据' +
    '</div> ';
var noData =
    '<div  class="noData" style="margin-top: 10px;text-align: center;">' +
    '无数据' +
    '</div> ';
$(function () {
    listManager.service.initControls();
    listManager.eventHandler.handleEvents();
    $(document.body).infinite();
});
listManager.service = $.extend({
    initControls: function () {
        if(listManager.data.myFlag){
            YT.getUserInfo(function (user) {
                listManager.data.user = user;
                listManager.service.initData();
                listManager.service.initSearchDiv();
            });
        }else{
            listManager.service.initData();
            listManager.service.initSearchDiv();
        }
    },
    initData: function () {
        $.showLoading('加载中，请稍后...');
        var postData = this.initSearch();
        YT.query({
            loading:false,
            data: postData,
            successCallback: function (data) {
                if (200 == data.status) {
                    if (pager.page == 1) {
                        $("#more").empty();
                    }
                    pager.page = data.object.idx + 1;
                    pager.pageCount = data.object.pageCount;
                    pager.lastPage = data.object.idx >= data.object.pageCount;
                    $.closePopup();
                    listManager.service.getCustomerStr(data.object.items);
                    $.hideLoading();
                    if (pager.lastPage) {
                        //最后一页
                        pager.loading = true;
                        $('#infinite').hide();
                        listManager.service.initNo();
                        return;
                    }
                } else {
                    pager.loading = true;
                    pager.lastPage = true;
                    $('#infinite').hide();
                    listManager.service.initNo();
                    return;
                }
                pager.loading = false;
            }
        });
    },
    initSearch: function () {
        var filter = [
            {field: 'corpid', value: '' + YT.getCorpId(), operator: '=', relation: 'AND'},
            {field: 'app_id', value: '' + YT.apps.sales_ass_id, operator: '=', relation: 'AND'}
        ];
        var groupId = YT.getUrlParam('groupid');
        if(groupId && ''+groupId !== '-1'){
            filter.push({field: 'group_id', value: '' + groupId, operator: '=', relation: 'AND'});
        }
        if(listManager.data.myFlag){
            filter.push({field: 'staff_id', value: '' + listManager.data.user.id, operator: '=', relation: 'AND'});
        }
        if(listManager.data.extraFilter && listManager.data.extraFilterData.length >0 ){
            filter.push.apply(filter,listManager.data.extraFilterData);
        }
        var t = 'v_customers_all';
        if(listManager.data.myFlag){
            t = 'v_customers_my';
        }
        return {
            m: listManager.data.m,
            t: t,
            filter: JSON.stringify(filter),
            order: " `name`='',`fpy` ASC,`id` ASC ",
            page: pager.page,
            rows: pager.rows
        };
    },
    clearList:function(flag,pageFlag){
        $("#list").empty();
        $("#more").empty();
        $('#infinite').hide();
        if(pageFlag){
        }else{
            pager = {
                loading: false,
                lastPage : false,
                pageCount: 0,
                page: 1,
                rows: 8
            };
            listManager.data.dataList=[];
            $('#infinite').show();
        }
        listManager.data.charIndexArr=[];
        if(flag){
            $(".weui-search-bar").removeClass("weui-search-bar_focusing").find(".weui-search-bar__input").val("").blur();
        }
    },
    initNo:function(){
        if(noFlag){
            $("#more").html(noMore);
        }else{
            $("#more").html(noData);
        }
    },
    iGetInnerText: function (str) {
        return str.replace(/[\r\n]/g, ""); //去掉回车换行
    },
    initSearchDiv:function(){
        $('.searchInput')
            .on('keydown',function(e){
                if(e.keyCode == 13) {
                    e.preventDefault();
                    listManager.service.triggerSearch();
                }
            });
        $('.weui-icon-clear').unbind('click');
        $(document).on("click", ".weui-icon-clear", function(e) {
            listManager.data.extraFilter = false;
            listManager.data.extraFilterData = [];
            listManager.service.clearList();
            listManager.service.initData();
        }).on("click", ".weui-search-bar__search-btn", function(e) {
            listManager.service.triggerSearch();
        })
    },
    triggerSearch:function(){
        var val = listManager.service.iGetInnerText($.trim($('.searchInput').val()));
        var val_flag = val != '' && val != '搜索';
        var filter = [];
        var innerFilter_1 = [];
        if (val_flag) {
            if (val == '未' || val == '填' || val == '写' || val == '未填' || val == '填写' || val == '未填写') {
                innerFilter_1.push({field: "name", value: "", operator: "=\'\'", relation: "OR"});
            }
            innerFilter_1.push({
                field: 'name',
                value: '%' + val + '%',
                operator: 'like',
                relation: 'OR'
            });
            innerFilter_1.push({
                field: 'mobile',
                value: '%' + val + '%',
                operator: 'like',
                relation: 'AND'
            });
            filter.push(innerFilter_1);
        }
        if (val_flag) {
            listManager.service.clearList();
            listManager.data.extraFilter = true;
            listManager.data.extraFilterData = filter;
            listManager.service.initData();
        } else {
            listManager.service.clearList();
            listManager.data.extraFilter = false;
            listManager.data.extraFilterData = [];
            listManager.service.initData();
        }
    },
    getCustomerStr :function(items){
        if(pager.page > 0 && (pager.page-1) <= pager.pageCount){
            listManager.data.dataList.push.apply(listManager.data.dataList,items);
        }else{
            listManager.data.dataList = items;
            listManager.data.charIndexArr = [];
        }
        if(items.length <=0  && pager.lastPage){
            noFlag = false;
        }else{
            noFlag = true;
        }
        for (var i = 0; i < items.length; i++) {
            var str = '';
            var id = items[i].id;
            var avatar = items[i].avatar || "";
            if(avatar){
                avatar = '<img src="'+avatar+'" class="head-img"/>';
            }else{
                avatar = '<i class="iconfont" style="color:#bbb;font-size: 30px;line-height: 32px;">&#xe008;</i>'
            }
            var name = items[i].name || "未填写";
            var appendPY = listManager.service.getAppendPY('#list',name,items[i].fpy);
            var mobile = items[i].mobile || "";
            var department = items[i].department || "";
            var position = items[i].position || "";
            var remark = items[i].remark || "";
            var address = items[i].address || "";
            var email = items[i].email || "";
            var telephone = items[i].telephone || "";
            var webSite = items[i].webSite || "";
            var fax = items[i].fax || "";
            var openCount = items[i].openCount || 0;
            var shareCount = items[i].shareCount || 0;
            str += '<div class="weui-form-preview py_'+appendPY+'"> ' +
                '<div class="weui-form-preview__bd visit-detail">' +
                '<div class="weui-cell weui-cell_access customer customer_'+id+'" data-id="'+id+'" data-t="'+items[i].visit_plan_time+'"> ' +
                '<div class="weui-cell__bd"> ' +
                '<div class="flex-box-two"> ' +
                '<div class="flex-item-two">'+avatar+'</div> ' +
                '<div class="flex-item-two"><span class="name">'+name+'</span>&nbsp;&nbsp;<span class="phone">'+mobile+'</span></div> ' +
                '</div> ' +
                '<div class="flex-box-two con-box"> ';
            if(department){
                str += '<div class="flex-item-two"><span class="con department">'+department+'</span></div> ';
            }
            if(position){
                str += '<div class="flex-item-two"><span class="con position">'+position+'</span></div> ';
            }
            str += '</div><div class="flex-box-two con-box-two"> ';

            if(telephone){
                str += '<div class="flex-item-two"><span class="con">座机：'+telephone+'</span></div> ';
            }
            if(fax){
                str += '<div class="flex-item-two"><span class="con">传真：'+fax+'</span></div> ';
            }
            if(email){
                str += '<div class="flex-item-two"><span class="con">E-mail：'+email+'</span></div> ';
            }
            if(address){
                str += '<div class="flex-item-two"><span class="con">'+address+'</span></div> ';
            }
            if(webSite){
                str += '<div class="flex-item-two"><span class="con">'+webSite+'</span></div> ';
            }
            if(remark){
                str += '<div class="flex-item-two"><span class="con">('+remark+')</span></div> ';
            }
            str += '</div> ' +
                '</div>' +
                '<div class="weui-cell__ft"></div>' +
                '</div> </div> ' +
                '<div class="weui-form-preview__ft"> ';
            if(listManager.data.myFlag){
                str += '<a class="weui-form-preview__btn weui-form-preview__btn_primary edit" data-d="'+JSON.stringify(items[i]).replace(/"/g, "&quot;")+'" href="javascript:">编辑</a> ' +
                    '<a class="weui-form-preview__btn weui-form-preview__btn_primary visit-tip" href="javascript:" data-id="'+ id +'">提醒</a> ' +
                    '<a class="weui-form-preview__btn weui-form-preview__btn_primary visit-memo" href="javascript:" data-id="'+ id +'">备注</a>';
            }else{
                str += '<a class="weui-form-preview__btn weui-form-preview__btn_default visit-memo-list" href="javascript:" data-id="'+ id +'">查看备注</a> ';
            }
            var sumCount = 0 + openCount + shareCount;
            var openCountClass = openCount>0?'num-not-zero':'';
            var shareCountClass = shareCount>0?'num-not-zero':'';
            str += '<a class="weui-form-preview__btn weui-form-preview__btn_default view-detail '+(listManager.data.myFlag?"view-detail-my":"")+'" data-sumcount="'+sumCount+'" href="javascript:">浏览<span class="'+openCountClass+'">('+openCount+')</span>&nbsp;&nbsp;转发<span class="'+shareCountClass+'">('+shareCount+')</span></a> ';
            str += '</div> ';
            '</div>';
            $('.py_'+appendPY+':last').after(str);
        }
    },
    getAppendPY:function(ele,name,fpy){
        var id = '';
        if(name != '' && name != '未填写'){
            id = fpy;
        }else{
            id = 'other';
        }
        listManager.service.checkPYDiv(id,ele);
        return id;
    },
    checkPYDiv:function(id){
        var arr = listManager.data.charIndexArr;
        var id_index = listManager.data.charIndexMap_1[''+id];
        var prev_id = 0;
        var dif = id_index - prev_id;
        for(var i=0;i<arr.length;i++){
            if(arr[i] != id_index){
                var cur_dif = id_index - arr[i];
                if(cur_dif > 0 && cur_dif < dif){
                    prev_id = arr[i];
                    dif = cur_dif;
                }
            }
        }
        if($('.py_'+id).length <= 0){
            arr.push(id_index);
            if(prev_id != 0){
                $('.py_'+listManager.data.charIndexMap_2[prev_id]+':last').after('<div class="weui-form-preview py-div py_'+id+'" id="py_'+id+'"><span>'+id+'</span></div>');
            }else{
                $('#list').prepend('<div class="weui-form-preview py-div py_'+id+'" id="py_'+id+'"><span>'+id+'</span></div>');
            }
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

    }
},listManager.service || {});
listManager.eventHandler = $.extend({
    handleEvents: function () {
        this.handleRefresh();
        this.handleInfinite();
        this.handleOp();
    },
    handleInfinite: function () {
        $(document.body).infinite().on("infinite", function () {
            if (pager.loading) return;
            pager.loading = true;
            $('#infinite').show();
            listManager.service.initData();
        });
    },
    handleOp:function(){
        $('#list').on('click','.view-detail',function () {
            var self = this;
            var sumCount = $(self).data('sumcount');
            if(sumCount >0){
                var customer = $(self).parents('.weui-form-preview').find('.customer');
                var html ='customer-list-detail.html';
                if(listManager.data.myFlag){
                    html ='customer-list-my-detail.html';
                }
                location.href= html+YT.setUrlParams({
                    dataId:$(customer).data('id')
                });
            }else{
                $.alert('该客户无浏览转发记录!');
            }
        }).on('click','.edit',function () {
            var self = this;
            editCustomer.callback = function(){
                location.reload();
            };
            editCustomer.init(undefined,$(self).data('d'));
            $('#popup_customer').popup();
            $('#save, #toolbar-save').click(function () {
                editCustomer.triggerSaveBtn();
            });
        }).on('click','.visit-tip',function () {
            //$.alert('功能暂时未上线!');
            var $ele = $('.customer_' + $(this).data('id'));
            location.href = '/module/old-customer/new-visit-plan.html' + YT.setUrlParams({
                customer_id: $ele.data('id'),
                customer_name:$ele.find('.name').text(),
                company:$ele.find('.department').text()
            });
        }).on('click','.visit-memo',function () {
            //$.alert('功能暂时未上线!');
            var $ele = $('.customer_' + $(this).data('id'));
            location.href = '/module/old-customer/visit-log.html' + YT.setUrlParams({
                customer_id: $ele.data('id'),
                customer_name:$ele.find('.name').text(),
                company:$ele.find('.department').text(),
                visit_plan_time: $ele.data('t')
            });
        }).on('click','.visit-detail',function () {
            //$.alert('功能暂时未上线!');
            var $ele = $(this).find('.customer');
            location.href = '/module/old-customer/visit-detail-plan.html' + YT.setUrlParams({
                customer_id: $ele.data('id')
            });
        }).on('click','.visit-memo-list',function () {
            //$.alert('功能暂时未上线!');
            var $ele = $('.customer_' + $(this).data('id'));
            location.href = '/module/old-customer/memo-list.html' + YT.setUrlParams({
                customer_id: $ele.data('id')
            });
        });
    },
    handleRefresh:function(){
        $(document.body).pullToRefresh({
            onRefresh: function () {
                listManager.service.clearList(true);
                listManager.service.initData();
                $(document.body).pullToRefreshDone();
            }
        });
    }
},listManager.eventHandler || {});