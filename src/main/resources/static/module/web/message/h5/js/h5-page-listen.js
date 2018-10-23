/**
 * 监听H5翻页
 *
 */

var prevIndex = 0, // 上一页
    activeIndex = 0, // 当前页
    startTime = new Date().getTime(),
    pageInfo = [],
    isInitArr = true;

(function () {
    var title = /*pageData.name*/ document.title; // pageData.name数据可能存在变量
    pageData.title = title;
    if (parent.module) {
        title = parent.module.data.title || title;
        // 设置父页面title
        parent.document.title = title;
        var meta = parent.document.getElementsByTagName('meta');
        for (i in meta) {
            if (typeof meta[i].name != "undefined" && meta[i].name.toLowerCase() == "description") {
                meta[i].content = title;
            }
        }
    }
    var $title = parent.document.getElementById('title');
    if ($title) {
        $title.value = title;
    }
    if (activeIndex == 0 && isInitArr && parent.module) {
        initLabel();
    }
    // 赋值third_params，暂时只使用兔展
    pageData.third_params = {
        d: pageData.shorturl,
        type: 'rabbitpre',
        url: pageData.app_url
    }
})();

document.addEventListener('changedTo', function (e) {
    var indexStr = document.getElementsByClassName('page current')[0].id;

    prevIndex = activeIndex; // 上一页
    activeIndex = +indexStr.split('-')[1]; // 当前页

    /**
     * 监听翻页页面标签显示
     *
     */
    initLabel();

    /**
     * 监听阅读时间
     *
     */

    // 初始化数组
    if (isInitArr) {
        var len = document.getElementsByClassName('page').length;
        for (var i = 0; i < len; i++) {
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

});

function initLabel() {
    if (parent.module) {
        var labelNames = parent.module.data.labelNames;

        // 加载当前页的标签数据
        var label_ele = parent.document.getElementById('label-view');
        if (null != label_ele) {
            var label_child_ele = label_ele.children[0], html = '';
            if (labelNames && labelNames.length) {
                var activeLabelArr = labelNames[activeIndex];
                for (var i in activeLabelArr) {
                    // todo 与message-comm.js 方法一样：createLabelHtml_del
                    var activeLabel = activeLabelArr[i];
                    html += '<div class="box-label label-del" data-i="' + i + '">';
                    html += '<span data-id="' + activeLabel.id + '">' + activeLabel.name + '</span>';
                    html += '<span class="label-hover label-hover-bg"></span>';
                    html += '<span class="label-hover"><i class="iconfont icon-del">&#xe601;</i></span>';
                    html += '</div>';
                }
            }
            label_child_ele.innerHTML = html;
        }
    }
}