$(function () {
    module.service.initControls();
    // module.eventHandler.handleEvents();
});
var module = module || {};
module.data = {
    user_id:getUrlParam("userid"),
    customer_id:getUrlParam("customer_id")
};
module.service = {
    initControls: function () {
        var self = this;
        self.getUserTag(function (user) {
            module.service.initGrid();
        });
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
                    callback(data);
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
        
    }
}