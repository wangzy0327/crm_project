$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});
var module = module || {};
module.data = {
    user_id:getUrlParam("userid"),
    customer_id:getUrlParam("customer_id")
};
module.service = {
    initControls: function () {
        var self = this;
        self.getUserTag();
        self.initGrid();
    },
    getUserTag: function (callback) {
        var self = this;
        $.ajax({
            type: 'post',
            url: "/customer/userProfile?customerId="+module.data.customer_id,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    if(data!=null){
                        self.initProfile(data);
                    }
                    var tagCloud = new TagCould("tagCloud",{});
                    tagCloud.start();
                    // callback(data);
                }else{
                    $.alert(result.msg);
                }
            }
        });
    },
    //随机颜色值
    randomcolor:function(){
        var str=Math.ceil(Math.random()*16777215).toString(16);
        if(str.length<6){
            str="0"+str;
        }
        return str;
    },
    initProfile:function(data){
        var html = "";
        var tagClass = ['blue', 'red', 'deepPink', 'green', 'bisque', 'greenYellow','darkOrchid','orange','sienna'];
        for(var i = 0;i<data.length;i++){
            var id = data[i].tagId;
            console.log("id:"+id);
            var name = data[i].tagName;
            console.log("tagName:"+name);
            var weight = data[i].num;
            console.log("weight:"+weight);
            var index = Math.floor(Math.random() * tagClass.length);
            html+='<a href="#" class = "'+tagClass[index]+'" data-id = "'+id+'" data-weight = "'+weight+'">'+name+'</a>';
        }
        $('#tagCloud').append(html);
    },
    initGrid:function () {
        var noMore =
            '<div  id="noMore" style="margin-top: 10px;text-align: center;">' +
            '暂无推荐数据' +
            '</div> ';
        $.ajax({
            type: 'post',
            url: "/message/recommend/list?customerId="+module.data.customer_id,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if (result.code == 0) {
                    var data = result.data;
                    console.log("data.length:"+data.length);
                    if (data.length > 0) {
                        module.service.getMessageStr(data);
                    }
                    else {
                        $("#more").html(noMore);
                    }
                }
            }
        });
    },
    cutStr: function (str, length) {
        if (str != null && str !== undefined) {
            if (str.length <= length) {
                return str;
            } else {
                return str.substr(0, length) + "...";
            }
        } else {
            return "";
        }
    },
    getMessageStr :function(data){
        var html = "";
        for (var i = 0; i < data.length; i++) {
            var id = data[i].id;
            var titleData = data[i].titleText;
            var personCreate = data[i].createUserName;
            var dateCreate = new Date(GetDateDiff(data[i].updateTime)).Format("yyyy-MM-dd");
            html += '<a class="weui-cell weui-cell_access detail" data-id="' + id + '" data-type="' + data[i].msgType + '" href="javascript:;"> ' +
                '<div class="weui-cell__bd"> ' +
                '<p>' + module.service.cutStr(titleData, 8) + '(<span style="font-size: 15px;color:#666666;">' +
                personCreate + '</span>&nbsp;&nbsp;<span style="font-size: 13px;color:#666666;">' +
                dateCreate + '</span>)</p> ' +
                '</div> ' +
                '<div class="weui-cell__ft"> ' +
                '</div> ' +
                '</a>';
        }
        $('#list').append(html);
    }

};

module.eventHandler = {
    handleEvents: function () {
        this.handleDetail();
    },

    handleDetail: function () {
        $('#list').on('click', '.detail', function () {
            var dataId = $(this).data('id'), msgType = +$(this).data('type'), url = '';

            // 1文章 2资料 3图片 4没有二维码图片 5H5 6平面 7爬虫数据
            switch (msgType) {
                case 1:
                case 3:
                case 4:
                    url = '../message/message-share.html';
                    break;
                case 2:
                    url = '../message/doc/doc-share.html';
                    break;
                case 5:
                    url = '../message/h5/h5-share.html';
                    break;
                case 6:
                    url = '../message/graphic/graphic-share.html';
                    break;
            }

            module.eventHandler.getUserInfo(function (user) {
                var url1 = $.UrlUpdateParams(url,"msgid",dataId);
                var url2 = $.UrlUpdateParams(url1,"userid",user.userid);
                var url3 = $.UrlUpdateParams(url2,"s",0);
                console.log("url3: "+url3);
                location.href = url3;
                // window.location.href = url + YT.setUrlParams({
                //     d: dataId,
                //     s: 0,
                //     u: user.id
                // });
            });
        });
    },
    getUserInfo: function (callback) {
        var self = this;
        $.ajax({
            type: 'get',
            url: "/staff/self?userId="+module.data.user_id,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log("id:"+data.userid);
                    console.log("name:"+data.name);
                    callback(data);
                }else{
                    $.alert(result.msg);
                }
            }
        });
    },
}