var listManager = {};
listManager.data = {
    m:10190000,
    m_view_record:10220000,
    dataInstanceTree:[],
    dataObjectJson:[],
    dataTreeSubData:[],
    recordDataIds:[]
};
$(function () {
    listManager.service.initControls();
    listManager.eventHandler.handleEvents();
});
listManager.service = {
    initControls: function () {
        this.getSearchData();
        this.initGrid();
    },
    cutStr:function(str,length){
        if(str.length <= length){
            return str;
        }else{
            return str.substr(0,length)+"...";
        }
    },
    initTypeCombo:function(){
        $("#shareFlagCombo").combo({
            //Combo显示的值
            text: "text",
            //Combo选中的值
            value: "value",
            //设置Combo宽度
            width: 70,
            //初始化Combo所需数据
            data: [
                {text: '请选择', value: -1},
                {text: '未分享', value: 0},
                {text: '已分享', value: 1}
            ]
        });
    },
    getDefaultFilter: function () {
        return [
            {field: 'corpid', value: '' + YT.getCorpId(), operator: '=', relation: 'AND'},
            {field: 'app_id', value: '' + appAgent.apps.sales_ass_id, operator: '=', relation: 'AND'},
            {field: 'delFlag', value: 0, operator: '=', relation: 'AND'},
            {field: 'pid', value: '0', operator: '=', relation: 'AND'}
        ];
    },
    getSearchData: function (newFilter) {
        var filter = listManager.service.getDefaultFilter();

        if (newFilter != null && newFilter !== undefined) {
            filter = newFilter;
        }

        return {
            m: listManager.data.m,
            t: 'v_message_share_list',
            filter: JSON.stringify(filter),
            order: " createTime asc,pushTime asc "
        };
    },
    getSubTreeFilter:function () {
        return [
            {field: 'corpid', value: '' + YT.getCorpId(), operator: '=', relation: 'AND'},
            {field: 'app_id', value: '' + appAgent.apps.sales_ass_id, operator: '=', relation: 'AND'},
            {field: 'delFlag', value: 0, operator: '=', relation: 'AND'},
            {field: 'id', value: "%" + 'm' + "%", operator: 'like', relation: 'AND'},
        ];
    },
    getSubTreeData:function (newFilter) {
        var filter = listManager.service.getSubTreeFilter();
        //   console.log(filter);
        if (newFilter != null && newFilter !== undefined) {
            filter = newFilter;
        }

        return {
            m: listManager.data.m,
            t: 'v_message_share_list',
            filter: JSON.stringify(filter),
            order: " createTime asc,pushTime asc "
        };
    },
    // 初始化列表
    initGrid: function () {
        //查询所有父节点
        YT.query({
            url:YT.server + '/query.action',
            data:listManager.service.getSearchData(),
            successCallback:function (data) {
                if(data.status == 200){
                        //父节点的数据
                    for(var j=0;j<data.object.length;j++){
                        listManager.data.dataObjectJson.push(data.object[j]);
                    }
                   // console.log(listManager.data.dataObjectJson);
                    $("#grid").YTGrid({
                         params:listManager.service.getSearchData(),
                        // data:listManager.data.dataObjectJson,
                         pager:true,
                         colModel: [
                            {
                                name: '编号',
                                index: 'id',
                                collapse: true,
                                indent: true,
                                align: 'center',
                                formatter: function (val) {
                                   /* if (val.indexOf('m') >= 0) {
                                        return "";
                                    }
                                    return val.substring(1, val.length-1);*/
                                  // console.log(val);
                                    if (val.substr(0,1)=='o') {
                                        return val.substr(1);
                                    }
                                }
                            },
                            {
                                name: '标题', index: 'titleText', align: 'center', formatter: function (val, row) {
                                  //  console.log(val);
                                return listManager.service.cutStr(val, 15);
                            }
                            },
                            {name: '创建人', index: 'createUser', width: 8, align: 'center'},
                            {
                                name: '分享人', index: 'personShare', width: 8, align: 'center', formatter: function (val) {
                                if (val == "") {
                                    return "";
                                }
                                if (val != "") {
                                    return val;
                                }

                            }
                            },
                            {
                                name: '推送平台', index: 'way', align: 'center', formatter: function (val, row) {
                                var str = "";
                                if(row.pushTime != 0){
                                    if(row.pushTime == null){
                                        str+="自行分享"
                                    }else{
                                        str+="后台推送"
                                    }
                                }
                                if((row.id.indexOf('m') != -1) && row.openCount > 0){
                                    if(''+row.shareFlag == '0'){
                                        str+=",链接分享"
                                    }else if(''+row.shareFlag == '1'){
                                        str+=",常规分享"
                                    }
                                }
                                return str;
                            }
                            },
                            {
                                name: '推送时间', index: 'pushTime', align: 'center', formatter: function (val, row) {
                                if (val == 0) {
                                    return "";
                                }  else if(val == null){
                                    return '';
                                }else{
                                    return val;
                                }

                            }
                            },
                            {
                                name: '分享时间', index: 'shareTime', align: 'center', formatter: function (val, row) {

                                if (val == null) {
                                    return "";
                                }
                                if (val == -1) {
                                    return "";
                                } else {
                                    return val;
                                }
                            }
                            },
                            {
                                name: '点击次数', index: 'openCount', width: '5', align: 'center', formatter: function (val, row) {
                                if (val == null) {
                                    return "0";
                                }else {
                                    return val;
                                }

                            }
                            },
                            {
                                name: '操作', index: 'operate', width: 5, align: 'center', formatter: function (val, row) {
                                var id = row.id;
                                if (id.indexOf('m') >= 0) {
                                    return '<a class="detail_m" data-id=' + id + '>浏览记录</a>';
                                }else{
                                    return '<a class="detail" data-id=' + id + '>查看</a>';
                                }
                            }
                            }
                        ],
                         jsonReader: {
                            id: 'id',
                            rows: 'object.items'
                        },
                         //是否以树形状呈现表格
                         treeGrid: false,
                        //树形表格的参数
                         /*   treeOptions: {
                                //数据主键
                                id: 'id',
                                //父字段映射名
                                pId: 'pid',
                                //树缩进的距离
                                space: 16
                            },*/
                         //加载完成
                        onGridComplete:function () {
                            //请求子节点数据
                            // var gridAllInstance = $("#grid").getGridInstance();//获取加载的数据
                            //console.log(gridAllInstance);
                            YT.query({
                                data:listManager.service.getSubTreeData(),
                                successCallback:function (data) {
                                    if(data.status == 200){
                                         //清空数据
                                        listManager.data.dataTreeSubData = [];
                                        for (var m = 0;m<data.object.length;m++){
                                            listManager.data.dataTreeSubData.push(data.object[m]);
                                        }
                                        var instanceGrid = $("#grid").getGridInstance().getDataList();
                                      //  console.log(listManager.data.dataTreeSubData);
                                        var tableGridTr = $("#grid>div>table>tbody");//获取grid
                                        //获取tbody
                                        var gridTbodyChildren =tableGridTr[0].children;
                                        //console.log(gridTbodyChildren);
                                        for(var i=0;i<instanceGrid.length;i++){
                                            for(var j=0;j<data.object.length;j++){
                                                if(instanceGrid[i].id == data.object[j].pid){
                                                    //将获取的父级存放到对象（有重复，需要去除重复）
                                                    listManager.data.dataInstanceTree.push(instanceGrid[i]);
                                                }
                                            }
                                           // instanceGrid.push(data.object[i]);
                                        }
                                        //console.log(listManager.service.cancleRepeatData());
                                        for(var j=0;j<listManager.service.cancleRepeatData().length;j++){
                                             for (var n = 0;n<gridTbodyChildren.length;n++){
                                                    if(listManager.service.cancleRepeatData()[j].id == gridTbodyChildren[n].getAttribute("id")){
                                                         //要添加图标
                                                          var strId = listManager.service.cancleRepeatData()[j].id;
                                                          var domGrid = $(gridTbodyChildren[n].children[0]);
                                                        //添加DOM之前判断是否存在DOM
                                                        if(domGrid[0].children[0]){
                                                            domGrid[0].removeChild(domGrid[0].children[0]);
                                                        }
                                                          domGrid.prepend("<span style='position: relative;display:inline-block;left:0px;top:3px;width: 10px;height: 10px;' data-index='0' id='"+strId+"' onclick='listManager.eventHandler.handleTreeClick($(this))'><span style='width: 0;height: 0;border-width: 5px;border-style: solid;border-color:transparent transparent transparent #707070;display: inline-block;position: absolute;top:-2px'></span></span>");

                                                    }
                                             }
                                        }

                                    }else{
                                        $.alert(data.message);
                                    }
                                }

                            });
                        }
                    });

                }else{
                    $.alert(data.message);
                }
            }
        });
    },
    reloadGrid: function (newFilter) {
        $('#grid').YTGridReload(this.getSearchData(newFilter));
    },
    cancleRepeatData:function () {
        for (var m = 0; m < listManager.data.dataInstanceTree.length; m++) {
            for (var j =m+1; j <listManager.data.dataInstanceTree.length;j++) {
                if (listManager.data.dataInstanceTree[m].id == listManager.data.dataInstanceTree[j].id ) {//通过id属性进行匹配；
                    listManager.data.dataInstanceTree.splice(j, 1);//去除重复的对象；
                }else {
                    j++;
                }
            }
        }
        return listManager.data.dataInstanceTree;
    },

};

listManager.eventHandler = {
    handleEvents: function () {
        this.handleDetail();
        this.handleDetailM();
        this.handleSearch();
        this.handleClear();
        this.handleTreeClick();
    },
    handleDetailM:function(dataRecord){
       if(dataRecord){
           var dataId = $(dataRecord)[0].id;
           var dataIdSub = dataId.substring(1,dataId.length);
          // listManager.service.browsingRecordJudgment(dataIdSub);
           listManager.service.frameSubWindow(dataIdSub);
       }
    },
    handleDetail: function () {
        $('#grid').on('click', '.detail',function () {
            var dataId = $(this).data('id');
            var data = $('#grid').getGridInstance().getDataById(dataId);
            data.id= data.id.substring(1,data.id.length);
            $.dialog({
                //跨框架弹出对话框
                title:'预览消息',
                parent: window.parent,
                content: 'url:message-view.html',
                width: 800,
                height: 500,
                //传递给子对话框参数,
                data: {
                    data:data,
                    callback: function (win) {
                        win.api.close();
                    }
                }
            });
        });
    },
    handleSearch: function () {
        $("#search").click(function () {

            var filter = listManager.service.getDefaultFilter();

            var keyword = $("#keyword").val() == $("#keyword")[0].defaultValue ? '' : $("#keyword").val();
            //var shareFlag = $('#shareFlagCombo').getCombo().getValue();

            if (keyword != '') {
                filter.push([
                    {field: 'id', value: "o"+keyword, operator: '=', relation: 'OR'},
                    {field: 'pid', value: "o"+keyword, operator: '=', relation: 'OR'},
                    {field: 'titleText', value: "%" + keyword + "%", operator: 'like', relation: 'OR'},
                    {field: 'createUser', value: "%" + keyword + "%", operator: 'like', relation: 'AND'}
                ]);
            }

            listManager.service.reloadGrid(filter);
        });
    },
    handleClear: function () {
        $("#clear").click(function () {
            $("#keyword").val($("#keyword")[0].defaultValue);
            //$('#shareFlagCombo').getCombo().selectByValue(-1);
            listManager.service.reloadGrid();
        });
    },
    handleTreeClick:function (dataDom) {
        //console.log(dataDom);
        if(dataDom){
             var spanChild = dataDom[0].dataset.index;
            //判断是否是展开（角度的变化）
            //console.log(spanChild);
             if(spanChild == 0){
                 dataDom.css({
                     'transform':'rotate(45deg)',
                     '-ms-transform':'rotate(45deg)',
                     '-moz-transform':'rotate(45deg)',
                     '-webkit-transform':'rotate(45deg)',
                     '-o-transform':'rotate(45deg)',
                     '':'#707070'
                   });
                 dataDom[0].dataset.index = 1;
                 //请求添加数据tr
                 //获取当前的父节点
                 var domTrafter = $(dataDom[0]).parent().parent();
                 //添加兄弟节点
                 //判断节点是否存在
                 //插入数据循环添加
                 var countNum = 0;
                 for(var i =0;i<listManager.data.dataTreeSubData.length;i++){
                     if(listManager.data.dataTreeSubData[i].pid == dataDom[0].id){
                         var str = "";
                         if(listManager.data.dataTreeSubData[i].pushTime != 0){
                             if(listManager.data.dataTreeSubData[i].pushTime == null){
                                 str+="自行分享"
                             }else{
                                 str+="后台推送"
                             }
                         }
                         if((listManager.data.dataTreeSubData[i].id.indexOf('m') != -1) && listManager.data.dataTreeSubData[i].openCount > 0){
                             if(''+listManager.data.dataTreeSubData[i].shareFlag == '0'){
                                 str+=",链接分享"
                             }else if(''+listManager.data.dataTreeSubData[i].shareFlag == '1'){
                                 str+=",常规分享"
                             }
                         }
                          //推送时间
                         var shareTime = "";
                         if(listManager.data.dataTreeSubData[i].shareTime == null){
                             shareTime =""
                         }else{
                             shareTime = listManager.data.dataTreeSubData[i].shareTime;
                         }
                              // 添加元素之前进行判断不能重复添加(请求一次后清空数组)
                               //处理当前ID
                               var strId = listManager.data.dataTreeSubData[i].id;
                               var viewRecordId =$.trim(strId.substring(1,strId.length));
                                domTrafter.after('<tr data-flag="0"><td></td><td></td><td></td><td>'+listManager.data.dataTreeSubData[i].personShare+'</td><td>'+str+'</td><td>'+listManager.data.dataTreeSubData[i].pushTime+'</td><td>'+shareTime+'</td><td>'+listManager.data.dataTreeSubData[i].openCount+'</td><td style="font-size: 12px;color: #428bca"><a href="javascript:void(0);" onclick="listManager.eventHandler.handerlerHref('+viewRecordId+')">浏览记录</a></td></tr>');
                                countNum++;
                     }
                 }
                 //记录当前操作的ID
                 var recordIds = dataDom[0].id;
                 if (recordIds.substr(0,1)=='o') {
                     recordIds = recordIds.substr(1);
                 }
                 var objRecord = '{recordIds'+':'+recordIds+',count:'+countNum+'}';
                 if(listManager.data.recordDataIds.length>0){
                     listManager.data.recordDataIds = [];
                 }
                 listManager.data.recordDataIds.push(eval('('+objRecord+')'));
                 //当前id下添加的DOM
             }
             if(spanChild == 1){
                 dataDom.css({
                     'transform':'rotate(0deg)',
                     '-ms-transform':'rotate(0deg)',
                     '-moz-transform':'rotate(0deg)',
                     '-webkit-transform':'rotate(0deg)',
                     '-o-transform':'rotate(0deg)'
                 });
                 dataDom[0].dataset.index = 0;
                 //伸缩删除DomTr
                 var domTrafterDelete = $(dataDom[0]).parent().parent();
                 var recordIdData = listManager.data.recordDataIds[0];
                 if(parseInt(recordIdData.count)==1){
                     domTrafterDelete.next().remove();
                 }
                 if(parseInt(recordIdData.count)>1){
                     for (var i=0;i<parseInt(recordIdData.count);i++){
                         domTrafterDelete.next().remove();
                     }
                 }
             }
        }
    },
    handerlerHref:function (ids) {
        window.location.href = 'message-share-view.html?id='+ids;
    }
};

