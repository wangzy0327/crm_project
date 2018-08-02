$(document).ready(function () {
    var dt = loadCustomerData();
    $('#searchButton').bind("click",function () {
        $('#editCustomer').dataTable().fnDraw(false);
    });
    $('#clearButton').click(function () {
        $('#title').val('');
        $('#startTime').val('');
        $('#endTime').val('');
    });
    $('#searchButtonModal').bind("click",function () {
        $('#followTable').dataTable().fnDraw(false);
    });
    $('#clearButtonModal').click(function () {
        $('#followName').val('');
    });
    //清除弹窗原数据
    $('#editFollow').on('hidden.bs.modal', '.modal', function () {
        $(this).removeData('bs.modal');
    });
    $('#editPlan').on('hidden.bs.modal', '.modal', function () {
        $(this).removeData('bs.modal');
    });
    $('#editLog').on('hidden.bs.modal', '.modal', function () {
        $(this).removeData('bs.modal');
    });
    $('#logDetail').on('hidden.bs.modal', '.modal', function () {
        $(this).removeData('bs.modal');
    });
    $('#planDetail').on('hidden.bs.modal', '.modal', function () {
        $(this).removeData('bs.modal');
    });

    // $('.changeFollow').unbind().on('click',function () {
    //     var id = $(this).attr("data-id");
    //     console.log(id);
    //     loadFollowModalData();
    //     loadFollowStaff(id);
    //     updateFollow(id);
    // });

    loadFollowData();
    // loadPlanData();
    chooseFollow();
    deleteFollow();

    //加载数据
    function loadCustomerData() {
        var dt = $("#editCustomer").DataTable({
            "searching":false,
            "processing": true, //loding效果
            "serverSide": true, //服务端处理
            "searchDelay": 500,//搜索延迟
            "order": [[1, 'desc']],//默认排序方式
            "destory":true,//Cannot reinitialise DataTable,解决重新加载表格内容问题
            "retrieve":true,
            "lengthMenu": [5, 10, 25, 50, 100],//每页显示数据条数菜单
            "ajax": {
                url: "/customer", //获取数据的URL
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
                        if (row.customer.name.length > 15) {
                            return row.customer.name.substring(0, 15) + "...";
                        } else {
                            return row.customer.name;
                        }
                    }, "name": "customer.name"
                },
                {
                    "data": function (row) {
                        return row.customer.company;
                    }, "name": "customer.company"
                },
                {
                    "data": function (row) {
                        return row.customer.position;
                    }, "name": "customer.position"
                },
                {
                    "data": function (row) {
                        return row.customer.mobile;
                    }, "name": "customer.mobile"
                },
                {
                    "data": function (row) {
                        return row.customer.email;
                    }, "name": "customer.email"
                },
                {
                    "data": function (row) {
                        return getFollowName(row.followCus)+
                            "<a href='#' class='changeFollow' style='margin: 0 5px 0 5px' data-id='"+ row.id+"'  data-target='#editFollow' data-toggle='modal'>[更换]</a> ";
                    }, "name": "followCus"
                },
                {
                    "data": function (row) {
                        return "<a href='#' class='visitPlan' style='margin: 0 5px 0 5px' data-id='" + row.id+"'  data-target='#editPlan' data-toggle='modal'>拜访计划</a> " +
                            "<a href='#' class='visitLog' style='margin: 0 5px 0 5px' data-id='" + row.id + "' data-target='#editLog' data-toggle='modal'>拜访记录</a> ";
                    }
                }
            ],
            "columnDefs": [ //具体列的定义
                {
                    "targets": [0,1,3,4],
                    "searchable": true
                },
                {
                    "targets": [0,1,2],
                    "orderable": true
                },
                {
                    "targets": [5],
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

    function loadFollowData() {
        // $(document).delegate(".changeFollow", "click", function () {
        //     var id = $(this).attr("data-id");
        //     console.log(id);
        //     $('#followTable').dataTable().fnDestroy();
        //     loadFollowModalData();
        //     loadFollowStaff(id);
        //     updateFollow(id);
        // });
        $('.changeFollow').off('click');
        $(document).on('click','.changeFollow',function () {
            var id = $(this).attr("data-id");
            console.log(id);
            loadFollowModalData();
            loadFollowStaff(id);
            $('#modalSave').off('click');
            updateFollow(id);
        });
        // $('.changeFollow').on('click',function () {
        //     var id = $(this).attr("data-id");
        //     console.log(id);
        //     loadFollowModalData();
        //     loadFollowStaff(id);
        //     updateFollow(id);
        // });
        // $('.changeFollow').click(function () {
        //     var id = $(this).attr("data-id");
        //     console.log(id);
        //     loadFollowModalData();
        //     loadFollowStaff(id);
        //     updateFollow(id);
        // });
        // $(document).off("click",'.changeFollow');
    }

    function getFollowName(list) {
        var str = "";
        for(var i = 0;i<list.length;i++){
            if(i==list.length - 1){
                str+=list[i].name;
            }else{
                str= str + list[i].name + ', ';
            }
        }
        if(str.length>15)
            str = str.substring(0,15)+"...";
        return str==""?'无':str;
    }


    function loadFollowModalData(){
        var dtf = $("#followTable").DataTable({
            "searching":false,
            "processing": true, //loding效果
            "serverSide": true, //服务端处理
            "searchDelay": 500,//搜索延迟
            "order": [[0, 'desc']],//默认排序方式
            // "destory":true,//Cannot reinitialise DataTable,解决重新加载表格内容问题
            "retrieve": true,
            "lengthMenu": [ 5,10],//每页显示数据条数菜单
            "ajax": {
                url: "/staff", //获取数据的URL
                type: "get", //获取数据的方式
                data:function (d) {
                    d.searchValue = $('#followName').val();
                    d.startTime = '';
                    d.endTime = '';
                    console.log("searchValue:"+d.searchValue);
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
                        return "<a href='#' class='choose' style='margin: 0 5px 0 5px' data-name='"+row.name+"' data-id='" + row.id+"' >选择</a> ";;
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
                    "targets": [1],
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


    function loadFollowStaff(id) {
        $.ajax({
            url:"/customer/getCustomerFollow?id="+id,
            type:"GET",
            contentType: "application/json;charset=UTF-8",
            dataType:'json',
            success:function (result) {
                if(result.code == 0){
                    var data = result.data;
                    console.log(data);
                    $('#staffs').html('<span>人员：</span>');
                    for(var i = 0;i<data.length;i++){
                        $('#staffs').append("<span style='margin-left: 5px;margin-right: 5px;' data-id='"+data[i].id+"'>"+data[i].name+"<a href='#' onclick='javascript:void(0);' data-id='"+id+"'>[删除]</a></span>");
                    }
                }
            },
            error:function (result) {
                console.log(result);
                alert(result.status);
            }
        });
    }

    function chooseFollow() {
        var id;
        var name;
        $(document).delegate(".choose", "click", function () {
            id = $(this).attr("data-id");
            console.log('id:'+id);
            name = $(this).attr("data-name");
            var flag = 0;
            $("#staffs span").each(function(){
                var staffId = $(this).attr("data-id");
                if(staffId != undefined && staffId!= ''){
                    if(staffId == id){
                        flag = 1;
                        return ;
                    }
                }
            });
            if(flag == 0){
                $('#staffs').append("<span style='margin-left: 5px;margin-right: 5px;' data-id='"+id+"'>"+name+"<a href='#' onclick='javascript:void(0);' data-id='"+id+"'>[删除]</a></span>");
            }
        })
    }

    function deleteFollow() {
        $('#staffs').on('click', 'a', function () {
            var index = $(this).index();
            $(this).parent('span').remove();
        });
    }

    function updateFollow(customerId) {
        $("#modalSave").unbind().click(function () {
            var staffIds = [];
            $("#staffs span").each(function(){
                var staffId = $(this).attr("data-id");
                if(staffId != undefined && staffId!= '')
                    staffIds.push(staffId);
            });
            console.log("customerId:"+customerId);
            var params = {"customerId":customerId,"staffIds":staffIds};
            console.log(jQuery.param(params));
            $.ajax({
                url:"/customer/relation/edit?customerId="+customerId+"&staffIds="+staffIds,
                type:"PUT",
                contentType: "application/json;charset=UTF-8",
                dataType:'json',
                success:function (result) {
                    if(result.code == 0){
                        var data = result.data;
                        console.log(data);
                    }
                    $('#staffs').html("<span>人员：</span>");
                    $('#editFollow').modal('hide');
                    $('#editCustomer').DataTable().ajax.reload(null,false);
                },
                error:function (result) {
                    $('#staffs').html("<span>人员：</span>");
                    $('#editFollow').modal('hide');
                    console.log(result);
                    console.log(result.responseText);
                    alert(result.status);
                    $('#editCustomer').DataTable().ajax.reload(null,false);
                    // window.location.reload();
                }
            });
        });
    }

});





