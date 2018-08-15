package com.wzy.crm.controller;

import ch.qos.logback.classic.gaffer.PropertyUtil;
import com.google.common.collect.Maps;
import com.wzy.crm.service.IFileService;
import com.wzy.crm.utils.PropertiesUtil;
import com.wzy.crm.vo.ServerResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
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
    @RequestMapping(value = "/save", produces = {"application/json"})
    public ServerResponse upload( @RequestParam MultipartFile file,HttpServletRequest request) throws IOException {
        //获取文件名
        String originalFilename = file.getOriginalFilename();
        System.out.println("文件名："+originalFilename);

        if(file.isEmpty()){
            System.out.println("文件是空!!!");
        }
        String filePath = request.getSession().getServletContext().getRealPath("imgupload/");
        System.out.println("filePath:"+filePath);
        String targetFileName = fileService.upload(file,filePath);
        String url = PropertiesUtil.getProperty("ftp.server.http.prefix")+targetFileName;

        //初始化返回信息
        Map fileMap = Maps.newHashMap();
        fileMap.put("targetFileName",targetFileName);
        fileMap.put("url",url);
        return ServerResponse.createBySuccess(fileMap);
    }

}
