$(document).ready(function () {
    $('#searchGroup').bind("click",function () {
        $('#groupTable').bootstrapTable('refresh');
    });
    $('#clearGroup').click(function () {
        $('#title').val('');
    });
    initGroupTable();
    loadGroupModal();
    addGroup();
    updateGroup();
    editValidator();
    loadDeleteConfirm();
    $("#addGroupModal").on('hidden.bs.modal',function(e){
        //移除上次的校验配置
        $("#addGroupForm").data('bootstrapValidator').destroy();
        $('#addGroupForm').data('bootstrapValidator',null);
        addValidator();
        //重新启用提交按钮
    });
    $("#editGroupModal").on('hidden.bs.modal',function(e){
        //移除上次的校验配置
        $("#editGroupForm").data('bootstrapValidator').destroy();
        $('#editGroupForm').data('bootstrapValidator',null);
        editValidator();
    });
});

function initGroupTable() {
    $("#groupTable").bootstrapTable({
        url: '/group',
        method: 'get',
        contentType: "application/json;charset=UTF-8",//当请求方法为post的时候,必须要有！！！！
        toolbar: '#toobar',//工具列
        striped: true,//隔行换色
        cache: false,//禁用缓存
        pageSize: 5,//单页记录数
        pageList: [ 5, 10, 20, 30],//可选择单页记录数
        pagination: true,//启动分页
        sidePagination: 'client',//分页方式
        pageNumber: 1,//初始化table时显示的页码
        showFooter: false,//是否显示列脚
        showPaginationSwitch: true,//是否显示 数据条数选择框
        clickToSelect: true,//点击选中checkbox
        singleSelect: true,//启用单行选中
        uniquedId:"id", //每一行的唯一标识，一般为主键列
        // idField: 'SystemCode',//key值栏位
        // sortable: false,//排序
        // search: true,//启用搜索
        // showColumns: true,//是否显示 内容列下拉框
        // showRefresh: true,//显示刷新按钮

        //得到查询的参数
        queryParams : function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                title:$('#title').val()
            };
            return temp;
        },
        columns: [
            {
                // field: 'state',
                // align: 'center',
                checkbox: true,
                formatter:function (value,row,index) {
                    // return '<input data-index="'+index+'" name="btSelectItem" type="checkbox" data-id = "'+row.id+'" >';
                    if(index == 0){
                        return {
                            checked:true,
                            value:row.id
                            // data-id:row.id
                        }
                    }else{
                        // return '<input data-index="'+index+'" name="btSelectItem" type="checkbox" data-id = "'+row.id+'" >';
                        return {
                            value:row.id
                        }
                    }
                }
            },
            {
                title: '组名',
                field: 'name',
                align: 'center',
                valign: 'middle',
                sortable: true
            },
            {
                title:'操作',
                align:"center",
                formatter:function (value,row,index) {
                    return "<a href='#' class='editGroup' style='margin: 0 5px 0 5px'  data-target='#editGroupModal' data-toggle='modal' data-id='" + row.id+"' >编辑</a> "+
                        "<a href='#' class='deleteGroup' style='margin: 0 5px 0 5px' data-target='#deleteConfirm' data-toggle='modal' data-id='" + row.id+"' >删除</a> ";
                }
            }
        ]

    });
}

function loadGroupModal() {
    $('.editGroup').off('click');
    $(document).on('click', '.editGroup', function () {
        var id = $(this).attr("data-id");
        console.log(id);
        loadGroupData(id);
    });
}

function loadGroupData(id) {
    console.log("id:" + id);
    $.ajax({
        url: "/group/one?id=" + id,
        type: "GET",
        dataType: 'json',
        success: function (result) {
            if (result.code == 0) {
                var data = result.data;
                $("#editGroupForm input[name='id']").val(data.id);
                $("#editGroupForm input[name='title']").val(data.name);
            }
        },
        error: function (result) {
            console.log(result);
            alert(result.status);
        }
    })
}

function addGroup() {
    $('#addBtn').unbind().click(function () {
        $('#addGroupForm').bootstrapValidator('validate');//提交验证
        if ($('#addGroupForm').data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码
            //验证成功后的操作，如ajax
            $.ajax({
                url: "/group/add",
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify({
                    "name": $("#addGroupModal input[name='title']").val()
                }),
                dataType: 'json',
                success: function (result) {
                    if (result.code == 0) {
                        var data = result.data;
                        console.log(data);
                        $('#addModal').modal('hide');
                    } else if (result.code == 3) {
                        alert("标签名重复");
                    }
                    $('#groupTable').bootstrapTable('refresh');
                },
                error: function (result) {
                    console.log(result);
                    alert(result.status);
                    $('#groupTable').bootstrapTable('refresh');
                }
            });
        }

    });
}

function addValidator() {
    $('#addGroupForm').bootstrapValidator({
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
    $('#editGroupForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            title: {
                validators: {
                    notEmpty: {        // 非空校验+提示信息
                        message: '组名不能为空'
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

function updateGroup() {
    $("#editGroupBtn").unbind().click(function () {
        $.ajax({
            url:"/group/edit",
            type:"PUT",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id":$("#editGroupForm input[name='id']").val(),
                "name":$("#editGroupForm input[name='title']").val()
            }),
            dataType:'json',
            success:function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log(data);
                    $('#editGroupModal').modal('hide');
                }else if(result.code == 3){
                    alert("组名已存在");
                }
                $('#groupTable').bootstrapTable('refresh');
            },
            error:function (result) {
                console.log(result);
                alert(result.status);
                $('#groupTable').bootstrapTable('refresh');
            }
        });
//                $('#editable').dataTable().fnDestroy();
    })
}

function loadDeleteConfirm() {
    $(document).delegate(".deleteGroup", "click", function () {
        var id = $(this).attr("data-id");
        console.log(id);
        deleteData(id);
    });
}

function deleteData(id) {
    console.log("id"+id);
    $("#del").unbind().click(function () {
        $.ajax({
            url:"/group/delete?id="+id,
            type:"DELETE",
            dataType:'json',
            success:function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log(result.msg);
                }
                $('#deleteConfirm').modal('hide');
                $('#groupTable').bootstrapTable('refresh');
            },
            error:function (result) {
                console.log(result);
                alert(result.status);
                $('#deleteConfirm').modal('hide');
                $('#groupTable').bootstrapTable('refresh');
            }
        });
    });
}