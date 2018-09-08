$(function () {
    var wxopenid = $('wxopenid');
    var userid = $('userid');
    var accesscode = getUrlParam('code');
    if (userid == null && wxopenid == null) {
        if (access_code == null) {
            var fromurl = window.location.href;
            console.log(fromurl);
            var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4b8e52ee9877a5be&redirect_uri=' + encodeURIComponent(fromurl) + '&response_type=code&scope=snsapi_userinfo&agentid=AGENTID&state=1000175#wechat_redirect'
            // var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx88ddca24ac18c8b8&redirect_uri=' + encodeURIComponent(fromurl) + '&response_type=code&scope=snsapi_userinfo&state=STATE%23wechat_redirect&connect_redirect=1#wechat_redirect';
            location.href = url;
        }
        else {
            getFansInterest("/wechat-tools/Weixin/oauthInterest","code",access_code);
            access_code = "";
        }
    } else {
        getFansInterest("/wechat-tools/Weixin/accountFanInterest","openId",userid);
    }
    if (userid == null && wxopenid == null) {
        if (access_code == null) {
            var fromurl = window.location.href;
            console.log(fromurl);
            var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4b8e52ee9877a5be&redirect_uri=' + encodeURIComponent(fromurl) + '&response_type=code&scope=snsapi_userinfo&agentid=AGENTID&state=1000175#wechat_redirect'
            // var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx88ddca24ac18c8b8&redirect_uri=' + encodeURIComponent(fromurl) + '&response_type=code&scope=snsapi_userinfo&state=STATE%23wechat_redirect&connect_redirect=1#wechat_redirect';
            location.href = url;
        }
        else {
            getFansInterest("/wechat-tools/Weixin/oauthInterest","code",access_code);
            access_code = "";
        }
    } else {
        getFansInterest("/wechat-tools/Weixin/accountFanInterest","openId",wxopenid);
    }

});

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}