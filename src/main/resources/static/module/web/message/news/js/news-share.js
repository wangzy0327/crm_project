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
    messageData: {},
    os: {
        engine: '',
        deviceName: '',
        deviceVersion: '',
        type: '',
        browserName: '',
        browserVersion: '',
        major: '',
        orientation: ''
    },
    ip: {
        ip: '',
        cid: '',
        city: ''
    },
    readinfo_id:-1,
    customer_id:-1,
    customer_name:'',
    openid: "-1",
    viewTime: 1,
};
module.service = {
    initControls: function () {
        oauth2openid();
        if(getUrlParam("openid")!=null){
            module.data.openid = getUrlParam("openid");
        }
        console.log("module.data.openid:"+module.data.openid);
        var self = this;
        OSTool.detectIP(function (ipData) {
            self.initCustomer();

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

    initCustomer:function () {
        $.ajax({
            type: 'post',
            async: false,
            url: "/customer/shareCustomer?shareId="+module.data.d+"&openid="+module.data.openid,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if (result.code == 0) {
                    var data = result.data;
                    if(data!=null){
                        module.data.customer_id = data.id;
                        module.data.customer_name = data.name;
                        console.log("data.customer_name:"+module.data.customer_name);
                    }
                }else {
                    $.alert('网络异常，请与管理员联系！');
                }
            }
        });
    },

    initData: function () {
        if (module.data.messageData) {
            var messageData = module.data.messageData;
            // 显示页面
            module.data.title = messageData.titleText;
            if ('' + messageData.msgType == '7') {
                $("#message-page-date").html(messageData.author+" "+messageData.pubTime);
                console.log("titleText:"+messageData.title);
                console.log("description:"+messageData.description);
                $("#message-page-title").html(module.service.replaceEMToI(messageData.title));
                $("#message-page-content").html(module.service.replaceEMToI(messageData.description || ""));
                $("#message-page-link").html('<a href = "'+messageData.link+'">阅读原文</a>');
            } else if ('' + messageData.msgtype == '3') {
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
    initShare: function () {

        var self = this,
            shareFlag = getUrlParam("s"),
            customerId = module.data.customer_id;
        openId = module.data.openid;
        console.log("initShare openid:"+openId);

        module.service.getData(function () {
            if (shareFlag != null && shareFlag !== undefined
                && ('' + module.data.s == '1') && ('' + openId != '-1')
            // && (('' + shareFlag == '1') && customerId!=-1)
            ) {
                // 客户点击插入浏览记录
                self.customerUpdate(shareFlag);
            } else {
                // 销售人员点击初始化监听接口
                self.initWxConfig(shareFlag);
            }
        });

    },

    initWxConfig: function (shareFlag) {
        var self = this,
            userId = module.data.user_id,
            messageId = parseInt(module.data.message_id),
            messageTitle = module.data.title,
            shareFlag = module.data.s,
            shareTime = new Date().Format('yyyy-MM-dd hh:mm:ss'),
            messageData = module.data.messageData,
            customerId = module.data.customer_id,
            customerName = module.data.customer_name,
            openid = module.data.openid,
            shareId = module.data.d,
            share_ip = module.data.share_ip;

        MessageComm.share._initWxConfig(shareFlag,function () {
            var _share_link = messageData.url + "?userid=" + userId +"&msgid="+ messageId +"&s=2" ;
            console.log("share_link: "+ _share_link);
            var params = {
                share_title: module.data.messageData.title,
                share_desc: '通过销售助手分享',
                share_link:  _share_link ,
                share_imgurl: domain.server + '/images/cover-info.png',
                onsuccess: function () {
                    var messageShareTransmit = {
                        shareId:shareId,
                        userId:userId,
                        customerId:customerId,
                        customerName:customerName,
                        messageId:messageId,
                        messageTitle:messageTitle
                    };
                    // $.ajax({
                    //     type: "post",
                    //     url: "/message/customer/transmit",
                    //     data: JSON.stringify(messageShareTransmit),
                    //     contentType: "application/json; charset=utf-8",
                    //     dataType: "json",
                    //     success: function (result) {
                    //         if(result.code == 0){
                    //             var data = result.data;
                    //             if(data!=null){
                    //                 var dataId = data.id;
                    //                 console.log("dataId:"+dataId);
                    //             }
                    //         }
                    //     },
                    //     error:function (XMLHttpRequest, textStatus, errorThrown) {
                    //
                    //     }
                    // });
                }
            };
            MessageComm.share.initWxShare(params, shareFlag);
        });
    },

    shareUpdate: function (params, shareFlag, dataId, _share_link, share_ip, userId) {
        var filter = [
            {field: 'id', value: module.data.messageData.id, operator: '=', relation: 'AND'}
        ];
        var shareTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
        var postData = {
            m: module.data.m,
            t: 'message_share',
            v: JSON.stringify([{
                t: 'message_share',
                data: {
                    shareTime: shareTime,
                    shareFlag: 1
                },
                filter: filter
            }]),
            params: JSON.stringify({
                isvisitor: false
            })
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
    },
    customerUpdate: function (shareFlag) {

        var messageData = module.data.messageData;

        // 初始化阅读时间
        var pageInfo = [];
        for (var i = 0; i < messageData.pagecount; i++) {
            if (i == 0) {
                pageInfo.push(1);
            } else {
                pageInfo.push(0);
            }
        }

        var readInfo = {
            shareId:module.data.d,
            userId:module.data.user_id,
            customerId:module.data.customer_id,
            customerName:module.data.customer_name,
            openId:module.data.openid,
            ip:module.data.share_ip,
            cid:module.data.cid,
            city:module.data.city,
            pageCount:messageData.pagecount,
            messageId:module.data.message_id,
            messageTitle:module.data.title,
            totalTime:1,
            readInfo:JSON.stringify(pageInfo)
        };

        console.log("module.data.customer_name:"+module.data.customer_name);
        // $.ajax({
        //     type: "post",
        //     url: "/customer/readinfo",
        //     data: JSON.stringify(readInfo),
        //     contentType: "application/json; charset=utf-8",
        //     dataType: "json",
        //     success: function (result) {
        //         if(result.code == 0){
        //             var data = result.data;
        //             if(data!=null){
        //                 var dataId = data.id;
        //                 console.log("dataId:"+dataId);
        //                 module.data.readinfo_id = dataId;
        //                 module.service.setShareInterval();
        //             }
        //         }else{
        //             var msg = result.msg;
        //             console.log(msg);
        //         }
        //         module.service.initWxConfig(shareFlag);
        //     },
        //     error:function (XMLHttpRequest, textStatus, errorThrown) {
        //         // 状态码
        //         console.log(XMLHttpRequest.status);
        //         // 状态
        //         console.log(XMLHttpRequest.readyState);
        //         // 错误信息
        //         console.log(textStatus);
        //         // alert(textStatus);
        //     }
        // });
    },
    setShareInterval: function () {
        console.log("module.data.openid:"+module.data.openid);
        var messageData = module.data.messageData;
        var pageInfo = [];
        var timer = window.setInterval(function () {
            module.data.viewTime += 5;
            pageInfo[0] = module.data.viewTime;
            var data = {
                id:module.data.readinfo_id,
                shareId:module.data.d,
                userId:module.data.user_id,
                customerId:module.data.customer_id,
                customerName:module.data.customer_name,
                openId:module.data.openid,
                messageId:module.data.message_id,
                messageTitle:module.data.title,
                viewTime:parseInt(module.data.viewTime/(messageData.pagecount)),
                totalTime:module.data.viewTime,
                readInfo:JSON.stringify(pageInfo)
            };
            console.log("shareId:"+module.data.d);
            console.log("messageId:"+module.data.message_id);
            console.log("messageTitle:"+module.data.title);
            console.log("customerName:"+module.data.customer_name);
            console.log("viewTime:"+parseInt(module.data.viewTime/(messageData.pagecount)));
            console.log("totalTime:"+module.data.viewTime);
            console.log("readInfo:"+window.pageInfo);

            // $.ajax({
            //     type: "post",
            //     url: "/customer/readinfo",
            //     data: JSON.stringify(data),
            //     contentType: "application/json; charset=utf-8",
            //     dataType: "json",
            //     success: function (result) {
            //         if(result.code == 0){
            //             var data = result.data;
            //             var dataId = data.id;
            //         }
            //     },
            //     error:function (XMLHttpRequest, textStatus, errorThrown) {
            //         // 状态码
            //         console.log(XMLHttpRequest.status);
            //         // 状态
            //         console.log(XMLHttpRequest.readyState);
            //         // 错误信息
            //         console.log(textStatus);
            //         // alert(textStatus);
            //     }
            // });
        }, 5000);
    }
};

module.eventHandler = {
    handleEvents: function () {
        MessageComm.customer.init('', 1);
    }
};
