$(function () {
    loadGraphic();
    // saveGraphic();
})

function saveGraphic() {
    $('#save').click(function () {
        var title = ($("input[name='title']"))[0].value;
        console.log("title:"+title);
        var h5Url = ($("input[name = 'url']"))[0].value;
        console.log("url:"+h5Url);
        var iframeSrc = $('iframe').attr('src');
        if(title == undefined || title == null || title == ''){
            Ewin.confirm({ message: "标题不能为空" });
            return ;
        }
        if(iframeSrc == undefined || iframeSrc == null || iframeSrc == ''){
            Ewin.confirm({message: "H5内容不能为空"});
            return ;
        }
        var tags = new Array();
        var spanTags = $(".tag").children("span");
        for(i = 0;i<spanTags.length;i++){
            console.log($.trim($(spanTags[i]).text().substring(0,10)));
            tags.push($.trim($(spanTags[i]).text().substring(0,10)));
        }
        console.log("tags:"+tags);
        $.ajax({
            url:"/message/h5/add?url="+iframeSrc+"&tags="+tags,
            type:"POST",
            dataType: 'json',
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "corpId":"wx4b8e52ee9877a5be",
                "suiteId":"wx9b2b1532fd370525",
                "corpid":"wx4b8e52ee9877a5be",
                "msgtype":"5",
                "titleText":title,
                "title":title
            }),
            success:function (result) {
                console.log(result);
                if(result.code == 0){
                    var data = result.data;
                    console.log("data:"+data);
                    console.log("id:"+data.id);
                    $("input[name = 'id']").val(data.id);
                    Ewin.confirm({message: "保存成功!"});
                }
            },
            error: function (result) {
                console.log(result);
                alert(result.status);
            }
        })
    })
}

function loadGraphic() {
    $('#downButton').click(function () {
        var graphicUrl = ($("input[name = 'url']"))[0].value;
        console.log('graphicUrl:'+ graphicUrl);
        $.ajax({
            url:"/message/parseGraphicUrl?url="+graphicUrl,
            type:"POST",
            dataType: 'json',
            success:function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log('title:'+data.title);
                    console.log('imgUrl:'+data.imgUrl);
                    loadImage(data.imgUrl);
                    $("input[name='title']").val(data.title);
                }else{
                    var msg = result.msg;
                    console.log("msg:"+msg);
                    Ewin.alert({"message":msg});
                }
            }
        })
    });
}

function loadImage(imgUrl) {
    str = "";
    str += "<div class=\"swiper-slide swiper-slide-duplicate swiper-slide-next swiper-slide-duplicate-prev\"\n" +
        "data-swiper-slide-index=\"0\" style=\"height: 504px;\">\n" +
        "<div class=\"swiper-zoom-container\"><img class=\"swiper-lazy swiper-lazy-loaded\"\n" +
        "src=\""+imgUrl+"\">\n" +
        "</div>\n" +
        "</div>";
    str+= "<div class=\"swiper-slide swiper-slide-duplicate-active swiper-slide-prev swiper-slide-duplicate-next\"\n" +
        "data-swiper-slide-index=\"0\" style=\"height: 504px;\">\n" +
        "<div class=\"swiper-zoom-container\"><img class=\"swiper-lazy swiper-lazy-loaded\"\n" +
        "src=\""+imgUrl+"\">\n" +
        "</div>\n" +
        "</div>";
    str+="<div class=\"swiper-slide swiper-slide-duplicate swiper-slide-active swiper-slide-duplicate-prev\"\n" +
        "data-swiper-slide-index=\"0\" style=\"height: 504px;\">\n" +
        "<div class=\"swiper-zoom-container\"><img class=\"swiper-lazy swiper-lazy-loaded\"\n" +
        "src=\""+imgUrl+"\">\n" +
        "</div>\n" +
        "</div>";
    $('.swiper-wrapper').html(str);
}