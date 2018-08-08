$(document).ready(function () {
    $('#searchName').bind("click",function () {
        $('#staffTable').bootstrapTable('refresh');
    });
    $('#clearName').click(function () {
        $('#staffName').val('');
    });
    initStaffTable();
});
function initStaffTable() {
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
                // groupId:$('#groupTable input:checkbox:checked').val(),
                title:$('#staffName').val()
            };
            return temp;
        },
        columns: [
            {
                // field: 'state',
                checkbox: true,
                formatter:function (value,row,index) {
                    console.log($('#groupTable input:checkbox:checked').id);
                    // return '<input data-index="'+index+'" name="btSelectItem" type="checkbox" data-id = "'+row.id+'" >';
                    // var groupId = $('#groupTable input:checkbox:checked').val();
                    // console.log("groupId:"+groupId);
                }
            },
            {
                title: '姓名',
                field: 'name',
                align: 'center',
                valign: 'middle',
                sortable: true
            }
        ]

    });
}