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
        var self = this;
        $.showLoading('加载中...');
        module.service.getMessageData(function (data) {
            $.extend(module.data.os, OSTool.detectOS(navigator.userAgent.toLowerCase()));
            OSTool.detectIP(function (ipData) {
                $.extend(module.data.ip, ipData);
                self.initCustomer();
                module.data.share_ip = ipData.ip;

                module.data.cid = ipData.cid;

                module.data.city = ipData.city;


                module.data.messageData = data;

                // 显示页面
                module.data.title = data.title;
                $('#page-view').css({'width': '100%', 'height': '100%'});
                PageSwiperComm.init('#page-view', data, 1);
                // todo 以下代码几乎与H5一致
                $.hideLoading();
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

    initShare: function () {
        var self = this,
            shareFlag = getUrlParam("s"),
            customerId = module.data.customer_id;
        openId = module.data.openid;
        console.log("initShare openid:"+openId);

        if (shareFlag != null && shareFlag !== undefined
            &&('' + module.data.s == '1') && (''+openId != '-1')
        // && (('' + shareFlag == '1') && customerId!=-1)
        ) {
            // 客户点击插入浏览记录
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

        MessageComm.share._initWxConfig(shareFlag, function () {
            var _share_link = messageData.url + "?userid=" + userId +"&msgid="+ messageId +"&s=2" ;
            console.log("share_link: "+ _share_link);
            var params = {
                share_title: messageData.titleText,
                share_desc: '通过' + '销售助手' + '分享',
                share_link: _share_link ,
                share_imgurl: domain.server + '/images/cover-pdf.png',
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

        var timer = window.setInterval(function () {
            module.data.viewTime += 5;

            // 停留当前页阅读时间计算
            var endTime = new Date().getTime();
            var second = Math.round((endTime - window.startTime) / 1000); // 秒
            // 时长少于1秒也算1秒
            second = second <= 0 ? 1 : second;
            var pageInfo = window.pageInfo,
                activeIndex = window.activeIndex;

            if (pageInfo[activeIndex]) {
                window.pageInfo[activeIndex] = pageInfo[activeIndex] + second;
            } else {
                window.pageInfo[activeIndex] = second;
            }
            window.startTime = new Date().getTime();

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
                readInfo:JSON.stringify(window.pageInfo)
            };
            console.log("shareId:"+module.data.d);
            console.log("messageId:"+module.data.message_id);
            console.log("messageTitle:"+module.data.title);
            console.log("customerName:"+module.data.customer_name);
            console.log("viewTime:"+parseInt(module.data.viewTime/(messageData.pagecount)));
            console.log("totalTime:"+module.data.viewTime);
            console.log("readInfo:"+window.pageInfo);

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
        }, 3000);
    }
};

module.eventHandler = {
    handleEvents: function () {
        MessageComm.customer.init('', 1);
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});
