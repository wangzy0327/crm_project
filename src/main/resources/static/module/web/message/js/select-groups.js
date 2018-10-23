//获取实例对象
var api = frameElement.api;
//获取传递的参数值
var apiData = api.data;
//获取传递的参数的函数
var callback = apiData.callback;

var module = {};

module.data = {
    m: 400000000,
    ids: [],
    names: []
};

module.service = {
    initControls: function () {
        this.initButtons();
        this.initGrid();
    },

    initButtons: function () {
        api.setButtons([
            {
                name: '确定',
                callback: function () {
                    var module_d = module.data, ids = module_d.ids;
                    if (ids.length == 0) {
                        var def_obj = module_d.def_obj;
                        ids.push(def_obj.id);
                    }
                    callback(window, module.data.ids);
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
                {name: '组名', index: 'name'},
                {
                    name: '操作', index: 'operate',
                    formatter: function (val, row) {
                        return '<a class="select" data-id="' + row.id + '" data-name="' + row.name + '" style="font-size=12px;">选择</a>';
                    }
                }
            ],
            onLoadSuccess: function (data) {
                var items = data.object;
                for (var i in items) {
                    var item = items[i];
                    if (item.def_group === 2) {
                        module.data.def_obj = item;
                        $('.tip').text('提示：未选择任何组，系统会默认分配到' + item.name);
                        return false;
                    }
                }
            },
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
            t: 'groups',
            filter: JSON.stringify(filter)
        };
    },

    reloadGrid: function () {
        $('#grid').YTGridReload(this.getSearchData());
    },

    displayGroups: function () {
        var module_d = module.data, ids = module_d.ids, names = module_d.names, html = '';
        $('#groups').empty().append('<span>组名：</span>');
        if (ids.length > 0) {
            var names_len = names.length;
            for (var i in names) {
                html += '<span>' + names[i] + '<a href="#" onclick="javascript:void(0);" data-id="' + ids[i] + '">[删除]</a>';
                if (i < names_len - 1) {
                    html += '，';
                }
                html += '</span>';
            }
            $('#groups').append(html);
        }
    },

    checkGroups: function (id) {
        var ids = module.data.ids, flag = false;
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
            var module_d = module.data, id = $(this).data('id');
            if (!module.service.checkGroups(id)) {
                module_d.ids.push(id);
                module_d.names.push($(this).data('name'));
                module.service.displayGroups();
            }
        });
    },

    handleDeleteTag: function () {
        $('#groups').on('click', 'a', function () {
            var module_d = module.data;
            var index = module.service.indexOfArray(module_d.ids, $(this).data('id'));
            module_d.ids.splice(index, 1);
            module_d.names.splice(index, 1);
            module.service.displayGroups();
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});
