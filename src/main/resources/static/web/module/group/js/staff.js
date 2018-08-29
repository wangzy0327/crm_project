$(document).ready(function () {
    $('#searchName').bind("click",function () {
        $('#staffTable').bootstrapTable('refresh');
    });
    $('#clearName').click(function () {
        $('#staffName').val('');
    });
    correlGroupStaff();
});
function initStaffTable(id) {
    var flag = false;
    $("#staffTable").bootstrapTable('destroy');
    $("#staffTable").bootstrapTable({
        url: '/staff/name',
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
            initStaffIds(id);
            var temp = {
                staffName:$('#staffName').val(),
                groupId:id
            };
            return temp;
        },
        columns: [
            {
                align: 'center',
                checkbox: true,
                formatter:function (value,row,index) {
                    if($.inArray(row.staffId,overAllStaffIds)!=-1){// 因为 判断数组里有没有这个 id
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
                title: '姓名',
                field: 'staffName',
                align: 'center',
                valign: 'middle',
                sortable: true
            }
        ],
        rowAttributes:function (row,index) {
            console.log("staffId:"+row.staffId);
            return {
                'data-id':row.staffId
            }
        }

    });

    $('#staffTable').on('uncheck.bs.table check.bs.table check-all.bs.table uncheck-all.bs.table',function(e,rows){
        var datas = $.isArray(rows) ? rows : [rows];        // 点击时获取选中的行或取消选中的行
        examine(e.type,datas);                              // 保存到全局 Array() 里
    });

}

var overAllStaffIds ;  //全局数组

function initStaffIds(groupId) {
    $.ajax({
        url:"/staff/staffIds?groupId="+groupId,
        type:"POST",
        contentType: "application/json;charset=UTF-8",
        dataType:'json',
        success:function (result) {
            if(result.code == 0){
                var data = result.data;
                console.log("data:"+data);
                overAllStaffIds = [];
                for(var staffId in data)
                    overAllStaffIds.push(data[staffId]);
                console.log("overAllStaffIds:"+overAllStaffIds);
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
            overAllStaffIds.indexOf(v.staffId) == -1 ? overAllStaffIds.push(v.staffId) : -1;
        });
        console.log("overAllStaffsIds:"+overAllStaffIds);
    }else{
        $.each(datas,function(i,v){
            overAllStaffIds.splice(overAllStaffIds.indexOf(v.staffId),1);    //删除取消选中行
        });
    }

    //console.log(overAllIds);
}


function correlGroupStaff() {
    $('#addName').unbind().click(function (){
        var groupId = $('#groupTable input:checkbox:checked').val();
        console.log("ajax groupId:"+groupId);
        var staffIds = [];
        // $('#staffTable input:checkbox').each(function () {
        //     var staffId = $(this).parent('td').parent('tr').attr('data-id');
        //     console.log("data-id:"+staffId);
        //     if(this.checked == true && staffId != undefined && staffId != null){
        //         staffIds.push(staffId);
        //     }
        // });
        // console.log(staffIds);
        var paramsJson = {"groupId":groupId,"staffIds":overAllStaffIds};
        var param = jQuery.param(paramsJson);
        console.log(param);
        $.ajax({
            url:"/group/staffRelation/edit?groupId="+groupId+"&staffIds="+overAllStaffIds,
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

// <th class="bs-checkbox " style="text-align: center; width: 36px; " data-field="0" tabindex="0"><div class="th-inner "><input name="btSelectAll" type="checkbox"></div><div class="fht-cell"></div></th>