var select = {};

select.data = {
    m: 1010000,
    code: YT.getUrlParam('code')
};

var staffs = [], staffId = [], staffSelected = [], // 计划
    logStaffs = [], logStaffId = [], logStaffSelected = []; // 记录

select.service = {
    initControls: function () {
        this.initList();
    },

    initList: function () {
        var code = select.data.code,
            filter = [
                {field: 'code', value: select.data.code, operator: '<>', relation: 'AND'}
            ];

        var data = {
            m: module.data.m,
            t: 'staffs',
            filter: JSON.stringify(filter),
            params: JSON.stringify({code: code})
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    staffs = data.object;
                    logStaffs = data.object;
                    $("#chooseStaffer").find(".staff-list").append(select.service.createSelectHtml(staffs, staffId));
                    $("#chooseStaffer2").find(".staff-list").append(select.service.createSelectHtml(logStaffs, logStaffId));
                }
            }
        });
    },

    searchStaffs: function (keyword, ele, data, ids) {
        var $list = $(ele).find('.staff-list'), arr = [];
        $list.empty();
        for (var i in data) {
            if (data[i].name.indexOf(keyword) >= 0) {
                arr.push(data[i]);
            }
        }
        $list.append(select.service.createSelectHtml(arr, ids));
    },

    selectStaffs: function (ele, ids, selectedIds) {
        var id = $(ele).parents('.weui-media-box_appmsg').data('id');
        if ($(ele).is(":checked")) {
            var temp = {
                id: id,
                head: $(ele).parents('.weui-media-box__thumb').attr('src')
            };
            ids.push(temp.id);
            selectedIds.push(temp);
        } else {
            for (var i = 0; i < ids.length; i++) {
                if (ids[i] == id) {
                    ids.splice(i, 1);
                    selectedIds.splice(i, 1);
                }
            }
        }
    },

    createSelectHtml: function (data, id) {
        var html = '';

        for (var i in data) {
            var item = data[i];

            html += '<a class="weui-media-box weui-media-box_appmsg" data-id="' + item.id + '">';
            html += '<div class="weui-media-box__hd head-size">';
            html += '<img class="weui-media-box__thumb head-pic" src="' + (item.avatar || '') + '">';
            html += '</div>';
            html += '<div class="weui-media-box__bd">';
            html += '<h4 class="weui-media-box__title">' + item.name + '</h4>';
            html += '</div>';
            html += '<label class="weui-cell weui-check__label muti-selected">';
            html += '<div class=\"weui-cell__hd">';

            if ($.inArray(item.id, id) >= 0) {
                html += '<input type="checkbox" class="weui-check" name="checkbox" checked="checked">';
            } else {
                html += '<input type="checkbox" class="weui-check" name="checkbox">';
            }

            html += '<i class="weui-icon-checked"></i>';
            html += '</div>';
            html += '</label>';
            html += '</a>';
        }

        return html;
    },

    createStaffsHtml: function (ele, data) {
        var $box = $(ele).find('.avatar-box');
        $box.children('.avatar-cell').remove();
        for (var i = 0; i < data.length; i++) {
            $box.prepend('<div class="btn-box avatar-cell" style="width:35px;height:35px; margin:18px 0"><img src="' + (data[i].head || '') + '"/></div>');
        }
    }
};

select.eventHandler = {
    handleEvents: function () {
        this.handleSearchStaffs();
        this.handleSelectStaffs();
        this.handleConfirmStaffs();
    },

    handleSearchStaffs: function () {
        $("#chooseStaffer .searchInput").bind('input propertychange', function (e) {
            select.service.searchStaffs($(this).val(), '#chooseStaffer', staffs, staffId);
        });

        $("#chooseStaffer2 .searchInput").bind('input propertychange', function (e) {
            select.service.searchStaffs($(this).val(), '#chooseStaffer2', logStaffs, logStaffId);
        });
    },

    handleSelectStaffs: function () {
        $("#chooseStaffer .staff-list").on('click', 'input', function () {
            select.service.selectStaffs(this, staffId, staffSelected);
        });

        $("#chooseStaffer2 .staff-list").on('click', 'input', function () {
            select.service.selectStaffs(this, logStaffId, logStaffSelected);
        });
    },

    handleConfirmStaffs: function () {
        $("#chooseStaffer .close-popup").click(function () {
            select.service.createStaffsHtml('#btn-plan', staffSelected);
        });

        $("#chooseStaffer2 .close-popup").click(function () {
            select.service.createStaffsHtml('#btn-log', logStaffSelected);
        });
    }
};

$(function () {
    select.service.initControls();
    select.eventHandler.handleEvents();
});