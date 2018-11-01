var listManager = listManager || {};

listManager.data = $.extend({
    dataList:[],
    extraFilter:false,
    extraFilterData:'',
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
    size: 8
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
        oauth2();
        listManager.data.user_id = getUrlParam("userid");
        if(listManager.data.myFlag){
            this.getUserInfo(function (user) {
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
        $.ajax({
            type: 'post',
            url: "/customer/list/detail",
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
                        listManager.service.getCustomerStr(data);
                        $.hideLoading();
                    }
                    else {
                        $("#more").html(noMore);
                        pager.loading = true;
                        console.log("pager.loading:   "+pager.loading);
                    }
                    $(".weui-loadmore").hide();
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
    initSearch: function () {
        var searchInput = "";
        var userId = null;
        var groupId = getUrlParam("groupid");
        if(listManager.data.extraFilter && listManager.data.extraFilterData.length >0){
            searchInput = listManager.data.extraFilterData;
        }
        if(listManager.data.myFlag){
            userId = listManager.data.user_id;
        }
        return {
            userId:userId,
            searchInput:searchInput,
            groupId:groupId,
            page:pager.page,
            size:pager.size
        };
    },
    clearList:function(flag,pageFlag){
        $("#list").empty();
        $("#more").empty();
        html = "";
        $('#infinite').hide();
        if(pageFlag){
        }else{
            pager = {
                loading: false,
                lastPage : false,
                pageCount: 0,
                page: 1,
                size: 8
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
            listManager.service.clearList();
            listManager.data.extraFilter = true;
            listManager.data.extraFilterData = val;
            listManager.service.initData();
        } else {
            listManager.service.clearList();
            listManager.data.extraFilter = false;
            listManager.data.extraFilterData = '';
            listManager.service.initData();
        }
    },
    getCustomerStr :function(data){
        var html = "";
        for (var i = 0; i < data.length; i++) {
            html += '<div class="weui-form-preview">\n' +
                '<div class="weui-form-preview__bd visit-detail">\n' +
                '<div class="weui-cell weui-cell_access customer " data-id="'+data[i].id+'" >\n' +
                '<div class="weui-cell__bd">\n' +
                '<div class="flex-box-two">\n' +
                '<div class="flex-item-two"><i class="iconfont"\n' +
                'style="color:#bbb;font-size: 30px;line-height: 32px;"></i></div>\n' +
                '<div class="flex-item-two"><span class="name">' + data[i].name + '</span>&nbsp;&nbsp;<span class="phone">' + data[i].mobile + '</span>\n' +
                '</div>\n' +
                '</div>\n' +
                '<div class="flex-box-two con-box">\n' +
                '<div class="flex-item-two"><span class="con department">' + data[i].company + '</span></div>\n' +
                '</div>\n' +
                '<div class="flex-box-two con-box-two"></div>\n' +
                '</div>\n' +
                '<div class="weui-cell__ft"></div>\n' +
                '</div>\n' +
                '</div>\n' +
                '<div class="weui-form-preview__ft">' ;
            if(listManager.data.myFlag){
                html += '<a class="weui-form-preview__btn weui-form-preview__btn_primary edit" data-d="'+JSON.stringify(data[i]).replace(/"/g, "&quot;")+'" href="javascript:">编辑</a>' +
                '<a class="weui-form-preview__btn weui-form-preview__btn_primary visit-tip" href="javascript:" >提醒</a>\n' +
                '<a class="weui-form-preview__btn weui-form-preview__btn_primary visit-memo" href="javascript:" >备注</a>'+
                '<a class="weui-form-preview__btn weui-form-preview__btn_primary preference" href="javascript:" >偏好</a>';
            }else{
                html += '<a class="weui-form-preview__btn weui-form-preview__btn_default visit-memo-list" href="javascript:" data-id="'+ data[i].id +'">查看备注</a> ';
            }
            var openCount = data[i].times || 0;
            var shareCount = data[i].transmitTimes || 0;
            var sumCount = 0 + openCount + shareCount;
            var openCountClass = openCount>0?'num-not-zero':'';
            var shareCountClass = shareCount>0?'num-not-zero':'';
            html += '<a class="weui-form-preview__btn weui-form-preview__btn_default view-detail '+(listManager.data.myFlag?"view-detail-my":"")+'"'+
            'data-sumcount="'+sumCount+'" href="javascript:">浏览<span class="'+openCountClass+'">('+openCount+')</span>&nbsp;&nbsp;转发' +
            '<span class="'+shareCountClass+'">('+shareCount+')</span></a></div>\n' +
            '</div>';

        }
        $('#list').append(html);
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
            pager.page++; //页数
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
                var url1 = $.UrlUpdateParams(html,"userid",userid);
                var url2 = $.UrlUpdateParams(url1,"customerid",$(customer).data('id'));
                location.href = url2;
                // location.href = html+ YT.setUrlParams({
                //     dataId:$(customer).data('id')
                // });
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
            var self = this;
            var customer = $(self).parents('.weui-form-preview').find('.customer');
            console.log("customerId:"+$(customer).data('id'));
            var url = '/module/old-customer/new-visit-plan.html';
            var url1 = $.UrlUpdateParams(url,"userid",userid);
            var url2 = $.UrlUpdateParams(url1,"customer_id",$(customer).data('id'));
            var url3 = $.UrlUpdateParams(url2,"customer_name",$(customer).find('.name').text());
            var url4 = $.UrlUpdateParams(url3,"company",$(customer).find('.department').text());
            // url3=encodeURI(url3);   //对URL的地址进行encodeURI编码，实际上只有中文的部分被修改编码
            console.log("url encode: "+url4);
            location.href  = url4;
        }).on('click','.visit-memo',function () {
            //$.alert('功能暂时未上线!');
            var self = this;
            var customer = $(self).parents('.weui-form-preview').find('.customer');
            console.log("customerId:"+$(customer).data('id'));
            console.log("customerName:"+$(customer).find('.name').text());
            var url = '/module/old-customer/visit-log.html';
            var url1 = $.UrlUpdateParams(url,"userid",userid);
            var url2 = $.UrlUpdateParams(url1,"customer_id",$(customer).data('id'));
            var url3 = $.UrlUpdateParams(url2,"customer_name",$(customer).find('.name').text());
            var url4 = $.UrlUpdateParams(url3,"company",$(customer).find('.department').text());
            // url3=encodeURI(url3);   //对URL的地址进行encodeURI编码，实际上只有中文的部分被修改编码
            console.log("url encode: "+url4);
            location.href = url4;
        }).on('click','.visit-detail',function () {
            //$.alert('功能暂时未上线!');
            var self = this;
            var customer = $(self).parents('.weui-form-preview').find('.customer');
            console.log("customerId:"+$(customer).data('id'));
            var url = '/module/old-customer/visit-detail-plan.html';
            var url1 = $.UrlUpdateParams(url,"userid",userid);
            location.href = $.UrlUpdateParams(url1,"customer_id",$(customer).data('id'));
            // location.href = '/module/old-customer/visit-detail-plan.html' + YT.setUrlParams({
            //     customer_id: $ele.data('id')
            // });
        }).on('click','.visit-memo-list',function () {
            //$.alert('功能暂时未上线!');
            var self = this;
            var customer = $(self).parents('.weui-form-preview').find('.customer');
            console.log("customerId:"+$(customer).data('id'));
            var url = '/module/old-customer/memo-list.html';
            var url1 = $.UrlUpdateParams(url,"userid",userid);
            location.href = $.UrlUpdateParams(url,"customer_id",$(customer).data('id'));
            // location.href = '/module/old-customer/memo-list.html' + YT.setUrlParams({
            //     customer_id: $ele.data('id')
            // });
        }).on('click','.preference',function () {
            //$.alert('功能暂时未上线!');
            var self = this;
            var customer = $(self).parents('.weui-form-preview').find('.customer');
            console.log("customerId:"+$(customer).data('id'));
            var url = '/module/user-profile/preference.html';
            var url1 = $.UrlUpdateParams(url,"userid",userid);
            location.href = $.UrlUpdateParams(url,"customer_id",$(customer).data('id'));
            // location.href = '/module/old-customer/memo-list.html' + YT.setUrlParams({
            //     customer_id: $ele.data('id')
            // });
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