var module = {};

module.data = {
    m: 3000000,
    corpid: YT.getUrlParam('corpid'),
    groupid: YT.getUrlParam("groupid")
};

module.service = {
    initControls: function () {
        this.initDom();
    },

    initDom: function () {
        this.initMessageHtml();
    },

    initMessageHtml: function () {
        var self = this;

        this.getMessageList(function (data) {
            var $doc = $(document.body), loading = false, idx = data.idx;

            if (idx < data.pageCount) {
                loading = true;
            } else {
                $doc.find('.weui-loadmore').addClass('weui-loadmore_line')
                    .html('<span class="weui-loadmore__tips" style="background: #f1f5f8;">无更多数据</span>');
            }

            $doc.data('page', idx + 1);
            $doc.data('loading', loading);

            self.createMessageHtml(data.items);
        });
    },

    createMessageHtml: function (items) {
        var html = '';

        for (var i in items) {
            var item = items[i];
            if (item.shareTime) {
                html += '<a class="weui-cell weui-cell_access detail" data-id="' + item.messageId + '" data-name="' + item.titleText + '">';
            } else {
                html += '<div class="weui-cell">';
            }
            html += '<div class="weui-cell__bd">';
            html += '<p>' + this.formatMessageTitle(item.titleText);
            html += '<span style="font-size: 13px;color:#666;">（' + this.formatTime(item.shareTime) + '分享）</span>';
            html += '</p></div>';
            html += '<div class="weui-cell__ft">';
            html += '<span style="font-size: 13px;color:#666;">浏览：</span>';
            html += '<span style="color: red;">' + item.count + '</span>';
            html += '</div>';
            if (item.shareTime) {
                html += '</a>';
            } else {
                html += '</div>';
            }
        }

        $('#message-list').append(html);
    },

    getMessageList: function (callback) {
        var module_d = module.data, corpid = module_d.corpid, groupid = module_d.groupid,
            page = $(document.body).data('page') || 1;

        var filter = [
            {field: 'corpid', value: corpid, operator: '=', relation: 'and'},
            {field: 'group_id', value: groupid, operator: '=', relation: 'and'}
        ];

        var data = {
            m: module_d.m,
            t: 'v_message_share_map_message',
            filter: JSON.stringify(filter),
            order: 'shareTime desc, count desc',
            page: page,
            rows: 15
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    callback(data.object);
                } else {
                    $.alert(data.message);
                }
            }
        });
    },

    formatMessageTitle: function (value) {
        if (value.length > 10) {
            value = value.substr(0, 5) + '...' + value.substr(value.length - 5, value.length);
        }
        return value;
    },

    formatTime: function (time) {
        if (!time) {
            return '未';
        }
        var nowTime = new Date().getTime();
        var second = (nowTime - time) / 1000; // 秒
        var minute = second / 60; // 分
        var hour = minute / 60; // 小时
        var day = hour / 24; // 天
        var week = day / 7; // 周
        var month = day / 30; // 月
        var year = day / 365; // 年
        if (minute < 1) {
            return Math.floor(second) + ' 秒前';
        } else if (hour < 1) {
            return Math.floor(minute) + ' 分前';
        } else if (day < 1) {
            return Math.floor(hour) + ' 小时前';
        } else if (week < 1) {
            return Math.floor(day) + ' 天前';
        } else if (month < 1) {
            return Math.floor(week) + ' 周前';
        } else if (year < 1) {
            return Math.floor(month) + ' 月前';
        } else if (year >= 1 && year < 4) {
            return Math.floor(year) + ' 年前';
        } else if (year >= 4) {
            return new Date(time).Format('yyyy-MM-dd hh:mm:ss');
        }
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleInfinite();
        this.handleToDetail();
    },

    handleInfinite: function () {
        $(document.body).infinite(100).on("infinite", function () {
            if ($(this).data('loading')) {
                $(this).data('loading', false);
                module.service.initMessageHtml();
            }
        });
    },

    handleToDetail: function () {
        $('#message-list').on('click', '.detail', function () {
            window.location.href = '/module/map/map-detail.html' + YT.setUrlParams({
                id: $(this).data('id'),
                name: $(this).data('name')
            });
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});