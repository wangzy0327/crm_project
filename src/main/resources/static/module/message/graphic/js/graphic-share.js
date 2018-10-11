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
                $('#page-view').css({'width': '100%', 'height': '100%'});
                PageSwiperComm.init('#page-view', data, 1);
                $.hideLoading();
                self.initShare();
            });
        });
    },

    getMessageData: function (callback) {
        $.ajax({
            type: 'post',
            url: "/message/graphic?id="+module.data.message_id,
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

    initShare: function (shareFlag,times) {
        var self = this,
            userId = module.data.user_id,
            messageId = parseInt(module.data.message_id),
            shareTime = new Date().Format('yyyy-MM-dd hh:mm:ss'),
            messageData = module.data.messageData,
            share_ip = module.data.share_ip;

        MessageComm.share.initWxConfig(function () {
            var params = {};
            var messageShare = {
                messageId:messageId,
                userId:userId,
                shareTime:shareTime,
                shareFlag:1,
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
                        var _share_link = messageData.url + "?userid=" + userId +"&msgid="+ messageId +"&d=" + data.id ;
                        console.log("share_link: "+ _share_link);
                        console.log("picUrl: "+ messageData.picUrl);
                        params = {
                            share_title: messageData.titleText,
                            share_desc: '通过销售助手分享',
                            share_link: _share_link ,
                            share_imgurl: messageData.picUrl,
                            onsuccess: function () {
                                var messageShare = {
                                    messageId:messageId,
                                    userId:userId,
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
                                            MessageComm.share.insertShare(params, shareFlag, dataId, -1, _share_link, share_ip, userId);
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