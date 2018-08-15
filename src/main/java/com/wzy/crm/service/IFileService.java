package com.wzy.crm.service;

import org.springframework.web.multipart.MultipartFile;

public interface IFileService {
    ////通过路径获得上传文件的路径
    String upload(MultipartFile file, String path);
}
