var module = {};
module.data = {
    m: 1030000,
    m2: 1010000,
    code: YT.getUrlParam('code'),
    staff_id: YT.getUrlParam('staffid'),
    visit_id: YT.getUrlParam('id'),
    type: YT.getUrlParam('type'),
    isComment: YT.getUrlParam('iscomment'),
    comment_id: YT.getUrlParam('commentid')
};
$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});
module.eventHandler = {
    handleEvents: function () {
        this.addInformation();
    },
    //添加点击事件
    addInformation: function () {
        $('#save_content').click(function () {
            //获取评论的内容
            var contentStr = $("#feedback_contents").val();

            if (contentStr == null || contentStr == "") {
                $.alert("请填写评价内容！");
                return false;
            }
            //推送人信息
            var pushPersonObj = $("#push_show_pesonal").val();
            if (pushPersonObj.length == 0) {
                //-----没有子标记-----
                $.alert("请选择推送人员！");
                return false;
            }
            /*获取隐藏于中的之*/
            var nameStr = $("#namePush").val().split(',');
            var numStr = $("#userNum").val().split(',');
            //alert(nameStr.length+"   " + numStr.length);
            var timestamp = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + '  ' + new Date().getHours() + ':'
                + '' + new Date().getMinutes() + ':' + new Date().getSeconds();

            var params = module.data,
                staff_id = params.staff_id,
                visit_id = params.visit_id,
                type = params.type,
                comment_id = params.comment_id,
                content = $('#feedback_contents').val(),
                to_staff = $('#userNum').val();


            if (+module.data.isComment) {
                //获取数据
                var info = {
                    data: {
                        content: $('#feedback_contents').val(),
                        time: timestamp
                    },
                    t: 'comments',
                    ai: true
                };
                var data = {
                    m: module.data.m,
                    t: 'comments',
                    v: JSON.stringify([info]),
                    params: JSON.stringify({staff_id: staff_id, visit_id: visit_id, type: type, to_staff: to_staff})
                };


                YT.insert({
                    data: data,
                    successCallback: function (data) {
                        if (data.status == 200) {
                            $.alert("保存成功！");
                            location.href = 'visit-detail-evaluation.html?staff_id=' + module.data.staff_id + '&id=' + module.data.visit_id +
                                '&type=' + module.data.type + '&iscomment=1';
                        } else {
                            $.alert(data.message);
                        }
                    }
                });
            } else {
                var filter = [
                    {field: 'id', value: comment_id, operator: '=', relation: 'AND'}
                ];

                var info = [{
                    data: {
                        content: content,
                        time: timestamp
                    },
                    filter: filter
                }];

                var data = {
                    m: module.data.m,
                    t: 'comments',
                    v: JSON.stringify(info),
                    params: JSON.stringify({
                        staff_id: staff_id,
                        visit_id: visit_id,
                        comment_id: comment_id,
                        type: type,
                        to_staff: to_staff
                    })
                };

                YT.update({
                    data: data,
                    successCallback: function (data) {
                        if (data.status == 200) {
                            $.alert("保存成功！");
                            location.href = 'visit-detail-evaluation.html?staff_id=' + module.data.staff_id + '&id=' + module.data.visit_id +
                                '&type=' + module.data.type + '&iscomment=1';
                        } else {
                            $.alert(data.message);
                        }
                    }
                });
            }
        });
    }
},
    module.service = {
        initControls: function () {
            this.initDom();
            this.initCompare();
        },

        initDom: function () {
            var data = {
                m: 1010000,
                t: 'staffs',
                params: JSON.stringify({staff_id: module.data.staff_id, operator_id: '='})
            };

            YT.query({
                data: data,
                successCallback: function (data) {
                    if (200 == data.status) {
                        var type = module.data.type;

                        $('#visitName').val(YT.getUrlParam('name') + (type == 1 ? '(拜访计划)' : '(拜访记录)'));
                        $('#staffName').val(data.object[0].name);

                        module.data.staff_id = data.object[0].id;
                    } else {
                        $.alert(data.message);
                    }
                }
            });
        },

        initCompare: function () {
            var data = {
                m: 1010000,
                t: 'staffs',
                params: JSON.stringify({staff_id: module.data.staff_id, operator_id: '<>'})
                // filter: JSON.stringify(filter)
            };
            var each = [];
            YT.query({
                data: data,
                successCallback: function (data) {
                    if (data.status == 200) {
                        for (var i in data.object) {
                            each.push({
                                title: data.object[i].name,
                                value: data.object[i].id,
                                description: data.object[i].avatar
                            });
                        }
                        if (each == null || each == '') {
                            $.alert('暂无推送人员！');
                        }
                        $("#push_show_pesonal").select({
                            title: "请选择推送人员",
                            items: each,
                            multi: true,
                            beforeClose: function (values, titles) {
                                // alert(values);
                                if (titles.length == "") {
                                    $.toast("请选择推送人员", "cancel");
                                    return false;
                                }
                                return true;
                            },
                            onChange: function (data) {
                                for (var i in data.origins) {
                                    /*  if (data.origins[i].checked == false){
                                     $("#delete_append").append("<div class='head_img'><img src='images/header_name.jpg'/><p></p></div>");
                                     }else{
                                     alert("11");
                                     }*/
                                    /* alert(data.origins[i].checked);//选中的选项值
                                     alert(data.origins[i].value);//选中的选项值
                                     alert(data.origins[i].title);//选中的选项值
                                     alert(data.origins[i].description);//选中的选项值*/
                                }
                            },
                            onClose: function (data) {

                                var pushPersonObj = $("#namePush").val();
                                if (pushPersonObj.length == 0) {
                                    var selectedOption = data.data;
                                    for (var i in selectedOption.origins) {
                                        var title = selectedOption.origins[i].title;
                                        var imgUrl = selectedOption.origins[i].description;
                                        $("#delete_append").append("<div class='head_img'><img src='" + imgUrl + "'/><p id=" + i + ">" + title + "</p></div>");

                                    }
                                    //获取选择的用户和用户ID
                                    var str = $("#push_show_pesonal").val();
                                    var strNum = $("#push_show_pesonal").attr("data-values");
                                    //设置到隐藏于中
                                    $("#namePush").val(str);
                                    $("#userNum").val(strNum);

                                    $("#push_show_pesonal").val("添加推送人员");
                                    // $("#push_show_pesonal_hook").attr("type","text")
                                } else {
                                    $("#delete_append").empty();//清空元素
                                    var selectedOption = data.data;
                                    for (var i in selectedOption.origins) {
                                        var title = selectedOption.origins[i].title;
                                        var imgUrl = selectedOption.origins[i].description;
                                        $("#delete_append").append("<div class='head_img'><img src='" + imgUrl + "'/><p id=" + i + ">" + title + "</p></div>");
                                    }
                                    //获取选择的用户和用户ID
                                    var str = $("#push_show_pesonal").val();
                                    var strNum = $("#push_show_pesonal").attr("data-values");
                                    //设置到隐藏于中
                                    $("#namePush").val(str);
                                    $("#userNum").val(strNum);
                                    //$("#push_show_pesonal").val("添加推送人员");
                                    //$("#push_show_pesonal_hook").attr("type","hidden")
                                }  //if--else结束

                                //为添加推送人员添加点击事件
                                $("#delete_append img").each(function () {
                                    var nameStr = $("#namePush").val().split(','); //节点为空
                                    if (nameStr.length == 0) {
                                        return false;
                                    }
                                    //添加删除点击事件
                                    $(this).click(function () {
                                        ($(this).parent().remove());//删除该节点 同时删除该节点的数值和编号
                                        var nameForSelect = $(this).next().text();//获取当前人名称
                                        var domObj = $(this).next().attr("id");  //获取兄弟节点的dom的ID
                                        var nameStr = $("#namePush").val().split(',');//获取隐藏域值
                                        var numStr = $("#userNum").val().split(','); //获取隐藏域值

                                    });
                                });


                            },
                            onOpen: function () {
                                // alert("open");
                            }
                        });
                    } else {
                        $('#push_show_pesonal').text(data.message);
                    }
                }
            });
        }
    }