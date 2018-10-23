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
    },

    initDom: function () {
        MessageComm.page.init('.wrapper', 2, '/module/web/message/doc/doc-share.html', 0, 1);
        MessageComm.page.initPageWrapStatus();

        // 使之后请求都是同一个会话
        $.ajax(YT.server + '/uploadFile.action?rnd=' + Math.random() + '&tkt=' + YT.getTicket());
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
                {text: 'PDF', value: 1}
            ]
        });
    },

    validateData: function () {
        var flag = true;
        if (!common.upload.data.length) {
            $.alert('请上传附件！');
            flag = false;
        }
        if ($(document).find('.error').length) {
            flag = false;
        }
        return flag;
    },

    getPostData: function () {
        var saveData = [], attachData = common.upload.data, desc = '(无主题)', pageCount = 1, picurl = '';

        if (attachData.length) {
            var attachObj = attachData[0], attachParams = attachObj.params;
            desc = $.trim($('#title').val()) || attachObj.uploadFileName;
            picurl = attachParams.cover;
            pageCount = attachParams.pageCount;
        }

        saveData.push({
            title: desc,
            titleText: desc,
            picurl: picurl,
            pageCount: pageCount,
            coverPicAttach: JSON.stringify([]),
            contentAttach: JSON.stringify(attachData)
        });

        return saveData[0];
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleUploadBtn();
    },

    handleUploadBtn: function () {
        $('#upload').click(function () {
            $('.error').remove();
            common.upload.upload({
                uploadCount: 1
            });
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});