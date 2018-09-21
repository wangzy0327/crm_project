var module = {};

module.data = {
    user_id: getUrlParam("userid"),
    customer_id: getUrlParam('customer_id'),
    type: getUrlParam('type'),
    visit_id: getUrlParam('visit_id')
    // m: 1030000,
    // staff_id: YT.getUrlParam('staff_id'),
    // visit_id: YT.getUrlParam('visit_id'),
    // type: YT.getUrlParam('type'),
    // isComment: YT.getUrlParam('iscomment'),
    // comment_id: +YT.getUrlParam('commentid')
};

var pager = {
    loading: false,
    page: 1,
    rows: 10
};

module.service = {

    initControls: function () {
        this.initDom();
        this.initVisit();
        //this.initSearch();
        this.initList();
    },

    initDom: function () {
        // var data = {
        //     m: 1010000,
        //     t: 'staffs',
        //     params: JSON.stringify({staff_id: module.data.staff_id, operator_id: '='})
        // };

        $.ajax({
            type: 'get',
            url: "/staff/self?userId="+module.data.user_id,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log("staff_name: "+data.name);
                    module.data.staff_name = data.name;
                    common.select.initHtml('#staffsPopup', '#btn-discuss', 'discuss');
                }
            }
        });

        // YT.query({
        //     data: data,
        //     successCallback: function (data) {
        //         if (200 == data.status) {
        //             var userInfo = data.object[0];
        //
        //             module.data.staff_name = userInfo.name;
        //
        //             if (!module.data.comment_id) {
        //                 module.data.isComment = 1;
        //             }
        //
        //             common.select.initHtml('#staffsPopup', '#btn-discuss', 'discuss');
        //         } else {
        //             $.alert(data.message);
        //         }
        //     }
        // });
    },

    initVisit: function () {
        var filter = [
            {field: 'id', value: module.data.visit_id, operator: '=', relation: 'and'},
            {field: 'type', value: module.data.type, operator: '=', relation: 'and'}
        ];

        var data = {
            m: module.data.m,
            t: 'v_visit',
            filter: JSON.stringify(filter)
        };

        if(module.data.type == 1){
            $.ajax({
                type: 'get',
                url: "/plan/details?id="+module.data.visit_id,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                error: function (request) {
                },
                success: function (result) {
                    if(result.code == 0){
                        var item = result.data;
                        var values = [item.time || '', item.place+ '  '+item.location || '', item.content || ''];
                        module.data.customer_name = item.customerName;
                        $('.customer_name').text('客户：' + item.customerName);
                        var html = '';
                        html += module.service.createHtml(['拜访时间', '拜访地点', '拜访内容'], values);
                        $("#info").append(html);
                        uploader.component.initViewImage(item.picture);
                        uploader.component.initViewFile(item.attachment);
                    }
                }
            });
        }
        else if(module.data.type == 2){
            $.ajax({
                type: 'get',
                url: "/log/details?id="+module.data.visit_id,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                error: function (request) {
                },
                success: function (result) {
                    if(result.code == 0){
                        var item = result.data;
                        var values = [item.way || '', item.requirement || '', item.result || '', item.memo || ''];
                        module.data.customer_name = item.customerName;
                        $('.customer_name').text('客户：' + item.customerName);
                        var html = '';
                        html += module.service.createHtml(['拜访方式', '客户需求', '拜访结果', '备注'], values);
                        $("#info").append(html);
                        uploader.component.initViewImage(item.picture);
                        uploader.component.initViewFile(item.attachment);
                    }
                }
            });
        }

        // YT.query({
        //     data: data,
        //     successCallback: function (data) {
        //         if (200 == data.status) {
        //             var item = data.object[0],
        //                 html = '',
        //                 type = item.type,
        //                 values = [item.timeOrWay || '', item.locationOrRequirement || '', item.contentOrResult || ''];
        //
        //             module.data.customer_name = item.customer_name;
        //
        //             $('.customer_name').text('客户：' + item.customer_name);
        //
        //             if (type == 1) {
        //                 html += module.service.createHtml(['拜访时间', '拜访地点', '拜访内容'], values);
        //             } else if (type == 2) {
        //                 values.push(item.memo || '');
        //                 html += module.service.createHtml(['拜访方式', '客户需求', '拜访结果', '备注'], values);
        //             }
        //
        //             $("#info").append(html);
        //
        //             uploader.component.initViewImage(item.picture);
        //             uploader.component.initViewFile(item.attachment);
        //         } else {
        //             $.alert(data.message);
        //         }
        //     }
        // });
    },

    initList: function (data) {
        // var filter = [
        //     {field: 'visit_id', value: module.data.visit_id, operator: '=', relation: 'and'},
        //     {field: 'type', value: module.data.type, operator: '=', relation: 'and'},
        //     {field: 'isVisitAdd', value: 1, operator: '=', relation: 'and'}
        // ];
        //
        // var data = {
        //     m: module.data.m,
        //     t: 'v_comments',
        //     filter: JSON.stringify(filter),
        //     order: 'time asc'
        // };

        $.ajax({
            type: 'post',
            url: "/comment/list?visitId="+module.data.visit_id+"&type="+module.data.type,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    if(data!=null){
                        console.log("visitId:"+data.visitId);
                        console.log("commentDetail:"+data.commentDetail)
                        var items = data.commentDetail, html = '';
                        html += module.service.createCommentHtml(items);
                        $("#list").append(html);
                    }
                }
            }
        });

        // YT.query({
        //     data: data,
        //     successCallback: function (data) {
        //         if (200 == data.status) {
        //             var items = data.object, html = '';
        //             html += module.service.createCommentHtml(items);
        //             $("#list").append(html);
        //         } else {
        //             $.alert(data.message);
        //         }
        //     }
        // });
    },

    // 初始化列表
    initSearch: function () {
        module.service.initList(data);
    },

    createHtml: function (labs, values) {
        var html = '';

        if (labs.length == values.length) {
            html += '<div class="weui-form-preview__bd">';
            for (var i in labs) {
                html += '<div class="weui-form-preview__item">';
                html += '<label class="weui-form-preview__label">' + labs[i] + '</label>';
                html += '<span class="weui-form-preview__value">' + values[i] + '</span>';
                html += '</div>';
            }
            html += '</div>';
        } else {
            throw '数组长度不一致';
        }
        return html;
    },

    createCommentHtml: function (data) {
        var html = '';
        if (data.length) {
            html += '<div class="weui-panel__bd">';
            var comment_id = module.data.comment_id;
            for (var i in data) {
                var obj = data[i];
                console.log("time:"+obj.updateTime);
                html += '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">';
                html += '<div class="weui-media-box__hd" style="width: 50px;height: 50px;">';
                html += '<img class="weui-media-box__thumb" src="' + obj.staff.avatar + '">';
                html += '</div>';
                html += '<div class="weui-media-box__bd">';
                html += '<h4 class="weui-media-box__title evaluator-font">' + obj.staff.name + '&nbsp;';
                html += '<span style="color: #b3b3b3;font-size: 12px;">' + obj.updateTime + '</span></h4>';
                html += '<p class="evaluation-overflow-visiable evaluation-font" >' + obj.content + '</p>';
                html += '</div>';
                html += '</a>';

                // 存在comment_id，则comment_id=0
                if (comment_id && comment_id == obj.id) {
                    module.data.isComment = obj.isComment;
                }
            }
            html += '</div>';
        }
        return html;
    },

    // push_comment: function (urlParams, comment_id) {
    //     // 推送消息
    //     var userIds = common.select.data['discuss'].userIds;
    //     var ids = common.select.data['discuss'].ids;
    //     var staff_id = urlParams.staff_id;
    //     var visit_id = urlParams.visit_id;
    //     var type = urlParams.type;
    //     var iscomment = urlParams.iscomment;
    //     var staff_name = module.data.staff_name;
    //     var customer_name = module.data.customer_name || '【未填姓名】';
    //
    //     for (var i in userIds) {
    //         var corpid = YT.getUrlParam('corpid'), url = '', content = '';
    //
    //         url += 'https://open.weixin.qq.com/connect/oauth2/authorize?';
    //         url += 'appid=' + corpid;
    //         url += '&redirect_uri=http%3a%2f%2fcrm.youitech.com%2fwx%2fredirect.action';
    //         url += '&response_type=code';
    //         url += '&scope=snsapi_base';
    //         url += '&state=ImoduleIdiscussIvisitSdetailSevaluationDhtmlP' + corpid + 'P' + YT.apps.sales_ass_id + 'P';
    //         url += 'AAstaff_idEE' + ids[i] + 'AAvisit_idEE' + visit_id;
    //         url += 'AAtypeEE' + type + 'AAiscommentEE' + iscomment;
    //         url += 'AAcommentidEE' + comment_id[i];
    //         url += '#wechat_redirect';
    //
    //         content += '您收到一条评论：\n';
    //         content += '关于' + staff_name + '对' + customer_name + '（客户）的' + (type == 1 ? '拜访计划' : '拜访记录');
    //
    //         var title = type == 1 ? '拜访计划评论' : '拜访记录评论';
    //         var description = content;
    //         var url = url;
    //         var btntxt = '评论详情';
    //
    //         var article = {
    //             title: title,
    //             description: description,
    //             url: url,
    //             btntxt: btntxt
    //         };
    //
    //         pushMsgTool.sendMessage(
    //             {
    //                 config: {
    //                     toType: {
    //                         type: [1],
    //                         touser: userIds[i]
    //                     },
    //                     msgtype: 'news',
    //                     safe: 0
    //                 },
    //                 content: {
    //                     articles: [article]
    //                 },
    //                 userId: staff_id,
    //                 appId: YT.apps.sales_ass_id
    //             },
    //             function (data) {
    //             },
    //             function (data) {
    //             }
    //         );
    //     }
    //
    //     $.alert('提交成功', function () {
    //         // 清空
    //         $('#list div').remove();
    //         $('#feedback_contents').val('');
    //         common.select.resetDate('#staffsPopup', '#btn-discuss', 'discuss');
    //         module.service.initList();
    //         //location.href = 'visit-detail-evaluation.html' + YT.setUrlParams(urlParams);
    //     });
    // }

};

module.eventHandler = {
    handleEvents: function () {
        //this.handleInfinite();
        this.handleToDetail();
        this.addInformation();
    },

    // 滚动加载
    handleInfinite: function () {
        $(document.body).infinite().on("infinite", function () {
            if (pager.loading) return;
            pager.loading = true;
            module.service.initSearch();
        });
    },

    handleToDetail: function () {
        $('.add').click(function () {
            var url = 'sales-grade.html';
            var url1 = $.UrlUpdateParams(url,"userid",module.data.user_id);
            var url2 = $.UrlUpdateParams(url1,"visit_id",module.data.visit_id);
            var url3 = $.UrlUpdateParams(url2,"type",module.data.type);
            var url4 = $.UrlUpdateParams(url3,"customer_name",module.data.customer_name);
            // location.href = 'sales-grade.html' + YT.setUrlParams({
            //         staff_id: module.data.staff_id,
            //         visit_id: module.data.visit_id,
            //         type: module.data.type,
            //         customer_name: module.data.customer_name,
            //         iscomment: module.data.isComment,
            //         commentid: module.data.comment_id
            //     });
        });
    },

    //添加点击事件
    addInformation: function () {
        $('#save_content').click(function () {
            var content = $.trim($('#feedback_contents').val());

            if (!content) {
                $.alert('请填写评论！');
                return false;
            }

            $.confirm(
                "您确定要提交吗?",
                function () {
                    //点击确认后的回调函数
                    var commentInfo = {
                        content:content,
                        type:module.data.type,
                        userId:module.data.user_id,
                        visitId:module.data.visit_id,
                        customerId:module.data.customer_id,
                        staffName:module.data.staff_name,
                        customerName:module.data.customer_name,
                        toStaff: common.select.data['discuss'].userIds.join(',')
                    };

                    $.ajax({
                        type: 'post',
                        url: "/comment/save",
                        data:JSON.stringify(commentInfo),
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        error: function (request) {
                        },
                        success: function (result) {
                            if(result.code == 0){
                                $.alert('提交成功', function () {
                                    // 清空
                                    $('#list div').remove();
                                    $('#feedback_contents').val('');
                                    common.select.resetDate('#staffsPopup', '#btn-discuss', 'discuss');
                                    module.service.initList();
                                    //location.href = 'visit-detail-evaluation.html' + YT.setUrlParams(urlParams);
                                });
                            }
                        }
                    });
                }, function () {
                    //点击取消后的回调函数
                }
            );
        });
    }
};

$(function () {
    // todo 企业微信点击返回，查询staff_id查询不对，需要延时加载
    setTimeout(function () {
        module.service.initControls();
        module.eventHandler.handleEvents();
        //$(document.body).infinite();
    }, 500);
});