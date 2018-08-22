$(function () {
    loadH5();
    saveH5();
})

function saveH5() {
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

function loadH5() {
    $('#downButton').click(function () {
        var h5Url = ($("input[name = 'url']"))[0].value;
        console.log('h5 Url:'+ h5Url);
        if(h5Url.indexOf("?mobile")<0){
            if(h5Url.indexOf("/aUe1Zi")>=0&&h5Url.indexOf("/m")>0){
                h5Url = h5Url.replace("/m/","/m2/");
            }
            h5Url+="?mobile=1";
        }
        $('iframe').attr('src',h5Url);
        $.ajax({
            url:"/message/parseUrl?url="+h5Url,
            type:"POST",
            dataType: 'json',
            success:function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log('title:'+data.title);
                    $("input[name='title']").val(data.title);
                }
            }
        })
        // var keywords = $("meta[name='keywords']").attr('content');
        // console.log('keywords:'+keywords);
    });
}