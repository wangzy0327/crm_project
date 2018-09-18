var pager = {
    loading: false,  //状态标记
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

var userid;

// $(document.body).pullToRefresh(function () {
// // 下拉刷新触发时执行的操作放这里。
// // 从 v1.1.2 版本才支持回调函数，之前的版本只能通过事件监听
// });

//=========================下拉刷新
$(document.body).pullToRefresh({
    onRefresh:function () {
        // setTimeout(function () {
            pager.page = 1;
            $("#list").html("");
            loadlist();
            if (pager.loading)
                pager.loading = false;
            $(document.body).pullToRefreshDone(); // 重置下拉刷新
        // }, 1500);   //模拟延迟
    }
});

// $(document.body).infinite();
//============================滚动加载
$(document.body).infinite().on("infinite", function () {
    console.log("pager.loading:"+pager.loading);
    if (pager.loading) return;
    pager.loading = true;
    pager.page++; //页数
    $('.weui-loadmore').show();
    // setTimeout(function () {
        loadlist();
        pager.loading = false;
    // }, 2500);   //模拟延迟
});

$(function () {
    loadlist();
    handleOp();
});

function loadlist() {
    userid = getUrlParam("userid");
    console.log("userid:"+userid);
    var openid = getUrlParam("openid");
    console.log("openid:"+openid);
    if(userid == null || userid == undefined){
        userid  = $.cookie('userId');
    }
    if(userid == undefined || userid == null){
        if(openid != null){
            $('#list').append('您是非企业成员，您的openid为:'+openid);
        }else{
            var returnUrl = window.location.href;
            console.log("returnUrl:"+returnUrl);
            // var url = "http://wangzy.tunnel.qydev.com/wechat/authorize?returnUrl="+returnUrl;
            console.log("domain url: "+domain.server);
            var url = domain.server+"wechat/authorize?returnUrl="+returnUrl;
            location.href = url;
        }
    }
    else{
        $.cookie('userId',userid,{expires:1/48});
        var html = "";
        $.ajax({
            type: 'get',
            url: "/customer/self?userid="+userid+"&page="+pager.page+"&size="+pager.size,
            data: {'page': pager.page, 'size': pager.size },
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            error: function (request) {
                $(".weui-loadmore").hide();
                html += "<div class=\"weui-loadmore weui-loadmore_line\">\n" +
                    "<span class=\"weui-loadmore__tips\">已无更多数据</span>\n" +
                    "</div>";
                $("#list").append(html);
            },
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    if (data.length > 0) {
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
                                '<div class="weui-form-preview__ft">' +
                                '<a class="weui-form-preview__btn weui-form-preview__btn_primary edit" data-d="'+JSON.stringify(data[i]).replace(/"/g, "&quot;")+'" href="javascript:">编辑</a>' +
                                '<a class="weui-form-preview__btn weui-form-preview__btn_primary visit-tip" href="javascript:" data-id="30">提醒</a>\n' +
                                '<a class="weui-form-preview__btn weui-form-preview__btn_primary visit-memo" href="javascript:" data-id="30">备注</a>' +
                                '<a class="weui-form-preview__btn weui-form-preview__btn_default view-detail view-detail-my"\n' +
                                'data-sumcount="1" href="javascript:">浏览<span class=""></span>&nbsp;&nbsp;转发' +
                                '<span class=""></span></a></div>\n' +
                                '</div>';
                        }
                        $('#list').append(html);
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
    }
}

function handleOp() {
    $('#list').on('click','.view-detail',function () {
        var self = this;
        var sumCount = $(self).data('sumcount');
        if(sumCount >0){
            var customer = $(self).parents('.weui-form-preview').find('.customer');
            var html ='customer-list-detail.html';
            if(listManager.data.myFlag){
                html ='customer-list-my-detail.html';
            }
            location.href = $.UrlUpdateParams(html,"dataId",$(customer).data('id'));
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
        // url3=encodeURI(url3);   //对URL的地址进行encodeURI编码，实际上只有中文的部分被修改编码
        console.log("url encode: "+url3);
        location.href  = url3;
        // location.href = '/module/old-customer/new-visit-plan.html' + YT.setUrlParams({
        //     customer_id: $ele.data('id'),
        //     customer_name:$ele.find('.name').text(),
        //     company:$ele.find('.department').text()
        // });
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
        // url3=encodeURI(url3);   //对URL的地址进行encodeURI编码，实际上只有中文的部分被修改编码
        console.log("url encode: "+url3);
        location.href = url3;
        // location.href = '/module/old-customer/visit-log.html' + YT.setUrlParams({
        //     customer_id: $ele.data('id'),
        //     customer_name:$ele.find('.name').text(),
        //     company:$ele.find('.department').text(),
        //     visit_plan_time: $ele.data('t')
        // });
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
    });
}

function iGetInnerText(str) {
    return str.replace(/[\r\n]/g, ""); //去掉回车换行
}

function initSearchDiv() {
    $('.searchInput')
        .on('keydown',function(e){
            if(e.keyCode == 13) {
                e.preventDefault();
                triggerSearch();
            }
        });
    $('.weui-icon-clear').unbind('click');
    $(document).on("click", ".weui-icon-clear", function(e) {
        listManager.data.extraFilter = false;
        listManager.data.extraFilterData = [];
        listManager.service.clearList();
        listManager.service.initData();
    }).on("click", ".weui-search-bar__search-btn", function(e) {
        triggerSearch();
    })
}

function triggerSearch() {
    var val = iGetInnerText($.trim($('.searchInput').val()));

    var val_flag = val != '' && val != '搜索';
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
    clearList();
}

function clearList() {
    $("#list").empty();
    $("#more").empty();
    $('#infinite').hide();
    pager.loading = false;
    pager.lastPage = false;
    pager.pageCount = 0;
    pager.page = 1;
    pager.size = 8;
}