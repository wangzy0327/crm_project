var module = {};

module.data = {
    m: 1010000
};

var pager = {
    loading: false,
    page: 1,
    rows: 10
};

module.service = {

    initControls: function () {
        var self = this;
        common.service.getUserInfo(function (data) {
            module.data.staff_id = data.id;

            self.initSearch();
        });
    },

    initList: function (data) {
        var noMore =
            '<div  id="noMore" style="margin-top: 10px;text-align: center;">' +
            '无更多记录' +
            '</div> ';

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    if (pager.page == 1) {
                        $("#noMore").remove();
                    }

                    var items = data.object.items, html = '';
                    pager.page = data.object.idx + 1;

                    for (var i in items) {
                        var item = items[i],
                            type = item.type,
                            pushTime = new Date(item.time).Format('yyyy-MM-dd hh:mm:ss'),
                            values = [item.timeOrWay || '', item.locationOrRequirement || '', item.contentOrResult || ''];

                        /*if (+i) {
                            html += '<div class="weui-form-preview" style="margin-top: 10px;">';
                        } else {
                            html += '<div class="weui-form-preview">';
                        }*/

                        html += '<div class="weui-form-preview" style="margin-top: 10px;">';

                        html += '<div class="weui-form-preview__hd">';
                        html += '<label class="weui-form-preview__label">';

                        if (item.isComment) {
                            html += '<span class="first-background-green">已评论</span>';
                        } else {
                            html += '<span class="visited-background-red">未评论</span>';
                        }

                        html += '&nbsp;' + item.customer_name + '&nbsp;';
                        html += type == 1 ? '(拜访计划)' : '(拜访记录)';
                        html += '</label>';
                        html += '<em class="weui-form-preview__value" style="text-align: right">' + pushTime + '</em>';
                        html += '</div>';

                        if (type == 1) {
                            html += module.service.createHtml(['拜访时间', '拜访地点', '拜访内容'], values);
                        } else if (type == 2) {
                            html += module.service.createHtml(['拜访方式', '客户需求', '拜访结果'], values);
                        }

                        html += '<div class="weui-form-preview__ft">';
                        html += '<a class="weui-form-preview__btn weui-form-preview__btn_default" ';
                        html += 'href="visit-detail-evaluation.html' + YT.setUrlParams({
                                staff_id: module.data.staff_id,
                                visit_id: item.visit_id,
                                type: type,
                                iscomment: item.isComment,
                                commentid: item.comment_id
                            }) + '">查看评论</a>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                    }

                    $("#list").append(html);

                    if (data.object.idx >= data.object.pageCount) {
                        //最后一页
                        pager.loading = true;
                        $('#infinite').remove();
                        $("#list").append(noMore);
                        return;
                    }
                } else {
                    $.alert(data.message);
                }
                pager.loading = false;
            }
        });
    },

    // 初始化列表
    initSearch: function () {
        var data = {
            m: module.data.m,
            t: 'v_comment_visit',
            order: 'time desc',
            page: pager.page,
            rows: pager.rows
        };

        module.service.initList(data);
    },

    createHtml: function (labs, values) {
        var html = '';
        if (labs.length == values.length) {
            html += '<div class="weui-form-preview__bd">';
            for (var i in labs) {
                html += '<div class="weui-form-preview__item">';
                html += '<label class="weui-form-preview__label">' + labs[i] + '</label>';
                html += '<span class="weui-form-preview__value">' + values[i] + '</span>';
                html += '</div>';
            }
            //html += '</div>';
        } else {
            throw '数组长度不一致';
        }
        return html;
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleInfinite();
    },

    // 滚动加载
    handleInfinite: function () {
        $(document.body).infinite().on("infinite", function () {
            if (pager.loading) return;
            pager.loading = true;
            module.service.initSearch();
        });
    }
};

$(function () {
    // todo 企业微信点击返回，查询staff_id查询不对，需要延时加载
    setTimeout(function () {
        module.service.initControls();
        module.eventHandler.handleEvents();
        $(document.body).infinite();
    }, 500);
});