var module = {};

module.data = {
    m: 101000000,
    isLoading: 1     // 是否显示加载遮罩层
};

module.service = {
    initControls: function () {
        this.initGrid();
    },

    // 初始化列表
    initGrid: function () {
        //显示加载中
        $.loading.show();

        $('#grid').YTGrid({
            params: this.getSearchData(),
            pager: true,
            colModel: [
                {name: '标签', index: 'name'},
                {
                    name: '操作', index: 'operate',
                    formatter: function (val, row) {
                        return '<a class="edit">编辑</a>&nbsp;&nbsp;<a class="delete">删除</a>';
                    }
                }
            ],
            onLoadSuccess: function (data) {
                module.service.showMsg(data, '', function () {
                    //隐藏加载中
                    if (module.data.isLoading) {
                        $.loading.hide();
                        module.data.isLoading = 0;
                    }
                });
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
            t: 'message_d_tag',
            filter: JSON.stringify(filter)
        };
    },

    reloadGrid: function () {
        $('#grid').YTGridReload(this.getSearchData());
    },

    showMsg: function (data, msg, callback) {
        if (data.status == 200) {
            if (msg) {
                $.alert(msg);
            }
            callback()
        } else {
            $.alert('网络异常，请与管理员联系！');
        }
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleSearch();
        this.handleClear();
        this.handleAdd();
        this.handleEdit();
        this.handleDelete();
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

    handleAdd: function () {
        $('#add').on('click', function () {
            $.dialog({
                title: '新增',
                parent: window.parent,
                content: 'url:message-tag-add.html',
                width: 500,
                height: 100,
                data: {
                    m: module.data.m,
                    callback: function (win, data) {
                        module.service.showMsg(data, "新增成功", function () {
                            module.service.reloadGrid();
                            win.api.close();
                        });
                    }
                }
            });
        })
    },

    handleEdit: function () {
        $('#grid').on('click', '.edit', function () {
            var id = $(this).parents('tr').attr('id');
            var editData = $('.table-panel').getGridInstance().getDataById(id);

            $.dialog({
                title: '编辑',
                parent: window.parent,
                content: 'url:message-tag-add.html',
                width: 500,
                height: 100,
                data: {
                    m: module.data.m,
                    editData: {
                        id: editData.id,
                        name: editData.name
                    },
                    callback: function (win, data) {
                        module.service.showMsg(data, "编辑成功", function () {
                            module.service.reloadGrid();
                            win.api.close();
                        });
                    }
                }
            });
        })
    },

    handleDelete: function () {
        $('#grid').on('click', '.delete', function () {
            var id = $(this).parents('tr').attr('id');

            $.confirm('您确定要删除吗?', function () {
                var filter = [
                    {field: 'id', value: id, operator: '=', relation: ''}
                ];

                var data = {
                    m: module.data.m,
                    t: 'message_d_tag',
                    filter: JSON.stringify([filter])
                };

                YT.delete({
                    data: data,
                    successCallback: function (data) {
                        module.service.showMsg(data, "删除成功", function () {
                            module.service.reloadGrid();
                        });
                    }
                });
            });
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});