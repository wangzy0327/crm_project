$(document).ready(function () {
    $('#searchPlanModal').bind("click",function () {
        $('#planTable').dataTable().fnDraw(false);
    });
    $('#clearPlanModal').bind("click",function () {
        $('#visitPlanName').val('');
        $('#startTimePlan').val('');
        $('#endTimePlan').val('');
    });
    $('#searchPlanModal').bind("click",function () {
        $('#planTable').dataTable().fnDraw(false);
    });
    $('#clearPlanModal').click(function () {
        $('#visitPlanName').val('');
        $('#startTimePlan').val('');
        $('#endTimePlan').val('');
    });
    //清除弹窗原数据
    $('body').on('hidden.bs.modal', '.modal', function () {
        $(this).removeData('bs.modal');
    });
    loadPlanData();
    //加载数据
    //显示拜访计划详情
    showPlanDetail();

});

function loadPlanData() {
    $(document).delegate(".visitPlan", "click", function () {
        $('#planTable').dataTable().fnDestroy();
        var id = $(this).attr("data-id");
        console.log(id);
        loadPlanModalData(id);
    });
}

function loadPlanModalData(id) {
    $("#planTable").DataTable({
        "searching":false,
        "processing": true, //loding效果
        "serverSide": true, //服务端处理
        "searchDelay": 500,//搜索延迟
        "order": [[0, 'desc']],//默认排序方式
        "destory":true,//Cannot reinitialise DataTable,解决重新加载表格内容问题
        // "retrieve": true,
        "lengthMenu": [ 5,10],//每页显示数据条数菜单
        "ajax": {
            url: "/plan", //获取数据的URL
            type: "get", //获取数据的方式
            data:function (d) {
                d.customerId = id;
                d.searchValue = $('#visitPlanName').val();
                d.startTime = $('#startTimePlan').val();
                d.endTime = $('#endTimePlan').val();
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
                    return row.place;
                }, "name": "place"
            },
            {
                "data": function (row) {
                    return fmtDate(row.time);
                }, "name": "time"
            },
            {
                "data": function (row) {
                    return fmtDate(row.remind);
                }, "name": "remind"
            },
            {
                "data": function (row) {
                    return "<a href='#' class='plan' style='margin: 0 5px 0 5px' data-id='" + row.id+"' data-target='#planDetail' data-toggle='modal'>查看</a> ";;
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
                "targets": [2,5],
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

function showPlanDetail() {
    $(document).on('click','.plan',function () {
        var id = $(this).attr("data-id");
        console.log("planId:"+id);
        loadPlanDetail(id);
    })
}

function loadPlanDetail(id) {
    $.ajax({
        url:"/plan/detail?id="+id,
        type:"GET",
        contentType: "application/json;charset=UTF-8",
        dataType:'json',
        success:function (result) {
            if(result.code == 0){
                var data = result.data;
                console.log(data);
                $("input[name='customerName']").val(data.customerName);
                $("input[name='staffName']").val(data.staffName);
                $("input[name='place']").val(data.place);
                $("input[name='time']").val(fmtDate(data.time));
                $("textarea[name='content']").val(data.content);
            }
        },
        error:function (result) {
            console.log(result);
            alert(result.status);
        }
    });
}





