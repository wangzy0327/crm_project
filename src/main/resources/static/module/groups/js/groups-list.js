var module = {};

module.data = {
    m: 400000000
};

module.service = {
    initControls: function () {
        this.initDom();
    },

    initDom: function () {
        var self = this;

        $.showLoading('加载中...');

        YT.getUserInfo(function (userInfo) {
            module.data.userInfo = userInfo;
            self.initGroupsList();
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
                    html += '<a class="weui-cell weui-cell_access detail" data-id="' + item.id + '" data-name="' + item.name + '">';
                    html += '<div class="weui-cell__bd">';
                    html += '<p>' + self.formatGroupsTitle(item.name);
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
        var self = this, module_d = module.data;

        var filter = [
            {field: 'corpid', value: module_d.userInfo.corpid, operator: '=', relation: 'and'},
            {field: 'staff_id', value: module_d.userInfo.id, operator: '=', relation: 'and'}
        ];

        var data = {
            m: module_d.m,
            t: 'v_groups_m',
            filter: JSON.stringify(filter),
            order: 'def_group desc,id ASC '
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    if(data.object.length === 1){
                        var href = module.service.redirectTo(data.object[0].id);
                        if(href !== ''){
                            window.location.href = href;
                        }
                    }else{
                        callback(data.object);
                    }
                } else {
                    $.alert(data.message);
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
            return groupsUrl[''+type] + YT.setUrlParams({
                tkt: YT.getUrlParam('tkt'),
                corpid: YT.getUrlParam('corpid'),
                groupid:id
            });
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