$(function () {
    var dt = loadMessageData();
    $('#searchButton').bind("click",function () {
        $('#editMessage').dataTable().fnDraw(false);
    });
    $('#clearButton').click(function () {
        $('#title').val('');
        $('#startTime').val('');
        $('#endTime').val('');
    });
    loadDeleteConfirm();
    toggle();

});

function loadDeleteConfirm() {
    $(document).delegate(".delLink", "click", function () {
        var id = $(this).attr("data-id");
        console.log(id);
        deleteData(id);
    });
}

function deleteData(id) {
    console.log("id"+id);
    Ewin.confirm({ message: "确认要删除选择的数据吗？" }).on(function (e) {
        if (!e) {
            return;
        }
        $.ajax({
            type: "DELETE",
            url: "/message/delete?id="+id,
            dataType:'json',
            success: function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log(result.msg);
                    // toastr.success('删除成功');
                }
                $('#editable').DataTable().ajax.reload(null,false);
            },
            error: function () {
                // toastr.error('Error');
            },
            complete: function () {

            }

        });
    });

}

function toggle() {
    $(document).delegate(".toggle", "click", function () {
        var id = $(this).attr("data-id");
        var className = $(this).children("i").attr('class');
        console.log("className:"+className);
        if($(this).children("i").hasClass('fa-toggle-on')){
            $(this).children("i").removeClass('fa-toggle-on');
            $(this).children("i").addClass('fa-toggle-off');
            // var editButton = $(this).find('.editLink').attr('class');
            // var id = $(this).children('td').find('.editLink').attr('data-id');
            // console.log("editButton:"+editButton);
            // console.log("id:"+id);
            $.ajax({
                url:"/message/stop?id="+id,
                type:"GET",
                contentType: "application/json;charset=UTF-8",
                dataType:'json',
                success:function (result) {
                    if(result.code == 0){
                        var data = result.data;
                        Ewin.confirm({message: "停用成功!"});
                    }
                    $("#editMessage").DataTable().ajax.reload(null,false);
                },
                error:function (result) {
                    console.log(result);
                    alert(result.status);
                    $("#editMessage").DataTable().ajax.reload(null,false);
                }
            });
            // $($(this).find('.editLink')).hide();
            // ($(this).find('.delLink'))[0].hide();
        }else{
            $(this).children("i").removeClass('fa-toggle-off');
            $(this).children("i").addClass('fa-toggle-on');
            $.ajax({
                url:"/message/start?id="+id,
                type:"GET",
                contentType: "application/json;charset=UTF-8",
                dataType:'json',
                success:function (result) {
                    if(result.code == 0){
                        Ewin.confirm({message: "启用成功!"});
                    }
                    $("#editMessage").DataTable().ajax.reload(null,false);
                },
                error:function (result) {
                    console.log(result);
                    alert(result.status);
                    $("#editMessage").DataTable().ajax.reload(null,false);
                }
            });

            // $(this).find('.editLink').show();
            // $(this).find('.delLink').show();
        }
    })
}

//加载数据
function loadMessageData() {
    var dt = $("#editMessage").DataTable({
        "searching":false,
        "processing": true, //loding效果
        "serverSide": true, //服务端处理
        "searchDelay": 500,//搜索延迟
        "order": [[4, 'desc']],//默认排序方式
        "destory":true,//Cannot reinitialise DataTable,解决重新加载表格内容问题
        "retrieve":true,
        "lengthMenu": [5, 10, 25, 50, 100],//每页显示数据条数菜单
        "ajax": {
            url: "/message", //获取数据的URL
            type: "post", //获取数据的方式
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
                    if (row.titleText.length > 15) {
                        return row.titleText.substring(0, 15) + "...";
                    } else {
                        return row.titleText;
                    }
                }, "name": "title"
            },
            {
                "data": function (row) {
                    return row.shareMessage;
                }, "name": "shareMessage"
            },
            {
                "data": function (row) {
                    return row.msgName;
                }, "name": "msgName"
            },
            {
                "data": function (row) {
                    return row.createUserName;
                }, "name": "createUserName"
            },
            {
                "data": function (row) {
                    return row.updateTime;
                }, "name": "update_time"
            },
            {
                "data": function (row) {
                    if(row.status == 1)
                        return "<a href='#' class='toggle' style='margin: 0 5px 0 5px' data-id='" + row.id + "' data-target='#editModal' data-toggle='modal'><i class='fa fa-toggle-on'></i></a> ";
                    else{
                        return "<a href='#' class='toggle' style='margin: 0 5px 0 5px' data-id='" + row.id + "' data-target='#editModal' data-toggle='modal'><i class='fa fa-toggle-off'></i></a> ";
                    }
                }
            },
            {
                "data": function (row) {
                    if(row.status == 1){
                        if(row.msgtype == 1){
                            return "<a href='../richtext/richtext-edit.html?id="+row.id+"'  class='editLink' style='margin: 0 5px 0 5px;' data-id='" + row.id + "' ><i class='fa fa-edit'></i></a> "+
                                "<a href='#' class='delLink' style='margin: 0 5px 0 5px' data-id='" + row.id + "' ><i class='fa fa-trash'></i></a>";;
                        }else if(row.msgtype == 2){
                            return "<a href='../doc/doc-edit.html?id="+row.id+"'  class='editLink' style='margin: 0 5px 0 5px;' data-id='" + row.id + "' ><i class='fa fa-edit'></i></a> "+
                                "<a href='#' class='delLink' style='margin: 0 5px 0 5px' data-id='" + row.id + "' ><i class='fa fa-trash'></i></a>";;
                        }else if(row.msgtype == 5){
                            return "<a href='../h5/h5-edit.html?id="+row.id+"'  class='editLink' style='margin: 0 5px 0 5px;' data-id='" + row.id + "' ><i class='fa fa-edit'></i></a> "+
                                "<a href='#' class='delLink' style='margin: 0 5px 0 5px' data-id='" + row.id + "' ><i class='fa fa-trash'></i></a>";;
                        }else if(row.msgtype == 6){
                            return "<a href='../graphic/graphic-edit.html?id="+row.id+"' class='editLink' style='margin: 0 5px 0 5px;' data-id='" + row.id + "' ><i class='fa fa-edit'></i></a> "+
                                "<a href='#' class='delLink' style='margin: 0 5px 0 5px' data-id='" + row.id + "' ><i class='fa fa-trash'></i></a>";;
                        }
                    }
                    else{
                        if(row.msgtype == 1){
                            return "<a href='../richtext/richtext-edit.html?id="+row.id+"' class='editLink' style='margin: 0 5px 0 5px;display: none;' data-id='" + row.id + "' ><i class='fa fa-edit'></i></a> "+
                                "<a href='#' class='delLink' style='margin: 0 5px 0 5px;display: none;' data-id='" + row.id + "' ><i class='fa fa-trash'></i></a>";;
                        }else if(row.msgtype == 2){
                            return "<a href='../doc/doc-edit.html?id="+row.id+"' class='editLink' style='margin: 0 5px 0 5px;display: none;' data-id='" + row.id + "' ><i class='fa fa-edit'></i></a> "+
                                "<a href='#' class='delLink' style='margin: 0 5px 0 5px;display: none;' data-id='" + row.id + "' ><i class='fa fa-trash'></i></a>";;
                        }else if(row.msgtype == 5){
                            return "<a href='../h5/h5-edit.html?id="+row.id+"'  class='editLink' style='margin: 0 5px 0 5px;display: none;' data-id='" + row.id + "' ><i class='fa fa-edit'></i></a> "+
                                "<a href='#' class='delLink' style='margin: 0 5px 0 5px;display: none;' data-id='" + row.id + "' ><i class='fa fa-trash'></i></a>";;
                        }else if(row.msgtype == 6){
                            return "<a href='../graphic/graphic-edit.html?id="+row.id+"' class='editLink' style='margin: 0 5px 0 5px;display: none;' data-id='" + row.id + "' ><i class='fa fa-edit'></i></a> "+
                                "<a href='#' class='delLink' style='margin: 0 5px 0 5px;display: none;' data-id='" + row.id + "' ><i class='fa fa-trash'></i></a>";;
                        }
                    }
                }
            }
        ],
        "columnDefs": [ //具体列的定义
            {
                "targets": [0,3],
                "searchable": true
            },
            {
                "targets": [0,4],
                "orderable": true
            },
            {
                "targets": [0,1,2,3,5,6],
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
    return dt;
}