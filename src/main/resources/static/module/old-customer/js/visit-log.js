var module = {};

module.data = {
    user_id:getUrlParam("userid"),
    customer_id: getUrlParam("customer_id"),
    customer_name:getUrlParam("customer_name"),
    company:getUrlParam("company")
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

        $.ajax({
            type: 'get',
            url: "/staff/self?userId="+module.data.user_id,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log("staff_name: "+data.name);
                    module.data.staff_name = data.name;
                    common.select.initHtml('#staffsPopup-log', '#btn-log', 'log');
                }
            }
        });


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
                $img.removeClass('action').attr('src', '/images/unChecked.svg');
            } else {
                $img.addClass('action').attr('src', '/images/checked.svg');
            }
        });

        $('.tag-box').on('click', 'img', function () {
            var $img = $(this);
            if ($img.hasClass('action')) {
                $img.removeClass('action').attr('src', '/images/unChecked.svg');
            } else {
                $img.addClass('action').attr('src', '/images/checked.svg');
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

            console.log("to_staff userIds:"+common.select.data['log'].userIds);
            console.log("to_staff userIds:"+common.select.data['log'].userIds.join(','));

            var info = {
                visitLog:{
                    userId:module.data.user_id,
                    staffName:module.data.staff_name,
                    customerId: customer_id,
                    customerName:module.data.customer_name,
                    company:module.data.company,
                    way: $("#visitWay").val(),
                    result: $("#visitResult").val(),
                    requirement: $.trim($("#requirement").val()),
                    memo: visitMemo,
                    picture: uploader.component.getImageData('log'),
                    attachment: uploader.component.getFileData('log'),
                    toStaff: common.select.data['log'].userIds.join(','),
                    recordTime: new Date().Format('yyyy-MM-dd hh:mm:ss')
                }
            };

            info['visitLog']['userId'] = module.data.user_id;
            console.log("log info userid:"+info['visitLog']['userId']);
            console.log("log info customerId:"+info['visitLog']['customerId']);
            console.log("log info customerName:"+info['visitLog']['customerName']);
            console.log("log info staffName:"+info['visitLog']['staffName']);

            // 获取计划数据
            if (!$("#btn-del").is(":hidden")) {
                info['visitPlan'] = common.visit.getPlanData(customer_id);
                info['visitPlan']['userId'] = module.data.user_id;
                info['visitPlan']['staffName'] = module.data.staff_name;
                info['visitPlan']['customerName'] = module.data.customer_name;
                info['visitPlan']['company'] = module.data.company;
                console.log("plan info userid:"+info['visitPlan']['userId']);
                console.log("plan info customerid:"+info['visitPlan']['customerId']);
                // info.push(common.visit.getPlanData(customer_id));
            }

            info['tags'] = slave_label;

            $.ajax({
                type: 'post',
                url: "/log/add",
                data:JSON.stringify(info),
                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                error: function (request) {
                },
                success: function (result) {
                    if (result.code == 0) {
                        $.alert('提交成功', function () {
                            $(location).attr('href', '/module/customer-list/customer-list-my.html?userid='+module.data.user_id);
                        });
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