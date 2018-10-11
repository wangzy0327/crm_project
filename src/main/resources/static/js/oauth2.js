function oauth2() {
    userid = getUrlParam("userid");
    console.log("userid:"+userid);
    var openid = getUrlParam("openid");
    console.log("openid:"+openid);
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
    if(userid!=null){
        $.cookie('userId',userid,{expires:1/48});
        return userid;
    }
}
