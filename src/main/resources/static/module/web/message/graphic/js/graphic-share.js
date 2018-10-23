var module = {};

module.data = {
    m: 101010000,
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
    openid: -1,
    viewTime: 1,
    title: '' // 页面标题
};

module.service = {
    initControls: function () {
        this.initData();
    },

    initData: function () {
        var self = this;
        $.showLoading('加载中...');
        module.service.getMessageData(function (data) {
            $.extend(module.data.os, OSTool.detectOS(navigator.userAgent.toLowerCase()));
            OSTool.detectIP(function (ipData) {
                $.extend(module.data.ip, ipData);

                module.data.share_ip = ipData.ip;

                module.data.messageData = data;

                // 显示页面
                module.data.title = data.title;
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
            t: 'v_message_share',
            filter: JSON.stringify(filter),
            isvisitor: 1
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    callback(data.object[0]);
                } else if (501 == data.status) {
                    // 页面链接跳转历史URL不记录
                    history.replaceState(null, document.title, data.object + '#');
                    window.location.replace('');
                } else {
                    $.alert('网络异常，请与管理员联系！');
                }
            }
        });
    },

    initShare: function () {
        var self = this,
            shareFlag = YT.getUrlParam("s"),
            times = YT.getUrlParam("t");

        if (times != null) {
            times = parseInt(times);
        } else {
            times = 0;
        }
        ++times;

        if (shareFlag != null && shareFlag !== undefined &&
            (('' + shareFlag == '1') || ('' + shareFlag == '0' && times > 1))) {
            // 客户点击插入浏览记录
            self.customerUpdate(shareFlag, times);
        } else {
            // 销售人员点击初始化监听接口
            self.initWxConfig(shareFlag, times);
        }

    },

    initWxConfig: function (shareFlag, times) {
        var tkt = YT.getUrlParam('tkt'),
            userId = YT.getUrlParam("u"),
            dataId = YT.getUrlParam("d"),
            messageData = module.data.messageData,
            openid = module.data.openid,
            share_ip = module.data.share_ip;

        MessageComm.share._initWxConfig(shareFlag, times, function () {
            var _share_link = messageData.url + "?u=" + userId + "&d=" + dataId + "&s=1&t=" + times + '&o=' + openid;

            var params = {
                share_title: messageData.titleText,
                share_desc: '通过' + messageData.corp_name + '分享',
                share_link: _share_link + '&uid=' + YT.uuid(),
                share_imgurl: YT.server + '/module/web/upload/' + messageData.picurl,
                onsuccess: function () {
                    if (tkt != null && times == 1 && shareFlag == 0) {
                        module.service.shareUpdate(params, shareFlag, dataId, _share_link, share_ip, userId);
                    } else if (times > 1 && shareFlag == 1 && openid != -1) {
                        var filter = [
                            {field: 'id', value: openid, operator: '=', relation: 'AND'}
                        ];

                        var postData = {
                            m: '101020000',
                            t: 'message_share_customer',
                            v: JSON.stringify([{
                                t: 'message_share_customer',
                                data: {
                                    timesFlag: 1
                                },
                                filter: filter
                            }]),
                            isvisitor: 1,
                            params: JSON.stringify({'openid': messageData.id})
                        };

                        YT.update({
                            loading: false,
                            data: postData,
                            successCallback: function (data) {
                                MessageComm.share.insertShare(params, shareFlag, dataId, openid, _share_link, share_ip, userId);
                            }
                        });
                    }
                }
            };

            MessageComm.share.initWxShare(params, shareFlag);

            $.hideLoading();
        });
    },

    shareUpdate: function (params, shareFlag, dataId, _share_link, share_ip, userId) {
        var filter = [
            {field: 'id', value: module.data.messageData.id, operator: '=', relation: 'AND'}
        ];

        var v = {
            t: 'message_share',
            data: {
                shareTime: new Date().Format('yyyy-MM-dd hh:mm:ss'),
                shareFlag: 1
            },
            filter: filter
        };

        var data = {
            m: module.data.m,
            t: 'message_share',
            v: JSON.stringify([v]),
            params: JSON.stringify({isvisitor: false})
        };

        YT.update({
            loading: false,
            data: data,
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

    customerUpdate: function (shareFlag, times) {
        var messageData = module.data.messageData,
            openCount = ++messageData.openCount,
            filter = [
                {field: 'id', value: messageData.id, operator: '=', relation: 'AND'}
            ];

        var v = {
            t: 'message_share',
            data: {
                openCount: openCount
            },
            filter: filter
        };

        // 初始化阅读时间
        var pageInfo = [];
        for (var i = 0; i < messageData.pageCount; i++) {
            if (i == 0) {
                pageInfo.push(1);
            } else {
                pageInfo.push(0);
            }
        }

        var data = {
            m: module.data.m,
            t: 'message_share',
            v: JSON.stringify([v]),
            params: JSON.stringify({
                isvisitor: true,
                os: module.data.os,
                ip: module.data.ip,
                times: times,
                timesId: YT.getUrlParam("o"),
                readInfo: JSON.stringify(pageInfo),
                uid: YT.getUrlParam("uid")
            }),
            isvisitor: 1
        };

        YT.update({
            loading: false,
            data: data,
            successCallback: function (data) {
                module.data.openid = data.object.openid[0];
                module.service.setShareInterval();
                module.service.initWxConfig(shareFlag, times);
            },
            errorCallback: function () {
                $.hideLoading();
            }
        });
    },

    setShareInterval: function () {
        if (module.data.openid != -1) {
            var timer = window.setInterval(function () {
                module.data.viewTime += 5;

                var filter = [
                    {field: 'id', value: module.data.openid, operator: '=', relation: 'AND'}
                ];

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

                var v = {
                    t: 'message_share_customer',
                    data: {
                        viewTime: module.data.viewTime,
                        readInfo: JSON.stringify(window.pageInfo)
                    },
                    filter: filter
                };

                var data = {
                    m: module.data.m,
                    t: 'message_share_customer',
                    v: JSON.stringify([v]),
                    isvisitor: 1
                };

                YT.update({
                    loading: false,
                    data: data,
                    successCallback: function (data) {

                    }
                });
            }, 3000);
        }
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