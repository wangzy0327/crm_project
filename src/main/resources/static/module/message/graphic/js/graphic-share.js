var module = {};

module.data = {
    m: 101010000,
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
                $('#page-view').css({'width': '100%', 'height': '100%'});
                PageSwiperComm.init('#page-view', JSON.parse(data.third_params), 1);
                self.initShare();
            });
        });
    },

    getMessageData: function (callback) {
        var filter = [
            {field: 'id', value: YT.getUrlParam('d'), operator: '=', relation: 'and'}
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
                                share_imgurl: YT.server + '/module/web/upload/' + messageData.picurl,
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
    }
};

module.eventHandler = {
    handleEvents: function () {
        MessageComm.customer.init();
        // 显示填写客户popup
        /*$(document.body).addClass('page-unScroll');
         $('#popup_customer').popup();
         $('#save, #toolbar-save').click(function () {
         MessageComm.customer.triggerSaveBtn();
         });*/
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});