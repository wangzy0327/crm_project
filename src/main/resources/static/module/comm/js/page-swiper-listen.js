/**
 * 监听翻页，基于jquery
 *
 * 注意：
 * 1、module.data.title 用于修改页面标题，如果undefined，则默认原值
 *
 */

var prevIndex = 0, // 上一页
    activeIndex = 0, // 当前页
    startTime = new Date().getTime(), // 开始阅读时间
    pageInfo = [], // 阅读时间
    isInitArr = true, // 是否初始化阅读时间
    pageData = {}; // 页面数据

var PageSwiperComm = PageSwiperComm || {};

PageSwiperComm = {
    init: function (ele, data, isShare) {
        this.ele = ele;
        /**
         * {d:d,type:type,url:url}
         * url:第三方链接
         *
         */
        this.data = data;
        console.log("title:"+data.title);
        this.isShare = isShare || 0; // 0不是分享页面 1是分享页面
        this.setPageData();
    },

    setPageData: function () {
        var self = this,
            type = this.data.msgtype,
            // url = '/message/share/getShareInfo.action?type=' + type + '&d=' + d;
            url = "";
        console.log("msgType:"+type);
        if (2 == type) { // 只适用于doc
            // var doc_params = d.params;
            pageData = {
                title: this.data.title,
                type:this.data.msgtype,
                imgUrl: this.data.coverpicattach,
                pageCount: this.data.pagecount,
                width: 595,
                height: 841,
                size: '',
                third_params: {}
            };
            self.initDom();
        } else {
            $.get(url, function (data) {
                if (200 == data.status) {
                    var item = JSON.parse(data.object);

                    switch (type) {
                        case 'chuangkit': // 创客贴
                            if (item.body.error) {
                                self.resetDom();
                            } else {
                                var bean_obj = item.body.bean;
                                pageData = {
                                    title: bean_obj.title,
                                    type:this.data.msgtype,
                                    imgUrl: bean_obj.imgUrl,
                                    pageCount: bean_obj.pageCount,
                                    width: bean_obj.width,
                                    height: bean_obj.height,
                                    size: '@780w',
                                    third_params: self.third_params
                                };
                                self.initDom();
                            }
                            break;
                    }
                } else {
                    self.resetDom();
                }
            });
        }
    },

    initDom: function () {
        // 赋值标签页面的title
        var title = pageData.title;
        if (window.module) {
            title = module.data.title || title;
        }
        $('#title').val(title);

        // 修改页面title
        if (this.isShare) {
            $("title").html(title + '');
            $('meta[name="description"]').attr('content', title);
        }

        $(this.ele).children().remove();
        this.createSwiperHtml();
    },

    resetDom: function () {
        $(this.ele).children().remove();
        pageData = {};
    },

    createSwiperHtml: function () {
        var html = '';

        html += '<div class="swiper-container" id="swiperWrap">';
        html += '<div class="swiper-wrapper">';
        console.log("imgUrl:"+pageData.imgUrl);
        var pics = [];
        pics = pageData.imgUrl.split(",");
        for (var i = 0; i < pageData.pageCount; i++) {
            // var url = pageData.imgUrl;
            // if ('doc' == pageData.type) { // 只适用于doc
            //     url = url.replace('pict-1', 'pict-' + (i + 1));
            // } else {
            //     url = i ? url + '_' + i : url;
            // }
            html += '<div class="swiper-slide">';
            html += '<div class="swiper-zoom-container">';
            console.log("pic["+i+"]: "+pics[i]);
            html += '<img class="swiper-lazy" data-src="' + pics[i] + '"/>';
            html += '</div>';
            html += '</div>';
        }

        html += '</div>';
        html += '<div class="swiper-pagination"></div>';
        html += '</div>';

        $(this.ele).append(html);
        // 设置页面宽高
        this.setPageSize();
        this.initSwiper();
    },

    // 初始化swiper插件
    initSwiper: function () {
        var self = this;

        var swiper = new Swiper('#swiperWrap', {
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

                // 回调函数，初始化后执行
                init: function () {

                },

                // 当你的浏览器尺寸发生变化时执行
                resize: function () {
                    self.setPageSize();
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
                        if (!self.isShare && window.module) {
                            var labelNames = module.data.labelNames;
                            // 加载当前页的标签数据
                            var $label_view = $('#label-view .box'), html = '';
                            if (labelNames && labelNames.length) {
                                var activeLabelArr = labelNames[activeIndex];
                                for (var i in activeLabelArr) {
                                    var activeLabel = activeLabelArr[i];
                                    html += MessageComm.page.createLabelHtml_del(i, activeLabel.id, activeLabel.name);
                                }
                            }
                            $label_view.html(html);
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

        // 翻页函数
        window.prevPage = function () {
            swiper.slidePrev();
        };

        window.nextPage = function () {
            swiper.slideNext();
        };

        // 跳转
        window.slideTo = function (index) {
            swiper.slideTo(index, 1000, false); //切换到第一个slide，速度为1秒
        };
    },

    // 窗口大小改变函数
    setPageSize: function () {
        var doc_w = $(this.ele).width(),
            doc_h = $(this.ele).height(),
            page_w = +pageData.width,
            page_h = +pageData.height,
            w = doc_w, h = doc_h;

        if (page_w > page_h) {
            // 宽度为基准
            w = doc_w > 780 ? 780 : doc_w;
            var _h = Math.round(w / page_w * page_h);
            h = doc_h > _h ? _h : doc_h;
        } else {
            // 高度为基准
            h = doc_h > page_h ? page_h : doc_h;
            var _w = Math.round(h / page_h * page_w);
            w = doc_w > _w ? _w : doc_w;
        }

        $('#swiperWrap').css({'width': w + 'px', 'height': '100%'});
    }
};
