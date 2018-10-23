//获取实例对象
var api = frameElement.api;
//获取传递的参数值
var apiData = api.data;
//获取传递的参数的函数
var callback = apiData.callback;

var module = {};

module.data = {};

module.service = {
    initControls: function () {
        this.initDom();
        this.initButtons();
    },

    initDom: function () {
        $("#manage-form").validate({
            messages: {
                //此处,input为需要验证的文本框的name,required、maxlength
                tagName: {
                    required: "该字段必填!",
                    maxlength: "长度不能小于10个字符串!"
                }
            },
            showOk: true
        });

        var editData = apiData.editData;
        if (editData) {
            $("#tagName").val(editData.name);
        }
    },

    initButtons: function () {
        var self = this;
        api.setButtons([
            {
                name: '保存',
                callback: function () {
                    self.ajaxData(function (data) {
                        callback(window, data);
                    });

                    return false;
                }
            },
            {
                className: 'btn-gray',
                name: '取消'
            }
        ]);
    },

    /**
     * 验证标签名称重复
     *
     * @param data      模块、表
     * @param filterObj 条件：关系是=
     * @param editData  条件：关系是<>
     * @param callback
     */
    validate: function (data, filterObj, editData, callback) {
        var filter = [];

        for (var key in filterObj) {
            filter.push({field: key, value: filterObj[key], operator: '=', relation: 'and'});
        }

        // 剔除自己
        if (editData) {
            filter.push({field: 'id', value: editData.id, operator: '<>', relation: 'and'});
        }

        data.filter = JSON.stringify(filter);

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    if (data.object.length == 1) {
                        $.alert("标签名称已存在！");
                        return false;
                    } else {
                        callback();
                    }
                } else {
                    $.alert('网络异常，请与管理员联系！');
                }
            }
        });
    },

    ajaxData: function (callback) {
        if ($("#manage-form").validForm()) {
            var tagName = $.trim($("#tagName").val()),
                editData = apiData.editData;

            var v = {
                data: {
                    name: tagName,
                    corpid: YT.getCorpId()
                }
            };

            var data = {
                m: apiData.m,
                t: 'message_d_tag'
            };

            // 验证标签名称重复
            this.validate(data, v.data, editData, function () {
                if (editData) {
                    // insert filter：更新条件（必须）
                    v.filter = [
                        {field: 'id', value: editData.id, operator: '=', relation: ''}
                    ];
                    data.v = JSON.stringify([v]);
                    YT.update({
                        data: data,
                        successCallback: function (data) {
                            callback(data);
                        }
                    });
                } else {
                    // insert t：表名（必须）
                    v.t = 'message_d_tag';
                    data.v = JSON.stringify([v]);
                    YT.insert({
                        data: data,
                        successCallback: function (data) {
                            callback(data);
                        }
                    });
                }
            });
        }
    }
};

module.eventHandler = {
    handleEvents: function () {

    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});