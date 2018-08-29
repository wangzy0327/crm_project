(function () {
    var $ = jQuery,
        ratio = window.devicePixelRatio || 1,
        // 缩略图大小
        thumbnailWidth = 100 * ratio,
        thumbnailHeight = 100 * ratio,
        $upimgmax = 1, // 支持上传最大个数
        uploader = WebUploader.create({

            // swf文件路径
            swf: 'js/plugins/webuploader/Uploader.swf',

            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            fileNumLimit: 1,
            fileSizeLimit: 1 * 1024 * 1024,    // 200 M
            fileSingleSizeLimit: 1 * 1024 * 1024,    // 50 M
            // 文件接收服务端。
            server: '/upload/save/img', // 因为是demo，就拿着uploadify的php来用一下

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker',

            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false,
            auto: true,
            headers: {'userName': 'emi', 'token': '123456'}
        });
    // 当有文件被添加进队列的时候，添加到页面预览
    uploader.on( 'fileQueued', function( file ) {
        var $li = $('<div id="' + file.id + '" class="file-item thumbnail">' +
            '<img>' +
            // '<div class="info">' + file.name + '</div>' +
            '<div class = "file-panel" style = "height: 30px;text-align: center;" >  ' +
            '<a class = "cancel delimgbtns" style="display:block;text-align: center;">删除</a>' +
            '<span class="info" style="text-align: center;">' + file.name + '</span></div>' +
            '</div>'+
            '</div>'),
            $img = $li.find('img');
        $('#thelist').append($li);
        removefiles(file); // 文件删除
        // 创建缩略图
        uploader.makeThumb(file, function(error, src) {
            if (error) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            $img.attr('src', src);
        }, thumbnailWidth, thumbnailHeight);

        var uploadfilesNum = uploader.getStats().queueNum; //  共选中几个图片
        // 最多支持 5张
        if ($('.file-item').length >= $upimgmax) {
            $('#picker').hide();
            if ($('.file-item').length >= ($upimgmax + 1)) {
                // 中断 取消 大于  5张图片的对象
                uploader.removeFile(file, true);
                $('.file-item').last().remove();
            }
        } else {
            $('#picker').show(); // 上传按钮显示
        }
    });


    uploader.on( 'uploadSuccess', function(file,response ) {
        console.log(file);
        console.log(file.id);
        var id = file.id;
        console.log(file.fileName);
        console.log(response);
        var data = response.data;
        console.log("data:"+data);
        var targetFileName = data["targetFileName"];
        var url = data["url"];
        $('#'+id).attr('data-url',url);
        $('#'+id).attr('data-id',targetFileName);
        console.log("targetFileName:"+targetFileName);
        console.log("url:"+url);
    });


    // 删除按钮事件
    function removefiles(file) {
        // 删除本条数据
        // $('.delimgbtns').each(function(index, el) {
        $('.delimgbtns').click(function() {
            // 中断 取消 传图
            uploader.removeFile(file, true);
            var spthisdiv = $(this).parent();
            spthisdiv.parent('.file-item').remove();
            $('#picker').show(); // 上传按钮显示
        });
        // });
    }

// 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo( $li ).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css( 'width', percentage * 100 + '%' );
    });
    uploader.on( 'uploadSuccess', function( file ) {
        $( '#'+file.id ).find('p.state').text('已上传');
    });

    uploader.on( 'uploadError', function( file ) {
        $( '#'+file.id ).find('p.state').text('上传出错');
    });

    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').fadeOut();
    });
})();