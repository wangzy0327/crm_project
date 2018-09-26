var listManager = {};

listManager.data = {
    typeTab: [],
    order: 'update_time desc',
    userid:getUrlParam("userid"),
    groupid:getUrlParam("groupid")
};

var pager = {
    loading: false,
    page: 1,
    size: 15
};

$(function () {
    $(document.body).infinite(100);
    listManager.service.initControls();
    listManager.eventHandler.handleEvents();
});

listManager.service = {
    initControls: function () {
        this.initGrid();
        this.initTagData();
    },

    cutStr: function (str, length) {
        if (str != null && str !== undefined) {
            if (str.length <= length) {
                return str;
            } else {
                return str.substr(0, length) + "...";
            }
        } else {
            return "";
        }
    },

    // 初始化列表
    initGrid: function (otherFilter) {
        var noMore =
            '<div  id="noMore" style="margin-top: 10px;text-align: center;">' +
            '无更多记录' +
            '</div> ';

        var postData = this.initSearch(otherFilter);
        $.ajax({
            type: 'post',
            url: "/message/list",
            data:JSON.stringify(postData),
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if (result.code == 0) {
                    var data = result.data;
                    console.log("data.length:"+data.length);
                    if (data.length > 0) {
                        listManager.service.getMessageStr(data);
                    }
                    else {
                        $("#more").html(noMore);
                        pager.loading = true;
                        console.log("pager.loading:   "+pager.loading);
                    }
                    $(".weui-loadmore").hide();
                }
            }
        });

    },

    getMessageStr :function(data){
        var html = "";
        for (var i = 0; i < data.length; i++) {
            var id = data[i].id;
            var titleData = data[i].titleText;
            var personCreate = data[i].createUserName;
            var dateCreate = new Date(data[i].updateTime).Format("yyyy-MM-dd");
            var openCount = data[i].openCount;
            if (openCount == null || openCount == '') {
                openCount = 0;
            }
            html += '<a class="weui-cell weui-cell_access detail" data-id="' + id + '" data-type="' + data[i].msgType + '" href="javascript:;"> ' +
                '<div class="weui-cell__bd"> ' +
                '<p>' + listManager.service.cutStr(titleData, 8) + '(<span style="font-size: 15px;color:#666666;">' +
                personCreate + '</span>&nbsp;&nbsp;<span style="font-size: 13px;color:#666666;">' +
                dateCreate + '</span>)</p> ' +
                '</div> ' +
                '<div class="weui-cell__ft"> ' +
                '<span style="font-size: 13px;color:#666666;">点击热度：</span><span style="color:red;">' +
                openCount + '</span>' +
                '</div> ' +
                '</a>';
        }
        $('#list').append(html);
    },

    // 热门标签
    initTagData: function () {
        $.ajax({
            type: 'post',
            url: "/tag/hot",
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if (result.code == 0) {
                    var html = '<p style="font-size: 14px;color: #9e9e9e;margin-top: 15px;">暂无数据</p>';
                    var data = result.data;
                    if(data.length>0){
                        html = '';
                        var defaultClass = ['blue', 'green', 'orange', 'red', 'purple', 'grey'];
                        var tagClass = [].concat(defaultClass);

                        for (var i in data) {
                            var item = data[i];

                            if (tagClass.length == 0) {
                                tagClass = [].concat(defaultClass);
                            }
                            var index = Math.floor(Math.random() * tagClass.length);
                            var count = item.count > 99 ? '99+' : item.num;
                            html += '<i class="tag ' + tagClass.splice(index, 1)[0] + '" data-ids=' + item.id + ' data-shareIds= ' + item.share_id + '>' + item.name + ' ' + count + '</i>';
                        }
                    }
                    $('.tag-box').append(html);
                }
            }
        });
    },

    initSearch: function (otherFilter) {
        return {
            groupId:listManager.data.groupid,
            tagId:otherFilter,
            order:listManager.data.order,
            page:pager.page,
            size:pager.size
        };
    }
};

listManager.eventHandler = {
    handleEvents: function () {
        this.handleInfinite();
        this.handleDetail();
        this.handleTagBtn();
        this.handleSearchAllBtn();
        this.handleSortBtn();
        this.handlePopupToAdd();
    },

    handleInfinite: function () {
        $(document.body).infinite().on("infinite", function () {
            if (pager.loading) return;
            pager.loading = true;
            listManager.service.initGrid();
        });
    },

    handleDetail: function () {
        $('#list').on('click', '.detail', function () {
            var dataId = $(this).data('id'), msgType = +$(this).data('type'), url = '';

            // 1文章 2资料 3图片 4没有二维码图片 5H5 6平面
            switch (msgType) {
                case 1:
                case 3:
                case 4:
                    url = 'message-share.html';
                    break;
                case 2:
                    url = 'doc/doc-share.html';
                    break;
                case 5:
                    url = 'h5/h5-share.html';
                    break;
                case 6:
                    url = 'graphic/graphic-share.html';
                    break;
            }

            listManager.eventHandler.getUserInfo(function (user) {
                var url1 = $.UrlUpdateParams(url,"msgid",dataId);
                var url2 = $.UrlUpdateParams(url1,"userid",user.userid);
                location.href = url2;
                // window.location.href = url + YT.setUrlParams({
                //     d: dataId,
                //     s: 0,
                //     u: user.id
                // });
            });
        });
    },
    getUserInfo: function (callback) {
        var self = this;
        $.ajax({
            type: 'get',
            url: "/staff/self?userId="+listManager.data.userid,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log("id:"+data.userid);
                    console.log("name:"+data.name);
                    callback(data);
                }else{
                    $.alert(result.msg);
                }
            }
        });
    },

    handleTagBtn: function () {
        $('.tag-box').on('click', '.tag', function () {
            $('#list a').remove();
            $("#noMore").remove();
            pager = {
                loading: false,
                page: 1,
                size: 15
            };
            var $this = $(this);
            $this.addClass('action');
            $this.siblings().removeClass('action');
            listManager.service.initGrid($(this).data('ids'));
        });
    },

    handleSearchAllBtn: function () {
        $('.search_all').click(function () {
            //智库
            $('#list a').remove();
            $("#noMore").remove();
            $('.tag.action').removeClass('action');
            pager = {
                loading: false,
                page: 1,
                size: 15
            };
            listManager.service.initGrid();
        });
    },

    handleSortBtn: function () {
        $('.sort_time').click(function () {
            btnAction(this, 'update_time');
        });

        $('.sort_heat').click(function () {
            btnAction(this, 'open_count');
        });

        function btnAction(ele, str) {
            var $this = $(ele), order = $this.data('o');

            if ($this.hasClass('action')) {
                if (order == 'asc') {
                    order = 'desc';
                } else if (order == 'desc') {
                    order = 'asc';
                }
            }
            // 设置箭头方向
            if (order == 'desc') {
                // 下降
                $this.find('.iconfont').html('&#xe60e;');
            } else if (order == 'asc') {
                // 上升
                $this.find('.iconfont').html('&#xe60d;');
            }

            $this.addClass('action');
            $this.siblings().removeClass('action');
            $this.data('o', order);
            listManager.data.order = str + ' ' + order;

            // 刷新列表
            $('#list a').remove();
            $("#noMore").remove();
            pager = {
                loading: false,
                page: 1,
                size: 15
            };
            listManager.service.initGrid($('.tag.action').data('ids'));
        }
    },

    handlePopupToAdd: function () {
        $('.message-type').click(function () {
            var type = $(this).data('type'), url = '';
            switch (type) {
                case 2:
                    url = '/module/message/doc/doc-add.html';
                    break;
                case 5:
                    url = '/module/message/h5/h5-add.html';
                    break;
                case 6:
                    url = '/module/message/graphic/graphic-add.html';
                    break;
            }
            if (url !== '') {
                window.location.href = url + YT.setUrlParams({groupid: YT.getUrlParam('groupid')});
            }
        });
    }
};