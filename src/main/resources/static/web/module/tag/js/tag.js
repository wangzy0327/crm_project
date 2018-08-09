$(document).ready(function () {
    $("form").validate();
    var dt = loadData();
    $('#searchButton').bind("click",function () {
        $('#editable').dataTable().fnDraw(false);
    });
    $('#clearButton').click(function () {
        $('#title').val('');
    });
    $('#addTag').click(function () {
        $("#addModal input[name='name']").val('');
    });
    loadEditData();
    addValidator();
    editValidator();
    addTag();
    updateTag();
    loadDeleteConfirm();
    $("#addModal").on('hidden.bs.modal',function(e){
        //移除上次的校验配置
        $("#addTagForm").data('bootstrapValidator').destroy();
        $('#addTagForm').data('bootstrapValidator',null);
        addValidator();
        //重新启用提交按钮
    });
    $("#editModal").on('hidden.bs.modal',function(e){
        //移除上次的校验配置
        $("#editTagForm").data('bootstrapValidator').destroy();
        $('#editTagForm').data('bootstrapValidator',null);
        editValidator();
    });
});


//加载数据
function loadData() {
    var dt = $("#editable").DataTable({
        "searching":false,
        "processing": true, //loding效果
        "serverSide": true, //服务端处理
        "searchDelay": 500,//搜索延迟
        "destory":true,//Cannot reinitialise DataTable,解决重新加载表格内容问题
        "lengthMenu": [5, 10, 25, 50, 100],//每页显示数据条数菜单
        "ajax": {
            url: "/tag", //获取数据的URL
            type: "get", //获取数据的方式
            data:function (d) {
                d.searchValue = $('#title').val();
                console.log("searchValue:"+d.searchValue);
            }
        },
        "columns": [  //返回的JSON中的对象和列的对应关系
//                {"data":"id","name":"id"},
//                {"data":"itemId","name":"item_id"},
            {
                "data": function (row) {
                    if (row.name!=undefined && row.name!=null && row.name.length > 15) {
                        return row.name.substring(0, 15) + "...";
                    } else {
                        return row.name;
                    }
                }, "name": "name"
            },
            {
                "data": function (row) {
                    return "<a href='#' class='editLink' style='margin: 0 5px 0 5px' data-id='" + row.id + "' data-target='#editModal' data-toggle='modal'><i class='fa fa-edit'></i></a> " +
                        "<a href='#' class='delLink' style='margin: 0 5px 0 5px' data-id='" + row.id + "' data-target='#deleteConfirm' data-toggle='modal' ><i class='fa fa-trash'></i></a>";
                }
            }
        ],
        "columnDefs": [ //具体列的定义
            {
                "targets": [0],
                "searchable": true
            },
            {
                "targets": [0,1],
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

function loadEditData() {
    $(document).delegate(".editLink", "click", function () {
        var id = $(this).attr("data-id");
        queryDetail(id);
    })

}

function loadDeleteConfirm() {
    $(document).delegate(".delLink", "click", function () {
        var id = $(this).attr("data-id");
        console.log(id);
        deleteData(id);
    });
}

function addTag() {
    $('#addBtn').unbind().click(function () {
        $('#addTagForm').bootstrapValidator('validate');//提交验证
        if ($('#addTagForm').data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码
            //验证成功后的操作，如ajax
            $.ajax({
                url: "/tag/add",
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify({
                    "name": $("#addModal input[name='name']").val()
                }),
                dataType: 'json',
                success: function (result) {
                    if (result.code == 0) {
                        var data = result.data;
                        console.log(data);
                    } else if (result.code == 3) {
                        $('#duplicatePrompt').modal('show');
                    }
                    $('#addModal').modal('hide');
                    $('#editable').DataTable().ajax.reload(null, false);
                },
                error: function (result) {
                    console.log(result);
                    alert(result.status);
                    $('#editable').DataTable().ajax.reload(null, false);
                }
            });
        }

    });
}

function addValidator() {
    $('#addTagForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                    notEmpty: {        // 非空校验+提示信息
                        message: '标签名不能为空'
                    },
                    stringLength: {     //输入　长度限制　　校验
                        max: 20,
                        message: '类别名长度必须小于20个字符'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) {
        e.preventDefault();
    });
}

function editValidator() {
    $('#editTagForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                    notEmpty: {        // 非空校验+提示信息
                        message: '标签名不能为空'
                    },
                    stringLength: {     //输入　长度限制　　校验
                        max: 20,
                        message: '类别名长度必须小于20个字符'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) {
        e.preventDefault();
    });
}

function updateTag() {
    $("#editBtn").unbind().click(function () {
        $.ajax({
            url:"/tag/edit",
            type:"PUT",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id":$("#editModal input[name='id']").val(),
                "name":$("#editModal input[name='name']").val()
            }),
            dataType:'json',
            success:function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log(data);
                }else if(result.code == 3){
                    Ewin.confirm({ message: "该标签已存在!" });
                    // $('#duplicatePrompt').modal('show');
                }
                $('#editModal').modal('hide');
                $('#editable').DataTable().ajax.reload(null, false);
            },
            error:function (result) {
                console.log(result);
                alert(result.status);
                $('#editable').DataTable().ajax.reload(null, false);
            }
        });
//                $('#editable').dataTable().fnDestroy();
    })
}

function queryDetail(id) {
    console.log("id"+id);
    $.ajax({
        url:"/tag/one?id="+id,
        type:"GET",
        dataType: 'json',
        success:function (result) {
            if(result.code == 0){
                var data = result.data;
                $("#editModal input[name='id']").val(data.id);
                $("#editModal input[name='name']").val(data.name);
            }
        },
        error:function (result) {
            console.log(result);
            Ewin.confirm({ message: result.status });
        }
    })
}

function deleteData(id) {
    console.log("id"+id);
    $("#del").unbind().click(function () {
        $.ajax({
            url:"/tag/delete?id="+id,
            type:"DELETE",
            dataType:'json',
            success:function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log(result.msg);
                }
                $('#deleteConfirm').modal('hide');
                $('#editable').DataTable().ajax.reload(null,false);
            },
            error:function (result) {
                console.log(result);
                Ewin.confirm({ message: result.status });
                $('#deleteConfirm').modal('hide');
                $('#editable').DataTable().ajax.reload(null,false);
            }
        });
    });
}




