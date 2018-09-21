var module = {};

module.data = {
    user_id: getUrlParam("userid"),
    customer_id: getUrlParam('customer_id')
};

var pager = {
    loading: false,
    page: 1,
    rows: 10
};

module.service = {
    initControls: function () {
        this.initCustomer();
        common.visit.initTagList();
    },

    initCustomer: function () {
        // var filter = [
        //     {field: 'id', value: module.data.customer_id, operator: '=', relation: 'and'}
        // ];
        //
        // var data = {
        //     m: module.data.m,
        //     t: 'customers',
        //     filter: JSON.stringify(filter)
        // };

        $.ajax({
            type: 'post',
            url: "/customer/detail?customerId="+module.data.customer_id,
            // data:JSON.stringify(info),
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if (result.code == 0) {
                    var data = result.data;
                    var item = data, html = '';
                    module.data.name = item.name;

                    html += '<table style="margin:0 auto;font-size:15px;text-align:center;padding:20px 0;">';
                    html += '<tr>';
                    html += '<th rowspan="2" width="100px" height="100px">';
                    html += '<i class="iconfont" style="color:#bbb;font-size: 100px;line-height: 100px;">&#xe008;</i>';
                    //html += '<img src="' + (item.avatar || '/images/head.jpg') + '" style="width:100px;height:100px;border-radius:50%;vertical-align:middle;">';
                    html += '</th>';
                    html += '<th style="font-size:30px;text-align:right;padding-left:10px;">' + item.name + '</th>';
                    html += '<th style="font-size:20px;text-align:left;padding-top:10px;padding-left:10px;">' + (item.position || '') + '</th>';
                    html += '</tr>';
                    html += '<tr>';
                    html += '<th colspan="3" style="font-size:20px;vertical-align:top;padding-left:10px;">' + (item.company || '') + '</th>';
                    html += '</tr>';
                    html += '<tr height="30px">';
                    html += '<td>地址</td>';
                    html += '<td style="text-align:left;padding-left:10px;" colspan="2" >' + (item.position || '') + '</td>';
                    html += '</tr>';
                    html += '<tr height="30px">';
                    html += '<td>手机</td>';
                    html += '<td style="text-align:left;padding-left:10px;" colspan="2">' + (item.mobile || '') + '</td>';
                    html += '</tr>';
                    html += '<tr height="30px">';
                    html += '<td>微信</td>';
                    html += '<td style="text-align:left;padding-left:10px;" colspan="2">' + (item.wechat || '') + '</td>';
                    html += '</tr>';
                    html += '</table>';

                    $("#customer-table").append(html);
                    module.service.initSearch();
                }
            }
        });



    },

    // 初始化列表
    initSearch: function () {
        var filter = [
            {field: 'customer_id', value: module.data.customer_id, operator: '=', relation: 'and'}
        ];

        var data = {
            m: module.data.m,
            t: 'visit_plan',
            filter: JSON.stringify(filter),
            order: 'time desc',
            page: pager.page,
            rows: pager.rows
        };

        module.service.initPlanList(data);
    },

    initPlanList: function (data) {
        var noMore =
            '<div  id="noMore" style="margin-top: 10px;text-align: center;">' +
            '无更多记录' +
            '</div> ';

        $.ajax({
            type: 'post',
            url: "/plan/list?userId="+module.data.user_id+"&customerId=" + module.data.customer_id+"&page="+pager.page+"&size="+pager.rows,
            // data:JSON.stringify(info),
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            error: function (result) {
            },
            success: function (result) {
                if (pager.page == 1) {
                    $("#noMore").remove();
                }
                var data = result.data;
                var items = data, html = '';
                // pager.page = data.idx + 1;

                for (var i in items) {
                    var item = items[i],
                        recordTime = new Date(item.time).Format('yyyy-MM-dd hh:mm:ss');

                    if (+i) {
                        html += '<div class="weui-form-preview__hd information-topic" style="border-top:1vw solid;border-color:#ddd;">';
                    } else {
                        html += '<div class="weui-form-preview__hd information-topic">';
                    }

                    html += '<label class="weui-form-preview__label">';
                    html += '<span style="color: red">*</span>' + module.data.name + '<span>&nbsp;(拜访计划)</span>';
                    html += '</label>';
                    html += '<em class="weui-form-preview__value" style="text-align: right">' + recordTime + '</em>';
                    html += '</div>';
                    html += '<div class="weui-form-preview__bd detail-plan" data-id="' + item.id + '" data-staffid="' + item.userId + '">';
                    html += '<div class="weui-form-preview__item">';
                    html += '<label class="weui-form-preview__label">拜访时间</label>';
                    html += '<span class="weui-form-preview__value">' + (item.time ? new Date(item.time).Format('yyyy-MM-dd hh:mm:ss') : '') + '</span>';
                    html += '</div>';
                    html += '<div class="weui-form-preview__item">';
                    html += '<label class="weui-form-preview__label">拜访地点</label>';
                    html += '<span class="weui-form-preview__value">' + (item.location || '') + '</span>';
                    html += '</div>';
                    html += '<div class="weui-form-preview__item">';
                    html += '<label class="weui-form-preview__label">拜访内容</label>';
                    html += '<span class="weui-form-preview__value">' + (item.content || '') + '</span>';
                    html += '</div>';
                    html += '</div>';

                }

                $("#plan-list").append(html);

                pager.loading = true;
                $('#infinite').remove();
                $("body").append(noMore);
                return;
                // if (data.object.idx >= data.object.pageCount) {
                //     //最后一页
                //     pager.loading = true;
                //     $('#infinite').remove();
                //     $("body").append(noMore);
                //     return;
                // }
            }
        });

        // YT.query({
        //     data: data,
        //     successCallback: function (data) {
        //         if (200 == data.status) {
        //             if (pager.page == 1) {
        //                 $("#noMore").remove();
        //             }
        //
        //             var items = data.object.items, html = '';
        //             pager.page = data.object.idx + 1;
        //
        //             for (var i in items) {
        //                 var item = items[i],
        //                     recordTime = new Date(item.recordTime).Format('yyyy-MM-dd hh:mm:ss');
        //
        //                 if (+i) {
        //                     html += '<div class="weui-form-preview__hd information-topic" style="border-top:1vw solid;border-color:#ddd;">';
        //                 } else {
        //                     html += '<div class="weui-form-preview__hd information-topic">';
        //                 }
        //
        //                 html += '<label class="weui-form-preview__label">';
        //                 html += '<span style="color: red">*</span>' + module.data.name + '<span>&nbsp;(拜访计划)</span>';
        //                 html += '</label>';
        //                 html += '<em class="weui-form-preview__value" style="text-align: right">' + recordTime + '</em>';
        //                 html += '</div>';
        //                 html += '<div class="weui-form-preview__bd detail-plan" data-id="' + item.id + '" data-staffid="' + item.staff_id + '">';
        //                 html += '<div class="weui-form-preview__item">';
        //                 html += '<label class="weui-form-preview__label">拜访时间</label>';
        //                 html += '<span class="weui-form-preview__value">' + (item.time ? new Date(item.time).Format('yyyy-MM-dd hh:mm:ss') : '') + '</span>';
        //                 html += '</div>';
        //                 html += '<div class="weui-form-preview__item">';
        //                 html += '<label class="weui-form-preview__label">拜访地点</label>';
        //                 html += '<span class="weui-form-preview__value">' + (item.location || '') + '</span>';
        //                 html += '</div>';
        //                 html += '<div class="weui-form-preview__item">';
        //                 html += '<label class="weui-form-preview__label">拜访内容</label>';
        //                 html += '<span class="weui-form-preview__value">' + (item.content || '') + '</span>';
        //                 html += '</div>';
        //                 html += '</div>';
        //
        //             }
        //
        //             $("#plan-list").append(html);
        //
        //             if (data.object.idx >= data.object.pageCount) {
        //                 //最后一页
        //                 pager.loading = true;
        //                 $('#infinite').remove();
        //                 $("body").append(noMore);
        //                 return;
        //             }
        //         } else {
        //             $.alert(data.message);
        //         }
        //         pager.loading = false;
        //     }
        // })
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleInfinite();
        this.handleBtnLog();
        this.handleToDetail();
        this.handleBtnSearch();
    },

    // 滚动加载
    handleInfinite: function () {
        $(document.body).infinite().on("infinite", function () {
            if (pager.loading) return;
            pager.loading = true;
            module.service.initSearch();
        });
    },

    handleBtnLog: function () {
        $('.btn-log').click(function () {
            location.href = 'visit-detail-log.html?userid='+ module.data.user_id+'&customer_id=' + module.data.customer_id;
        });
    },

    handleToDetail: function () {
        $('#plan-list').on('click', '.detail-plan', function () {
            var url = '/module/discuss/visit-detail-evaluation.html';
            var url1 = $.UrlUpdateParams(url,"userid",module.data.user_id);
            var url2 = $.UrlUpdateParams(url1,"customer_id",module.data.customer_id);
            var url3 = $.UrlUpdateParams(url2,"type",1);
            var url4 = $.UrlUpdateParams(url3,"visit_id",$(this).data('id'));
            location.href = url4;
            // location.href = '/module/discuss/visit-detail-evaluation.html' + YT.setUrlParams({
            //         staff_id: $(this).data('staffid'),
            //         visit_id: $(this).data('id'),
            //         type: 1,
            //         iscomment: 1
            //     });
        });
    },

    handleBtnSearch: function () {
        /*$("#years-monthes").datetimePicker({
         title: '限定年月',
         years: [2017, 2018],
         monthes: ['06', '07'],
         onChange: function (picker, values, displayValues) {
         console.log(values);
         }
         });*/
    }

};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
    $(document.body).infinite();
});