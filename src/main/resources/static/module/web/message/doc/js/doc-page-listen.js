/**
 * 监听翻页
 *
 */

var prevIndex = 0, // 上一页
    activeIndex = 0, // 当前页
    startTime = new Date().getTime(),
    pageInfo = [],
    isInitArr = true;

function createSwiperHtml(params) {
    var html = '';

    html += '<div class="swiper-container" style="width: 100%;height: 100%;">';
    html += '<div class="swiper-wrapper">';

    for (var i = 0; i < params.pageCount; i++) {
        var url = params.imgUrl.replace('pict-1', 'pict-' + (i + 1));
        html += '<div class="swiper-slide">';
        html += '<div class="swiper-zoom-container">';
        html += '<img class="swiper-lazy" data-src="/downloadFile.action?rnd=' + Math.random() + '&fileName=' + url + '"/>';
        html += '</div>';
        html += '</div>';
    }

    html += '</div>';
    html += '<div class="swiper-pagination"></div>';
    html += '</div>';

    $('#h5-content .h5-left').append(html);

    initSwiper();
}

function delSwiperHtml() {
    $('#h5-content .h5-left').children().remove();
}

function initSwiper() {
    var swiper = new Swiper('.swiper-container', {
        // 延迟加载
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 2 // 设置在延迟加载图片时提前多少个slide
        },

        loop: true,

        zoom: {
            toggle: false
        },

        // 垂直切换
        direction: 'vertical',
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },

        // 回调函数
        on: {

            // 当你的浏览器尺寸发生变化时执行
            resize: function () {
                var _w = document.documentElement.clientWidth,
                    _h = document.documentElement.clientHeight,
                    w = _w, h = _h;

                if (isResize()) {
                    h = _h > 640 ? 640 : _h;
                    w = Math.floor(h * (320 / 504));

                    if (_h > 640) {
                        $('#h5-content').css('top', (_h - h) / 2);
                    }
                }
                $('#h5-content .h5-left').css({'width': w + 'px', 'height': h + 'px'});
            },

            // 当前Slide切换时执行(activeIndex发生改变)
            slideChange: function () {
                if ((this.previousIndex - 1) < ( this.slides.length - 2)) {
                    prevIndex = this.previousIndex && this.previousIndex - 1; // 上一页
                    activeIndex = this.realIndex; // 当前页

                    /**
                     * 监听翻页页面标签显示
                     *
                     */
                    if (window.module) {
                        var labelNames = window.module.data.labelNames;

                        // 加载当前页的标签数据
                        if (labelNames && labelNames.length) {
                            var label_view_ele = document.getElementById('label-view').children[0],
                                html = '',
                                activeLabelArr = labelNames[activeIndex];
                            for (var i in activeLabelArr) {
                                // todo html生成格式应该与createPageLabel 一样
                                var activeLabe = activeLabelArr[i];
                                html += '<div class="box-label label-close" data-i="' + i + '">';
                                html += '<span data-id="' + activeLabe.id + '">' + activeLabe.name + '</span>';
                                html += '<span class="label-hover label-hover-bg"></span>';
                                html += '<span class="label-hover"><i class="iconfont icon-close">&#xe601;</i></span>';
                                html += '</div>';
                            }
                            label_view_ele.innerHTML = html;
                        }
                    }

                    /**
                     * 监听阅读时间
                     *
                     */
                    // 初始化数组
                    if (isInitArr) {
                        for (var i = 0; i < this.slides.length - 2; i++) {
                            pageInfo[i] = 0;
                        }
                        isInitArr = false;
                    }

                    // 上一页阅读时间计算
                    var endTime = new Date().getTime();
                    var second = Math.round((endTime - startTime) / 1000); // 秒
                    // 翻页时长少于1秒也算1秒
                    second = second <= 0 ? 1 : second;

                    if (pageInfo[prevIndex]) {
                        pageInfo[prevIndex] = pageInfo[prevIndex] + second;
                    } else {
                        pageInfo[prevIndex] = second;
                    }
                    startTime = new Date().getTime();
                }
            }
        }
    });

    window.swiper = swiper;
}

function isResize() {
    var ua = navigator.userAgent;
    if ((ua.match(/(Android|webOS|iPhone|iPod|BlackBerry|Windows Phone)/i))) {
        return false;
    } else {
        return true;
    }
}