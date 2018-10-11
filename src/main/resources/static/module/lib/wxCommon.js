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
        console.log("targetUrl:"+targetUrl);
        // alert(location.href.split("#")[0]);
        var aj = $.ajax({//jquery-2.1.4.js
            type: "post",
            url: "/wechat/jssdk/config?url="+encodeURIComponent(targetUrl),//config.js
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cached: !1,
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log("appId:"+data.appId);
                    console.log("timestamp:"+data.timestamp);
                    console.log("nonceStr:"+data.nonceStr);
                    console.log("signature:"+data.signature);
                    wx.config({
                        beta: true,
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
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
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                error2Callnack();
                //$.toast("初始化失败！", "cancel");//jquery-weui.min.js
            }
        });
    }
};