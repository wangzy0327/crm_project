var editCustomer = {
    callback:function () {
        
    },

    init: function (e,customerData) {
        this.ele = e || '#btn-save'; // 隐藏的保存按钮，不是事件源
        this.customerData = customerData;
        this.createPopupHtml();
        this.initForm();
        this.handleSaveBtn();
        this.handleClearBtn();
        this.handleCloseBtn();
    },

    initForm: function () {
        var data = [
            {id: 'mobile', name: '手机号', type: 'number', p_name: 'pattern', p_val: '[0-9]*'},
            {id: 'name', name: '姓名', type: 'text', p_name: 'maxlength', p_val: '8'},
            {id: 'wechat', name: '微信号', type: 'text', p_name: 'maxlength', p_val: '30'},
            {id: 'department', name: '公司', type: 'text', p_name: 'maxlength', p_val: '30'},
            {id: 'position', name: '职位', type: 'text', p_name: 'maxlength', p_val: '20'},
            {id: 'address', name: '地址', type: 'text', p_name: 'maxlength', p_val: '50'},
            {id: 'telephone', name: '座机', type: 'text', p_name: 'maxlength', p_val: '13'},
            {id: 'email', name: '邮箱', type: 'text', p_name: 'maxlength', p_val: '30'},
            {id: 'website', name: '网址', type: 'text', p_name: 'maxlength', p_val: '50'},
            {id: 'fax', name: '传真', type: 'text', p_name: 'maxlength', p_val: '30'}
        ];

        var $form = $('#form_customer');
        $form.children().remove();
        $form.append(this.createFormHtml(data));
        this.setCustomerVal(this.customerData);
    },

    triggerSaveBtn: function () {
        $(this.ele).triggerHandler('click');
    },

    handleSaveBtn: function () {
        var self = this;
        $(this.ele).click(function () {
            self.validateData();
        });
    },


    // 重置事件
    handleClearBtn: function () {
        var self = this;
        $('#btn-clear').click(function () {
            self.setCustomerVal(self.customerData);
        });
    },

    // 关闭事件
    handleCloseBtn: function () {
        var self = this;
        $('#btn-close').click(function () {
            self.customerData = {};
            $.closePopup('#popup_choose');
        });
    },

    validateData: function () {
        var self = this,
            postData = self.validateDataChange(),
            mobile = postData.obj.mobile,
            customer_id = self.customerData.id;

        if (customer_id){
            if(postData.isChange) {
                if (mobile) {
                    var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/i;
                    reg = /^1\d{10}$/i;
                    var obj = self.getCustomerVal();
                    obj['id'] = customer_id;
                    console.log("id:"+obj['id']);
                    console.log("name:"+obj['name']);
                    if (reg.test(mobile)) {
                        $.ajax({
                            type: 'put',
                            url: "/customer/update",
                            contentType: "application/json;charset=UTF-8",
                            data: JSON.stringify(obj),
                            dataType: 'json',
                            error: function (request) {

                            },
                            success: function (result) {
                                if (result.code == 0) {
                                    $.alert('保存成功！', function () {
                                        self.callback();
                                    });
                                }
                            }
                        });
                    } else {
                        $.alert('手机号格式不正确！');
                    }
                } else {
                    $.alert('手机号必须填写！');
                }
            } else {
                $.alert('未修改数据！');
            }
        }else{
            $.alert('获取数据出错，请关闭弹框重新进入！');
        }
    },

    validateDataChange: function () {
        var self = this,
            obj = self.getCustomerVal(),
            customer_data = self.customerData,
            customer_mobile = customer_data.mobile,
            customer_name = customer_data.name || '',
            customer_position = customer_data.position || '',
            customer_department = customer_data.department || '',
            customer_wechat = customer_data.wechat || '',
            customer_address = customer_data.address || '',
            customer_telephone = customer_data.telephone || '',
            customer_email = customer_data.email || '',
            customer_webSite = customer_data.website || '',
            customer_fax = customer_data.fax || '',
            customer_remark = customer_data.remark || '';

        if (obj.mobile == customer_mobile && obj.name == customer_name && obj.position == customer_position &&
            obj.department == customer_department && obj.wechat == customer_wechat && obj.address == customer_address &&
            obj.telephone == customer_telephone && obj.email == customer_email && obj.website == customer_webSite &&
            obj.fax == customer_fax && obj.remark == customer_remark) {
            return {
                obj: obj,
                isChange: false
            };
        } else {
            return {
                obj: obj,
                isChange: true
            };
        }
    },

    getCustomerVal: function () {
        var mobile = $('#mobile').val();
        var name = $.trim($('#name').val());
        var position = $.trim($('#position').val());
        var company = $.trim($('#department').val());
        var wechat = $.trim($('#wechat').val());
        var address = $.trim($('#address').val());
        var telephone = $('#telephone').val();
        var email = $.trim($('#email').val());
        var website = $.trim($('#website').val());
        var fax = $.trim($('#fax').val());
        var remark = $.trim($('#remark').val());

        return {
            mobile: mobile,
            name: name,
            position: position,
            company: company,
            wechat: wechat,
            address: address,
            telephone: telephone,
            email: email,
            website: website,
            fax: fax,
            remark: remark
        }
    },

    setCustomerVal: function (data) {
        var obj = $.extend({
            mobile: '',
            name: '',
            position: '',
            department: '',
            wechat: '',
            address: '',
            telephone: '',
            email: '',
            website: '',
            fax: '',
            remark: ''
        }, data);

        console.log(data);

        $('#mobile').val(obj.mobile);
        $('#name').val(obj.name);
        $('#position').val(obj.position);
        $('#department').val(obj.company);
        $('#wechat').val(obj.wechat);
        $('#address').val(obj.address);
        $('#telephone').val(obj.telephone);
        $('#email').val(obj.email);
        $('#website').val(obj.website);
        $('#fax').val(obj.fax);
        $('#remark').val(obj.remark);
    },

    ajaxData: function () {
        var self = this, v = [],
            obj = self.getCustomerVal(),
            customer_id = self.customerData.id;

        if (customer_id) {
            // 添加销售人员与客户关系
            var filter = [
                {field: 'id', value: customer_id, operator: '=', relation: 'AND'}
            ];

            v.push({
                t: 'customers',
                data: obj,
                filter: filter
            });

            YT.update({
                loading: false,
                data: {
                    m: self.m,
                    t: 'customers',
                    v: JSON.stringify(v)
                },
                successCallback: function (data) {
                    if (200 == data.status) {
                        // 清空数据
                        $.closePopup();
                        self.customerData = {};
                        self.setCustomerVal();
                        $.alert('保存成功！', function () {
                            self.callback();
                        });
                    } else {
                        $.alert('保存失败！');
                    }
                }
            });
        }
    },

    // 客户表单
    createFormHtml: function (data) {
        var html = '';

        /**
         * {
         *  id:     元素id
         *  name:   显示名称
         *  p_name: 附加属性
         *  p_val:  附加参数
         * }
         */

        for (var i in data) {
            var obj = data[i],
                name = obj.name,
                p_name = obj.p_name;
            html += '<div class="weui-cell weui-cell-input-cell">';
            html += '<div class="weui-cell__hd"><label class="weui-label">' + name + '</label></div>';
            html += '<div class="weui-cell__bd">';
            html += '<input id="' + obj.id + '" class="weui-input" type="' + obj.type + '" placeholder="请输入' + name + '"';
            if (p_name) {
                html += ' ' + p_name + '="' + obj.p_val + '"';
            }
            html += '>';
            html += '</div>';
            html += '</div>';
        }

        return html;
    },

    // 客户Popup
    createPopupHtml: function () {
        var html = '';

        html += '<div id="popup_customer" class="weui-popup__container">';
        html += '<div class="weui-popup__overlay"></div>';
        html += '<div class="weui-popup__modal">';
        html += '<div class="toolbar">';
        html += '<div class="toolbar-inner">';
        html += '<a href="javascript:;" class="picker-button close-popup" style="position: relative;">关闭</a>';
        html += '<a href="javascript:;" class="picker-button" id="toolbar-save">保存</a>';
        html += '<h1 class="title">填写客户</h1>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-content">';
        html += '<div class="weui-cells weui-cells_form" id="form_customer">';

        html += '</div>';
        html += '<div class="weui-cells__title">备注</div>';
        html += '<div class="weui-cells weui-cells_form">';
        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__bd">';
        html += '<textarea id="remark" class="weui-textarea" placeholder="请输入备注" rows="3"></textarea>';

        html += '<div class="weui-textarea-counter"><span>0</span>/200</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="weui-btn-area box">';
        html += '<a class="weui-btn weui-btn_primary" id="save" href="javascript:;">保存</a>';
        html += '<a class="weui-btn weui-btn_default" id="btn-clear" href="javascript:;">重置</a>';
        html += '<a id="btn-save"></a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        $(document).find('body').append(html);
    }

};