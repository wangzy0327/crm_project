$(function () {
    shareManager.service.initControls();
    shareManager.eventHandler.handleEvents();
});

var shareManager = shareManager || {};
shareManager.data = {
    user_id:getUrlParam("userid"),
    message_id:getUrlParam("msgid"),
    staffData: {},
    messageData: {}
};
shareManager.service = {
    initControls: function () {
        var self = this;
        OSTool.detectIP(function (ipData) {
            shareManager.data.share_ip = ipData.ip;
            self.initShare();
        });
    },
    replaceEMToI: function (str) {
        var reg1 = new RegExp("<em>", "g");
        var reg2 = new RegExp("</em>", "g");
        var reg3 = new RegExp("<strong>", "g");
        var reg4 = new RegExp("</strong>", "g");
        str = str.replace(reg1, "<i>");
        str = str.replace(reg2, "</i>");
        str = str.replace(reg3, "<b>");
        str = str.replace(reg4, "</b>");
        return str;
    },
    initData: function () {
        if (shareManager.data.messageData) {
            var messageData = shareManager.data.messageData;
            if ('' + messageData.msgtype == '1') {
                $("#message-page-date").html(new Date().Format("MM月dd日"));
                console.log("titleText:"+messageData.titleText);
                console.log("description:"+messageData.description);
                $("#message-page-title").html(shareManager.service.replaceEMToI(messageData.titleText));
                $("#message-page-content").html(shareManager.service.replaceEMToI(messageData.description || ""));
            } else if ('' + messageData.msgtype == '3') {
                $(".message-page").css({"margin": "0", "padding": "0"});
                var src = messageData.picurl ? messageData.picurl.replace('cover_', '') : "";
                if (src != '') {
                    var corpJson = messageData.contentAttach;
                    if (corpJson != null && corpJson !== undefined && corpJson != '' && corpJson != '{}') {
                        shareManager.service.getStaff(function () {
                            if (!$.isEmptyObject(shareManager.data.staffData)) {
                                var qrCodeAttach = eval('(' + shareManager.data.staffData.qrcodeAttach + ')');
                                var imgUrl = YT.server + '/module/web/upload/' + qrCodeAttach[0].savedFileName.replace("\\", "/");
                                var corp = JSON.parse(corpJson);
                                var width = corp.w - 0;
                                var height = corp.h - 0;
                                var min = width <= height ? width : height;
                                shareManager.service.drawImage([src, imgUrl], function (ctx, images, loaded) {
                                    ctx.drawImage(images[0], 0, 0);
                                    var twoWidth = images[1].width - 0;
                                    var twoHeight = images[1].height - 0;
                                    if (twoHeight == twoWidth) {
                                        ctx.drawImage(images[1], (corp.x - 0), (corp.y - 0), min, min);
                                    } else {
                                        //计算当前与实际的纵横比
                                        var scaleX = min / twoWidth;
                                        var scaleY = min / twoHeight;
                                        var scaleMin = parseInt(scaleX <= scaleY ? scaleX : scaleY);
                                        ctx.drawImage(images[1], (corp.x - 0), (corp.y - 0), scaleMin * twoWidth, scaleMin * twoHeight);
                                    }
                                });
                            } else {
                                shareManager.service.drawImage([src], function (ctx, images, loaded) {
                                    ctx.drawImage(images[0], 0, 0);
                                });
                            }
                        });
                    } else {
                        shareManager.service.drawImage([src], function (ctx, images, loaded) {
                            ctx.drawImage(images[0], 0, 0);
                        });
                    }
                }
            }
        }
    },
    drawImage: function (urlArr, callback) {
        new ImagePreloader(urlArr, function (images, loaded) {
            var canvas = document.createElement("canvas");
            canvas.width = images[0].width;
            canvas.height = images[0].height;
            var ctx = canvas.getContext("2d");
            callback(ctx, images, loaded);
            var $content = $("#message-page-content");
            var $img = $('<img src="' + canvas.toDataURL("image/jpg") + '" style="width: ' + $content.width() + 'px;max-width: 100%;"/>');
            $('.message-page-div').css("margin-top", "0");
            $('.phone').css("margin-bottom", "0");
            $content.html($img);
        });
    },
    getData: function (callback) {
        $.ajax({
            type: 'post',
            url: "/message/richText?id="+shareManager.data.message_id,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if (result.code == 0) {
                    var data = result.data;
                    shareManager.data.messageData = data;
                    shareManager.service.initData();
                    callback(data);
                }else {
                    $.alert('网络异常，请与管理员联系！');
                }
            }
        });
    },
    getStaff: function (callback) {
        $.ajax({
            type: 'post',
            url: "/message/self?userId="+module.data.user_id,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if (result.code == 0) {
                    var data = result.data;
                    shareManager.data.staffData = data;
                    callback();
                }else {
                    $.alert('网络异常，请与管理员联系！');
                }
            }
        });
    },
    initShare: function (shareFlag,times) {
        shareManager.service.getData(function () {
            $.showLoading('加载中...');
            var self = this,
                userId = shareManager.data.user_id,
                messageId = parseInt(shareManager.data.message_id),
                shareTime = new Date().Format('yyyy-MM-dd hh:mm:ss'),
                messageData = shareManager.data.messageData,
                share_ip = shareManager.data.share_ip;
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
        });
    },

};

shareManager.eventHandler = {
    handleEvents: function () {
        // MessageComm.customer.init();
    }
};
