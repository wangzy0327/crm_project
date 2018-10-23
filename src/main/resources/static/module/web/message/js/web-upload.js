var uploaderTool = uploaderTool || {};

uploaderTool = {

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

    uuid: function () {
        return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }));
    },

    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },

    /**
     *
     * @param src url的字符串
     * @param name
     * @returns {null}
     */
    getSrcString: function (src, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = src.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    }
};


uploaderTool.upload = {

    upload: function (element) {
        if (element == undefined || element == '') {
            element = 'fileList';
        }
        if(element == 'fileList_cover'){
            if (this.data != null && this.data !== undefined && this.data[''+element] != null && this.data[''+element] !== undefined && this.data[''+element].length >=1) {
                $.alert('消息封面只允许上传1张</br>请先删除原封面再上传！');
                return ;
            }
        }
        uploaderTool.upload.element = element;
        var uploadId = this.createUploadForm(element);
        $('#upload' + uploadId).trigger('click');
        return uploadId;
    },

    // 返回上传数据
    getDataJsonStr: function (element) {
        if (this.data != null && this.data !== undefined && this.data[''+element] != null && this.data[''+element] !== undefined) {
            return JSON.stringify(this.data[''+element]);
        }
        return '[]';
    },
    getData:function(element){
        if (this.data != null && this.data !== undefined && this.data[''+element] != null && this.data[''+element] !== undefined) {
            return this.data[''+element];
        }
        return '';
    },

    deleteFile: function (fileName, element) {
        var self = this;
        $.confirm('您确定要删除？',function(){
            var imageFastName = $(element).data('fastname');
            var ele = $(element).data('ele');
            var postData = {
                tkt: YT.getTicket(),
                fileName: fileName
            };
            if(imageFastName != null && imageFastName !== undefined){
                postData.imageFastName = imageFastName;
            }
            $.post('/deleteFile.action?rnd=' + Math.random(), postData, function (result) {
                if (200 == result.status) {

                    var parent = $(element).parents('.fileItem');
                    var uploadId = parent.attr('id');
                    parent.remove();
                    // 删除数据
                    uploadId = uploadId.replace('fileItem', '');
                    var index = uploaderTool.indexOfArray(self.data[''+ele], uploadId, 'uploadId');
                    if (index != -1)
                        self.data[''+ele].splice(index,1);

                    $.alert(result.message);

                } else {
                    $.alert(result.message);
                }
            });
        });
    },

    uploadFile: function upload(uploadId, element) {

        var form = $('#form' + uploadId);
        var fileName = $('#upload' + uploadId).val();
        this.timer = this.timer || {};
        if (fileName != '' && fileName != undefined) {
            //上传提交
            form.submit();

            //插入提示信息
            var fileItem = '<div id="fileItem' + uploadId + '">' + fileName + '&nbsp;&nbsp;上传中...</div>';
            var fileList = $('#' + element);
            fileList.append(fileItem);

            //更新进度
            this.updateProgress(uploadId, fileName);
        }
    },

    createUploadForm: function (element) {

        //得到上传id
        var id = uploaderTool.uuid();
        var actionUrl = '/upload.action?rnd=' + Math.random() + '&tkt=' + YT.getTicket() + '&callback=uploaderTool.upload.callback' + '&uploadId=' + id;
        var uploadForm = '<form data-ele="'+element+'" id="form' + id + '" method="post" action="' + actionUrl + '" target="frame' + id + '" enctype="multipart/form-data">';
        uploadForm += '<input style="position: absolute; top:-1000px; left:-1000px;" id="upload' + id + '" type="file" accept="image/jpeg,image/jpg,image/png" name="upload' + id +
            '" onchange="uploaderTool.upload.uploadFile(\'' + id + '\',\'' + element + '\');"/>';
        uploadForm += '</form>';
        var uploadFrame = '<iframe style="display:none" name="frame' + id + '" id="frame' + id + '"></iframe>';
        var body = $('body');
        body.append(uploadForm);
        body.append(uploadFrame);
        return id;

    },

    // 为server端准备的回调函数
    callback: function (message) {
        var data = JSON.parse(message);
        var uploadId = data.object[0].uploadId;
        data.object[0].element = $('#form' + uploadId).data('ele');
        $('#form' + uploadId).remove();
        $('#frame' + uploadId).remove();
        clearInterval(this.timer[uploadId]);

        $('#'+data.object[0].element).find('.no-file').remove();
        var fileItemHtml = this.createFileItemHtml({data: data.object[0]});

        this.setFileItem($('#fileItem' + uploadId), fileItemHtml);

        $('#' + uploaderTool.upload.element).trigger('uploaded');
    },

    createFileItemHtml: function (params) {
        var obj = $.extend({
            data: [],           // 附件数据
            isDel: true,        // 是否需要删除惭怍
            isValidate: true    // 是否验证
        }, params);
        var self = this;
        var attach = obj.data;
        var element = attach.element;
        delete attach.element;
        var savedFileName = attach.savedFileName;
        var uploadSimpleName = attach.uploadSimpleName;
        var fileSize = attach.fileSize;
        var imageFastName = attach.imageFastName;
        var tkt = YT.getTicket();
        var uploadSimpleNameLength = uploadSimpleName.length;
        var url = '/download.action?rnd=' + Math.random() + '&tkt=' + tkt + '&fileName=' + savedFileName + '&originalName=' + uploadSimpleName;
        var suffix = uploadSimpleName.substring(uploadSimpleName.lastIndexOf('.') + 1, uploadSimpleNameLength).toLowerCase();
        var displayName = uploadSimpleName.length > 15 ? uploadSimpleName.substring(0, 5) + '...' + uploadSimpleName.substring(uploadSimpleNameLength - suffix.length - 4, uploadSimpleNameLength) : uploadSimpleName;
        savedFileName = savedFileName.replace('\\', '\\\\');
        imageFastName = imageFastName.replace('\\', '\\\\');



        var fileItemHtml = '<ul>';
        if (obj.isValidate) {
            if (!this.checkSuffix(uploadSimpleName)) {
                fileItemHtml += '<li><span class="error" style="color: darkred;border: 0;">只允许上传JPG/JPEG/PNG图片!</span></li>';
            }else{
                fileItemHtml += '<li style="cursor: pointer"><img style="width: 150px;height: 100px;border: 1px solid #ddd" src="' + url + '"></li>';
                fileItemHtml += '<li>' + displayName + '</li>';
                fileItemHtml += '<li><a href="' + url + '">下载(' + fileSize + ')</a>';
                if (obj.isDel) {
                    fileItemHtml += '&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" class="del" data-ele="'+element+'" ';
                    if(imageFastName != null && imageFastName !== undefined){
                        fileItemHtml += ' data-fastname="'+imageFastName+'" ';
                    }
                    fileItemHtml += ' onclick="uploaderTool.upload.deleteFile(\'' + savedFileName + '\', this);">删除</a>';
                }
                fileItemHtml += '</li>';

                self.data = self.data || {};
                self.data[''+element] = self.data[''+element] || [];
                self.data[''+element].push(attach);
            }
        }

        fileItemHtml += '</ul>';

        return fileItemHtml;
    },

    setFileItem: function (ele, fileItemHtml) {
        ele.html(fileItemHtml).css({
            'height': '18px',
            'line-height': '18px',
            'display': 'inline-block',
            'margin': '15px 8px 0 0'
        }).addClass('fileItem');
    },

    checkSuffix: function (fileName) {
        var suffix = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
        if (suffix == 'jpg' || suffix == 'jpeg' || suffix == 'png') {
            return true;
        } else {
            return false;
        }
    },

    checkSize: function (sizeStr) {
        var bef = sizeStr.substr(-2, 1).toUpperCase();
        var flag = true;
        if (bef == 'M' || bef == 'G' || bef == 'T') {
            if (bef == 'M') {
                var size = parseFloat(sizeStr.substr(0, sizeStr.length - 2));
                if (size > 10) {
                    flag = false;
                }
            } else if (bef == 'G' || bef == 'T') {
                flag = false;
            }
        }
        return flag;
    },

    updateProgress: function (uploadId, fileName) {
        this.timer[uploadId] = setInterval(function () {
            $.ajax({
                type: "GET",
                url: '/uploadProgress.action?rnd=' + Math.random(),
                data: {uploadId: uploadId},
                dataType: "json",

                success: function (data) {
                    // 判定一下，如果已经显示了回调，这里就不再运行了
                    var fileItem = $('#fileItem' + uploadId);
                    var htmlText = fileItem.html();
                    if (htmlText != undefined && htmlText.indexOf('删除') == -1) {

                        var percent = parseFloat(data.object.uploadSize) / parseFloat(data.object.totalSize);

                        percent = Math.round(percent * 100);

                        var progressHtml = '<div class="fileName">' + fileName + '</div>';
                        progressHtml += '<div class="progress"><span style="width:' + percent + '%;"></span></div>'
                        progressHtml += '<div class="percent">' + percent + '%</div>';
                        progressHtml += '<div class="clear"></div>';

                        fileItem.html(progressHtml);
                    }
                }

            });
        }, 500);
    },

    initAttaches: function (attaches, ele ,flag) {
        var attaches_json = [];
        if (attaches) {
            attaches_json = eval('(' + attaches + ')');
        }
        if (ele == undefined || ele == '') {
            ele = 'fileList';
        }
        if (attaches_json.length) {
            for (var i in attaches_json) {
                var obj = attaches_json[i];
                obj.element = ele;
                var $fileItem = $('<div/>').attr('id', 'fileItem' + obj.uploadId);

                uploaderTool.upload.setFileItem($fileItem, uploaderTool.upload.createFileItemHtml({
                    data: obj,
                    isDel: flag.isDel,
                    isValidate: flag.isValidate
                }));
                $('#'+ele).append($fileItem);
            }

        } else {
            $('#'+ele).append('<span class="no-file">无上传的附件！</span>');
        }
    },

    showAttachDialog: function (ele) {
        if (ele == undefined || ele == '') {
            ele = 'fileList';
        }

        $(document).on('click', '#'+ele + ' img,video', function () {
            var src = $(this).attr('src'),
                originalName = uploaderTool.getSrcString(src, 'originalName'),
                suffix = originalName.substring(originalName.lastIndexOf('.') + 1, originalName.length).toLowerCase(),
                width = 800,
                height = 450;

            $.dialog({
                title: '预览',
                parent: window.parent,
                content: 'url:/module/after-service/maintain/common/dialog.html',
                relative: false,
                width: width,
                height: height,
                data: {
                    obj: {
                        src: src,
                        suffix: suffix,
                        width: width + 'px',
                        height: height + 'px'
                    },
                    callback: function (win) {
                        win.api.close();
                    }
                }
            });
        });
    }

};