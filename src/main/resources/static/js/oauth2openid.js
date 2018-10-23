function oauth2openid() {
    var openid = getUrlParam("openid");
    console.log("openid:"+openid);
    if(openid == null || openid == undefined){
        openid  = $.cookie('openid');
    }
    if(openid == undefined || openid == null){
        var returnUrl = window.location.href;
        console.log("returnUrl:"+returnUrl);
        // var url = "http://wangzy.tunnel.qydev.com/wechat/authorize?returnUrl="+returnUrl;
        console.log("domain url: "+domain.server);
        var url = domain.server+"wechat/oauth/authorize/openid?returnUrl="+encodeURIComponent(returnUrl);
        location.href = url;
    }
    if(openid!=null && getUrlParam("openid") == null){
        var curUrl = window.location.href;
        var url = curUrl+"&openid="+openid;
        location.href = url;
    }
}