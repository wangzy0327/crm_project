function oauth2() {
    userid = getUrlParam("userid");
    console.log("userid:"+userid);
    if(userid == null || userid == undefined){
        userid  = $.cookie('userId');
    }
    if(userid == undefined || userid == null){
        var returnUrl = window.location.href;
        console.log("returnUrl:"+returnUrl);
        // var url = "http://wangzy.tunnel.qydev.com/wechat/authorize?returnUrl="+returnUrl;
        console.log("domain url: "+domain.server);
        var url = domain.server+"wechat/oauth/authorize?returnUrl="+encodeURIComponent(returnUrl);
        location.href = url;
    }
    if(userid!=null && getUrlParam("userid") == null){
        var curUrl = window.location.href;
        var url = curUrl+"?userid="+openid;
        location.href = url;
    }
}
