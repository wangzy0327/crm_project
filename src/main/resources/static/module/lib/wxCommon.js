var wxCommon = wxCommon || {};
wxCommon.service = {
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    //初始化微信js接口插件，

    //需引入
    //config.js
    //jquery-2.1.4.js
    //jquery-weui.min.js
    //http://res.wx.qq.com/open/js/jweixin-1.2.0.js
    //例子：
    //wxCommon.service.initWxConfig(1,[
    //  'chooseImage',
    //  'previewImage',
    //  'uploadImage'
    //]);
    initWxConfig: function (jsApiList,readyCallback,errorCallback,wuCallback,error2Callnack) {
        var self = this;
        var targetUrl = location.href.split("#")[0];
        var aj = $.ajax({//jquery-2.1.4.js
            type: "post",
            url: YT.server + "/wx/getSign.action",//config.js
            data: {targetUrl: targetUrl},
            dataType: "json",
            cached: !1,
            success: function (msg) {
                if (msg.status == 200) {
                    wx.config({
                        beta: true,
                        debug: false,
                        appId: msg.object.appId,
                        timestamp: msg.object.timestamp,
                        nonceStr: msg.object.nonceStr,
                        signature: msg.object.signature,
                        jsApiList: jsApiList
                    });
                    wx.ready(function () {
                        readyCallback();
                        //$.toast("初始化成功！");//jquery-weui.min.js
                    });
                    wx.error(function (res) {
                        errorCallback();
                        //$.toast("初始化失败！", "cancel");//jquery-weui.min.js
                    });
                }else{
                    wuCallback();
                    //$.toast(msg.message, "cancel");//jquery-weui.min.js
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                error2Callnack();
                //$.toast("初始化失败！", "cancel");//jquery-weui.min.js
            }
        });
    }
};