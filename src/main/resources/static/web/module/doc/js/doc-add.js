pageInfo = [];
index = 0;
var mySwiper;
$(function () {
    saveDoc();
});

function loadSwiper() {
    mySwiper = new Swiper ('.swiper-container', {
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
    });
    mySwiper.on('slideChangeTransitionEnd', function () {
        saveTags();
        index = $('.swiper-slide-active').attr("data-swiper-slide-index"); // 当前页
        console.log("index:"+index);
        updateTags(index);
        pageInfo[index] = pageInfo[index] || '';
    });
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

function saveDoc() {
    $('#save').click(function () {
        var title = ($("input[name='title']"))[0].value;
        console.log("title:"+title);
        if(title == undefined || title == null || title == ''){
            Ewin.confirm({ message: "标题不能为空" });
            return ;
        }
        saveTags();
        var saveFileName = $('.file-item').attr('data-id');
        console.log("saveFileName:"+saveFileName);
        var uploadFileName = $('div.file-panel span.info').text();
        console.log("uploadFileName:"+uploadFileName);
        if(saveFileName == undefined || saveFileName == null || saveFileName == ''){
            Ewin.confirm({ message: "上传文件不能为空" });
            return ;
        }
        var coverPicAttach = "";
        coverPicAttach = imgInfo.join(",");
        console.log("imgInfo:"+imgInfo);
        console.log("coverPicAttach:"+coverPicAttach);
        var page = $('.swiper-pagination-bullet').length;
        console.log("page:"+page);
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
        var contentAttach = {"saveFileName":saveFileName,"uploadFileName":uploadFileName};
        var contentAttachStr = JSON.stringify(contentAttach);
        var createUserId = $.cookie('userId');
        console.log("createUserId:"+createUserId);
        $.ajax({
            url:"/message/doc/add",
            type:"POST",
            dataType: 'json',
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "corpId":"wx4b8e52ee9877a5be",
                "suiteId":"wx9b2b1532fd370525",
                "corpid":"wx4b8e52ee9877a5be",
                "msgtype":"2",
                "titleText":title,
                "title":title,
                "pagecount":page,
                "createUserId":createUserId,
                "coverpicattach":coverPicAttach,
                "contentattach":contentAttachStr,
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