$(document).ready(function () {
    $('#searchLogModal').bind("click",function () {
        $('#logTable').dataTable().fnDraw(false);
    });
    $('#clearLogModal').bind("click",function () {
        $('#visitLogName').val('');
        $('#startTimeLog').val('');
        $('#endTimeLog').val('');
    });
    $('#searchLogModal').bind("click",function () {
        $('#logTable').dataTable().fnDraw(false);
    });
    $('#clearLogModal').click(function () {
        $('#visitLogName').val('');
        $('#startTimeLog').val('');
        $('#endTimeLog').val('');
    });
    //清除弹窗原数据
    $('body').on('hidden.bs.modal', '.modal', function () {
        $(this).removeData('bs.modal');
    });
    loadLogData();
    //加载数据
    //显示拜访记录详情
    showLogDetail();

});

function loadLogData() {
    $(document).delegate(".visitLog", "click", function () {
        $('#logTable').dataTable().fnDestroy();
        var id = $(this).attr("data-id");
        console.log(id);
        loadLogModalData(id);
    });
}

function loadLogModalData(id) {
    $("#logTable").DataTable({
        "searching":false,
        "processing": true, //loding效果
        "serverSide": true, //服务端处理
        "searchDelay": 500,//搜索延迟
        "order": [[0, 'desc']],//默认排序方式
        "destory":true,//Cannot reinitialise DataTable,解决重新加载表格内容问题
        // "retrieve": true,
        "lengthMenu": [ 5,10],//每页显示数据条数菜单
        "ajax": {
            url: "/log", //获取数据的URL
            type: "get", //获取数据的方式
            data:function (d) {
                d.customerId = id;
                d.searchValue = $('#visitLogName').val();
                d.startTime = $('#startTimeLog').val();
                d.endTime = $('#endTimeLog').val();
                console.log("searchValue:"+d.searchValue);
            }
        },
        "columns": [  //返回的JSON中的对象和列的对应关系
//                {"data":"id","name":"id"},
//                {"data":"itemId","name":"item_id"},
            {
                "data": function (row) {
                    if (row.customerName!=undefined && row.customerName!= null && row.customerName.length > 15) {
                        return row.customerName.substring(0, 15) + "...";
                    } else {
                        return row.customerName;
                    }
                }, "name": "customer_name"
            },
            {
                "data": function (row) {
                    if (row.staffName!=undefined && row.staffName!= null && row.staffName.length > 15) {
                        return row.staffName.substring(0, 15) + "...";
                    } else {
                        return row.staffName;
                    }
                }, "name": "staff_name"
            },
            {
                "data": function (row) {
                    return row.way;
                }, "name": "way"
            },
            {
                "data": function (row) {
                    return row.result;
                }, "name": "result"
            },
            {
                "data": function (row) {
                    return row.requirement;
                }, "name": "requirement"
            },
            {
                "data": function (row) {
                    return "<a href='#' class='log' style='margin: 0 5px 0 5px'  data-id='" + row.id+"' data-target='#logDetail' data-toggle='modal' >查看</a> ";;
                }
            }
        ],
        "columnDefs": [ //具体列的定义
            {
                "targets": [0],
                "searchable": true
            },
            {
                "targets": [0],
                "orderable": true
            },
            {
                "targets": [2,4,5],
                "orderable": false
            }
        ],
        "language": {
            "lengthMenu": "显示 _MENU_ 条记录",
//                "search": "搜索:",
//                "searchPlaceholder":"姓名/微信",
            "info": "从 _START_ 到 _END_ 共 _TOTAL_ 条记录",
            "processing": "加载中...",
            "zeroRecords": "暂无数据",
            "infoEmpty": "从 0 到 0 共 0 条记录",
            "infoFiltered": "(从 _MAX_ 条记录中读取)",
            "paginate": {
                "first": "首页",
                "last": "末页",
                "next": "下一页",
                "previous": "上一页"
            }
        }
    });
}


function showLogDetail() {
    $(document).on('click','.log',function () {
        var id = $(this).attr("data-id");
        console.log("logId:"+id);
        loadLogDetail(id);
    })
}

function loadLogDetail(id) {
    $.ajax({
        url:"/log/detail?id="+id,
        type:"GET",
        contentType: "application/json;charset=UTF-8",
        dataType:'json',
        success:function (result) {
            if(result.code == 0){
                var data = result.data;
                console.log(data);
                $("input[name='customerName']").val(data.customerName);
                $("input[name='staffName']").val(data.staffName);
                $("input[name='way']").val(data.way);
                $("input[name='result']").val(data.result);
                $("textarea[name='requirement']").val(data.requirement);
                $("textarea[name='memo']").val(data.memo);
            }
        },
        error:function (result) {
            console.log(result);
            alert(result.status);
        }
    });
}







