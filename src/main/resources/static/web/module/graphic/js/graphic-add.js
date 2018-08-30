$(function () {
    loadGraphic();
    saveGraphic();
    //主要是这部分
})

function saveGraphic() {
    $('#save').click(function () {
        var title = ($("input[name='title']"))[0].value;
        console.log("title:"+title);
        var h5Url = ($("input[name = 'url']"))[0].value;
        console.log("url:"+h5Url);
        var d = ($("input[name = 'd']"))[0].value;
        console.log("d:"+d);
        var imgSrc = ($('.swiper-zoom-container img'))[0].src;
        if(title == undefined || title == null || title == ''){
            Ewin.confirm({ message: "标题不能为空" });
            return ;
        }
        if(imgSrc == undefined || imgSrc == null || imgSrc == ''){
            Ewin.confirm({message: "平面内容不能为空"});
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
            url:"/message/graphic/add?imgUrl="+imgSrc+"&tags="+tags,
            type:"POST",
            dataType: 'json',
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "corpId":"wx4b8e52ee9877a5be",
                "suiteId":"wx9b2b1532fd370525",
                "corpid":"wx4b8e52ee9877a5be",
                "msgtype":"6",
                "titleText":title,
                "title":title,
                "thirdParamId":d,
                "pagecount":1
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

function loadSwiper() {
    var mySwiper = new Swiper ('.swiper-container', {
        direction: 'vertical',
        loop: true,

        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
        },

        // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // 如果需要滚动条
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    })
    mySwiper.on('slideChangeTransitionEnd', function () {
        var imgurl = $('.swiper-slide-active img').attr("src");
        var index = $('.swiper-slide-active').attr("data-swiper-slide-index");
        console.log("index:"+index);
        var txt = $('.swiper-slide-active').html();
        console.log("内容："+txt+"===索引值："+mySwiper.activeIndex+"===图片地址："+imgurl);

    });
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
                    $("input[name='d']").val(data.d);
                }else{
                    var msg = result.msg;
                    console.log("msg:"+msg);
                    Ewin.alert({"message":msg});
                }
                loadSwiper();
            }
        })
    });
}

function loadImage(imgUrl) {
    // imgUrl = "D:\\ftpServer\\05603513-8614-43da-a17b-6893d238d0f0.jpg";
    str = "";

// <div class="swiper-slide"
//     style="height: 504px;">
//         <div class="swiper-zoom-container"><img class=""
//     src="http://127.0.0.1:9000/05603513-8614-43da-a17b-6893d238d0f0.jpg">
//         <!--//imgpub.chuangkit.com/design/2018/08/22/430860543_thumb@780w_100Q_1x.jpg?v=2018-08-22 16:49:48.0-->
//         </div>
//         </div>

    str += "<div class=\"swiper-slide\"\n" +
        "style=\"height: 504px;\">\n" +
        "<div class=\"swiper-zoom-container\">"+
        "<img src=\""+imgUrl+"\">\n" +
        "</div>\n" +
        "</div>";
    $('.swiper-wrapper').html(str);
}