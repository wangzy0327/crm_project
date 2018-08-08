$(document).ready(function () {
    $('#searchName').bind("click",function () {
        $('#staffTable').bootstrapTable('refresh');
    });
    $('#clearName').click(function () {
        $('#staffName').val('');
    });
    // addSelectAll();
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
        pageNumber: 1,//初始化table时显示的页码
        showFooter: false,//是否显示列脚
        showPaginationSwitch: true,//是否显示 数据条数选择框
        clickToSelect: true,//点击选中checkbox
        // idField: 'SystemCode',//key值栏位
        // sortable: false,//排序
        // search: true,//启用搜索
        // showColumns: true,//是否显示 内容列下拉框
        // showRefresh: true,//显示刷新按钮

        //得到查询的参数
        queryParams : function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                title:$('#staffName').val(),
                // groupId:34
                // groupId:$('#groupTable input:checkbox:checked').val()
                groupId:id
            };
            return temp;
        },
        columns: [
            {
                align: 'center',
                checkbox: true,
                formatter:function (value,row,index) {
                    console.log("groupId:"+row.groupId);
                    if(row.groupId!=null){
                        // return '<input data-index="'+index+'" name="btSelectItem" type="checkbox" checked="checked" value="'+row.messageId+'">';
                        return {
                            checked:true
                        }
                    }else{
                        // return '<input data-index="'+index+'" name="btSelectItem" type="checkbox"  value="'+row.messageId+'">';
                        return {
                            checked:false
                        }
                    }
                    // return '<input data-index="'+index+'" name="btSelectItem" type="checkbox" data-id = "'+row.id+'" >';
                    // var groupId = $('#groupTable input:checkbox:checked').val();
                    // console.log("groupId:"+groupId);
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
}

function addSelectAll() {
    var str = '<input name="btSelectAll" type="checkbox">';
    $($('#staffTable .th-inner')[0]).html(str);
    $($('#staffTable .th-inner')[0]).parent('th').addClass("bs-checkbox").css('width','36px');
}

function correlGroupStaff() {
    $('#addName').unbind().click(function (){
        var groupId = $('#groupTable input:checkbox:checked').val();
        console.log("ajax groupId:"+groupId);
        var staffIds = [];
        $('#staffTable input:checkbox').each(function () {
            var staffId = $(this).parent('td').parent('tr').attr('data-id');
            console.log("data-id:"+staffId);
            if(this.checked == true && staffId != undefined && staffId != null){
                staffIds.push(staffId);
            }
        });
        console.log(staffIds);
        var paramsJson = {"groupId":groupId,"staffIds":staffIds};
        var param = jQuery.param(paramsJson);
        console.log(param);
        $.ajax({
            url:"/group/relation/edit?groupId="+groupId+"&staffIds="+staffIds,
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