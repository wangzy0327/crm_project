var module = {};

module.data = {};
module.service = {
    initControls: function () {
        oauth2();
        module.data.user_id = getUrlParam("userid");
        this.initDom();
    },

    initDom: function () {
        var self = this;

        $.showLoading('加载中...');

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
                    module.data.user_info = data;
                    self.initGroupsList();
                }
            }
        });
    },

    initGroupsList: function () {
        var self = this, module_d = module.data;

        this.getGroupsList(function (items) {
            var html = '';

            if (items.length) {
                html += '<div class="weui-cells">';
                for (var i in items) {
                    var item = items[i];
                    html += '<a class="weui-cell weui-cell_access detail" data-id="' + item.groupId + '" data-name="' + item.groupName + '">';
                    html += '<div class="weui-cell__bd">';
                    html += '<p>' + self.formatGroupsTitle(item.groupName);
                    html += '</p></div>';
                    html += '<div class="weui-cell__ft">';
                    html += '<span style="font-size: 13px;color:#666;">成员数：</span>';
                    html += '<span>' + item.staffCount + '</span>，';
                    html += '<span style="font-size: 13px;color:#666;">资料数：</span>';
                    html += '<span>' + item.messageCount + '</span>';
                    html += '</div>';
                    html += '</a>';
                }

                html += '</div>';
            }

            $('#groups-list').empty();
            $('#groups-list').append(html);
            $.hideLoading();
        });
    },

    getGroupsList: function (callback) {
        var self = this;
        $.ajax({
            type: 'get',
            url: "/group/self?userId="+module.data.user_id,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            error: function (request) {
            },
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    var groupDetails = data.groupDetails;
                    if(groupDetails.length === 1){
                        var href = module.service.redirectTo(groupDetails.groupId);
                        if(href !== ''){
                            window.location.href = href;
                        }
                    }else{
                        callback(data.groupDetails);
                    }
                }else{
                    $.alert(result.msg);
                }
            }
        });
    },

    formatGroupsTitle: function (value) {
        if (value.length > 10) {
            value = value.substr(0, 10) + '...';
        }
        return value;
    },
    redirectTo:function(id){
        var url=window.location.href,type='-1';
        if(url.indexOf('/module/customer-list/customer-list.html') !== -1){
            type='0';
        }else if(url.indexOf('/module/map/Map.html') !== -1){
            type='1';
        }else if(url.indexOf('/module/diagnosis/diagnosis.html') !== -1){
            type='2';
        }else if(url.indexOf('/module/rank/fighting-rank.html') !== -1){
            type='3';
        }else if(url.indexOf('/module/message/message-list.html') !== -1){
            type='4';
        }else if(url.indexOf('/module/statistics/message-statistics.html') !== -1){
            type='5';
        }
        if(''+type !== '-1'){
            var url = groupsUrl[''+type];
            var url1 = $.UrlUpdateParams(url,"userid",module.data.user_id);
            var url2 = $.UrlUpdateParams(url1,"groupid",id);
            return url2;
        }else{
            return '';
        }

    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleToDetail();
    },

    handleToDetail: function () {
        $('#groups-list').on('click', '.detail', function () {
            var self = this,href = module.service.redirectTo($(self).data('id'));
            if(href !== ''){
                window.location.href = href;
            }
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});