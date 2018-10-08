var module = {};

module.data = {
    user_id:getUrlParam("userid"),
    message_id:getUrlParam("msgid"),
    messageData: {},
    title: '' // 页面标题
};

module.service = {
    initControls: function () {
        this.initData();
    },

    initData: function () {
        var self = this, module_d = module.data;
        $.showLoading('加载中...');
        module.service.getMessageData(function (data) {
            OSTool.detectIP(function (ipData) {
                module_d.share_ip = ipData.ip;

                module_d.messageData = data;

                // 显示页面
                module_d.title = data.title;
                console.log("title:"+data.title);
                $('#pageWrap').show();
                self.setPageSize();
                console.log("description:"+data.description);
                $('iframe[name="page-view"]').attr('src', data.description);
                $.hideLoading();
                console.log("ending....");
                // self.initShare();
            });
        });
    },

    getMessageData: function (callback) {
        $.ajax({
            type: 'post',
            url: "/message/h5?id="+module.data.message_id,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if (result.code == 0) {
                    var data = result.data;
                    callback(data);
                }else {
                    $.alert('网络异常，请与管理员联系！');
                }
            }
        });

        // var filter = [
        //     {field: 'id', value: YT.getUrlParam('d'), operator: '=', relation: 'and'}
        // ];
        //
        // var data = {
        //     m: module.data.m,
        //     t: 'v_message',
        //     filter: JSON.stringify(filter)
        // };
        //
        // YT.query({
        //     data: data,
        //     successCallback: function (data) {
        //         if (200 == data.status) {
        //             callback(data.object[0]);
        //         } else {
        //             $.alert('网络异常，请与管理员联系！');
        //         }
        //     }
        // });
    },

    initShare: function () {
        var self = this,
            tkt = YT.getUrlParam('tkt'),
            shareFlag = YT.getUrlParam("s"),
            userId = YT.getUrlParam("u"),
            messageId = YT.getUrlParam("d"),
            dataId = -1,
            shareTime = new Date().Format('yyyy-MM-dd hh:mm:ss'),
            module_d = module.data,
            m = module_d.m,
            messageData = module_d.messageData,
            share_ip = module_d.share_ip;

        MessageComm.share.initWxConfig(function () {
            if (tkt != null) {
                var params = {};
                var postData = {
                    m: m,
                    t: 'message_share',
                    v: JSON.stringify([{
                        t: 'message_share',
                        data: {
                            messageId: messageId,
                            staffId: userId,
                            shareFlag: 1,
                            shareTime: shareTime,
                            openCount: 0,
                            delFlag: 1
                        },
                        ai: true
                    }])
                };
                YT.insert({
                    data: postData,
                    successCallback: function (data) {
                        if (data.status == 200) {
                            dataId = data.object;

                            var _share_link = messageData.url + "?u=" + userId + "&d=" + dataId + "&s=1&t=1";

                            params = {
                                share_title: messageData.titleText,
                                share_desc: '通过' + messageData.corp_name + '分享',
                                share_link: _share_link + '&uid=' + YT.uuid(),
                                share_imgurl: YT.server + '/image/cover-h5.png',
                                onsuccess: function () {
                                    var filter = [
                                        {field: 'id', value: dataId, operator: '=', relation: 'AND'}
                                    ];
                                    var postData = {
                                        m: m,
                                        t: 'message_share',
                                        v: JSON.stringify([{
                                            t: 'message_share',
                                            data: {
                                                shareTime: shareTime,
                                                shareFlag: 1,
                                                delFlag: 0
                                            },
                                            filter: filter
                                        }]),
                                        params: JSON.stringify({isvisitor: false})
                                    };
                                    YT.update({
                                        loading: false,
                                        data: postData,
                                        successCallback: function (data) {
                                            if (data.status == 200) {
                                                //$.toast("分享到"+str+"成功！");
                                                MessageComm.share.insertShare(params, shareFlag, dataId, -1, _share_link, share_ip, userId);
                                            } else {
                                                //$.alert(data.message);
                                            }
                                        }
                                    });
                                }
                            };

                            MessageComm.share.initWxShare(params, shareFlag);

                        }
                        $.hideLoading();
                    }
                });
            }
        });
    },

    isPC: function () {
        var ua = navigator.userAgent;
        if ((ua.match(/(Android|webOS|iPhone|iPod|BlackBerry|Windows Phone)/i))) {
            return false;
        } else {
            return true;
        }
    },

    setPageSize: function () {
        var doc_w = document.documentElement.clientWidth,
            doc_h = document.documentElement.clientHeight,
            w = doc_w, h = doc_h;

        if (this.isPC()) {
            h = doc_h > 640 ? 640 : doc_h;
            w = Math.floor(h * (320 / 504));

            if (doc_h > 640) {
                $('#pageWrap').css('top', (doc_h - h) / 2);
            }
        } else {
            w = doc_w > 500 ? 500 : doc_w;
        }

        $('iframe[name="page-view"]').attr({'width': w + 'px', 'height': h + 'px'});
    }
};

module.eventHandler = {
    handleEvents: function () {
        MessageComm.customer.init();
        $(window).resize(function () {
            module.service.setPageSize();
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});

// 防止微信浏览器被整体拖拽
$(function () {
    var startY, endY;
    var box_height = $('#pageWrap').height();
    $('.page-content').on('touchstart', function (event) {
        event.stopPropagation();
        startY = event.touches[0].pageY;
    });
    $('.page-content').on('touchmove', function (event) {
        event.stopPropagation();
        var endY = event.changedTouches[0].pageY;
        var changedY = endY - startY;
        var scroll_top = $('.page-content').scrollTop();
        // 判断是否在顶部，且向下拖动
        if (scroll_top === 0 && changedY > 0) {
            event.preventDefault();
        }
        // 判断是否在底部，且向上拖动
        var o = $('.page-footer').offset();
        if (o.top + o.height === box_height && changedY < 0) {
            event.preventDefault();
        }
    });
    // header禁止拖动
    $('.page-header').on('touchmove', function (event) {
        event.preventDefault();
    });
});