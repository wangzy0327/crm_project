$(function () {
    shareManager.service.initControls();
    shareManager.eventHandler.handleEvents();
});

var shareManager = shareManager || {};
shareManager.data = {
    m: 101000000,
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
            if ('' + messageData.msgType == '1') {
                $("#message-page-date").html(new Date().Format("MM月dd日"));
                $("#message-page-title").html(shareManager.service.replaceEMToI(messageData.titleText));
                $("#message-page-content").html(shareManager.service.replaceEMToI(messageData.description || ""));
            } else if ('' + messageData.msgType == '3') {
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
        var filter = [{field: 'id', value: shareManager.service.getUrlParam('d'), operator: '=', relation: 'AND'}];
        var postData = {
            m: shareManager.data.m,
            t: 'v_message',
            filter: JSON.stringify(filter)
        };
        YT.query({
            data: postData,
            loading: 0,
            successCallback: function (data) {
                if (200 == data.status) {
                    shareManager.data.messageData = data.object[0];
                    shareManager.service.initData();
                    callback();
                } else {
                    $.alert(data.message);
                }
            }
        });
    },
    getStaff: function (callback) {
        var filter = [{field: 'id', value: shareManager.service.getUrlParam('u'), operator: '=', relation: 'AND'}];
        var data = {
            m: shareManager.data.m,
            t: 'staffs',
            filter: JSON.stringify(filter)
        };

        YT.query({
            data: data,
            loading: 0,
            successCallback: function (data) {
                if (200 == data.status) {
                    shareManager.data.staffData = data.object[0];
                    callback();
                } else {
                    /*$.alert('网络异常，请与管理员联系！');*/
                }
            }
        });
    },
    initShare: function () {
        var self = this;
        var shareFlag = self.getUrlParam("s");
        var userId = self.getUrlParam("u");
        var messageId = self.getUrlParam("d");
        var dataId = -1;
        var shareTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
        var share_ip = shareManager.data.share_ip;

        shareManager.service.getData(function () {
            $.showLoading('加载中...');
            var tkt = self.getUrlParam("tkt");
            MessageComm.share.initWxConfig(function () {
                if (tkt != null) {
                    var params = {};
                    var postData = {
                        m: shareManager.data.m,
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
                        loading: 0,
                        successCallback: function (data) {
                            if (data.status == 200) {
                                dataId = data.object;

                                var _share_link = shareManager.data.messageData.url + "?u=" + userId + "&d=" + dataId + "&s=1&t=1";

                                params = {
                                    share_title: shareManager.data.messageData.titleText,
                                    share_desc: '',
                                    share_link: _share_link + '&uid=' + YT.uuid(),
                                    share_imgurl: '',
                                    onsuccess: function () {
                                        var filter = [
                                            {field: 'id', value: dataId, operator: '=', relation: 'AND'}
                                        ];
                                        var postData = {
                                            m: shareManager.data.m,
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
                                                    $.alert(data.message);
                                                }
                                            }
                                        });
                                    }
                                };
                                if (shareManager.data.messageData.descriptionText != null
                                    && shareManager.data.messageData.descriptionText !== undefined
                                    && shareManager.data.messageData.descriptionText != '') {
                                    params.share_desc = shareManager.data.messageData.descriptionText;
                                }
                                if (shareManager.data.messageData.picurl != null
                                    && shareManager.data.messageData.picurl !== undefined
                                    && shareManager.data.messageData.picurl != '') {
                                    params.share_imgurl = shareManager.data.messageData.picurl;
                                }

                                MessageComm.share.initWxShare(params, shareFlag);

                            }
                            $.hideLoading();
                        },
                        errorCallback: function () {
                            $.hideLoading();
                        }
                    });
                }
            });

        });

    },

    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
};

shareManager.eventHandler = {
    handleEvents: function () {
        MessageComm.customer.init();
    }
};
