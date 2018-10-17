/**
 * 注意：
 * 1、需要使用消息页面预览，加载前，请先加载ytui.min.css和ytui.min.js（或者jquery）
 * 2、需要使用分享，加载前，请先加载wxCommon.js及其依赖文件
 *
 */
var MessageComm = MessageComm || {};

/**
 *
 * @param src url的字符串
 * @param name
 * @returns {null}
 */
MessageComm.getSrcString = function (src, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = src.substr(src.indexOf('?') + 1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

var noMore =
    '<div  class="noMore" style="margin-top: 10px;text-align: center;">' +
    '无更多数据' +
    '</div> ';

/**
 * 消息页面预览、添加标签，适用于：H5、资料、平面
 *
 * 注意：
 * 1、必须存在module.data
 * 2、module.data.messageData 存放消息数据，如果undefined，影响更新操作等
 *
 */
MessageComm.page = {
    m: 101000000,

    init: function (ele, msgType, shareUrl, hasFrame, isShowFooter) {
        // module为全局参数
        this.ele = ele;
        // msgType 1文章 2资料 3图片 4没有二维码图片 5H5 6平面
        this.msgType = msgType;
        this.shareUrl = shareUrl;
        this.hasFrame = hasFrame || 0; // 是否有frame 0无 1有
        this.isShowFooter = isShowFooter || 0; // 是否显示底部按钮 0无 1有
        this.createPageHtml();
        this.initHotLabel();
        this.handleTurnPage();
        this.handleAddPageLabel();
        this.handleDelPageLabel();
        this.handleHotLabel();
        this.handleTitleInput();
        this.handleSaveBtn();
        this.handlePushBtn();
    },

    // 翻页事件
    handleTurnPage: function () {
        var self = this;
        $('#pageWrap').on('click', '.prev', function () {
            // 上一页
            if (self.hasFrame) {
                if ("function" === typeof frames["page-view"].prevPage) {
                    frames["page-view"].prevPage();
                }
            } else {
                if ("function" === typeof window.prevPage) {
                    window.prevPage();
                }
            }
        }).on('click', '.next', function () {
            // 下一页
            if (self.hasFrame) {
                if ("function" === typeof frames["page-view"].nextPage) {
                    frames["page-view"].nextPage();
                }
            } else {
                if ("function" === typeof window.nextPage) {
                    window.nextPage();
                }
            }
        });
    },

    // 添加标签事件
    handleAddPageLabel: function () {
        var self = this;
        // 从输入框添加
        $('#btn-label').click(function () {
            var label_text = $.trim($('#label-text').val());
            if (label_text) {
                self.createLabelHtml($('#label-view .box-label').length, -1, label_text);
                $('#label-text').val('');
            }
        });

        // 从热度标签添加
        $('#label-list').on('click', '.label-add', function () {
            var i = $('#label-view .box-label').length,
                $child = $(this).children(),
                id = $child.data('id'),
                name = $child.html();

            self.createLabelHtml(i, id, name);
        });
    },

    // 删除标签事件
    handleDelPageLabel: function () {
        var self = this;
        $('#label-view').on('click', '.label-del', function () {
            $(this).remove();

            // 删除数据
            self.delPageLabel($(this).data('i'));

            // 重新赋值下标
            $('#label-view .box-label').each(function (i, e) {
                $(e).attr('data-i', i);
            });
        });
    },

    // 热门标签事件
    handleHotLabel: function () {
        // 显示热门标签
        $('#pageWrap .label-hot').mousemove(function () {
            $('#label-list').fadeIn(1000);
        });

        // 隐藏热门标签
        $('#label-list').mouseleave(function () {
            $(this).fadeOut(1000);
        });
    },

    // 标题事件
    handleTitleInput: function () {
        var self = this;
        $('#title').blur(function () {
            var title = $(this).val(), pageData = self.hasFrame ? frames["page-view"].pageData : window.pageData;
            if (!title && !$.isEmptyObject(pageData)) {
                $(this).val(pageData.title || '');
            }
        });
    },

    // 保存事件
    handleSaveBtn: function () {
        var self = this;
        $('#page-save').click(function () {
            if (!$(this).hasClass('btn_disabled')) {
                self.ajaxData(false,
                    function (data) {
                        self.goBack('保存成功！');
                    },
                    function (data) {
                        self.goBack('保存成功！');
                    }
                );
            }
        });
    },

    // 发布事件
    handlePushBtn: function () {
        var self = this;
        $('#page-push').click(function () {
            if (!$(this).hasClass('btn_disabled')) {
                if (!module.service.validateData()) {
                    return false;
                }

                $.dialog({
                    //跨框架弹出对话框
                    title: '选择人员',
                    parent: window.parent,
                    relative: 0,
                    content: 'url:module/web/common/select-staff-two.html',
                    width: 600,
                    height: 450,
                    //传递给子对话框参数,
                    data: {
                        data: {
                            personIds: module.data.personIds,
                            personNames: module.data.personNames,
                            personCounts: module.data.personCounts
                        },
                        callback: function (win, staffs) {
                            $.confirm('您确定要推送吗？', function () {
                                win.api.close();
                                module.data.personIds = staffs.personIds;
                                module.data.personNames = staffs.personNames;
                                module.data.personCounts = staffs.personCounts;

                                self.ajaxData(true,
                                    function (data) {
                                        self.ajaxPush();
                                    },
                                    function (data) {
                                        self.ajaxPush();
                                    }
                                );
                            });
                        }
                    }
                });
            }

        });
    },

    // 初始化热门标签
    initHotLabel: function () {
    },

    createLabelHtml: function (i, id, name) {
        $('#label-view .box').append(this.createLabelHtml_del(i, id, name));

        // 添加数据
        this.addPageLabel(id, name);
    },

    // 添加页面标签数据
    addPageLabel: function (id, name) {
        // todo
        var index = this.hasFrame ? frames["page-view"].activeIndex : window.activeIndex;
        if (module.data.labelNames[index] == undefined) {
            module.data.labelNames[index] = [];
        }
        module.data.labelNames[index].push({id: id, name: name});
    },

    // 删除页面对应标签数据
    delPageLabel: function (i) {
        var index = this.hasFrame ? frames["page-view"].activeIndex : window.activeIndex;
        module.data.labelNames[index].splice(i, 1);
    },

    ajaxData: function (hasPush, insertCallback, updateCallback) {
        if (!module.service.validateData()) {
            return false;
        }

        var messageData = module.data.messageData,
            userInfo = JSON.parse($.cookie('userInfo')),
            saveData = module.service.getPostData(),
            postData = {
                m: module.data.m,
                t: 'message'
            },
            params = {
                slave_label: module.data.labelNames,
                corpid: userInfo.corpid,
                msgType: this.msgType
            };

        if (5 == this.msgType) { // H5需要html文件地址
            params.pageUrl = saveData.description;
        } else if (6 == this.msgType) { // 平面需要保存图片
            var pageData = this.hasFrame ? frames["page-view"].pageData : window.pageData;
            if (!$.isEmptyObject(pageData)) {
                params.imgUrl = pageData.imgUrl + pageData.size;
            }
        }

        if (!$.isEmptyObject(messageData)) {
            var message_id = messageData.id,
                filter = [
                    {field: 'id', value: message_id, operator: '=', relation: 'AND'}
                ];

            saveData.id = message_id;

            var slave = [{t: 'message_tag_relation', key: 'id:message_id'}];

            postData.v = JSON.stringify([{
                t: 'message',
                data: saveData,
                filter: filter,
                id: message_id,
                slave: slave
            }]);

            // 插入页面标签
            params.data_id = message_id;
            postData.params = JSON.stringify(params);

            YT.update({
                data: postData,
                successCallback: function (data) {
                    if (data.status == 200) {
                        var item = data.object;
                        if (6 == saveData.msgType) { // 只适用于平面
                            saveData.picurl = item.picurl;
                        }
                        module.data.messageData = $.extend(messageData, saveData);
                        updateCallback(data);
                    } else {
                        $.alert('保存失败!');
                    }
                }
            });
        } else {
            saveData.msgType = this.msgType;
            saveData.type = 1;
            saveData.url = YT.server + this.shareUrl;
            saveData.btntxt = "阅读全文";
            saveData.corp_id = userInfo.corp_id;
            saveData.suite_id = userInfo.suite_id;
            saveData.app_id = userInfo.app_id;
            saveData.corpid = userInfo.corpid;
            saveData.createUserId = userInfo.userId;
            saveData.createTime = new Date().Format('yyyy-MM-dd hh:mm:ss');

            if (hasPush) {
                postData.v = JSON.stringify([{
                    t: 'message',
                    data: saveData,
                    ai: true,
                    slave: slave
                }]);

                // 插入页面标签
                postData.params = JSON.stringify(params);

                YT.insert({
                    data: postData,
                    successCallback: function (data) {
                        if (data.status == 200) {
                            var item = data.object;
                            saveData.id = item.ids[0]; // message_id
                            if (6 == saveData.msgType) { // 只适用于平面
                                saveData.picurl = item.picurl;
                            }
                            module.data.messageData = saveData;
                            insertCallback(data);
                        } else {
                            $.alert('保存失败!');
                        }
                    }
                });
            } else {
                $.dialog({
                    //跨框架弹出对话框
                    title: '选择组',
                    parent: window.parent,
                    relative: false,
                    content: 'url:/module/web/message/select-groups.html',
                    width: 600,
                    height: 450,
                    //传递给子对话框参数,
                    data: {
                        callback: function (win, group_ids) {
                            win.api.close();

                            // 消息与组关系
                            var slave = [];

                            for (var i in group_ids) {
                                slave.push({
                                    t: 'groups_message_relation',
                                    data: {group_id: group_ids[i]},
                                    key: 'message_id'
                                });
                            }

                            postData.v = JSON.stringify([{
                                t: 'message',
                                data: saveData,
                                ai: true,
                                slave: slave
                            }]);

                            // 插入页面标签
                            postData.params = JSON.stringify(params);

                            YT.insert({
                                data: postData,
                                successCallback: function (data) {
                                    if (data.status == 200) {
                                        var item = data.object;
                                        saveData.id = item.ids[0]; // message_id
                                        if (6 == saveData.msgType) { // 只适用于平面
                                            saveData.picurl = item.picurl;
                                        }
                                        module.data.messageData = saveData;
                                        insertCallback(data);
                                    } else {
                                        $.alert('保存失败!');
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    },

    ajaxData_dialog: function () {
        if (!module.service.validateData()) {
            return false;
        }

        var messageData = module.data.messageData,
            userInfo = JSON.parse($.cookie('userInfo')),
            saveData = module.service.getPostData(),
            postData = {
                m: module.data.m,
                t: 'message'
            },
            params = {
                slave_label: module.data.labelNames,
                corpid: userInfo.corpid,
                msgType: this.msgType
            };

        if (5 == this.msgType) { // H5需要html文件地址
            params.pageUrl = saveData.description;
        } else if (6 == this.msgType) { // 平面需要保存图片
            var pageData = this.hasFrame ? frames["page-view"].pageData : window.pageData;
            if (!$.isEmptyObject(pageData)) {
                params.imgUrl = pageData.imgUrl + pageData.size;
            }
        }

        if (!$.isEmptyObject(messageData)) {
            var message_id = messageData.id,
                filter = [
                    {field: 'id', value: message_id, operator: '=', relation: 'AND'}
                ];

            saveData.id = message_id;

            var slave = [{t: 'message_tag_relation', key: 'id:message_id'}];

            postData.v = JSON.stringify([{
                t: 'message',
                data: saveData,
                filter: filter,
                id: message_id,
                slave: slave
            }]);

            // 插入页面标签
            params.data_id = message_id;
            postData.params = JSON.stringify(params);

            YT.update({
                data: postData,
                successCallback: function (data) {
                    if (data.status == 200) {
                        $.alert('保存成功!', function () {
                            callback(window);
                        });
                    } else {
                        $.alert('保存失败!');
                    }
                }
            });
        }
    },

    ajaxPush: function () {
        var self = this,
            messageData = module.data.messageData,
            saveData = [],
            pushTime = new Date().Format('yyyy-MM-dd hh:mm:ss');

        for (var i = 0; i < module.data.personIds.length; i++) {
            saveData.push({
                t: 'message_share',
                data: {
                    messageId: messageData.id,
                    staffId: module.data.personIds[i],
                    pushTime: pushTime,
                    shareFlag: 0,
                    openCount: 0
                },
                ai: true
            });
        }

        var postData = {
            m: module.data.m,
            t: 'message_share',
            v: JSON.stringify(saveData),
            params: JSON.stringify({message_id: messageData.id, staff_ids: module.data.personIds.join(',')})
        };

        YT.insert({
            data: postData,
            successCallback: function (data) {
                if (data.status == 200) {
                    var ids = [];
                    if (saveData.length == 1) {
                        ids.push(data.object);
                    } else {
                        ids = data.object;
                    }
                    self.pushMsg(ids);
                } else {
                    $.alert('推送失败！');
                }
            }
        });
    },

    pushMsg: function (ids) {
        var userInfo = JSON.parse($.cookie('userInfo')),
            messageData = module.data.messageData,
            article = {
                title: messageData.titleText,
                btntxt: "阅读全文",
                picurl: ''
            },
            tkt = YT.getTicket();

        switch (+messageData.msgType) {
            case 2:
            case 6:
                article.picurl = YT.server + '/module/web/upload/' + messageData.picurl;
                break;
            case 5:
                //article.picurl = YT.server + '/image/cover-h5.png';
                break;
        }

        for (var i = 0; i < module.data.personIds.length; i++) {
            if (tkt == null || tkt === undefined) {
                tkt = "";
            }
            article.url = messageData.url + "?tkt=" + tkt + "&u=" + module.data.personIds[i] + "&d=" + ids[i] + "&s=0&t=0";
            pushMsgTool.sendMessage(
                {
                    config: {
                        toType: {
                            type: [1],
                            touser: module.data.personCounts[i]
                        },
                        msgtype: 'news',
                        safe: 0
                    },
                    content: {
                        articles: [
                            article
                        ]
                    },
                    userId: userInfo.userId,
                    appId: appAgent.apps.sales_ass_id
                },
                function (data) {
                },
                function (data) {
                });
        }
        this.goBack('已推送！');
    },

    showDialog: function (str, callback) {
        $.dialog({
            title: '提示',
            width: 350,
            height: 100,
            content: '<table class="alert"><tbody><tr><td class="alert-icon"><i class="iconfont"></i></td><td class="alert-content">' + str + '</td></tr></tbody></table>',
            buttons: [
                {
                    name: '前往列表页',
                    className: 'btn-lightBlue',
                    callback: function () {
                        callback();
                        //返回false 可以阻止对话框关闭
                        return false;
                    }
                },
                {
                    name: '留在当前页'
                }
            ]
        });
    },

    goBack: function (msg) {
        //this.showDialog('已推送！', function () {
        $.alert(msg, function () {
            location.href = YT.server + '/module/web/message/message-list.html?' + location.href.split('?')[1];
        });
    },

    createPageHtml: function () {
        var html = '';

        html += '<div class="box" id="pageWrap" style="display: none;">';

        // 左侧内容（iframe）
        html += '<div class="page-left">';
        if (this.hasFrame) {
            html += '<iframe name="page-view" id="page-view"></iframe>';
        } else {
            html += '<div id="page-view"></div>';
        }
        html += '</div>';

        // 中间内容（翻页）
        html += '<div class="page-center">';
        html += '<i class="iconfont f32 prev">&#xe60d;</i>';
        html += '</br></br>';
        html += '<i class="iconfont f32 next">&#xe60a;</i>';
        html += '</div>';

        // 右侧内容（添加标签、热门标签）- 开始
        html += '<div class="page-right">';

        // 头部
        html += '<div class="content-header">';

        // 标题
        html += '<div style="text-align: left;">';
        html += '<label>标题：</label>';
        html += '<input type="text" class="input" id="title" placeholder="请输入标题" maxlength="50">';
        html += '</div>';

        // 左侧
        html += '<div class="fl">';
        html += '<input type="text" class="input" id="label-text" placeholder="请输入标签名称" maxlength="20">';
        html += '<a id="btn-label">添加</a>';
        html += '</div>';

        // 右侧
        html += '<div class="fr">';
        html += '<img src="/image/hot.png" class="label-hot">';
        html += '<div id="label-list">';
        html += '<div class="box"></div>';
        html += '</div>';
        html += '</div>';

        // 头部 结束
        html += '</div>';
        // 清楚浮动
        html += '<div class="clear"></div>';

        // 主体（显示页面标签）
        html += '<div id="label-view">';
        html += '<div class="box" style="max-height: 250px;"></div>';
        html += '</div>';

        // 尾部
        if (this.isShowFooter) {
            html += '<div class="content-footer">';
            html += '<a type="button" class="btn" id="page-save" style="margin-right: 10px;">保存</a>';
            html += '<a type="button" class="btn" id="page-push">发布</a>';
            html += '</div>';
        }

        // 右侧内容 - 结束
        html += '</div>';
        // 消息页面预览 - 结束
        html += '</div>';

        $(this.ele).append(html);
    },

    createLabelHtml_del: function (i, id, name) {
        var html = '';
        html += '<div class="box-label label-del" data-i="' + i + '">';
        html += '<span data-id="' + id + '">' + name + '</span>';
        html += '<span class="label-hover label-hover-bg"></span>';
        html += '<span class="label-hover"><i class="iconfont icon-del">&#xe601;</i></span>';
        html += '</div>';
        return html;
    },

    initData: function (callback) {
        var self = this, message_id = YT.getUrlParam('id');
        self.getLabelData(message_id, function (d_label) {
            var items = d_label;
            for (var i in items) {
                var item = items[i],
                    pageName = --item.page,
                    labelInfo = {
                        id: item.tag_id,
                        name: item.tag_name
                    };

                if (module.data.labelNames[pageName]) {
                    module.data.labelNames[pageName].push(labelInfo);
                } else {
                    module.data.labelNames[pageName] = [labelInfo];
                }
            }

            self.getMessageData(message_id, function (d_message) {
                module.data.messageData = d_message;
                module.data.title = d_message.title;
                callback(d_message);
            });
        })
    },

    getMessageData: function (message_id, callback) {
        var filter = [
            {field: 'id', value: message_id, operator: '=', relation: 'and'}
        ];

        var data = {
            m: module.data.m,
            t: 'v_message',
            filter: JSON.stringify(filter)
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    callback(data.object[0]);
                } else {
                    $.alert('网络异常，请与管理员联系！');
                }
            }
        });
    },

    getLabelData: function (message_id, callback) {
        var filter = [
            {field: 'message_id', value: YT.getUrlParam('id'), operator: '=', relation: 'and'}
        ];

        var data = {
            m: module.data.m,
            t: 'v_message_tag',
            filter: JSON.stringify(filter)
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    callback(data.object);
                } else {
                    $.alert('网络异常，请与管理员联系！');
                }
            }
        });
    },

    initPageWrapStatus: function (w, h) {
        var page_w = w || 320, page_h = h || 504, $page_view;
        $('#pageWrap').show();
        if (this.hasFrame) {
            $page_view = $('iframe[name="page-view"]');
            $page_view.attr({'width': page_w + 'px', 'height': page_h + 'px'});
        } else {
            $page_view = $('#page-view');
            $page_view.css({'width': page_w + 'px', 'height': page_h + 'px'});
        }
        if (undefined != $page_view) {
            $page_view.addClass('page-view-bg');
        }
        $('#page-save, #page-push').addClass('btn_disabled');
    },

    removePageWrapStatus: function () {
        var $page_view;
        if (this.hasFrame) {
            $page_view = $('iframe[name="page-view"]');
        } else {
            $page_view = $('#page-view');
        }
        if (undefined != $page_view) {
            $page_view.removeClass('page-view-bg');
        }
        $('#page-save, #page-push').removeClass('btn_disabled');
    }
};

// 分享
MessageComm.share = {
    shareId: -1,
    shareDetailId: -1,
    share_link: '',

    // module/message 处调用初始化JS-SDK
    initWxConfig: function (callback) {
        wxCommon.service.initWxConfig(
            [
                'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo',
                'onMenuShareQZone', /*'onMenuShareWechat',*/'showAllNonBaseMenuItem', 'hideAllNonBaseMenuItem'
            ],
            function () {
                callback();
            },
            function () {
                $.hideLoading();
            },
            function () {
                $.hideLoading();
            },
            function () {
                $.hideLoading();
            }
        );
    },

    // module/web/message 处调用初始化JS-SDK
    _initWxConfig: function (shareFlag, times, callback) {
        wxCommon.service.initWxConfig(
            [
                'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo',
                'onMenuShareQZone', /*'onMenuShareWechat',*/'showAllNonBaseMenuItem', 'hideAllNonBaseMenuItem'
            ],
            function () {
                callback();
            },
            function () {
                if ('' + shareFlag == '0' && times == 1) {
                    $.alert('加载失败，请刷新页面!', '提示', function () {
                        location.reload();
                    });
                }
            },
            function () {
                if ('' + shareFlag == '0' && times == 1) {
                    $.alert('加载失败，请刷新页面!', '提示', function () {
                        location.reload();
                    });
                }
            },
            function () {
                if ('' + shareFlag == '0' && times == 1) {
                    $.alert('加载失败，请刷新页面!', '提示', function () {
                        location.reload();
                    });
                }
            }
        );
    },

    initWxShare: function (params, shareFlag) {
        wx.onMenuShareTimeline({
            title: params.share_title, // 分享标题
            link: params.share_link, // 分享链接
            imgUrl: params.share_imgurl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                console.log("onsuccess:"+params.onsuccess);
                console.log("desc:"+params.share_desc);
                console.log("link:"+params.share_link);
                console.log("imgUrl:"+params.share_imgurl);
                console.log("shareFlag:"+shareFlag);
                if (params.onsuccess && shareFlag != null && shareFlag !== undefined)
                    params.onsuccess('朋友圈');
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        wx.onMenuShareAppMessage({
            title: params.share_title, // 分享标题
            desc: params.share_desc, // 分享描述
            link: params.share_link, // 分享链接
            imgUrl: params.share_imgurl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
                console.log("onsuccess:"+params.onsuccess);
                console.log("desc:"+params.share_desc);
                console.log("link:"+params.share_link);
                console.log("imgUrl:"+params.share_imgurl);
                console.log("shareFlag:"+shareFlag);
                if (params.onsuccess && shareFlag != null && shareFlag !== undefined)
                    params.onsuccess('朋友');
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        wx.onMenuShareQQ({
            title: params.share_title, // 分享标题
            desc: params.share_desc, // 分享描述
            link: params.share_link, // 分享链接
            imgUrl: params.share_imgurl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                if (params.onsuccess && shareFlag != null && shareFlag !== undefined)
                    params.onsuccess('QQ');
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        wx.onMenuShareWeibo({
            title: params.share_title, // 分享标题
            desc: params.share_desc, // 分享描述
            link: params.share_link, // 分享链接
            imgUrl: params.share_imgurl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                if (params.onsuccess && shareFlag != null && shareFlag !== undefined)
                    params.onsuccess('微博');
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        wx.onMenuShareQZone({
            title: params.share_title, // 分享标题
            desc: params.share_desc, // 分享描述
            link: params.share_link, // 分享链接
            imgUrl: params.share_imgurl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                if (params.onsuccess && shareFlag != null && shareFlag !== undefined)
                    params.onsuccess('空间');
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        wx.showAllNonBaseMenuItem();
    },

    insertShare: function (params, shareFlag, customerId, shareId, shareDetailId, _share_link, share_ip, userId) {
        var self = this;
        this.shareId = shareId;
        this.customerId = customerId;
        this.shareDetailId = shareDetailId;
        this.share_link = params.share_link;
        this.userId = userId;
        console.log("customerId:"+customerId);
        // 插入分享
        // 添加客户
        // self.id = data;
        this.ajaxData(share_ip, function (data) {
            console.log("share id:"+shareId);
            if (customerId == null || customerId == undefined) {
                // 打开填写客户Popup
                $(document.body).addClass('page-unScroll');
                $('#popup_customer').popup();
                $('#save, #toolbar-save').click(function () {
                    console.log("share id:"+shareId);
                    MessageComm.share.shareId = shareId;
                    MessageComm.customer.triggerSaveBtn(shareId, userId);
                });
            }

            // console.log("before  params.share_link:"+params.share_link);
            // params.share_link = _share_link + "&shareid="+shareId ;
            // console.log("after   params.share_link:"+params.share_link);

            // 重新初始化分享
            MessageComm.share.initWxShare(params, shareFlag);
        });
    },

    // 插入分享
    ajaxData: function (share_ip, callback) {
        var self = this, v = [];
        callback();
        // v.push({
        //     t: 'message_share_uid',
        //     data: {
        //         shareId: self.shareId,
        //         shareDetailId: self.shareDetailId,
        //         uid: YT.getSrcString(self.share_link, 'uid'),
        //         time: new Date().Format('yyyy-MM-dd hh:mm:ss')
        //     },
        //     ai: true
        // });
        //
        // YT.insert({
        //     loading: false,
        //     data: {
        //         m: self.m,
        //         t: 'message_share_uid',
        //         v: JSON.stringify(v),
        //         params: JSON.stringify({ip: share_ip}),
        //         isvisitor: MessageComm.customer.isvisitor
        //     },
        //     successCallback: function (data) {
        //         callback(data.object);
        //     }
        // });
    }

};

// 添加客户
MessageComm.customer = {
    customerData: {},
    customerList: [], // 老客户列表数据
    extraFilter:false,
    extraFilterData:'',
    pager: {
        loading: false,
        lastPage: false,
        pageCount: 0,
        page: 1,
        size: 12
    },
    searchPager: {
        loading: false,
        lastPage: false,
        pageCount: 0,
        page: 1,
        size: 12
    },
    callback: function () {

    },

    init: function (e, isvisitor) {
        this.ele = e || '#btn-save'; // 隐藏的保存按钮，不是事件源
        this.isvisitor = isvisitor || 0;
        this.createPopupHtml();
        this.initForm();
        this.handleSaveBtn();
        this.handleChooseBtn();
        this.handleClearBtn();
        this.handleCloseBtn();
        this.handleRefresh();
        this.handleInfinite();
        this.handleSearchInput();
        this.handleSearchCancel();
    },

    initForm: function () {
        var data = [
            {id: 'mobile', name: '手机号', type: 'number', p_name: 'pattern', p_val: '[0-9]*'},
            {id: 'name', name: '姓名', type: 'text', p_name: 'maxlength', p_val: '8'},
            {id: 'wechat', name: '微信号', type: 'text', p_name: 'maxlength', p_val: '30'},
            {id: 'company', name: '公司', type: 'text', p_name: 'maxlength', p_val: '30'},
            {id: 'position', name: '职位', type: 'text', p_name: 'maxlength', p_val: '20'},
            {id: 'address', name: '地址', type: 'text', p_name: 'maxlength', p_val: '50'},
            {id: 'telephone', name: '座机', type: 'text', p_name: 'maxlength', p_val: '13'},
            {id: 'email', name: '邮箱', type: 'text', p_name: 'maxlength', p_val: '30'},
            {id: 'website', name: '网址', type: 'text', p_name: 'maxlength', p_val: '50'},
            {id: 'fax', name: '传真', type: 'text', p_name: 'maxlength', p_val: '30'}
        ];

        var $form = $('#form_customer');
        $form.children().remove();
        $form.append(this.createFormHtml(data));
    },

    triggerSaveBtn: function (shareId, userId) {
        this.share_id = shareId; // 分享记录关系主键
        this.user_id = userId; // 分享人（销售员主键）
        $(this.ele).triggerHandler('click');
    },

    handleSaveBtn: function () {
        var self = this, $el = $('#popup_choose');

        $(this.ele).click(function () {
            self.validateData();
        });

        $el.on('click', '.close-popup_choose', function () {
            var $radio = $el.find('.customer-list input[name="radio"]:checked');
            if ($radio.is(':checked')) {
                self.customerData = $radio.data('d');
                self.setCustomerVal(self.customerData);
                console.log("MessageComm shareId:"+MessageComm.share.shareId);
                console.log("MessageComm userId:"+MessageComm.share.userId);
                MessageComm.customer.triggerSaveBtn(MessageComm.share.shareId, MessageComm.share.userId);
                //$.closePopup('#popup_choose');
            } else {
                self.customerData = {};
                self.setCustomerVal(self.customerData);
                $.alert('未选择客户！');
            }
        });
    },

    // 选择老客户事件
    handleChooseBtn: function () {
        var self = this;
        $('#choose').click(function () {
            var $el = $('#popup_choose');
            $el.addClass('weui-popup__container--visible').css('display', 'block');
            console.log("self.pager.lastPage:"+self.pager.lastPage);
            if (!self.pager.lastPage && self.customerList.length == 0) {
                $list = $el.find('.customer-list');
                $list.empty();
                self.initCustomerData($el);
            } else {
                // self.createCustomerData($el, self.customerList);
            }
        });
    },

    // 重置事件
    handleClearBtn: function () {
        var self = this;
        $('#btn-clear').click(function () {
            self.resetCustomerData();
        });
    },

    // Popup关闭事件
    handleCloseBtn: function () {
        var self = this;

        $('#popup_customer').on('click', '.close-popup_customer', function () {
            self.resetCustomerDom();
            self.resetCustomerData();
        });

        $('#btn-close').click(function () {
            self.resetChooseCustomerDom();
            $.closePopup('#popup_choose');
            /*$('#popup_customer').popup();
             // css完成修改后再修改
             var modal = $('#popup_customer').find(".weui-popup__modal");
             modal.transitionEnd(function () {
             $('#popup_customer').css('display', 'block');
             });*/
        });
    },

    // 老客户下拉刷新
    handleRefresh: function () {
        var self = this, $el = $('#popup_choose');
        $el.find('.modal-content').pullToRefresh(function () {
            var $this = this;
            setTimeout(function () {
                self.pager = {
                    loading: false,
                    lastPage: false,
                    pageCount: 0,
                    page: 1,
                    size: 12
                };
                self.customerList = [];
                self.resetChooseCustomerDom();
                self.initCustomerData($el);
                $this.pullToRefreshDone();
            }, 1000);
        });
    },

    // 老客户滚动加载事件
    handleInfinite: function () {
        var self = this, $el = $('#popup_choose');

        $el.find('.modal-content').infinite().on("infinite", function () {
            var $search = $el.find('.searchInput');
            var searchVal = $.trim($search.val());
            // 如果不是最后一页并且搜索框内容为空，则进行原始页面的滚动加载，反之进行搜索滚动加载
            console.log("self.pager.lastPage:"+self.pager.lastPage);
            if (!self.pager.lastPage && searchVal) {
                if (self.searchPager.loading) return;
                self.searchPager.loading = true;
                self.searchPager.page++;
                // $el.find('.msg-loading').show();
                self.initSearchCustomerData($el, searchVal);
            } else {
                if (self.pager.loading) return;
                self.pager.loading = true;
                self.pager.page++;
                // $el.find('.msg-loading').show();
                self.initCustomerData($el);
            }
        });
    },

    // 老客户搜索事件
    handleSearchInput: function () {
        var self = this, $el = $('#popup_choose');
        $el.find('.searchInput').bind('input propertychange', function (e) {
            self.customerData = {};
            var arr = [], customerList = self.customerList, searchVal = $(this).val();
            $el.find('.customer-list').empty();
            if (self.pager.lastPage) {
                for (var i in customerList) {
                    if (customerList[i].name.indexOf(searchVal) >= 0) {
                        arr.push(customerList[i]);
                    }
                }
                self.createCustomerData($el, arr);
            } else {
                if (searchVal) {
                    // 每次初始化搜索滚动
                    self.searchPager = {
                        loading: false,
                        lastPage: false,
                        pageCount: 0,
                        page: 1,
                        rows: 12
                    };
                    self.initSearchCustomerData($el, searchVal);
                } else {
                    self.createCustomerData($el, customerList);
                }
            }
        }).on('keydown', function (e) {
            if (e.keyCode == 13) { // 禁用回车
                e.preventDefault();
            }
        });
    },

    // 老客户取消事件
    handleSearchCancel: function () {
        var self = this, $el = $('#popup_choose');
        $el.on('click', '.searchCancel, .searchClear', function () {
            $el.find('.customer-list').empty();
            self.createCustomerData($el, self.customerList);
        });
    },

    validateData: function () {
        var self = this,
            postData = self.validateDataChange(),
            mobile = postData.obj.mobile,
            customer_id = self.customerData.id;

        if (customer_id && postData.isChange) {
            $.alert('信息被修改，无法保存！');
        } else {
            if (customer_id) {
                self.ajaxData();
            } else {
                if (mobile) {
                    var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/i;
                    reg = /^1\d{10}$/i;
                    if (reg.test(mobile)) {
                        $.ajax({
                            type: 'get',
                            url: "/customer/valid?mobile="+mobile,
                            contentType: "application/json;charset=UTF-8",
                            dataType: 'json',
                            error: function (request) {
                            },
                            success: function (result) {
                                if (result.code == 0) {
                                    // todo 座机、邮箱、网址、传真需要做验证
                                    self.ajaxData();
                                }else{
                                    $.alert('手机号已存在！');
                                }
                            }
                        });
                    } else {
                        $.alert('手机号格式不正确！');
                    }
                } else {
                    $.alert('手机号必须填写！');
                }
            }

        }
    },

    validateDataChange: function () {
        var self = this,
            obj = self.getCustomerVal(),
            customer_data = self.customerData,
            customer_mobile = customer_data.mobile,
            customer_name = customer_data.name || '',
            customer_position = customer_data.position || '',
            customer_company = customer_data.company || '',
            customer_wechat = customer_data.wechat || '',
            customer_address = customer_data.address || '',
            customer_telephone = customer_data.telephone || '',
            customer_email = customer_data.email || '',
            customer_website = customer_data.website || '',
            customer_fax = customer_data.fax || '',
            customer_remark = customer_data.remark || '';

        if (obj.mobile == customer_mobile && obj.name == customer_name && obj.position == customer_position &&
            obj.company == customer_company && obj.wechat == customer_wechat && obj.address == customer_address &&
            obj.telephone == customer_telephone && obj.email == customer_email && obj.website == customer_website &&
            obj.fax == customer_fax && obj.remark == customer_remark) {
            return {
                obj: obj,
                isChange: false
            };
        } else {
            return {
                obj: obj,
                isChange: true
            };
        }
    },

    getCustomerVal: function () {
        var mobile = $('#mobile').val();
        var name = $.trim($('#name').val());
        var position = $.trim($('#position').val());
        var company = $.trim($('#company').val());
        var wechat = $.trim($('#wechat').val());
        var address = $.trim($('#address').val());
        var telephone = $('#telephone').val();
        var email = $.trim($('#email').val());
        var website = $.trim($('#website').val());
        var fax = $.trim($('#fax').val());
        var remark = $.trim($('#remark').val());

        return {
            mobile: mobile,
            name: name,
            position: position,
            company: company,
            wechat: wechat,
            address: address,
            telephone: telephone,
            email: email,
            website: website,
            fax: fax,
            remark: remark
        }
    },

    setCustomerVal: function (data) {
        var obj = $.extend({
            mobile: '',
            name: '',
            position: '',
            company: '',
            wechat: '',
            address: '',
            telephone: '',
            email: '',
            website: '',
            fax: '',
            remark: ''
        }, data);
        $('#mobile').val(obj.mobile);
        $('#name').val(obj.name);
        $('#position').val(obj.position);
        $('#company').val(obj.company);
        $('#wechat').val(obj.wechat);
        $('#address').val(obj.address);
        $('#telephone').val(obj.telephone);
        $('#email').val(obj.email);
        $('#website').val(obj.website);
        $('#fax').val(obj.fax);
        $('#remark').val(obj.remark);
    },

    resetCustomerDom: function () {
        $(document.body).removeClass('page-unScroll');
        $.closePopup();
    },

    resetChooseCustomerDom: function () {
        var $el = $('#popup_choose');
        $el.find('.searchInput').val('');
        $el.find('.customer-list').empty();
        self.customerData = {};
    },

    resetCustomerData: function () {
        this.customerData = {};
        this.setCustomerVal();
    },

    ajaxData: function () {
        $.showLoading('数据提交中...');
        var self = this, v = [],
            obj = self.getCustomerVal(),
            customer_id = self.customerData.id;
        console.log("shareId:"+this.share_id);
        console.log("userId:"+this.user_id);
        if (customer_id) {
            // 添加销售人员与客户关系
            var objData = new Map();
            objData['userId'] = module.data.user_id;
            objData['messageId'] = module.data.message_id;
            objData['customerId'] = customer_id;
            objData['shareId'] = this.share_id;
            $.ajax({
                type: 'post',
                url: "/message/share/customer",
                data:JSON.stringify(objData),
                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                error: function (request) {
                },
                success: function (result) {
                    if (result.code == 0) {
                        // 清空数据
                        self.resetCustomerDom();
                        self.resetCustomerData();
                        $.alert('提交成功！', function () {
                            self.callback();
                        });
                    }
                    $.hideLoading();
                }
            });
        } else {
            var objData = new Map();
            objData['userId'] = module.data.user_id;
            objData['messageId'] = module.data.message_id;
            objData['customer'] = obj;
            $.ajax({
                type: 'post',
                url: "/customer/save/share",
                data:JSON.stringify(objData),
                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                error: function (request) {
                },
                success: function (result) {
                    if (result.code == 0) {
                        // 清空数据
                        var data = result.data;
                        self.customerId = data.customerId;
                        self.resetCustomerDom();
                        self.resetCustomerData();
                        $.alert('提交成功！', function () {
                            self.callback();
                        });
                    }
                    $.hideLoading();
                }
            });

        }
    },

    initSearch: function () {
        var searchInput = "";
        var userId = null;
        var groupId = null;
        if(MessageComm.customer.extraFilter && MessageComm.customer.extraFilterData.length >0){
            searchInput = MessageComm.customer.extraFilterData;
        }
        userId = module.data.user_id;
        return {
            userId:userId,
            searchInput:searchInput,
            groupId:groupId,
            page:MessageComm.customer.pager.page,
            size:MessageComm.customer.pager.size
        };
    },

    // 初始化老客户Popup
    initCustomerData: function ($el) {
        var self = this;
        var postData = this.initSearch();
        $.ajax({
            type: "post",
            url: "/customer/list",
            data:JSON.stringify(postData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if(result.code == 0){
                    $list = $el.find('.customer-list');
                    var data = result.data;
                    if(data!=null){
                        console.log("data.length:"+data.length);
                        if(data.length<self.pager.size){
                            self.pager.lastPage = true;
                            $el.find('.msg-loading').hide();
                        }
                        if (data.length > 0) {
                            self.pager.loading = true;
                            for (var i in data) {
                                self.customerList.push(data[i]);
                            }
                            $list.append(self.createCustomerHtml(data));
                        }
                    }else{
                        self.pager.lastPage = true;
                        $el.find('.msg-loading').hide();
                    }
                }
                self.pager.loading = false;
            },
            error:function (result) {
                alert(result.status);
                alert(result.statusText);
            }
        });
    },

    // 初始化老客户Popup 带搜索
    initSearchCustomerData: function ($el, searchVal) {
        var self = this;
        var postData = this.initSearch();
        postData['searchInput'] = searchVal;
        console.log("searchInput:"+postData['searchInput']);
        $.ajax({
            type: "post",
            url: "/customer/list",
            data:JSON.stringify(postData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if(result.code == 0){
                    $list = $el.find('.customer-list');
                    var data = result.data;
                    console.log("data.length:"+data.length);
                    if(data!=null){
                        if(data.length<self.searchPager.pageCount){
                            self.searchPager.lastPage = true;
                            $el.find('.msg-loading').hide();
                        }
                        if (data.length > 0) {
                            self.pager.loading = true;
                            $list.append(self.createCustomerHtml(data));
                        }
                    }else{
                        self.searchPager.lastPage = true;
                        $el.find('.msg-loading').hide();
                    }
                }
                self.pager.loading = false;
            },
            error:function (result) {
                alert(result.status);
                alert(result.statusText);
            }
        });
    },

    createCustomerData: function ($el, data) {
        $el.find('.customer-list').append(this.createCustomerHtml(data));
        this.createMsgHtml($el, data.length);
    },

    getPagerData: function () {
        return {
            m: this.m,
            t: 'v_customers_distinct',
            order: 'id',
            page: this.pager.page,
            rows: this.pager.rows
        }
    },

    getSearchPagerData: function (searchVal) {
        var filter = [
            {field: 'name', value: '%' + searchVal + '%', operator: 'like', relation: 'and'}
        ];

        return {
            m: this.m,
            t: 'v_customers_distinct',
            filter: JSON.stringify(filter),
            order: 'id',
            page: this.searchPager.page,
            rows: this.searchPager.rows
        }
    },

    // 新增客户表单
    createFormHtml: function (data) {
        var html = '';

        /**
         * {
         *  id:     元素id
         *  name:   显示名称
         *  p_name: 附加属性
         *  p_val:  附加参数
         * }
         */

        for (var i in data) {
            var obj = data[i],
                name = obj.name,
                p_name = obj.p_name;
            html += '<div class="weui-cell">';
            html += '<div class="weui-cell__hd"><label class="weui-label">' + name + '</label></div>';
            html += '<div class="weui-cell__bd">';
            html += '<input id="' + obj.id + '" class="weui-input" type="' + obj.type + '" placeholder="请输入' + name + '"';
            if (p_name) {
                html += ' ' + p_name + '="' + obj.p_val + '"';
            }
            html += '>';
            html += '</div>';
            html += '</div>';
        }

        return html;
    },

    // 老客户列表
    createCustomerHtml: function (data) {
        var html = '';

        for (var i in data) {
            var item = data[i];
            html += '<label class="weui-cell weui-check__label">';
            html += '<div class="weui-cell__bd">';
            html += '<p>' + (item.name || '【未填姓名】') + '&nbsp;&nbsp;' + item.mobile + '</p>';
            html += '</div>';
            html += '<div class="weui-cell__ft">';
            html += '<input type="radio" name="radio" class="weui-check" data-d="' + JSON.stringify(item).replace(/"/g, "&quot;") + '">';
            html += '<span class="weui-icon-checked"></span>';
            html += '</div>';
            html += '</label>';
        }

        return html;
    },

    // 新增客户Popup、选择老客户Popup
    createPopupHtml: function () {
        var html = '';

        // 填写客户Popup
        html += '<div id="popup_customer" class="weui-popup__container">';
        html += '<div class="weui-popup__overlay"></div>';
        html += '<div class="weui-popup__modal">';

        // 顶部内容
        html += '<div class="toolbar">';
        html += '<div class="toolbar-inner">';
        html += '<a href="javascript:;" class="picker-button close-popup_customer" style="position: relative;">关闭</a>';

        html += '<div class="picker-button">';
        // 选择老客户事件
        html += '<a href="javascript:;" id="choose" style="margin-right: 20px;"><i class="iconfont" style="color: #0bb20c;font-size: 20px;">&#xe640</i></a>';
        html += '<a href="javascript:;" style="color: #0bb20c;" id="toolbar-save">保存</a>';
        html += '</div>';

        html += '<h1 class="title">填写客户</h1>';
        html += '</div>';
        html += '</div>';

        // 中间内容
        html += '<div class="modal-content" style="-webkit-overflow-scrolling : touch;">'; // css修复ios滚动不流畅

        html += '<div class="weui-cells weui-cells_form" id="form_customer"></div>';
        html += '<div class="weui-cells__title">备注</div>';
        html += '<div class="weui-cells weui-cells_form">';
        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__bd">';
        html += '<textarea id="remark" class="weui-textarea" placeholder="请输入备注" rows="3"></textarea>';
        //html += '<div class="weui-textarea-counter"><span>0</span>/200</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div style="position: relative;height: 80px;"></div>';
        html += '</div>';

        // 底部内容
        html += '<div style="position: fixed;bottom: 0;width: 100%;">';
        html += '<div class="weui-btn-area">';
        html += '<div class="weui-flex">';
        html += '<div class="weui-flex__item" style="margin-right: 15px;"><a class="weui-btn weui-btn_primary" id="save" href="javascript:;">保存</a></div>';
        html += '<div class="weui-flex__item"><a class="weui-btn weui-btn_default" id="btn-clear" href="javascript:;">重置</a></div>';
        html += '<a id="btn-save"></a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '</div>';
        html += '</div>';

        // 选择老客户Popup
        html += '<div id="popup_choose" class="weui-popup__container">';
        html += '<div class="weui-popup__overlay"></div>';
        html += '<div class="weui-popup__modal">';

        // 中间内容
        html += '<div class="modal-content" style="padding-top: 0;-webkit-overflow-scrolling : touch;">';

        // 下拉刷新
        html += '<div class="weui-pull-to-refresh__layer">';
        html += '<div class="weui-pull-to-refresh__arrow"></div>';
        html += '<div class="weui-pull-to-refresh__preloader"></div>';
        html += '<div class="down">下拉刷新</div>';
        html += '<div class="up">释放刷新</div>';
        html += '<div class="refresh">正在刷新</div>';
        html += '</div>';

        html += '<div class="weui-search-bar">';
        html += '<form class="weui-search-bar__form">';
        html += '<div class="weui-search-bar__box">';
        html += '<i class="weui-icon-search"></i>';
        html += '<input type="search" class="weui-search-bar__input searchInput" placeholder="搜索" required="">';
        html += '<a href="javascript:" class="weui-icon-clear searchClear"></a>';
        html += '</div>';
        html += '<label class="weui-search-bar__label searchText">';
        html += '<i class="weui-icon-search"></i>';
        html += '<span>搜索</span>';
        html += '</label>';
        html += '</form>';
        html += '<a href="javascript:" class="weui-search-bar__cancel-btn searchCancel">取消</a>';
        html += '</div>';

        html += '<div class="weui-panel weui-panel_access">';
        html += '<div class="weui-panel__bd  weui-cells_checkbox customer-list"></div>';
        html += '</div>';

        // 滚动加载
        html += '<div class="weui-loadmore msg-loading">';
        html += '<i class="weui-loading"></i>';
        html += '<span class="weui-loadmore__tips">正在加载</span>';
        html += '</div>';

        //html += '<div style="position: relative;height: 50px;"></div>';
        html += '</div>';

        // 底部内容
        html += '<div style="position: fixed;bottom: 0;width: 100%;">';
        html += '<div class="weui-btn-area">';
        html += '<div class="weui-flex">';
        html += '<div class="weui-flex__item" style="margin-right: 15px;"><a class="weui-btn weui-btn_primary close-popup_choose" href="javascript:;">保存</a></div>';
        html += '<div class="weui-flex__item"><a class="weui-btn weui-btn_default" id="btn-close" href="javascript:;">关闭</a></div>';
        html += '<a id="btn-save"></a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '</div>';
        html += '</div>';

        $(document.body).append(html);
    },

    createMsgHtml: function ($el, count) {
        $el.find('.msg-content').remove();
        $el.find('.weui-panel_access').after('<div class="weui-loadmore weui-loadmore_line msg-content"><span class="weui-loadmore__tips">共' + count + '条数据</span></div>');
    }

};