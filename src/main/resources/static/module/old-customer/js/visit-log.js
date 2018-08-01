var module = {};

module.data = {
    m: 1010000,
    customer_id: YT.getUrlParam("customer_id"),
    customer_name: YT.getUrlParam("customer_name"),
    company: YT.getUrlParam('company'),
    visit_plan_time: YT.getUrlParam('visit_plan_time')
};

module.service = {
    initControls: function () {
        this.initDom();
        common.visit.initHotTagList();
    },

    initDom: function () {
        $('#customerName-log').text(module.data.customer_name);

        $("#visitWay").picker({
            title: "请选择拜访方式",
            cols: [
                {
                    textAlign: 'center',
                    values: ['电话拜访', '实地拜访', '微信交流', '邮件', '其他方式交流']
                }
            ]
        });

        $("#visitResult").picker({
            title: "请选择拜访结果",
            cols: [
                {
                    textAlign: 'center',
                    values: ['初步洽谈', '有明确意向', '签订合同', '客户无意向']
                }
            ]
        });

        uploader.component.uploadImage('log', '#uploaderImageInput-log', '#uploaderImageFiles-log');
        uploader.component.uploadFile('log', '#uploaderFileInput-log', '#uploaderFiles-log');

        common.select.initHtml('#staffsPopup-log', '#btn-log', 'log');

        $("#btn-add").click(function () {
            $(this).hide();
            $('#btn-del').show();
            $("#planWarp").show();
        });
        $("#btn-del").click(function () {
            $(this).hide();
            $('#btn-add').show();
            $("#planWarp").hide();
        });

        common.visit.initDom_plan();

    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleBtnTag();
        this.handleClickTag();
        this.handleBtnSave();
    },

    handleBtnTag: function () {
        $('#btn-tag').click(function () {
            $.prompt({
                title: '填写标签',
                text: '',
                input: '',
                empty: false, // 是否允许为空
                onOK: function (input) {
                    //点击确认
                    $('.tag-box').append(common.visit.createTagHtml(input));
                },
                onCancel: function () {
                    //点击取消
                }
            });
        });
    },

    handleClickTag: function () {
        $('.tag-box').on('click', '.tag', function () {
            var $img = $(this).parent().find('img');
            if ($img.hasClass('action')) {
                $img.removeClass('action').attr('src', '/image/unChecked.svg');
            } else {
                $img.addClass('action').attr('src', '/image/checked.svg');
            }
        });

        $('.tag-box').on('click', 'img', function () {
            var $img = $(this);
            if ($img.hasClass('action')) {
                $img.removeClass('action').attr('src', '/image/unChecked.svg');
            } else {
                $img.addClass('action').attr('src', '/image/checked.svg');
            }
        });
    },

    handleBtnSave: function () {
        $('#btn-save').click(function () {
            var customer_id = module.data.customer_id,
                visitLogTime = new Date().Format('yyyy-MM-dd hh:mm:ss'); // 记录时间

            var visitMemo = $.trim($("#visitMemo").val());

            // 获得客户标签
            var slave_label = [];
            $('.tag-box').find('.tag-warp').each(function (i, e) {
                if ($(e).find('img').hasClass('action')) {
                    var $tag = $(e).find('.tag');
                    slave_label.push({id: $tag.data('id'), name: $tag.text()})
                }
            });

            if (!visitMemo && !slave_label.length) {
                $.alert('请选择印象或填写备注！');
                return false;
            }

            var info = [
                {
                    data: {
                        customer_id: customer_id,
                        way: $("#visitWay").val(),
                        result: $("#visitResult").val(),
                        requirement: $.trim($("#requirement").val()),
                        memo: visitMemo,
                        picture: uploader.component.getImageData('log'),
                        attachment: uploader.component.getFileData('log'),
                        to_staff: common.select.data['log'].ids.join(','),
                        recordTime: new Date().Format('yyyy-MM-dd hh:mm:ss')
                    },
                    t: 'visit_log',
                    ai: true
                }
            ];

            // 获取计划数据
            if (!$("#btn-del").is(":hidden")) {
                info.push(common.visit.getPlanData(customer_id));
            }

            var params = {
                customer_id: customer_id,
                log_staff: info[0].data.to_staff,
                plan_staff: info[1] && info[1].data.to_staff || '',
                slave_label: slave_label
            };

            var visit_plan_time = +module.data.visit_plan_time;
            if (!isNaN(visit_plan_time)) {
                params.visit_plan_time = new Date(visit_plan_time).Format('yyyy-MM-dd hh:mm:ss')
            }

            var postData = {
                m: module.data.m,
                t: 'visit_log',
                v: JSON.stringify(info),
                params: JSON.stringify(params)
            };

            YT.insert({
                data: postData,
                successCallback: function (data) {
                    if (data.status == 200) {
                        var logVisitId = data.object['visit_log'][0];
                        var logAutoIds = data.object['log'];
                        var planVisitId = data.object['visit_plan'] && data.object['visit_plan'][0];
                        var planAutoIds = data.object['plan'];

                        common.service.getUserInfo(function (data) {
                            // 推送消息
                            var logUserIds = common.select.data['log'].userIds;
                            var logIds = common.select.data['log'].ids;
                            var planUserIds = common.select.data['plan'].userIds;
                            var planIds = common.select.data['plan'].ids;

                            common.visit.pushMsg({
                                staff_id: data.id,
                                staff_name: data.name,
                                company: module.data.company,
                                customer_name: module.data.customer_name,
                                isComment: 0,
                                time: visitLogTime,
                                visit_id: logVisitId,
                                comment_id: logAutoIds,
                                userIds: logUserIds,
                                ids: logIds,
                                type: 2
                            });

                            common.visit.pushMsg({
                                staff_id: data.id,
                                staff_name: data.name,
                                company: module.data.company,
                                customer_name: module.data.customer_name,
                                isComment: 0,
                                time: info[1] && info[1].data.time,
                                visit_id: planVisitId,
                                comment_id: planAutoIds,
                                userIds: planUserIds,
                                ids: planIds,
                                type: 1
                            });

                            $.alert('提交成功', function () {
                                $(location).attr('href', '/module/customer-list/customer-list-my.html' + YT.setUrlParams());
                            });
                        });
                    } else {
                        $.alert(data.message);
                    }
                }
            });
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});