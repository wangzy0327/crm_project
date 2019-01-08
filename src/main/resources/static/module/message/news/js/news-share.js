$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});

var module = module || {};
module.data = {
    user_id:getUrlParam("userid"),
    message_id:getUrlParam("msgid"),
    d:getUrlParam("d"),
    s:getUrlParam("s"),
    staffData: {},
    messageData: {}
};
module.service = {
    initControls: function () {
        var self = this;
        OSTool.detectIP(function (ipData) {
            module.data.share_ip = ipData.ip;

            module.data.cid = ipData.cid;

            module.data.city = ipData.city;

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
        if (module.data.messageData) {
            var messageData = module.data.messageData;
            if ('' + messageData.msgType == '7') {
                $("#message-page-date").html(messageData.author+" "+messageData.pubTime);
                console.log("titleText:"+messageData.title);
                console.log("description:"+messageData.description);
                $("#message-page-title").html(module.service.replaceEMToI(messageData.title));
                $("#message-page-content").html(module.service.replaceEMToI(messageData.description || ""));
                $("#message-page-link").html('<a style="color:#3cc51f;" href = "'+messageData.link+'">阅读原文</a>');
            } else if ('' + messageData.msgType == '3') {
                $(".message-page").css({"margin": "0", "padding": "0"});
                var src = messageData.picurl ? messageData.picurl.replace('cover_', '') : "";
                if (src != '') {
                    var corpJson = messageData.contentAttach;
                    if (corpJson != null && corpJson !== undefined && corpJson != '' && corpJson != '{}') {
                        module.service.getStaff(function () {
                            if (!$.isEmptyObject(module.data.staffData)) {
                                var qrCodeAttach = eval('(' + module.data.staffData.qrcodeAttach + ')');
                                var imgUrl = YT.server + '/module/web/upload/' + qrCodeAttach[0].savedFileName.replace("\\", "/");
                                var corp = JSON.parse(corpJson);
                                var width = corp.w - 0;
                                var height = corp.h - 0;
                                var min = width <= height ? width : height;
                                module.service.drawImage([src, imgUrl], function (ctx, images, loaded) {
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
                                module.service.drawImage([src], function (ctx, images, loaded) {
                                    ctx.drawImage(images[0], 0, 0);
                                });
                            }
                        });
                    } else {
                        module.service.drawImage([src], function (ctx, images, loaded) {
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
            url: "/message/news?id="+module.data.message_id,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if (result.code == 0) {
                    var data = result.data;
                    module.data.messageData = data;
                    module.service.initData();
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
                    module.data.staffData = data;
                    callback();
                }else {
                    $.alert('网络异常，请与管理员联系！');
                }
            }
        });
    },
    initShare: function () {
        module.service.getData(function () {
            $.showLoading('加载中...');
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
                var articleShare = {
                    articleId:messageId,
                    userId:userId,
                    shareTime:shareTime,
                    shareFlag:0,
                    openCount:0,
                    delFlag:0
                };
                $.ajax({
                    type: "post",
                    url: "/message/share/article",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify(articleShare),
                    dataType: "json",
                    success: function (result) {
                        if (result.code == 0) {
                            var data = result.data;
                            var dataId = data.id;
                            var _share_link = messageData.url + "?userid=" + userId +"&artid="+ messageId +"&s=1&d=" + data.id ;
                            console.log("share_link: "+ _share_link);
                            console.log("picUrl: "+ messageData.picUrl);
                            params = {
                                share_title: messageData.title,
                                share_desc: '通过销售助手分享',
                                share_link: _share_link ,
                                share_imgurl: domain.server + '/images/cover-info.png',
                                onsuccess: function () {
                                    var articleShare = {
                                        id:dataId,
                                        articleId:messageId,
                                        userId:userId,
                                        customerId:customerId,
                                        openCount:0,
                                        shareTime:shareTime,
                                        shareFlag:1,
                                        delFlag:0
                                    };
                                    $.ajax({
                                        type: "post",
                                        url: "/message/share/article",
                                        data: JSON.stringify(articleShare),
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        success: function (result) {
                                            if(result.code == 0){
                                                var data = result.data;
                                                var dataId = data.id;
                                                console.log("dataId:"+dataId);
                                                MessageComm.share.insertShare(params, shareFlag,customerId, dataId, -1, _share_link, share_ip, userId);
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

module.eventHandler = {
    handleEvents: function () {
        MessageComm.customer.init();
    }
};
