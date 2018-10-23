//获取实例对象
var api = frameElement.api;
//获取传递的参数值
var apiData = api.data;
//获取传递的参数的函数
var callback = apiData.callback;

var selectManager = {};

selectManager.data = {
    m: 101000000,
    personIds: [],
    personNames: [],
    personCounts: []
};

$(function () {
    selectManager.service.initControls();
    selectManager.eventHandler.handleEvents();
});


selectManager.service = {

    initControls: function () {
        this.initButtons();
        this.initGrid();
    },
    replaceHtmlToTextarea: function (str) {
        var reg = new RegExp("</br>", "g");
        str = str.replace(reg, "\n\r");
        return str;
    },
    initButtons: function () {
        api.setButtons([
            {
                name: '推送',
                callback: function () {
                    selectManager.eventHandler.handleInsertPush();
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
                {
                    name: '姓名', index: 'name', width: 25, align: 'center'
                },
                {
                    name: '操作', index: 'operate', width: 10, align: 'center', formatter: function (val, row) {
                        return '<a class="select" data-id="' + row.id + '" data-name="' + row.name + '" data-userid="' + row.userid + '" style="font-size:12px;">选择</a>';
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
            {field: 'corpid', value: '' + $.cookie("corpid"), operator: '=', relation: 'AND'},
            {field: 'app_id', value: '' + appAgent.apps.sales_ass_id, operator: '=', relation: 'AND'}
        ];
    },
    getSearchData: function (newFilter) {
        var filter = selectManager.service.getDefaultFilter();

        if (newFilter != null && newFilter !== undefined) {
            filter = newFilter;
        }

        return {
            m: selectManager.data.m,
            t: 'staffs',
            filter: JSON.stringify(filter),
            order: " id asc "
        };
    },
    reloadGrid: function (newFilter) {
        $('#grid').YTGridReload(this.getSearchData(newFilter));
    },


    displayStaffs: function () {
        var html = '';
        $('#staffs').empty().append('<span>人员：</span>');
        if (selectManager.data.personIds.length > 0) {
            for (var i = 0; i < selectManager.data.personNames.length - 1; i++) {
                html += '<span>' + selectManager.data.personNames[i] + '<a href="#" onclick="javascript:void(0);" data-id="' +
                    selectManager.data.personIds[i] + '">[删除]</a>，</span>';
            }
            html += '<span>' + selectManager.data.personNames[selectManager.data.personNames.length - 1] + '<a href="#" onclick="javascript:void(0);" data-id="' +
                selectManager.data.personIds[selectManager.data.personNames.length - 1] + '">[删除]</a></span>';
            $('#staffs').append(html);
        }

    },
    checkstaff: function (id) {
        var flag = false;
        var ids = selectManager.data.personIds;
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
    },
    pushMsg: function (ids) {
        var win = window;
        var userInfo = JSON.parse($.cookie('userInfo'));
        var messageData = apiData.data;
        var article = {
            title: messageData.titleText,
            url: messageData.url,
            btntxt: "阅读全文"
        };
        var url = '' + article.url;
        if (messageData.description != null && messageData.description !== undefined && messageData.description != '') {
            article.description = messageData.descriptionText;
        }
        if (messageData.picurl) {
            if (2 == +messageData.msgType || +messageData.msgType == 6) {
                article.picurl = YT.server + '/module/web/upload/' + messageData.picurl;
            } else if (5 == +messageData.msgType) {
                //article.picurl = YT.server + '/image/cover-h5.png';
            } else {
                article.picurl = messageData.picurl;
            }
        }
        var tkt = YT.getTicket();
        for (var i = 0; i < selectManager.data.personIds.length; i++) {
            if (tkt == null || tkt === undefined) {
                tkt = "";
            }
            article.url = url + "?tkt=" + tkt + "&u=" + selectManager.data.personIds[i] + "&d=" + ids[i] + "&s=0&t=0";
            pushMsgTool.sendMessage(
                {
                    config: {
                        toType: {
                            type: [1],
                            touser: selectManager.data.personCounts[i]
                        },
                        msgtype: 'news',
                        safe: 0
                    },
                    content: {
                        articles: [
                            article
                        ]
                    },
                    userId: userInfo.userId,
                    appId: appAgent.apps.sales_ass_id
                },
                function (data) {
                },
                function (data) {
                });
        }
        $.alert('已推送!', function () {
            callback(win);
        });
    }
};

selectManager.eventHandler = {
    handleEvents: function () {
        this.handleSelectStaff();
        this.handleDeleteStaff();
        this.handleSearch();
        this.handleClear();
    },
    handleInsertPush: function () {
        var messageData = apiData.data;
        var saveDataArr = [];
        var pushTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
        for (var i = 0; i < selectManager.data.personIds.length; i++) {
            saveDataArr.push({
                t: 'message_share',
                data: {
                    messageId: messageData.id,
                    staffId: selectManager.data.personIds[i],
                    pushTime: pushTime,
                    shareFlag: 0,
                    openCount: 0
                },
                ai: true
            });
        }
        var postData = {
            m: selectManager.data.m,
            t: 'message_share',
            v: JSON.stringify(saveDataArr),
            params: JSON.stringify({message_id: messageData.id, staff_ids: selectManager.data.personIds.join(',')})
        };
        YT.insert({
            data: postData,
            successCallback: function (data) {
                if (data.status == 200) {
                    var ids = [];
                    if (saveDataArr.length == 1) {
                        ids.push(data.object);
                    } else {
                        ids = data.object;
                    }
                    selectManager.service.pushMsg(ids);
                } else {
                    $.alert(data.message);
                }
            }
        });
    },
    handleSelectStaff: function () {
        $('#grid').on('click', '.select', function () {
            var self = this;
            if (!selectManager.service.checkstaff($(self).data('id'))) {
                selectManager.data.personIds.push($(self).data('id'));
                selectManager.data.personNames.push($(self).data('name'));
                selectManager.data.personCounts.push($(self).data('userid'));
                selectManager.service.displayStaffs();
            }
        });
    },
    handleDeleteStaff: function () {
        $('#staffs').on('click', 'a', function () {
            var index = selectManager.service.indexOfArray(selectManager.data.personIds, $(this).data('id'));
            selectManager.data.personIds.splice(index, 1);
            selectManager.data.personNames.splice(index, 1);
            selectManager.data.personCounts.splice(index, 1);
            selectManager.service.displayStaffs();
        });
    },
    handleSearch: function () {
        $("#search").click(function () {

            var filter = selectManager.service.getDefaultFilter();

            var keyword = $("#keyword").val() == $("#keyword")[0].defaultValue ? '' : $("#keyword").val();

            if (keyword != '') {
                filter.push({field: 'name', value: "%" + keyword + "%", operator: 'like', relation: 'AND'});
            }
            selectManager.service.reloadGrid(filter);
        });
    },

    handleClear: function () {
        $("#clear").click(function () {
            $("#keyword").val($("#keyword")[0].defaultValue);
            selectManager.service.reloadGrid();
        });
    }
};
