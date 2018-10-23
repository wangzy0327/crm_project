var listManager = {};

listManager.data = {
    m: 101000000
};

$(function () {
    listManager.service.initControls();
    listManager.eventHandler.handleEvents();
});


listManager.service = {

    initControls: function () {
        // 导航
        /*page.service.initBreadCrumb();*/
        this.initGrid();
    },
    cutStr: function (str, length) {
        if (str != null && str !== undefined) {
            if (str.length <= length) {
                return str;
            } else {
                return str.substr(0, length) + "...";
            }
        } else {
            return "";
        }
    },
    // 初始化列表
    initGrid: function () {
        $('#grid').YTGrid({
            params: this.getSearchData(),
            height: page.service.getGridHeight() + 36,
            pager: true,
            colModel: [
                /*{name: '编号', index: 'id', width: 5, align: 'center'},*/
                {
                    name: '标题', index: 'titleText', width: 25, align: 'center', formatter: function (val, row) {
                    return listManager.service.cutStr(val, 15);
                }
                },
                {
                    name: '分享点击数',
                    index: 'descriptionText',
                    width: 50,
                    align: 'center',
                    formatter: function (val, row) {
                        /*if (val != null && val !== undefined) {
                         return listManager.service.cutStr(val, 30);
                         } else {
                         return "";
                         }*/
                        return row.shareInfo;
                    }
                },
                {
                    name: '类型', index: 'msgType', width: 10, align: 'center', formatter: function (val, row) {
                    if (val != null && val !== undefined) {
                        if ('' + val == '1') {
                            return "文章";
                        }
                        if ('' + val == '2') {
                            return "资料";
                        }
                        if ('' + val == '3') {
                            return "图片</br>(替换二维码)";
                        }
                        if ('' + val == '4') {
                            return "图片</br>(不替换二维码)";
                        }
                        if ('' + val == '5') {
                            return "H5";
                        }
                        if ('' + val == '6') {
                            return "平面";
                        }
                    } else {
                        return "";
                    }
                }
                },
                {name: '创建人', index: 'createUser', width: 8, align: 'center'},
                {
                    name: '创建时间', index: 'createTime', width: 10, align: 'center', formatter: function (val, row) {
                    return new Date(val).Format("yyyy-MM-dd</br>hh:mm:ss");
                }
                },
                {
                    name: '启用/停用', index: 'status', width: 8, align: 'center', formatter: function (val, row) {
                    return val ? '<a class="btn-stop href_derection" data-id="' + row.id + '" title="停用"><i class="iconfont" style="font-size: 30px;color: #4ab6d8;">&#xe643;</i></a>'
                        : '<a class="btn-start href_derection" data-id="' + row.id + '" title="启用"><i class="iconfont" style="font-size: 30px;color: #888">&#xe644;</i></a>';
                }
                },
                {

                    name: '操作', index: 'operate', width: 12, align: 'center', formatter: function (val, row) {
                    var html = '';

                    if (row.status) {
                        if (1 == row.msgType) {
                            html += '<a class="detail href_derection" data-id=' + row.id + ' title="查看"><i class="iconfont" style="color:#4ab6d8">&#xe631;</i></a>&nbsp;';
                        }

                        html += '<a class="push href_derection" data-id=' + row.id + ' title="推送"><i class="iconfont" style="color:#4ab6d8">&#xe6fc;</i></a>' +
                            '&nbsp;<a class="edit href_derection" data-id=' + row.id + ' title="编辑"><i class="iconfont" style="color:#4ab6d8">&#xe606;</i></a>' +
                            '&nbsp;<a class="delete href_derection" data-id=' + row.id + ' title="删除" style="color: #ff0000"><i class="iconfont">&#xe601;</i></a>'
                    }

                    return html;

                }
                }
            ],
            jsonReader: {
                id: 'id'
            },
            treeGrid: false
        });

    },
    getDefaultFilter: function () {
        return [
            {field: 'corpid', value: '' + YT.getCorpId(), operator: '=', relation: 'AND'},
            {field: 'app_id', value: '' + appAgent.apps.sales_ass_id, operator: '=', relation: 'AND'},
            {field: 'delFlag', value: 0, operator: '=', relation: 'AND'}
        ];
    },
    getSearchData: function (newFilter) {
        var filter = listManager.service.getDefaultFilter();

        if (newFilter != null && newFilter !== undefined) {
            filter = newFilter;
        }

        return {
            m: listManager.data.m,
            t: 'v_message',
            filter: JSON.stringify(filter),
            order: " createTime desc "
        };
    },
    reloadGrid: function (newFilter) {
        $('#grid').YTGridReload(this.getSearchData(newFilter));
    }
};

listManager.eventHandler = {
    handleEvents: function () {
        this.handleShareLog();
        this.handleAdd();
        this.handleEdit();
        this.handleDelete();
        this.handleDetail();
        this.handlePush();
        this.handleSearch();
        this.handleClear();
        this.handleStartBtn();
        this.handleStopBtn();
    },
    handleShareLog: function () {
        $('#grid').on('click', '.share-log', function () {
            location.href = 'message-sta-detail.html?mId=' + $(this).data('id');
        });
    },
    handlePush: function () {
        $('#grid').on('click', '.push', function () {
            var dataId = $(this).data('id');
            $.dialog({
                //跨框架弹出对话框
                title: '选择人员',
                parent: window.parent,
                content: 'url:select-staff.html',
                width: 600,
                height: 450,
                //传递给子对话框参数,
                data: {
                    data: $('#grid').getGridInstance().getDataById(dataId),
                    callback: function (win, staffIds) {
                        win.api.close();
                    }
                }
            });
        });
    },
    handleAdd: function () {
        $("#add").click(function () {
            $.dialog({
                //跨框架弹出对话框
                title: '新增消息',
                parent: window.parent,
                content: 'url:message-edit.html',
                width: 1100,
                height: 500,
                //传递给子对话框参数,
                data: {
                    callback: function (win) {
                        listManager.service.reloadGrid();
                        win.api.close();
                    }
                }
            });
        });
    },
    handleEdit: function () {
        $('#grid').on('click', '.edit', function () {
            var dataId = $(this).data('id'),
                data = $('#grid').getGridInstance().getDataById(dataId),
                msgType = +data.msgType,
                url = '';

            // 1文章 2资料 3图片 4没有二维码图片 5H5 6平面
            switch (msgType) {
                case 1:
                    //url = 'url:message-edit.html';
                    url = 'message-edit.html';
                    break;
                case 2:
                    //url = 'url:doc/doc-edit.html';
                    url = 'doc/doc-edit.html';
                    break;
                case 3:
                case 4:
                    //url = 'url:../pic-qrcode/pic-add.html';
                    url = '../pic-qrcode/pic-add.html';
                    break;
                case 5:
                    //url = 'url:h5/h5-edit.html';
                    url = 'h5/h5-edit.html';
                    break;
                case 6:
                    //url = 'url:graphic/graphic-edit.html';
                    url = 'graphic/graphic-edit.html';
                    break;
            }

            location.href = url + '?id=' + dataId;

            /*$.dialog({
             //跨框架弹出对话框
             title: '编辑消息',
             parent: window.parent,
             content: url,
             width: 1100,
             height: 500,
             //传递给子对话框参数,
             data: {
             dialog: true,
             data: data,
             callback: function (win) {
             listManager.service.reloadGrid();
             win.api.close();
             }
             }
             });*/
        });
    },

    handleDelete: function () {
        $('#grid').on('click', '.delete', function () {
            var dataId = $(this).data('id');
            $.confirm("您确定要删除该消息？", function () {
                var filter = [
                    {field: 'id', value: dataId, operator: '=', relation: ''}
                ];
                var postData = {
                    m: listManager.data.m,
                    t: 'message',
                    v: JSON.stringify([{
                        t: 'message',
                        data: {delFlag: 1},
                        filter: filter
                    }])
                };
                YT.update({
                    data: postData,
                    successCallback: function (data) {
                        if (data.status == 200) {
                            $.alert('删除成功!', function () {
                                listManager.service.reloadGrid();
                            });
                        } else {
                            $.alert(data.message);
                        }
                    }
                });
            });
        });
    },
    handleDetail: function () {
        $('#grid').on('click', '.detail', function () {
            var dataId = $(this).data('id'),
                data = $('#grid').getGridInstance().getDataById(dataId),
                msgType = +data.msgType,
                url = '';

            // 1文章 2资料 3图片 4没有二维码图片 5H5
            switch (msgType) {
                case 1:
                case 3:
                case 4:
                case 5:
                    url = 'url:message-view.html';
                    break;
                case 2:
                    url = 'url:doc/doc-preview.html';
                    break;
            }

            $.dialog({
                //跨框架弹出对话框
                title: '预览消息',
                parent: window.parent,
                content: url,
                width: 800,
                height: 500,
                //传递给子对话框参数,
                data: {
                    data: data,
                    callback: function (win) {
                        win.api.close();
                    }
                }
            });
        });
    },
    handleSearch: function () {
        $("#search").click(function () {

            var filter = listManager.service.getDefaultFilter();

            var keyword = $("#keyword").val() == $("#keyword")[0].defaultValue ? '' : $("#keyword").val();
            var beginDate = $("#beginDate").val();
            var endDate = $("#endDate").val();

            if (keyword != '') {
                filter.push([
                    {field: 'title', value: "%" + keyword + "%", operator: 'like', relation: 'OR'},
                    {field: 'createUser', value: "%" + keyword + "%", operator: 'like', relation: 'AND'}
                ]);
            }

            if (beginDate != '') {
                filter.push({field: 'createTime', value: beginDate + " 00:00:00", operator: '>=', relation: 'AND'})
            }

            if (endDate != '') {
                filter.push({field: 'createTime', value: endDate + " 23:59:59", operator: '<=', relation: 'AND'})
            }

            listManager.service.reloadGrid(filter);
        });
    },

    handleClear: function () {
        $("#clear").click(function () {
            $("#keyword").val($("#keyword")[0].defaultValue);
            $("#beginDate").val("");
            $("#endDate").val("");
            listManager.service.reloadGrid();
        });
    },

    handleStartBtn: function () {
        $('#grid').on('click', '.btn-start', function () {
            var dataId = $(this).data('id');
            $.confirm("您确定要启动该消息？", function () {
                var filter = [
                    {field: 'id', value: dataId, operator: '=', relation: ''}
                ];
                var postData = {
                    m: listManager.data.m,
                    t: 'message',
                    v: JSON.stringify([{
                        t: 'message',
                        data: {status: 1},
                        filter: filter
                    }])
                };
                YT.update({
                    data: postData,
                    successCallback: function (data) {
                        if (data.status == 200) {
                            $.alert('启用成功!', function () {
                                listManager.service.reloadGrid();
                            });
                        } else {
                            $.alert(data.message);
                        }
                    }
                });
            });
        });
    },

    handleStopBtn: function () {
        $('#grid').on('click', '.btn-stop', function () {
            var dataId = $(this).data('id');
            $.confirm("您确定要停用该消息？", function () {
                var filter = [
                    {field: 'id', value: dataId, operator: '=', relation: ''}
                ];
                var postData = {
                    m: listManager.data.m,
                    t: 'message',
                    v: JSON.stringify([{
                        t: 'message',
                        data: {status: 0},
                        filter: filter
                    }])
                };
                YT.update({
                    data: postData,
                    successCallback: function (data) {
                        if (data.status == 200) {
                            $.alert('停用成功!', function () {
                                listManager.service.reloadGrid();
                            });
                        } else {
                            $.alert(data.message);
                        }
                    }
                });
            });
        });
    }
};
