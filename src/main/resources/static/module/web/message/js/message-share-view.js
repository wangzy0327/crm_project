var listManager = {};

listManager.data = {
    m: 10220000,
    dataArrayMessage: []
};
$(function () {
    listManager.service.initControls();
    listManager.eventHandler.eventSpreatOnMouse();
});
listManager.service = {
    initControls: function () {
        this.initGrid();
    },
    cutStr: function (str, length) {
        if (str.length <= length) {
            return str;
        } else {
            return str.substr(0, length) + "...";
        }
    },
    formatSeconds: function (value) {

        var theTime = parseInt(value);// 秒
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
        var result = "" + parseInt(theTime) + "秒";
        if (theTime1 > 0) {
            result = "" + parseInt(theTime1) + "分" + result;
        }
        if (theTime2 > 0) {
            result = "" + parseInt(theTime2) + "小时" + result;
        }
        return result;

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
                        return false;
                    }
                    if (data.object.length > 0) {
                        listManager.service.getHtmlListStr(data);//列表的方式显示
                        //置空数组
                        listManager.data.dataArrayMessage = [];
                        for (var i = 0; i < data.object.length; i++) {
                            listManager.data.dataArrayMessage.push(data.object[i]);
                        }
                    }
                }
            }
        });
    },
    getDefaultFilter: function () {
        return [
            {field: 'corpid', value: '' + YT.getCorpId(), operator: '=', relation: 'AND'},
            /*{field: 'app_id', value: '' + appAgent.apps.sales_ass_id, operator: '=', relation: 'AND'},*/
            {field: 'shareId', value: YT.getUrlParam("id"), operator: '=', relation: 'AND'}
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
        //console.log(data.object);
        var all_depart_dom_obj_connect = "";
        if (data.status == 200) {
            for (var m = 0; m < data.object.length; m++) {
                var dataObj = data.object[m];
                //分享人姓名
                var share_person_name = dataObj.personShare;
                //分享地点
                var share_message_location = dataObj.city;
                //系统平台信息
                var platform_info = dataObj.deviceName + '&nbsp;' + dataObj.deviceVersion + '&nbsp;' + dataObj.browserName + '&nbsp;' + dataObj.engine + '&nbsp;' + dataObj.browserVersion;
                var readInfo = dataObj.readInfo;
                //浏览消息的时间
                var message_view_time = new Date(dataObj.openTime).Format("yyyy-MM-dd hh:mm:ss");
                var sumMessageTime = 0;
                var readInfoArray = (readInfo.substring(1, readInfo.length - 1)).split(",");
                // console.log(readInfoArray);
                for (var i = 0; i < readInfoArray.length; i++) {
                    sumMessageTime += parseInt(readInfoArray[i]);
                }
                //  console.log(sumMessageTime);
                //浏览消息的总时长
                var message_total_time_view = listManager.service.formatSeconds(parseInt(sumMessageTime));
                //阅读信息总页数
                var pageTotal = readInfoArray.length;
                var readInfo_message = "";
                //创建DOM对象
                var clear_float_div = '<div style="clear: both"></div>';//最后添加清除浮动

                //创建wrap_contanier--包含所有的内容
                //wrap_contanier开始标签
                var wrap_contanier_start_tag = '<section  class="con-body" data-v-box-section-menu="">';
                //wrap_contanier结束标签
                var wrap_contanier_end_tag = '</section>';

                //创建左块级元素section_left
                //创建左块级开始标签
                var section_left_start_tag = '<section class="con-body-left con-flow-same" data-yt-left=""><ul data-val="">';
                //创建liDOM
                //分享人
                var li_share_person = '';
                if (parseInt(dataObj.sameId) == -1 && parseInt(dataObj.customerId) == -1) {
                    li_share_person = '<li  data-li-key="" data-name-show="">匿名用户' + dataObj.messageShareCustomerId + '</li>';
                } else {
                    li_share_person = '<li data-li-key="" data-name-show="">' + share_person_name + '</li>';
                }
                //地点
                var li_share_location = '<li data-li-key="" style="text-indent: 18em">地点:</li>';
                //系统及平台
                var li_share_platefrm = '<li data-li-key="">系统及平台:</li>';
                //浏览时间
                var li_view_time = '<li data-li-key="" style="text-indent: 16em">浏览时间:</li>';
                //创建左块级结束标签
                var section_left_end_tag = '</ul></section>';

                //连接左块DOM结构
                var dom_for_left_obj = section_left_start_tag + li_share_person + li_share_location + li_share_platefrm + li_view_time + section_left_end_tag;

                //创建中间块标签
                //创建中间块开始标签
                var section_middle_start_tag = '<section class="con-body-middle con-flow-same" data-yt-middle="">';
                //创建中间块结束标签
                var section_middle_end_tag = '</section>';

                //创建第一个子节点ulDOM
                var middle_ul_first_start_tag = '<ul data-val="">';
                //创建中间块LIDOM
                var middle_li_share_person = '';
                if (parseInt(dataObj.sameId) == -1 && parseInt(dataObj.customerId) == -1) {
                    middle_li_share_person = '<li data-li-key=""><span style="color: #5cb0a0;cursor: pointer" id="' + dataObj.messageShareCustomerId + '" onclick="listManager.service.addNewCustomer($(this))">+添加为客户</span></li>';//内容空
                } else {
                    middle_li_share_person = '<li data-li-key=""></li>';//内容空
                }

                //地点显示
                var middle_li_location = ' <li data-li-key="">' + share_message_location + '</li>';
                var middle_li_platefrm = '<li data-li-key="">' + platform_info + '</li>';
                var middle_li_view_time = ' <li data-li-key="">' + message_view_time + '</li>';
                //浏览总时长
                var middle_total_progress_time_start = ' <li data-li-key="">';
                var middle_middle_total_progress_span_ = '<span class="layui-progress-bar layui-bg-green" style="width: 80%;"><span class="all-time-sum">浏览总时长:' + message_total_time_view + '(' + readInfoArray.length + '页)</span></span>';
                var middle_middle_total_val_span = '<span class="layui-progress-text" id="" data-val-index="0" onclick="listManager.eventHandler.eventSpreatOnMouse($(this))"><span>展开</span><span><img src="../../img/shensuo-icon.png"></span></span>';
                var middle_total_progress_time_end = '</li>';
                var middle_li_last_dom_str = middle_total_progress_time_start + middle_middle_total_progress_span_ + middle_middle_total_val_span + middle_total_progress_time_end;

                var middle_ul_first_end_tag = '</ul>';
                //第一个子节点DOM--UL拼接(结束)
                var middle_first_ul_connect = middle_ul_first_start_tag + middle_li_share_person + middle_li_location + middle_li_platefrm + middle_li_view_time + middle_li_last_dom_str + middle_ul_first_end_tag;

                //创建第二个ULDOM节点--隐藏/显示
                var middle_second_ul_start_tag = '<ul data-page-show="" id="">';
                //创建ul的子节点（左右）
                //创建左边部分
                var section_left_depart_start_tag = '<section data-page-show-left="">';
                //循环创建LI(有几页就创建几个li节点)
                var middle_li_show_page_size = '';
                for (var n = 0; n < readInfoArray.length; n++) {
                    //进度条的显示状态需要修改
                    //背景进度条的width
                    if (readInfoArray[n] == null || readInfoArray[n] == '') {
                        readInfoArray[n] = 0;
                    }
                    var bg_width = Math.floor(parseInt(readInfoArray[n] / sumMessageTime * 10));//占比计算
                    middle_li_show_page_size += '<li data-message-page=""><span>第' + (n + 1) + '页</span><span class="yt-view-page-time">' + listManager.service.formatSeconds(readInfoArray[n]) + '</span><span class="progress-back-yt"><span class="postion-background-color" style="width:' + bg_width + 'px"></span></span></li>';
                }
                var section_left_depart_end_tag = '</section>';

                //连接左边部分DOM对象
                var section_left_dom_connect = section_left_depart_start_tag + middle_li_show_page_size + section_left_depart_end_tag;

                //创建右边部分(结束)
                var section_right_depart = ' <section data-page-show-right=""><p class="imgLinkThumbnail"></p><!--<p class="imgLinkThumbnailImg" data-index="2" onclick="listManager.eventHandler.handlerClickList($(this))"><img src="../../img/href-icon.png">缩略图模式</p>--></section>';

                var middle_second_ul_end_tag = '</ul>';

                //第二个子节点UL--DOM的拼接
                var middle_second_ul_connect = middle_second_ul_start_tag + section_left_dom_connect + section_right_depart + middle_second_ul_end_tag;

                //整合中间块DOM对象
                var dom_for_middle_obj = section_middle_start_tag + middle_first_ul_connect + middle_second_ul_connect + section_middle_end_tag;
                //创建右块级标签（图表显示区）
                //创建右块级开始标签
                var section_right_start_tag = '<section class="con-body-right con-flow-same" data-yt-right=""><ul data-val=""><li data-li-key=""></li><ul id=""></ul></ul>';
                //创建右块级结束标签
                var section_right_end_tag = '</section>';
                var dom_for_right_obj = section_right_start_tag + section_right_end_tag;
                //创建整个DOM对象
                all_depart_dom_obj_connect += wrap_contanier_start_tag + dom_for_left_obj + dom_for_middle_obj + dom_for_right_obj + wrap_contanier_end_tag + clear_float_div;
            }
            //数据填充
            $("#box-flow-ul").empty().append(all_depart_dom_obj_connect).fadeOut('fast').fadeIn('slow');
            //获取操作的DOM对象改变DOM结构
            /*for(var i=0;i<data.object.length;i++){
                //创建li容器
                var li_content_box_start = '<li data-v-section="">';
                var li_content_box_end = '</li>';

                //创建ul容器
                var ul_content_box_start = '<ul data-v-ul-li-box="" data-v-section="" class="link-view-list-default-ul">';
                var ul_content_box_end = '</ul>';

                //条件判断
                var sameId = data.object[i].sameId;
                var dataCustonerId= data.object[i].messageShareCustomerId;

                //创建li容器--匿名用户
                var li_content_ul_anonymity_start = '<li data-v-ul-li-box="">';
                //创建DIV元素
                var div_title_anonymity_start="";
                var div_span_anonymity_start="";
                if(parseInt(sameId) == -1 && parseInt(data.object[i].customerId) == -1){
                    div_title_anonymity_start = '<div data-v-ul-li-box="" class="key textLeft">匿名用户'+dataCustonerId; //填充内容
                    div_span_anonymity_start = '<span data-v-ul-li-box="" class="add-member" id="'+dataCustonerId+'" onclick="listManager.service.addNewCustomer($(this))">+添加为客户</span><span data-v-ul-li-box="" class="add-member" style="float: right;margin-right: 10px"></span><span data-v-ul-li-box="" class="add-member" style="text-align: right;float: right"></span>';
                }else{
                    div_title_anonymity_start = '<div data-v-ul-li-box="" class="key textLeft">'+data.object[i].personShare;
                    div_span_anonymity_start = '<span data-v-ul-li-box="" class="add-member"></span><span data-v-ul-li-box="" class="add-member" style="float: right;margin-right: 10px">&nbsp;</span><span data-v-ul-li-box="" class="add-member" style="text-align: right;float: right"></span>';
                }
                var div_title_anonymity_end = '</div>';
                var div_val_anonymity_start = '<div data-v-ul-li-box="" class="val">';
                //创建span元素
                // var div_span_anonymity_start = '<span data-v-ul-li-box="" class="add-member"></span>';//填充内容
                var div_content_anonymity_end = '</div>';

                var li_content_ul_anonymity_end = '</li>';
                //结束
                var str_conecct_anonymity = li_content_ul_anonymity_start+div_title_anonymity_start+div_title_anonymity_end
                    +div_val_anonymity_start+div_span_anonymity_start+div_content_anonymity_end+li_content_ul_anonymity_end;
                //创建li容器--地点
                var li_content_ul_place_start = '<li data-v-ul-li-box="">';
                //创建DIV元素
                var div_key_place = '<div data-v-ul-li-box="" class="key">地点:</div>';
                if(data.object[i].city!=null){
                    var div_val_place = '<div data-v-ul-li-box="" class="val">'+data.object[i].city +'</div>';//填充内容
                }
                var li_content_ul_place_end = '</li>';
                //结束
                var str_connect_place = li_content_ul_place_start+div_key_place+div_val_place+li_content_ul_place_end;

                //创建li容器--系统平台
                var li_content_ul_system_platform_start = '<li data-v-ul-li-box="">';
                //创建DIV元素
                var div_key_system_platform = '<div data-v-ul-li-box="" class="key">系统平台:</div>';

                var div_val_system_platform = '<div data-v-ul-li-box="" class="val">'+data.object[i].deviceName +'&nbsp;'+
                    data.object[i].deviceVersion +'&nbsp;'+data.object[i].browserName+'&nbsp;'+ data.object[i].engine
                    +'&nbsp;'+ data.object[i].browserVersion+'</div>';//填充内容
                var li_content_ul_system_platform_end = '</li>';
                //结束
                var str_connect_system_platform = li_content_ul_system_platform_start+div_key_system_platform+div_val_system_platform+li_content_ul_system_platform_end;
                //创建li容器--浏览时间
                var li_content_ul_view_time_start = '<li data-v-ul-li-box="">';
                //创建DIV元素
                var div_key_view_time = ' <div data-v-ul-li-box="" class="key">浏览时间:</div>';
                var div_val_view_time = ' <div data-v-ul-li-box="" class="val">'+new Date(data.object[i].openTime).Format("yyyy-MM-dd hh:mm:ss")+'</div>';//填充内容
                var li_content_ul_view_time_end = '</li>';
                //结束
                var str_connect_view_time = li_content_ul_view_time_start+div_key_view_time+div_val_view_time+li_content_ul_view_time_end;

                //创建li容器--浏览时长
                var li_content_ul_time_spend_start = '<li data-v-ul-li-box="">';
                //创建DIV元素
                var readInfo = data.object[i].readInfo;
                //console.log(readInfo.substring(1,readInfo.length-1));
                if(readInfo != null){
                    readInfo = readInfo.substring(1,readInfo.length-1);
                    var currentArray = readInfo.split(",");
                    var pageShowNum = currentArray.length;//显示的总页数
                }
                //console.log(data.object[i].readInfo);
                var div_key_time_spend = '<div data-v-ul-li-box="" class="key"></div>';
                var div_val_time_spend = '<div data-v-ul-li-box="" class="val">浏览时长:'+data.object[i].viewTime+'秒&nbsp;&nbsp;('+pageShowNum+'页)</div>';
                var li_content_ul_time_spend_end = '</li>';
                //结束
                var str_connect_time_spend=li_content_ul_time_spend_start+div_key_time_spend+div_val_time_spend+li_content_ul_time_spend_end

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
                var sumWidth = 0;
                for (var r=0;r<currentArray.length;r++){
                    sumWidth +=parseInt(currentArray[r]);
                }
                // console.log(sumWidth);
                //数组的处理
                if(sumWidth<100){
                    var otherCalNum = 100 - sumWidth;
                    var lastWidthResult = parseInt(otherCalNum/pageShowNum);
                    // console.log(lastWidthResult);
                }else{
                    //重新计算样式宽度
                }
                for(var n=0;n<pageShowNum;n++){
                    //inner_ul_progress_li_loop += '<li data-v-div-content="" style="1%;"></li>';
                    //计算每个li的宽度
                    // var readInfoArray = data.object[i].readInfo;
                    // console.log(readInfoArray);
                    var widthNumCa = parseInt(parseInt(currentArray[n])+lastWidthResult);
                    inner_ul_progress_li_loop += '<li data-index="'+(n+1)+'" data-v-div-content="" style="width:'+widthNumCa+'%;" onmouseover="listManager.eventHandler.hoverEventOperateShow($(this).parent(),$(this))" onmouseout="listManager.eventHandler.hoverEventOperateFadeOut($(this).parent(),$(this))"></li>';
                }
                var inner_ul_progress_box_end = '</ul>';
                //连接DOM元素
                var progress_ul_li_connect_str = inner_ul_progress_box_start+inner_ul_progress_li_loop+inner_ul_progress_box_end;
                //创建兄弟节点(循环)div
                var html_brother_ul_div_box_start = '<div data-v-div-content="" class="hover_img_con" style="top: 6px; left: 91px; display: none;">';
                //头部页数
                var html_brother_header_title = '<header data-v-div-content="" class="this_title_name"></header>';
                //显示的图片
                var html_brother_img ='<img data-v-div-content="" src="https://cdn-img-oss-prod.kuick.cn/conference/8144/ppt/2ecbb3b5-6a65-4ecd-91d8-6bb0f4b8154d/img/pict-7.png" alt="" class="hover_img">';
                //尾部显示信息
                var  html_brother_footer = '<footer data-v-div-content="" class="this_footer_name"></footer>';
                var html_brother_ul_div_box_end = '</div>';
                //兄弟节点DOM连接
                var relative_img_header_footer  = html_brother_ul_div_box_start+html_brother_header_title+html_brother_img+html_brother_footer+html_brother_ul_div_box_end;
                var inner_div_progress_box_end = '</div>';
                // 创建DOM元素(进度条显示图片)
                //连接所有的DOM节点
                var progress_last_str_dom = inner_div_progress_box_start+progress_ul_li_connect_str+relative_img_header_footer+inner_div_progress_box_end;
                /!* var div_behaviour_hover_start = '<div data-v-div-content="" data-v-ul-li-box="" class="customer_behaviour_hover_img_con">';
                 var div_behaviour_hover_end = '</div>';
                 //创建ul
                 var ul_behaviour_hover_img_start = '<ul data-v-div-content="" class="customer_behaviour_hover_img_ul">';
                 var ul_behaviour_hover_img_end = '<ul>';
                //创建li(循环)
                //浏览的总页数 页面显示信息,总页数几个创建几个li
                // var progress_div_ul_li = '<li data-v-div-content="" style="width: 100%;"></li>';//循环创建
                 var html_li_progress = '';//创建的标签添加到创建的ul中
                  for (var i = 1;i<=pageShowNum;i++){
                      html_li_progress+='<li data-v-div-content=""></li>';  //动态创建li的width
                  }
                 var collection_li_img =  div_behaviour_hover_start+ div_behaviour_hover_end+ul_behaviour_hover_img_start+html_li_progress+ul_behaviour_hover_img_end;

*!/
                var li_val_progress_end ="</div>"
                var li_content_ul_progress_end = '</li>';
                var str_connect_progress = li_content_ul_progress_start+li_key_progress+li_val_progress_start+progress_last_str_dom+li_val_progress_end+li_content_ul_progress_end;
                //结束
                htmlDomStr +=li_content_box_start+ul_content_box_start+str_conecct_anonymity
                    +str_connect_place+str_connect_system_platform+str_connect_view_time
                    +str_connect_time_spend+str_connect_progress+ul_content_box_end+li_content_box_end;
            }*/
        } else {
            $.alert(data.message);
        }
        /* for (var i= 0;i<data.object.length;i++){
             //用户
             var sameId = data.object[i].sameId;
             var dataCustonerId= data.object[i].messageShareCustomerId;
             var nextMiddleStr="";
             var middleStr = "";
             if (parseInt(sameId) == -1 && parseInt(data.object[i].customerId) == -1){
                 //匿名用户
                  middleStr = "<div class='layout-content' style='padding-right: 40px'>匿名用户" + dataCustonerId + "</div>";
                  nextMiddleStr = "<div class='layout-content' style='color: #428bca'><i class='iconfont'>&#xe61a;</i><a id='"+dataCustonerId+"' href='javascript:void(0);' style='text-decoration: none;' onclick='listManager.service.addNewCustomer($(this))'>添加为新客户</a></div>";
             }else{
                  middleStr = "<div class='layout-content' style='padding-right: 40px'>" + data.object[i].personShare + "</div>";
                  nextMiddleStr = "<div class='layout-content'></div>";
             }
             var startStr = "<div class='layout cl'>";
             var secStr = "<div class='fl'>"
             var secEnd = "</div>";
             var thirdStrStart = "<div class='fr'>";
             var thirdStrEnd = "</div>";
             var endStr = "</div>";
              //地点
             var locationStart = "<div class='layout cl'>";
             var locationLeft = "<div class='fl'>"
             var locationMiddleLeft = "<div class='layout-content'>地点:</div>";
             var locationEndLeft = "</div>";

             var locationRight = "<div class='fr'>"
             var locationMiddleRight = "<div class='layout-content'>" + data.object[i].city + "</div>";
             var locationEndRight = "</div>";
             var locationEnd = "</div>";
             //系统平台
             var systemPlat = "<div class='layout-content'>系统平台:</div>"
             var systemVersion = "<div class='layout-content'>" + data.object[i].deviceName +'&nbsp;'+
                 data.object[i].deviceVersion +'&nbsp;'+data.object[i].browserName+'&nbsp;'+ data.object[i].engine
                 +'&nbsp;'+ data.object[i].browserVersion+"</div>";
             //浏览时间
             var timeForStay = "<div class='layout-content'>浏览时间:</div>"
             var dataForTime = "<div class='layout-content'>" +new Date(data.object[i].openTime).Format("yyyy-MM-dd hh:mm:ss")+"</div>";
             //浏览时长
             var viewTime = listManager.service.formatSeconds(data.object[i].viewTime);
             var timeViewStay = "<div class='layout-content'>浏览时长:</div>";
             //浏览的总页数
             //页面显示信息
             var readInfo = data.object[i].readInfo;
             // console.log(readInfo.substring(1,readInfo.length-1));
             if(readInfo != null){
                 readInfo = readInfo.substring(1,readInfo.length-1);
                 var currentArray = readInfo.split(",");
                 var pageShowNum = currentArray.length;//显示的总页数
               //  console.log(pageShowNum);
             }
             var dataViewTime = "<div class='layout-content'>" +viewTime+"&nbsp;("+pageShowNum+"页)"+"</div>";
             var progressObjLeft = "<div class='layout-content'></div>"
             var progressObj = "<div class='progress' style='cursor:pointer;width: 60%; margin-top: 15px;' onMouseOver='listManager.service.cssMouseOver($(this))' onMouseOut='listManager.service.cssMouseOut($(this))'><span style='width:100%;'></span></div>"
             var imgObjStart = "<div class='cl' style='position:relative'>";
             var imgObjEnd = "</div>";
             var  imgHideShow = "<div class='bgImgBlock'><span class='triangleReal'></span><span class='subSpan'>第1页</span></div>";
             //附件文件的加载
             var coverPicAttach = data.object[i].coverPicAttach;
             var contentAttach = data.object[i].contentAttach;


             //钩子
             var hook = "<div class='layout cl'><div class='fl' style='height: 15px'><div class='layout-content' style='padding-right: 40px'></div></div></div>";
             htmlStr += startStr+secStr+middleStr+secEnd+thirdStrStart+
                        nextMiddleStr+thirdStrEnd+endStr+locationStart+locationLeft+locationMiddleLeft+
                        locationEndLeft+locationRight+locationMiddleRight+locationEndRight+locationEnd+
                        startStr+secStr+systemPlat+secEnd+thirdStrStart+
                        systemVersion+thirdStrEnd+endStr+locationStart+
                        startStr+secStr+timeForStay+secEnd+thirdStrStart+
                        dataForTime+thirdStrEnd+endStr+startStr+secStr+
                        timeViewStay+secEnd+thirdStrStart+dataViewTime+thirdStrEnd+endStr+
                        startStr+secStr+progressObjLeft+secEnd+thirdStrStart+
                        progressObj+thirdStrEnd+endStr+imgObjStart+imgHideShow+imgObjEnd+hook;
         }*/

    },
    //图片展示
    getHtmlThumbnailStr: function (dataArray) {
         //浏览的总记录数
       //  console.log(dataArray);
        //获取所有阅读的信息
        var readInfoArray = [];//页数信息
        var messageExtraTypeData = [];//类型
        var messageShareTime = [];//分享时间
        var messsagePersonShare = [];//分享人
        for (var i = 0;i<dataArray.length;i++){
            //console.log(dataArray[i].readInfo);得到字符串String类型
            readInfoArray.push((dataArray[i].readInfo.substring(1, dataArray[i].readInfo.length - 1)).split(","));
            messageExtraTypeData.push(dataArray[i].messageType);//消息类型
            messageShareTime.push(dataArray[i].shareTime);
            messsagePersonShare.push(dataArray[i].personShare);
            if(dataArray[i].shareTime == '' || dataArray[i].shareTime ==null){
                dataArray[i].shareTime = 0;
            }
           // console.log(dataArray[i].shareTime);
        }
        /*循环readInfoArray*/
        var section_contanier_box_start = '<section data-v-box-section-menu="" class="con-body">';
        //创建包含块
        var section_wrap_box_start = '<section data-v-section-repeat-file="" class="file-list-con" data-v-box-section-menu="">';
        //创建无序列表
        var wrap_box_ul_start = '<ul data-v-section-repeat-file="" class="file-list-ul">';
        //创建li对象（循环）
        var str_li_box = '';
        var messageType = '';

        for (var w = 0;w<readInfoArray.length;w++){
            //console.log(readInfoArray[0]);//总记录数7条
            //内循环  循环所有的页数
            for(var j = 0;j<readInfoArray[w].length;j++){
                //文章类型的判断
                if(messageExtraTypeData[j] == 1){
                    messageType = '文章';
                }
                if(messageExtraTypeData[j] == 2){
                    messageType = '资料';
                }
                if(messageExtraTypeData[j] == 3){
                    messageType = '图片(替换二维码)';
                }
                if(messageExtraTypeData[j] == 4){
                    messageType = '图片(不替换二维码)';
                }
                //循环创建页数
                var wrap_box_ul_li_start = '<li data-v-section-repeat-file="" class="file-list" style="margin:10px 15px">';
                //创建li里面的块元素
                var wrap_li_section_box_start = '<section data-v-hover-statuecss="" class="file-unit-con file-unit-con-hover" data-v-section-repeat-file="">';
                //创建块包含的元素
                var section_hover1_start = '<section data-v-hover-statuecss="" class="thumbnails-con">';
                var all_hover1_content_img = '<img data-v-hover-statuecss="" width="320" height="180" src="../../img/fileDom.png" alt="" class="default-img">' +
                    '<img data-v-hover-statuecss="" width="320" height="180" src="../../img/tech.png"' +  'alt="点击预览" class="thumbnails-img">';
                var div_box_shaow_con = ' <div data-v-hover-statuecss="" class="shaow-con"></div>';
                var p_box_file_type = '<p data-v-hover-statuecss="" class="file-type">'+messageType+'</p>';//文章类型
                //热门
                var div_share_share_form = ' <div data-v-hover-statuecss="" class="share-form-me share-form-other"><span data-v-hover-statuecss="" class="default-share"></span></div>';
                var section_hover1_end = '</section>';
                //块连接1
                var personName = '';
                if(messsagePersonShare[j] == null || typeof messsagePersonShare[j] == undefined){
                    personName = '匿名';
                }else{
                    personName = messsagePersonShare[j];
                }
                var all_section_hover1_content_str = section_hover1_start+all_hover1_content_img+div_box_shaow_con+p_box_file_type+div_share_share_form+section_hover1_end;
                var section_hover2 = '<section data-v-hover-statuecss="" class="file-name">'+personName+'&nbsp;'+new Date(messageShareTime[0]).Format("yyyy-MM-dd hh:mm:ss")+'</section>';
                var section_hover3 = '<section data-v-hover-statuecss="" class="file-introduction">第'+(j+1)+'页'+'&nbsp;&nbsp;浏览时间:'+listManager.service.formatSeconds(readInfoArray[w][j])+'</section>';//页数
                //块连接2
                var str_img_p_div_section = all_section_hover1_content_str+section_hover2+section_hover3;
                var wrap_li_section_box_end = '</section>';
                var wrap_box_ul_li_end = '</li>';
                var split_line = '<section style="clear: both;"></section>';
                if((j+1) < readInfoArray[w].length){
                    str_li_box += wrap_box_ul_li_start+wrap_li_section_box_start+str_img_p_div_section+wrap_li_section_box_end+wrap_box_ul_li_end;
                }else{
                    str_li_box += wrap_box_ul_li_start+wrap_li_section_box_start+str_img_p_div_section+wrap_li_section_box_end+wrap_box_ul_li_end+split_line;
                }
            }
        }
        var wrap_box_ul_end = '</ul>';
        var section_wrap_box_end = '</section>';
        var section_contanier_box_end = '</section>';


        var htmlStr = section_contanier_box_start+section_wrap_box_start+wrap_box_ul_start+str_li_box+wrap_box_ul_end+section_wrap_box_end+section_contanier_box_end;
        return htmlStr;

    }
};
listManager.eventHandler = {
    handleEvents: function () {
        this.hoverEvent();
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
        // console.log(readInfo);
        if (parentData && currentData) {
            $(currentData.parents().next())[0].style.display = 'block';
            $(currentData.parents().next())[0].style.opacity = '1';
            $(currentData.parents().next())[0].style.top = -210 + 'px';
            $(currentData.parents().next())[0].style.left = 36 + 'px';
        }
        //鼠标停留  获取当前节点的属性值
        var parentClassName = parentData.className;
        var dataIndex = currentData[0].dataset.index;
        //获取索引值添加数据到隐藏板
        // $(".parentClassName>header>#pager").text(dataIndex);//设置页数
        //设置时间，
        //设置显示的位置
        //计算显示的位置
        //获取父节点
        var leftOffset = 0;
        var parDomJq = currentData.parent()[0];
        //console.log(parDomJq[0].children);
        //当前节点的宽度
        var currentDomWidth = parseFloat(currentData[0].style.width);
        // console.log(currentDomWidth[0].style.width);
        //判断当前是第几个节点
        var numChildrenDom = 0;
        for (var i = 0; i < parDomJq.children.length; i++) {
            if (parDomJq.children[i].getAttribute("data-index") == dataIndex) {
                break;
            }
            numChildrenDom++;
        }
        //判断numChildrenDom
        if (numChildrenDom > 0 && numChildrenDom < parDomJq.children.length) {
            for (var j = 0; j < numChildrenDom; j++) {
                var strWidth = parDomJq.children[j].style.width;
                leftOffset += parseFloat(strWidth);
            }
        }
        $(currentData.parents().next())[0].style.left = (leftOffset + currentDomWidth - 20) + '%';
        //调整隐藏区域的位置
        // console.log($(currentData.parents().next())[0].style.left);
        //显示头内容
        var pageShowCurrentNum = currentData.attr("data-index");//显示当前页
        // console.log(pageShowCurrentNum);

        var currentObjParent = $(currentData.parents().next()[0]).children(":first");
        currentObjParent.html("第" + pageShowCurrentNum + "页(" + 10 + ")秒");
        //获取第二个子元素
        var currentTwoChild = $(currentData.parents().next()[0]).children(":first").next();
        //currentTwoChild.attr("src",'aaa.jpg');//文件的命名方式修改
        // console.log(currentTwoChild);
        var currentObjParentFooter = $(currentData.parents().next()[0]).children(":last")
        currentObjParentFooter.html("关键字");

    },
    hoverEventOperateFadeOut: function (parentData, currentData) {
        if (parentData && currentData) {
            $(currentData.parents().next())[0].style.display = 'none';
            $(currentData.parents().next())[0].style.opacity = '0';
            // $(currentData.parents().next())[0].style.top = 10+'px';
            //$(currentData.parents().next())[0].style.left = 36+'px';
        }
    },
    //列表  缩略图处理
    handlerClickList: function (data) {
        //1.缩略图显示
        //图标样式的控制
        //2，获取当前对象的属性
        var dataObjectAttr = data.attr("data-index");
        if (dataObjectAttr == 1) {  //列表显示
            listManager.service.initControls();
        }
        // console.log(dataObjectAttr);

        if (dataObjectAttr == 2) {//缩略图显示
            var data = listManager.data.dataArrayMessage;
            var strHtml = listManager.service.getHtmlThumbnailStr(data);
            //更改显示方式
            // console.log(dataObjectAttr);
            if ($("#box-flow-ul").children.length > 0) {
                $("#box-flow-ul").empty().append(strHtml).fadeOut('fast').fadeIn('slow');
            }

        }
    },
    //图标移入效果
    thumbnailMouseOver: function (object) {
        //鼠标移入获取子节点
        var dataIndex = object.attr("data-index");
        var imgChdiren = object.children();
        if (dataIndex == 0) {
            //返回图标
            imgChdiren.attr("src", '../../img/back-icon-color.png');//图标变化
        }
        if (dataIndex == 1) {
            //列表图标
            imgChdiren.attr("src", '../../img/list-icon-color.png');//图标变化
        }
        if (dataIndex == 2) {
            //缩略图图标
            imgChdiren.attr("src", '../../img/menu-icon-color.png');//图标变化
        }
        if (dataIndex == 3) {
            //缩略图图标
            imgChdiren.attr("src", '../../img/sort-icon-color.png');//图标变化
        }
    },
    //图标移出
    thumbnailMouseOut: function (object) {
        var dataIndex = object.attr("data-index");
        var imgChdiren = object.children();
        if (dataIndex == 0) {
            //返回图标
            imgChdiren.attr("src", '../../img/back-icon.png');//图标变化
        }
        if (dataIndex == 1) {
            //列表图标
            imgChdiren.attr("src", '../../img/list-icon.png');//图标变化
        }
        if (dataIndex == 2) {
            //缩略图图标
            imgChdiren.attr("src", '../../img/menu-icon.png');//图标变化
        }
        if (dataIndex == 3) {
            //缩略图图标
            imgChdiren.attr("src", '../../img/sort-icon.png');//热度变化
        }
    },
    //展开事件
    eventSpreatOnMouse: function (object) {
        if (object) {
            //图标的变化
            var obj_chidrenText = $(object.children()[0]);
            var obj_chidrenImg = $(object.children()[1]).children();
            var attrThisObj = object.attr("data-val-index");
            if (attrThisObj == 0) {
                obj_chidrenImg.attr('src', '../../img/shensuo-icon-2.png')
                object.attr("data-val-index", "1");
                object.css('color', '#1bb1a1');
                obj_chidrenText.text("收起");
            }
            if (attrThisObj == 1) {
                obj_chidrenImg.attr('src', '../../img/shensuo-icon.png');
                object.attr("data-val-index", "0");
                object.css('color', '#707070');
                obj_chidrenText.text("展开");
            }
            //显示隐藏区域
            var fadeObject = object.parent().parent().next();
            //console.log(fadeObject);
            fadeObject.toggle('slow');
        }
    }

}
