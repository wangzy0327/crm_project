var module = {};

module.data = {};

module.service = {
    initControls: function () {

    }
};

module.eventHandler = {
    handleEvents: function () {
        $("#picker").picker({
            title: "请选择您的手机",
            cols: [
                {
                    textAlign: 'center',
                    values: ['赵 杰伦杰伦杰伦杰伦杰伦杰伦杰伦', '钱', '孙', '李', '周', '吴', '郑', '王']
                    //如果你希望显示文案和实际值不同，可以在这里加一个displayValues: [.....]
                },
                {
                    textAlign: 'center',
                    values: ['杰伦杰伦杰伦杰伦', '磊', '明', '小鹏', '燕姿', '菲菲', 'Baby']
                },
            ]
        });
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});