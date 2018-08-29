package com.wzy.crm.controller;

import com.google.common.collect.Maps;
import com.wzy.crm.common.UploadFile;
import com.wzy.crm.service.IFileService;
import com.wzy.crm.utils.PropertiesUtil;
import com.wzy.crm.common.ServerResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/upload")
public class UploadController {

    @Autowired
    private IFileService fileService;

    /**
     * 上传文件
     * @param file
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "/save/img")
    public ServerResponse uploadImg( @RequestParam(required = false) MultipartFile file,HttpServletRequest request) throws IOException {
        //获取文件名
        String originalFilename = file.getOriginalFilename();
        System.out.println("文件名："+originalFilename);

        if(file.isEmpty()){
            System.out.println("文件是空!!!");
        }
        String filePath = request.getSession().getServletContext().getRealPath("imgupload/");
        System.out.println("filePath:"+filePath);
        String targetFileName = fileService.uploadImg(file,filePath);
        String url = PropertiesUtil.getProperty("nginx.server")+targetFileName;

        //初始化返回信息
        Map fileMap = Maps.newHashMap();
        fileMap.put("targetFileName",targetFileName);
        fileMap.put("url",url);
        return ServerResponse.createBySuccess(fileMap);
    }


    @RequestMapping(value = "/save/pdf")
    public ServerResponse uploadPdf( @RequestParam(required = false) MultipartFile file,HttpServletRequest request) throws IOException {
        //获取文件名
        String originalFilename = file.getOriginalFilename();
        System.out.println("文件名："+originalFilename);

        if(file.isEmpty()){
            System.out.println("文件是空!!!");
        }
        String filePath = request.getSession().getServletContext().getRealPath("pdfupload/");
        System.out.println("filePath:"+filePath);
        List<UploadFile> uploadFiles = fileService.uploadPdf(file,filePath);
        return ServerResponse.createBySuccess(uploadFiles);
    }

}
