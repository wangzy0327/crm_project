$(document).ready(function () {
    $('#searchTitle').bind("click",function () {
        $('#messageTable').bootstrapTable('refresh');
    });
    $('#clearTitle').click(function () {
        $('#messageTitle').val('');
    });
    correlGroupMessage();
});
function initMessageTable(id) {
    $("#messageTable").bootstrapTable('destroy');
    $("#messageTable").bootstrapTable({
        url: '/message/name',
        method: 'get',
        contentType: "application/json;charset=UTF-8",//当请求方法为post的时候,必须要有！！！！
        toolbar: '#toobar',//工具列
        striped: true,//隔行换色
        cache: false,//禁用缓存
        pageSize: 5,//单页记录数
        pageList: [5, 10, 20, 30],//可选择单页记录数
        pagination: true,//启动分页
        sidePagination: 'client',//分页方式
        maintainSelected : true,    //如果是客户端分页，这个设为 true 翻页后已经选中的复选框不会丢失
        pageNumber: 1,//初始化table时显示的页码
        showFooter: false,//是否显示列脚
        showPaginationSwitch: false,//是否显示 数据条数选择框
        clickToSelect: true,//点击选中checkbox
        // idField: 'SystemCode',//key值栏位
        // sortable: false,//排序
        // search: true,//启用搜索
        // showColumns: true,//是否显示 内容列下拉框
        // showRefresh: true,//显示刷新按钮

        //得到查询的参数
        queryParams : function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            initMessageIds(id);
            var temp = {
                title:$('#messageTitle').val(),
                groupId:id
            };
            return temp;
        },
        columns: [
            {
                align: 'center',
                checkbox: true,
                formatter:function (value,row,index) {
                    if($.inArray(row.messageId,overAllMessageIds)!=-1){// 因为 判断数组里有没有这个 id
                        return {
                            checked : true               // 存在则选中
                        }
                    }else{
                        return {
                            checked: false
                        }
                    }
                }

            },
            {
                title: '标题',
                field: 'messageTitle',
                align: 'center',
                valign: 'middle',
                sortable: true
            }
        ]
    });

    $('#messageTable').on('uncheck.bs.table check.bs.table check-all.bs.table uncheck-all.bs.table',function(e,rows){
        var datas = $.isArray(rows) ? rows : [rows];        // 点击时获取选中的行或取消选中的行
        examine(e.type,datas);                              // 保存到全局 Array() 里
    });
}

var overAllMessageIds ;  //全局数组

function initMessageIds(groupId) {
    $.ajax({
        url:"/message/messageIds?groupId="+groupId,
        type:"POST",
        contentType: "application/json;charset=UTF-8",
        dataType:'json',
        success:function (result) {
            if(result.code == 0){
                var data = result.data;
                console.log("data:"+data);
                overAllMessageIds = [];
                for(var messageId in data)
                    overAllMessageIds.push(data[messageId]);
                console.log("overAllMessageIds:"+overAllMessageIds);
            }
        },
        error:function (result) {
            console.log(result);
            Ewin.confirm({ message: result.status });
        }
    });
}

function examine(type,datas){
    if(type.indexOf('uncheck')==-1){
        $.each(datas,function(i,v){
            // 添加时，判断一行或多行的 id 是否已经在数组里 不存则添加　
            overAllMessageIds.indexOf(v.messageId) == -1 ? overAllMessageIds.push(v.messageId) : -1;
        });
        console.log("overAllMessageIds:"+overAllMessageIds);
    }else{
        $.each(datas,function(i,v){
            overAllMessageIds.splice(overAllMessageIds.indexOf(v.messageId),1);    //删除取消选中行
        });
    }

    //console.log(overAllIds);
}

function correlGroupMessage() {
    $('#addTitle').unbind().click(function (){
        var groupId = $('#groupTable input:checkbox:checked').val();
        console.log("ajax groupId:"+groupId);
        var paramsJson = {"groupId":groupId,"messageIds":overAllMessageIds};
        var param = jQuery.param(paramsJson);
        console.log(param);
        $.ajax({
            url:"/group/messageRelation/edit?groupId="+groupId+"&messageIds="+overAllMessageIds,
            type:"PUT",
            contentType: "application/json;charset=UTF-8",
            dataType:'json',
            success:function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log(data);
                    Ewin.confirm({ message: "关联成功！" });
                }
            },
            error:function (result) {
                console.log(result);
                alert(result.status);
                Ewin.confirm({ message: "关联失败！" });
            }
        });
    });
}