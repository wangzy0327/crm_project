$(function () {
    editSend();
    chooseSend();
    deleteSend();
    saveContent();
})
function editSend() {
    $('.changeSend').off('click');
    $(document).on('click','.changeSend',function () {
        loadSendModalData();
        loadSendStaff();
        $('#modalSave').off('click');
        updateSend();
    });
}


function loadSendModalData(){
    var dtf = $("#sendTable").DataTable({
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
                d.searchValue = $('#sendName').val();
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
                    return "<a href='#' class='choose' style='margin: 0 5px 0 5px' data-name='"+row.name+"' data-id='" + row.id+"' >选择</a> ";
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

function loadSendStaff() {
    var staffIds = [];
    var staffNames = [];
    $("#toStaffs span").each(function(){
        var staffId = $(this).attr("data-id");
        var staffName = $(this).attr("data-name");
        staffIds.push(staffId);
        staffNames.push(staffName);
    });
    var str = '';
    for(var i = 0;i<staffIds.length;i++){
        str+="<span style='margin-left: 5px;margin-right: 5px;' data-id='"+staffIds[i]+"' data-name='"+staffNames[i]+"'>"+staffNames[i]+"<a href='#' onclick='javascript:void(0);' data-id='"+staffIds[i]+"'>[删除]</a></span>"
    }
    $('#staffs').html("<span>人员：</span>"+str);
}

function updateSend() {
    $("#modalSave").unbind().click(function () {
        var staffIds = [];
        var staffNames = [];
        $("#staffs span").each(function(){
            var staffId = $(this).attr("data-id");
            var staffName = $(this).attr("data-name");
            if(staffId != undefined && staffId!= ''){
                staffIds.push(staffId);
                staffNames.push(staffName);
            }
        });
        $('#editSend').modal('hide');
        var str = '';
        $('#toStaffs span').remove();
        for(var i = 0;i<staffNames.length;i++){
            $('#toStaffs').append("<span style='margin-left: 8px;margin-right: 8px;' data-id = '"+staffIds[i]+"' data-name= '"+staffNames[i]+"'>"+staffNames[i]+"</span>");
        }
    });
}

function chooseSend() {
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
            $('#staffs').append("<span style='margin-left: 5px;margin-right: 5px;' data-id='"+id+"' data-name='"+name+"'>"+name+"<a href='#' onclick='javascript:void(0);' data-id='"+id+"'>[删除]</a></span>");
        }
    })
}

function deleteSend() {
    $('#staffs').on('click', 'a', function () {
        var index = $(this).index();
        $(this).parent('span').remove();
    });
}

function saveContent() {
    $('#saveRichText').click(function () {
        var staffIds = [];
        $('#toStaffs').find('span').each(function () {
            console.log("staffId:"+$(this).attr('data-id'));
            staffIds.push($(this).attr('data-id'));
        });
        var id = ($("input[name = 'id']"))[0].value;
        if(id != null && id != ''){
            console.log("messageId:"+id);
            Ewin.confirm({ message: "已保存！" });
            return ;
        }
        console.log('staffIds:'+staffIds);
        var tagIds = [];
        var picUrl = $('.file-item').attr('data-url');
        console.log("picUrl:"+picUrl);
        var title = $($('.note-editable')[0]).html().trim();
        console.log("title:"+title);
        if(title == undefined || title == null || title == ''){
            Ewin.confirm({ message: "标题不能为空" });
            return ;
        }
        var titleText = $($('.note-editable')[0]).text().trim();
        var description = $($('.note-editable')[1]).html().trim();
        var descriptionText = $($('.note-editable')[1]).text().trim();
        var tags = new Array();
        var spanTags = $(".tag").children("span");
        for(i = 0;i<spanTags.length;i++){
            console.log($.trim($(spanTags[i]).text().substring(0,10)));
            tags.push($.trim($(spanTags[i]).text().substring(0,10)));
        }
        console.log("tags:"+tags);
        $.ajax({
            url: "/message/save/richText?tags="+tags,
            type: "POST",
            dataType: 'json',
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "corpId":"wx4b8e52ee9877a5be",
                "suiteId":"wx9b2b1532fd370525",
                "corpid":"wx4b8e52ee9877a5be",
                "msgtype":"1",
                "titleText":titleText,
                "title":title,
                "descriptionText":descriptionText,
                "description":description,
                "picUrl":picUrl
            }),
            success: function (result) {
                if (result.code == 0) {
                    var data = result.data;
                    console.log("data:"+data);
                    console.log("id:"+data.id);
                    $("input[name = 'id']").val(data.id);
                    Ewin.confirm({ message: "保存成功" });
                }
            },
            error: function (result) {
                console.log(result);
                alert(result.status);
            }
        })
    })
}