var module = {};

module.data = {
    m: 101000000,
    messageData: {},
    personIds: [],
    personNames: [],
    personCounts: [],
    // 页面标签
    labelNames: [],
    title: '' // 页面标题
};

module.service = {
    initControls: function () {
        this.initDom();
        this.initCombo();
        //this.initButtons();
        this.initData();
    },

    initDom: function () {
        MessageComm.page.init('.wrapper', 6, '/module/web/message/graphic/graphic-share.html', 0, 1);
        MessageComm.page.initPageWrapStatus();
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
                {text: '创客贴', value: 'chuangkit'}
            ]
        });
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

    initData: function () {
        MessageComm.page.initData(function (data) {
            // 加载html
            var third_params = JSON.parse(data.third_params);
            $("#typeCombo").getCombo().selectByValue(third_params.type);
            $('#kw').val(third_params.url);
            MessageComm.page.removePageWrapStatus();
            PageSwiperComm.init('#page-view', third_params, 0);
        });
    },

    validateData: function () {
        var flag = true, $kw = $('#kw'), kw_val = $.trim($kw.val());

        if ('' == kw_val) {
            $kw.addClass('error');
            flag = false;
        } else {
            var pageData = window.pageData;
            if ($.isEmptyObject(pageData)) {
                $kw.addClass('error');
                //$kw.parents('.ctn-wrap').append('<span class="error" style="color: darkred;border: 0;">地址格式不正确!</span>');
                flag = false;
            } else {
                if (kw_val !== pageData.third_params.url) {
                    $kw.addClass('error');
                    flag = false;
                }
            }
        }

        return flag;
    },

    getPostData: function () {
        var saveData = [], pageData = window.pageData, desc = '(无主题)', pageCount = 1, third_params = {};

        if (!$.isEmptyObject(pageData)) {
            desc = $.trim($('#title').val()) || pageData.title;
            pageCount = pageData.pageCount;
            third_params = JSON.stringify(pageData.third_params);
        }

        saveData.push({
            title: desc,
            titleText: desc,
            third_params: third_params,
            pageCount: pageCount,
            msgType: 6
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

                }

                var pageData = window.pageData;
                if (!$.isEmptyObject(window.pageData)) {
                    if (url_val !== pageData.third_params.url) {
                        $(this).addClass('error');
                    }
                }
            }

            // 'https://www.chuangkit.com/sharedesign?d=87d642cf-7a87-4a9d-a8fd-2d9b55e46ff6'

            $(this).val(url_val);
        });

        $('#btn-su').click(function () {
            var url_type = $("#typeCombo").getCombo().getValue(), $kw = $('#kw'), kw_val = $.trim($kw.val()), d = '';

            // 重置标题和页面标签数据
            module.data.title = '';
            module.data.labelNames = [];
            $kw.removeClass('error');
            if (kw_val) {
                switch (url_type) {
                    case 'chuangkit':
                        d = MessageComm.getSrcString(kw_val, 'd');
                        break;
                }

                if (d) {
                    MessageComm.page.removePageWrapStatus();
                    PageSwiperComm.init('#page-view', {d: d, type: url_type, url: kw_val}, 0);
                } else {
                    $kw.addClass('error');
                }
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
