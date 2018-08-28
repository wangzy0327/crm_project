$(function () {
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
    //主要是这部分
    mySwiper.on('slideChangeTransitionEnd', function () {
        var imgurl = $('.swiper-slide-active img').attr("src");
        var pre = $('.swiper-slide-prev').attr("data-swiper-slide-index");
        console.log("pre:"+pre);
        var index = $('.swiper-slide-active').attr("data-swiper-slide-index");
        console.log("index:"+index);
        var txt = $('.swiper-slide-active').html();
        console.log("内容："+txt+"===索引值："+mySwiper.activeIndex+"===图片地址："+imgurl);

    });
})