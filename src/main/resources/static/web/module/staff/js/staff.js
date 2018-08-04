$(document).ready(function () {
    var dt = loadData();
    $('#searchButton').bind("click",function () {
        $('#editable').dataTable().fnDraw(false);
    })
    $('#clearButton').click(function () {
        $('#title').val('');
        $('#startTime').val('');
        $('#endTime').val('');
    })
    loadDetailData();
    updateDetail(dt);
    deleteStaffData(dt);

});


//加载数据
function loadData() {
    var dt = $("#editable").DataTable({
        "searching":false,
        "processing": true, //loding效果
        "serverSide": true, //服务端处理
        "searchDelay": 500,//搜索延迟
        "order": [[1, 'desc']],//默认排序方式
        "destory":true,//Cannot reinitialise DataTable,解决重新加载表格内容问题
        "lengthMenu": [5, 10, 25, 50, 100],//每页显示数据条数菜单
        "ajax": {
            url: "/staff", //获取数据的URL
            type: "get", //获取数据的方式
            data:function (d) {
                d.searchValue = $('#title').val();
                d.startTime = $('#startTime').val();
                d.endTime = $('#endTime').val();
                console.log("searchValue:"+d.searchValue);
                console.log("startTime:"+d.startTime);
                console.log("endTime:"+d.endTime);
            }
        },
        "columns": [  //返回的JSON中的对象和列的对应关系
//                {"data":"id","name":"id"},
//                {"data":"itemId","name":"item_id"},
            {
                "data": function (row) {
                    if (row.name.length > 15) {
                        return row.name.substring(0, 15) + "...";
                    } else {
                        return row.name;
                    }
                }, "name": "name"
            },
            {
                "data": function (row) {
                    if (row.role == 0) {
                        return "普通成员";
                    } else {
                        return "管理员";
                    }
                }, "name": "role"
            },
            {
                "data": function (row) {
                    return row.age;
                }, "name": "age"
            },
            {
                "data": function (row) {
                    return row.wx;
                }, "name": "wx"
            },
            {
                "data": function (row) {
                    return row.phone;
                }, "name": "phone"
            },
            {
                "data": function (row) {
                    return row.email;
                }, "name": "email"
            },
            {
                "data": function (row) {
                    return "<a href='" + '#' + "' target='view_window' style='margin: 0 5px 0 5px' class='previewLink' data-id='" + row.id + "'><i class='fa fa-eye'></i></a> " +
                        "<a href='#' class='editLink' style='margin: 0 5px 0 5px' data-id='" + row.id + "' data-target='#editModal' data-toggle='modal'><i class='fa fa-edit'></i></a> " +
                        "<a href='#' class='delLink' style='margin: 0 5px 0 5px' data-id='" + row.id + "' ><i class='fa fa-trash'></i></a>";
                }
            }
        ],
        "columnDefs": [ //具体列的定义
            {
                "targets": [0,1,3,4],
                "searchable": true
            },
            {
                "targets": [0,1,2,5],
                "orderable": true
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
    return dt;
}

function loadDetailData() {
    $(document).delegate(".editLink", "click", function () {
        var id = $(this).attr("data-id");
        queryDetail(id);
    })

}

function deleteStaffData(dt) {
    $(document).delegate(".delLink", "click", function () {
        var id = $(this).attr("data-id");
        deleteData(dt,id);
    })
}

function updateDetail(dt) {
    $("#modalSave").click(function () {
        $.ajax({
            url:"/staff/edit",
            type:"PUT",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id":$("input[name='id']").val(),
                "name":$("input[name='name']").val(),
                "age":$("input[name='age']").val(),
                "wx":$("input[name='wx']").val(),
                "phone":$("input[name='phone']").val(),
                "email":$("input[name='email']").val()
            }),
            dataType:'json',
            success:function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log(data);
                }
                $('#editModal').modal('hide');
                dt.ajax.reload(null,false);
            },
            error:function (result) {
                console.log(result);
                alert(result.status);
                dt.ajax.reload(null,false);
            }
        });
//                $('#editable').dataTable().fnDestroy();
    })
}

function queryDetail(id) {
    console.log("id"+id);
    $.ajax({
        url:"/staff/one?id="+id,
        type:"GET",
        dataType: 'json',
        success:function (result) {
            if(result.code == 0){
                var data = result.data;
                $("input[name='id']").val(data.id);
                $("input[name='name']").val(data.name);
                $("input[name='age']").val(data.age);
                $("input[name='wx']").val(data.wx);
                $("input[name='phone']").val(data.phone);
                $("input[name='email']").val(data.email);
            }
        },
        error:function (result) {
            console.log(result);
            alert(result.status);
        }
    })
}

function deleteData(dt,id) {
    console.log("id"+id);
    $.ajax({
        url:"/staff/delete?id="+id,
        type:"DELETE",
        dataType:'json',
        success:function (result) {
            if(result.code == 0){
                var data = result.data;
                console.log(result.msg);
            }
            dt.ajax.reload(null,false);
        },
        error:function (result) {
            console.log(result);
            alert(result.status);
            dt.ajax.reload();
        }
    });
}




