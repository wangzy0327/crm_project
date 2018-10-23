var listManager = {};

listManager.data = {
    m: 10220000,
    shareId: -1,
    staffData: {},
    staffDataArr: [],
    messageData: {},
    shareData: [],
    shareDataByDay: {},
    dayData: [],
    dataArrayMessage: [],
    frame: {},
    contentAttachPdf: []

};
$(function () {
    listManager.service.initControls();
    listManager.eventHandler.handleChooseShare();
    //信息加载
});
listManager.service = {
    initControls: function () {
        this.initData();
    },
    initData: function () {
        var self = this;
        YT.query({
            data: {
                m: listManager.data.m,
                t: 'v_message_statistics_detail_open',
                filter: JSON.stringify([
                    {field: 'id', value: YT.getUrlParam("mId"), operator: '=', relation: 'AND'}
                ]),
                order: " shareTime desc"
            },
            successCallback: function (data) {
                if (data.status == 200) {
                    if (data.object.length > 0) {
                        var list = data.object;
                        var staffMap = {};
                        listManager.data.messageData = {
                            id: list[0].id,
                            title: list[0].title,
                            type: list[0].type,
                            msgType: list[0].msgType,
                            description: list[0].description,
                            url: list[0].url
                        };
                        $('#title').html(self.cutStr(list[0].title, 16));
                        // msgType 1文章 2资料 3图片 4没有二维码图片 5H5 6平面
                        if ('' + listManager.data.messageData.msgType == '' + 5) {
                            $('#page').attr('src', list[0].description);
                        } else if ('' + listManager.data.messageData.msgType == '' + 1) {
                            /*$('#page').attr('src','message-');*/
                        }
                        for (var i = 0; i < list.length; i++) {
                            var share = {
                                staffId: list[i].staffId,
                                staff: list[i].staff,
                                shareId: list[i].shareId,
                                openCount: list[i].openCount || 0,
                                shareTime: new Date(list[i].shareTime).Format('yyyy-MM-dd') || '',
                                shareTime2: new Date(list[i].shareTime).Format('hh:mm') || '',
                                openTime: new Date(list[i].openTime).Format('yyyy-MM-dd') || ''
                            };
                            /*listManager.data.shareData.push(share);*/

                            if (share.shareTime && share.shareTime != '1970-01-01') {
                                if (listManager.data.shareDataByDay['' + share.shareTime]) {
                                } else {
                                    listManager.data.dayData.push(share.shareTime);
                                    listManager.data.shareDataByDay['' + share.shareTime] = [];
                                }
                                listManager.data.shareDataByDay['' + share.shareTime].push(share);
                            } else if (share.openTime && share.openTime != '1970-01-01') {
                                if (listManager.data.shareDataByDay['' + share.openTime]) {
                                } else {
                                    listManager.data.dayData.push(share.openTime);
                                    listManager.data.shareDataByDay['' + share.openTime] = [];
                                }
                                listManager.data.shareDataByDay['' + share.openTime].push(share);
                            } else {
                                /*listManager.data.shareDataByDay['未记录'] = listManager.data.shareDataByDay['未记录'] || [];
                                 listManager.data.shareDataByDay['未记录'].push(share);*/
                            }

                            if (staffMap['' + share.staffId]) {
                                var count = listManager.data.staffData['' + share.staffId].openCount;
                                listManager.data.staffData['' + share.staffId].openCount = (share.openCount - 0 + count);
                            } else {
                                staffMap['' + share.staffId] = true;
                                listManager.data.staffData['' + share.staffId] = {
                                    name: share.staff,
                                    openCount: share.openCount
                                };
                            }
                        }
                        /*listManager.data.dayData.push('未记录');*/
                        for (var staffId in listManager.data.staffData) {
                            listManager.data.staffDataArr.push(listManager.data.staffData['' + staffId]);
                            /*$('#staffs').append('<div class="box-label">'+listManager.data.staffData[''+staffId].name+'('+listManager.data.staffData[''+staffId].openCount+')</div>');*/
                        }
                        function compare(property) {
                            return function (a, b) {
                                var value1 = a[property];
                                var value2 = b[property];
                                return -(value1 - value2);
                            }
                        }

                        listManager.data.staffDataArr.sort(compare('openCount'));
                        for (var k = 0; k < listManager.data.staffDataArr.length; k++) {
                            var staff_temp = listManager.data.staffDataArr[k];
                            $('#staffs').append('<div class="box-label">' + staff_temp.name + '(' + staff_temp.openCount + ')</div>');
                        }
                        for (var m = 0; m < listManager.data.dayData.length; m++) {
                            var day = listManager.data.dayData[m];
                            $('#grid').append('<div class="grid-item grid-time">' + day + '</div>');
                            var shareList = listManager.data.shareDataByDay['' + day] || [];
                            for (var j = 0; j < shareList.length; j++) {
                                var shareData = shareList[j];
                                var str = '<div class="grid-item grid-person ';
                                if (m == 0 && j == 0) {
                                    str += 'current';
                                }
                                str += '" data-id="' + shareData.shareId + '">' + shareData.staff + '<span style="font-size: 12px;">(' + shareData.shareTime2 + ')</span></div>';
                                $('#grid').append(str);
                            }
                        }

                        self.calculHeight();
                        listManager.data.shareId = list[0].shareId;
                        self.initGrid();
                        /*var iframe = document.getElementById("page");
                         if (iframe.attachEvent){
                         iframe.attachEvent("onload", function(){

                         });
                         } else {
                         iframe.onload = function(){
                         listManager.data.shareId = list[0].shareId;
                         self.initGrid();
                         };
                         }*/

                    } else {
                        YT.query({
                            data: {
                                m: listManager.data.m,
                                t: 'message',
                                filter: JSON.stringify([
                                    {field: 'id', value: YT.getUrlParam("mId"), operator: '=', relation: 'AND'}
                                ])
                            },
                            successCallback: function (data) {
                                if (data.status == 200) {
                                    if (data.object.length == 1) {
                                        listManager.data.messageData = {
                                            title: data.object[0].titleText,
                                            msgType: data.object[0].msgType,
                                            description: data.object[0].description,
                                            url: data.object[0].url
                                        };
                                        $('#title').html(self.cutStr(data.object[0].title, 16));
                                        // msgType 1文章 2资料 3图片 4没有二维码图片 5H5 6平面
                                        if ('' + listManager.data.messageData.msgType == '' + 5) {
                                            $('#page').attr('src', data.object[0].description);
                                        }
                                        self.calculHeight();
                                    }
                                }
                            }
                        });
                    }
                    self.initTreeData();
                }
            }
        });
    },
    initTreeData: function () {
        var filter = [
            {field: 'messageId', value: YT.getUrlParam("mId"), operator: '=', relation: 'AND'}
        ];
        var postData = {
            m: listManager.data.m,
            t: 'v_message_share_tree_details',
            filter: JSON.stringify(filter)
        };
        YT.query({
            loading: false,
            data: postData,
            successCallback: function (data) {
                if (data.status == 200 && data.object.length > 0) {
                    console.log(data.object);
                }
            }
        });
    },
    calculHeight: function () {
        var w_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        var h_height = $('.sta-header').outerHeight(true);
        var c_height = w_height - h_height - 26;
        $('.sta-content').height(c_height);
        $('.staff-grid').height(c_height);
        $('.sta-data').height(c_height);
        $('.h5-page').height(c_height);
        /*var p_height = $('#page').height();
         var scale = c_height/p_height;*/
        $('#page').height(c_height);
    },
    cutStr: function (str, length) {
        if (str.length <= length) {
            return str;
        } else {
            return str.substr(0, length) + "...";
        }
    },
    formatSeconds: function (value) {

        /*var theTime = parseInt(value);// 秒
         var theTime1 = 0;// 分
         var theTime2 = 0;// 小时
         // alert(theTime);
         if (theTime > 60) {
         theTime1 = parseInt(theTime / 60);
         theTime = parseInt(theTime % 60);
         // alert(theTime1+"-"+theTime);
         if (theTime1 > 60) {
         theTime2 = parseInt(theTime1 / 60);
         theTime1 = parseInt(theTime1 % 60);
         }
         }
         var result = '';
         if(theTime == 0 || theTime == 1){
         result = "" + parseInt(theTime) + "";
         }else{
         result = "" + parseInt(theTime) + "秒";
         }
         if (theTime1 > 0) {
         result = "" + parseInt(theTime1) + "分" + result;
         }
         if (theTime2 > 0) {
         result = "" + parseInt(theTime2) + "小时" + result;
         }
         return result;*/

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
            return Math.floor(second) + (second == 0 ? '' : '秒');
        } else if (hour < 1) {
            return Math.floor(minute) + '分' + _secondStr;
        } else if (day < 1) {
            return Math.floor(hour) + '小时' + _minuteStr + _secondStr;
        } else if (week < 1) {
            return Math.floor(day) + '天';
        }

    },
    addNewCustomer: function (dataObj) {
        //弹出新页面
        var objCurrentId = dataObj[0].id;
        $.dialog({
            //跨框架弹出对话框
            title: '添加新客户',
            parent: window.parent,
            content: 'url:../customer/customer-add.html',
            width: 600,
            height: 400,
            //传递给子对话框参数,
            data: {
                objCurrentId: objCurrentId,
                callback: function (win) {
                    win.api.close();
                    listManager.service.initGrid();
                }
            }
        });
    },
    // 初始化列表
    initGrid: function () {
        var dataFilter = listManager.service.getSearchData();
        YT.query({
            data: dataFilter,
            successCallback: function (data) {
                if (data.status == 200) {
                    //返回成功
                    if (data.object.length == 0) {
                        $("#box-flow-ul").empty();
                    }
                    if (data.object.length > 0) {
                        listManager.service.getHtmlListStr(data);//列表的方式显示
                    }
                }
            }
        });
    },
    getDefaultFilter: function () {
        return [
            {field: 'corpid', value: '' + YT.getCorpId(), operator: '=', relation: 'AND'},
            /*{field: 'app_id', value: '' + appAgent.apps.sales_ass_id, operator: '=', relation: 'AND'},*/
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
        var htmlDomStr = "";
        if (data.status == 200) {
            //循环创建
            for (var i = 0; i < data.object.length; i++) {
                //创建li容器
                var li_content_box_start_1 = '<li data-v-section="" style="margin-bottom: ';
                var li_content_box_start_2 = 'px">';
                var li_content_box_start = '<li data-v-section="" style="margin-bottom: 25px">';
                var li_content_box_end = '</li>';

                //创建ul容器
                var ul_content_box_start = '<ul data-v-ul-li-box="" data-v-section="" class="link-view-list-default-ul">';
                var ul_content_box_end = '</ul>';
                //条件判断
                var sameId = data.object[i].sameId;
                var dataCustonerId = data.object[i].messageShareCustomerId;

                //创建li容器--匿名用户
                var li_content_ul_anonymity_start = '<li data-v-ul-li-box="">';
                //创建DIV元素
                var div_title_anonymity_start = "";
                var div_span_anonymity_start = "";
                var dispOrder = data.object[i].dispOrder;
                if (parseInt(data.object[i].customerId) == -1) {  //匿名用户
                    div_title_anonymity_start = '<div data-v-ul-li-box="" class="key textLeft">匿名用户' + dataCustonerId; //填充内容
                    div_span_anonymity_start = '<span data-v-ul-li-box="" class="add-member" id="' + dataCustonerId + '" onclick="listManager.service.addNewCustomer($(this))">+添加为客户</span><span data-v-ul-li-box="" class="add-member" style="float: right;margin-right: 10px"></span><span data-v-ul-li-box="" class="add-member" style="text-align: right;float: right"></span>';
                    /*if (dispOrder == data.object[i].customerId) {
                     div_title_anonymity_start = '<div data-v-ul-li-box="" class="key textLeft">匿名用户' + dataCustonerId; //填充内容
                     div_span_anonymity_start = '<span data-v-ul-li-box="" class="add-member" id="' + dataCustonerId + '" onclick="listManager.service.addNewCustomer($(this))">+添加为客户</span><span data-v-ul-li-box="" class="add-member" style="float: right;margin-right: 10px"></span><span data-v-ul-li-box="" class="add-member" style="text-align: right;float: right"></span>';
                     } else {
                     div_title_anonymity_start = '<div data-v-ul-li-box="" class="key textLeft">匿名用户' + dispOrder; //填充内容
                     div_span_anonymity_start = '<span data-v-ul-li-box="" class="add-member" id="' + dataCustonerId + '" onclick="listManager.service.addNewCustomer($(this))">+添加为客户</span><span data-v-ul-li-box="" class="add-member" style="float: right;margin-right: 10px"></span><span data-v-ul-li-box="" class="add-member" style="text-align: right;float: right"></span>';
                     }*/
                } else {
                    var share_person = '';
                    if (data.object[i].personShare == null) {
                        share_person = '没有数据';
                    } else {
                        share_person = data.object[i].personShare;
                    }
                    div_title_anonymity_start = '<div data-v-ul-li-box="" class="key textLeft">' + share_person;
                    div_span_anonymity_start = '<span data-v-ul-li-box="" class="add-member"></span><span data-v-ul-li-box="" class="add-member" style="float: right;margin-right: 10px">&nbsp;</span><span data-v-ul-li-box="" class="add-member" style="text-align: right;float: right"></span>';
                }
                var div_title_anonymity_end = '</div>';
                var div_val_anonymity_start = '<div data-v-ul-li-box="" class="val">';
                //创建span元素
                // var div_span_anonymity_start = '<span data-v-ul-li-box="" class="add-member"></span>';//填充内容
                var div_content_anonymity_end = '</div>';
                var li_content_ul_anonymity_end = '</li>';
                //结束
                var str_conecct_anonymity = li_content_ul_anonymity_start + div_title_anonymity_start + div_title_anonymity_end
                    + div_val_anonymity_start + div_span_anonymity_start + div_content_anonymity_end + li_content_ul_anonymity_end;
                //创建li容器--地点
                var li_content_ul_place_start = '<li data-v-ul-li-box="">';
                //创建DIV元素
                var div_key_place = '<div data-v-ul-li-box="" class="key">地点:</div>';
                var div_val_place = '';
                if (data.object[i].city != null && data.object[i].city != '') {
                    div_val_place = '<div data-v-ul-li-box="" class="val">' + data.object[i].city + '</div>';//填充内容
                } else {
                    div_val_place = '<div data-v-ul-li-box="" class="val">无</div>';//填充内容
                }
                var li_content_ul_place_end = '</li>';
                //结束
                var str_connect_place = li_content_ul_place_start + div_key_place + div_val_place + li_content_ul_place_end;

                //创建li容器--系统平台
                var li_content_ul_system_platform_start = '<li data-v-ul-li-box="">';
                //创建DIV元素
                var div_key_system_platform = '<div data-v-ul-li-box="" class="key">系统平台:</div>';
                var div_val_system_platform = '';
                var deviceName = data.object[i].deviceName;   //设备名称
                var deviceVersion = data.object[i].deviceVersion;// 设备版本号
                var browserName = data.object[i].browserName;//浏览器名称
                var engine = data.object[i].engine;//浏览器引擎
                var browserVersion = data.object[i].browserVersion;//浏览器版本号
                if (deviceName != null || deviceName != '' || deviceVersion != null || deviceVersion != '' || browserName != '' || browserName != null || engine != null || engine != '' || browserVersion != null || browserVersion != '') {
                    div_val_system_platform = '<div data-v-ul-li-box="" class="val">' + deviceName + '&nbsp;' +
                        deviceVersion + '&nbsp;' + browserName + '&nbsp;' + engine
                        + '&nbsp;' + browserVersion + '</div>';//填充内容
                } else {
                    div_val_system_platform = '<div data-v-ul-li-box="" class="val">无</div>';//填充内容
                }

                var li_content_ul_system_platform_end = '</li>';
                //结束
                var str_connect_system_platform = li_content_ul_system_platform_start + div_key_system_platform + div_val_system_platform + li_content_ul_system_platform_end;
                //创建li容器--浏览时间
                var li_content_ul_view_time_start = '<li data-v-ul-li-box="">';
                //创建DIV元素
                var div_key_view_time = ' <div data-v-ul-li-box="" class="key">浏览时间:</div>';
                var div_val_view_time = ' <div data-v-ul-li-box="" class="val">' + new Date(data.object[i].openTime).Format("yyyy-MM-dd hh:mm:ss") + '</div>';//填充内容
                var li_content_ul_view_time_end = '</li>';
                //结束
                var str_connect_view_time = li_content_ul_view_time_start + div_key_view_time + div_val_view_time + li_content_ul_view_time_end;

                //创建li容器--浏览时长
                var li_content_ul_time_spend_start = '<li data-v-ul-li-box="">';
                //  var messageType = data.object[i].messageType;

                //创建DIV元素
                var readInfo = data.object[i].readInfo;
                var currentArray = [];
                var viewTime = 0;
                var pageShowNum = 1;

                // msgType 1文章 2资料 3图片 4没有二维码图片 5H5 6平面
                if (data.object[i].messageType == 1) {
                    currentArray.push(viewTime);
                    viewTime = data.object[i].viewTime - 0;
                } else if (data.object[i].messageType == 5 || data.object[i].messageType == 6) {
                    currentArray = JSON.parse(readInfo);//阅读信息
                    for (var m = 0; m < currentArray.length; m++) {
                        viewTime += parseInt(currentArray[m]);
                    }
                    pageShowNum = currentArray.length;
                } else if (data.object[i].messageType == 2) {
                    currentArray = JSON.parse(readInfo);//阅读信息
                    for (var m = 0; m < currentArray.length; m++) {
                        viewTime += parseInt(currentArray[m]);
                    }
                    pageShowNum = currentArray.length;
                }

                var div_key_time_spend = '<div data-v-ul-li-box="" class="key"></div>';
                var div_val_time_spend = '<div data-v-ul-li-box="" class="val">浏览时长:' + listManager.service.formatSeconds(viewTime) + '&nbsp;&nbsp;(' + pageShowNum + '页)</div>';

                var li_content_ul_time_spend_end = '</li>';
                //结束
                var str_connect_time_spend = li_content_ul_time_spend_start + div_key_time_spend + div_val_time_spend + li_content_ul_time_spend_end;

                //创建li容器--浏览显示
                var li_content_ul_progress_start = '<li data-v-ul-li-box="">';
                var li_key_progress = '<div data-v-ul-li-box="" class="key"></div>';
                var li_val_progress_start = '<div data-v-ul-li-box="" class="val padding-top" style="width: 50%;position: absolute;margin-left: 130px">';
                //创建内容div  li_val_progress_start中的元素
                var inner_div_progress_box_start = '<div data-v-div-content="" data-v-ul-li-box="" class="customer_behaviour_hover_img_con">';
                //创建标签内容ul
                var inner_ul_progress_box_start = '<ul data-v-div-content="" class="customer_behaviour_hover_img_ul">';
                //循环创建li
                // console.log(currentArray);
                //循环阅读信息
                var inner_ul_progress_li_loop = '';
                //计算总时间
                var sumWidth = 0;
                for (var r = 0; r < currentArray.length; r++) {
                    sumWidth += parseInt(currentArray[r]);
                }
                var liArr = [];

                var readInfoArray = [];//阅读信息

                // msgType 1文章 2资料 3图片 4没有二维码图片 5H5 6平面
                if (data.object[i].messageType == 1) {
                    readInfoArray.push(data.object[i].viewTime);
                } else if (data.object[i].messageType == 5 || data.object[i].messageType == 6) {
                    readInfoArray = JSON.parse(data.object[i].readInfo);//阅读信息
                } else if (data.object[i].messageType == 2) {
                    readInfoArray = JSON.parse(data.object[i].readInfo);
                }

                //阅读信息等于100  进度信息
                if (readInfoArray != null && readInfoArray != '') {
                    var min_count = 0;
                    var min_count_2 = 0;
                    var min_count_3 = 0;
                    var temp_sum = 0;
                    var temp_arr = [];
                    for (var n = 0; n < readInfoArray.length; n++) {
                        var infoTimeShareMessage = data.object[i].shareTime;
                        var li_px = 0;
                        var li_every_obj = parseInt(readInfoArray[n]);
                        var scale = li_every_obj / sumWidth;
                        if (li_every_obj == 0) {
                            li_px = 3;
                            min_count_2++;
                        } else if (scale < 0.1) {
                            if (li_every_obj < 10) {
                                li_px = 9;
                                min_count++;
                            } else {
                                li_px = 11;
                                min_count_3++;
                            }
                        } else {
                            temp_arr.push({
                                li: li_every_obj,
                                index: '' + n
                            });
                            temp_sum += li_every_obj;
                        }
                        liArr.push({
                            obj: data.object[i],
                            px: li_px
                        });
                    }
                    var temp = 100;
                    var fixed = 9 * min_count + 3 * min_count_2 + 11 * min_count_3;
                    if (min_count > 0 || min_count_2 > 0 || min_count_3 > 0) {
                        temp = 100 - fixed;
                    }
                    while (temp_arr.length > 0 && temp <= (temp_arr.length * 11)) {
                        temp += 100;
                    }
                    var row = Math.ceil((temp + fixed) / 100 + 1);
                    if (row > 2) {
                        li_content_box_start = li_content_box_start_1 + (25 + 28 * (row - 2)) + li_content_box_start_2;
                    }
                    if (temp_arr.length <= liArr.length) {
                        var temp_2 = temp;
                        var temp_sum_2 = temp_sum;
                        for (var j = 0; j < temp_arr.length; j++) {
                            var temp_px = parseInt(temp_arr[j].li / temp_sum * temp);
                            if (temp_px < 11) {
                                temp_2 -= 11;
                                temp_sum_2 -= temp_arr[j].li;
                                liArr[(temp_arr[j].index - 0)].px = 11;
                            }
                        }
                        for (var k = 0; k < temp_arr.length; k++) {
                            if ('' + liArr[(temp_arr[k].index - 0)].px != '' + 11) {
                                liArr[(temp_arr[k].index - 0)].px = parseInt(temp_arr[k].li / temp_sum_2 * temp_2);
                            }
                        }
                    }
                    for (var t = 0; t < liArr.length; t++) {
                        if (liArr.length != min_count_2) {
                            inner_ul_progress_li_loop += '<li class="tooltip_show_hover" style="color:#000000;text-align: center;line-height: 22px;height:22px;width:' + (liArr[t].px * 3) + 'px;" data-index="' + (t + 1) + '" data-v-div-content="" onmouseover="listManager.eventHandler.hoverEventOperateShow($(this).parent(),$(this))" onmouseout="listManager.eventHandler.hoverEventOperateFadeOut($(this).parent(),$(this))">' + listManager.service.formatSeconds(readInfoArray[t]) + '<span class="classic">第' + (t + 1) + '页</span></li>';
                        } else {
                            var px = parseInt(300 / liArr.length);
                            inner_ul_progress_li_loop += '<li class="tooltip_show_hover" style="color:#000000;text-align: center;line-height: 22px;height:22px;;width:' + px + 'px;"data-index="' + (t + 1) + '" data-v-div-content="" onmouseover="listManager.eventHandler.hoverEventOperateShow($(this).parent())" onmouseout="listManager.eventHandler.hoverEventOperateFadeOut($(this).parent(),$(this))">' + listManager.service.formatSeconds(readInfoArray[t]) + '<span class="classic">第' + (t + 1) + '页</span></li>';
                        }
                    }
                }
                var inner_ul_progress_box_end = '</ul>';
                //连接DOM元素
                var progress_ul_li_connect_str = inner_ul_progress_box_start + inner_ul_progress_li_loop + inner_ul_progress_box_end;
                var inner_div_progress_box_end = '</div>';
                // 创建DOM元素(进度条显示图片)
                //连接所有的DOM节点
                var progress_last_str_dom = inner_div_progress_box_start + progress_ul_li_connect_str + inner_div_progress_box_end;
                var li_val_progress_end = "</div>"
                var li_content_ul_progress_end = '</li>';
                var str_connect_progress = li_content_ul_progress_start + li_key_progress + li_val_progress_start + progress_last_str_dom + li_val_progress_end + li_content_ul_progress_end;
                var box = $();
                //结束
                htmlDomStr += li_content_box_start + ul_content_box_start + str_conecct_anonymity
                    + str_connect_place + str_connect_system_platform + str_connect_view_time
                    + str_connect_time_spend + str_connect_progress + ul_content_box_end + li_content_box_end;

                //类型判断
                var messageType = data.object[i].messageType;
                if (messageType == 2) {
                    //隐藏iframe
                    $("#page").css('display', 'none');
                    var contentAttachPdf = data.object[i].contentAttach;//获取PDF信息
                    var attachData = JSON.parse(contentAttachPdf);
                    listManager.data.contentAttachPdf = [];
                    listManager.data.contentAttachPdf.push(messageType);
                    listManager.data.contentAttachPdf.push({d: attachData[0], type: 'doc', url: ''});
                } else if (messageType == 6) {
                    //隐藏iframe
                    $("#page").css('display', 'none');
                    var third_params = data.object[i].third_params;//获取PDF信息
                    listManager.data.contentAttachPdf = [];
                    listManager.data.contentAttachPdf.push(messageType);
                    listManager.data.contentAttachPdf.push(JSON.parse(third_params));
                }
            }
        } else {
            $.alert(data.message);
        }
        if (listManager.data.contentAttachPdf[0] == 2 ||
            listManager.data.contentAttachPdf[0] == 6) {
            PageSwiperComm.init('#page-view', listManager.data.contentAttachPdf[1], 1);
        }
        //数据填充
        $("#box-flow-ul").empty().fadeOut('fast', function () {
            $("#box-flow-ul").fadeIn(500).append(htmlDomStr);
        });
    }
};
listManager.eventHandler = {
    handleEvents: function () {
        this.hoverEvent();
    },
    handleChooseShare: function () {
        $('#grid').on('click', '.grid-person', function () {
            var self = this;
            listManager.data.shareId = $(self).data('id');
            $(self).siblings().removeClass('current');
            $(self).addClass('current');
            listManager.service.initGrid();
        });
    },
    hoverEvent: function () {
        var allLiObj = $(".customer_behaviour_hover_img_con>ul>li");
        //循环添加事件
        for (var i = 0; i < allLiObj.length; i++) {
            $(allLiObj[i]).hover(function () {
                listManager.eventHandler.hoverEventOperateShow($(this).parents(".link-view-list-default-ul"), $(this));
            }, function () {
                //消失
                listManager.eventHandler.hoverEventOperateFadeOut($(this).parents(".link-view-list-default-ul"), $(this));
            });
        }
    },
    hoverEventOperateShow: function (parentData, currentData) {
        //鼠标停留  获取当前节点的属性值
        var dataIndex = currentData[0].dataset.index;
        // msgType 1文章 2资料 3图片 4没有二维码图片 5H5 6平面
        if ('' + listManager.data.messageData.msgType == '' + 5) {
            frames["page-H5"].go(dataIndex - 1);
        } else if ('' + listManager.data.messageData.msgType == '' + 2 ||
            '' + listManager.data.messageData.msgType == '' + 6) {
            window.slideTo((dataIndex), 1000, false);//切换到第一个slide，速度为1秒
        }

    },
    hoverEventOperateFadeOut: function (parentData, currentData) {
    }
};
