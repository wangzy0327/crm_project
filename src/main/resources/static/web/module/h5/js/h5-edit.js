pageInfo = [];
index = 0;
$(function () {
    loadH5();
    updateH5();
    saveH5();
    $('iframe').load(function() {
        console.log(".........loading..........");

        var iframe = document.getElementsByTagName('iframe')[0].contentWindow;

        //滚动监听事件
        var testiframe=document.getElementById("page-view").contentWindow;
        var doc=testiframe.document;
        /*testiframe.scroll(0,doc.body.scrollHeight);*/
        testiframe.addEventListener("changedTo",function(e){
            saveTags();
            var active = $("iframe").contents().find('.page.current')[0].id;
            index = +active.split('-')[1]; // 当前页
            updateTags(index);
            console.log("activePage:"+active);
            console.log('index:'+index);
            pageInfo[index] = pageInfo[index] || '';
            // 发生changeTo事件的时间点
        },false);

    })
});


//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}


// 保存刚切换页的标签
function saveTags(){
    var tagStr = '';
    var tag = [];
    $('.tag').each(function () {
        var str = $(this).find('span').text().trim();
        console.log("tagStr:"+str);
        tag.push(str);
    });
    if(tag.length>0)
        tagStr = tag.join(',');
    pageInfo[index] = '';
    pageInfo[index] = tagStr;
    console.log("pageInfo[index]:"+pageInfo[index]+"....");
    return pageInfo;
}

// 更新当前页面的标签
function updateTags(index) {
    $('#tags_1').importTags('');
    var tagArr ;
    if(pageInfo[index]!=undefined && pageInfo[index]!=null && pageInfo[index]!= '')
        tagArr = pageInfo[index].split(',');
    console.log("tagArr:"+tagArr);
    if(tagArr!=undefined && tagArr!=null && tagArr!=''){
        for(var i = 0;i < tagArr.length;i++){
            $('#tags_1').addTag(tagArr[i],{focus:false,callback:false});
        }
    }
}

function saveH5() {
    $('#save').click(function () {
        var id = ($("input[name='id']"))[0].value;
        console.log("id:"+id);
        var title = ($("input[name='title']"))[0].value;
        console.log("title:"+title);
        var h5Url = ($("input[name = 'url']"))[0].value;
        console.log("url:"+h5Url);
        saveTags();
        var iframeSrc = $('iframe').attr('src');
        if(title == undefined || title == null || title == ''){
            Ewin.confirm({ message: "标题不能为空" });
            return ;
        }
        if(iframeSrc == undefined || iframeSrc == null || iframeSrc == ''){
            Ewin.confirm({message: "H5内容不能为空"});
            return ;
        }
        var page = $("iframe").contents().find('ul.page-list li.page').length;
        // var tags = new Array();
        // var spanTags = $(".tag").children("span");
        // for(i = 0;i<spanTags.length;i++){
        //     console.log($.trim($(spanTags[i]).text().substring(0,10)));
        //     tags.push($.trim($(spanTags[i]).text().substring(0,10)));
        // }
        for(i = 0;i<pageInfo.length;i++){
            console.log((i+1)+":"+pageInfo[i]);
        }
        console.log("tags:"+pageInfo);
        var third_url = ($("input[name = 'third_url']"))[0].value;
        var third_params = {"type":"rabbitpre","url":third_url};
        var third_params_str = JSON.stringify(third_params);
        $.ajax({
            url:"/message/h5/update",
            type:"POST",
            dataType: 'json',
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id":id,
                "corpId":"wx4b8e52ee9877a5be",
                "suiteId":"wx9b2b1532fd370525",
                "corpid":"wx4b8e52ee9877a5be",
                "msgtype":"5",
                "titleText":title,
                "title":title,
                "description":iframeSrc,
                "pagecount":page,
                "thirdParams":third_params_str,
                "tags":pageInfo
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
    var id = getUrlParam('id');
    console.log("id:"+id);
    $.ajax({
        url:"/message/h5?id="+id,
        type:"POST",
        dataType: 'json',
        success:function (result) {
            if(result.code == 0){
                var data = result.data;
                $('iframe').attr('src',data.description);
                var tags = data.tags;
                pageInfo = [];
                for(var i = 0;i < tags.length;i++){
                    pageInfo[i] = tags[i];
                }
                $("input[name='id']").val(id);
                var third_params_str = data.thirdParams;
                console.log("third_params_str:"+third_params_str);
                var third_params = JSON.parse(third_params_str);
                var third_url = third_params.url;
                console.log("third_url:"+third_url);
                $("input[name='url']").val(third_url);
                $("input[name='third_url']").val(third_url);
                var title = data.title;
                console.log("title:"+title);
                $("input[name='title']").val(title);
                updateTags(0);
                // $("input[name='title']").val(data.title);
            }
        },
        error:function (result) {
            console.log(result);
            alert(result.status);
        }
    })
}

function updateH5() {
    $('#downButton').click(function () {
        var h5Url = ($("input[name = 'url']"))[0].value;
        console.log('h5 Url:'+ h5Url);
        if(h5Url.indexOf("?mobile")<0){
            if(h5Url.indexOf("/aUe1Zi")>=0&&h5Url.indexOf("/m")>0){
                h5Url = h5Url.replace("/m/","/m2/");
            }
            h5Url+="?mobile=1";
        }
        $.ajax({
            url:"/message/parseH5Url?url="+h5Url,
            type:"POST",
            dataType: 'json',
            success:function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log('pageUrl:'+data);
                    $('iframe').attr('src',data);
                    // $("input[name='title']").val(data.title);
                }
            },
            error:function (result) {
                console.log(result);
                alert(result.status);
            }
        })
        // var keywords = $("meta[name='keywords']").attr('content');
        // console.log('keywords:'+keywords);
    });
}