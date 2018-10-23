//获取实例对象
var api = frameElement.api;
//获取传递的参数值
var apiData = api.data;
//获取传递的参数的函数
var callback = apiData.callback;

$(function () {
    viewManager.service.initControls();
    viewManager.eventHandler.handleEvents();
});

var viewManager = viewManager || {};
viewManager.data = {};
viewManager.service = {
    initControls: function () {
        this.initButtons();
        this.initEditData();
    },
    initEditData:function(){
        if(apiData.data){
            var messageData = apiData.data;


            $("#message-date").html(new Date().Format("MM月dd日"));
            if(messageData.titleText.length > 34){
                $("#message-title").text(messageData.titleText.substr(0,34));
            }else{
                $("#message-title").text(messageData.titleText);
            }
            if(messageData.descriptionText != null && messageData.descriptionText !== undefined && messageData.descriptionText.length > 128){
                $("#message-content").html(messageData.descriptionText.substr(0,128));
            }else{
                $("#message-content").html(messageData.descriptionText || "");
            }
            if(messageData.picurl){
                $("#message-pic").attr("src",messageData.picurl);
            }



            if(''+messageData.msgType == '1'){
                $("#message-page-date").html(new Date().Format("MM月dd日"));
                $("#message-page-title").html(messageData.title);
                $("#message-page-content").html(messageData.description || "");
            }else if(''+messageData.msgType == '3'){
                $(".message-page").css({"margin":"0","padding":"0"});
                var src = messageData.picurl? messageData.picurl.replace('cover_',''):"";
                var $img = $('<img width="246" src="'+src+'" style="max-width: 100%;"/>');
                $("#message-page-content").append($img);
            }

            /*if(messageData.picurl){
                $("#message-page-pic").attr("src",messageData.picurl);
            }
            var contentImages = eval('(' + messageData.contentAttach + ')');
            $("#message-page-images").empty();*/
            /*if (contentImages.length) {
                for (var i=0;i<contentImages.length;i++) {
                    var obj = contentImages[i];
                    var savedFileName = obj.savedFileName;
                    var uploadSimpleName = obj.uploadSimpleName;
                    var url = YT.server +'/download.action?rnd=' + Math.random() + '&tkt=' + YT.getTicket() + '&fileName=' + savedFileName + '&originalName=' + uploadSimpleName;
                    $("#message-page-images").append("<img src='"+url+"' />");
                }
            }*/
        }
    },

    initButtons: function () {
        api.setButtons([
            {
                className: 'btn-gray',
                name: '关闭'
            }
        ])
    }

};

viewManager.eventHandler = {
    handleEvents: function () {

    }
};
