var module = {};

module.data = {
    m: 1010000
};

var pager = {
    loading: false,
    page: 1,
    rows: 10
};

module.service = {

    initControls: function () {
        var self = this;
        YT.getUserInfo(function (data) {
            module.data.staff_id = data.id;
            self.initSearch();
        });
    },

    initList: function (data) {
        var noMore =
            '<div  id="noMore" style="margin-top: 10px;text-align: center;">' +
            '无更多记录' +
            '</div> ';

        YT.query({
            url: YT.server + "/queryCustomer.action",
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    if (pager.page == 1) {
                        $("#noMore").remove();
                    }

                    var items = data.object.items, html = '';
                    pager.page = data.object.idx + 1;

                    /**
                     * visit  0正常 1已填写计划未拜访 2已拜访 3未正常拜访
                     * status 0已忽略 1正常 2置顶
                     */

                    for (var i in items) {
                        var item = items[i],
                            customer_id = item.customer_id,
                            customer_name = item.customer_name,
                            company = item.customer_department,
                            addStaffId = item.addStaffId,
                            visit = item.visit,
                            status = item.status,
                            visit_plan_time = item.visit_plan_time,
                            visitVal = '', visitClass = '',
                            topVal = '', topClass = '';

                        html += '<div class="weui-form-preview" style="margin-top: 10px;">';

                        // 顶部
                        html += '<div class="weui-form-preview__hd name-narrow">';
                        html += '<label  class="weui-form-preview__label">';
                        // 拜访标签
                        if (visit == 1) {
                            visitVal = '&nbsp;未拜访&nbsp;';
                            visitClass = "first-background-green";
                        } else if (visit == 2) {
                            visitVal = '&nbsp;已拜访&nbsp;';
                            visitClass = "visited-background-red";
                        } else if (visit == 3) {
                            visitVal = '&nbsp;未拜访&nbsp;';
                            visitClass = "visited-background-gray";
                        }
                        if (status && visitVal) {
                            html += '<span class="' + visitClass + '">' + visitVal + '</span>&nbsp;&nbsp;';
                        }

                        // 置顶忽略标签
                        if (status == 2) {
                            topVal = '&nbsp;置顶&nbsp;';
                            topClass = 'first-background-blue';
                        } else if (status == 0) {
                            topVal = '&nbsp;已忽略&nbsp;';
                            topClass = 'ignore-background-orange';
                        }
                        if (topVal) {
                            html += '<span class="' + topClass + '">' + topVal + '</span>&nbsp;&nbsp;';
                        }

                        // 自己添加的标*
                        if (addStaffId == module.data.staff_id) {
                            html += '<span style="color: red">*</span>';
                        }

                        html += customer_name + '</label>';
                        html += '<em class="weui-form-preview__value" style="text-align: right">';

                        // 编辑图标 只能编辑自己添加的客户、已忽略的不可编辑
                        if (status && addStaffId == module.data.staff_id) {
                            html += '<a href="javascript:void(0);" data-id="' + customer_id + '" class="edit icon-active icon-narrow " >';
                            html += '<i class="iconfont " style="color: #1afa29">&#xe001;</i>';
                            html += '</a>';
                        }

                        // 已忽略图标
                        html += '<a href="javascript:void(0);" data-id="' + customer_id + '" data-status="' + status + '" class="normal icon-active icon-narrow " >';
                        if (status == 0) {
                            html += '<i class="iconfont"  style="color:#666">&#xe002;</i>';
                        } else {
                            html += '<i class="iconfont " style="color:#FFA500">&#xe002;</i>';
                        }
                        html += '</a>';

                        // 置顶图标
                        html += '<a href="javascript:void(0);" data-id="' + customer_id + '" data-status="' + status + '" class="top icon-active icon-narrow " >';
                        if (status == 2) {
                            html += '<i class="iconfont " style="color:#666">&#xe63a;</i>';
                        } else {
                            html += '<i class="iconfont " style="color:#1e90ff">&#xe003;</i>';
                        }
                        html += '</a>';

                        html += '&nbsp;</em></div>';

                        // 主体
                        html += '<div class="weui-form-preview__bd">';
                        html += '<div class="detail-background detail" data-id=' + customer_id + '>';
                        html += '<div class="weui-form-preview__item">';
                        html += '<label class="weui-form-preview__label">供职单位</label>';
                        html += '<span class="weui-form-preview__value">' + (company || '') + '</span>';
                        html += '</div>';
                        html += '<div class="weui-form-preview__item">';
                        html += '<label class="weui-form-preview__label">工作地址</label>';
                        html += '<span class="weui-form-preview__value">' + (item.visit_plan_location || '') + '</span>';
                        html += '</div>';
                        html += '<div class="weui-form-preview__item">';
                        html += '<label class="weui-form-preview__label">联系方式</label>';
                        html += '<span class="weui-form-preview__value">' + (item.customer_phone || '') + '</span>';
                        html += '</div>';
                        html += '<div class="weui-form-preview__item">';
                        html += '<label class="weui-form-preview__label">拜访时间</label>';
                        html += '<span class="weui-form-preview__value">' + common.visit.format(visit_plan_time, visit) + '</span>';
                        html += '</div>';
                        html += '</div>';

                        // 底部按钮
                        html += '<div class="weui-form-preview__ft">';
                        html += '<a class="weui-form-preview__btn weui-form-preview__btn_default" ';
                        if (status/* && visit != 1*/) {
                            html += 'href="new-visit-plan.html' + YT.setUrlParams({
                                    customer_id: customer_id,
                                    customer_name: customer_name,
                                    company: company
                                }) + '"';
                        } else {
                            html += 'style="background-color:#ececec;"';
                        }
                        html += '>填写拜访计划</a>';
                        html += '<a class="weui-form-preview__btn weui-form-preview__btn_default" ';
                        if (status/* && visit == 1*/) {
                            html += 'href="visit-log.html' + YT.setUrlParams({
                                    customer_id: customer_id,
                                    customer_name: customer_name,
                                    company: company,
                                    visit_plan_time: new Date(visit_plan_time).Format('yyyy-MM-dd hh:mm:ss')
                                }) + '"';
                        } else {
                            html += 'style="background-color:#ececec;"';
                        }
                        html += '>填写拜访记录</a>';
                        html += '</div>';

                        html += '</div>';
                        html += '</div>';

                    }

                    $("#list").append(html);

                    if (data.object.idx >= data.object.pageCount) {
                        //最后一页
                        pager.loading = true;
                        $('#infinite').remove();
                        $("#list").append(noMore);
                        return;
                    }
                } else {
                    $.alert(data.message);
                }
                pager.loading = false;
            }
        });
    },

    // 初始化列表
    initSearch: function () {
        var data = {
            staff_id: module.data.staff_id,
            /**
             * 列表按"置顶、未拜访、已拜访、未拜访（超时）、忽略、无标志" 降序排列
             *
             * visit  0正常 1已填写计划未拜访 2已拜访 3未正常拜访
             * status 0已忽略 1正常 2置顶
             */
            order: 'field(status,2,0,1),field(visit,1,2,3,0)',
            page: pager.page,
            rows: pager.rows
        };

        module.service.initList(data);
    },

    updateStatus: function (ele, status) {
        var filter = [
            {field: 'staff_id', value: module.data.staff_id, operator: '=', relation: 'AND'},
            {field: 'customer_id', value: $(ele).data('id'), operator: '=', relation: 'AND'}
        ];

        var info = {
            data: {
                status: status,
                update_time: new Date().Format('yyyy-MM-dd hh:mm:ss')
            },
            filter: filter
        };

        var data = {
            m: module.data.m,
            t: 'staff_customers_relation',
            v: JSON.stringify([info])
        };

        YT.update({
            data: data,
            successCallback: function (data) {
                if (data.status == 200) {
                    // 初始化分页
                    /*$('#list div').remove();
                     $("#noMore").remove();
                     pager = {
                     loading: false,
                     page: 1,
                     rows: 10
                     };
                     module.service.initSearch();*/
                    location.href = 'client-frequent.html' + YT.setUrlParams();
                } else {
                    $.alert(data.message);
                }
            }
        });
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleInfinite();
        this.handleBtnEdit(); // 编辑
        this.handleBtnNormal(); // 忽略操作
        this.handleBtnTop(); // 置顶操作
        this.handleToDetail(); // 查看详情
    },

    // 滚动加载
    handleInfinite: function () {
        $(document.body).infinite().on("infinite", function () {
            if (pager.loading) return;
            pager.loading = true;
            module.service.initSearch();
        });
    },

    handleBtnEdit: function () {
        $('#list').on('click', '.edit', function () {
            window.location.href = '/module/new-customer/new-customer.html' + YT.setUrlParams({customer_id: $(this).data('id')});
        });
    },

    handleBtnNormal: function () {
        $('#list').on('click', '.normal', function () {
            module.service.updateStatus($(this), $(this).data('status') == 0 ? 1 : 0);
        });
    },

    handleBtnTop: function () {
        $('#list').on('click', '.top', function () {
            pager.loading = true;
            module.service.updateStatus($(this), $(this).data('status') == 2 ? 1 : 2);
        });
    },

    handleToDetail: function () {
        $('#list').on('click', '.detail', function () {
            window.location.href = 'visit-detail-plan.html' + YT.setUrlParams({customer_id: $(this).data('id')});
        });
    }
};

$(function () {
    // todo 企业微信点击返回，查询staff_id查询不对，需要延时加载
    setTimeout(function () {
        module.service.initControls();
        module.eventHandler.handleEvents();
        $(document.body).infinite();
    }, 500);
});