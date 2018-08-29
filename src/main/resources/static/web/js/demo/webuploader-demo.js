jQuery(function() {
    var $ = jQuery,    // just in case. Make sure it's not an other libaray.

        $wrap = $('#uploader'),

        // 图片容器
        $queue = $('<ul class="filelist"></ul>')
            .appendTo( $wrap.find('.queueList') ),

        // 状态栏，包括进度和控制按钮
        $statusBar = $wrap.find('.statusBar'),

        // 文件总体选择信息。
        $info = $statusBar.find('.info'),

        // 上传按钮
        $upload = $wrap.find('.uploadBtn'),

        // 没选择文件之前的内容。
        $placeHolder = $wrap.find('.placeholder'),

        // 总体进度条
        $progress = $statusBar.find('.progress').hide(),

        // 添加的文件数量
        fileCount = 0,

        // 添加的文件总大小
        fileSize = 0,

        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

        // 缩略图大小
        thumbnailWidth = 80 * ratio,
        thumbnailHeight = 80 * ratio,

        // 可能有pedding, ready, uploading, confirm, done.
        state = 'pedding',

        // 所有文件的进度信息，key为file id
        percentages = {},

        supportTransition = (function(){
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
            s = null;
            return r;
        })(),

        // WebUploader实例
        uploader;

    if ( !WebUploader.Uploader.support() ) {
        alert( 'Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
        throw new Error( 'WebUploader does not support the browser you are using.' );
    }

    // 实例化
    uploader = WebUploader.create({
        // auto:true, //是否自动上传
        pick: {
            id: '#filePicker',
            label: '点击选择图片'
        },
        dnd: '#uploader .queueList',
        paste: document.body,

        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },

        // swf文件路径
        swf: BASE_URL + '/Uploader.swf',

        disableGlobalDnd: true,

        chunked: true,
        // server: 'http://webuploader.duapp.com/server/fileupload.php',
        server: '/upload/save/img',
        fileNumLimit: 1,
        fileSizeLimit: 1 * 1024 * 1024,    // 200 M
        fileSingleSizeLimit: 1 * 1024 * 1024    // 50 M
    });

    // 添加“添加文件”的按钮，
    // uploader.addButton({
    //     id: '#filePicker2',
    //     label: '继续添加'
    // });

    // 当有文件添加进来时执行，负责view的创建
    function addFile( file ) {
        var $li = $( '<li id="' + file.id + '">' +
            '<p class="title" style="margin:0 auto;">' + file.name + '</p>' +
            '<p class="imgWrap" style="margin:30px auto 10px; text-align:center;'+
            ' vertical-align:middle;"></p>'+
            '<p class="progress"><span></span></p>' +
            '</li>' ),

            $btns = $('<div class="file-panel">' +
                '<span class="cancel">删除</span>' +
                '<span class="rotateRight">向右旋转</span>' +
                '<span class="rotateLeft">向左旋转</span></div>').appendTo( $li ),
            $prgress = $li.find('p.progress span'),
            $wrap = $li.find( 'p.imgWrap' ),
            $info = $('<p class="error"></p>'),

            showError = function( code ) {
                switch( code ) {
                    case 'exceed_size':
                        text = '文件大小超出';
                        break;

                    case 'interrupt':
                        text = '上传暂停';
                        break;

                    default:
                        text = '上传失败，请重试';
                        break;
                }

                $info.text( text ).appendTo( $li );
            };

        if ( file.getStatus() === 'invalid' ) {
            showError( file.statusText );
        } else {
            // @todo lazyload
            $wrap.text( '预览中' );
            uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    $wrap.text( '不能预览' );
                    return;
                }

                var img = $('<img src="'+src+'">');
                $wrap.empty().append( img );
            }, thumbnailWidth, thumbnailHeight );

            percentages[ file.id ] = [ file.size, 0 ];
            file.rotation = 0;
        }

        file.on('statuschange', function( cur, prev ) {
            if ( prev === 'progress' ) {
                $prgress.hide().width(0);
            } else if ( prev === 'queued' ) {
                $li.off( 'mouseenter mouseleave' );
                $btns.remove();
            }

            // 成功
            if ( cur === 'error' || cur === 'invalid' ) {
                console.log( file.statusText );
                showError( file.statusText );
                percentages[ file.id ][ 1 ] = 1;
            } else if ( cur === 'interrupt' ) {
                showError( 'interrupt' );
            } else if ( cur === 'queued' ) {
                percentages[ file.id ][ 1 ] = 0;
            } else if ( cur === 'progress' ) {
                $info.remove();
                $prgress.css('display', 'block');
            } else if ( cur === 'complete' ) {
                $li.append( '<span class="success"></span>' );
            }

            $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
        });

        $li.on( 'mouseenter', function() {
            $btns.stop().animate({height: 30});
        });

        $li.on( 'mouseleave', function() {
            $btns.stop().animate({height: 0});
        });

        $btns.on( 'click', 'span', function() {
            var index = $(this).index(),
                deg;

            switch ( index ) {
                case 0:
                    uploader.removeFile( file );
                    return;

                case 1:
                    file.rotation += 90;
                    break;

                case 2:
                    file.rotation -= 90;
                    break;
            }

            if ( supportTransition ) {
                deg = 'rotate(' + file.rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else {
                $wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
            }


        });

        $li.appendTo( $queue );
    }

    // 负责view的销毁
    function removeFile( file ) {
        var $li = $('#'+file.id);

        delete percentages[ file.id ];
        updateTotalProgress();
        $li.off().find('.file-panel').off().end().remove();
    }

    function updateTotalProgress() {
        var loaded = 0,
            total = 0,
            spans = $progress.children(),
            percent;

        $.each( percentages, function( k, v ) {
            total += v[ 0 ];
            loaded += v[ 0 ] * v[ 1 ];
        } );

        percent = total ? loaded / total : 0;

        spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
        spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
        updateStatus();
    }

    function updateStatus() {
        var text = '', stats;

        if ( state === 'ready' ) {
            text = '选中' + fileCount + '张图片，共' +
                WebUploader.formatSize( fileSize ) + '。';
        } else if ( state === 'confirm' ) {
            stats = uploader.getStats();
            if ( stats.uploadFailNum ) {
                text = '已成功上传' + stats.successNum+ '张照片至XX相册，'+
                    stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
            }

        } else {
            stats = uploader.getStats();
            text = '共' + fileCount + '张（' +
                WebUploader.formatSize( fileSize )  +
                '），已上传' + stats.successNum + '张';

            if ( stats.uploadFailNum ) {
                text += '，失败' + stats.uploadFailNum + '张';
            }
        }

        $info.html( text );
    }

    function setState( val ) {
        var file, stats;

        if ( val === state ) {
            return;
        }

        $upload.removeClass( 'state-' + state );
        $upload.addClass( 'state-' + val );
        state = val;

        switch ( state ) {
            case 'pedding':
                $placeHolder.removeClass( 'element-invisible' );
                $queue.parent().removeClass('filled');
                $queue.hide();
                $statusBar.addClass( 'element-invisible' );
                uploader.refresh();
                break;

            case 'ready':
                $placeHolder.addClass( 'element-invisible' );
                $( '#filePicker2' ).removeClass( 'element-invisible');
                $queue.parent().addClass('filled');
                $queue.show();
                $statusBar.removeClass('element-invisible');
                uploader.refresh();
                break;

            case 'uploading':
                $( '#filePicker2' ).addClass( 'element-invisible' );
                $progress.show();
                $upload.text( '暂停上传' );
                break;

            case 'paused':
                $progress.show();
                $upload.text( '继续上传' );
                break;

            case 'confirm':
                $progress.hide();
                $upload.text( '开始上传' ).addClass( 'disabled' );

                stats = uploader.getStats();
                if ( stats.successNum && !stats.uploadFailNum ) {
                    setState( 'finish' );
                    return;
                }
                break;
            case 'finish':
                stats = uploader.getStats();
                if ( stats.successNum ) {
                    // alert( '上传成功' );
                } else {
                    // 没有成功的图片，重设
                    state = 'done';
                    location.reload();
                }
                break;
        }

        updateStatus();
    }

//     uploader.on('ready', function() {
//         window.uploader = uploader;
// //            alert(WebUploader.Base.version);
// //            alert(WebUploader.File.name);
//         if(fileid){
//             //获取数据
//             $.post(getRootPath()+'/files/tsysFilesAction!findTSysFilesByParam.action',{param:" and fileid='"+fileid+"' "},function(json){
//                 var jsonLen=json.rows.length;
//                 if(jsonLen!=0){
//                     fileCount=jsonLen;
//                     $placeHolder.addClass( 'element-invisible' );
//                     $statusBar.show();
//                     //显示在页面上
//                     $.each(json.rows,function(i,n){
//                         fileSize += n.filelen;
//                         var obj={},statusMap={}
//                             ,file_id='WU_FILE_' + i;
//                         obj.id=file_id ;
//                         obj.name=n.filebasename;
//                         obj.filename=n.filename;
//                         obj.getStatus=function() {
//                             return '';
//                         };
//                         obj.statusText='';
//                         obj.size=n.filelen;
//                         obj.version=WebUploader.Base.version;
//                         obj.type=n.mimeType;
//                         obj.filetype=n.filetype;
//                         obj.source=this;
//                         obj.setStatus=function( status, text ) {
//
//                             var prevStatus = statusMap[ this.id ];
//
//                             typeof text !== 'undefined' && (this.statusText = text);
//
//                             if ( status !== prevStatus ) {
//                                 statusMap[ this.id ] = status;
//                                 /**
//                                  * 文件状态变化
//                                  * @event statuschange
//                                  */
//                                 uploader.trigger( 'statuschange', status, prevStatus );
//                             }
//
//                         };
//                         editFile(obj);
//                         $("#"+file_id).append(inputStr(i, n));
//                     });
//
//                     WebUploader.Base.idSuffix=jsonLen;
//
//                     setState( 'ready' );
//                     updateTotalProgress();
//                 }
//             },'json');
//         }
//     });

    uploader.onUploadProgress = function( file, percentage ) {
        var $li = $('#'+file.id),
            $percent = $li.find('.progress span');

        $percent.css( 'width', percentage * 100 + '%' );
        percentages[ file.id ][ 1 ] = percentage;
        updateTotalProgress();
    };

    uploader.onFileQueued = function( file ) {
        fileCount++;
        fileSize += file.size;

        if ( fileCount === 1 ) {
            $placeHolder.addClass( 'element-invisible' );
            $statusBar.show();
        }

        addFile( file );
        setState( 'ready' );
        updateTotalProgress();
    };

    uploader.onFileDequeued = function( file ) {
        fileCount--;
        fileSize -= file.size;

        if ( !fileCount ) {
            setState( 'pedding' );
        }

        removeFile( file );
        updateTotalProgress();

    };

    uploader.on( 'all', function( type ) {
        var stats;
        switch( type ) {
            case 'uploadFinished':
                setState( 'confirm' );
                break;

            case 'startUpload':
                setState( 'uploading' );
                break;

            case 'stopUpload':
                setState( 'paused' );
                break;

        }
    });

    uploader.on( 'uploadSuccess', function(file,response ) {
        console.log(file);
        console.log(response);
        var data = response.data;
        console.log("data:"+data);
        var targetFileName = data["targetFileName"];
        var url = data["url"];
        $('.imgWrap').attr('data-url',url);
        $('.imgWrap').attr('data-id',targetFileName);
        // $('.state-complete').each(function () {
        //     // $btns = $('<div class="file-panel">' +
        //     //     '<span class="cancel">删除</span>' +
        //     //     '<span class="rotateRight">向右旋转</span>' +
        //     //     '<span class="rotateLeft">向左旋转</span></div>').appendTo(this);
        //     $btn = $("<p>" +
        //         "<a class='removeUpload' style='margin: 0 5px 0 5px'>删除</a></p>").appendTo(this);
        //     console.log("this li"+this);
        //     $(this).attr("data-id",url);
        // });
        // $('#WU_FILE_0').append("<p><a href='#' class='removeUpload' style='margin: 0 5px 0 5px' >删除</a></p>");
        console.log("targetFileName:"+targetFileName);
        console.log("url:"+url);
    });

    $(document).delegate(".removeUpload", "click", function () {
        var id = $(this).parent('p').parent('li').attr('data-id');
        console.log('image id:'+id);
        $(this).parent('p').parent('li').remove();
    })

    uploader.onError = function( code ) {
        alert( 'Eroor: ' + code );
    };
    uploader.on('fileQueued', function(file) {
        $('#queueList').append('<div id="' + file.id + '" class="webuploader-item">' +
            '<h4 class="info" style="display: inline-block;">' + file.name + '</h4>' +
            '<p class="state" style="display: inline-block;margin-left: 20px;">等待上传...</p>' +
            '<p class="remove-this" style="display: inline-block;margin-left: 20px;">删除</p>' +
            '</div>');


        var $li = $(
            '<div id="' + file.id + '" class="file-item thumbnail">' +
            '<img>' +
            // '<div class="info">' + file.name + '</div>' +
            '<div class = "file-panel" style = "height: 30px;" > 删除 ' +
            '<span class="cancel">删除</span></div>' +
            '</div>'
            ),
        $img = $li.find('img');
        $('#queueList').append($li);
        removefiles(file); // 文件删除
    });

    // 删除按钮事件
    function removefiles(file) {
        // 删除本条数据
        // $('.delimgbtns').each(function(index, el) {
        $('.cancel').click(function() {
            // 中断 取消 传图
            uploader.removeFile(file, true);
            var spthisdiv = $(this).parent();
            spthisdiv.parent('.file-item').remove();
            $filePicker.show(); // 上传按钮显示
        });
        // });
    }

    $upload.on('click', function() {
        if ( $(this).hasClass( 'disabled' ) ) {
            return false;
        }

        if ( state === 'ready' ) {
            uploader.upload();
        } else if ( state === 'paused' ) {
            uploader.upload();
        } else if ( state === 'uploading' ) {
            uploader.stop();
        }
    });

    $info.on( 'click', '.retry', function() {
        uploader.retry();
    } );

    $info.on( 'click', '.ignore', function() {
        alert("todo");
    } );

    $upload.addClass( 'state-' + state );
    updateTotalProgress();
});