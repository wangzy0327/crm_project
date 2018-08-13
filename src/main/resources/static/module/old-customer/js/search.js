var module={};
module.data={
    m:1010000
};

$(function(){
    module.service.initControls();
    module.eventHandler.handleEvents();
});

module.service={
    initControls:function () {
        this.initList();
    },
    initList:function() {
        $(document).on('change', '#searchInput', function () {
            console.log($('#searchInput').val());
            var filter = [
                {field: 'name', value: $('#searchInput').val(), operator: 'like', relation: ''}
            ];
            var info = {
                data: {
                },
                filter: filter
            };
            var data = {
                m: module.data.m,
                t: 'staffs',
                v: JSON.stringify([info])
            };
            var each=[];
            YT.query({
                data: data,
                successCallback: function (data) {
                    if (200 == data.status) {
                        var each=[];
                        var str = '';
                        str+='<div class="weui-picker-modal weui-select-modal weui-picker-modal-visible">';
                        str+='<div class="toolbar">';
                        str+='<div class="toolbar-inner"><a href="javascript:;" class="picker-button close-select">确定</a></div></div>';

                        for (var i in data.object) {
                            console.log(data.object[i].name);
                            each.push({
                                title:data.object[i].name,
                                value:data.object[i].id,
                            });
                            str+='<div class="weui-cells weui-cells_checkbox"><label class="weui-cell weui-check_label" for="weui-select-id-'+data.object[i].id+'">' +
                                '<div class="weui-cell__bd weui-cell_primary"><p>'+data.object[i].name+'</p></div>' +
                                '<div class="weui-cell__ft"><input type="checkbox" class="weui-check" name="weui-select" ' +
                                'id="weui-select-id-'+data.object[i].name+'" value="'+data.object[i].id+'" data-title="'+data.object[i].name+'"><span class="weui-icon-checked"></span></div></label></div>'
                            // each.push({
                            //     title: data.object[i].name,
                            //     value: data.object[i].id,
                            // });
                        }
                        str+='</div>';
                        if (each == null || each == '')
                            alert('暂无销售人员！');
                        $('#msg').html(str);
                        $("#person").select({
                            title: "选择推荐人",
                            items:each,
                        });
                        // console.log($("#searchInput").attr('data-values'));
                    } else {
                        alert('暂无销售人员!');
                    }
                }
            });
        });
    }
};
module.eventHandler={
    handleEvents:function(){
        this.add();
        this.edit();
    },
    add:function () {

    },
    edit:function () {

    }
};