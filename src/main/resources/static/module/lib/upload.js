var uploader = uploader || {};
uploader.service={
    getTicket:function(){
        return this.getUrlParam('tkt');
    },
    getCurrentOrgId:function(){
        return this.getUrlParam('rId');
    },
    uuid: function () {
        return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }));
    },
    indexOfArray: function (arr, val, key) {
        var length = arr.length;
        for (var i = 0; i < length; i++) {
            if (key != undefined && key != null) {
                if (arr[i][key] == val) {
                    return i;
                }
            } else if (arr[i] == val) {
                return i;
            }
        }
        return -1;
    },
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    //判断是否为ios
    getIos:function(){
        var ua=navigator.userAgent.toLowerCase();
        if (ua.match(/iPhone\sOS/i) == "iphone os") {
            return true;
        } else {
            return false;
        }
    },
    dataURLtoBlob:function(dataurl){
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    },
    getFileIcon:function (fileName) {
        var suffix = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
        var icon_class = '';
        switch (suffix) {
            case 'jpg':
            case 'jpeg':
                icon_class = "/module/lib/svg/jpg.svg";
                break;
            case 'png':
                icon_class = "/module/lib/svg/png.svg";
                break;
            case 'bmp':
                icon_class = "/module/lib/svg/bmp.svg";
                break;
            case 'gif':
                icon_class = "/module/lib/svg/gif.svg";
                break;
            case 'pdf':
                icon_class = "/module/lib/svg/pdf.svg";
                break;
            case 'doc':
            case 'docx':
                icon_class = "/module/lib/svg/doc.svg";
                break;
            case 'xls':
            case 'xlsx':
                icon_class = "/module/lib/svg/xls.svg";
                break;
            case 'ppt':
            case 'pptx':
                icon_class = "/module/lib/svg/ppt.svg";
                break;
            case 'rar':
            case 'zip':
            case '7z':
                icon_class = "/module/lib/svg/rar.svg";
                break;
            case 'txt':
                icon_class = "/module/lib/svg/txt.svg";
                break;
            default:
                icon_class = "/module/lib/svg/file.svg";
                break;
        }
        return icon_class;
    },
    touch:function ($preview, callback, clickCallback) {
        var touchStart, touchEnd, touchCancel;
        $preview.on('touchstart', function (e) {
            touchStart = e.timeStamp;
            e.preventDefault();
        });
        $preview.on('touchend', function (e) {
            touchEnd = e.timeStamp;
            var touchTime = touchEnd - touchStart;
            if (touchTime < 500) {
                if (clickCallback) {
                    clickCallback($preview);
                }
            } else {
                if (callback) {
                    callback($preview);
                }
            }
            e.preventDefault();
        });
        $preview.on('touchcancel', function (e) {
            touchCancel = e.timeStamp;
            e.preventDefault();
        });
        $preview.on('mousedown',function(e){
            touchStart = e.timeStamp;
            e.preventDefault();
        });
        $preview.on('mouseup',function(e){
            touchEnd = e.timeStamp;
            var touchTime = touchEnd - touchStart;
            if (touchTime < 500) {
                if (clickCallback) {
                    clickCallback($preview);
                }
            } else {
                if (callback) {
                    callback($preview);
                }
            }
            e.preventDefault();
        });
    },
    cutFileName:function(fileName,length){
        var docIndex = fileName.indexOf('.');
        var type = fileName.substring(docIndex,fileName.length);
        var cut_length = length || 5;
        if(docIndex > cut_length){
            return fileName.substr(0,cut_length)+'...</br>'+type;
        }else{
            return fileName.substr(0,docIndex)+'</br>'+type;
        }
    }
};
uploader.component={
    timer:{},
    previewImageData:{},
    getImageDataArr:function(previewIndex){
        if (this.data != null && this.data !== undefined
            && this.data.imageData != null && this.data.imageData !== undefined) {
            previewIndex = uploader.component.getPreviewIndex(previewIndex);
            this.data.imageData[previewIndex] = this.data.imageData[previewIndex] || [];
            return this.data.imageData[previewIndex];
        }
        return [];
    },
    getFileDataArr:function(previewIndex){
        if (this.data != null && this.data !== undefined
            && this.data.fileData != null && this.data.fileData !== undefined) {
            previewIndex = uploader.component.getPreviewIndex(previewIndex);
            this.data.fileData[previewIndex] = this.data.fileData[previewIndex] || [];
            return this.data.fileData[previewIndex];
        }
        return [];
    },
    getImageData:function(previewIndex){
        if (this.data != null && this.data !== undefined
            && this.data.imageData != null && this.data.imageData !== undefined) {
            previewIndex = uploader.component.getPreviewIndex(previewIndex);
            this.data.imageData[previewIndex] = this.data.imageData[previewIndex] || [];
            return JSON.stringify(this.data.imageData[previewIndex]);
        }
        return '';
    },
    getFileData:function(previewIndex){
        if (this.data != null && this.data !== undefined
            && this.data.fileData != null && this.data.fileData !== undefined) {
            previewIndex = uploader.component.getPreviewIndex(previewIndex);
            this.data.fileData[previewIndex] = this.data.fileData[previewIndex] || [];
            return JSON.stringify(this.data.fileData[previewIndex]);
        }
        return '';
    },
    uploadImage:function(previewIndex,$input,$files){
        "use strict";
        // 允许上传的图片类型
        var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        // 2*1024KB，也就是 2MB
        var maxSize = 2 * 1024 * 1024;
        // 图片最大宽度
        var maxWidth = 100;
        if($input == null || $input === undefined){
            $input = '#uploaderImageInput';
        }
        if($files == null || $files === undefined){
            $files = '#uploaderImageFiles';
        }
        $($input).on('change', function (event) {
            var files = event.target.files;

            // 如果没有选中文件，直接返回
            if (files.length === 0) {
                return;
            }

            for (var i = 0, len = files.length; i < len; i++) {
                var file = files[i];
                var reader = new FileReader();

                // 如果类型不在允许的类型范围内
                if (allowTypes.indexOf(file.type) === -1) {
                    $.alert( '该类型不允许上传');
                    continue;
                }

                if (file.size > maxSize) {
                    $.alert('图片太大，不允许上传');
                    continue;
                }

                reader.readAsDataURL(file);
                reader.onload = function (e) {

                    var img = new Image();
                    img.src = e.target.result;
                    img.onload = function () {

                        // 不要超出最大宽度
                        var w = Math.min(maxWidth, img.width);
                        // 高度按比例计算
                        var h = img.height * (w / img.width);
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');

                        // 设置 canvas 的宽度和高度
                        canvas.width = w;
                        canvas.height = h;
                        ctx.drawImage(img, 0, 0, w, h);
                        var base64 = canvas.toDataURL('image/png');



                        // 插入到预览区
                        var $preview = $('<li class="weui-uploader__file weui-uploader__file_status" style="background-image:url(' + base64 + ')"><div class="weui-uploader__file-content"><!--0%--><img src="/module/lib/png/loading.gif"/></div></li>');
                        $($files).append($preview);


                        // 然后假装在上传，可以post base64格式，也可以构造blob对象上传，也可以用微信JSSDK上传
                        uploader.component.uploadForm($preview,$input,file,file.name,"image",previewIndex);
                    };
                };
            }
        });
    },
    uploadFile:function(previewIndex,$input,$files){
        "use strict";
        // 不允许上传的文件类型
        var unallowTypes = ['exe', 'bat', 'dll', 'msi', 'rar', 'zip', '7z'];
        // 20*1024KB，也就是 20MB
        var maxSize = 20 * 1024 * 1024;

        if($input == null || $input === undefined){
            $input = '#uploaderFileInput';
        }
        if($files == null || $files === undefined){
            $files = '#uploaderFiles';
        }
        $($input).on('change', function (event) {
            var files = event.target.files;

            // 如果没有选中文件，直接返回
            if (files.length === 0) {
                return;
            }

            for (var i = 0, len = files.length; i < len; i++) {
                var file = files[i];

                // 如果类型不在允许的类型范围内
                var type = file.name.substring(file.name.lastIndexOf('.')+1,file.name.length);
                if (unallowTypes.indexOf(type) !== -1) {
                    $.alert( '该类型不允许上传');
                    continue;
                }

                if (file.size > maxSize) {
                    $.alert('文件太大，不允许上传');
                    continue;
                }
                var $preview = $('<li class="weui-uploader__file weui-uploader__file_status" style="background-image:url(' + uploader.service.getFileIcon(file.name) + ')"><div class="weui-uploader__file-content"><!--0%--><img src="/module/lib/png/loading.gif"/></div></li>');
                $($files).append($preview);
                uploader.component.uploadForm($preview,$input,file,file.name,"file",previewIndex);
            }
        });
    },
    uploadForm: function ($preview,$input,file,fileName,type,previewIndex) {
        var id = uploader.service.uuid();
        var actionUrl = '/upload.action?rnd=' + Math.random() + '&uploadId=' + id + '&tkt='+ uploader.service.getTicket() + '&rId=' + uploader.service.getCurrentOrgId();
        var uploadForm = new FormData();
        if(file){
            uploadForm.append("file",file,fileName);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', actionUrl, true);
            xhr.send(uploadForm);
            xhr.onload = function(){
                uploader.component.callback(JSON.parse(this.responseText),$preview,$input,type,previewIndex);
            };
            var percent = 0;
            function updateProgress() {
                //$preview.find('.weui-uploader__file-content').text(++percent+'%');
                $preview.find('.weui-uploader__file-content').html('<img src="/module/lib/png/loading.gif"/>');
                $.ajax({
                    type: "GET",
                    url: '/uploadProgress.action?rnd=' + Math.random() + '&tkt='+ uploader.service.getTicket() + '&rId=' + uploader.service.getCurrentOrgId(),
                    data: {uploadId: id},
                    dataType: "json",
                    success: function (data) {
                        if(data.status == 200){
                            percent = parseFloat(data.object.uploadSize) / parseFloat(data.object.totalSize);
                            percent = Math.round(percent * 100);
                            if(percent < 100){
                                uploader.component.timer[id] = setTimeout(updateProgress,500);
                                //$preview.find('.weui-uploader__file-content').text(++percent + '%');
                                $preview.find('.weui-uploader__file-content').html('<img src="/module/lib/png/loading.gif"/>');
                            }else{
                                // 如果是失败，塞一个失败图标
                                // $preview.find('.weui-uploader__file-content').html('<i class="weui-icon-warn"></i>');
                                if(type == 'image'){
                                    $preview.removeClass('weui-uploader__file_status').find('.weui-uploader__file-content').remove();
                                }
                                if(type == 'file'){
                                    $preview.find('.weui-uploader__file-content').html('<div class="weui-uploader__file-content" style="font-size: 13px;width:70px">'+uploader.service.cutFileName(fileName,10)+'</div>');
                                }
                                clearTimeout(uploader.component.timer[id]);
                            }
                        }else{
                            uploader.component.timer[id] = setTimeout(updateProgress,500);
                        }
                    }
                });
            }
            uploader.component.timer[id] = setTimeout(updateProgress,500);
        }
    },
    callback:function(data,$preview,$input,type,previewIndex){
        if(data.status == 200){
            this.data = this.data || {};
            this.data.imageData = this.data.imageData || {};
            this.data.fileData = this.data.fileData || {};
            var objects = data.object;
            $($input).val('');
            for(var i=0;i<objects.length;i++){
                var url = '/download.action?rnd=' + Math.random() + '&fileName=' + objects[i].savedFileName + '&originalName=' + objects[i].uploadSimpleName + '&tkt='+ uploader.service.getTicket() + '&rId=' + uploader.service.getCurrentOrgId();
                $preview.data('uploadid',objects[i].uploadId);
                $preview.data('filename',objects[i].savedFileName);
                $preview.data('fastname',objects[i].imageFastName);
                $preview.data('url',url);
                previewIndex = uploader.component.getPreviewIndex(previewIndex);
                if(type == 'image'){
                    this.data.imageData[previewIndex] = this.data.imageData[previewIndex] || [];
                    this.data.imageData[previewIndex].push(objects[i]);
                    uploader.component.previewImageData[previewIndex] = uploader.component.previewImageData[''+previewIndex] || [];
                    uploader.component.previewImageData[previewIndex].push({uploadId:objects[i].uploadId,url:url});
                    uploader.service.touch(
                        $preview,
                        function ($data) {
                            $.confirm('您要删除这张照片吗?', function () {
                                uploader.component.deleteFile($data,previewIndex,type);
                            });
                        },
                        function ($data) {
                            uploader.component.previewImages($data,previewIndex);
                        }
                    );
                }
                if(type == 'file'){
                    this.data.fileData[previewIndex] = this.data.fileData[previewIndex] || [];
                    this.data.fileData[previewIndex].push(objects[i]);
                    /*$('#uploaderFileInput').val('');*/
                    uploader.service.touch(
                        $preview,
                        function ($data) {
                            $.confirm('您要删除这个文件吗?', function () {
                                uploader.component.deleteFile($data,previewIndex,type);
                            });
                        },
                        function ($data) {
                            uploader.component.downloadCheck($data);
                        }
                    );
                }
            }
        }
    },
    deleteFile: function ($preview,previewIndex,type) {
        var self = this;
        var data = {fileName: $preview.data('filename')};
        if($preview.data('fastname') != null && $preview.data('fastname') !== undefined){
            data.imageFastName = $preview.data('fastname');
        }
        $.post('/deleteFile.action?rnd=' + Math.random() + '&tkt='+ uploader.service.getTicket() + '&rId=' + uploader.service.getCurrentOrgId(),
            data,
            function (result) {
                if (200 == result.status) {
                    var uploadId = $preview.data('uploadid');
                    if(type == 'image'){
                        var urls = uploader.component.getPreviewImageDataByPreviewIndex(previewIndex);
                        if(urls.length >0){
                            for(var i=0;i<urls.length;i++){
                                if(uploadId != null && uploadId !== undefined && ''+urls[i].uploadId == ''+uploadId){
                                    urls.splice(i,1);
                                    uploader.component.previewImageData[previewIndex] = urls;
                                    break;
                                }
                            }
                        }
                        self.data.imageData[previewIndex] = uploader.component.deleteFileData(uploadId,self.data.imageData[previewIndex]);
                    }
                    if(type == 'file'){
                        self.data.fileData[previewIndex] = uploader.component.deleteFileData(uploadId,self.data.fileData[previewIndex]);
                    }
                    $preview.remove();
                    $.alert(result.message);
                } else {
                    $.alert(result.message);
                }
            });
    },
    deleteFileData:function(uploadId,array){
        if(uploadId != null && uploadId !== undefined && array.length > 0){
            for(var i=0;i<array.length;i++){
                if( ''+array[i].uploadId == ''+uploadId){
                    array.splice(i,1);
                    break;
                }
            }
        }
        return array;
    },
    getPreviewImageDataByPreviewIndex:function(previewIndex){
        return uploader.component.previewImageData[uploader.component.getPreviewIndex(previewIndex)];
    },
    getPreviewIndex:function(previewIndex){
        if(previewIndex != null && previewIndex !== undefined){
            return ''+previewIndex;
        }else{
            return 'default';
        }
    },
    previewImages:function($preview,previewIndex){
        var urls = uploader.component.getPreviewImageDataByPreviewIndex(previewIndex);
        if(urls.length >0){
            var items = [];
            var initIndex = 0;
            var uploadId = $preview.data('uploadid');
            for(var i=0;i<urls.length;i++){
                if(uploadId != null && uploadId !== undefined && ''+urls[i].uploadId == ''+uploadId){
                    initIndex = parseInt(i);
                }
                items.push(urls[i].url);
            }
            var pb = $.photoBrowser({
                items: items,
                initIndex:initIndex
            });
            pb.open();
        }else{
            //暂无照片
        }
    },
    downloadCheck: function ($parentElement) {
        var self = $parentElement;
        var userAgent = navigator.userAgent;
        var isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var ua = userAgent.toLowerCase();
        var isSafari = (
        ua.indexOf("safari") > -1
        && ua.indexOf("chrome") == -1
        && ua.indexOf("ucbrowser") == -1
        && ua.indexOf("mqqbrowser") == -1
        && ua.indexOf("ucweb") == -1
        && ua.indexOf("opera") == -1
        );
        var isWX = ua.match(/MicroMessenger/i) == 'micromessenger';
        var cssText = "#weixin-tip{position: fixed; left:0; top:0; background: rgba(0,0,0,0.8); filter:alpha(opacity=80);width: 100%;  height:100%; z-index: 100;} #weixin-tip p{text-align: center; margin-top: 10%; padding:0 5%;}";

        function loadHtml() {
            var div = document.createElement('div');
            div.id = 'weixin-tip';
            div.innerHTML = '<p><img style="max-width: 100%;max-height: 100%;" src="/module/lib/png/browser_tip.png" alt="其他浏览器打开"/></p>';
            document.body.appendChild(div);
        }

        function loadStyleText(cssText) {
            var style = document.createElement('style');
            style.rel = 'stylesheet';
            style.type = 'text/css';
            try {
                style.appendChild(document.createTextNode(cssText));
            } catch (e) {
                style.styleSheet.cssText = cssText; //ie9以下
            }
            var head = document.getElementsByTagName("head")[0]; //head标签之间加上style样式
            head.appendChild(style);
        }

        if (isiOS && (isSafari || isWX)) {
            if (isWX) {
                loadHtml();
                loadStyleText(cssText);
                $('#weixin-tip').click(function () {
                    $(this).remove();
                });
            } else {
                $.alert('选择使用微信和safari浏览器以外的浏览器打开页面，再点击文件进行下载!');
            }
        } else {
            location.href = $(self).data('url');
        }
    },

    initViewImage:function(json,previewIndex,$files){
        if(json != '[]' && json != ''){
            previewIndex = uploader.component.getPreviewIndex(previewIndex);
            if($files == null || $files === undefined){
                $files = '#uploaderImageFiles';
            }
            this.initImageData(json,previewIndex);
            var attachData = this.data.imageData[previewIndex];
            uploader.component.previewImageData[previewIndex] = uploader.component.previewImageData[''+previewIndex] || [];
            if(attachData.length > 0){
                for(var i=0;i<attachData.length;i++){
                    attachData[i].savedFileName = encodeURI(attachData[i].savedFileName);
                    attachData[i].imageFastName = encodeURI(attachData[i].imageFastName);
                    var url = '/download.action?rnd=' + Math.random() +
                        '&fileName=' + attachData[i].savedFileName +
                        '&originalName=' + attachData[i].uploadSimpleName + '&tkt='+ uploader.service.getTicket() + '&rId=' + uploader.service.getCurrentOrgId();
                    var url_fast = '/download.action?rnd=' + Math.random() +
                        '&fileName=' + attachData[i].imageFastName +
                        '&originalName=' + attachData[i].uploadSimpleName + '&tkt='+ uploader.service.getTicket() + '&rId=' + uploader.service.getCurrentOrgId();
                    uploader.component.previewImageData[previewIndex].push({uploadId:attachData[i].uploadId,url:url});
                    var $preview = $('<li class="weui-uploader__file" style="background-image:url(' + url_fast + ')"></li>');
                    $preview.data('uploadid',attachData[i].uploadId);
                    $preview.data('filename',attachData[i].savedFileName);
                    $preview.data('fastname',attachData[i].imageFastName);
                    $preview.data('url',url);
                    uploader.service.touch(
                        $preview,
                        function ($data) {},
                        function ($data) {
                            uploader.component.previewImages($data,previewIndex);
                        }
                    );
                    $($files).append($preview);
                }
            }
        }

    },
    initViewFile:function(json,previewIndex,$files){
        if(json != '[]' && json != ''){
            previewIndex = uploader.component.getPreviewIndex(previewIndex);
            if($files == null || $files === undefined){
                $files = '#uploaderFiles';
            }
            this.initFileData(json,previewIndex);
            var attachData = this.data.fileData[previewIndex];
            if(attachData.length > 0){
                for(var i=0;i<attachData.length;i++){
                    attachData[i].savedFileName = encodeURI(attachData[i].savedFileName);
                    var url = '/download.action?rnd=' + Math.random() +
                        '&fileName=' + attachData[i].savedFileName +
                        '&originalName=' + attachData[i].uploadSimpleName + '&tkt='+ uploader.service.getTicket() + '&rId=' + uploader.service.getCurrentOrgId();
                    var $preview = $('<li class="weui-uploader__file weui-uploader__file_status" style="background-image:url(' + uploader.service.getFileIcon(attachData[i].savedFileName) + ')"><div class="weui-uploader__file-content" style="font-size: 13px;">'+uploader.service.cutFileName(attachData[i].uploadSimpleName)+'</div></li></li>');
                    $preview.data('uploadid',attachData[i].uploadId);
                    $preview.data('filename',attachData[i].savedFileName);
                    $preview.data('url',url);
                    uploader.service.touch(
                        $preview,
                        function ($data) {},
                        function ($data) {
                            uploader.component.downloadCheck($data);
                        }
                    );
                    $($files).append($preview);
                }
            }
        }
    },
    initImageData:function(json,previewIndex){
        this.data = this.data || {};
        this.data.imageData = this.data.imageData || {};
        json = json.replace(/\\/g, '\\\\');
        this.data.imageData[previewIndex] = eval('('+json+')') || [];
    },
    initFileData:function(json,previewIndex){
        this.data = this.data || {};
        this.data.fileData = this.data.fileData || {};
        json = json.replace(/\\/g, '\\\\');
        this.data.fileData[previewIndex] = eval('('+json+')') || [];
    }

};