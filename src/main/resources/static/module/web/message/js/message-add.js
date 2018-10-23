$(function () {
    editManager.service.initControls();
    editManager.eventHandler.handleEvents();
});

var apiData = apiData || {};
apiData.data = apiData.data || {};
var editManager = editManager || {};
editManager.data = {
    personIds: [],
    personNames: [],
    personCounts: [],
    // 标签
    tagIds: [],
    tagNames: [],
    ue: {},
    m: 101000000
};
editManager.service = {
    initControls: function () {
        $("#title").editor();
        window.UEDITOR_HOME_URL = "/module/web/ueditor/";
        window.UEDITOR_CONFIG = $.extend(window.UEDITOR_CONFIG, {
            initialContent: "",
            emotionLocalization: true,
            autoHeightEnabled: true,
            initialFrameWidth: 1000,
            initialFrameHeight: 500,
            /*scaleEnabled:true,
             minFrameWidth:1000,
             minFrameHeight:250,*/
            elementPathEnabled: false,
            topOffset: 55
        });
        editManager.data.ue = UE.getEditor('editor');
    },
    validateData: function () {
        var titleFlag = $('#title').getEditor().hasContents();
        if (!titleFlag) {
            $.alert('请填写标题');
        }
        return titleFlag;
    },
    getBaseData: function () {
        var saveData = {
            title: editManager.service.replaceEMToI($("#title").getEditor().getContent()),
            titleText: $("#title").getEditor().getContentTxt(),
            coverPicAttach: uploaderTool.upload.getDataJsonStr('fileList_cover'),
            contentAttach: uploaderTool.upload.getDataJsonStr('fileList')
        };

        var coverData = uploaderTool.upload.getData('fileList_cover');
        var coverPicUrl = "";
        if (coverData != null && coverData !== undefined && coverData.length == 1) {
            coverPicUrl = YT.server + '/module/web/upload/' + (coverData[0].savedFileName.replace("\\", "/"));

        }
        saveData.picurl = coverPicUrl;

        if (UE.getEditor('editor').hasContents()) {
            var text = UE.getEditor('editor').getContentTxt();
            var html = UE.getEditor('editor').getContent();
            if (text == '' && html == '') {
                saveData.description = '';
                saveData.descriptionText = '';
            } else {
                saveData.description = editManager.service.replaceEMToI(UE.getEditor('editor').getContent());
                saveData.descriptionText = text;
            }
        }
        return saveData;
    },
    pushMsg: function (ids) {
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
            article.picurl = messageData.picurl;
        }
        var tkt = YT.getTicket();
        for (var i = 0; i < editManager.data.personIds.length; i++) {
            if (tkt == null || tkt === undefined) {
                tkt = "";
            }
            article.url = url + "?tkt=" + tkt + "&u=" + editManager.data.personIds[i] + "&d=" + ids[i] + "&s=0&t=0";
            pushMsgTool.sendMessage(
                {
                    config: {
                        toType: {
                            type: [1],
                            touser: editManager.data.personCounts[i]
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
        editManager.eventHandler.handleDialog('已推送！', function () {
            location.href = YT.server + '/module/web/message/message-list.html?' + location.href.split('?')[1];
        });
    },
    displayStaffs: function () {
        var html = '';
        $('#staffs').empty();
        if (editManager.data.personIds.length > 0) {
            for (var i = 0; i < editManager.data.personNames.length - 1; i++) {
                html += '<span>' + editManager.data.personNames[i] + '，</span>';
            }
            html += '<span>' + editManager.data.personNames[editManager.data.personNames.length - 1] + '</span>';
            $('#staffs').append(html);
        }
    },
    replaceEMToI: function (str) {
        var reg1 = new RegExp("<em>", "g");
        var reg2 = new RegExp("</em>", "g");
        var reg3 = new RegExp("<strong>", "g");
        var reg4 = new RegExp("</strong>", "g");
        str = str.replace(reg1, "<i>");
        str = str.replace(reg2, "</i>");
        str = str.replace(reg3, "<b>");
        str = str.replace(reg4, "</b>");
        return str;
    },
    replaceIToEM: function (str) {
        var reg1 = new RegExp("<i>", "g");
        var reg2 = new RegExp("</i>", "g");
        var reg3 = new RegExp("<b>", "g");
        var reg4 = new RegExp("</b>", "g");
        str = str.replace(reg1, "<em>");
        str = str.replace(reg2, "</em>");
        str = str.replace(reg3, "<strong>");
        str = str.replace(reg4, "</strong>");
        return str;
    },

    displayTags: function () {
        var html = '';
        $('#tags').empty();
        if (editManager.data.tagIds.length > 0) {
            for (var i = 0; i < editManager.data.tagNames.length - 1; i++) {
                html += '<span>' + editManager.data.tagNames[i] + '，</span>';
            }
            html += '<span>' + editManager.data.tagNames[editManager.data.tagNames.length - 1] + '</span>';
            $('#tags').append(html);
        }
    }
};

editManager.eventHandler = {
    handleEvents: function () {
        this.handleUpload();
        this.handleSave();
        this.handleView();
        this.handlePush();
        this.handleSelectStaff();
        this.handleSelectTag();
    },
    handleSave: function () {
        $('#save').click(function () {
            editManager.eventHandler.handleInsertAndUpdate(false,
                function (data) {
                    editManager.eventHandler.handleDialog('保存成功！', function () {
                        location.href = YT.server + '/module/web/message/message-list.html?' + location.href.split('?')[1];
                    });
                },
                function (data) {
                    editManager.eventHandler.handleDialog('保存成功！', function () {
                        location.href = YT.server + '/module/web/message/message-list.html?' + location.href.split('?')[1];
                    });
                }
            );
        });
    },
    handleView: function () {
        $('#view').click(function () {
            $.dialog({
                //跨框架弹出对话框
                title: '预览消息',
                parent: window.parent,
                content: 'url:message-view.html',
                width: 800,
                height: 500,
                //传递给子对话框参数,
                data: {
                    data: editManager.service.getBaseData(),
                    callback: function (win) {
                        win.api.close();
                    }
                }
            });
        });
    },
    handlePush: function () {
        $('#push').click(function () {
            if (editManager.data.personIds.length <= 0) {
                $.alert('请选择推送范围！');
            } else {
                $.confirm('您确定要推送吗？', function () {
                    editManager.eventHandler.handleInsertAndUpdate(true,
                        function (data) {
                            editManager.eventHandler.handleInsertPush();
                        },
                        function (data) {
                            editManager.eventHandler.handleInsertPush();
                        }
                    );
                });
            }
        });
    },
    handleSelectStaff: function () {
        $('#select').click(function () {
            $.dialog({
                //跨框架弹出对话框
                title: '选择人员',
                parent: window.parent,
                content: 'url:select-staff-two.html',
                width: 600,
                height: 450,
                //传递给子对话框参数,
                data: {
                    data: {
                        personIds: editManager.data.personIds,
                        personNames: editManager.data.personNames,
                        personCounts: editManager.data.personCounts
                    },
                    callback: function (win, staffs) {
                        editManager.data.personIds = staffs.personIds;
                        editManager.data.personNames = staffs.personNames;
                        editManager.data.personCounts = staffs.personCounts;
                        editManager.service.displayStaffs();
                        win.api.close();
                    }
                }
            });
        });
    },
    handleInsertAndUpdate: function (hasPush, insertCallback, updateCallback) {
        if (!editManager.service.validateData()) {
            return false;
        }
        var userInfo = JSON.parse($.cookie('userInfo'));
        var saveData = editManager.service.getBaseData();
        var postData = {};
        if (!$.isEmptyObject(apiData.data)) {
            var filter = [
                {field: 'id', value: apiData.data.id, operator: '=', relation: 'AND'}
            ];
            postData = {
                m: editManager.data.m,
                t: 'message',
                v: JSON.stringify([{
                    t: 'message',
                    data: saveData,
                    filter: filter
                }])
            };
            YT.update({
                data: postData,
                successCallback: function (data) {
                    if (data.status == 200) {
                        updateCallback();
                    } else {
                        $.alert('保存失败!');
                    }
                }
            });

        } else {
            saveData.corp_id = userInfo.corp_id;
            saveData.suite_id = userInfo.suite_id;
            saveData.app_id = userInfo.app_id;
            saveData.corpid = userInfo.corpid;
            saveData.type = 1;
            saveData.url = YT.server + "/module/web/message/message-share.html";
            saveData.btntxt = "阅读全文";
            saveData.createUserId = userInfo.userId;
            saveData.createTime = new Date().Format('yyyy-MM-dd hh:mm:ss');

            if(hasPush){
                // 插入消息与标签关系
                var slave = [], tagIds = editManager.data.tagIds;

                for (var i in tagIds) {
                    slave.push({
                        t: 'message_tag_relation',
                        data: {tag_id: tagIds[i]},
                        key: 'message_id'
                    });
                }

                postData = {
                    m: editManager.data.m,
                    t: 'message',
                    v: JSON.stringify([{
                        t: 'message',
                        data: saveData,
                        ai: true,
                        slave: slave
                    }])
                };
                YT.insert({
                    data: postData,
                    successCallback: function (data) {
                        if (data.status == 200) {
                            saveData.id = data.object.ids[0];
                            apiData.data = saveData;
                            insertCallback(data);
                        } else {
                            $.alert('保存失败!');
                        }
                    }
                });
            } else {
                $.dialog({
                    //跨框架弹出对话框
                    title: '选择组',
                    parent: window.parent,
                    relative: false,
                    content: 'url:/module/web/message/select-groups.html',
                    width: 600,
                    height: 450,
                    //传递给子对话框参数,
                    data: {
                        callback: function (win, group_ids) {
                            win.api.close();

                            // 插入消息与标签关系
                            var slave = [], tagIds = editManager.data.tagIds;

                            for (var i in tagIds) {
                                slave.push({
                                    t: 'message_tag_relation',
                                    data: {tag_id: tagIds[i]},
                                    key: 'message_id'
                                });
                            }

                            for (var i in group_ids) {
                                slave.push({
                                    t: 'groups_message_relation',
                                    data: {group_id: group_ids[i]},
                                    key: 'message_id'
                                });
                            }

                            postData = {
                                m: editManager.data.m,
                                t: 'message',
                                v: JSON.stringify([{
                                    t: 'message',
                                    data: saveData,
                                    ai: true,
                                    slave: slave
                                }])
                            };
                            YT.insert({
                                data: postData,
                                successCallback: function (data) {
                                    if (data.status == 200) {
                                        saveData.id = data.object.ids[0];
                                        apiData.data = saveData;
                                        insertCallback(data);
                                    } else {
                                        $.alert('保存失败!');
                                    }
                                }
                            });
                        }
                    }
                });
            }

        }
    },
    handleInsertPush: function () {
        var messageData = apiData.data;
        var saveDataArr = [];
        var pushTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
        for (var i = 0; i < editManager.data.personIds.length; i++) {
            saveDataArr.push({
                t: 'message_share',
                data: {
                    messageId: messageData.id,
                    staffId: editManager.data.personIds[i],
                    pushTime: pushTime,
                    shareFlag: 0,
                    openCount: 0
                },
                ai: true
            });
        }
        var postData = {
            m: editManager.data.m,
            t: 'message_share',
            v: JSON.stringify(saveDataArr),
            params: JSON.stringify({message_id: messageData.id, staff_ids: editManager.data.personIds.join(',')})
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
                    editManager.service.pushMsg(ids);
                } else {
                    $.alert('推送失败！');
                }
            }
        });
    },
    handleDialog: function (str, callback) {
        $.dialog({
            title: '提示',
            width: 350,
            height: 100,
            content: '<table class="alert"><tbody><tr><td class="alert-icon"><i class="iconfont"></i></td><td class="alert-content">' + str + '</td></tr></tbody></table>',
            buttons: [
                {
                    name: '前往列表页',
                    className: 'btn-lightBlue',
                    callback: function () {
                        callback();
                        //返回false 可以阻止对话框关闭
                        return false;
                    }
                },
                {
                    name: '留在当前页'
                }
            ]
        });
    },
    handleUpload: function () {
        $('#upload').click(function () {
            uploaderTool.upload.upload("fileList");
        });
        $('#upload_cover').click(function () {
            uploaderTool.upload.upload("fileList_cover");
        });
    },

    handleSelectTag: function () {
        $('#tagSelect').click(function () {
            $.dialog({
                //跨框架弹出对话框
                title: '选择标签',
                parent: window.parent,
                content: 'url:select-tag.html',
                width: 600,
                height: 450,
                //传递给子对话框参数,
                data: {
                    data: {
                        tagIds: editManager.data.tagIds,
                        tagNames: editManager.data.tagNames
                    },
                    callback: function (win, tags) {
                        editManager.data.tagIds = tags.tagIds;
                        editManager.data.tagNames = tags.tagNames;
                        editManager.service.displayTags();
                        win.api.close();
                    }
                }
            });
        });
    }
};
