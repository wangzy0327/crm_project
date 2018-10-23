var common = common || {};

common = {
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
        var r = src.substr(src.indexOf('?') + 1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
};

common.upload = {

    defaultOpts: {
        element: 'fileList',
        uploadBtn: '#upload',
        uploadCount: 10, // 默认上传文件个数
        isShow: false, // 是否提示上传文件个数
        hasDownload: true, // 是否显示下载按钮
        isDel: true, // 是否显示删除按钮
        isValidate: true, // 是否验证文件后缀
        dataStr: '[]', // 附件字符串
        maxSize: 25 // M
    },

    data: [],

    upload: function (opts) {
        this.defaultOpts = $.extend(true, this.defaultOpts, opts);

        if (this.defaultOpts.uploadCount == this.data.length || typeof($(this.defaultOpts.uploadBtn).attr('disabled')) != 'undefined') {
            if (this.defaultOpts.isShow) {
                $.alert("最多上传" + this.defaultOpts.uploadCount + "个文件！");
            }
        } else {
            common.upload.element = this.defaultOpts.element;
            var uploadId = this.createUploadForm(common.upload.element);
            $('#upload' + uploadId).trigger('click');
            return uploadId;
        }
    },

    // 返回上传数据
    getData: function () {
        if (this.data != null && this.data !== undefined) {
            return JSON.stringify(this.data);
        }
        return '';
    },

    deleteFile: function (fileName, element, opts) {
        var self = this;
        $.post('/deleteFile_child.action?rnd=' + Math.random(), {
            tkt: YT.getTicket(),
            fileName: fileName
        }, function (result) {
            var parent = $(element).parents('.fileItem');
            var uploadId = parent.attr('id');
            parent.remove();
            // 删除数据
            uploadId = uploadId.replace('fileItem', '');
            var index = common.indexOfArray(self.data, uploadId, 'uploadId');
            if (index != -1)
                self.data.splice(index, 1);

            // 删除按钮禁用样式
            if (self.defaultOpts.uploadCount != self.data.length) {
                self.setUploadBtnCss(0);
            }

            // 删除swiper元素
            if (window.module) {
                module.data.title = '';
                module.data.labelNames = [];
            }
            PageSwiperComm.resetDom();

            // 标题赋空
            $('#title').val('');

            if (200 == result.status) {
                $.alert(result.message);
            } else {
                $.alert(result.message);
            }
        });
    },

    uploadFile: function upload(uploadId, element) {

        var form = $('#form' + uploadId);
        var fileName = $('#upload' + uploadId).val();
        this.timer = this.timer || {};

        if (fileName != '' && fileName != undefined && this.checkSuffix(fileName)) {
            var fileItem = '', flag = true, fileInfo = document.getElementById('upload' + uploadId).files[0];

            if (fileInfo !== undefined) {
                if (!this.checkSuffix(fileInfo.name)) {
                    fileItem += '<label class="error" style="color: darkred;border: 0;">只允许上传PDF格式!</label>&nbsp;&nbsp;';
                    flag = false;
                }
                if (!this._checkSize(fileInfo.size)) {
                    fileItem += '<label class="error" style="color: darkred;border: 0;">只允许上传小于' + this.defaultOpts.maxSize + 'M的附件!</label>&nbsp;&nbsp;';
                    flag = false;
                }
            }

            if (flag) {
                //上传提交
                form.submit();

                //插入提示信息
                fileItem = '<div id="fileItem' + uploadId + '"><label>' + fileName + '&nbsp;&nbsp;上传中...</label></div>';
            }

            var fileList = $('#' + element);
            fileList.append(fileItem);

            if (flag) {
                //更新进度
                this.updateProgress(uploadId, fileName);
            }

        } else {
            $('#' + this.element).append('<label class="error" style="color: darkred;border: 0;">只允许上传PDF格式!</label>');
        }
    },

    createUploadForm: function (element) {

        //得到上传id
        var id = common.uuid();
        var actionUrl = '/uploadFile.action?rnd=' + Math.random() + '&tkt=' + YT.getTicket() + '&callback=common.upload.callback' + '&uploadId=' + id;
        var uploadForm = '<form id="form' + id + '" method="post" action="' + actionUrl + '" target="frame' + id + '" enctype="multipart/form-data">';
        uploadForm += '<input style="position: absolute; top:-1000px; left:-1000px;" id="upload' + id + '" type="file" name="upload' + id +
            '" onchange="common.upload.uploadFile(\'' + id + '\',\'' + element + '\');"/>';
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

        if (data.object.length) {
            var uploadId = data.object[0].uploadId;

            $('#form' + uploadId).remove();
            $('#frame' + uploadId).remove();

            clearInterval(this.timer[uploadId]);

            var fileItemHtml = this.createFileItemHtml({data: data.object[0]});

            this.setFileItem($('#fileItem' + uploadId), fileItemHtml);

            // 修改上传按钮为禁用
            if (this.defaultOpts.uploadCount == this.data.length) {
                this.setUploadBtnCss(1);
            } else {
                this.setUploadBtnCss(0);
            }

            $('#' + common.upload.element).trigger('uploaded');
        }
    },

    createFileItemHtml: function (params) {
        var obj = $.extend({
            data: [],           // 附件数据
            isDel: this.defaultOpts.isDel,        // 是否需要删除惭怍
            isValidate: this.defaultOpts.isValidate    // 是否验证
        }, params);
        var attach = obj.data;
        var savedFileName = attach.savedFileName;
        var uploadSimpleName = attach.uploadSimpleName;
        var fileSize = attach.fileSize;
        var tkt = YT.getTicket();
        var uploadSimpleNameLength = uploadSimpleName.length;
        var url = '/downloadFile.action?rnd=' + Math.random() + '&tkt=' + tkt + '&fileName=' + savedFileName + '&originalName=' + uploadSimpleName;
        var suffix = uploadSimpleName.substring(uploadSimpleName.lastIndexOf('.') + 1, uploadSimpleNameLength).toLowerCase();
        var displayName = uploadSimpleName.length > 15 ? uploadSimpleName.substring(0, 5) + '...' + uploadSimpleName.substring(uploadSimpleNameLength - suffix.length - 4, uploadSimpleNameLength) : uploadSimpleName;
        savedFileName = savedFileName.replace('\\', '\\\\');

        var fileItemHtml = '<label>' + displayName + '&nbsp;&nbsp;</label>';

        if (obj.hasDownload) {
            fileItemHtml += '<a href="\' + url + \'">下载(\' + fileSize + \')</a>';
        }

        if (obj.isDel) {
            fileItemHtml += '&nbsp;&nbsp;<a href="javascript:void(0)" class="del" onclick="common.upload.deleteFile(\'' + savedFileName + '\', this);">删除</a>';
        }

        this.data.push(attach);

        if (obj.isValidate) {
            if (!this.checkSuffix(uploadSimpleName)) {
                fileItemHtml += '<label class="error" style="color: darkred;border: 0;">只允许上传PDF格式!</label>&nbsp;&nbsp;';
            }
            if (!this.checkSize(fileSize)) {
                fileItemHtml += '<label class="error" style="color: darkred;border: 0;">只允许上传小于' + this.defaultOpts.maxSize + 'M的附件!</label>&nbsp;&nbsp;';
            }
        }

        fileItemHtml += '</ul>';

        // 创建swiper元素并初始化
        if (this.checkSuffix(uploadSimpleName)) {
            MessageComm.page.removePageWrapStatus();
            PageSwiperComm.init('#page-view', {d: attach, type: 'doc', url: ''}, 0);
        }

        return fileItemHtml;
    },

    setFileItem: function (ele, fileItemHtml) {
        ele.html(fileItemHtml).css({
            'display': 'inline-block'
        }).addClass('fileItem');
    },

    checkSuffix: function (fileName) {
        var suffix = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
        if (suffix == 'pdf'/* || suffix == 'ppt' || suffix == 'pptx'*/) {
            return true;
        } else {
            return false;
        }
    },

    _checkSize: function (fileSize) {
        return this.defaultOpts.maxSize * 1024 * 1024 > fileSize ? true : false;
    },

    checkSize: function (sizeStr) {
        var bef = sizeStr.substr(-2, 1).toUpperCase();
        var flag = true;
        if (bef == 'M' || bef == 'G' || bef == 'T') {
            if (bef == 'M') {
                var size = parseFloat(sizeStr.substr(0, sizeStr.length - 2));
                if (size > this.defaultOpts.maxSize) {
                    flag = false;
                }
            } else if (bef == 'G' || bef == 'T') {
                flag = false;
            }
        }
        return flag;
    },

    updateProgress: function (uploadId, fileName) {

        var progress = 15;

        this.setUploadBtnCss(1);

        this.timer[uploadId] = setInterval(function () {
            $.ajax({
                type: "GET",
                url: '/uploadProgressFile.action?rnd=' + Math.random(),
                data: {uploadId: uploadId},
                dataType: "json",

                success: function (data) {
                    // 判定一下，如果已经显示了回调，这里就不再运行了
                    var fileItem = $('#fileItem' + uploadId);
                    var htmlText = fileItem.html();
                    if (htmlText != undefined && htmlText.indexOf('删除') == -1) {

                        var progressHtml = '<div class="container-file">', item = data.object;

                        if (null != item) {
                            var rate = item.rate, imgNum = item.imgNum, totalImgNum = item.totalImgNum;
                            rate = rate > progress ? rate : progress;
                            if (rate === 100) {
                                if (imgNum === '-' && totalImgNum === '-') {
                                    progressHtml += '<div class="progress-file"><span class="blue" style="width:99%;">99%</span></div>';
                                } else {
                                    progressHtml += '<label style="color: #428bca;">转换中...（' + imgNum + '/' + totalImgNum + '）</label>';
                                }
                            } else {
                                progressHtml += '<div class="progress-file"><span class="blue" style="width:' + rate + '%;">' + rate + '%</span></div>';
                            }
                        } else {
                            progressHtml += '<div class="progress-file"><span class="blue" style="width:' + progress + '%;">' + progress + '%</span></div>';
                        }
                        progressHtml += '</div>';

                        fileItem.html(progressHtml);
                    }
                }

            });
        }, 500);
    },

    initAttaches: function (opts) {
        this.defaultOpts = $.extend(true, this.defaultOpts, opts);

        var dataStr = this.defaultOpts.dataStr,
            attaches_json = eval('(' + dataStr + ')'),
            ele = '#' + this.defaultOpts.element;

        if (attaches_json.length) {
            for (var i in attaches_json) {
                var obj = attaches_json[i];
                var $fileItem = $('<div/>').attr('id', 'fileItem' + obj.uploadId);

                common.upload.setFileItem($fileItem, common.upload.createFileItemHtml({
                    data: obj
                }));
                $(ele).append($fileItem);
            }

            // 设置上传按钮样式
            if (this.defaultOpts.uploadCount == this.data.length) {
                this.setUploadBtnCss(1);
            }

        } else {
            // $(ele).append('无上传的附件！');
        }
    },

    setUploadBtnCss: function (isDisabled) {
        if (isDisabled) {
            $(this.defaultOpts.uploadBtn).css({
                "border": "1px solid #eaeaea",
                "color": "#ccc",
                "background": "#fff",
                "cursor": "not-allowed"
            }).attr("disabled", "disabled");
        } else {
            $(this.defaultOpts.uploadBtn).removeAttr('style disabled');
        }
    }

};
