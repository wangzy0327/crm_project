var module = {};

module.data = {
    m: 1030000,
    staff_id: YT.getUrlParam('staff_id'),
    visit_id: YT.getUrlParam('visit_id'),
    customer_name: YT.getUrlParam('customer_name'),
    type: YT.getUrlParam('type'),
    isComment: +YT.getUrlParam('iscomment'),
    comment_id: +YT.getUrlParam('commentid')
};

module.service = {

    initControls: function () {
        this.initDom();
    },

    initDom: function () {
        var data = {
            m: 1010000,
            t: 'staffs',
            params: JSON.stringify({staff_id: module.data.staff_id, operator_id: '='})
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    var userInfo = data.object[0];

                    $('#visitName').val(module.data.customer_name + (module.data.type == 1 ? '(拜访计划)' : '(拜访记录)'));
                    $('#staffName').val(userInfo.name);

                    module.data.staff_id = userInfo.id;
                    module.data.staff_name = userInfo.name;

                    module.service.initCommentStatus();
                } else {
                    $.alert(data.message);
                }
            }
        });

        common.select.initHtml('#chooseStaffer', '#btn-add', 'add');
    },

    initCommentStatus: function () {
        var filter = [
            {field: 'id', value: module.data.comment_id, operator: '=', relation: 'and'},
            {field: 'type', value: module.data.type, operator: '=', relation: 'and'}
        ];

        var data = {
            m: module.data.m,
            t: 'v_comments',
            filter: JSON.stringify(filter)
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    if (data.object.length) {
                        module.data.isComment = data.object[0].isComment;
                    } else {
                        module.data.isComment = 1;
                    }
                } else {
                    $.alert(data.message);
                }
            }
        });
    },

    push_comment: function (urlParams, comment_id) {
        // 推送消息
        var userIds = common.select.data['add'].userIds;
        var ids = common.select.data['add'].ids;
        var staff_id = urlParams.staff_id;
        var visit_id = urlParams.visit_id;
        var type = urlParams.type;
        var iscomment = urlParams.iscomment;
        var staff_name = module.data.staff_name;
        var customer_name = module.data.customer_name || '【未填姓名】';

        for (var i in userIds) {
            var corpid = YT.getUrlParam('corpid'), url = '', content = '';

            url += 'https://open.weixin.qq.com/connect/oauth2/authorize?';
            url += 'appid=' + corpid;
            url += '&redirect_uri=http%3a%2f%2fcrm.youitech.com%2fwx%2fredirect.action';
            url += '&response_type=code';
            url += '&scope=snsapi_base';
            url += '&state=ImoduleIdiscussIvisitSdetailSevaluationDhtmlP' + corpid + 'P' + YT.apps.sales_ass_id + 'P';
            url += 'AAstaff_idEE' + ids[i] + 'AAvisit_idEE' + visit_id;
            url += 'AAtypeEE' + type + 'AAiscommentEE' + iscomment;
            url += 'AAcommentidEE' + comment_id[i];
            url += '#wechat_redirect';

            content += '您收到一条评论：\n';
            content += '关于' + staff_name + '对' + customer_name + '（客户）的' + (type == 1 ? '拜访计划' : '拜访记录');

            var title = type == 1 ? '拜访计划评论' : '拜访记录评论';
            var description = content;
            var url = url;
            var btntxt = '评论详情';

            var article = {
                title: title,
                description: description,
                url: url,
                btntxt: btntxt
            };

            pushMsgTool.sendMessage(
                {
                    config: {
                        toType: {
                            type: [1],
                            touser: userIds[i]
                        },
                        msgtype: 'news',
                        safe: 0
                    },
                    content: {
                        articles: [article]
                    },
                    userId: staff_id,
                    appId: YT.apps.sales_ass_id
                },
                function (data) {
                },
                function (data) {
                }
            );
        }

        $.alert('提交成功', function () {
            location.href = 'visit-detail-evaluation.html' + YT.setUrlParams(urlParams);
        });
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.addInformation();
    },

    //添加点击事件
    addInformation: function () {
        $('#save_content').click(function () {
            var module_data = module.data,
                staff_id = module_data.staff_id,
                visit_id = module_data.visit_id,
                type = module_data.type,
                info_data = {
                    content: $('#feedback_contents').val(),
                    time: new Date().Format('yyyy-MM-dd hh:mm:ss')
                },
                comment_id = module_data.comment_id,
                params = {
                    staff_id: staff_id,
                    visit_id: visit_id,
                    type: type,
                    to_staff: common.select.data['add'].ids.join(',')
                },
                urlParams = {
                    staff_id: staff_id,
                    visit_id: visit_id,
                    type: type,
                    iscomment: 1,
                    commentid: comment_id
                };

            if (module.data.isComment) {
                var info = {
                    data: info_data,
                    t: 'comments',
                    ai: true
                };

                var data = {
                    m: module.data.m,
                    t: 'comments',
                    v: JSON.stringify([info]),
                    params: JSON.stringify(params)
                };

                YT.insert({
                    data: data,
                    successCallback: function (data) {
                        if (data.status == 200) {
                            var commAutoIds = data.object['comm'];
                            module.service.push_comment(urlParams, commAutoIds);
                        } else {
                            $.alert(data.message);
                        }
                    }
                });
            } else {
                var filter = [
                    {field: 'id', value: comment_id, operator: '=', relation: 'AND'}
                ];

                var info = {
                    data: info_data,
                    filter: filter
                };

                params.comment_id = comment_id;

                var data = {
                    m: module.data.m,
                    t: 'comments',
                    v: JSON.stringify([info]),
                    params: JSON.stringify(params)
                };

                YT.update({
                    data: data,
                    successCallback: function (data) {
                        if (data.status == 200) {
                            var commAutoIds = data.object['comm'];
                            module.service.push_comment(urlParams, commAutoIds);
                        } else {
                            $.alert(data.message);
                        }
                    }
                });
            }
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});
