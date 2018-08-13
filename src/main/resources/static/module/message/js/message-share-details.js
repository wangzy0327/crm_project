var messageCommmon = {};
var shareManager = shareManager || {};
shareManager.data = {
    m:10250000
};
$(function () {
    messageCommmon.service.getUserInfo(function () {
        shareManager.service.initControls();
    });
    //shareManager.eventHandler.handleEvents();
});
messageCommmon.service = {
    getUserInfo: function (callback) {
        YT.getUserInfo(function (data) {
            messageCommmon.userInfo = data;
            callback();
        });
    }
};
shareManager.service = {
    initControls: function () {
        this.initData();
    },
    comboxHtmlStr:function (data) {
        var sharePerson = YT.getUrlParam("name");
        var htmlStr = '';
        for (var i = 0;i<data.object.length;i++){
            var strHtmlStart='<div class="weui-form-preview__hd">' +
                '<label class="weui-form-preview__label">分享人:</label>' +
                '<span class="weui-form-preview__value comm_style" style="font-size: 1em">'+sharePerson+'</span>' +
                '</div>';
            var domContentStart = '<div class="weui-form-preview__bd">';
            var domContentEnd = '</div>';
            var domItemsStart = ' <div class="weui-form-preview__item">';

            var domItemsEnd = '</div>';
            //地点
            var locationLable = '<label class="weui-form-preview__label">地点:</label>';
            var spanLocationDom = '<span class="weui-form-preview__value comm_style">'+data.object[i].city+'</span>';
            //系统平台
            var dataSystemPlateform = data.object[i].deviceName+data.object[i].deviceVersion;
            var lableDom = '<label class="weui-form-preview__label">系统平台:</label>'
            var spanDom = '<span class="weui-form-preview__value comm_style">'+dataSystemPlateform+'</span>';
            //浏览时间
            var dataViewTime = new Date(data.object[i].openTime).Format("yyyy-MM-dd hh:mm:ss");
            var viewTimeLable ='<label class="weui-form-preview__label">浏览时间:</label>'
            var viewTimeSpan = '<span class="weui-form-preview__value comm_style">'+dataViewTime+'</span>';
            //浏览时长
            var dataViewTimeStay = shareManager.service.formatSeconds(data.object[i].viewTime);
            var viewTimeStayLable = '<label class="weui-form-preview__label">浏览时长:</label>';
            var viewTimeStaySpan = '<span class="weui-form-preview__value comm_style">'+dataViewTimeStay+'</span>';

            htmlStr+= strHtmlStart +domContentStart+domItemsStart+locationLable+spanLocationDom+domItemsEnd
                +domItemsStart+lableDom+spanDom+domItemsEnd+domItemsStart+viewTimeLable+viewTimeSpan
                +domItemsEnd+domItemsStart+viewTimeStayLable+viewTimeStaySpan+domItemsEnd+domContentEnd;
        }
        $("#main-box").empty().append(htmlStr);
    },
    initData:function(){
        var filter = [
            {field: 'shareId', value: shareManager.service.getUrlParam('id'), operator: '=', relation: 'AND'},
            {field: 'staffId', value: messageCommmon.userInfo.id , operator: '=', relation: 'AND'}
            ];

        var postData = {
            m: shareManager.data.m,
            t: 'v_message_share_customer',
            filter: JSON.stringify(filter)
        };
        YT.query({
            data: postData,
            successCallback: function (data) {
                if (200 == data.status) {
                    if(data.object.length>0){
                       // console.log(data.object);
                        shareManager.service.comboxHtmlStr(data);
                    }
                } else {
                    $.alert(data.message);
                }
            }
        });
    },
   /* initShare:function(){
        var self = this;
        var shareFlag = self.getUrlParam("s");
        var userId = self.getUrlParam("u");
        var messageId = self.getUrlParam("d");
        var dataId = -1;
        var shareTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
        shareManager.service.getData(function(){
                $.showLoading('加载中...');
                var tkt = self.getUrlParam("tkt");
                wxCommon.service.initWxConfig(
                    [
                        'onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ',
                        'onMenuShareWeibo','onMenuShareQZone','showAllNonBaseMenuItem','hideAllNonBaseMenuItem'
                    ],
                    function(){
                        if(tkt != null){
                            var params = {};
                            var postData = {
                                m: shareManager.data.m,
                                t: 'message_share',
                                v: JSON.stringify([{
                                    t: 'message_share',
                                    data: {
                                        messageId:messageId,
                                        staffId:userId,
                                        shareFlag:1,
                                        shareTime:shareTime,
                                        openCount:0,
                                        delFlag:1
                                    },
                                    ai: true
                                }])
                            };
                            YT.insert({
                                data: postData,
                                successCallback: function (data) {
                                    if (data.status == 200) {
                                        dataId = data.object;
                                        params = {
                                            share_title:shareManager.data.messageData.titleText,
                                            share_desc:'',
                                            share_link:shareManager.data.messageData.url+"?u="+userId+"&d="+dataId+"&s=1&t=0",
                                            share_imgurl:'',
                                            onsuccess:function(){
                                                var filter = [
                                                    {field: 'id', value: dataId, operator: '=', relation: 'AND'}
                                                ];
                                                var postData = {
                                                    m: shareManager.data.m,
                                                    t: 'message_share',
                                                    v: JSON.stringify([{
                                                        t: 'message_share',
                                                        data: {
                                                            shareTime:shareTime,
                                                            shareFlag:1,
                                                            delFlag:0
                                                        },
                                                        filter:filter
                                                    }]),
                                                    params:JSON.stringify({isvisitor:false})
                                                };
                                                YT.update({
                                                    loading:false,
                                                    data: postData,
                                                    successCallback: function (data) {
                                                        if (data.status == 200) {
                                                            //$.toast("分享到"+str+"成功！");
                                                        } else {
                                                            $.alert(data.message);
                                                        }
                                                    }
                                                });
                                            }
                                        };
                                        if(shareManager.data.messageData.descriptionText != null
                                            && shareManager.data.messageData.descriptionText !== undefined
                                            && shareManager.data.messageData.descriptionText != ''){
                                            params.share_desc = shareManager.data.messageData.descriptionText;
                                        }
                                        if(shareManager.data.messageData.picurl != null
                                            && shareManager.data.messageData.picurl !== undefined
                                            && shareManager.data.messageData.picurl != ''){
                                            params.share_imgurl = shareManager.data.messageData.picurl;
                                        }
                                        wx.onMenuShareTimeline({
                                            title: params.share_title, // 分享标题
                                            link: params.share_link, // 分享链接
                                            imgUrl: params.share_imgurl, // 分享图标
                                            success: function () {
                                                // 用户确认分享后执行的回调函数
                                                if(params.onsuccess)
                                                    params.onsuccess('朋友圈');
                                            },
                                            cancel: function () {
                                                // 用户取消分享后执行的回调函数
                                            }
                                        });

                                        wx.onMenuShareAppMessage({
                                            title: params.share_title, // 分享标题
                                            desc: params.share_desc, // 分享描述
                                            link: params.share_link, // 分享链接
                                            imgUrl: params.share_imgurl, // 分享图标
                                            type: '', // 分享类型,music、video或link，不填默认为link
                                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                            success: function () {
                                                // 用户确认分享后执行的回调函数
                                                if(params.onsuccess)
                                                    params.onsuccess('朋友');
                                            },
                                            cancel: function () {
                                                // 用户取消分享后执行的回调函数
                                            }
                                        });

                                        wx.onMenuShareQQ({
                                            title: params.share_title, // 分享标题
                                            desc: params.share_desc, // 分享描述
                                            link: params.share_link, // 分享链接
                                            imgUrl: params.share_imgurl, // 分享图标
                                            success: function () {
                                                // 用户确认分享后执行的回调函数
                                                if(params.onsuccess)
                                                    params.onsuccess('QQ');
                                            },
                                            cancel: function () {
                                                // 用户取消分享后执行的回调函数
                                            }
                                        });

                                        wx.onMenuShareWeibo({
                                            title: params.share_title, // 分享标题
                                            desc: params.share_desc, // 分享描述
                                            link: params.share_link, // 分享链接
                                            imgUrl: params.share_imgurl, // 分享图标
                                            success: function () {
                                                // 用户确认分享后执行的回调函数
                                                if(params.onsuccess)
                                                    params.onsuccess('微博');
                                            },
                                            cancel: function () {
                                                // 用户取消分享后执行的回调函数
                                            }
                                        });

                                        wx.onMenuShareQZone({
                                            title: params.share_title, // 分享标题
                                            desc: params.share_desc, // 分享描述
                                            link: params.share_link, // 分享链接
                                            imgUrl: params.share_imgurl, // 分享图标
                                            success: function () {
                                                // 用户确认分享后执行的回调函数
                                                if(params.onsuccess)
                                                    params.onsuccess('空间');
                                            },
                                            cancel: function () {
                                                // 用户取消分享后执行的回调函数
                                            }
                                        });
                                        wx.showAllNonBaseMenuItem();
                                    }
                                    $.hideLoading();
                                },
                                errorCallback:function(){
                                    $.hideLoading();
                                }
                            });
                        }
                    },
                    function(){$.hideLoading();},
                    function(){$.hideLoading();},
                    function(){$.hideLoading();}
                );
        });

    },*/
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    formatSeconds:function (value) { //时间转化
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        // alert(theTime);
        if(theTime > 60) {
            theTime1 = parseInt(theTime/60);
            theTime = parseInt(theTime%60);
            // alert(theTime1+"-"+theTime);
            if(theTime1 > 60) {
                theTime2 = parseInt(theTime1/60);
                theTime1 = parseInt(theTime1%60);
            }
        }
        var result = ""+parseInt(theTime)+"秒";
        if(theTime1 > 0) {
            result = ""+parseInt(theTime1)+"分"+result;
        }
        if(theTime2 > 0) {
            result = ""+parseInt(theTime2)+"小时"+result;
        }
        return result;

    }
};
/*
shareManager.eventHandler = {
    handleEvents: function () {

    }
};*/
