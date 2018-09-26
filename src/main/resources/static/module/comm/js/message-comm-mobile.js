var MessageCommMobile = MessageCommMobile || {};

MessageCommMobile.page = {
    m: 101000000,

    init: function (msgType, shareUrl, hasFrame) {
        // module为全局参数
        // msgType 1文章 2资料 3图片 4没有二维码图片 5H5 6平面
        this.msgType = msgType;
        this.shareUrl = shareUrl;
        this.hasFrame = hasFrame || 0; // 是否有frame 0无 1有
        this.initBoxBtn();
        this.initLabelHtml();
        this.handleFormBtn();
        this.handleLableBtn();
        this.handlePopupLableAddBtn();
        this.handlePopupLableDelBtn();
        this.handleSaveBtn();
        this.handleResizePage();
    },

    initBoxBtn: function () {
        var html = '';

        html += '<div class="panel-fixed panel-fixed_box">';
        html += '<a class="btn-cell" href="javascript:" id="btn-form">';
        html += '<img class="btn-cell_icon" src="/image/message-form.svg" alt="表单">';
        html += '<p class="btn-cell_p">表单</p>';
        html += '</a>';
        html += '<a class="btn-cell open-popup" href="javascript:" id="btn-label">';
        html += '<img class="btn-cell_icon" src="/image/message-label.svg" alt="标签">';
        html += '<p class="btn-cell_p">标签</p>';
        html += '</a>';
        html += '</div>';

        $(document.body).append(html);
    },

    initLabelHtml: function () {
        var html = '';

        html += '<div id="label-popup" class="weui-popup__container popup-bottom">';
        html += '<div class="weui-popup__overlay"></div>';
        html += '<div class="weui-popup__modal">';

        html += '<div class="toolbar">';
        html += '<div class="toolbar-inner">';
        html += '<a href="javascript:;" class="picker-button close-popup">关闭</a>';
        html += '<h1 class="title">标签</h1>';
        html += '</div>';
        html += '</div>';

        html += '<div class="modal-content">';

        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__bd" id="label-view">';
        html += '<div class="box box-flex"></div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="weui-cells weui-cells_form">';
        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__bd">';
        html += '<input class="weui-input" type="text" placeholder="请输入标签" id="title_label" maxlength="15"/>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="weui-btn-area">';
        html += '<a class="weui-btn weui-btn_primary" href="javascript:" id="btn-su_label">确定</a>';
        html += '</div>';

        html += '</div>';

        html += '</div>';
        html += '</div>';

        $(document.body).append(html);
    },

    handleFormBtn: function () {
        $('#btn-form').click(function () {
            $('.panel-fixed_form').toggle();
        });
    },

    handleLableBtn: function () {
        $('#btn-label').click(function () {
            $('#label-popup').popup();
        });
    },

    handlePopupLableAddBtn: function () {
        var self = this;
        $('#btn-su_label').click(function () {
            var title_label = $.trim($('#title_label').val());
            if (title_label) {
                self.createLabelHtml($('#label-view .label-warp').length, -1, title_label);
                $('#title_label').val('');
            }
        });
    },

    handlePopupLableDelBtn: function () {
        var self = this;
        $('#label-view').on('click', '.label-del', function () {
            $(this).remove();

            // 删除数据
            self.delPageLabel($(this).data('i'));

            // 重新赋值下标
            $('#label-view .label-warp').each(function (i, e) {
                $(e).attr('data-i', i);
            });
        });
    },

    handleSaveBtn: function () {
        var self = this;
        $('#page-save').click(function () {
            if (!$(this).hasClass('weui-btn_disabled')) {
                self.ajaxData(false,
                    function (data) {
                        self.goBack('保存成功！');
                    },
                    function (data) {
                        self.goBack('保存成功！');
                    }
                );
            }
        });
    },

    handleResizePage: function () {
        var self = this;
        $(window).resize(function () {
            self.initPageWrapStatus();
            // 隐藏浮动面板
            $('.panel-fixed_form').hide();
        });
    },

    isPC: function () {
        var ua = navigator.userAgent;
        if ((ua.match(/(Android|webOS|iPhone|iPod|BlackBerry|Windows Phone)/i))) {
            return false;
        } else {
            return true;
        }
    },

    initPageWrapStatus: function () {
        var doc_w = document.documentElement.clientWidth,
            doc_h = document.documentElement.clientHeight,
            w = doc_w, h = doc_h, $page_view;

        if (this.isPC()) {
            h = doc_h > 640 ? 640 : doc_h;
            w = Math.floor(h * (320 / 504));

            if (doc_h > 640) {
                $('#pageWrap').css('top', (doc_h - h) / 2);
            }
        } else {
            w = doc_w > 500 ? 500 : doc_w;
        }

        if (this.hasFrame) {
            $page_view = $('iframe[name="page-view"]');
            $page_view.attr({'width': w + 'px', 'height': h + 'px'});
        } else {
            $page_view = $('#page-view');
            $page_view.css({'width': w + 'px', 'height': h + 'px', 'margin': '0 auto'});
        }
    },

    removePageWrapStatus: function () {
        $('.panel-fixed_form').hide();
        $('.cell-title').show();
        $('#page-save').removeClass('weui-btn_disabled weui-btn_default').addClass('weui-btn_primary');
    },

    ajaxData: function (hasPush, insertCallback, updateCallback) {
        if (!module.service.validateData()) {
            return false;
        }

        var messageData = module.data.messageData,
            userInfo = module.data.userInfo,
            saveData = module.service.getPostData(),
            postData = {
                m: module.data.m,
                t: 'message'
            },
            params = {
                slave_label: module.data.labelNames,
                corpid: userInfo.corpid,
                msgType: this.msgType
            };

        if (5 == this.msgType) { // H5需要html文件地址
            params.pageUrl = saveData.description;
        } else if (6 == this.msgType) { // 平面需要保存图片
            var pageData = this.hasFrame ? frames["page-view"].pageData : window.pageData;
            if (!$.isEmptyObject(pageData)) {
                params.imgUrl = pageData.imgUrl + pageData.size;
            }
        }

        if (!$.isEmptyObject(messageData)) {
            var message_id = messageData.id,
                filter = [
                    {field: 'id', value: message_id, operator: '=', relation: 'AND'}
                ];

            saveData.id = message_id;

            var slave = [{t: 'message_tag_relation', key: 'id:message_id'}];

            postData.v = JSON.stringify([{
                t: 'message',
                data: saveData,
                filter: filter,
                id: message_id,
                slave: slave
            }]);

            // 插入页面标签
            params.data_id = message_id;
            postData.params = JSON.stringify(params);

            YT.update({
                data: postData,
                successCallback: function (data) {
                    if (data.status == 200) {
                        var item = data.object;
                        if (6 == saveData.msgType) { // 只适用于平面
                            saveData.picurl = item.picurl;
                        }
                        module.data.messageData = $.extend(messageData, saveData);
                        updateCallback(data);
                    } else {
                        $.alert('保存失败!');
                    }
                }
            });
        } else {
            saveData.msgType = this.msgType;
            saveData.type = 1;
            saveData.url = YT.server + this.shareUrl;
            saveData.btntxt = "阅读全文";
            saveData.corp_id = userInfo.corp_id;
            saveData.suite_id = userInfo.suite_id;
            saveData.app_id = userInfo.app_id;
            saveData.corpid = userInfo.corpid;
            saveData.createUserId = userInfo.id;
            saveData.createTime = new Date().Format('yyyy-MM-dd hh:mm:ss');

            // 消息与组关系
            var slave = [], group_ids = module.data.group_ids || [];

            for (var i in group_ids) {
                slave.push({
                    t: 'groups_message_relation',
                    data: {group_id: group_ids[i]},
                    key: 'message_id'
                });
            }

            postData.v = JSON.stringify([{
                t: 'message',
                data: saveData,
                ai: true,
                slave: slave
            }]);

            // 插入页面标签
            postData.params = JSON.stringify(params);

            YT.insert({
                data: postData,
                successCallback: function (data) {
                    if (data.status == 200) {
                        var item = data.object;
                        saveData.id = item.ids[0]; // message_id
                        if (6 == saveData.msgType) { // 只适用于平面
                            saveData.picurl = item.picurl;
                        }
                        module.data.messageData = saveData;
                        insertCallback(data);
                    } else {
                        $.alert('保存失败!');
                    }
                }
            });
        }
    },

    goBack: function (msg) {
        $.alert(msg, function () {
            // 页面链接跳转历史URL不记录
            history.replaceState(null, document.title, '/module/message/message-list-new.html?' + location.href.split('?')[1] + '#');
            window.location.replace('');
        });
    },

    createLabelHtml: function (i, id, name) {
        $('#label-view .box-flex').append(this.createLabelHtml_del(i, id, name));

        // 添加数据
        this.addPageLabel(id, name);
    },

    // 添加页面标签数据
    addPageLabel: function (id, name) {
        // todo
        var index = this.hasFrame ? frames["page-view"].activeIndex : window.activeIndex;
        if (module.data.labelNames[index] == undefined) {
            module.data.labelNames[index] = [];
        }
        module.data.labelNames[index].push({id: id, name: name});
    },

    // 删除页面对应标签数据
    delPageLabel: function (i) {
        var index = this.hasFrame ? frames["page-view"].activeIndex : window.activeIndex;
        module.data.labelNames[index].splice(i, 1);
    },

    createLabelHtml_del: function (i, id, name) {
        var html = '';
        html += '<div class="label-warp label-del" data-i="' + i + '">';
        html += '<div class="label blur" data-id="' + id + '">' + name + '</div>';
        html += '<img src="/image/message-icon-del.svg">';
        html += '</div>';
        return html;
    }
};

// 防止微信浏览器被整体拖拽
$(function () {
    var startY, endY;
    var box_height = $('#pageWrap').height();
    $('.page-content').on('touchstart', function (event) {
        event.stopPropagation();
        startY = event.touches[0].pageY;
    });
    $('.page-content').on('touchmove', function (event) {
        event.stopPropagation();
        var endY = event.changedTouches[0].pageY;
        var changedY = endY - startY;
        var scroll_top = $('.page-content').scrollTop();
        // 判断是否在顶部，且向下拖动
        if (scroll_top === 0 && changedY > 0) {
            event.preventDefault();
        }
        // 判断是否在底部，且向上拖动
        var o = $('.page-footer').offset();
        if (o.top + o.height === box_height && changedY < 0) {
            event.preventDefault();
        }
    });
    // header禁止拖动
    $('.page-header').on('touchmove', function (event) {
        event.preventDefault();
    });
});