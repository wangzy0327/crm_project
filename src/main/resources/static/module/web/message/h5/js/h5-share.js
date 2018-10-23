var module = {};

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
    title: '' // 页面标题
};

module.service = {
    initControls: function () {
        oauth2openid();
        if(getUrlParam("openid")!=null){
            module.data.openid = getUrlParam("openid");
        }
        console.log("module.data.openid:"+module.data.openid);
        this.initData();
    },

    initData: function () {
        var self = this, module_d = module.data;
        $.showLoading('加载中...');
        module.service.getMessageData(function (data) {
            OSTool.detectIP(function (ipData) {
                self.initCustomer();
                module_d.share_ip = ipData.ip;

                module_d.cid = ipData.cid;

                module_d.city = ipData.city;

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
                self.initShare();
            });
        });
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
    },

    initShare: function () {
        var self = this,
            shareFlag = getUrlParam("s"),
            customerId = module.data.customer_id;
            openId = module.data.openid;
            console.log("initShare openid:"+openId);
        // if (times != null) {
        //     times = parseInt(times);
        // } else {
        //     times = 0;
        // }
        // ++times;

        if (shareFlag != null && shareFlag !== undefined
            &&('' + module.data.s == '1') && (''+openId != '-1')
            // && (('' + shareFlag == '1') && customerId!=-1)
        ) {
            // 客户点击插入浏览记录
            // if('' + module.data.s == 1)
            self.customerUpdate(shareFlag);
        } else {
            // 销售人员点击初始化监听接口
            self.initWxConfig(shareFlag);
        }

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
        console.log("shareId:"+shareId);
        console.log("customerId:"+customerId);
        console.log("userId:"+userId);
        console.log("messageId:"+messageId);

        MessageComm.share._initWxConfig(shareFlag, function () {
            var _share_link = messageData.url + "?userid=" + userId +"&msgid="+ messageId +"&s=2" ;
            console.log("share_link: "+ _share_link);
            var params = {
                share_title: messageData.titleText,
                share_desc: '通过' + '销售助手' + '分享',
                share_link: _share_link ,
                // share_imgurl: domain.server + '/images/cover-h5.png',
                share_imgurl: domain.server + '/images/cover-h5.png',
                onsuccess: function () {
                    var messageShareTransmit = {
                        shareId:shareId,
                        userId:userId,
                        customerId:customerId,
                        customerName:customerName,
                        messageId:messageId,
                        messageTitle:messageTitle
                    };
                    $.ajax({
                        type: "post",
                        url: "/message/customer/transmit",
                        data: JSON.stringify(messageShareTransmit),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (result) {
                            if(result.code == 0){
                                var data = result.data;
                                if(data!=null){
                                    var dataId = data.id;
                                    console.log("dataId:"+dataId);
                                }
                            }
                        },
                        error:function (XMLHttpRequest, textStatus, errorThrown) {

                        }
                    });
                }
            };
            MessageComm.share.initWxShare(params, shareFlag);
        });
    },

    customerUpdate: function (shareFlag) {
        var messageData = module.data.messageData;
        //     openCount = ++messageData.openCount,
        //     filter = [
        //         {field: 'id', value: messageData.id, operator: '=', relation: 'AND'}
        //     ];
        //
        // var v = {
        //     t: 'message_share',
        //     data: {
        //         openCount: openCount
        //     },
        //     filter: filter
        // };

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
            readInfo:JSON.stringify(pageInfo)
        };

        console.log("module.data.customer_name:"+module.data.customer_name);
        $.ajax({
            type: "post",
            url: "/customer/readinfo",
            data: JSON.stringify(readInfo),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    if(data!=null){
                        var dataId = data.id;
                        console.log("dataId:"+dataId);
                        module.data.readinfo_id = dataId;
                        module.service.setShareInterval();
                    }
                }else{
                    var msg = result.msg;
                    console.log(msg);
                }
                module.service.initWxConfig(shareFlag);
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                // 状态码
                console.log(XMLHttpRequest.status);
                // 状态
                console.log(XMLHttpRequest.readyState);
                // 错误信息
                console.log(textStatus);
                // alert(textStatus);
            }
        });

    },

    setShareInterval: function () {
        console.log("module.data.openid:"+module.data.openid);
        var messageData = module.data.messageData;
        // if (module.data.openid != -1) {
            var timer = window.setInterval(function () {
                module.data.viewTime += 5;

                // 停留当前页阅读时间计算
                var endTime = new Date().getTime();
                var second = Math.round((endTime - frames["page-view"].startTime) / 1000); // 秒
                // 时长少于1秒也算1秒
                second = second <= 0 ? 1 : second;
                var pageInfo = frames["page-view"].pageInfo,
                    activeIndex = frames["page-view"].activeIndex;

                console.log("activeIndex: "+activeIndex);
                if (pageInfo[activeIndex]) {
                    frames["page-view"].pageInfo[activeIndex] = pageInfo[activeIndex] + second;
                } else {
                    frames["page-view"].pageInfo[activeIndex] = second;
                }
                frames["page-view"].startTime = new Date().getTime();
                var text = "页面 " + (activeIndex+1) + " 的浏览时间为：" + frames["page-view"].pageInfo[activeIndex] + "秒<br>";
                console.log(text);
                // var v = {
                //     t: 'message_share_customer',
                //     data: {
                //         viewTime: module.data.viewTime,
                //         readInfo: JSON.stringify(frames["page-view"].pageInfo)
                //     },
                //     filter: filter
                // };

                var data = {
                    id:module.data.readinfo_id,
                    shareId:module.data.d,
                    userId:module.data.user_id,
                    customerId:module.data.customer_id,
                    customerName:module.data.customer_name,
                    openId:module.data.openid,
                    messageId:module.data.message_id,
                    messageTitle:module.data.title,
                    viewTime:parseInt(module.data.viewTime/(messageData.pagecount)+1),
                    totalTime:module.data.viewTime,
                    readInfo:JSON.stringify(frames["page-view"].pageInfo)
                };
                console.log("shareId:"+module.data.d);
                console.log("messageId:"+module.data.message_id);
                console.log("messageTitle:"+module.data.title);
                console.log("customerName:"+module.data.customer_name);
                console.log("viewTime:"+parseInt(module.data.viewTime/(messageData.pagecount)+1));
                console.log("totalTime:"+module.data.viewTime);
                console.log("readInfo:"+frames["page-view"].pageInfo);

                $.ajax({
                    type: "post",
                    url: "/customer/readinfo",
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        if(result.code == 0){
                            var data = result.data;
                            var dataId = data.id;
                        }
                    },
                    error:function (XMLHttpRequest, textStatus, errorThrown) {
                        // 状态码
                        console.log(XMLHttpRequest.status);
                        // 状态
                        console.log(XMLHttpRequest.readyState);
                        // 错误信息
                        console.log(textStatus);
                        // alert(textStatus);
                    }
                });

                // var data = {
                //     m: module.data.m,
                //     t: 'message_share_customer',
                //     v: JSON.stringify([v]),
                //     isvisitor: 1
                // };
                //
                // YT.update({
                //     loading: false,
                //     data: data,
                //     successCallback: function (data) {
                //
                //     }
                // });
            }, 3000);
        // }
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
        MessageComm.customer.init('', 1);
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