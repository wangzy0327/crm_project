package com.wzy.crm.service;

import com.wzy.crm.common.UploadFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IFileService {
    //通过路径获得上传文件的路径
    String uploadImg(MultipartFile file, String path);

    //上传pdf
    List<UploadFile> uploadPdf(MultipartFile file, String path);
}
