pageInfo = [];
index = 0;
var mySwiper;
$(function () {
})

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