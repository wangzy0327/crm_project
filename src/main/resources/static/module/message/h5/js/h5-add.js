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
        this.initCombo();
    },

    initDom: function () {
        YT.getUserInfo(function (data) {
            module.data.userInfo = data;
            MessageCommMobile.page.init(5, '/module/web/message/h5/h5-share.html', 1);
            MessageCommMobile.page.initPageWrapStatus();
        });
    },

    initCombo: function () {
        $("#typeCombo").picker({
            title: "请选择您的H5网站",
            cols: [
                {
                    textAlign: 'center',
                    values: ['兔展']
                }
            ]
        });
    },

    validateData: function () {
        var flag = true, $kw = $('#kw'), $cell_border = $('.cell-border'), kw_val = $.trim($kw.val());

        if ('' == kw_val) {
            $cell_border.addClass('error');
            flag = false;
        } else {
            var pageData = frames["page-view"].pageData;
            if ($.isEmptyObject(pageData)) {
                $cell_border.addClass('error');
                //$cell_border.parents('.ctn-wrap').append('<span class="error" style="color: darkred;border: 0;">地址格式不正确!</span>');
                flag = false;
            } else {
                var reg = new RegExp(pageData.app_url.match(/.com\/.*$/) + '$', 'g');
                if (!reg.test(kw_val)) {
                    $cell_border.addClass('error');
                    flag = false;
                }
            }

            // 赋值group_ids
            var groupid = YT.getUrlParam('groupid') || '';
            if (groupid === '') {
                flag = false;
            } else {
                module.data.group_ids = [groupid];
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
            picurl: '',
            third_params: third_params,
            description: $('iframe[name="page-view"]').attr('src'), // H5链接地址
            pageCount: pageCount,
            coverPicAttach: JSON.stringify([]),
            contentAttach: JSON.stringify([])
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
            $('.cell-border').removeClass('error');
        }).blur(function () {
            var url_type = $("#typeCombo").data('type'), kw_val = $.trim($('#kw').val()), url_val = '';

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
                        $('.cell-border').addClass('error');
                    }
                }
            }

            // 'http://a2.rabbitpre.com/m/iU7RB3U?mobile=1'

            $(this).val(url_val);
        });

        $('#btn-su').click(function () {
            var url_type = $("#typeCombo").data('type'), $kw = $('#kw'), $cell_border = $('.cell-border'),
                kw_val = $.trim($kw.val()), d = '';

            // 重置标题和页面标签数据
            module.data.title = '';
            module.data.labelNames = [];
            $cell_border.removeClass('error');
            if (kw_val) {
                $.get("/message/h5/view.action?type=" + url_type + '&d=' + kw_val + "&t=" + module.data.createTime(), function (data) {
                    if (200 == data.status) {
                        MessageCommMobile.page.removePageWrapStatus();
                        $('iframe[name="page-view"]').attr({'src': data.object});
                    } else {
                        // 重置frame及相关数据
                        $('iframe[name="page-view"]').removeAttr('src');
                        frames["page-view"].pageData = {};
                        $cell_border.addClass('error');
                    }
                });
            } else {
                $cell_border.addClass('error');
            }
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});

