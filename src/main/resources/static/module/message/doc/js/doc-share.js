var module = {};

module.data = {
    user_id:getUrlParam("userid"),
    message_id:getUrlParam("msgid"),
    d:getUrlParam("d"),
    s:getUrlParam("s"),
    messageData: {}
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

                module_d.cid = ipData.cid;

                module_d.city = ipData.city;

                module_d.messageData = data;

                // 显示页面
                module_d.title = data.title;
                $('#page-view').css({'width': '100%', 'height': '100%'});
                PageSwiperComm.init('#page-view', data, 1);
                $.hideLoading();
                // todo 以下代码几乎与H5一致
                self.initShare();
            });
        });
    },

    getMessageData: function (callback) {
        $.ajax({
            type: 'post',
            url: "/message/doc?id="+module.data.message_id,
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
    },

    initShare: function (shareFlag,times) {
        var self = this,
            userId = module.data.user_id,
            messageId = parseInt(module.data.message_id),
            customerId = module.data.customer_id,
            shareFlag = module.data.s,
            shareTime = new Date().Format('yyyy-MM-dd hh:mm:ss'),
            messageData = module.data.messageData,
            share_ip = module.data.share_ip;

        MessageComm.share.initWxConfig(function () {
            var params = {};
            var messageShare = {
                messageId:messageId,
                userId:userId,
                shareTime:shareTime,
                shareFlag:0,
                openCount:0,
                delFlag:1
            };
            $.ajax({
                type: "post",
                url: "/message/share",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(messageShare),
                dataType: "json",
                success: function (result) {
                    if (result.code == 0) {
                        var data = result.data;
                        var dataId = data.id;
                        var _share_link = messageData.url + "?userid=" + userId +"&msgid="+ messageId +"&s=1&d=" + data.id ;
                        console.log("share_link: "+ _share_link);
                        console.log("picUrl: "+ messageData.picUrl);
                        params = {
                            share_title: messageData.titleText,
                            share_desc: '通过销售助手分享',
                            share_link: _share_link ,
                            share_imgurl: domain.server + '/images/cover-pdf.png',
                            onsuccess: function () {
                                var messageShare = {
                                    id:dataId,
                                    messageId:messageId,
                                    userId:userId,
                                    customerId:customerId,
                                    openCount:0,
                                    shareTime:shareTime,
                                    shareFlag:1,
                                    delFlag:0
                                };
                                $.ajax({
                                    type: "post",
                                    url: "/message/share",
                                    data: JSON.stringify(messageShare),
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    success: function (result) {
                                        if(result.code == 0){
                                            var data = result.data;
                                            var dataId = data.id;
                                            console.log("dataId:"+dataId);
                                            MessageComm.share.insertShare(params, shareFlag, customerId,dataId, -1, _share_link, share_ip, userId);
                                        }
                                    },
                                    error:function (result) {
                                    }
                                });
                            }
                        };

                        MessageComm.share.initWxShare(params, shareFlag);
                    } else {
                        alert(result.msg);
                    }
                    $.hideLoading();
                },
                error: function () {
                }
            });
        });
    },

    isResize: function () {
        var ua = navigator.userAgent;
        if ((ua.match(/(Android|webOS|iPhone|iPod|BlackBerry|Windows Phone)/i))) {
            return false;
        } else {
            return true;
        }
    }
};

module.eventHandler = {
    handleEvents: function () {
        MessageComm.customer.init();
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});