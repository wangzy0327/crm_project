$(function () {
    var userId = getUrlParam('userId');
    console.log("userId:"+userId);
    if(userId == undefined  || userId == null){
        window.location.href = "/web/web_login.html";
    }else{
        $.ajax({
            type: 'post',
            url: "/wechat/userInfo?userId="+userId,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (result) {
                var data = result.data;
                if (data != null) {
                    console.log("id:"+data.id);
                    $.cookie('staffId',data.id,{expires:1/48});
                    console.log("userId:"+data.userid);
                    $.cookie('userId',data.userid,{expires:1/48});
                    console.log("name:"+data.name);
                    $('.font-bold').text(data.name);
                    if(data.isleader == 0){
                        $('.is-leader').text("普通成员");
                        $('.admin').each(function () {
                            $(this).hide();
                        })
                    }else if(data.isleader == 1){
                        $('.is-leader').text("管理员");
                    }
                    $('.img-circle').attr('src',data.avatar);
                }else{
                    window.location.href = "/web/web_login.html";
                }
            },
            error:function (result) {
                console.log(result);
            }
        });
    }
});

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}