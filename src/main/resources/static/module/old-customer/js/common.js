var common = common || {};

common.service = {
    getUserInfo: function (callback) {
        var data = {
            m: 1010000,
            t: 'staffs',
            params: JSON.stringify({operator_id: '='})
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    callback(data.object[0]);
                } else {
                    $.alert(data.message);
                }
            }
        });
    }
};

common.select = {
    data: {},

    resetDate: function (ele, btn, flag) {
        var $box = $(btn).parent('.weui-cell__bd');
        $box.children('.weui-media-box__hd').remove();
        this.data[flag + ''].ids = [];
        this.data[flag + ''].selectId = [];
        this.data[flag + ''].userIds = [];
        $(ele).find('.weui-check').removeAttr('checked');
    },

    initHtml: function (ele, btn, flag) {
        this.createPopupHtml(ele);
        this.handleOpenPopup(ele, btn);

        var self = this;

        console.log("module.data.userid:"+module.data.user_id);
        $.ajax({
            type: 'get',
            url: "/staff/send?userid="+module.data.user_id,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    self.data[flag + ''] = {
                        list: data,
                        ids: [],
                        selectId: [],
                        userIds: []
                    };

                    // 加载列表
                    var html = '';
                    for (var i in data) {
                        html += self.createListHtml(data[i], []);
                    }
                    $(ele).find('.weui-panel__bd').append(html);

                    // 搜索事件
                    $(ele).find('.searchInput').bind('input propertychange', function (e) {
                        self.searchStaffs($(this).val(), ele, self.data[flag].list, self.data[flag].ids);
                    });

                    self.handleClosePopup(ele, btn, self.data[flag].ids, self.data[flag].selectId, self.data[flag].userIds);
                }
            }
        });
    },

    // 打开Popup
    handleOpenPopup: function (ele, btn) {
        $(btn).click(function () {
            $(document.body).addClass('page-unScroll');
            $(ele).find('.weui-popup__container').popup();
        });
    },

    // 关闭Popup
    handleClosePopup: function (ele, btn, ids, selectedIds, userIds) {
        var self = this;
        $(ele).find('.btn-su').click(function () {
            $(document.body).removeClass('page-unScroll');
            $.closePopup();

            ids.length = [];
            selectedIds.length = [];
            userIds.length = [];

            $(ele).find('.weui-panel__bd input:checked').each(function (i, e) {
                var id = $(e).parents('.weui-media-box_appmsg').data('id');
                var userId = $(e).parents('.weui-media-box_appmsg').data('userid');
                var code = $(e).parents('.weui-media-box_appmsg').data('code');
                var temp = {
                    id: id,
                    head: $(e).parents('.weui-media-box_appmsg').find('.weui-media-box__thumb').attr('src')
                };
                ids.push(id);
                userIds.push(userId);
                selectedIds.push(temp);
            });

            self.createStaffsHtml(btn, selectedIds);
        });
    },

    searchStaffs: function (keyword, ele, data, ids) {
        var self = this,
            $list = $(ele).find('.weui-panel__bd');
        $list.empty();
        for (var i in data) {
            if (data[i].name.indexOf(keyword) >= 0) {
                $list.append(self.createListHtml(data[i], ids));
            }
        }
    },

    createPopupHtml: function (ele) {
        var html = '';

        html += '<!-- Popup 开始 -->';
        html += '<div class="weui-popup__container">';
        html += '<div class="weui-popup__overlay"></div>';
        html += '<div class="weui-popup__modal">';
        html += '<div class="popupWarp">';

        /*html += '<!-- 下拉刷新 -->';
         html += '<div class="weui-pull-to-refresh__layer">';
         html += '<div class="weui-pull-to-refresh__arrow"></div>';
         html += '<div class="weui-pull-to-refresh__preloader"></div>';
         html += '<div class="down">下拉刷新</div>';
         html += '<div class="up">释放刷新</div>';
         html += '<div class="refresh">正在刷新</div>';
         html += '</div>';*/

        html += '<!-- 搜索栏 -->';
        html += '<div class="weui-search-bar">';
        html += '<form class="weui-search-bar__form">';
        html += '<div class="weui-search-bar__box">';
        html += '<i class="weui-icon-search"></i>';
        html += '<input type="search" class="weui-search-bar__input searchInput" placeholder="搜索" required="">';
        html += '<a href="javascript:" class="weui-icon-clear searchClear"></a>';
        html += '</div>';
        html += '<label class="weui-search-bar__label searchText">';
        html += '<i class="weui-icon-search"></i>';
        html += '<span>搜索</span>';
        html += '</label>';
        html += '</form>';
        html += '<a href="javascript:" class="weui-search-bar__cancel-btn searchCancel">取消</a>';
        html += '</div>';

        html += '<!-- 主体内容 -->';
        html += '<div class="weui-panel weui-panel_access">';
        html += '<div class="weui-panel__bd">';
        html += '</div>';

        /*html += '<!-- 滚动加载 -->';
         html += '<div class="weui-loadmore">';
         html += '<i class="weui-loading"></i>';
         html += '<span class="weui-loadmore__tips">正在加载</span>';
         html += '</div>';
         html += '</div>';*/

        html += '<!-- 底部按钮 -->';
        html += '<div class="weui-btn-area">';
        html += '<a class="weui-btn weui-btn_primary btn-su" href="javascript:">确定</a>';
        html += '</div>';

        html += '<!-- Popup 结束 -->';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        $(ele).append(html);
    },

    createListHtml: function (data, checkedIds) {
        var html = '';

        html += '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg" ';
        html += 'data-id="' + data.id + '" data-userid="' + data.userid + '" data-code="' + data.code + '">';
        html += '<div class="weui-media-box__hd head-size">';
        html += '<img class="weui-media-box__thumb" src="' + (data.avatar || '') + '" alt="">';
        html += '</div>';
        html += '<div class="weui-media-box__bd weui-cells_checkbox">';
        html += '<label class="weui-cell weui-check__label">';
        html += '<div class="weui-cell__bd">';
        html += '<h4 class="weui-media-box__title">' + data.name + '</h4>';
        html += '</div>';
        html += '<div class="weui-cell__ft">';
        if ($.inArray(data.id, checkedIds) >= 0) {
            html += '<input type="checkbox" class="weui-check" name="checkbox" checked="checked">';
        } else {
            html += '<input type="checkbox" class="weui-check" name="checkbox">';
        }
        html += '<i class="weui-icon-checked"></i>';
        html += '</div>';
        html += '</label>';
        html += '</div>';
        html += '</a>';

        return html;
    },

    createStaffsHtml: function (btn, data) {
        var $box = $(btn).parent('.weui-cell__bd');
        $box.children('.weui-media-box__hd').remove();
        for (var i = data.length - 1; i >= 0; i--) {
            $box.prepend('<div class="weui-media-box__hd head-size"><img class="weui-media-box__thumb" src="' + (data[i].head || '') + '"></div>');
        }
    }
};

common.visit = {
    pushMsg: function (obj) {
        /*
         {
         staff_id: 0, // 当前人主键
         staff_name: '',
         time: '',
         company: '',
         customer_name: '',
         visit_id: 0,
         comment_id: [], // 评论主键
         userIds: [], // 推送人userid
         ids:[], // 推送人主键
         type: 1,
         isComment: 0
         }
         */

        var staff_id = obj.staff_id;
        var staff_name = obj.staff_name;
        var time = obj.time;
        var company = obj.company || '【未填公司】';
        var customer_name = obj.customer_name || '【未填姓名】';
        var visit_id = obj.visit_id;
        var comment_id = obj.comment_id;
        var userIds = obj.userIds;
        var ids = obj.ids;
        var type = obj.type;
        var isComment = obj.isComment;

        for (var i in userIds) {
            var title = type == 1 ? '待评论：' + staff_name + '拜访计划' : '待评论：' + staff_name + '拜访记录';
            var description = '您有一条新的' + (type == 1 ? '拜访计划' : '拜访记录') + '需要评论：\n';
            description += staff_name + (type == 1 ? '\n即将于' : '\n于') + time + (type == 1 ? '\n拜访' : '\n拜访了') + company + '_' + customer_name;
            var url = common.visit.pushUrl(ids[i], visit_id, type, isComment, comment_id[i]);
            var btntxt = type == 1 ? '计划详情' : '记录详情';

            var article = {
                title: title,
                description: description,
                url: url,
                btntxt: btntxt
            };

            pushMsgTool.sendMessage(
                {
                    config: {
                        toType: {
                            type: [1],
                            touser: userIds[i]
                        },
                        msgtype: 'news',
                        safe: 0
                    },
                    content: {
                        articles: [article]
                    },
                    userId: staff_id,
                    appId: YT.apps.sales_ass_id
                },
                function (data) {
                },
                function (data) {
                }
            );
        }
    },

    /**
     *
     * @param staff_id
     * @param visit_id
     * @param type
     * @param isComment 是否评论 0未评论 1已评论
     * @param comment_id
     * @returns {string}
     */
    pushUrl: function (staff_id, visit_id, type, isComment, comment_id) {
        var corpid = YT.getUrlParam('corpid');
        return 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
            'appid=' + corpid +
            '&redirect_uri=http%3a%2f%2fcrm.youitech.com%2fwx%2fredirect.action' +
            '&response_type=code' +
            '&scope=snsapi_base' +
            '&state=ImoduleIdiscussIvisitSdetailSevaluationDhtmlP' + corpid + 'P' + YT.apps.sales_ass_id + 'P' +
            'AAstaff_idEE' + staff_id + 'AAvisit_idEE' + visit_id +
            'AAtypeEE' + type + 'AAiscommentEE' + isComment +
            'AAcommentidEE' + comment_id +
            '#wechat_redirect';
    },

    /**
     *
     * @param time
     * @param visit 0正常 1已填写计划未拜访 2已拜访 3未正常拜访
     * @returns {*}
     */
    getDays: function (time, visit) {
        if (visit) {
            if (time) {
                var startTime = Date.parse(new Date().Format('yyyy-MM-dd'));
                var endTime = Date.parse(new Date(time).Format('yyyy-MM-dd'));
                if (startTime <= endTime) {
                    return parseInt(Math.abs(startTime - endTime) / (24 * 3600 * 1000));
                } else {
                    return '拜访已超时';
                }
            } else {
                return '未填写拜访时间';
            }
        } else {
            return '暂无拜访计划';
        }
    },

    format: function (time, visit) {
        var days = this.getDays(time, visit);
        return isNaN(days) ? days : days % 7 < 0 ? days % 7 + '周后' : days == 0 ? '<span style="color: #438aca;">今天拜访</span>' : days + '天后';
    },

    formatTime: function (time) {
        var nowTime = new Date().getTime();
        var second = (nowTime - time) / 1000; // 秒
        var minute = second / 60; // 分
        var hour = minute / 60; // 小时
        var day = hour / 24; // 天
        var week = day / 7; // 周
        if (minute < 1) {
            return Math.floor(second) + ' 秒前';
        } else if (hour < 1) {
            return Math.floor(minute) + ' 分前';
        } else if (day < 1) {
            return Math.floor(hour) + ' 小时前';
        } else if (week < 1) {
            return Math.floor(day) + ' 天前';
        } else if (week >= 1 && week <= 3) {
            return Math.floor(week % 3) + ' 周前';
        } else if (week % 7 > 3) {
            return new Date(time).Format('yyyy-MM-dd hh:mm:ss');
        }
    },

    initDom_plan: function () {
        console.log()

        $('#customerName').text(module.data.customer_name);

        $("#visitName").datetimePicker({
            title: "请选择拜访时间"
        });

        $("#visitPicker").cityPicker({
            title: "请选择拜访地点"
        });

        $("#remindTime").picker({
            title: "请选择提醒时间",
            cols: [
                {
                    textAlign: 'center',
                    values: ['不提醒', '10分钟前', '30分钟前', '1小时前', '3小时前', '1天前', '3天前']
                }
            ]
        });

        uploader.component.uploadImage();
        uploader.component.uploadFile();

        common.select.initHtml('#staffsPopup', '#btn-plan', 'plan');
    },

    getPlanData: function (customer_id) {
        var time = $('#visitTime').val(),
            remind = $('#remindTime').val(),
            remindTime = 0;

        if (!time) {
            $.alert('请选择拜访时间！');
            return false;
        }

        switch (remind) {
            case '10分钟前':
                remindTime = 1000 * 60 * 10;
                break;
            case '30分钟前':
                remindTime = 1000 * 60 * 30;
                break;
            case '1小时前':
                remindTime = 1000 * 60 * 60;
                break;
            case '3小时前':
                remindTime = 1000 * 60 * 60 * 3;
                break;
            case '1天前':
                remindTime = 1000 * 60 * 60 * 24;
                break;
            case '3天前':
                remindTime = 1000 * 60 * 60 * 24 * 3;
                break;
        }

        // var data = {
        //     customerId: customer_id,
        //     time: time || null,
        //     place:($('#visitPicker').val() || ''),
        //     location: ($('#visitAddress').val() || ''),
        //     // ios注意：new Date('2017-10-01'..replace(/-/g,'/'))
        //     remind: remindTime ? new Date(new Date(time.replace(/-/g, '/')).getTime() - remindTime).Format('yyyy-MM-dd hh:mm') : null,
        //     content: $('#visitContent').val(),
        //     picture: uploader.component.getImageData(),
        //     attachment: uploader.component.getFileData(),
        //     toStaff: common.select.data['plan'].userIds.join(','),
        //     // time: new Date().Format('yyyy-MM-dd hh:mm:ss')
        // };

        return {
            customerId: customer_id,
            time: new Date(time.replace(/-/g, '/')).Format('yyyy-MM-dd hh:mm:ss') || null,
            place:($('#visitPicker').val() || ''),
            location: ($('#visitAddress').val() || ''),
            // ios注意：new Date('2017-10-01'..replace(/-/g,'/'))
            remind: remindTime ? new Date(new Date(time.replace(/-/g, '/')).getTime() - remindTime).Format('yyyy-MM-dd hh:mm:ss') : null,
            content: $('#visitContent').val(),
            picture: uploader.component.getImageData(),
            attachment: uploader.component.getFileData(),
            toStaff: common.select.data['plan'].userIds.join(','),
        };
    },

    // 加载拜访记录热门客户标签
    initHotTagList: function () {
        var self = this;

        var data = {
            m: 1010000,
            t: 'v_customers_tag_hot',
            order: 'count desc, tag_id',
            r: 10
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    var items = data.object, html = '';
                    var defaultClass = ['blue', 'green', 'orange', 'red', 'purple', 'grey'];
                    var tagClass = [].concat(defaultClass);

                    for (var i in items) {
                        var item = items[i];
                        if (tagClass.length == 0) {
                            tagClass = [].concat(defaultClass);
                        }
                        var index = Math.floor(Math.random() * tagClass.length);
                        html += self.createTagHtml_unChecked(tagClass.splice(index, 1)[0], item.tag_id, item.tag_name);
                    }

                    $('.tag-box').append(html);
                }
            }
        });
    },

    // 加载客户标签
    initTagList: function () {
        var self = this;

        var filter = [
            {field: 'customer_id', value: module.data.customer_id, operator: '=', relation: 'and'}
        ];

        var data = {
            m: 1010000,
            t: 'v_customers_tag',
            filter: JSON.stringify(filter),
            order: 'num desc, tag_id'
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    var items = data.object, html = '';

                    if (items.length) {
                        $('.customerTag').show();
                        var defaultClass = ['blue', 'green', 'orange', 'red', 'purple', 'grey'];
                        var tagClass = [].concat(defaultClass);

                        for (var i in items) {
                            var item = items[i];
                            if (tagClass.length == 0) {
                                tagClass = [].concat(defaultClass);
                            }
                            var index = Math.floor(Math.random() * tagClass.length);
                            html += self._createTagHtml(tagClass.splice(index, 1)[0], item.tag_id, item.tag_name, item.num);
                        }

                        $('.tag-box').append(html);
                    }

                }
            }
        });
    },

    // 拜访记录添加客户标签
    createTagHtml: function (name) {
        var defaultClass = ['blue', 'green', 'orange', 'red', 'purple', 'grey'];
        var index = parseInt(defaultClass.length * Math.random());
        return this.createTagHtml_checked(defaultClass[index], -1, name);
    },

    // 客户标签未选中状态
    createTagHtml_unChecked: function (tagClass, id, name) {
        var html = '';
        html += '<div class="tag-warp">';
        html += '<div class="tag ' + tagClass + '" data-id="' + id + '">' + name + '</div>';
        html += '<img src="/image/unChecked.svg">';
        html += '</div>';
        return html;
    },

    // 客户标签选中状态
    createTagHtml_checked: function (tagClass, id, name) {
        var html = '';
        html += '<div class="tag-warp">';
        html += '<div class="tag ' + tagClass + '" data-id="' + id + '">' + name + '</div>';
        html += '<img class="action" src="/image/checked.svg">';
        html += '</div>';
        return html;
    },

    // 客户标签无状态
    _createTagHtml: function (tagClass, id, name, num) {
        var html = '';
        html += '<div class="tag-warp">';
        html += '<div class="tag ' + tagClass + '" data-id="' + id + '">' + name + ' ' + num + '</div>';
        html += '</div>';
        return html;
    }

};
