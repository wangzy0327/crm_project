//获取实例对象
var api = frameElement.api;
//获取传递的参数值
var apiData = api.data;
//获取传递的参数的函数
var callback = apiData.callback;

var module = {};

module.data = {
    m: 101000000,
    tagIds: [],
    tagNames: []
};

module.service = {
    initControls: function () {
        $.extend(module.data, apiData.data);
        module.service.displayTags();
        this.initButtons();
        this.initGrid();
    },

    initButtons: function () {
        api.setButtons([
            {
                name: '确定',
                callback: function () {
                    callback(window, {
                        tagIds: module.data.tagIds,
                        tagNames: module.data.tagNames
                    });
                    return false;
                }
            },
            {
                className: 'btn-gray',
                name: '取消'
            }
        ])
    },

    initGrid: function () {
        $('#grid').YTGrid({
            params: this.getSearchData(),
            pager: false,
            colModel: [
                {name: '姓名', index: 'name'},
                {
                    name: '操作', index: 'operate',
                    formatter: function (val, row) {
                        return '<a class="select" data-id="' + row.id + '" data-name="' + row.name + '" style="font-size=12px;">选择</a>';
                    }
                }
            ],
            jsonReader: {
                id: 'id'
            }
        });
    },

    getSearchData: function () {
        var filter = [
            {field: 'corpid', value: YT.getCorpId(), operator: '=', relation: 'and'}
        ];

        var $keyword = $('#keyword'),
            keyword = $keyword.val() === $keyword[0].defaultValue ? "" : $.trim($keyword.val());

        if ('' != keyword) {
            filter.push([
                {field: 'name', value: '%' + keyword + '%', operator: 'like', relation: 'and'}
            ]);
        }

        return {
            m: module.data.m,
            t: 'message_d_tag',
            filter: JSON.stringify(filter)
        };
    },

    reloadGrid: function () {
        $('#grid').YTGridReload(this.getSearchData());
    },

    displayTags: function () {
        var html = '';
        $('#tags').empty().append('<span>标签：</span>');
        if (module.data.tagIds.length > 0) {
            for (var i = 0; i < module.data.tagNames.length - 1; i++) {
                html += '<span>' + module.data.tagNames[i] + '<a href="#" onclick="javascript:void(0);" data-id="' +
                    module.data.tagIds[i] + '">[删除]</a>，</span>';
            }
            html += '<span>' + module.data.tagNames[module.data.tagNames.length - 1] + '<a href="#" onclick="javascript:void(0);" data-id="' +
                module.data.tagIds[module.data.tagNames.length - 1] + '">[删除]</a></span>';
            $('#tags').append(html);
        }

    },
    checkTag: function (id) {
        var flag = false;
        var ids = module.data.tagIds;
        for (var i = 0; i < ids.length; i++) {
            if (ids[i] == id) {
                flag = true;
                break;
            }
        }
        return flag;
    },
    indexOfArray: function (arr, val, key) {
        var length = arr.length;
        for (var i = 0; i < length; i++) {
            if (key != undefined && key != null) {
                if (arr[i][key] == val) {
                    return i;
                }
            } else if (arr[i] == val) {
                return i;
            }
        }
        return -1;
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleSearch();
        this.handleClear();
        this.handleSelectTag();
        this.handleDeleteTag();
    },

    handleSearch: function () {
        $('#search').click(function () {
            module.service.reloadGrid();
        });
    },

    handleClear: function () {
        $('#clear').click(function () {
            $('#keyword').val('').blur();
            module.service.reloadGrid();
        });
    },

    handleSelectTag: function () {
        $('#grid').on('click', '.select', function () {
            var self = this;
            if (!module.service.checkTag($(self).data('id'))) {
                module.data.tagIds.push($(self).data('id'));
                module.data.tagNames.push($(self).data('name'));
                module.service.displayTags();
            }
        });
    },

    handleDeleteTag: function () {
        $('#tags').on('click', 'a', function () {
            var index = module.service.indexOfArray(module.data.tagIds, $(this).data('id'));
            module.data.tagIds.splice(index, 1);
            module.data.tagNames.splice(index, 1);
            module.service.displayTags();
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});
