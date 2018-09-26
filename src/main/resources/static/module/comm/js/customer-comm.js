var CustomerComm = CustomerComm || {};

CustomerComm.comm = {

    // 请调用这个方法
    createCellsHtml: function (params) {
        var obj = $.extend({
                el: '',
                data: [],
                index: 0,
                // 是否显示详情（适用客户详情）
                detail: {
                    has: false,
                    params: {},
                    url: ''
                },
                // 是否显示"查看更多"
                more: {
                    has: false,
                    num: 3,
                    params: {},
                    url: ''
                },
                has_swiped: false, // 是否显示左滑删除
                cell_name_key: 'customer_name'
            }, params),
            el = obj.el, data = obj.data, detail_obj = obj.detail, more_obj = obj.more,
            has_detail = detail_obj.has, detail_params = detail_obj.params,
            has_more = more_obj.has, more_num = more_obj.num || 3, has_swiped = obj.has_swiped;

        var html = '', index = obj.index + 1;

        if ('' !== el) {
            for (var i in data) {
                var item = data[i];

                if (has_more && index > more_num) {
                    break;
                }

                if (has_swiped) {
                    html += '<div class="weui-cell weui-cell_swiped';
                } else {
                    if (has_detail) {
                        html += '<a href="javascript:;" class="weui-cell weui-cell_access';
                    } else {
                        html += '<div class="weui-cell';
                    }
                    if (has_detail) {
                        html += ' detail';
                    }
                    if (has_detail) {
                        for (var j in detail_params) {
                            var val = detail_params[j];
                            html += '" data-' + j + '="' + (item[val] || val);
                        }
                    }
                }

                html += '">';

                if (has_swiped) {
                    html += '<div class="weui-cell__bd';
                    if (has_detail) {
                        html += ' detail';
                    }
                    if (has_detail) {
                        for (var j in detail_params) {
                            var val = detail_params[j];
                            html += '" data-' + j + '="' + (item[val] || val);
                        }
                    }
                    html += '" style="transform: translate3d(0px, 0px, 0px);">';
                    html += '<div class="weui-cell">';
                }

                html += this.createCellHtml(index, item, obj.cell_name_key);

                if (has_swiped) {
                    html += '</div>';

                    // 左滑
                    html += '<div class="weui-cell__ft">';
                    html += '<a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout" href="javascript:">删除</a>';
                    html += '</div>';

                    html += '</div>';
                }

                html += '</div>';

                index++;
            }

            if (has_more && data.length > more_num) {
                html += '<a href="javascript:void(0);" class="weui-cell weui-cell_link searchMore">';
                html += '<div class="weui-cell__bd">查看更多</div>';
                html += '</a>';

                // 添加事件
                var more_url = more_obj.url;
                if (more_url) {
                    this.handleSearchMore(el, more_url, more_obj.params);
                }
            }

            //$(el).empty();
            $(el).append(html);

            // 添加点击事件
            if (has_detail) {
                // 适用客户详情
                this.handleToDetail(el, detail_obj.url || '/module/customer/customer-detail.html', detail_params);
            }

            // 添加左滑事件
            if (has_swiped) {
                $('.weui-cell_swiped').swipeout();
            }
        }
    },

    createCellHtml: function (index, data, cell_name_key) {
        var html = '', wx_avatar = data.avatar;

        // 排名
        html += '<div class="weui-cell__hd rank_sort">';
        switch (index) {
            case 1:
                html += this.createRankIconHtml('#icon-jichutubiao_jinpai');
                break;
            case 2:
                html += this.createRankIconHtml('#icon-jichutubiao_jinpaifuben');
                break;
            case 3:
                html += this.createRankIconHtml('#icon-jichutubiao_jinpaifuben1');
                break;
            default:
                html += '<div class="cell_num">' + index + '</div>';
                break;
        }
        html += '</div>';

        // 头像
        if (wx_avatar !== undefined) {
            html += '<div class="weui-cell__hd">';
            html += (wx_avatar ? '<img class="cell_img" src="' + wx_avatar + '">' : '<i class="iconfont cell_icon">&#xe008;</i>');
            html += '</div>';
        }

        // 内容
        html += '<div class="weui-cell__bd">';
        html += '<p>' + (this.formatCellName(data[cell_name_key]) || '(未填写)') + '</p>';
        html += '</div>';
        html += '<div class="weui-cell__ft">';
        html += '<span style="font-size: 13px;color:#666;">次数：</span>';
        html += '<span style="color: red;">' + data.count + '</span>';
        html += '</div>';
        html += '</div>';

        return html;
    },

    createRankIconHtml: function (icon_name) {
        return '<svg aria-hidden="true" class="cell_svg"><use xlink:href="' + icon_name + '"></use></svg>';
    },

    handleSearchMore: function (el, url, more_params) {
        $(el).on('click', '.searchMore', function () {
            more_params.t = new Date().getTime();
            window.location.href = url + YT.setUrlParams(more_params);
        });
    },

    handleToDetail: function (el, url, detail_params) {
        $(el).on('click', '.detail', function () {
            var url_params = {};
            for (var i in detail_params) {
                url_params[i] = $(this).data(i);
            }
            url_params.t = new Date().getTime();
            window.location.href = url + YT.setUrlParams(url_params);
        });
    },

    formatCellName: function (value) {
        if (value !== undefined && value.length > 10) {
            value = value.substr(0, 5) + '...' + value.substr(value.length - 5, value.length);
        }
        return value;
    }
};

CustomerComm.customer = {

    el: '#customer-info',

    init: function (hasDisabled) {
        this.createCustomerHtml(hasDisabled);
        this.handleValidateMobile();
    },

    createCustomerHtml: function (hasDisabled) {
        var html = '';

        // 开始
        html += '<div class="weui-cells weui-cells_form">';

        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__hd"><label class="weui-label">姓名</label></div>';
        html += '<div class="weui-cell__bd">';
        html += '<input class="weui-input" type="text" maxlength="15" placeholder="请输入姓名" id="name">';
        html += '</div>';
        html += '</div>';

        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__hd"><label class="weui-label">手机号</label></div>';
        html += '<div class="weui-cell__bd">';
        html += '<input class="weui-input" type="number" pattern="[0-9]*" placeholder="请输入手机号" id="mobile">';
        html += '</div>';
        html += '</div>';

        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__hd"><label class="weui-label">邮箱</label></div>';
        html += '<div class="weui-cell__bd">';
        html += '<input class="weui-input" type="text" maxlength="30" placeholder="请输入邮箱" id="email">';
        html += '</div>';
        html += '</div>';

        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__hd"><label class="weui-label">微信号</label></div>';
        html += '<div class="weui-cell__bd">';
        html += '<input class="weui-input" type="text" maxlength="15" placeholder="请输入微信号" id="wechat">';
        html += '</div>';
        html += '</div>';

        // 结束
        html += '</div>';

        // 开始
        html += '<div class="weui-cells weui-cells_form">';

        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__hd"><label class="weui-label">公司</label></div>';
        html += '<div class="weui-cell__bd">';
        html += '<input class="weui-input" type="text" maxlength="20" placeholder="请输入公司" id="department">';
        html += '</div>';
        html += '</div>';

        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__hd"><label class="weui-label">职位</label></div>';
        html += '<div class="weui-cell__bd">';
        html += '<input class="weui-input" type="text" maxlength="15" placeholder="请输入职位" id="position">';
        html += '</div>';
        html += '</div>';

        // 结束
        html += '</div>';

        // 开始
        html += '<div class="weui-cells weui-cells_form">';

        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__hd"><label class="weui-label">地址</label></div>';
        html += '<div class="weui-cell__bd">';
        html += '<input class="weui-input" type="text" maxlength="50" placeholder="请输入地址" id="address">';
        html += '</div>';
        html += '</div>';

        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__hd"><label class="weui-label">座机</label></div>';
        html += '<div class="weui-cell__bd">';
        html += '<input class="weui-input" type="text" maxlength="15" placeholder="请输入座机" id="telephone">';
        html += '</div>';
        html += '</div>';

        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__hd"><label class="weui-label">传真</label></div>';
        html += '<div class="weui-cell__bd">';
        html += '<input class="weui-input" type="text" maxlength="15" placeholder="请输入传真" id="fax">';
        html += '</div>';
        html += '</div>';

        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__hd"><label class="weui-label">网址</label></div>';
        html += '<div class="weui-cell__bd">';
        html += '<input class="weui-input" type="text" maxlength="30" placeholder="请输入网址" id="webSite">';
        html += '</div>';
        html += '</div>';

        // 结束
        html += '</div>';

        // 开始
        html += '<div class="weui-cells__title">备注</div>';
        html += '<div class="weui-cells weui-cells_form">';
        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__hd" style="flex: 1;">';
        html += '<textarea class="weui-textarea" placeholder="请输入备注" rows="3" id="remark"></textarea>';
        html += '</div>';
        html += '</div>';

        // 结束
        html += '</div>';

        html += '<div style="height: 80px;width: 100%;"></div>';

        // 底部内容
        html += '<div style="position: fixed;bottom: 0;width: 100%;">';
        html += '<div class="weui-btn-area"><a class="weui-btn ';
        if (hasDisabled) {
            html += 'weui-btn_disabled weui-btn_default';
        } else {
            html += 'weui-btn_primary';
        }
        html += '" href="javascript:;" id="btn-save">保存</a></div>';
        html += '</div>';

        $(this.el).append(html);
    },

    initCustomerData: function (customer_id) {
        this.getCustomerData(customer_id, function (data) {
            var mobile = data.mobile;
            $('#name').val(data.name);
            $('#mobile').val(mobile).data('val', mobile);
            $('#email').val(data.email);
            $('#wechat').val(data.wechat);
            $('#department').val(data.department);
            $('#position').val(data.position);
            $('#address').val(data.address);
            $('#telephone').val(data.telephone);
            $('#fax').val(data.fax);
            $('#webSite').val(data.webSite);
            $('#remark').val(data.remark);
        });
    },

    getCustomerData: function (customer_id, callback) {
        var filter = [
            {field: 'id', value: customer_id, operator: '=', relation: 'and'}
        ];

        var data = {
            m: 1010000,
            t: 'customers',
            filter: JSON.stringify(filter)
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    callback(data.object[0]);
                }
            }
        });
    },

    validateMobile: function (mobile, callback) {
        var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$/i;
        if (mobile) {
            if (/^1\d{10}$/i.test(mobile)) {
                callback && callback();
            } else {
                $.alert('手机号格式不正确！');
            }
        }
    },

    validatePostData: function (callback) {
        var self = this, data = this.getPostData(), name = data.name, mobile = data.mobile,
            mobile_val = $('#mobile').data('val');

        if (name || mobile) {
            if (mobile) {
                self.validateMobile(mobile, function () {
                    self.ajaxGetMobile(mobile_val, mobile, function (mobileData) {
                        if (mobileData.length == 0) {
                            callback && callback(data);
                        } else {
                            $.alert('手机号已注册，请重新填写！');
                        }
                    });
                });
            } else {
                callback && callback(data);
            }

        } else {
            $.alert('姓名、手机号有一项必填！');
        }
    },

    getPostData: function () {
        var name = $('#name').val() || '';
        var mobile = $('#mobile').val() || '';
        var email = $('#email').val() || '';
        var wechat = $('#wechat').val() || '';
        var department = $('#department').val() || '';
        var position = $('#position').val() || '';
        var address = $('#address').val() || '';
        var telephone = $('#telephone').val() || '';
        var fax = $('#fax').val() || '';
        var webSite = $('#webSite').val() || '';
        var remark = $('#remark').val() || '';

        return {
            name: name,
            mobile: mobile,
            email: email,
            wechat: wechat,
            department: department,
            position: position,
            address: address,
            telephone: telephone,
            fax: fax,
            webSite: webSite,
            remark: remark
        }
    },

    ajaxGetMobile: function (mobile_val, mobile, callback) {
        var filter = [
            {field: 'mobile', value: mobile, operator: '=', relation: 'and'},
            {field: 'corpid', value: YT.getCorpId(), operator: '=', relation: 'and'}
        ];

        if (mobile_val) {
            filter.push({field: 'mobile', value: mobile_val, operator: '<>', relation: 'and'});
        }

        YT.query({
            data: {
                m: 1010000,
                t: 'v_customers_distinct',
                filter: JSON.stringify(filter)
            },
            successCallback: function (data) {
                if (200 == data.status) {
                    callback(data.object);
                }
            }
        });
    },

    ajaxPostAdd: function (postData) {
        $.showLoading('数据提交中...');

        var data = {
            m: 1010000,
            t: 'customers',
            v: JSON.stringify([{
                t: 'customers',
                data: postData,
                ai: true
            }])
        };

        YT.insert({
            data: data,
            loading: false,
            successCallback: function (data) {
                $.hideLoading();
                if (200 == data.status) {
                    $.alert('提交成功！', function () {
                        window.location.href = YT.server + '/module/optimization/optimization.html' + YT.setUrlParams();
                    });
                } else {
                    $.alert('提交失败！');
                }
            }
        });
    },

    ajaxPostEdit: function (customer_id, postData) {
        $.showLoading('数据提交中...');

        var filter = [
            {field: 'id', value: customer_id, operator: '=', relation: 'AND'}
        ];

        var data = {
            m: 1010000,
            t: 'customers',
            v: JSON.stringify([{
                t: 'customers',
                data: postData,
                filter: filter
            }])
        };

        YT.update({
            data: data,
            loading: false,
            successCallback: function (data) {
                $.hideLoading();
                if (200 == data.status) {
                    $('#btn-save').addClass('weui-btn_disabled weui-btn_default').removeClass('weui-btn_primary');
                    $.alert('提交成功！');
                } else {
                    $.alert('提交失败！');
                }
            }
        });
    },

    handleValidateMobile: function () {
        var self = this;
        $(document.body).on('blur', '#mobile', function () {
            self.validateMobile($(this).val());
        });
    },

    handleInputChange: function () {
        $(document.body).on('change', 'input', function () {
            $('#btn-save').removeClass('weui-btn_disabled weui-btn_default').addClass('weui-btn_primary');
        });
    },

    handleAjaxPostAdd: function () {
        var self = this;
        $(document.body).on('click', '#btn-save', function () {
            self.validatePostData(function (data) {
                self.ajaxPostAdd(data);
            });
        });
    },

    handleAjaxPostEdit: function (customer_id) {
        var self = this;
        $(document.body).on('click', '#btn-save', function () {
            if (!$(this).hasClass('weui-btn_disabled')) {
                self.validatePostData(function (data) {
                    self.ajaxPostEdit(customer_id, data);
                });
            }
        });
    }
};

function pushHistory(url, params) {
    window.addEventListener("popstate", function (e) {
        //alert("回退！");

        //window.history.back();
        //在历史记录中后退,这就像用户点击浏览器的后退按钮一样。

        //window.history.go(-1);
        //你可以使用go()方法从当前会话的历史记录中加载页面（当前页面位置索引值为0，上一页就是-1，下一页为1）。

        //self.location = document.referrer;
        //可以获取前一页面的URL地址的方法,并返回上一页。
        params.t = new Date().getTime();
        window.location.href = YT.server + url + YT.setUrlParams(params);
    }, false);
    var state = {
        title: "",
        url: "#"
    };
    window.history.pushState(state, "", "#");
};