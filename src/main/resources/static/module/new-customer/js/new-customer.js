var module = {};

module.data = {
    m: 1010000,
    customer_id: +YT.getUrlParam("customer_id")
};

module.service = {

    initControls: function () {
        this.initDom();
        this.initCustomer();
    },

    initDom: function () {
        $("#source").picker({
            title: "请选择来源",
            cols: [
                {
                    textAlign: 'center',
                    values: ['老客户推荐', '朋友介绍', '展会拓展', '电话陌拜', '网络搜索', '销售助手', '其他']
                }
            ],
            onClose: function (data) {
                var val = data.displayValue[0];
                $("#who").hide();
                if (val == '老客户推荐') {
                    var data = {
                        m: module.data.m,
                        t: 'v_customers_distinct',
                        order: 'id'
                    };
                    var each = [];
                    YT.query({
                        data: data,
                        successCallback: function (data) {
                            if (200 == data.status) {
                                for (var i in data.object) {
                                    each.push({
                                        title: data.object[i].name,
                                        value: data.object[i].id
                                    });
                                }
                                if (each.length) {
                                    $("#who").show();
                                    $("#recommend").select({
                                        title: "选择推荐人",
                                        items: each
                                    });
                                } else {
                                    $('#source').val('');
                                    $.alert('暂无老客户！');
                                }
                            } else {
                                $.alert(data.message);
                            }
                        }
                    });
                } else {
                    // 置空来源数据
                    $("#recommend").val('').data('values', '-1');
                }
            }
        });
        $("#who").hide();
    },

    initCustomer: function () {
        var customer_id = module.data.customer_id;

        if (customer_id) {
            var filter = [
                {field: 'id', value: customer_id, operator: '=', relation: 'AND'}
            ];

            YT.query({
                data: {
                    m: module.data.m,
                    t: 'v_customers_distinct',
                    filter: JSON.stringify(filter)
                },
                successCallback: function (data) {
                    if (200 == data.status) {
                        var items = data.object;
                        if (items.length == 1) {
                            var item = items[0];
                            module.service.initCustomerVal(item);
                        } else {
                            $.alert('客户不存在！');
                            $('#save').hide();
                        }
                    } else {
                        $.alert(data.message);
                    }
                }
            });
        }
    },

    initCustomerVal: function (item) {
        $('#name').val(item.name);
        $('#position').val(item.position);
        $('#department').val(item.department);
        $('#mobile').val(item.mobile);
        $('#wechat').val(item.wechat);

        // todo picker 默认值选中问题
        $('#source').val(item.source);
        $('#recommend').val(item.recommend_name).data('values', item.recommend_id);
        $('#remark').text(item.remark);
    },

    showModal: function (customer_id) {
        $.modal({
            title: "提示",
            text: "已保存新用户",
            buttons: [
                {
                    text: "继续添加", onClick: function () {
                    $(location).attr('href', 'new-customer.html' + YT.setUrlParams());
                }
                },
                {
                    text: "新增计划", onClick: function () {
                    $(location).attr('href', '../old-customer/new-visit-plan.html' + YT.setUrlParams({
                        customer_id: customer_id,
                        customer_name: $('#name').val()
                    }));
                }
                }/*,
                {text: "取消", className: "default"}*/
            ]
        });
    },

    validatePhone: function (content) {
        if ($.trim(content)) {
            if (/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(content)) {
                return 1;
            } else {
                $.alert('手机号格式不正确！', function () {
                    //$('#mobile').focus();
                });
                return 0;
            }
        } else {
            $.alert('手机号必须填写！', function () {
                //$('#mobile').focus();
            });
            return 0;
        }
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleAdd();
        this.handleValidatePhone();
    },

    handleAdd: function () {
        $('#save').click(function () {
            var info_data = {
                name: $('#name').val(),
                position: $('#position').val(),
                mobile: $('#mobile').val(),
                department: $('#department').val(),
                source: $('#source').val(),
                wechat: $('#wechat').val(),
                remark: $('#remark').val()
            };

            if ($("#recommend").attr('data-values')) {
                info_data.recommend_id = ($("#source").val() != '老客户推荐') ? -1 : ($("#recommend").attr('data-values'));
            }

            // 验证手机号
            if (!module.service.validatePhone($('#mobile').val())) {
                return false;
            } else {
                var filter = [
                    {field: 'mobile', value: $('#mobile').val(), operator: '=', relation: 'AND'}
                ];

                YT.query({
                    data: {
                        m: module.data.m,
                        t: 'v_customers_distinct',
                        filter: JSON.stringify(filter)
                    },
                    successCallback: function (data) {
                        if (200 == data.status) {
                            if (data.object.length == 1) {
                                $.alert('手机号已存在');
                                return false;
                            } else {
                                var customer_id = module.data.customer_id;

                                if (customer_id) {
                                    var filter = [
                                        {field: 'id', value: customer_id, operator: '=', relation: 'AND'}
                                    ];

                                    var info = {
                                        data: info_data,
                                        filter: filter
                                    };

                                    var data = {
                                        m: module.data.m,
                                        t: 'customers',
                                        v: JSON.stringify([info])
                                    };

                                    YT.update({
                                        data: data,
                                        successCallback: function (data) {
                                            if (data.status == 200) {
                                                if (+YT.getUrlParam("customer_id")) {
                                                    location.href = '/module/old-customer/client-frequent.html' + YT.setUrlParams();
                                                } else {
                                                    module.service.showModal(customer_id);
                                                }
                                            } else {
                                                $.alert(data.message);
                                            }
                                        }
                                    });
                                } else {
                                    var info = {
                                        data: info_data,
                                        t: 'customers',
                                        ai: true
                                    };

                                    var data = {
                                        m: module.data.m,
                                        t: 'customers',
                                        v: JSON.stringify([info])
                                    };

                                    YT.insert({
                                        data: data,
                                        successCallback: function (data) {
                                            if (data.status == 200) {
                                                module.service.showModal(data.object);
                                            } else {
                                                $.alert(data.message);
                                            }
                                        }
                                    });
                                }
                            }
                        } else {
                            $.alert(data.message);
                        }
                    }
                });
            }
        });
    },

    handleValidatePhone: function () {
        $('#mobile').blur(function () {
            var phone = $.trim($(this).val());

            module.service.validatePhone(phone);

            /*if (module.service.validatePhone(phone)) {
                var filter = [
                    {field: 'mobile', value: phone, operator: '=', relation: 'AND'}
                ];

                YT.query({
                    data: {
                        m: module.data.m,
                        t: 'v_customers_distinct',
                        filter: JSON.stringify(filter)
                    },
                    successCallback: function (data) {
                        if (200 == data.status) {
                            if (data.object.length == 1) {
                                $.alert('手机号已存在', function () {
                                    var item = data.object[0];
                                    module.data.customer_id = item.id;
                                    module.service.initCustomerVal(item);
                                    $('#name,#position,#department,#wechat,#remark').attr('readonly', 'readonly').addClass("color_gray");
                                    $('#source,#recommend').attr('disabled', 'disabled').addClass("color_gray");
                                });
                            } else {
                                $('#name,#position,#department,#wechat,#remark').removeAttr('readonly', 'readonly').removeClass("color_gray");
                                $('#source,#recommend').removeAttr('disabled', 'disabled').removeClass("color_gray");
                            }
                        } else {
                            $.alert(data.message);
                        }
                    }
                });
            }*/
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});


