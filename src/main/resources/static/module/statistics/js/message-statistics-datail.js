var listManager = {};

listManager.data = {
    m: 10220000,
    shareId: -1,
    staffData: {},
    staffDataArr: [],
    messageData: {},
    shareData: [],
    shareDataTwo:[],
    shareDataByDay: {},
    dayData: [],
    dataArrayMessage: [],
    frame: {},
    contentAttachPdf:[],
    currentPopId:-1
};
$(function () {
    listManager.service.initControls();
    listManager.eventHandler.handleEvents();
});
listManager.service = {
    initControls: function () {
        this.initData();
    },
    initData: function () {
        var self = this;
        // YT.query({
        //     data: {
        //         m: listManager.data.m,
        //         t: 'v_message_sta_detail',
        //         filter: JSON.stringify([
        //             {field: 'id', value: YT.getUrlParam("mId"), operator: '=', relation: 'AND'}
        //         ]),
        //         order: " shareTime desc"
        //     },
        //     successCallback: function (data) {
        //         if (data.status == 200) {
        //             if (data.object.length > 0) {
        //                 var list = data.object;
        //                 var staffMap = {};
        //                 listManager.data.messageData = {
        //                     id: list[0].id,
        //                     title: list[0].title,
        //                     type: list[0].type,
        //                     msgType: list[0].msgType,
        //                     description: list[0].description,
        //                     url: list[0].url
        //                 };
        //                 $('head title').html(self.cutStr(list[0].title, 16)+'-浏览记录');
        //                 for (var i = 0; i < list.length; i++) {
        //                     var share = {
        //                         staffId:list[i].staffId,
        //                         staff:list[i].staff,
        //                         shareId:list[i].shareId,
        //                         openCount:list[i].openCount || 0,
        //                         shareTime:new Date(list[i].shareTime).Format('yyyy-MM-dd') || '',
        //                         shareTime2:new Date(list[i].shareTime).Format('hh:mm') || '',
        //                         openTime:new Date(list[i].openTime).Format('yyyy-MM-dd') || ''
        //                     };
        //
        //                     if (share.shareTime && share.shareTime != '1970-01-01') {
        //                         if (listManager.data.shareDataByDay['' + share.shareTime]) {
        //                         } else {
        //                             listManager.data.dayData.push(share.shareTime);
        //                             listManager.data.shareDataByDay['' + share.shareTime] = [];
        //                         }
        //                         listManager.data.shareDataByDay[''+share.shareTime].push(share);
        //                     }else if(share.openTime && share.openTime != '1970-01-01'){
        //                         if(listManager.data.shareDataByDay[''+share.openTime]){
        //                         }else{
        //                             listManager.data.dayData.push(share.openTime);
        //                             listManager.data.shareDataByDay[''+share.openTime] = [];
        //                         }
        //                         listManager.data.shareDataByDay[''+share.openTime].push(share);
        //                     } else {
        //
        //                     }
        //
        //                     if (staffMap['' + share.staffId]) {
        //                         var count = listManager.data.staffData['' + share.staffId].openCount;
        //                         listManager.data.staffData['' + share.staffId].openCount = (share.openCount - 0 + count);
        //                     } else {
        //                         staffMap['' + share.staffId] = true;
        //                         listManager.data.staffData['' + share.staffId] = {
        //                             name: share.staff,
        //                             openCount: share.openCount
        //                         };
        //                     }
        //                 }
        //                 for (var staffId in listManager.data.staffData) {
        //                     listManager.data.staffDataArr.push(listManager.data.staffData['' + staffId]);
        //                 }
        //                 function compare(property) {
        //                     return function (a, b) {
        //                         var value1 = a[property];
        //                         var value2 = b[property];
        //                         return -(value1 - value2);
        //                     }
        //                 }
        //
        //                 listManager.data.staffDataArr.sort(compare('openCount'));
        //                 for (var k = 0; k < listManager.data.staffDataArr.length; k++) {
        //                     var staff_temp = listManager.data.staffDataArr[k];
        //                     $('.box-label').append('<span style="color:#009fcc;">' + staff_temp.name + '(' + staff_temp.openCount + ')&nbsp;&nbsp;</span>');
        //                 }
        //                 for (var m = 0; m < listManager.data.dayData.length; m++) {
        //                     var day = listManager.data.dayData[m];
        //                     $('.weui-panel').append('<div class="weui-panel__hd day_con">'+day+'</div>');
        //                     var shareList = listManager.data.shareDataByDay['' + day] || [];
        //                     for (var j = 0; j < shareList.length; j++) {
        //                         var shareData = shareList[j];
        //                         listManager.data.shareDataTwo.push(shareData.shareId);
        //                         var str = '<a href="javascript:void(0);" class="staff staff_'+shareData.shareId+'" data-id="'+shareData.shareId+'">' +
        //                             '<div class="weui-panel__hd staff_con">'+shareData.staff+'('+shareData.shareTime2+')</div>' +
        //                             '</a> ';
        //                         /*var str = '<div class="weui-media-box__bd"><a href="javascript:void(0);" class="weui-cell weui-cell_access weui-cell_link staff staff_'+shareData.shareId+'" data-id="'+shareData.shareId+'"> ' +
        //                             '<div class="weui-cell__bd staff_con">'+shareData.staff+'('+shareData.shareTime2+')</div>' +
        //                             '<span class="weui-cell__ft"></span> ' +
        //                             '</a></div>';*/
        //                         $('.weui-panel').append(str);
        //                     }
        //                 }
        //                 listManager.data.shareId = list[0].shareId;
        //
        //             } else {
        //                 YT.query({
        //                     data: {
        //                         m: listManager.data.m,
        //                         t: 'message',
        //                         filter: JSON.stringify([
        //                             {field: 'id', value: YT.getUrlParam("mId"), operator: '=', relation: 'AND'}
        //                         ])
        //                     },
        //                     successCallback: function (data) {
        //                         if (data.status == 200) {
        //                             if (data.object.length == 1) {
        //                                 listManager.data.messageData = {
        //                                     title: data.object[0].titleText,
        //                                     msgType: data.object[0].msgType,
        //                                     description: data.object[0].description,
        //                                     url: data.object[0].url
        //                                 };
        //                                 $('head title').html(self.cutStr(list[0].title, 16)+'-浏览记录');
        //                             }
        //                         }
        //                     }
        //                 });
        //             }
        //         }
        //     }
        // });
    },
    cutStr: function (str, length) {
        if (str.length <= length) {
            return str;
        } else {
            return str.substr(0, length) + "...";
        }
    },
    formatSeconds: function (value) {
        var second = value; // 秒
        var minute = second / 60; // 分
        var hour = minute / 60; // 小时
        var day = hour / 24; // 天
        var week = day / 7; // 周
        var _second = Math.floor(second % 60);
        var _minute = Math.floor(minute % 60);
        var _secondStr = _second == 0 ? '' : '' + (_second < 10 ? '0' + _second : _second) + '秒';
        var _minuteStr = _minute == 0 ? '' : '' + (_minute < 10 ? '0' + _minute : _minute) + '分';

        if (minute < 1) {
            return Math.floor(second) + '秒'/*(second == 0 ? '' : '秒')*/;
        } else if (hour < 1) {
            return Math.floor(minute) + '分' + _secondStr;
        } else if (day < 1) {
            return Math.floor(hour) + '小时' + _minuteStr + _secondStr;
        } else if (week < 1) {
            return Math.floor(day) + '天';
        }

    },
    // 初始化列表
    initGrid: function () {
        var dataFilter = listManager.service.getSearchData();
        $.showLoading('加载中，请稍后...');
        YT.query({
            data: dataFilter,
            successCallback: function (data) {
                listManager.service.getHtmlListStr(data);//列表的方式显示
                $.hideLoading();
            }
        });
    },
    getDefaultFilter: function () {
        return [
            {field: 'corpid', value: '' + YT.getCorpId(), operator: '=', relation: 'AND'},
            {field: 'shareId', value: listManager.data.shareId, operator: '=', relation: 'AND'}
        ];
    },
    getSearchData: function () {
        var filter = listManager.service.getDefaultFilter();
        return {
            m: listManager.data.m,
            t: 'v_message_share_details',
            filter: JSON.stringify(filter),
            order: " openTime desc"
        };
    },
    //列表展示
    getHtmlListStr: function (data) {
        var html = '<div class="weui-panel weui-panel_access"><div class="weui-panel__hd">浏览记录</div>';
        if (data.status == 200 && data.object.length > 0) {
            for (var i = 0; i < data.object.length; i++) {
                var sameId = data.object[i].sameId;
                var dataCustonerId = data.object[i].messageShareCustomerId;
                var dispOrder = data.object[i].dispOrder;
                var person = '';
                var address = data.object[i].city || '';
                if (parseInt(sameId) == -1 && parseInt(data.object[i].customerId) == -1) {  //匿名用户
                    person = '匿名用户'+dataCustonerId;
                    /*if (dispOrder == data.object[i].customerId) {
                        person = '匿名用户'+dataCustonerId;
                    } else {
                        person = '匿名用户'+dispOrder;
                    }*/
                } else {
                    if (data.object[i].personShare == null) {
                        person = '没有数据';
                    } else {
                        person = data.object[i].personShare;
                    }
                }
                var readInfo = data.object[i].readInfo;
                var currentArray = [];
                var viewTime = 0;
                var pageShowNum = 1;
                var showTime = '';
                function getFlexItem(time,index){
                    return '<div class="flex-item">' +
                        '<div class="flex-item-content" style="background-color: '+(time?"#43b1d0":"#aaa")+'">' +
                        '<span style="font-weight: 600;">第'+index+'页：</span>' +
                        '<span style="font-weight: 600;">'+listManager.service.formatSeconds(time)+'</span>' +
                        '</div>'+
                        '</div>';
                }
                if (data.object[i].messageType == 1) {
                    currentArray.push(viewTime);
                    viewTime = data.object[i].viewTime - 0;
                    showTime += getFlexItem(viewTime,1);
                } else if (data.object[i].messageType == 5 || data.object[i].messageType == 2) {
                    currentArray = JSON.parse(readInfo || '[0]');//阅读信息
                    for (var m = 0; m < currentArray.length; m++) {
                        var time = parseInt(currentArray[m]);
                        viewTime += time;
                        showTime += getFlexItem(time,(m+1));
                    }
                    pageShowNum = currentArray.length;
                }
                html+='<div class="weui-media-box weui-media-box_text"> ' +
                    /*'<h4 class="weui-media-box__title">'+person+'('+address+')</h4> ' +*/
                    '<p class="weui-media-box__desc">' +
                    '<i class="iconfont" style="color:#bbb">&#xe008;</i>  ' +
                    '<span style="font-size:14px;color: #666;font-weight: 600;">'+person+'</span>' +
                    '于'+new Date(data.object[i].openTime).Format("yyyy年MM月dd日") +
                    '在<span style="font-size:14px;color: #666;font-weight: 600;">' +address +'</span>浏览了'+
                    '<span style="font-size:14px;color: #666;font-weight: 600;">' + listManager.service.formatSeconds(viewTime)+'</span>' +
                    '<div class="flex-box">'+showTime+'</div>'+
                    '</p> ' +
                    '</div>';
            }
        }else{
            html += '<div class="noMore" style="margin-top: 10px;text-align: center;">无浏览记录</div>';
        }
        html+= '<a href="javascript:;" class="weui-btn weui-btn_primary close-popup">关闭</a></div>';
        $('#full-pop-content').html(html);
    }
};
listManager.eventHandler = {
    handleEvents: function () {
        this.handleChooseShare();
        this.handleMessageDetail();
    },
    handleChooseShare: function () {
        $('.weui-panel').on('click','.staff',function () {
            var self = this;
            listManager.data.shareId = $(self).data('id');
            if(listManager.data.currentPopId != -1 && listManager.data.currentPopId == listManager.data.shareId){
                $("#full").popup();
            }else{
                listManager.data.currentPopId = listManager.data.shareId;
                $('#full-pop-content').empty();
                listManager.service.initGrid();
                $("#full").popup();
            }
        });
    },
    handleMessageDetail:function(){
        $('#message-detail').click(function(){
            var dataId = YT.getUrlParam('mId'), msgType = +YT.getUrlParam('type'), url = '';
            // 1文章 2资料 3图片 4没有二维码图片 5H5
            switch (msgType) {
                case 1:
                case 3:
                case 4:
                    url = '../message/message-share.html';
                    break;
                case 2:
                    url = '../message/doc/doc-share.html';
                    break;
                case 5:
                    url = '../message/h5/h5-share.html';
                    break;
            }

            YT.getUserInfo(function (user) {
                window.location.href = url + YT.setUrlParams({
                        d: dataId,
                        s: 0,
                        u: user.id
                    });
            });
        });
    }
};
