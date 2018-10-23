var module = {};

module.data = {
    m: 101000000,
    messageData: {},
    personIds: [],
    personNames: [],
    personCounts: [],
    // 页面标签
    labelNames: [],
    createTime: function () {
        return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }));
    },
    title: '' // 页面标题
};

module.service = {
    initControls: function () {
        this.initDom();
        //this.initButtons();
        this.initCombo();
        this.initData();
    },

    initDom: function () {
        MessageComm.page.init('.wrapper', 5, '/module/web/message/h5/h5-share.html', 1, 1);
        MessageComm.page.initPageWrapStatus();
    },

    initButtons: function () {
        api.setButtons([
            {
                name: '保存',
                callback: function () {
                    MessageComm.page.ajaxData_dialog();
                    return false;
                }
            },
            {
                className: 'btn-gray',
                name: '取消'
            }
        ])
    },

    initCombo: function () {
        $("#typeCombo").combo({
            //Combo显示的值
            text: "text",
            //Combo选中的值
            value: "value",
            //设置Combo宽度
            width: 150,
            //初始化Combo所需数据
            data: [
                {text: '兔展', value: 'rabbitpre'}
            ]
        });
    },

    initData: function () {
        MessageComm.page.initData(function (data) {
            // 加载html
            var third_params = JSON.parse(data.third_params);
            $("#typeCombo").getCombo().selectByValue(third_params.type);
            $('#kw').val(third_params.url);
            MessageComm.page.removePageWrapStatus();
            $('iframe[name="page-view"]').attr({'src': data.description});
        });
    },

    validateData: function () {
        var flag = true, $kw = $('#kw'), kw_val = $.trim($kw.val());

        if ('' == kw_val) {
            $kw.addClass('error');
            flag = false;
        } else {
            var pageData = frames["page-view"].pageData;
            if ($.isEmptyObject(pageData)) {
                $kw.addClass('error');
                //$kw.parents('.ctn-wrap').append('<span class="error" style="color: darkred;border: 0;">地址格式不正确!</span>');
                flag = false;
            } else {
                var reg = new RegExp(pageData.app_url.match(/.com\/.*$/) + '$', 'g');
                if (!reg.test(kw_val)) {
                    $kw.addClass('error');
                    flag = false;
                }
            }
        }

        return flag;
    },

    getPostData: function () {
        var saveData = [], pageData = frames["page-view"].pageData, desc = '(无主题)', pageCount = 1, third_params = {};

        if (!$.isEmptyObject(pageData)) {
            desc = $.trim($('#title').val()) || pageData.name; // name：网页title desc：内容描述
            pageCount = pageData.pages.length || 1; // 兔展一视pages=[]
            third_params = JSON.stringify(pageData.third_params);
        }

        saveData.push({
            title: desc,
            titleText: desc,
            third_params: third_params,
            description: $('iframe[name="page-view"]').attr('src'), // H5链接地址
            pageCount: pageCount,
            msgType: 5
        });

        return saveData[0];
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleInputContent();
    },

    handleInputContent: function () {
        $('#kw').focus(function () {
            $(this).removeClass('error');
        }).blur(function () {
            var url_type = $("#typeCombo").getCombo().getValue(), kw_val = $.trim($('#kw').val()), url_val = '';

            if (kw_val) {
                url_val += kw_val/*kw_val.replace(/^(http|https):\/\//, '')*/;

                switch (url_type) {
                    case 'rabbitpre':
                        var index = url_val.indexOf('#') != -1 ? url_val.indexOf('#') : url_val.length;
                        var _index = url_val.indexOf('?') != -1 ? url_val.indexOf('?') : url_val.length;

                        if (index > _index) {
                            index = _index;
                        }

                        url_val = url_val.substring(0, index);
                        break;
                }

                var pageData = frames["page-view"].pageData;
                if (!$.isEmptyObject(pageData)) {
                    var reg = new RegExp(pageData.app_url.match(/.com\/.*$/) + '$', 'g');
                    if (!reg.test(kw_val)) {
                        $(this).addClass('error');
                    }
                }
            }

            // 'http://a2.rabbitpre.com/m/iU7RB3U?mobile=1'

            $(this).val(url_val);
        });

        $('#btn-su').click(function () {
            var url_type = $("#typeCombo").getCombo().getValue(), $kw = $('#kw'), kw_val = $.trim($kw.val()), d = '';

            // 重置标题和页面标签数据
            module.data.title = '';
            module.data.labelNames = [];
            $kw.removeClass('error');
            if (kw_val) {
                $.get("/message/h5/view.action?type=" + url_type + '&d=' + kw_val + "&t=" + module.data.createTime(), function (data) {
                    if (200 == data.status) {
                        MessageComm.page.removePageWrapStatus();
                        $('iframe[name="page-view"]').attr({'src': data.object});
                    } else {
                        // 重置frame及相关数据
                        $('iframe[name="page-view"]').removeAttr('src');
                        frames["page-view"].pageData = {};
                        $kw.addClass('error');
                    }
                });
            } else {
                $kw.addClass('error');
            }
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});
